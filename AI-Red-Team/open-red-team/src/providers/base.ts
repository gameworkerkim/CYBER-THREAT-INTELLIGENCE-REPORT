import OpenAI from "openai";
import type { ChatMessage } from "../types.js";

export interface ProviderOptions {
  apiKey?: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatStreamCallbacks {
  onDelta?: (delta: string) => void;
  onReasoning?: (delta: string) => void;
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

  async chat(
    messages: ChatMessage[],
    cb: ChatStreamCallbacks = {},
  ): Promise<{ content: string; reasoningLength: number }> {
    try {
      return await this.chatStream(messages, cb);
    } catch (err) {
      const fallback = await this.chatOnce(messages);
      cb.onDelta?.(fallback.content);
      return { content: fallback.content, reasoningLength: fallback.reasoningLength };
    }
  }

  protected async chatStream(
    messages: ChatMessage[],
    cb: ChatStreamCallbacks,
  ): Promise<{ content: string; reasoningLength: number }> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: this.temperature,
      ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
      stream: true,
    });

    let full = "";
    let reasoningLength = 0;
    for await (const chunk of stream) {
      const delta = this.extractDelta(chunk);
      if (delta.content) {
        full += delta.content;
        cb.onDelta?.(delta.content);
      }
      if (delta.reasoning) {
        reasoningLength += delta.reasoning.length;
        cb.onReasoning?.(delta.reasoning);
      }
    }
    return { content: full, reasoningLength };
  }

  protected async chatOnce(
    messages: ChatMessage[],
  ): Promise<{ content: string; reasoningLength: number }> {
    const res = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: this.temperature,
      ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
      stream: false,
    });
    const content = res.choices[0]?.message?.content ?? "";
    return { content, reasoningLength: 0 };
  }

  protected extractDelta(chunk: OpenAI.Chat.Completions.ChatCompletionChunk): {
    content: string;
    reasoning: string;
  } {
    const delta = chunk.choices[0]?.delta as (OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta & {
      reasoning_content?: string;
    }) | undefined;
    return {
      content: delta?.content ?? "",
      reasoning: delta?.reasoning_content ?? "",
    };
  }
}
