"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/app/i18n/client";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "로그인에 실패했습니다.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold">{t.login_title}</h1>
      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          type="email"
          placeholder={t.login_email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          type="password"
          placeholder={t.login_password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? t.login_loading : t.login_submit}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {t.login_no_account}{" "}
        <Link className="text-orange-600 hover:underline" href="/signup">
          {t.login_signup}
        </Link>
      </p>
    </main>
  );
}
