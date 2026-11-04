import OpenAI from "openai";
import type { ChatMessage } from "../types.js";

export interface ProviderOptions {
  apiKey?: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export abstract class BaseProvider {
  protected client: OpenAI;
  protected model: string;
  protected temperature: number;
  protected maxTokens?: number;

  constructor(opts: ProviderOptions) {
    this.client = new OpenAI({
      apiKey: opts.apiKey ?? "sk-none",
      baseURL: opts.baseUrl,
    });
    this.model = opts.model;
    this.temperature = opts.temperature ?? 0.3;
    this.maxTokens = opts.maxTokens;
  }

  abstract get name(): string;

  async chat(messages: ChatMessage[], onDelta?: (delta: string) => void): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: this.temperature,
      ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
      stream: true,
    });

    let full = "";
    for await (const chunk of stream) {
      const delta = this.extractDelta(chunk);
      if (delta) {
        full += delta;
        onDelta?.(delta);
      }
    }
    return full;
  }

  protected extractDelta(chunk: OpenAI.Chat.Completions.ChatCompletionChunk): string {
    return chunk.choices[0]?.delta?.content ?? "";
  }
}
