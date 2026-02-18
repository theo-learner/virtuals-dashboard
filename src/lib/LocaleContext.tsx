"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Locale, setLocale as setI18nLocale, getLocale } from "./i18n";

type LocaleContextType = {
  locale: Locale;
  switchLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "ko",
  switchLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getLocale);

  const switchLocale = useCallback((l: Locale) => {
    setI18nLocale(l);
    setLocale(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
    }
  }, []);

  // Restore from localStorage on mount
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && saved !== locale && (saved === "ko" || saved === "en")) {
      setI18nLocale(saved);
      // Will trigger on next render
      if (locale !== saved) {
        // Use queueMicrotask to avoid setState during render
        queueMicrotask(() => setLocale(saved));
      }
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
