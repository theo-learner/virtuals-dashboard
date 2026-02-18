"use client";

import Link from "next/link";
import { useState } from "react";
import { t } from "@/lib/i18n";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="glass-card mb-6 px-6 py-4 flex items-center justify-between relative">
      <Link href="/" className="text-xl font-bold font-mono flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-primary/20 text-accent-primary text-sm">⬡</span>
        <span className="text-accent-primary glow-primary">VIRTUALS</span>
        <span className="text-text-secondary text-sm font-normal ml-1">aGDP</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden sm:flex gap-6 text-sm font-mono">
        <Link href="/" className="hover:text-accent-primary transition-colors">{t("nav.dashboard")}</Link>
        <Link href="/analytics" className="hover:text-accent-primary transition-colors">{t("nav.analytics")}</Link>
        <Link href="/insights" className="hover:text-accent-primary transition-colors">{t("nav.insights")}</Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden text-text-secondary hover:text-accent-primary transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          }
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-4 flex flex-col gap-3 text-sm font-mono sm:hidden z-50">
          <Link href="/" className="hover:text-accent-primary transition-colors py-1" onClick={() => setMenuOpen(false)}>{t("nav.dashboard")}</Link>
          <Link href="/analytics" className="hover:text-accent-primary transition-colors py-1" onClick={() => setMenuOpen(false)}>{t("nav.analytics")}</Link>
          <Link href="/insights" className="hover:text-accent-primary transition-colors py-1" onClick={() => setMenuOpen(false)}>{t("nav.insights")}</Link>
        </div>
      )}
    </nav>
  );
}
