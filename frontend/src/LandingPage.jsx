import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function BotLogo({ size = 28, color = "#7ec8f0" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="3" stroke={color} strokeWidth="1.7" />
      <circle cx="9" cy="14" r="1.5" fill={color} />
      <circle cx="15" cy="14" r="1.5" fill={color} />
      <path d="M12 3v5M9.5 8h5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.2" fill={color} />
    </svg>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="faq-q">
        <span>{q}</span>
        <svg className="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && <p className="faq-a">{a}</p>}
    </div>
  );
}

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Responses",
    desc: "No hold music. No ticket queues. Get answers the moment you ask.",
  },
  {
    icon: "🕐",
    title: "Always Available",
    desc: "24/7 support that never sleeps, never takes a lunch break.",
  },
  {
    icon: "🧠",
    title: "Context Memory",
    desc: "Remembers everything in your conversation. No repeating yourself.",
  },
  {
    icon: "🔒",
    title: "Safe & Private",
    desc: "Conversations stay between you and the assistant. No data sold.",
  },
];

const FAQS = [
  { q: "Is this a real human or a bot?", a: "It's an AI assistant — a very capable one. For complex issues it'll direct you to a real person." },
  { q: "Do I need to create an account?", a: "Nope. Just click Start Chatting and you're in. No sign-ups, no passwords." },
  { q: "What kind of questions can I ask?", a: "Billing, account issues, technical problems, how-to questions — anything support-related." },
  { q: "How fast does it respond?", a: "Usually under 3 seconds. It processes your question and replies in real time." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp">

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <BotLogo size={20} />
            <span>SupportAI</span>
          </div>
          <div className="lp-nav-links">
            {["features", "about", "faq"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
          <button className="btn-primary small" onClick={() => navigate("/chat")}>
            Open Chat →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="live-dot" /> AI-powered · Always online
          </div>
          <h1>Support that<br /><span className="grad">never sleeps.</span></h1>
          <p className="hero-sub">
            Instant answers to billing, account, and technical questions —
            no hold music, no queues, no frustration.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/chat")}>
              <BotLogo size={17} /> Start chatting — it's free
            </button>
            <a
              href="#features"
              className="btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >See features ↓</a>
          </div>

          {/* chat card preview */}
          <div className="preview-card">
            <div className="preview-topbar">
              <div className="preview-dots"><span /><span /><span /></div>
              <span className="preview-name">SupportAI</span>
              <span className="preview-online">● online</span>
            </div>
            <div className="preview-msgs">
              <div className="pmsg bot">
                <div className="pavatar"><BotLogo size={11} /></div>
                <div className="pbubble">Hi! How can I help you today?</div>
              </div>
              <div className="pmsg user">
                <div className="pbubble user">I can't log in after my password reset.</div>
              </div>
              <div className="pmsg bot">
                <div className="pavatar"><BotLogo size={11} /></div>
                <div className="pbubble">Let's sort that out — which email is linked to your account?</div>
              </div>
              <div className="pmsg bot">
                <div className="pavatar"><BotLogo size={11} /></div>
                <div className="pbubble typing"><span /><span /><span /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section" id="features">
        <div className="section-inner">
          <p className="eyebrow">Why SupportAI</p>
          <h2>Built different.</h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-emoji">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="lp-section lp-about" id="about">
        <div className="section-inner about-inner">
          <div className="about-text">
            <p className="eyebrow">About</p>
            <h2>What is SupportAI?</h2>
            <p className="about-body">
              SupportAI is a free, no-login AI support assistant. It's built to
              handle the most common support questions instantly — account issues,
              billing, technical hiccups — so you get help in seconds instead of waiting days.
            </p>
            <p className="about-body">
              There are no ads, no data selling, no account walls. Just a clean
              conversation with an AI that genuinely tries to solve your problem.
              If it can't, it'll tell you clearly and point you in the right direction.
            </p>
            <button className="btn-primary" onClick={() => navigate("/chat")}>
              Try it now →
            </button>
          </div>
          <div className="about-stats">
            {[
              { n: "< 3s", label: "Average response time" },
              { n: "24/7", label: "Always available" },
              { n: "0",   label: "Sign-ups required" },
              { n: "∞",   label: "Questions you can ask" },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-section lp-how" id="how">
        <div className="section-inner">
          <p className="eyebrow">How it works</p>
          <h2>Three steps to solved.</h2>
          <div className="steps">
            {[
              { n: "01", title: "Open the chat", desc: "No login needed. Hit Start Chatting and you're in instantly." },
              { n: "02", title: "Ask your question", desc: "Type naturally — billing, password, feature question. Whatever." },
              { n: "03", title: "Get your answer", desc: "The AI replies in seconds with a clear, helpful response." },
            ].map((s) => (
              <div className="step" key={s.n}>
                <div className="step-n">{s.n}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section" id="faq">
        <div className="section-inner faq-inner">
          <p className="eyebrow">FAQ</p>
          <h2>Common questions.</h2>
          <div className="faq-list">
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-banner">
        <div className="banner-glow" />
        <BotLogo size={36} />
        <h2>Ready to get unstuck?</h2>
        <p>No account needed. Just ask.</p>
        <button className="btn-primary" onClick={() => navigate("/chat")}>
          Start chatting free →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-logo">
          <BotLogo size={15} color="#3a4f66" />
          <span>SupportAI</span>
        </div>
        <p>© 2026 SupportAI. Built with care.</p>
      </footer>
    </div>
  );
}