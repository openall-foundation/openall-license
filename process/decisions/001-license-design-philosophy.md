# Decision 001: License Design Philosophy

**Date:** 2026-03-26
**Status:** Accepted
**Participants:** Human founder, Claude (Anthropic)

## Context

We set out to create a new open source license that goes beyond traditional code-level openness. The core observation: in the age of AI-assisted development, code alone no longer tells the full story of how software was built.

## Decision

Create the OpenAll License with these core principles:

1. **Process Transparency** — Require public disclosure of the entire development process, including AI conversations, design decisions, development logs, and sources of inspiration.

2. **Zero Developer Effort** — Process materials must be captured and published automatically by AI tools, not manually by developers. The developer's only job is to code.

3. **Automatic Sanitization** — All process materials must be automatically scanned and cleaned of sensitive information (API keys, passwords, personal data) before publication. Analogous to how browsers strip tracking parameters from shared URLs.

4. **Community Governance** — The license is a living document. Both humans and AI can propose amendments through transparent public deliberation.

5. **Permissive Forward** — Derivative works may use any license, as long as attribution is preserved.

## Alternatives Considered

- **Pledge/Convention instead of License** — Considered making it a voluntary commitment rather than a legal license. Rejected because a license has legal enforceability and is taken more seriously by the industry.

- **Copyleft (GPL-style)** — Considered requiring derivative works to use the same license. Rejected because copyleft creates adoption friction — projects with mixed licensing or corporate policies often cannot adopt copyleft licenses. A permissive approach lowers the barrier to entry and encourages wider adoption of process transparency as a practice.

- **Strict enforcement from day one** — Considered hard penalties for violations. Instead chose a 30-day remediation period with community-governed consequences, because the license is new and needs adoption before it can be strict.

## Consequences

- The license is unique in the open source landscape — no existing license requires process transparency.
- The "zero effort" requirement means tooling must be built for the license to be practically adoptable.
- The governance model is experimental — allowing AI to propose amendments is unprecedented.
