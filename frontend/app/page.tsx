"use client";
import { useState, useEffect, useRef } from "react";

/* ─── GLOBALS ─────────────────────────────────────────────────────────────── */
const G = {
  bg: "#0a0a0a",
  surface: "#111111",
  surface2: "#171717",
  border: "#252525",
  amber: "#f59e0b",
  amberLight: "#fcd34d",
  amberDim: "rgba(245,158,11,0.12)",
  amberGlow: "rgba(245,158,11,0.25)",
  text: "#f5f5f5",
  textSub: "#a3a3a3",
  textMuted: "#525252",
  green: "#22c55e",
  radius: "14px",
  radiusSm: "8px",
};

const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:${G.bg};color:${G.text};font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
  a{text-decoration:none;color:inherit}
  button{font-family:inherit;cursor:pointer;border:none;background:none}
  ::selection{background:${G.amberGlow};color:#fff}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#111}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
  .fade-in{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
  .fade-in.visible{opacity:1;transform:none}
  .progress-bar{width:0;transition:width 1.2s ease}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pulse-amber{0%,100%{box-shadow:0 0 0 0 ${G.amberGlow}}70%{box-shadow:0 0 0 10px rgba(245,158,11,0)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @media(max-width:768px){
    .grid-3{grid-template-columns:1fr!important}
    .grid-2{grid-template-columns:1fr!important}
    .hide-mobile{display:none!important}
    .nav-links{display:none!important}
    .hamburger{display:flex!important}
    .hero-grid{grid-template-columns:1fr!important}
    .split{flex-direction:column!important}
  }
  @media(max-width:1024px){
    .grid-3{grid-template-columns:repeat(2,1fr)!important}
  }
`;

/* ─── NAVBAR ──────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Properties", "How It Works", "Governance", "Developers", "Docs"];

  const s: Record<string, React.CSSProperties> = {
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${G.border}` : "none",
      transition: "all .3s ease", padding: "0 5%",
    },
    inner: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 },
    logo: { display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 22 },
    dot: { width: 10, height: 10, borderRadius: "50%", background: G.amber, animation: "pulse-amber 2s infinite" },
    links: { display: "flex", gap: 36, fontSize: 15, color: G.textSub },
    link: { transition: "color .2s", cursor: "pointer" },
    ctaGroup: { display: "flex", gap: 12, alignItems: "center" },
    ctaOutline: {
      padding: "8px 18px", border: `1px solid ${G.border}`, borderRadius: G.radiusSm,
      fontSize: 14, color: G.textSub, transition: "all .2s", cursor: "pointer",
    },
    ctaFill: {
      padding: "8px 20px", background: G.amber, borderRadius: G.radiusSm,
      fontSize: 14, fontWeight: 600, color: "#000", transition: "transform .15s", cursor: "pointer",
    },
    hamburger: { display: "none", flexDirection: "column" as const, gap: 5, cursor: "pointer" },
    bar: { width: 24, height: 2, background: G.text, borderRadius: 2, transition: "all .2s" },
    drawer: {
      position: "fixed" as const, top: 68, left: 0, right: 0, bottom: 0,
      background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)",
      padding: "32px 5%", zIndex: 999, display: mobileOpen ? "flex" : "none",
      flexDirection: "column" as const, gap: 28,
    },
    drawerLink: { fontSize: 22, fontWeight: 500, color: G.text, borderBottom: `1px solid ${G.border}`, paddingBottom: 20 },
  };

  return (
    <>
      <nav style={s.nav}>
        <div style={s.inner}>
          <div style={s.logo}>
            <div style={s.dot} />
            <span>Proptify</span>
          </div>
          <div className="nav-links" style={s.links}>
            {navLinks.map(l => <span key={l} style={s.link} onMouseEnter={e => (e.currentTarget.style.color = G.amber)} onMouseLeave={e => (e.currentTarget.style.color = G.textSub)}>{l}</span>)}
          </div>
          <div className="hide-mobile" style={s.ctaGroup}>
            <button style={s.ctaOutline} onMouseEnter={e => (e.currentTarget.style.borderColor = G.amber)} onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>Log in</button>
            <button style={s.ctaFill} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")} onMouseLeave={e => (e.currentTarget.style.transform = "none")}>Get Started</button>
          </div>
          <div className="hamburger" style={s.hamburger} onClick={() => setMobileOpen(o => !o)}>
            <div style={{ ...s.bar, transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <div style={{ ...s.bar, opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ ...s.bar, transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </div>
        </div>
      </nav>
      <div style={s.drawer}>
        {navLinks.map(l => <span key={l} style={s.drawerLink} onClick={() => setMobileOpen(false)}>{l}</span>)}
        <button style={{ ...s.ctaFill, width: "100%", padding: "14px", fontSize: 16, borderRadius: G.radius }}>Get Started</button>
      </div>
    </>
  );
};

/* ─── HERO ────────────────────────────────────────────────────────────────── */
const HeroSection = () => {
  const s: Record<string, React.CSSProperties> = {
    section: {
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 5% 80px", position: "relative" as const, overflow: "hidden",
    },
    glow: {
      position: "absolute" as const, top: "10%", right: "5%",
      width: 600, height: 600, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
      pointerEvents: "none" as const,
    },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", maxWidth: 1200, margin: "0 auto", width: "100%" },
    badge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: G.amberDim, border: `1px solid rgba(245,158,11,0.3)`,
      borderRadius: 100, padding: "6px 16px", fontSize: 13, color: G.amber,
      marginBottom: 28, fontWeight: 500,
    },
    badgeDot: { width: 6, height: 6, borderRadius: "50%", background: G.amber },
    h1: { fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" },
    accent: { color: G.amber },
    sub: { fontSize: "clamp(1rem,2vw,1.2rem)", color: G.textSub, lineHeight: 1.7, marginBottom: 40, maxWidth: 480 },
    btnRow: { display: "flex", gap: 16, flexWrap: "wrap" as const },
    btnPrimary: {
      padding: "14px 30px", background: G.amber, color: "#000", fontWeight: 700,
      borderRadius: G.radius, fontSize: 16, transition: "all .2s", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
    },
    btnSecondary: {
      padding: "14px 30px", border: `1px solid ${G.border}`, color: G.text,
      borderRadius: G.radius, fontSize: 16, transition: "all .2s", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
    },
    mockup: {
      background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20,
      padding: 28, animation: "float 4s ease-in-out infinite", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
    },
    mockTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
    mockLogo: { width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${G.amber}, #d97706)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#000" },
    mockTitle: { fontWeight: 700, fontSize: 16 },
    mockSub: { fontSize: 12, color: G.textMuted },
    propImg: {
      height: 140, borderRadius: 12, marginBottom: 16,
      background: "linear-gradient(135deg, #1a2a1a, #0d1f0d)", position: "relative" as const, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    },
    propLabel: { position: "absolute" as const, top: 10, left: 10, background: G.amber, color: "#000", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 10px" },
    propName: { fontWeight: 700, fontSize: 16, marginBottom: 6 },
    propSub: { fontSize: 13, color: G.textSub, marginBottom: 14 },
    propRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    propPrice: { fontSize: 22, fontWeight: 800, color: G.amber },
    propYield: { fontSize: 13, color: G.green, background: "rgba(34,197,94,0.1)", padding: "4px 10px", borderRadius: 20, fontWeight: 600 },
    progressBg: { background: G.surface2, borderRadius: 4, height: 6, marginTop: 16 },
  };

  return (
    <section style={s.section}>
      <div style={s.glow} />
      <div className="hero-grid" style={s.grid}>
        <div>
          <div style={s.badge}><div style={s.badgeDot} />Built on Stellar · Powered by USDC</div>
          <h1 style={s.h1}>Own Real Estate<br />for <span style={s.accent}>$1 a month.</span><br />Anywhere.</h1>
          <p style={s.sub}>Proptify lets you buy fractional property tokens on African and Southeast Asian real estate. Earn rent. Build wealth. No bank required.</p>
          <div style={s.btnRow}>
            <button style={s.btnPrimary} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${G.amberGlow}`; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              Browse Properties →
            </button>
            <button style={s.btnSecondary} onMouseEnter={e => (e.currentTarget.style.borderColor = G.amber)} onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>
              ▶ Watch Demo
            </button>
          </div>
        </div>
        <div style={s.mockup}>
          <div style={s.mockTop}>
            <div style={s.mockLogo}>P</div>
            <div>
              <div style={s.mockTitle}>Lekki Phase 1 Apts</div>
              <div style={s.mockSub}>Lagos, Nigeria</div>
            </div>
          </div>
          <div style={s.propImg}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1e3a1e,#0a1a0a,#243a1a)", position: "absolute" as const, top: 0, left: 0 }} />
            <div style={s.propLabel}>FUNDED 78%</div>
            <span style={{ position: "relative" as const, fontSize: 40 }}>🏙️</span>
          </div>
          <div style={s.propName}>Lekki Phase 1 Apartments</div>
          <div style={s.propSub}>Lagos, Nigeria · Residential</div>
          <div style={s.propRow}>
            <div style={s.propPrice}>$0.50 / token</div>
            <div style={s.propYield}>8.4% APY</div>
          </div>
          <div style={s.progressBg}><div className="progress-bar" id="hero-bar" style={{ height: "100%", background: `linear-gradient(90deg,${G.amber},#d97706)`, borderRadius: 4, width: "78%" }} /></div>
        </div>
      </div>
    </section>
  );
};

/* ─── STATS BAR ───────────────────────────────────────────────────────────── */
const useCountUp = (target: number, duration = 2000, started: boolean) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
};

const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tvl = useCountUp(48, 2000, started);
  const properties = useCountUp(312, 2000, started);
  const investors = useCountUp(14200, 2200, started);
  const countries = useCountUp(22, 1800, started);

  const stats = [
    { value: `$${tvl}M+`, label: "Total Value Locked", sub: "Across all properties" },
    { value: `${properties}+`, label: "Properties Listed", sub: "Africa & Southeast Asia" },
    { value: `${investors.toLocaleString()}+`, label: "Investors", sub: "From 22 countries" },
    { value: `${countries}`, label: "Countries Supported", sub: "And growing fast" },
  ];

  const s: Record<string, React.CSSProperties> = {
    section: { borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: "52px 5%", background: G.surface },
    grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, maxWidth: 1200, margin: "0 auto", textAlign: "center" as const },
    val: { fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: G.amber, marginBottom: 6 },
    label: { fontSize: 15, fontWeight: 600, color: G.text, marginBottom: 4 },
    sub: { fontSize: 13, color: G.textMuted },
    divider: { width: 1, background: G.border, height: "100%" },
  };

  return (
    <div ref={ref} style={s.section}>
      <div className="grid-3" style={{ ...s.grid, gridTemplateColumns: "repeat(4,1fr)" }}>
        {stats.map(st => (
          <div key={st.label} className="fade-in">
            <div style={s.val}>{started ? st.value : "—"}</div>
            <div style={s.label}>{st.label}</div>
            <div style={s.sub}>{st.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── HOW IT WORKS ────────────────────────────────────────────────────────── */
const HowItWorks = () => {
  const steps = [
    { n: "01", icon: "🌍", title: "Browse & Select", desc: "Explore curated properties across Lagos, Accra, Nairobi, Jakarta and more — each with full legal disclosures and projected yields." },
    { n: "02", icon: "🔗", title: "Buy Tokens with USDC or XLM", desc: "Select the fraction you want — even $1 worth. Tokens are minted on Stellar's secure network. No crypto expertise needed." },
    { n: "03", icon: "💸", title: "Earn Monthly Rent", desc: "Rental income is collected by property managers and split proportionally to all token holders via smart contract — auto-deposited to your wallet." },
  ];

  const s: Record<string, React.CSSProperties> = {
    section: { padding: "100px 5%", maxWidth: 1200, margin: "0 auto" },
    tag: { fontSize: 13, fontWeight: 600, color: G.amber, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 },
    h2: { fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" },
    sub: { fontSize: 17, color: G.textSub, marginBottom: 64, maxWidth: 500 },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 },
    card: { background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, padding: 36, position: "relative" as const, transition: "border-color .2s, transform .2s", cursor: "default" },
    num: { fontSize: 13, fontWeight: 700, background: G.amberDim, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: G.radiusSm, padding: "4px 10px", display: "inline-block", marginBottom: 20, color: G.amber },
    icon: { fontSize: 36, marginBottom: 20 },
    cardTitle: { fontSize: 20, fontWeight: 700, marginBottom: 12 },
    cardDesc: { fontSize: 15, color: G.textSub, lineHeight: 1.7 },
    connector: { position: "absolute" as const, top: "50%", right: -14, width: 28, height: 2, background: `linear-gradient(90deg,${G.amber},transparent)`, pointerEvents: "none" as const },
  };

  return (
    <section style={s.section}>
      <div style={s.tag}>How It Works</div>
      <h2 style={s.h2}>Three steps to your first<br /><span style={{ color: G.amber }}>property investment</span></h2>
      <p style={s.sub}>No bank account. No minimum. No complexity. Just real estate, tokenized.</p>
      <div className="grid-3" style={s.grid}>
        {steps.map((st, i) => (
          <div key={st.n} className="fade-in" style={s.card}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G.amber; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = "none"; }}>
            <div style={s.num}>{st.n}</div>
            <div style={s.icon}>{st.icon}</div>
            <div style={s.cardTitle}>{st.title}</div>
            <div style={s.cardDesc}>{st.desc}</div>
            {i < 2 && <div className="hide-mobile" style={s.connector} />}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── PROPERTY CARD ───────────────────────────────────────────────────────── */
const gradients = [
  "linear-gradient(135deg,#1e3a1e,#0a1a0a,#243a1a)",
  "linear-gradient(135deg,#1a1a3e,#0a0a2a,#1a2a3a)",
  "linear-gradient(135deg,#3a1e1e,#1a0a0a,#2a1a1a)",
  "linear-gradient(135deg,#1e2a3a,#0a1020,#1a2030)",
];
const emojis = ["🏙️", "🌊", "🌿", "🏗️"];
const PropertyCard = ({ name, location, type, price, apy, funded, raised, gradient, emoji }: {
  name: string; location: string; type: string; price: string; apy: string;
  funded: number; raised: string; gradient: string; emoji: string;
}) => {
  const s: Record<string, React.CSSProperties> = {
    card: { background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, overflow: "hidden", transition: "transform .2s, border-color .2s", cursor: "pointer" },
    img: { height: 180, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" as const, fontSize: 48 },
    badge: { position: "absolute" as const, top: 12, left: 12, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: `1px solid ${G.border}`, color: G.text, fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "4px 10px" },
    body: { padding: 24 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
    name: { fontSize: 17, fontWeight: 700, marginBottom: 4 },
    loc: { fontSize: 13, color: G.textSub },
    price: { fontSize: 22, fontWeight: 800, color: G.amber },
    apy: { fontSize: 13, color: G.green, background: "rgba(34,197,94,0.1)", padding: "4px 10px", borderRadius: 20, fontWeight: 600 },
    barBg: { background: G.surface2, borderRadius: 4, height: 6, margin: "16px 0 10px" },
    barFill: { height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${G.amber},#d97706)`, transition: "width 1.2s ease" },
    meta: { display: "flex", justifyContent: "space-between", fontSize: 12, color: G.textMuted },
    btn: { width: "100%", padding: "12px", background: G.amberDim, border: `1px solid rgba(245,158,11,0.3)`, borderRadius: G.radiusSm, color: G.amber, fontWeight: 600, fontSize: 14, marginTop: 18, transition: "all .2s", cursor: "pointer" },
  };
  return (
    <div style={s.card}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = G.amber; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = G.border; }}>
      <div style={s.img}>
        <div style={{ position: "absolute" as const, inset: 0, background: gradient }} />
        <span style={{ position: "relative" as const }}>{emoji}</span>
        <div style={s.badge}>{type}</div>
      </div>
      <div style={s.body}>
        <div style={s.row}>
          <div>
            <div style={s.name}>{name}</div>
            <div style={s.loc}>📍 {location}</div>
          </div>
        </div>
        <div style={s.row}>
          <div style={s.price}>{price} <span style={{ fontSize: 14, fontWeight: 400, color: G.textSub }}>/ token</span></div>
          <div style={s.apy}>{apy} APY</div>
        </div>
        <div style={s.barBg}><div style={{ ...s.barFill, width: `${funded}%` }} /></div>
        <div style={s.meta}><span>{funded}% funded</span><span>{raised} raised</span></div>
        <button style={s.btn} onMouseEnter={e => { e.currentTarget.style.background = G.amber; e.currentTarget.style.color = "#000"; }} onMouseLeave={e => { e.currentTarget.style.background = G.amberDim; e.currentTarget.style.color = G.amber; }}>View Property →</button>
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  const props = [
    { name: "Lekki Phase 1 Apts", location: "Lagos, Nigeria", type: "Residential", price: "$0.50", apy: "8.4%", funded: 78, raised: "$390K", gradient: gradients[0], emoji: emojis[0] },
    { name: "Marina Bay Shopfronts", location: "Accra, Ghana", type: "Commercial", price: "$1.25", apy: "10.1%", funded: 55, raised: "$275K", gradient: gradients[1], emoji: emojis[1] },
    { name: "Bali Eco Villas", location: "Bali, Indonesia", type: "Short-term Rental", price: "$2.00", apy: "13.7%", funded: 92, raised: "$920K", gradient: gradients[2], emoji: emojis[2] },
    { name: "Nairobi Tech Hub", location: "Nairobi, Kenya", type: "Commercial", price: "$0.75", apy: "9.2%", funded: 41, raised: "$205K", gradient: gradients[3], emoji: emojis[3] },
  ];

  const s: Record<string, React.CSSProperties> = {
    section: { padding: "80px 5%", background: G.surface },
    inner: { maxWidth: 1200, margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap" as const, gap: 20 },
    tag: { fontSize: 13, fontWeight: 600, color: G.amber, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 12 },
    h2: { fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.02em" },
    viewAll: { color: G.amber, fontSize: 15, fontWeight: 600, border: `1px solid rgba(245,158,11,0.3)`, borderRadius: G.radiusSm, padding: "10px 22px", transition: "all .2s", cursor: "pointer" },
    grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 },
  };

  return (
    <section style={s.section}>
      <div style={s.inner}>
        <div style={s.header}>
          <div>
            <div style={s.tag}>Featured Properties</div>
            <h2 style={s.h2}>Invest in what you can see.</h2>
          </div>
          <button style={s.viewAll} onMouseEnter={e => { e.currentTarget.style.background = G.amberDim; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>Browse all properties →</button>
        </div>
        <div className="grid-3" style={s.grid}>
          {props.map(p => <PropertyCard key={p.name} {...p} />)}
        </div>
      </div>
    </section>
  );
};

/* ─── WHY PROPTIFY ────────────────────────────────────────────────────────── */
const WhyProptify = () => {
  const features = [
    { icon: "🌍", title: "Borderless by Design", desc: "Invest from anywhere. We support USDC and XLM, making it trivially easy to participate without a local bank account." },
    { icon: "⚡", title: "Instant Settlement", desc: "Stellar settles in 5 seconds. Rent payments land in your wallet on the same day, every month." },
    { icon: "🔒", title: "Non-Custodial", desc: "You hold your own tokens. We never custody your assets. Your keys, your property." },
    { icon: "⚖️", title: "Compliance-Ready", desc: "Jurisdiction-aware compliance modules built into every property listing, following SEC Nigeria, SEC Ghana, and local equivalents." },
    { icon: "🗳️", title: "On-Chain Governance", desc: "Token holders vote on major property decisions — repairs, management changes, and more." },
    { icon: "📈", title: "Installment Sales", desc: "Can't buy all at once? Our installment engine lets you drip invest over time. No minimums, no penalt​ies." },
  ];

  const s: Record<string, React.CSSProperties> = {
    section: { padding: "100px 5%" },
    inner: { maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "center" },
    left: { flex: "0 0 420px", minWidth: 0 },
    right: { flex: 1 },
    tag: { fontSize: 13, fontWeight: 600, color: G.amber, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 },
    h2: { fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.02em" },
    desc: { fontSize: 16, color: G.textSub, lineHeight: 1.8, marginBottom: 36 },
    cta: { padding: "13px 28px", background: G.amber, color: "#000", fontWeight: 700, borderRadius: G.radius, fontSize: 15, cursor: "pointer", transition: "all .2s", border: "none", display: "inline-block" },
    trustRow: { marginTop: 32, display: "flex", flex: "wrap", gap: 12 },
    trustBadge: { fontSize: 12, color: G.textSub, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 100, padding: "5px 14px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 },
    card: { background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24, transition: "border-color .2s" },
    fIcon: { fontSize: 28, marginBottom: 14 },
    fTitle: { fontWeight: 700, fontSize: 15, marginBottom: 8 },
    fDesc: { fontSize: 14, color: G.textSub, lineHeight: 1.6 },
  };

  return (
    <section style={s.section}>
      <div className="split" style={s.inner}>
        <div style={s.left}>
          <div style={s.tag}>Why Proptify</div>
          <h2 style={s.h2}>Real estate ownership.<br />Reimagined for the <span style={{ color: G.amber }}>Global South.</span></h2>
          <p style={s.desc}>Traditional property investment requires large capital, a bank account, and proximity to the asset. Proptify removes every one of those barriers.</p>
          <button style={s.cta} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${G.amberGlow}`; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>Start Investing Free</button>
          <div style={s.trustRow}>
            {["SSL Encrypted", "Audited Contracts", "Open Source"].map(t => <span key={t} style={s.trustBadge}>✓ {t}</span>)}
          </div>
        </div>
        <div className="grid-2" style={s.grid}>
          {features.map(f => (
            <div key={f.title} style={s.card} onMouseEnter={e => (e.currentTarget.style.borderColor = G.amber)} onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>
              <div style={s.fIcon}>{f.icon}</div>
              <div style={s.fTitle}>{f.title}</div>
              <div style={s.fDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── DEVELOPER SECTION ───────────────────────────────────────────────────── */
const codeSnippet = `// Claim rent on Stellar network
const contract = new rpc.Server(HORIZON_URL);
const tx = await contract.invokeContractFunction({
  contract: PROPTIFY_CONTRACT_ID,
  method: "claim_rent",
  args: [Address.fromString(walletAddress)],
  fee: 100,
});
await tx.sign({ keypair: userKeypair });
const result = await contract.sendTransaction(tx);
console.log("Rent claimed:", result.hash);`;

const DeveloperSection = () => {
  const stats2 = [
    { val: "200+", label: "GitHub Issues" },
    { val: "8", label: "Smart Contracts" },
    { val: "MIT", label: "Licensed" },
    { val: "💰", label: "Bounties Available" },
  ];
  const s: Record<string, React.CSSProperties> = {
    section: { padding: "100px 5%", background: G.surface },
    inner: { maxWidth: 1200, margin: "0 auto" },
    split: { display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" as const },
    left: { flex: 1, minWidth: 280 },
    right: { flex: 1, minWidth: 280 },
    tag: { fontSize: 13, fontWeight: 600, color: G.amber, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 },
    h2: { fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.02em" },
    desc: { fontSize: 16, color: G.textSub, lineHeight: 1.8, marginBottom: 36 },
    codeWrap: { background: "#0d0d0d", border: `1px solid ${G.border}`, borderRadius: 16, overflow: "hidden" },
    codeHeader: { display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: `1px solid ${G.border}`, background: "#111" },
    dot3: { width: 10, height: 10, borderRadius: "50%" },
    codeBody: { padding: 24, overflowX: "auto" as const, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7, color: "#a0c4ff", whiteSpace: "pre" as const },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginTop: 32 },
    statCard: { background: G.bg, border: `1px solid ${G.border}`, borderRadius: 12, padding: "20px 24px", textAlign: "center" as const },
    statVal: { fontSize: 24, fontWeight: 800, color: G.amber, marginBottom: 4 },
    statLabel: { fontSize: 13, color: G.textSub },
    btnRow: { display: "flex", gap: 16, flexWrap: "wrap" as const, marginTop: 36 },
    btnDocs: { padding: "12px 24px", background: G.amber, color: "#000", fontWeight: 700, borderRadius: G.radius, fontSize: 15, cursor: "pointer", border: "none" },
    btnGH: { padding: "12px 24px", border: `1px solid ${G.border}`, color: G.text, borderRadius: G.radius, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: "none" },
  };
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <div style={s.split}>
          <div style={s.right}>
            <div style={s.codeWrap}>
              <div style={s.codeHeader}>
                {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ ...s.dot3, background: c }} />)}
                <span style={{ fontSize: 12, color: G.textMuted, marginLeft: 8 }}>claim-rent.ts</span>
              </div>
              <pre style={s.codeBody}>{codeSnippet}</pre>
            </div>
            <div style={s.statsGrid}>
              {stats2.map(st => (
                <div key={st.label} style={s.statCard}>
                  <div style={s.statVal}>{st.val}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={s.left}>
            <div style={s.tag}>For Developers</div>
            <h2 style={s.h2}>Open source.<br /><span style={{ color: G.amber }}>Fully hackable.</span></h2>
            <p style={s.desc}>Proptify is built in the open. Smart contracts, backend, and frontend are MIT licensed. Integrate rent streams, governance, or fractional ownership into your own app.</p>
            <p style={s.desc}>We offer an SDK, developer docs, and a bounty program for contributors who build on top of the protocol.</p>
            <div style={s.btnRow}>
              <button style={s.btnDocs}>Read the Docs →</button>
              <button style={s.btnGH}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── TESTIMONIALS ────────────────────────────────────────────────────────── */
const avatarColors = ["#d97706","#0284c7","#7c3aed"];
const TestimonialCard = ({ name, role, quote, color }: { name: string; role: string; quote: string; color: string }) => {
  const initials = name.split(" ").map(n => n[0]).join("");
  const s: Record<string, React.CSSProperties> = {
    card: { background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, padding: 32, transition: "border-color .2s, transform .2s", display: "flex", flexDirection: "column" as const, gap: 24 },
    quote: { fontSize: 16, color: G.textSub, lineHeight: 1.8, fontStyle: "italic", flex: 1 },
    quoteIcon: { fontSize: 32, color: G.amber, lineHeight: 1, marginBottom: -8 },
    avatarRow: { display: "flex", alignItems: "center", gap: 14 },
    avatar: { width: 46, height: 46, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 },
    name: { fontWeight: 700, fontSize: 16 },
    roleText: { fontSize: 13, color: G.textMuted },
  };
  return (
    <div style={s.card} onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = "none"; }}>
      <div style={s.quoteIcon}>"</div>
      <p style={s.quote}>{quote}</p>
      <div style={s.avatarRow}>
        <div style={s.avatar}>{initials}</div>
        <div>
          <div style={s.name}>{name}</div>
          <div style={s.roleText}>{role}</div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    { name: "Adaeze O.", role: "Product Designer, Lagos", quote: "I bought my first piece of property with $170. I never thought that was possible.", color: avatarColors[0] },
    { name: "Kwame A.", role: "Engineer, Accra", quote: "The rent just shows up in my wallet every month. It feels like magic.", color: avatarColors[1] },
    { name: "Budi S.", role: "Investor, Jakarta", quote: "Finally, a platform that treats Africa and Southeast Asia as first-class.", color: avatarColors[2] },
  ];
  const s: Record<string, React.CSSProperties> = {
    section: { padding: "100px 5%" },
    inner: { maxWidth: 1200, margin: "0 auto" },
    tag: { fontSize: 13, fontWeight: 600, color: G.amber, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 },
    h2: { fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, marginBottom: 56, letterSpacing: "-0.02em" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 },
  };
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <div style={s.tag}>Testimonials</div>
        <h2 style={s.h2}>Heard from our <span style={{ color: G.amber }}>investors</span></h2>
        <div className="grid-3" style={s.grid}>
          {testimonials.map(t => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </div>
    </section>
  );
};

/* ─── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQItem = ({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) => {
  const s: Record<string, React.CSSProperties> = {
    item: { border: `1px solid ${open ? G.amber : G.border}`, borderRadius: G.radius, overflow: "hidden", transition: "border-color .2s", marginBottom: 12 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", cursor: "pointer", background: open ? G.amberDim : "transparent", transition: "background .2s" },
    q: { fontSize: 16, fontWeight: 600 },
    icon: { fontSize: 22, color: G.amber, transition: "transform .3s", transform: open ? "rotate(45deg)" : "none", flexShrink: 0 },
    body: { maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .35s ease" },
    a: { padding: "0 28px 22px", fontSize: 15, color: G.textSub, lineHeight: 1.8 },
  };
  return (
    <div style={s.item}>
      <div style={s.header} onClick={onClick}>
        <span style={s.q}>{q}</span>
        <span style={s.icon}>+</span>
      </div>
      <div style={s.body}><p style={s.a}>{a}</p></div>
    </div>
  );
};

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items = [
    { q: "Do I need a bank account?", a: "No. You just need a Stellar wallet (Freighter or xBull). We support USDC and XLM." },
    { q: "How is rent collected and distributed?", a: "Property managers deposit rent monthly. Our smart contract splits it proportionally to all token holders automatically." },
    { q: "Is Proptify regulated?", a: "We operate compliance modules per jurisdiction. In Nigeria, we follow SEC guidelines. In Ghana, SEC Ghana. Each property shows its jurisdiction." },
    { q: "What happens if I want to sell my tokens?", a: "A secondary market is coming in Q3 2026. Until then, tokens are transferable to any whitelisted wallet." },
    { q: "Is the code open source?", a: "Yes. All smart contracts, the backend, and the frontend are MIT licensed on GitHub." },
  ];
  const s: Record<string, React.CSSProperties> = {
    section: { padding: "100px 5%", background: G.surface },
    inner: { maxWidth: 780, margin: "0 auto" },
    tag: { fontSize: 13, fontWeight: 600, color: G.amber, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" as const },
    h2: { fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, marginBottom: 52, textAlign: "center" as const, letterSpacing: "-0.02em" },
  };
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <div style={s.tag}>FAQ</div>
        <h2 style={s.h2}>Common questions</h2>
        {items.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} open={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? null : i)} />
        ))}
      </div>
    </section>
  );
};

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */
const Footer = () => {
  const cols = [
    { title: "Product", links: ["Browse", "Portfolio", "Governance", "Installment Sales"] },
    { title: "Developers", links: ["Docs", "GitHub", "SDK", "Bounties"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security Policy"] },
  ];
  const s: Record<string, React.CSSProperties> = {
    footer: { borderTop: `1px solid ${G.amber}22`, padding: "80px 5% 40px", background: G.bg },
    inner: { maxWidth: 1200, margin: "0 auto" },
    top: { display: "grid", gridTemplateColumns: "1.5fr repeat(4,1fr)", gap: 48, marginBottom: 64 },
    logo: { display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 22, marginBottom: 16 },
    dot: { width: 10, height: 10, borderRadius: "50%", background: G.amber },
    tagline: { fontSize: 14, color: G.textSub, lineHeight: 1.7, maxWidth: 240 },
    colTitle: { fontWeight: 700, fontSize: 14, marginBottom: 22, color: G.text },
    colLinks: { display: "flex", flexDirection: "column" as const, gap: 14 },
    colLink: { fontSize: 14, color: G.textSub, transition: "color .2s", cursor: "pointer" },
    bottom: { borderTop: `1px solid ${G.border}`, paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 },
    copy: { fontSize: 13, color: G.textMuted },
    socials: { display: "flex", gap: 18 },
    socialIcon: { width: 36, height: 36, borderRadius: 8, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color .2s" },
  };
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div className="grid-3" style={s.top}>
          <div>
            <div style={s.logo}><div style={s.dot} /><span>Proptify</span></div>
            <p style={s.tagline}>Fractional real estate on Stellar. Own property from $1. Earn rent every month.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={s.colTitle}>{col.title}</div>
              <div style={s.colLinks}>
                {col.links.map(l => (
                  <span key={l} style={s.colLink} onMouseEnter={e => (e.currentTarget.style.color = G.amber)} onMouseLeave={e => (e.currentTarget.style.color = G.textSub)}>{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={s.bottom}>
          <span style={s.copy}>© 2025 Proptify. Built on Stellar.</span>
          <div style={s.socials}>
            {/* Twitter/X */}
            <div style={s.socialIcon} onMouseEnter={e => (e.currentTarget.style.borderColor = G.amber)} onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={G.textSub}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
            {/* GitHub */}
            <div style={s.socialIcon} onMouseEnter={e => (e.currentTarget.style.borderColor = G.amber)} onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={G.textSub}><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </div>
            {/* Discord */}
            <div style={s.socialIcon} onMouseEnter={e => (e.currentTarget.style.borderColor = G.amber)} onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={G.textSub}><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ─── APP ─────────────────────────────────────────────────────────────────── */
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

export default function App() {
  useScrollReveal();

  useEffect(() => {
    // Inject global styles
    const styleEl = document.createElement("style");
    styleEl.id = "proptify-global";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Load Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    return () => {
      document.getElementById("proptify-global")?.remove();
    };
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturedProperties />
      <WhyProptify />
      <DeveloperSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}

