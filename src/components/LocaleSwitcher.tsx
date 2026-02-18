"use client";

import { useLocale } from "@/lib/LocaleContext";

export default function LocaleSwitcher() {
  const { locale, switchLocale } = useLocale();

  return (
    <button
      onClick={() => switchLocale(locale === "ko" ? "en" : "ko")}
      className="px-2.5 py-1 text-xs font-mono rounded-lg border border-border hover:border-accent-primary hover:text-accent-primary transition-all text-text-secondary"
      title="Switch language"
    >
      {locale === "ko" ? "EN" : "한국어"}
    </button>
  );
}
