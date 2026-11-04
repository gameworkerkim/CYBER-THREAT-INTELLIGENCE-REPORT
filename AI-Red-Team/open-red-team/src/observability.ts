interface LangfuseClient {
  trace(opts: { name: string; input?: unknown; output?: unknown; metadata?: Record<string, unknown> }): void;
  flushAsync(): Promise<void>;
}

let clientPromise: Promise<LangfuseClient | null> | null = null;

export function initObservability(): void {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!publicKey || !secretKey) return;
  clientPromise = import("langfuse")
    .then(({ Langfuse }) => {
      return new Langfuse({
        publicKey,
        secretKey,
        ...(process.env.LANGFUSE_BASEURL ? { baseUrl: process.env.LANGFUSE_BASEURL } : {}),
      }) as unknown as LangfuseClient;
    })
    .catch(() => null);
}

export async function recordChat(entry: {
  input: string;
  output: string;
  provider: string;
  model: string;
  matchedSkills: string[];
  scope?: string;
  flaggedTargets?: string[];
  decision?: string;
  operator: string;
  sessionId?: string;
  promptTokens?: number;
  reasoningTokens?: number;
}): Promise<void> {
  const client = await (clientPromise ?? null);
  if (!client) return;
  try {
    client.trace({
      name: "ort-chat",
      input: entry.input,
      output: entry.output,
      metadata: {
        provider: entry.provider,
        model: entry.model,
        matchedSkills: entry.matchedSkills,
        scope: entry.scope ?? "",
        flaggedTargets: entry.flaggedTargets ?? [],
        decision: entry.decision ?? "allow",
        operator: entry.operator,
        sessionId: entry.sessionId ?? "",
        promptTokens: entry.promptTokens ?? 0,
        reasoningTokens: entry.reasoningTokens ?? 0,
      },
    });
    await client.flushAsync();
  } catch {
    /* observability must never break the chat flow */
  }
}
