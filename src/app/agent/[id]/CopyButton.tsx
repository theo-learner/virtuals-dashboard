"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-mono px-2 py-1 rounded bg-cyan-neon/20 text-cyan-neon hover:bg-cyan-neon/30 transition-colors"
    >
      {copied ? "복사됨!" : "복사"}
    </button>
  );
}
