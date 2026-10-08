"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchJson } from "@/app/lib/http";
import { useI18n } from "@/app/i18n/client";

interface UserInfo {
  id: string;
  email: string;
  emailDomain: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [keyCount, setKeyCount] = useState(0);
  const [domainCount, setDomainCount] = useState(0);

  useEffect(() => {
    (async () => {
      const me = await fetchJson<{ user: UserInfo | null }>("/api/auth/me");
      if (!me.user) {
        router.replace("/login");
        return;
      }
      setUser(me.user);

      const [keys, domains] = await Promise.all([
        fetchJson<{ keys: unknown[] }>("/api/keys"),
        fetchJson<{ domains: unknown[] }>("/api/domains"),
      ]);
      setKeyCount(keys.keys?.length ?? 0);
      setDomainCount(domains.domains?.length ?? 0);
    })();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className="px-6 py-16 text-center">{t.dashboard_loading}</main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t.dashboard_title}</h1>
          <p className="text-sm text-slate-600">
            {user.email} · {t.dashboard_email_domain}:{" "}
            <b>{user.emailDomain}</b>
          </p>
        </div>
        <button
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100"
          onClick={logout}
        >
          {t.nav_logout}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/keys"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300"
        >
          <h2 className="font-semibold">{t.dashboard_llm_keys}</h2>
          <p className="mt-1 text-2xl font-bold">{keyCount}</p>
          <p className="mt-1 text-sm text-slate-500">{t.dashboard_registered}</p>
        </Link>
        <Link
          href="/domains"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300"
        >
          <h2 className="font-semibold">{t.dashboard_domains}</h2>
          <p className="mt-1 text-2xl font-bold">{domainCount}</p>
          <p className="mt-1 text-sm text-slate-500">{t.dashboard_registered}</p>
        </Link>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{t.dashboard_tasks}</h2>
          <p className="mt-1 text-2xl font-bold text-slate-300">—</p>
          <p className="mt-1 text-sm text-slate-500">{t.dashboard_phase2}</p>
        </div>
      </div>
    </main>
  );
}
