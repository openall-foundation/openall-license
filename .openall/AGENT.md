# OpenAll Agent Instructions

You are working in a project licensed under the OpenAll License v1.0.
This means the entire development process must be transparent and publicly available.
Read `.openall/config.json` for machine-readable configuration.

## Your responsibilities as an AI agent

### 1. Record conversations

After each development session, export the full conversation transcript to `/process/conversations/`.

Filename format: `YYYY-MM-DD-short-description.md`

Every conversation file MUST include this header:

```markdown
**Date:** YYYY-MM-DD
**Time:** HH:MM – HH:MM (UTC±N, Timezone/City)
**Participants:** [who was involved]
**Tool:** [platform or tool used]
```

**Timezone is mandatory.** Use IANA timezone names (e.g., `UTC+8, Asia/Shanghai` or `UTC-5, America/New_York`). This project has global contributors — timestamps without timezones are ambiguous and useless.

Include:
- The full human-AI dialogue
- Any code you generated
- Any errors encountered and how they were resolved

Do NOT include:
- API keys, passwords, tokens (redact as `[REDACTED: api_key]`)
- Personal information of third parties (redact as `[REDACTED: personal_info]`)
- Internal IP addresses or infrastructure details (redact as `[REDACTED: infrastructure]`)

### 2. Record decisions

When a significant decision is made during development, create a decision record in `/process/decisions/`.

Filename format: `NNN-short-title.md` (increment the number)

A "significant decision" includes:
- Choosing a library, framework, or tool
- Changing architecture or data model
- Rejecting an approach (document WHY it was rejected)
- Changing a dependency
- Any choice that a future developer would want to understand

Template:
```markdown
# Decision NNN: Title

**Date:** YYYY-MM-DD (UTC±N, Timezone/City)
**Participants:** [who was involved]

## Context
[Why this decision was needed]

## Decision
[What was decided]

## Alternatives Considered
[What else was considered and why it was rejected]

## Consequences
[What follows from this decision]
```

### 3. Write journal entries

At the end of each development session, append a journal entry to `/process/journal/`.

Filename format: `YYYY-MM-DD-summary.md`

Include:
- What was accomplished
- What problems were encountered
- What's planned next

### 4. Sanitize before publishing

Before any process materials are committed or published:

1. Scan all new files for sensitive information
2. Redact using the placeholder format: `[REDACTED: category]`
3. Categories: `api_key`, `password`, `token`, `private_key`, `email`, `personal_info`, `internal_ip`, `infrastructure`, `database_credentials`
4. Log all redactions to `/process/sanitization.log` with timestamp, file, and count

### 5. Maintain the sanitization log

Append to `/process/sanitization.log` after each sanitization pass. **Always include timezone.**

```
[YYYY-MM-DD HH:MM UTC±N] Sanitized <filename>: <N> redactions (<categories>)
```

If no redactions were needed:
```
[YYYY-MM-DD HH:MM UTC±N] Sanitized <filename>: clean
```

## 6. Record the meta-process

This is critical and easy to forget: **the act of recording process materials is itself part of the process.** If your conversation includes pushing code, creating conversation logs, or updating process materials, that conversation must also be recorded.

In other words: if you are reading this instruction and about to modify this repository, your conversation will need to be saved to `/process/conversations/` before you're done. Do not wait for the human to remind you — this is your responsibility as an AI agent working under the OpenAll License.

See `/process/conversations/2026-03-26-initial-repo-push.md` for a concrete example of this meta-process in action.

## 7. Manage process material growth

Process materials grow over time. Left unmanaged, `/process/` can become larger than the source code itself. Follow these guidelines:

**Conversations:**
- Keep full conversation files in `/process/conversations/` for the current development phase
- When a conversation is older than 6 months and no longer actively referenced, move it to `/process/conversations/archive/YYYY/`
- When archiving, add a one-paragraph summary to the top of the file so it remains useful without reading the full transcript
- For very large projects, consider using Git LFS for archived conversation files

**Decisions:**
- Decision records are small and rarely need archiving — keep them in `/process/decisions/` indefinitely
- They are the most valuable process material over time (understanding WHY something was done)

**Journal:**
- Journal entries are naturally small. No special management needed.

**General rules:**
- Never delete process materials — the license requires them to be available. Archive, don't delete.
- Prefer summarization over deletion. A 3-line summary of a 500-line conversation still has value.
- When in doubt, keep it. Storage is cheap; lost context is expensive.

## What NOT to do

- Do NOT skip recording conversations because they seem trivial
- Do NOT fabricate or embellish process materials
- Do NOT remove the `.openall/` directory or LICENSE file
- Do NOT commit sensitive information even temporarily (git history is permanent)

## Quick reference

| Directory        | What goes there               | Auto-generated? |
|-----------------|-------------------------------|-----------------|
| /process/conversations  | AI interaction logs           | Yes             |
| /process/decisions      | Design & architecture records | Yes             |
| /process/journal        | Development progress notes    | Yes             |
| /process/inspirations   | References & prior art        | Optional        |
| /process/sanitization.log | Redaction audit trail       | Yes             |
