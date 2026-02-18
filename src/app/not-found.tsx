import Link from "next/link";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">{t("notFound.title")}</h2>
      <p className="text-sm text-gray-500">{t("notFound.description")}</p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        {t("common.home")}
      </Link>
    </div>
  );
}
