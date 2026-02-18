"use client";

import { t } from "@/lib/i18n";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">{t("error.title")}</h2>
      <p className="text-sm text-gray-500">{t("error.description")}</p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        {t("common.retry")}
      </button>
    </div>
  );
}
