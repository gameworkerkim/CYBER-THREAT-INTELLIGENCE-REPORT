import { BaseProvider } from "./base.js";
import type { ProviderOptions } from "./base.js";

export class OpenWeightProvider extends BaseProvider {
  constructor(opts: ProviderOptions) {
    super({
      ...opts,
      apiKey: opts.apiKey ?? "ollama",
      baseUrl: opts.baseUrl ?? "http://localhost:11434/v1",
    });
  }

  get name(): "openweight" {
    return "openweight";
  }
}

export function createOpenWeight(opts: ProviderOptions): OpenWeightProvider {
  return new OpenWeightProvider(opts);
}

export type { ProviderOptions } from "./base.js";
