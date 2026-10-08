"use client";

import Link from "next/link";
import { useI18n } from "@/app/i18n/client";

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          {t.landing_eyebrow}
        </p>
        <h1 className="text-4xl font-semibold leading-tight">{t.landing_title}</h1>
        <p className="text-lg leading-8 text-slate-700">{t.landing_subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Link
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          href="/signup"
        >
          {t.landing_start}
        </Link>
        <Link
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
          href="/login"
        >
          {t.landing_login}
        </Link>
      </div>
    </main>
  );
}
