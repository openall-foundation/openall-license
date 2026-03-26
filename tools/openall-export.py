#!/usr/bin/env python3
"""
openall-export: Convert Claude Code session logs into OpenAll /process format.

Reads .jsonl session files from ~/.claude/projects/ and outputs clean,
sanitized Markdown conversation logs compatible with the OpenAll License
/process/conversations/ directory structure.

Usage:
    python openall-export.py                          # interactive session picker
    python openall-export.py --session <session-id>   # export specific session
    python openall-export.py --project <project-path> # export all sessions for a project
    python openall-export.py --all                    # export everything
    python openall-export.py --list                   # list available sessions

Options:
    -o, --output <dir>    Output directory (default: ./process)
    --no-sanitize         Skip sanitization step
    --include-tools       Include full tool use details (default: summarized)
    --dry-run             Preview without writing files
"""

import json
import os
import re
import sys
import argparse
import glob
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict


# --- Sanitization patterns ---

SANITIZE_PATTERNS = [
    # API keys and tokens
    (r'(?i)(api[_-]?key|apikey|api[_-]?token)\s*[=:]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?',
     r'\1=***REDACTED_API_KEY***'),
    (r'(?i)(secret[_-]?key|client[_-]?secret)\s*[=:]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?',
     r'\1=***REDACTED_SECRET***'),
    (r'(?i)(password|passwd|pwd)\s*[=:]\s*["\']?([^\s"\']{8,})["\']?',
     r'\1=***REDACTED_PASSWORD***'),
    # Bearer tokens
    (r'(?i)(bearer\s+)([a-zA-Z0-9_\-\.]{20,})', r'\1***REDACTED_TOKEN***'),
    # AWS keys
    (r'AKIA[0-9A-Z]{16}', '***REDACTED_AWS_KEY***'),
    # Private keys
    (r'-----BEGIN\s+(RSA\s+)?PRIVATE KEY-----[\s\S]*?-----END\s+(RSA\s+)?PRIVATE KEY-----',
     '***REDACTED_PRIVATE_KEY***'),
    # SSH keys
    (r'ssh-(rsa|ed25519|ecdsa)\s+[A-Za-z0-9+/=]{40,}', '***REDACTED_SSH_KEY***'),
    # JWT tokens
    (r'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}',
     '***REDACTED_JWT***'),
    # Generic hex secrets (32+ chars)
    (r'(?i)(token|secret|key|hash)\s*[=:]\s*["\']?([0-9a-f]{32,})["\']?',
     r'\1=***REDACTED_HEX***'),
    # Email addresses (partial redaction)
    (r'([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
     r'***@\2'),
    # IPv4 addresses (internal ranges)
    (r'\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3})\b', '***REDACTED_INTERNAL_IP***'),
    (r'\b(192\.168\.\d{1,3}\.\d{1,3})\b', '***REDACTED_INTERNAL_IP***'),
    (r'\b(172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3})\b', '***REDACTED_INTERNAL_IP***'),
]


class SanitizationLog:
    def __init__(self):
        self.redactions = defaultdict(int)
        self.total = 0

    def record(self, category: str, count: int = 1):
        self.redactions[category] += count
        self.total += count

    def summary(self) -> str:
        if self.total == 0:
            return "No sensitive information detected."
        lines = [f"Total redactions: {self.total}", ""]
        for cat, count in sorted(self.redactions.items()):
            lines.append(f"  - {cat}: {count}")
        return "\n".join(lines)


def sanitize(text: str, log: SanitizationLog) -> str:
    """Apply sanitization patterns to text."""
    for pattern, replacement in SANITIZE_PATTERNS:
        matches = re.findall(pattern, text)
        if matches:
            category = replacement.split("***")[1] if "***" in replacement else "other"
            log.record(category, len(matches))
            text = re.sub(pattern, replacement, text)
    return text


def find_claude_dir() -> Path:
    """Find the ~/.claude directory."""
    claude_dir = Path.home() / ".claude"
    if not claude_dir.exists():
        print("Error: ~/.claude directory not found. Is Claude Code installed?", file=sys.stderr)
        sys.exit(1)
    return claude_dir


