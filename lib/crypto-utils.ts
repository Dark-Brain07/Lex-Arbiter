export async function computeSha256(text: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "0x" + Array.from(new Uint8Array(32)).map(() => "00").join("");
}

export function canonicalJson(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort(), 0);
}

export function formatAddress(address?: string): string {
  if (!address) return "0x000...000";
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBps(bps?: number): string {
  if (bps === undefined || bps === null) return "0.00%";
  return `${(bps / 100).toFixed(2)}%`;
}
