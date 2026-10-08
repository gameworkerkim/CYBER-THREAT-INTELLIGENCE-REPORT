"use client";

import Link from "next/link";
import { useI18n } from "@/app/i18n/client";
import { locales, type Locale } from "@/app/i18n/dictionaries";

export default function SiteHeader() {
  const { locale, t, setLocale } = useI18n();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ⚔️ {t.brand}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-slate-600 hover:text-slate-950" href="/dashboard">
            {t.nav_dashboard}
          </Link>
          <Link className="text-slate-600 hover:text-slate-950" href="/keys">
            {t.nav_keys}
          </Link>
          <Link className="text-slate-600 hover:text-slate-950" href="/domains">
            {t.nav_domains}
          </Link>
          <Link className="text-slate-600 hover:text-slate-950" href="/login">
            {t.nav_login}
          </Link>
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t.switch_language}
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  );
}