def find_projects(claude_dir: Path) -> dict:
    """Find all projects with session files."""
    projects_dir = claude_dir / "projects"
    if not projects_dir.exists():
        return {}

    projects = {}
    for project_dir in sorted(projects_dir.iterdir()):
        if not project_dir.is_dir():
            continue
        sessions = list(project_dir.glob("*.jsonl"))
        if sessions:
            # Decode project path from directory name
            name = project_dir.name.replace("-", "/")
            projects[project_dir.name] = {
                "path": project_dir,
                "decoded_name": name,
                "sessions": sessions,
            }
    return projects


def parse_session(jsonl_path: Path) -> dict:
    """Parse a .jsonl session file into structured data."""
    messages = []
    metadata = {
        "session_id": jsonl_path.stem,
        "file": str(jsonl_path),
    }

    with open(jsonl_path, "r") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue

            # Extract metadata from first user message
            if not metadata.get("cwd") and entry.get("cwd"):
                metadata["cwd"] = entry["cwd"]
            if not metadata.get("version") and entry.get("version"):
                metadata["version"] = entry["version"]
            if not metadata.get("start_time") and entry.get("timestamp"):
                metadata["start_time"] = entry["timestamp"]
            if entry.get("timestamp"):
                metadata["end_time"] = entry["timestamp"]
            if entry.get("slug") and not metadata.get("slug"):
                metadata["slug"] = entry["slug"]
            if entry.get("gitBranch") and not metadata.get("git_branch"):
                metadata["git_branch"] = entry["gitBranch"]

            entry_type = entry.get("type")
            msg = entry.get("message", {})

            if entry_type == "user" and msg.get("role") == "user":
                content = msg.get("content", "")
                # User typed text
                if isinstance(content, str) and content.strip():
                    messages.append({
                        "role": "human",
                        "content": content,
                        "timestamp": entry.get("timestamp"),
                    })
                # Tool results - skip (they're internal plumbing)

            elif entry_type == "assistant" and msg.get("role") == "assistant":
                content_blocks = msg.get("content", [])
                if not isinstance(content_blocks, list):
                    continue

                for block in content_blocks:
                    block_type = block.get("type")

                    if block_type == "text" and block.get("text", "").strip():
                        messages.append({
                            "role": "assistant",
                            "content": block["text"],
                            "timestamp": entry.get("timestamp"),
                            "model": msg.get("model", "unknown"),
                        })

                    elif block_type == "tool_use":
                        tool_name = block.get("name", "unknown")
                        tool_input = block.get("input", {})
                        # Summarize tool use
                        summary = summarize_tool_use(tool_name, tool_input)
                        if summary:
                            messages.append({
                                "role": "tool",
                                "tool": tool_name,
                                "summary": summary,
                                "timestamp": entry.get("timestamp"),
                            })

    return {"metadata": metadata, "messages": messages}


def summarize_tool_use(tool_name: str, tool_input: dict) -> str:
    """Create a one-line summary of a tool use."""
    if tool_name == "Bash":
        cmd = tool_input.get("command", "")
        desc = tool_input.get("description", "")
        return desc if desc else (cmd[:80] + "..." if len(cmd) > 80 else cmd)
    elif tool_name == "Read":
        return f"Read {tool_input.get('file_path', '?')}"
    elif tool_name == "Write":
        return f"Write {tool_input.get('file_path', '?')}"
    elif tool_name == "Edit":
        return f"Edit {tool_input.get('file_path', '?')}"
    elif tool_name == "Glob":
        return f"Search files: {tool_input.get('pattern', '?')}"
    elif tool_name == "Grep":
        return f"Search content: {tool_input.get('pattern', '?')}"
    elif tool_name in ("WebFetch", "WebSearch"):
        url = tool_input.get("url", tool_input.get("query", "?"))
        return f"{tool_name}: {url}"
    elif tool_name == "Agent":
        return f"Spawned agent: {tool_input.get('description', '?')}"
    else:
        return f"{tool_name}"


