# Decision 004: Consolidate Process Materials + AI Independent Reviewer Role

**Date:** 2026-03-26 (UTC+8, Asia/Shanghai)
**Participants:** Founder (Zhang Yiyi), Claude (Anthropic, Claude Opus 4.6)

## Context

Two issues raised in the same session:

1. **Directory clutter.** The root directory had 4 process-material directories + a log file mixed with source code and config files. The founder said: "这些东西放在根目录上太丑了，应该再好好设计一下" (these things in the root directory are too ugly, should be better designed).

2. **AI governance role.** The founder expressed that AI should have more governance power because "虽然ai也有偏见，但是总的而言目前看来ai比任何人类都要公平一些" (although AI has biases, overall AI currently appears more fair than any human). Claude raised counterpoints (AI isn't one entity, AI has no skin in the game, AI fairness can be weaponized via prompts) and proposed an alternative.

## Decisions

### A. Move all process materials under `/process/`

Before:
```
/conversations/
/decisions/
/journal/
/inspirations/
/sanitization.log
```

After:
```
/process/
  /conversations/
  /decisions/
  /journal/
  /inspirations/
  /sanitization.log
```

### B. Add AI Independent Reviewer role (§8.5)

Rather than giving AI higher voting weight, give AI a unique institutional role: every proposed amendment must be independently reviewed by at least one AI system, assessing for logical consistency, unintended consequences, historical precedent, and fairness. The review is advisory — it informs but does not override human/community decisions.

## Alternatives Considered

### For directory structure:
- **Put everything under `.openall/`** — Rejected because dot-directories are hidden by default. OpenAll's point is visibility, not concealment.
- **Keep flat structure** — Rejected by the founder as too messy for adoption.

### For AI governance:
- **Give AI voting weight** — Rejected because "who chooses which AI" is itself a human power decision, and AI assessments can be manipulated via prompt engineering.
- **AI as final decision-maker** — Rejected because AI has no stake in the consequences. Fairness without accountability is incomplete.
- **No special AI role** — Rejected because it wastes AI's genuine strengths (comprehensive analysis, no personal interest).

## Consequences

- All path references across LICENSE, App.jsx, AGENT.md, config.json, CLAUDE.md, and README.md updated
- Adopters of OpenAll now only need to add one directory (`/process/`) instead of four
- The AI reviewer role is the first formal institutional role for AI in any open source license (to our knowledge)
- Future governance charter must specify how AI reviews are conducted and published
