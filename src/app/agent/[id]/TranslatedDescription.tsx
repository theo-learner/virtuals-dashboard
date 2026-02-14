"use client";

import { useState } from "react";

export function TranslatedDescription({ text }: { text: string }) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const isKorean = /[\uAC00-\uD7A3]/.test(text) && !/[a-zA-Z]{5,}/.test(text);

  if (isKorean) {
    return (
      <p className="text-text-primary text-base leading-relaxed bg-bg-card/50 rounded-lg p-4 border border-border/50 mb-3">
        {text}
      </p>
    );
  }

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setTranslated(data.result ?? text);
    } catch {
      setTranslated(text);
    } finally {
      setLoading(false);
    }
  };

  if (!translated) {
    return (
      <div className="bg-bg-card/50 rounded-lg p-4 border border-border/50 mb-3">
        <p className="text-text-primary text-base leading-relaxed mb-3">{text}</p>
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm
                     bg-gradient-to-r from-cyan-neon/20 to-violet-accent/20
                     border border-cyan-neon/40 text-cyan-neon
                     hover:from-cyan-neon/30 hover:to-violet-accent/30
                     disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>번역 중...</span>
            </>
          ) : (
            <>
              <span>🌐</span>
              <span>한국어로 번역</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-card/50 rounded-lg p-4 border border-border/50 mb-3">
      <p className="text-text-primary text-base leading-relaxed">{translated}</p>
      <button
        onClick={() => setShowOriginal(!showOriginal)}
        className="text-xs font-mono text-text-secondary mt-2 hover:text-cyan-neon transition-colors"
      >
        {showOriginal ? "▲ 원문 숨기기" : "▼ 원문 보기"}
      </button>
      {showOriginal && (
        <p className="text-text-secondary text-sm mt-2 border-t border-border/30 pt-2 leading-relaxed italic">
          {text}
        </p>
      )}
    </div>
  );
}
