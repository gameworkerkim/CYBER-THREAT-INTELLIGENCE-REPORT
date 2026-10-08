"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/i18n/client";

interface KeyItem {
  id: string;
  provider: string;
  model: string | null;
  maxTokens: number | null;
  baseUrl: string | null;
  maskedKey: string;
  createdAt: string;
}

export default function KeysPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [maxTokens, setMaxTokens] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/keys");
    if (res.status === 401) {
      router.replace("/login");
      return;
    }
    const data = (await res.json()) as { keys?: KeyItem[] };
    setKeys(data.keys ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        apiKey,
        model: model || null,
        maxTokens: maxTokens ? Number(maxTokens) : null,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? t.keys_save_fail);
      return;
    }
    setApiKey("");
    setModel("");
    setMaxTokens("");
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold">{t.keys_title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.keys_subtitle}</p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={onSubmit}
      >
        <div className="flex gap-3">
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="compatible">OpenAI 호환</option>
          </select>
          <input
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            type="password"
            placeholder={t.keys_api_key}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder={t.keys_model}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            className="w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder={t.keys_max_tokens}
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? t.keys_loading : t.keys_add}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {keys.length === 0 ? (
          <p className="text-sm text-slate-500">{t.keys_empty}</p>
        ) : (
          keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-medium">
                  {k.provider}
                  {k.model ? ` · ${k.model}` : ""}
                </p>
                <p className="text-sm text-slate-500">
                  {k.maskedKey}
                  {k.maxTokens ? ` · max_tokens ${k.maxTokens}` : ""}
                </p>
              </div>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => remove(k.id)}
              >
                {t.keys_delete}
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
