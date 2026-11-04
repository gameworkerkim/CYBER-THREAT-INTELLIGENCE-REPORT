import { describe, expect, it } from "vitest";
import { BaseProvider } from "../src/providers/base.js";
import type { ChatMessage } from "../src/types.js";

class FailingStreamProvider extends BaseProvider {
  constructor() {
    super({ model: "mock", apiKey: "x", baseUrl: "http://mock" });
  }
  get name() {
    return "deepseek" as const;
  }
  protected override async chatStream(): Promise<{ content: string; reasoningLength: number }> {
    throw new Error("stream exploded");
  }
  protected override async chatOnce(_messages: ChatMessage[]): Promise<{ content: string; reasoningLength: number }> {
    return { content: "non-stream fallback", reasoningLength: 0 };
  }
}

describe("BaseProvider", () => {
  it("falls back to a non-streaming call when streaming fails", async () => {
    const provider = new FailingStreamProvider();
    const deltas: string[] = [];
    const result = await provider.chat([{ role: "user", content: "hi" }], {
      onDelta: (d) => deltas.push(d),
    });
    expect(result.content).toBe("non-stream fallback");
    expect(deltas.join("")).toContain("non-stream fallback");
  });

  it("extracts reasoning_content from deltas", () => {
    const provider = new FailingStreamProvider();
    const chunk = {
      choices: [
        {
          index: 0,
          delta: { content: "answer", reasoning_content: "think think" },
          finish_reason: null,
        },
      ],
    };
    const extracted = provider["extractDelta"](chunk as never);
    expect(extracted.content).toBe("answer");
    expect(extracted.reasoning).toBe("think think");
  });
});
