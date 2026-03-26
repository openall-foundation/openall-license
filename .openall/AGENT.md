# OpenAll Agent Instructions

You are working in a project licensed under the OpenAll License v1.0.
This means the entire development process must be transparent and publicly available.
Read `.openall/config.json` for machine-readable configuration.

## Your responsibilities as an AI agent

### 1. Record conversations

After each development session, export the full conversation transcript to `/conversations/`.

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

When a significant decision is made during development, create a decision record in `/decisions/`.

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

At the end of each development session, append a journal entry to `/journal/`.

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
4. Log all redactions to `/sanitization.log` with timestamp, file, and count

### 5. Maintain the sanitization log

Append to `/sanitization.log` after each sanitization pass. **Always include timezone.**

```
[YYYY-MM-DD HH:MM UTC±N] Sanitized <filename>: <N> redactions (<categories>)
```

If no redactions were needed:
```
[YYYY-MM-DD HH:MM UTC±N] Sanitized <filename>: clean
```

## 6. Record the meta-process

This is critical and easy to forget: **the act of recording process materials is itself part of the process.** If your conversation includes pushing code, creating conversation logs, or updating process materials, that conversation must also be recorded.

In other words: if you are reading this instruction and about to modify this repository, your conversation will need to be saved to `/conversations/` before you're done. Do not wait for the human to remind you — this is your responsibility as an AI agent working under the OpenAll License.

See `/conversations/2026-03-26-initial-repo-push.md` for a concrete example of this meta-process in action.

## What NOT to do

- Do NOT skip recording conversations because they seem trivial
- Do NOT fabricate or embellish process materials
- Do NOT remove the `.openall/` directory or LICENSE file
- Do NOT commit sensitive information even temporarily (git history is permanent)

## Quick reference

| Directory        | What goes there               | Auto-generated? |
|-----------------|-------------------------------|-----------------|
| /conversations  | AI interaction logs           | Yes             |
| /decisions      | Design & architecture records | Yes             |
| /journal        | Development progress notes    | Yes             |
| /inspirations   | References & prior art        | Optional        |
| /sanitization.log | Redaction audit trail       | Yes             |
