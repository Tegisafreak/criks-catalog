'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import { X, MessageCircle, Sun, Moon } from "lucide-react";
import Image from "next/image";

const GREEN = "#1FB33D";

const THEMES = {
  dark: {
    bg: "#0A0A0A",
    card: "#141414",
    border: "#232323",
    text: "#F2F2F0",
    muted: "#8A8A88",
    imgBg: "#101010",
    overlay: "rgba(0,0,0,0.7)",
    ctaText: "#06140a",
    stripeA: "#111111",
    stripeB: "#131313",
  },
  light: {
    bg: "#FAFAF8",
    card: "#FFFFFF",
    border: "#E4E4E1",
    text: "#141412",
    muted: "#8A8A85",
    imgBg: "#F0F0EE",
    overlay: "rgba(20,20,18,0.45)",
    ctaText: "#06140a",
    stripeA: "#F3F3F0",
    stripeB: "#ECECE9",
  },
};

const SLIDE_BRANDS = ["All", "Nike", "Adidas", "Yeezy", "Crocs"];
const WHATSAPP_NUMBER = "2340000000000";

const SLIDES = [
  { id: 1, brand: "Nike", name: "Nike Victori One", color: "Black / White", price: 15000, image: null, tag: null },
  { id: 2, brand: "Adidas", name: "Adidas Adilette Comfort", color: "Core Black", price: 14000, image: null, tag: null },
  { id: 3, brand: "Yeezy", name: "Yeezy Slide", color: "Onyx", price: 32000, image: null, tag: "Limited" },
  { id: 4, brand: "Nike", name: "Nike Calm Slide", color: "Sail", price: 16000, image: null, tag: null },
  { id: 5, brand: "Adidas", name: "Adidas Adifom Slide", color: "Cloud White", price: 17000, image: null, tag: null },
  { id: 6, brand: "Yeezy", name: "Yeezy Slide", color: "Pure", price: 32000, image: null, tag: "Limited" },
  { id: 7, brand: "Crocs", name: "Crocs Classic Clog", color: "Black", price: 13000, image: null, tag: null },
  { id: 8, brand: "Crocs", name: "Crocs Classic Clog", color: "Bone", price: 13000, image: null, tag: null },
];

const TEES = [
  { id: 101, brand: "Criks", name: "Criks Classic Tee", color: "Black", price: 8000, image: null, tag: "Signature" },
  { id: 102, brand: "Criks", name: "Criks Bubble Logo Tee", color: "White", price: 8000, image: null, tag: null },
  { id: 103, brand: "Criks", name: "Criks Oversized Tee", color: "Forest Green", price: 9500, image: null, tag: "New" },
];

function formatNaira(n) {
  return "₦" + n.toLocaleString("en-NG");
}

function BlobRipple({ x, y }) {
  return <span className="blob-ripple" style={{ left: x, top: y }} />;
}

function ProductCard({ product, onOpen, t }) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);
  const rippleId = useRef(0);

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onOpen(product);
  };

  return (
    <button
      className="product-card"
      onClick={handleTap}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ transform: pressed ? "scale(0.95)" : "scale(1)" }}
    >
      <div className="product-image-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-placeholder">
            <span style={{ color: t.border }}>IMAGE</span>
          </div>
        )}
        {product.tag && <span className="product-tag">{product.tag}</span>}
        {ripples.map((r) => (
          <BlobRipple key={r.id} x={r.x} y={r.y} />
        ))}
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <span className="product-name">{product.name}</span>
        <span className="product-price">{formatNaira(product.price)}</span>
      </div>
    </button>
  );
}

