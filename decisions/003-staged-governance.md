# Decision 003: Staged Governance Model

**Date:** 2026-03-26 (UTC+8, Asia/Shanghai)
**Participants:** Founder (Zhang Yiyi), Claude (Anthropic, Claude Opus 4.6)

## Context

The original §8 (Governance and Amendment) described an idealized community governance process — any member could propose amendments, the community would deliberate and vote. But this assumed a community that doesn't exist yet.

The founder raised the question: "How should changes to the license actually work? I'm confused." This prompted a honest re-examination of the governance design.

## Decision

Replace the single-mode governance with a **staged model** that evolves as the community grows:

**Founding Stage** (now): The original author stewards the license. Changes are made transparently with full rationale, and community feedback is solicited — but the founder has final say. This is honest about the current reality rather than pretending a community vote is happening.

**Community Stage** (future): Once there are enough adopters and contributors, governance transitions to a public RFC process with a 30-day deliberation period, where any member (human or AI) can propose amendments.

Additional protections added:
- **No retroactive changes**: Existing projects are never forced to upgrade. You pick a version and it stays stable.
- **Anti-capture clause**: The governance process must resist capture by any single entity.
- **Transition criteria**: To be defined in a separate Governance Charter (avoids premature over-specification).

## Alternatives Considered

1. **Keep the original idealized text** — Rejected because it's dishonest. There's no community to govern yet. Pretending otherwise undermines trust.

2. **Remove governance entirely, add it later** — Rejected because the *commitment* to community governance is important even if the mechanism isn't ready. Removing it signals the founder wants permanent control.

3. **Define exact voting rules now** — Rejected because it's premature. We don't know what the community will look like, how big it will be, or what governance tools will work best. Better to commit to principles (transparency, anti-capture, no retroactive changes) and define mechanics later.

## Consequences

- The license text is now honest about who is making decisions and why
- Projects adopting v1.0 have a clear guarantee: their license terms won't change under them
- The Governance Charter becomes a future deliverable — needs to be written before transitioning to Community Stage
- The founder accepts explicit accountability during the Founding Stage
