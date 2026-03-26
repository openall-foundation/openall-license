import { useState, useEffect, useRef } from "react";

const ACCENT = "#1a6b4f";
const ACCENT_LIGHT = "#e8f5ef";
const DARK = "#0a0f0d";
const WARM = "#f7f5f0";
const GRAY = "#6b7280";
const BORDER = "#d4d9d6";
const GREEN = "#4ade80";
const AMBER = "#d97706";

const LICENSE_SECTIONS = [
  {
    num: "1", title: "Definitions",
    clauses: [
      { id: "1.1", text: `"Software" means the source code, object code, documentation, and any associated files made available under this License.` },
      { id: "1.2", text: `"Process Materials" means all records of the development process, including but not limited to: (a) conversations and interactions with artificial intelligence systems; (b) design documents and decision records; (c) development logs and progress notes; (d) sources of inspiration and references; (e) discarded approaches and reasoning for their abandonment.` },
      { id: "1.3", text: `"Derivative Work" means any work that is based on or derived from the Software, including modifications, translations, adaptations, and extensions.` },
      { id: "1.4", text: `"You" means any individual or legal entity exercising rights under this License.` },
      { id: "1.5", text: `"Community" means the collective body of human contributors and AI participants who engage in the governance of this License, as described in Section 8.` },
      { id: "1.6", text: `"Sensitive Information" means any data that, if disclosed, could cause harm or compromise security, including but not limited to: (a) API keys, passwords, access tokens, and cryptographic secrets; (b) personal information of third parties who have not consented to disclosure; (c) internal network addresses, infrastructure details, or deployment credentials; (d) any content subject to a separate confidentiality obligation imposed by law.` },
    ],
  },
  {
    num: "2", title: "Grant of Rights",
    clauses: [
      { id: "2.1", text: `Subject to the terms of this License, the copyright holder(s) hereby grant You a worldwide, royalty-free, non-exclusive, perpetual license to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.` },
    ],
  },
  {
    num: "3", title: "Process Transparency Obligation",
    clauses: [
      { id: "3.1", text: `Any distribution of the Software or Derivative Works must be accompanied by the corresponding Process Materials, made available in a publicly accessible location.` },
      { id: "3.2", text: `Process Materials must be generated and published automatically by the AI tools and development environment used in the creation of the Software. The intent is zero manual effort for the developer: the toolchain is responsible for capturing and uploading Process Materials as a natural byproduct of the development workflow.` },
      { id: "3.3", text: `Process Materials must be organized in a reasonable and discoverable manner. The recommended repository structure is:\n\n/src — Source code\n/process/conversations — AI interaction logs (auto-generated)\n/process/decisions — Design and architectural decision records\n/process/journal — Development logs and progress notes\n/process/inspirations — Sources of inspiration and references` },
      { id: "3.4", text: `Process Materials must be provided in good faith. Fabricating, substantially altering, or deliberately omitting materials to misrepresent the development process constitutes a violation of this License.` },
    ],
  },
  {
    num: "4", title: "Automatic Sanitization",
    clauses: [
      { id: "4.1", text: `Before any Process Materials are made publicly available, they must be automatically scanned and cleaned of all Sensitive Information as defined in Section 1.6.` },
      { id: "4.2", text: `The sanitization process must operate automatically, without requiring manual action by the developer. It is analogous to the automatic removal of tracking parameters from shared URLs: silent, reliable, and comprehensive.` },
      { id: "4.3", text: `The sanitization mechanism must, at minimum: (a) detect and redact API keys, passwords, tokens, and cryptographic secrets using pattern matching and entropy analysis; (b) detect and redact personal information of third parties unless those parties have given explicit consent; (c) detect and redact internal infrastructure details such as private IP addresses, internal hostnames, and database connection strings; (d) replace redacted content with a standardized placeholder (e.g., [REDACTED: api_key]) that indicates the category of information removed without revealing the content.` },
      { id: "4.4", text: `A sanitization log must be included with the published Process Materials, listing the number and categories of redactions performed, so that readers understand what was removed and why.` },
      { id: "4.5", text: `The sanitization tooling itself should be open source and auditable, to ensure community trust in its effectiveness.` },
    ],
  },
  {
    num: "5", title: "Attribution",
    clauses: [
      { id: "5.1", text: `The above copyright notice and this License text shall be included in all copies or substantial portions of the Software.` },
      { id: "5.2", text: `Derivative Works must clearly identify the original Software and its author(s), and must indicate what changes were made.` },
    ],
  },
  {
    num: "6", title: "Derivative Works",
    clauses: [
      { id: "6.1", text: `Any Derivative Work must be distributed under this same License, including all Process Transparency and Automatic Sanitization obligations.` },
      { id: "6.2", text: `You may not impose additional restrictions on the rights granted by this License upon recipients of the Software or Derivative Works.` },
    ],
  },
  {
    num: "7", title: "Commercial Use",
    clauses: [
      { id: "7.1", text: `Commercial use of the Software is permitted, provided that all obligations under this License are met, including full Process Transparency and Automatic Sanitization.` },
      { id: "7.2", text: `The Community may, through the governance process described in Section 8, establish additional terms specific to commercial use in future versions of this License.` },
    ],
  },
  {
    num: "8", title: "Governance and Amendment",
    clauses: [
      { id: "8.1", text: `This License is a living document. Its governance evolves in stages as the community grows:\n\n(a) Founding Stage — While the community is forming, the original author(s) steward the License. All changes must be documented publicly with full rationale, and community feedback must be solicited and addressed before adoption.\n\n(b) Community Stage — Once a sufficient body of adopters and contributors exists, governance transitions to a community-driven process in which any member — human or AI — may propose amendments through a public RFC (Request for Comments) process, with a deliberation period of no less than thirty (30) days.\n\n(c) The criteria for transitioning between stages, and the rules for proposal, deliberation, and ratification, shall be detailed in a Governance Charter published on the official OpenAll website.` },
      { id: "8.2", text: `All governance proceedings, including amendment proposals, deliberations, and decisions, must themselves be conducted in accordance with the principle of Process Transparency.` },
      { id: "8.3", text: `Adopted amendments are published on the official OpenAll website as new versions of the License. Existing projects are not required to upgrade — each project may choose which version to adopt. No amendment may retroactively alter the terms under which a project originally adopted the License.` },
      { id: "8.4", text: `The governance process must be designed to resist capture by any single entity, whether individual, corporate, or governmental.` },
      { id: "8.5", text: `Every proposed amendment must be submitted for independent review by at least one AI system before adoption. The AI reviewer shall assess the proposal for: (a) logical consistency and internal contradictions; (b) unintended consequences for different categories of adopters; (c) relevant historical precedent from other licenses and governance systems; (d) fairness across individuals, organizations, and jurisdictions. The AI review, including its full reasoning, must be published as part of the governance record. The AI reviewer serves in an advisory capacity; its assessment informs but does not override the decision-making process.` },
    ],
  },
  {
    num: "9", title: "Compliance and Remediation",
    clauses: [
      { id: "9.1", text: `A party found to be in violation of this License may remedy the violation by coming into full compliance within thirty (30) days of being notified of the non-compliance.` },
      { id: "9.2", text: `If the violation is not remedied within the thirty-day period, the rights granted under this License are automatically terminated for the non-compliant party.` },
      { id: "9.3", text: `The specific consequences for sustained non-compliance may be further defined by the Community through the governance process described in Section 8.` },
    ],
  },
  {
    num: "10", title: "Disclaimer of Warranty",
    clauses: [
      { id: "10.1", text: `THE SOFTWARE AND PROCESS MATERIALS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE, PROCESS MATERIALS, OR THE USE OR OTHER DEALINGS THEREIN.` },
    ],
  },
  {
    num: "11", title: "Severability",
    clauses: [
      { id: "11.1", text: `If any provision of this License is held to be unenforceable, such provision shall be reformed only to the extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.` },
    ],
  },
];

