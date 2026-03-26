# Conversation: Remove Copyleft from OpenAll License

**Date:** 2026-03-27
**Time:** ~afternoon (UTC+8, Asia/Shanghai)
**Participants:** Founder (Zhang Yiyi), Claude (Anthropic, Claude Opus 4.6)
**Tool:** Claude Code CLI

> **Note:** This conversation record documents the decision to remove the copyleft clause from the OpenAll License v1.0, making it fully permissive.

---

## Context

The founder had discussed with another Claude instance and concluded that the copyleft requirement (Section 6.1 — "Any Derivative Work must be distributed under this same License") was not appropriate for the OpenAll License. The copyleft mechanism creates adoption friction for projects with mixed licensing or corporate policies, working against the goal of widespread adoption of process transparency.

---

## Transcript

### Discovery and Decision

**Human:** 我没注意到这个项目是copyleft的啊。和另一个claude聊了一下感觉不合适，改一下吧

**Claude:** Identified the copyleft clauses: Section 6.1 (legal text) and "Same License Forward" (human-readable summary). Asked for clarification on direction:
1. Fully permissive — derivative works can use any license
2. Weak copyleft — no same-license requirement but still require Process Transparency
3. Other approach

**Human:** 这样，我们不要copyleft。改一下整个项目并git吧

**Claude:** Made the following changes across the project:

**LICENSE (legal text):**
- Removed "Same License Forward" from the human-readable summary
- Rewrote Section 6 (Derivative Works):
  - 6.1: "Derivative Works may be created and distributed under any license terms of Your choosing, provided that the attribution requirements of Section 5 are met."
  - 6.2: "For the avoidance of doubt, this License does not require Derivative Works to adopt the OpenAll License or to comply with the Process Transparency and Automatic Sanitization obligations of Sections 3 and 4."

**src/App.jsx (website):**
- Updated LICENSE_SECTIONS data to match new Section 6 text
- Removed "Same License Forward" bullet from the human-readable summary conditions list

**process/decisions/001-license-design-philosophy.md:**
- Changed principle 5 from "Copyleft Forward" to "Permissive Forward"
- Reversed the Alternatives Considered: copyleft (GPL-style) is now the rejected alternative, with rationale about adoption friction

**process/inspirations/references.md:**
- Updated GPL/Copyleft tradition entry to reflect that copyleft was studied but rejected

**linkedin-article.md:**
- Removed reference to "why we chose copyleft" from the design decisions listing

Committed all changes in one commit.

### Emphasizing Permissive Nature

**Human:** 在网页上也可以强调一下这个不是copyleft的。然后这些聊天也需要进新的聊天记录记录，然后git上去

**Claude:** Added a highlighted callout box in the license summary section of the website (App.jsx) — a green-tinted note between the conditions list and "Zero developer effort" that reads: "Not copyleft. Derivative works may use any license of your choosing. OpenAll does not require downstream projects to adopt this license — only attribution."

Created this conversation record at `/process/conversations/2026-03-27-remove-copyleft.md`.

---

## Key Decisions Made

1. **Remove copyleft entirely** — OpenAll is now fully permissive. Derivative works can use any license.
2. **Attribution-only requirement for derivatives** — The only obligation that carries to derivative works is Section 5 (Attribution).
3. **Process Transparency is opt-in for derivatives** — Downstream projects are explicitly not required to comply with Sections 3 (Process Transparency) and 4 (Automatic Sanitization).
4. **Rationale:** Copyleft creates adoption friction (mixed licensing, corporate policies) that works against the goal of widespread process transparency adoption. Better to lead by example than force compliance.

---

## Sanitization

No sensitive information was present in this conversation. No redactions were necessary.
