#!/bin/bash
# OpenAll compliance hook for Claude Code
# Blocks git commit if no conversation log is staged in the same commit.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only check git commit commands
if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

# Check if any conversation log file is staged
if git diff --cached --name-only 2>/dev/null | grep -q "process/conversations/"; then
  exit 0
fi

cat >&2 << 'EOF'
BLOCKED: OpenAll requires conversation logs in every commit.

Stage a conversation log file before committing:
  git add process/conversations/YYYY-MM-DD-description.md

See .openall/AGENT.md §6 for details.
EOF
exit 2