function FadeIn({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>{children}</div>
  );
}

function Pill({ children }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 14px", borderRadius: 999,
      fontSize: 13, fontWeight: 600, letterSpacing: "0.04em",
      background: ACCENT_LIGHT, color: ACCENT, border: `1px solid ${ACCENT}33`,
    }}>{children}</span>
  );
}

function StructureItem({ path, desc, auto }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
      <code style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14,
        color: ACCENT, background: `${ACCENT}0d`, padding: "3px 10px", borderRadius: 4, whiteSpace: "nowrap",
      }}>{path}</code>
      <span style={{ fontSize: 14, color: GRAY, flex: 1 }}>{desc}</span>
      {auto && (
        <span style={{
          fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          color: "#059669", background: "#d1fae5", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
        }}>AUTO</span>
      )}
    </div>
  );
}

function FlowStep({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{
        minWidth: 44, height: 44, borderRadius: "50%",
        background: `linear-gradient(135deg, ${ACCENT}, #059669)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: "#fff", flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.65, color: GRAY }}>{desc}</div>
      </div>
    </div>
  );
}

export default function OpenAllSite() {
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("summary");

  const badgeText = `[![OpenAll License v1.0](https://img.shields.io/badge/license-OpenAll%20v1.0-1a6b4f)](./LICENSE)`;
  const handleCopy = () => { navigator.clipboard.writeText(badgeText); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{
      minHeight: "100vh", background: WARM,
      fontFamily: "'Source Serif 4', 'Georgia', serif", color: DARK, overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HERO */}
      <header style={{
        position: "relative", padding: "100px 24px 80px", textAlign: "center", overflow: "hidden",
        background: `linear-gradient(170deg, ${DARK} 0%, #102a1f 50%, ${ACCENT} 100%)`,
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <div style={{
          position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 70%)`, filter: "blur(60px)",
        }} />

        <FadeIn>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24,
            padding: "6px 18px", borderRadius: 999,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 8px ${GREEN}66` }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
              Version 1.0
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>Open<span style={{ color: GREEN }}>All</span></h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p style={{
            fontFamily: "'Source Serif 4', serif", fontSize: "clamp(18px, 2.5vw, 24px)",
            color: "rgba(255,255,255,0.75)", maxWidth: 660, margin: "0 auto 16px", lineHeight: 1.6, fontWeight: 300,
          }}>
            The first license that requires transparency of the <em style={{ color: GREEN }}>entire creative process</em> — not just the code.
          </p>
        </FadeIn>

        <FadeIn delay={250}>
          <p style={{
            fontFamily: "'Source Serif 4', serif", fontSize: "clamp(14px, 1.8vw, 17px)",
            color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto 20px", lineHeight: 1.6,
            fontStyle: "italic",
          }}>
            "Code is cheap. Show me your talk."
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 16px)",
            color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6,
          }}>
            Zero effort for developers. AI captures and publishes everything automatically — with sensitive data scrubbed before it ever goes public.
          </p>
        </FadeIn>

        <FadeIn delay={350}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#license" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
              padding: "14px 32px", borderRadius: 8, background: GREEN, color: DARK, textDecoration: "none",
            }}>Read the License</a>
            <a href="#adopt" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
              padding: "14px 32px", borderRadius: 8, background: "rgba(255,255,255,0.08)",
              color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)",
            }}>Adopt OpenAll</a>
          </div>
        </FadeIn>
      </header>

      {/* WHAT IS THIS */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 60px" }}>
        <FadeIn>
          <Pill>What is this?</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700, margin: "20px 0 24px", lineHeight: 1.15, letterSpacing: "-0.02em",
          }}>Open source your <span style={{ color: ACCENT }}>thinking</span>, not just your code</h2>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: "#374151", marginBottom: 20 }}>
            Traditional open source licenses ask you to share your code. The OpenAll License asks you to share <strong>how you got there</strong> — every AI conversation, every design decision, every abandoned idea, every source of inspiration.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: "#374151" }}>
            And it asks <strong>nothing extra from you</strong>. Your AI tools do all the work: they automatically capture the process, automatically scrub sensitive data, and automatically publish. You just code.
          </p>
        </FadeIn>
      </section>

      {/* FOUR PILLARS */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: "◇", title: "Process Transparency", desc: "AI conversations, decision logs, inspirations — all published alongside your code." },
            { icon: "⚡", title: "Zero Developer Effort", desc: "AI tools auto-capture and auto-upload everything. You never manually maintain process docs." },
            { icon: "🛡", title: "Auto Sanitization", desc: "Secrets, keys, and personal data are automatically scrubbed before anything goes public." },
            { icon: "◈", title: "Community Governance", desc: "Humans and AI evolve the license together through transparent public deliberation." },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div style={{
                padding: "28px 24px", borderRadius: 12, background: "#fff",
                border: `1px solid ${BORDER}`, height: "100%",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${ACCENT}15`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 26, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: GRAY, margin: 0 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px", borderTop: `1px solid ${BORDER}` }}>
        <FadeIn>
          <Pill>How it works</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700,
            margin: "20px 0 32px", letterSpacing: "-0.01em",
          }}>You code. AI handles the rest.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <FlowStep icon="💬" title="You work with AI as usual"
              desc="Write code, ask questions, make decisions. Your AI tools capture the conversation naturally." />
            <div style={{ borderLeft: `2px dashed ${BORDER}`, height: 20, marginLeft: 21 }} />
            <FlowStep icon="🔍" title="Auto-sanitize before publishing"
              desc="The toolchain scans all process materials and strips API keys, passwords, tokens, personal data, and infrastructure secrets. Like a browser removing tracking parameters from a shared URL — silent and automatic." />
            <div style={{ borderLeft: `2px dashed ${BORDER}`, height: 20, marginLeft: 21 }} />
            <FlowStep icon="📤" title="Auto-publish to your repo"
              desc="Clean process materials are uploaded to your project's /process directory — conversations, decisions, and journal. A sanitization log documents what was redacted." />
            <div style={{ borderLeft: `2px dashed ${BORDER}`, height: 20, marginLeft: 21 }} />
            <FlowStep icon="✓" title="Developer effort: zero"
              desc="You never touch the process materials. No manual uploads. No formatting. No review. The toolchain does it all." />
          </div>
        </FadeIn>
      </section>

      {/* SANITIZATION */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px", borderTop: `1px solid ${BORDER}` }}>
        <FadeIn>
          <Pill>Safety first</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700,
            margin: "20px 0 16px", letterSpacing: "-0.01em",
          }}>Automatic sanitization, built in</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", marginBottom: 28 }}>
            Nothing sensitive ever reaches the public repo. The sanitization layer catches and redacts:
          </p>
          <div style={{
            background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 28px",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20,
          }}>
            {[
              { label: "API keys & tokens", example: "sk-proj-abc... → [REDACTED: api_key]" },
              { label: "Passwords & secrets", example: "DB_PASS=hunter2 → [REDACTED: password]" },
              { label: "Personal data", example: "john@email.com → [REDACTED: email]" },
              { label: "Infrastructure", example: "10.0.1.42:5432 → [REDACTED: internal_ip]" },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{item.label}</div>
                <code style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  color: "#dc2626", background: "#fef2f2", padding: "4px 8px", borderRadius: 4,
                  display: "block", lineHeight: 1.6,
                }}>{item.example}</code>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: GRAY, marginTop: 16 }}>
            Every redaction is logged. The sanitization tool itself is open source and auditable.
          </p>
        </FadeIn>
      </section>

      {/* REPO STRUCTURE */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", borderTop: `1px solid ${BORDER}` }}>
        <FadeIn>
          <Pill>Recommended Structure</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700,
            margin: "20px 0 28px", letterSpacing: "-0.01em",
          }}>What an OpenAll project looks like</h2>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 32px" }}>
            <StructureItem path="/src" desc="Source code" />
            <StructureItem path="/process/conversations" desc="AI interaction logs" auto />
            <StructureItem path="/process/decisions" desc="Decision records" auto />
            <StructureItem path="/process/journal" desc="Development logs" auto />
            <StructureItem path="/process/inspirations" desc="References & inspiration" />
            <StructureItem path="/process/sanitization.log" desc="Redaction summary" auto />
          </div>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 12 }}>
            Items marked <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#059669", background: "#d1fae5", padding: "1px 6px", borderRadius: 3 }}>AUTO</span> are generated and maintained by the toolchain, not the developer.
          </p>
        </FadeIn>
      </section>

      {/* LICENSE TEXT */}
      <section id="license" style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px", borderTop: `1px solid ${BORDER}` }}>
        <FadeIn>
          <Pill>License</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700,
            margin: "20px 0 28px", letterSpacing: "-0.01em",
          }}>OpenAll License v1.0</h2>
          <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${BORDER}`, marginBottom: 32 }}>
            {[
              { key: "summary", label: "Human-Readable Summary" },
              { key: "legal", label: "Full Legal Text" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                padding: "12px 24px", background: "none", border: "none",
                borderBottom: tab === t.key ? `2px solid ${ACCENT}` : "2px solid transparent",
                marginBottom: -2, color: tab === t.key ? ACCENT : GRAY, cursor: "pointer",
              }}>{t.label}</button>
            ))}
          </div>
        </FadeIn>

        {tab === "summary" && (
          <FadeIn>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "36px 36px 28px" }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, margin: "0 0 20px", color: ACCENT }}>You are free to:</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                {[
                  ["Use, copy, modify, and distribute", " the software for any purpose, including commercial use."],
                  ["Build upon it", " and create derivative works."],
                ].map(([bold, rest], i) => (
                  <li key={i} style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 8, paddingLeft: 20, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: ACCENT, fontWeight: 700 }}>✓</span>
                    <strong>{bold}</strong>{rest}
                  </li>
                ))}
              </ul>

              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, margin: "0 0 20px", color: ACCENT }}>Under these conditions:</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                {[
                  ["Process Transparency:", " Your AI tools must automatically publish the development process — conversations, decisions, logs, and inspirations."],
                  ["Automatic Sanitization:", " All process materials are auto-scanned and cleaned of secrets, keys, and personal data before publication."],
                  ["Attribution:", " Retain this license notice and credit the original author(s)."],
                  ["Same License Forward:", " Derivative works must also use the OpenAll License."],
                ].map(([bold, rest], i) => (
                  <li key={i} style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 8, paddingLeft: 20, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: AMBER }}>→</span>
                    <strong>{bold}</strong>{rest}
                  </li>
                ))}
              </ul>

              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, margin: "0 0 20px", color: ACCENT }}>Zero developer effort:</h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", margin: "0 0 28px" }}>
                You don't manually upload or maintain any process materials. Your AI toolchain handles capture, sanitization, and publishing automatically. You just code.
              </p>

              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, margin: "0 0 20px", color: ACCENT }}>Governance:</h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", margin: 0 }}>
                This license is a living document. Both humans and AI can propose amendments through transparent public deliberation.
              </p>
            </div>
          </FadeIn>
        )}

        {tab === "legal" && (
          <FadeIn>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "36px 36px" }}>
              {LICENSE_SECTIONS.map((sec) => (
                <div key={sec.num} style={{ marginBottom: 24 }}>
                  <button
                    onClick={() => setActiveSection(activeSection === sec.num ? null : sec.num)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, width: "100%",
                      background: "none", border: "none", padding: "8px 0", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500,
                      color: ACCENT, background: ACCENT_LIGHT, padding: "3px 10px", borderRadius: 6,
                      minWidth: 36, textAlign: "center",
                    }}>§{sec.num}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: DARK }}>{sec.title}</span>
                    <span style={{
                      marginLeft: "auto", fontSize: 18, color: GRAY,
                      transform: activeSection === sec.num ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.25s ease",
                    }}>▾</span>
                  </button>
                  <div style={{
                    maxHeight: activeSection === sec.num ? 3000 : 0,
                    overflow: "hidden", transition: "max-height 0.4s ease",
                  }}>
                    <div style={{ padding: "12px 0 0 48px" }}>
                      {sec.clauses.map((c) => (
                        <div key={c.id} style={{ marginBottom: 14 }}>
                          <p style={{ fontSize: 14, lineHeight: 1.75, color: "#374151", margin: 0, whiteSpace: "pre-wrap" }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GRAY, marginRight: 8 }}>{c.id}</span>
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </section>

      {/* ADOPT */}
      <section id="adopt" style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px", borderTop: `1px solid ${BORDER}` }}>
        <FadeIn>
          <Pill>Get Started</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700,
            margin: "20px 0 16px", letterSpacing: "-0.01em",
          }}>Adopt OpenAll in your project</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", marginBottom: 28 }}>
            Add a <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, background: ACCENT_LIGHT, padding: "2px 6px", borderRadius: 4 }}>LICENSE</code> file with the full text, set up the recommended structure, and add the badge:
          </p>
          <div style={{ background: DARK, borderRadius: 10, padding: "20px 24px", position: "relative" }}>
            <code style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              color: GREEN, lineHeight: 1.8, wordBreak: "break-all",
            }}>{badgeText}</code>
            <button onClick={handleCopy} style={{
              position: "absolute", top: 12, right: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
              padding: "6px 14px", borderRadius: 6,
              background: copied ? GREEN : "rgba(255,255,255,0.1)",
              color: copied ? DARK : "rgba(255,255,255,0.7)",
              border: "none", cursor: "pointer",
            }}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </FadeIn>
      </section>

      {/* SPREAD THE WORD */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px", borderTop: `1px solid ${BORDER}` }}>
        <FadeIn>
          <Pill>Spread the word</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700,
            margin: "20px 0 16px", letterSpacing: "-0.01em",
          }}>Join the movement</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
            OpenAll is an open movement for radical transparency in the age of AI. Share it, adopt it, shape it.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Share row */}
            <div style={{
              display: "flex", gap: 10, flexWrap: "wrap",
            }}>
              {[
                { label: "𝕏 / Twitter", bg: "#0f1419", color: "#fff",
                  url: "https://twitter.com/intent/tweet?text=" + encodeURIComponent("Open source your thinking, not just your code. The #OpenAll License requires transparency of the entire creative process — AI conversations, decisions, and inspirations.\n\nhttps://openall.fund") },
                { label: "Reddit", bg: "#ff4500", color: "#fff",
                  url: "https://reddit.com/submit?url=" + encodeURIComponent("https://openall.fund") + "&title=" + encodeURIComponent("OpenAll License — Open source your thinking, not just your code #OpenAll") },
                { label: "LinkedIn", bg: "#0a66c2", color: "#fff",
                  url: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent("https://openall.fund") },
                { label: "Hacker News", bg: "#ff6600", color: "#fff",
                  url: "https://news.ycombinator.com/submitlink?u=" + encodeURIComponent("https://openall.fund") + "&t=" + encodeURIComponent("OpenAll License – Open source your thinking, not just your code") },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                  padding: "10px 20px", borderRadius: 8,
                  background: s.bg, color: s.color,
                  textDecoration: "none",
                  transition: "opacity 0.2s, transform 0.2s",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Share on {s.label}
                </a>
              ))}
            </div>

            {/* GitHub topic link */}
            <div style={{
              background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: "24px 28px", marginTop: 8,
            }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>
                Add to your GitHub repo
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: GRAY, margin: "0 0 16px" }}>
                Add the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, background: ACCENT_LIGHT, padding: "2px 6px", borderRadius: 4, color: ACCENT }}>openall</code> topic to your GitHub repository so others can discover OpenAll projects. Go to your repo → About (gear icon) → Topics → type <strong>openall</strong>.
              </p>
              <a href="https://github.com/topics/openall" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                padding: "10px 20px", borderRadius: 8,
                background: "#24292f", color: "#fff",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                Browse #openall projects
              </a>
            </div>

            {/* Join as adopter/supporter */}
            <div style={{
              background: ACCENT_LIGHT, border: `1px solid ${ACCENT}33`, borderRadius: 12,
              padding: "24px 28px", marginTop: 8, textAlign: "center",
            }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>
                Join the adopters
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: GRAY, margin: "0 0 16px" }}>
                Add your name or project to the public adopters list. One click, one PR — you're in.
              </p>
              <a href="https://github.com/openall-foundation/openall-license/edit/main/ADOPTERS.md" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                padding: "10px 24px", borderRadius: 8,
                background: ACCENT, color: "#fff",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Add yourself to ADOPTERS.md
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* STAY IN THE LOOP */}
      <section style={{
        maxWidth: 800, margin: "0 auto", padding: "48px 24px",
        borderTop: `1px solid ${BORDER}`,
      }}>
        <FadeIn>
          <div style={{
            background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12,
            padding: "28px 32px",
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700,
              margin: "0 0 8px",
            }}>Stay in the loop</h3>
            <p style={{ fontSize: 14, color: GRAY, margin: "0 0 20px", maxWidth: 420, lineHeight: 1.6 }}>
              Watch or star the repo to follow OpenAll — governance proposals, new tools, and community milestones.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="https://github.com/openall-foundation/openall-license" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                padding: "10px 24px", borderRadius: 8,
                background: ACCENT, color: "#fff",
                border: "none", cursor: "pointer",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Star on GitHub</a>
              <a href="https://github.com/openall-foundation/openall-license/discussions" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                padding: "10px 24px", borderRadius: 8,
                background: "#fff", color: ACCENT,
                border: `1px solid ${ACCENT}`,
                cursor: "pointer",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Join Discussions</a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: GRAY, margin: "0 0 8px" }}>
          OpenAll License v1.0
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: GRAY, margin: 0, opacity: 0.7 }}>
          This license was itself created with full process transparency. The AI conversation that produced it is public.
        </p>
      </footer>
    </div>
  );
}