def format_conversation(session: dict, include_tools: bool = False) -> str:
    """Format a parsed session into clean Markdown."""
    meta = session["metadata"]
    messages = session["messages"]

    if not messages:
        return ""

    # Header
    lines = []
    lines.append(f"# Conversation: {meta.get('slug', meta['session_id'])}")
    lines.append("")

    start = meta.get("start_time", "")
    end = meta.get("end_time", "")
    if start:
        try:
            dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
            lines.append(f"**Date:** {dt.strftime('%Y-%m-%d')}")
            lines.append(f"**Time:** {dt.strftime('%H:%M')} UTC", )
        except (ValueError, AttributeError):
            pass

    if meta.get("cwd"):
        lines.append(f"**Project:** `{meta['cwd']}`")
    if meta.get("git_branch"):
        lines.append(f"**Branch:** `{meta['git_branch']}`")

    model = None
    for m in messages:
        if m.get("model"):
            model = m["model"]
            break
    if model:
        lines.append(f"**Model:** {model}")
    lines.append(f"**Claude Code version:** {meta.get('version', 'unknown')}")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Messages
    prev_role = None
    for msg in messages:
        role = msg["role"]

        if role == "human":
            lines.append(f"**Human:** {msg['content']}")
            lines.append("")
            prev_role = role

        elif role == "assistant":
            lines.append(f"**Claude:** {msg['content']}")
            lines.append("")
            prev_role = role

        elif role == "tool" and include_tools:
            lines.append(f"> *[{msg['tool']}]* {msg['summary']}")
            lines.append("")

        elif role == "tool" and not include_tools:
            # Compact: only show tools if between human/assistant turns
            if prev_role == "assistant":
                lines.append(f"> *{msg['summary']}*")
                lines.append("")

    return "\n".join(lines)


def list_sessions(projects: dict):
    """Print available sessions."""
    for proj_key, proj in projects.items():
        print(f"\n{'=' * 60}")
        print(f"Project: {proj['decoded_name']}")
        print(f"  Path: {proj['path']}")
        print(f"  Sessions: {len(proj['sessions'])}")

        for session_file in sorted(proj["sessions"], key=lambda p: p.stat().st_mtime, reverse=True):
            mtime = datetime.fromtimestamp(session_file.stat().st_mtime)
            size_kb = session_file.stat().st_size / 1024
            # Try to get slug from first few lines
            slug = session_file.stem
            try:
                with open(session_file) as f:
                    for line in f:
                        entry = json.loads(line)
                        if entry.get("slug"):
                            slug = entry["slug"]
                            break
                        # Only scan first 20 lines
                        if f.tell() > 5000:
                            break
            except (json.JSONDecodeError, IOError):
                pass

            print(f"    [{mtime.strftime('%Y-%m-%d %H:%M')}] {slug} ({size_kb:.0f}KB)")


def interactive_picker(projects: dict) -> list:
    """Simple interactive session picker."""
    all_sessions = []
    for proj_key, proj in projects.items():
        for sf in proj["sessions"]:
            all_sessions.append((proj["decoded_name"], sf))

    # Sort by mtime descending
    all_sessions.sort(key=lambda x: x[1].stat().st_mtime, reverse=True)

    print("\nAvailable sessions (most recent first):\n")
    for i, (proj_name, sf) in enumerate(all_sessions[:20]):
        mtime = datetime.fromtimestamp(sf.stat().st_mtime)
        size_kb = sf.stat().st_size / 1024
        slug = sf.stem[:30]
        try:
            with open(sf) as f:
                for line in f:
                    entry = json.loads(line)
                    if entry.get("slug"):
                        slug = entry["slug"]
                        break
                    if f.tell() > 5000:
                        break
        except (json.JSONDecodeError, IOError):
            pass

        proj_short = proj_name.split("/")[-1] if "/" in proj_name else proj_name
        print(f"  [{i}] {mtime.strftime('%m-%d %H:%M')} | {proj_short:20s} | {slug} ({size_kb:.0f}KB)")

    print()
    selection = input("Select session(s) to export (comma-separated numbers, or 'all'): ").strip()

    if selection.lower() == "all":
        return [sf for _, sf in all_sessions]

    indices = []
    for part in selection.split(","):
        part = part.strip()
        if part.isdigit() and int(part) < len(all_sessions):
            indices.append(int(part))

    return [all_sessions[i][1] for i in indices]


