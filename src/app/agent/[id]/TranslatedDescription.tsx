"use client";

import { useState, useEffect } from "react";

export function TranslatedDescription({ text }: { text: string }) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Check if text looks Korean already
  const isKorean = /[\uAC00-\uD7A3]/.test(text) && !/[a-zA-Z]{5,}/.test(text);

  useEffect(() => {
    if (isKorean) {
      setTranslated(text);
      return;
    }

    setLoading(true);
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.result) setTranslated(data.result);
        else setTranslated(text); // fallback to original
      })
      .catch(() => setTranslated(text))
      .finally(() => setLoading(false));
  }, [text, isKorean]);

  return (
    <div className="bg-bg-card/50 rounded-lg p-4 border border-border/50 mb-3">
      {loading ? (
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <span className="animate-pulse">🌐</span>
          <span>한국어로 번역 중...</span>
        </div>
      ) : (
        <>
          <p className="text-text-primary text-base leading-relaxed">
            {translated ?? text}
          </p>
          {!isKorean && translated && translated !== text && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs font-mono text-text-secondary mt-2 hover:text-cyan-neon transition-colors"
            >
              {showOriginal ? "▲ 원문 숨기기" : "▼ 원문 보기"}
            </button>
          )}
          {showOriginal && (
            <p className="text-text-secondary text-sm mt-2 border-t border-border/30 pt-2 leading-relaxed italic">
              {text}
            </p>
          )}
        </>
      )}
    </div>
  );
}
