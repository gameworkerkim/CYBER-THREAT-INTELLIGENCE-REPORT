"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/i18n/client";

interface DomainItem {
  id: string;
  domain: string;
  status: "pending" | "verified" | "expired";
  verifiedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export default function DomainsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    id: string;
    token: string;
    path: string;
    url: string;
  } | null>(null);
  const [verifying, setVerifying] = useState("");

  async function load() {
    const res = await fetch("/api/domains");
    if (res.status === 401) {
      router.replace("/login");
      return;
    }
    const data = (await res.json()) as { domains?: DomainItem[] };
    setDomains(data.domains ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "등록에 실패했습니다.");
      return;
    }
    setDomain("");
    await load();
  }

  async function issueToken(id: string) {
    const res = await fetch(`/api/domains/${id}/token`);
    const data = (await res.json()) as {
      error?: string;
      token: string;
      path: string;
      url: string;
    };
    if (!res.ok) {
      setError(data.error ?? "토큰 발급에 실패했습니다.");
      return;
    }
    setTokenInfo({ id, token: data.token, path: data.path, url: data.url });
  }

  async function verify(id: string) {
    setVerifying(id);
    setError("");
    const res = await fetch(`/api/domains/${id}/verify`, { method: "POST" });
    const data = (await res.json()) as { error?: string };
    setVerifying("");
    if (!res.ok) {
      setError(data.error ?? "검증에 실패했습니다.");
      return;
    }
    setTokenInfo(null);
    await load();
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold">{t.domains_title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.domains_subtitle}</p>
      </div>

      <form
        className="flex gap-3 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={onSubmit}
      >
        <input
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          placeholder={t.domains_placeholder}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? t.domains_loading : t.domains_register}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {tokenInfo && (
        <div className="flex flex-col gap-2 rounded-lg border border-orange-300 bg-orange-50 p-5">
          <h2 className="font-semibold text-orange-800">{t.domains_token_title}</h2>
          <p className="text-sm text-orange-700">{t.domains_token_instructions}</p>
          <code className="break-all rounded bg-white px-3 py-2 text-xs">
            {tokenInfo.path}
          </code>
          <code className="break-all rounded bg-white px-3 py-2 text-xs font-mono">
            {tokenInfo.token}
          </code>
          <button
            className="mt-1 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white"
            onClick={() => verify(tokenInfo.id)}
            disabled={verifying !== ""}
          >
            {verifying === tokenInfo.id ? t.domains_verifying : t.domains_verify}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {domains.length === 0 ? (
          <p className="text-sm text-slate-500">{t.domains_empty}</p>
        ) : (
          domains.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-medium">{d.domain}</p>
                <p className="text-sm text-slate-500">
                  {t.domains_status}:{" "}
                  <b>
                    {d.status === "verified"
                      ? t.domains_verified
                      : d.status === "expired"
                        ? t.domains_expired
                        : t.domains_pending}
                  </b>
                  {d.expiresAt
                    ? ` · ${t.domains_expires} ${new Date(d.expiresAt).toLocaleString()}`
                    : ""}
                </p>
              </div>
              {d.status !== "verified" && (
                <button
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100"
                  onClick={() => issueToken(d.id)}
                >
                  {t.domains_issue_token}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