function DetailSheet({ product, onClose, t }) {
  if (!product) return null;

  const message = encodeURIComponent(
    `Hi Criks! I would like to reserve the ${product.name} (${product.color}) - ${formatNaira(product.price)}.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose}>
          <X size={18} color={t.muted} />
        </button>
        <div className="sheet-image-wrap">
          {product.image ? (
            <img src={product.image} alt={product.name} className="sheet-image" />
          ) : (
            <div className="product-placeholder">
              <span style={{ color: t.border }}>IMAGE</span>
            </div>
          )}
        </div>
        <div className="sheet-body">
          {product.tag && <span className="sheet-tag">{product.tag}</span>}
          <span className="sheet-brand">{product.brand}</span>
          <h2 className="sheet-name">{product.name}</h2>
          <span className="sheet-color">{product.color}</span>
          <span className="sheet-price">{formatNaira(product.price)}</span>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="reserve-btn">
            <MessageCircle size={17} strokeWidth={2.2} />
            Reserve on WhatsApp
          </a>
          <span className="sheet-note">No payment now - we will confirm size and availability over chat.</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState("slides");
  const [activeBrand, setActiveBrand] = useState("All");
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.matchMedia) {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      setTheme(prefersLight ? "light" : "dark");
    }
  }, []);

  if (!mounted) return null;

  const t = THEMES[theme];
  const filteredSlides = useMemo(() => {
    if (activeBrand === "All") return SLIDES;
    return SLIDES.filter((p) => p.brand === activeBrand);
  }, [activeBrand]);

  const items = tab === "slides" ? filteredSlides : TEES;

  return (
    <div className="app-root">
      <style jsx>{`
        * { box-sizing: border-box; }
        .app-root {
          background: ${t.bg};
          min-height: 100vh;
          color: ${t.text};
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
          padding-bottom: 64px;
          transition: background 0.35s ease, color 0.35s ease;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          max-width: 720px;
          margin: 0 auto;
        }
        .theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid ${t.border};
          background: ${t.card};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .theme-toggle:active { transform: scale(0.88); }

        .hero {
          padding: 20px 24px 28px;
          text-align: center;
        }
        .hero-logo {
          height: 46px;
          width: auto;
          margin: 0 auto;
          display: block;
        }
        .hero-sub {
          margin-top: 14px;
          font-size: 14px;
          color: ${t.muted};
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .tab-bar {
          display: flex;
          gap: 6px;
          justify-content: center;
          padding: 0 20px 18px;
        }
        .tab-btn {
          padding: 10px 22px;
          border-radius: 999px;
          border: 1px solid ${t.border};
          background: transparent;
          color: ${t.muted};
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tab-btn.active {
          background: ${t.text};
          border-color: ${t.text};
          color: ${t.bg};
          transform: scale(1.03);
        }
        .tab-btn:not(.active):active { transform: scale(0.94); }

        .filter-bar {
          display: flex;
          gap: 8px;
          padding: 0 20px 28px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .filter-pill {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid ${t.border};
          background: transparent;
          color: ${t.muted};
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .filter-pill.active {
          background: ${GREEN};
          border-color: ${GREEN};
          color: #06140a;
          transform: scale(1.04);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          padding: 0 16px;
          max-width: 720px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .grid { grid-template-columns: repeat(3, 1fr); gap: 18px; padding: 0 24px; }
        }

        .product-card {
          background: ${t.card};
          border: 1px solid ${t.border};
          border-radius: 18px;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
        }

        .product-image-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: ${t.imgBg};
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: repeating-linear-gradient(45deg, ${t.stripeA} 0, ${t.stripeA} 10px, ${t.stripeB} 10px, ${t.stripeB} 20px);
          color: ${t.border};
          font-size: 11px;
        }
        .product-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: ${GREEN};
          color: #06140a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 999px;
        }

        .product-info {
          padding: 12px 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .product-brand {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${t.muted};
        }
        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: ${t.text};
          letter-spacing: -0.01em;
        }
        .product-price {
          font-size: 13px;
          font-weight: 600;
          color: ${GREEN};
          margin-top: 4px;
        }

        .blob-ripple {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%;
          background: ${GREEN};
          opacity: 0.55;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
          animation: blob-pop 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes blob-pop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(16); opacity: 0; }
        }

        .sheet-overlay {
          position: fixed;
          inset: 0;
          background: ${t.overlay};
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 50;
          animation: fade-in 0.25s ease;
        }
        @media (min-width: 640px) {
          .sheet-overlay { align-items: center; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sheet {
          background: ${t.card};
          border: 1px solid ${t.border};
          border-radius: 24px 24px 0 0;
          width: 100%;
          max-width: 420px;
          max-height: 88vh;
          overflow-y: auto;
          position: relative;
          animation: sheet-up 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 640px) {
          .sheet { border-radius: 24px; }
        }
        @keyframes sheet-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .sheet-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${t.imgBg};
          border: 1px solid ${t.border};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
        }
        .sheet-close:active { transform: scale(0.88); }

        .sheet-image-wrap {
          aspect-ratio: 1.2 / 1;
          background: ${t.imgBg};
        }
        .sheet-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sheet-body {
          padding: 22px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sheet-tag {
          align-self: flex-start;
          background: ${GREEN};
          color: #06140a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 999px;
          margin-bottom: 8px;
        }
        .sheet-brand {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${t.muted};
        }
        .sheet-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 2px 0 0;
          color: ${t.text};
        }
        .sheet-color {
          font-size: 13px;
          color: ${t.muted};
          margin-top: 2px;
        }
        .sheet-price {
          font-size: 20px;
          font-weight: 700;
          color: ${GREEN};
          margin-top: 12px;
        }

        .reserve-btn {
          margin-top: 20px;
          background: ${GREEN};
          color: #06140a;
          border: none;
          border-radius: 14px;
          padding: 15px 20px;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .reserve-btn:active { transform: scale(0.96); }

        .sheet-note {
          margin-top: 12px;
          font-size: 11.5px;
          color: ${t.muted};
          text-align: center;
          line-height: 1.4;
        }
      `}</style>

      <div className="top-bar">
        <div style={{ width: 38 }} />
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} color={t.text} /> : <Moon size={16} color={t.text} />}
        </button>
      </div>

      <div className="hero">
        <img src="/logo.png" alt="Criks" className="hero-logo" />
        <p className="hero-sub">
          {tab === "slides" ? "Slides catalog - Nike, Adidas, Yeezy, Crocs" : "Criks tees - our own line"}
        </p>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "slides" ? "active" : ""}`} onClick={() => setTab("slides")}>
          Slides
        </button>
        <button className={`tab-btn ${tab === "tees" ? "active" : ""}`} onClick={() => setTab("tees")}>
          Criks Tees
        </button>
      </div>

      {tab === "slides" && (
        <div className="filter-bar">
          {SLIDE_BRANDS.map((b) => (
            <button
              key={b}
              className={`filter-pill ${activeBrand === b ? "active" : ""}`}
              onClick={() => setActiveBrand(b)}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      <div className="grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setSelected} t={t} />
        ))}
      </div>

      <DetailSheet product={selected} onClose={() => setSelected(null)} t={t} />
    </div>
  );
}
