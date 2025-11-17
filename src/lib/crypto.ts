// src/lib/crypto.ts
export type Algorithm = 'AES-256-GCM' | 'AES-256-CBC';

export interface EncryptionMetadata {
  version: string;
  algorithm: Algorithm;
  kdf: 'PBKDF2';
  salt: Uint8Array;
  iterations: number;
  iv: Uint8Array;
  originalName: string;
  size: number;
  createdAt: string;
}

export interface ProgressCallback { (progress: number): void; }

export function parseEncryptedPackage(packageData: Uint8Array): {
  metadata: EncryptionMetadata;
  encryptedData: Uint8Array;
} {
  const view = new DataView(packageData.buffer);
  const metadataLength = view.getUint32(0, true);

  const metadataBytes = packageData.slice(4, 4 + metadataLength);
  const metadataJson = new TextDecoder().decode(metadataBytes);
  const parsedMetadata: any = JSON.parse(metadataJson);

  const metadata: EncryptionMetadata = {
    ...parsedMetadata,
    salt: new Uint8Array(parsedMetadata.salt),
    iv: new Uint8Array(parsedMetadata.iv)
  };

  const encryptedData = packageData.slice(4 + metadataLength);

  return { metadata, encryptedData };
}

export function createEncryptedPackage(
  encryptedData: Uint8Array,
  metadata: EncryptionMetadata
): Uint8Array {
  const metadataJson = JSON.stringify({
    ...metadata,
    salt: Array.from(metadata.salt),
    iv: Array.from(metadata.iv)
  });
  const metadataBytes = new TextEncoder().encode(metadataJson);
  const metadataLength = metadataBytes.length;

  const package_ = new Uint8Array(4 + metadataLength + encryptedData.length);
  const view = new DataView(package_.buffer);
  view.setUint32(0, metadataLength, true);
  package_.set(metadataBytes, 4);
  package_.set(encryptedData, 4 + metadataLength);
  return package_;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function encryptFile(
  file: File,
  password: string,
  algorithm: Algorithm = 'AES-256-GCM',
  onProgress?: ProgressCallback
): Promise<{ encryptedData: Uint8Array; metadata: EncryptionMetadata; packageBytes: Uint8Array }> {
  const form = new FormData();
  form.append('file', file, file.name);
  form.append('password', password);

  const res = await fetch(`${BACKEND_URL}/encrypt`, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Encrypt error: ${txt}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const packageBytes = new Uint8Array(arrayBuffer);
  const { metadata, encryptedData } = parseEncryptedPackage(packageBytes);

  onProgress?.(100);

  return { encryptedData, metadata, packageBytes };
}

export async function decryptFile(
  packageFile: File,
  password: string,
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const form = new FormData();
  form.append('file', packageFile, packageFile.name);
  form.append('password', password);

  const res = await fetch(`${BACKEND_URL}/decrypt`, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Decrypt error: ${txt}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  onProgress?.(100);
  return new Uint8Array(arrayBuffer);
}

export async function hashSha256(value: string): Promise<string> {
  const form = new FormData();
  form.append('value', value);
  const res = await fetch(`${BACKEND_URL}/hash`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error('Hash failed');
  const json = await res.json();
  return json.sha256;
}

export async function generateStrongPassword(length = 20): Promise<string> {
  const form = new FormData();
  form.append('length', String(length));
  const res = await fetch(`${BACKEND_URL}/generate-password`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error('Generate password failed');
  const json = await res.json();
  return json.password;
}