def export_session(session_file: Path, output_dir: Path, sanitize_enabled: bool,
                   include_tools: bool, dry_run: bool) -> tuple:
    """Export a single session. Returns (output_path, sanitization_log)."""
    san_log = SanitizationLog()

    session = parse_session(session_file)
    if not session["messages"]:
        return None, san_log

    markdown = format_conversation(session, include_tools=include_tools)
    if not markdown:
        return None, san_log

    if sanitize_enabled:
        markdown = sanitize(markdown, san_log)

    # Determine filename
    start = session["metadata"].get("start_time", "")
    slug = session["metadata"].get("slug", session["metadata"]["session_id"][:8])
    try:
        dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
        date_str = dt.strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        date_str = datetime.now().strftime("%Y-%m-%d")

    filename = f"{date_str}-{slug}.md"
    output_path = output_dir / "conversations" / filename

    if dry_run:
        print(f"\n[DRY RUN] Would write: {output_path}")
        print(f"  Messages: {len(session['messages'])}")
        print(f"  Sanitization: {san_log.summary()}")
        # Show first few lines
        preview = markdown[:500]
        print(f"  Preview:\n{preview}\n  ...")
    else:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w") as f:
            f.write(markdown)
        print(f"  Exported: {output_path}")

    return output_path, san_log


def main():
    parser = argparse.ArgumentParser(
        description="Export Claude Code sessions to OpenAll /process format",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--session", "-s", help="Export specific session by ID")
    parser.add_argument("--project", "-p", help="Export all sessions for a project path")
    parser.add_argument("--all", "-a", action="store_true", help="Export all sessions")
    parser.add_argument("--list", "-l", action="store_true", help="List available sessions")
    parser.add_argument("--output", "-o", default="./process", help="Output directory (default: ./process)")
    parser.add_argument("--no-sanitize", action="store_true", help="Skip sanitization")
    parser.add_argument("--include-tools", action="store_true", help="Include full tool use details")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")

    args = parser.parse_args()

    claude_dir = find_claude_dir()
    projects = find_projects(claude_dir)

    if not projects:
        print("No Claude Code sessions found.", file=sys.stderr)
        sys.exit(1)

    if args.list:
        list_sessions(projects)
        sys.exit(0)

    # Determine which sessions to export
    session_files = []

    if args.session:
        # Find by session ID
        for proj in projects.values():
            for sf in proj["sessions"]:
                if args.session in sf.stem:
                    session_files.append(sf)
        if not session_files:
            print(f"Session not found: {args.session}", file=sys.stderr)
            sys.exit(1)

    elif args.project:
        # Find by project path
        target = args.project.replace("/", "-").replace("~", "").lstrip("-")
        for proj_key, proj in projects.items():
            if target in proj_key or args.project in proj["decoded_name"]:
                session_files.extend(proj["sessions"])
        if not session_files:
            print(f"No sessions found for project: {args.project}", file=sys.stderr)
            sys.exit(1)

    elif args.all:
        for proj in projects.values():
            session_files.extend(proj["sessions"])

    else:
        # Interactive picker
        session_files = interactive_picker(projects)

    if not session_files:
        print("No sessions selected.")
        sys.exit(0)

    # Export
    output_dir = Path(args.output)
    total_san_log = SanitizationLog()
    exported = 0

    print(f"\nExporting {len(session_files)} session(s) to {output_dir}/conversations/\n")

    for sf in session_files:
        path, san_log = export_session(
            sf, output_dir,
            sanitize_enabled=not args.no_sanitize,
            include_tools=args.include_tools,
            dry_run=args.dry_run,
        )
        if path:
            exported += 1
            for cat, count in san_log.redactions.items():
                total_san_log.record(cat, count)

    # Write sanitization log
    if not args.dry_run and exported > 0:
        san_log_path = output_dir / "sanitization.log"
        with open(san_log_path, "a") as f:
            f.write(f"\n--- Export: {datetime.now().isoformat()} ---\n")
            f.write(f"Sessions exported: {exported}\n")
            f.write(total_san_log.summary())
            f.write("\n")

    print(f"\nDone. Exported {exported} session(s).")
    if total_san_log.total > 0:
        print(f"Sanitization: {total_san_log.total} redaction(s) applied.")


if __name__ == "__main__":
    main()
