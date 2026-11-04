import OpenAI from "openai";
import { BaseProvider } from "./base.js";
import type { ProviderOptions } from "./base.js";

export class DeepSeekProvider extends BaseProvider {
  constructor(opts: ProviderOptions) {
    super({
      ...opts,
      baseUrl: opts.baseUrl ?? "https://api.deepseek.com/v1",
    });
  }

  get name(): "deepseek" {
    return "deepseek";
  }
}

export function createDeepSeek(opts: ProviderOptions): DeepSeekProvider {
  return new DeepSeekProvider(opts);
}

export type { ProviderOptions } from "./base.js";
export { OpenAI };
