import { gitleaksScan } from "./gitleaks.js";
import { trivyScan } from "./trivy.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");

async function main() {
  const g = await gitleaksScan({ path: fixtures, maskSecrets: true });
  console.log("gitleaks:", g.ok ? "ok/ran" : g.error, "findingCount" in g ? g.findingCount : "");

  const t = await trivyScan({ path: fixtures, maskSecrets: true, maxFindings: 5 });
  console.log("trivy:", t.ok ? "ok/ran" : t.error, "findingCount" in t ? t.findingCount : "");

  // Soft pass: not_installed is acceptable in CI without binaries
  if (!g.ok && g.error !== "not_installed" && g.error !== "scan_failed") {
    console.error("unexpected gitleaks error", g);
    process.exit(1);
  }
  if (!t.ok && t.error !== "not_installed" && t.error !== "scan_failed") {
    console.error("unexpected trivy error", t);
    process.exit(1);
  }
  console.log("smoke-tools passed (binaries optional)");
}

main();
