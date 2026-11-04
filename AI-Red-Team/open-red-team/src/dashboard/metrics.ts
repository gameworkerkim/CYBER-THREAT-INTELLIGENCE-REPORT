interface Counter {
  value: number;
}

const metrics = {
  httpRequestsTotal: {} as Record<string, Counter>,
  chatRequestsTotal: { value: 0 } as Counter,
  chatErrorsTotal: { value: 0 } as Counter,
  chatDurationSumSeconds: { value: 0 } as Counter,
  chatTokensTotal: { value: 0 } as Counter,
  activeChats: { value: 0 } as Counter,
};

export function trackHttp(method: string, path: string): void {
  const key = `${method} ${path.replace(/\/[a-z0-9_-]+$/i, "/:id")}`;
  (metrics.httpRequestsTotal[key] ??= { value: 0 }).value += 1;
}

export function trackChatStart(): void {
  metrics.chatRequestsTotal.value += 1;
  metrics.activeChats.value += 1;
}

export function trackChatEnd(durationMs: number, tokens: number, failed: boolean): void {
  metrics.activeChats.value = Math.max(0, metrics.activeChats.value - 1);
  metrics.chatDurationSumSeconds.value += durationMs / 1000;
  metrics.chatTokensTotal.value += tokens;
  if (failed) metrics.chatErrorsTotal.value += 1;
}

export function metricsText(): string {
  const lines: string[] = [
    "# HELP ort_http_requests_total Total HTTP requests by route.",
    "# TYPE ort_http_requests_total counter",
  ];
  for (const [key, c] of Object.entries(metrics.httpRequestsTotal)) {
    lines.push(`ort_http_requests_total{route="${key}"} ${c.value}`);
  }
  lines.push(
    "# HELP ort_chat_requests_total Total chat requests.",
    "# TYPE ort_chat_requests_total counter",
    `ort_chat_requests_total ${metrics.chatRequestsTotal.value}`,
    "# HELP ort_chat_errors_total Failed chat requests.",
    "# TYPE ort_chat_errors_total counter",
    `ort_chat_errors_total ${metrics.chatErrorsTotal.value}`,
    "# HELP ort_chat_duration_seconds_total Total chat duration (seconds).",
    "# TYPE ort_chat_duration_seconds_total counter",
    `ort_chat_duration_seconds_total ${metrics.chatDurationSumSeconds.value.toFixed(3)}`,
    "# HELP ort_chat_tokens_total Total response tokens streamed.",
    "# TYPE ort_chat_tokens_total counter",
    `ort_chat_tokens_total ${metrics.chatTokensTotal.value}`,
    "# HELP ort_active_chats Currently in-flight chat requests.",
    "# TYPE ort_active_chats gauge",
    `ort_active_chats ${metrics.activeChats.value}`,
    "# HELP ort_process_resident_memory_bytes Resident memory usage.",
    "# TYPE ort_process_resident_memory_bytes gauge",
    `ort_process_resident_memory_bytes ${process.memoryUsage().rss}`,
  );
  return `${lines.join("\n")}\n`;
}
