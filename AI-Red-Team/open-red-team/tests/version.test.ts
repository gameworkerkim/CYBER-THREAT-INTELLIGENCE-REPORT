import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getVersion } from "../src/version.js";

describe("CLI version", () => {
  it("matches package.json", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8")) as {
      version: string;
    };
    expect(getVersion()).toBe(pkg.version);
    expect(pkg.version).toBe("0.5.0");
  });
});
