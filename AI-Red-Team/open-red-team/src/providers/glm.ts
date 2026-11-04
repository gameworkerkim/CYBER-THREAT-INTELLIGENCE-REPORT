import { BaseProvider } from "./base.js";
import type { ProviderOptions } from "./base.js";

export class GlmProvider extends BaseProvider {
  constructor(opts: ProviderOptions) {
    super({
      ...opts,
      baseUrl: opts.baseUrl ?? "https://open.bigmodel.cn/api/paas/v4",
    });
  }

  get name(): "glm" {
    return "glm";
  }
}

export function createGlm(opts: ProviderOptions): GlmProvider {
  return new GlmProvider(opts);
}

export type { ProviderOptions } from "./base.js";
