export interface RuntimeStore {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  keys(): string[];
}

let store: RuntimeStore | null = null;

export function attachRuntimeStore(s: RuntimeStore | null): void {
  store = s;
}

export function runtimeEnv(key: string): string | undefined {
  const fromStore = store?.get(key);
  if (fromStore !== undefined && fromStore !== "") return fromStore;
  return process.env[key];
}

export function runtimeNumber(key: string): number | undefined {
  const value = runtimeEnv(key);
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function runtimeBoolean(key: string): boolean | undefined {
  const value = runtimeEnv(key);
  if (value === undefined || value === "") return undefined;
  return value !== "0" && value.toLowerCase() !== "off" && value.toLowerCase() !== "false";
}
