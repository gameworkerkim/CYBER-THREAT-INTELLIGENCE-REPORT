import { bytesToHex } from "./hex";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function aesKey(): Promise<CryptoKey> {
  const raw = encoder.encode(
    process.env.MASTER_KEY ?? "heimdallr-dev-insecure-master-key",
  );
  const digest = await crypto.subtle.digest("SHA-256", raw);
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptSecret(
  plaintext: string,
): Promise<{ iv: string; ciphertext: string }> {
  const key = await aesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );
  return {
    iv: bytesToHex(iv),
    ciphertext: bytesToHex(new Uint8Array(encrypted)),
  };
}

export async function decryptSecret(
  ivHex: string,
  ciphertextHex: string,
): Promise<string> {
  const key = await aesKey();
  const iv = new Uint8Array(ivHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const ciphertext = new Uint8Array(
    ciphertextHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return decoder.decode(decrypted);
}

export function maskSecret(value: string): string {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
