import { skilLookup } from "./skil.js";

const byId = skilLookup({ id: "control:aws-iam-mfa" });
if (!byId.ok || !("item" in byId) || !byId.item) {
  console.error("FAIL skil_lookup id", byId);
  process.exit(1);
}
console.log("OK id:", byId.item.id, byId.item.title);

const byDomain = skilLookup({ domain: "cloud" });
if (!byDomain.ok || !("count" in byDomain) || (byDomain.count ?? 0) < 1) {
  console.error("FAIL domain", byDomain);
  process.exit(1);
}
console.log("OK domain cloud count:", byDomain.count);

const list = skilLookup({ list: true });
if (!list.ok || !("count" in list) || list.count == null) {
  console.error("FAIL list", list);
  process.exit(1);
}
console.log("OK list count:", list.count);
console.log("smoke-skil passed");
