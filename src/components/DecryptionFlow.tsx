import React, { useState } from "react";
import FileDropzone from "./FileDropzone";
import { decryptFile, parseEncryptedPackage, downloadBlob } from "@/lib/crypto";

export default function DecryptionFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleDecrypt = async () => {
    if (!file || !password) {
      alert("Select a .sfl file and enter password");
      return;
    }
    try {
      setStatus("Decrypting...");
      const pb = new Uint8Array(await file.arrayBuffer());
      const { metadata } = parseEncryptedPackage(pb);
      const decrypted = await decryptFile(file, password, (p) => setProgress(p));
      const blob = new Blob([decrypted]);
      downloadBlob(blob, metadata.originalName ?? "decrypted");
      setStatus("Done");
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + (err.message || err));
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Decrypt File</h2>
      <FileDropzone onFile={(f) => setFile(f)} />
      {file && <p className="mt-2">Selected: {file.name}</p>}

      <label className="block mt-4">
        <div>Password</div>
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border p-2 rounded" />
      </label>

      <div className="mt-4 flex gap-2">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleDecrypt}>Decrypt & Download</button>
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setFile(null); setPassword(""); setStatus(""); }}>Reset</button>
      </div>

      <div className="mt-4">
        <div>Progress: {progress}%</div>
        <div>Status: {status}</div>
      </div>
    </div>
  );
}
