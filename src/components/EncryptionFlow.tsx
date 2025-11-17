import React, { useState } from "react";
import FileDropzone from "./FileDropzone";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { encryptFile, downloadBlob } from "@/lib/crypto";

export default function EncryptionFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");

  const handleEncrypt = async () => {
    if (!file || !password) {
      alert("Choose a file and enter password");
      return;
    }
    try {
      setStatus("Encrypting...");
      const { packageBytes, metadata } = await encryptFile(file, password, 'AES-256-GCM', (p) => setProgress(p));
      downloadBlob(new Blob([packageBytes]), (file.name ?? "file") + ".sfl");
      setStatus("Done");
      console.log("metadata", metadata);
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + (err.message || err));
    }
  };

  React.useEffect(() => {
    let s = 0;
    if (password.length >= 12) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    setScore(s);
  }, [password]);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Encrypt File</h2>
      <FileDropzone onFile={(f) => setFile(f)} />
      {file && <p className="mt-2">Selected: {file.name} ({file.size} bytes)</p>}

      <label className="block mt-4">
        <div>Password</div>
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border p-2 rounded" />
      </label>

      <PasswordStrengthMeter score={score} />

      <div className="mt-4 flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEncrypt}>Encrypt & Download</button>
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setFile(null); setPassword(""); setStatus(""); }}>Reset</button>
      </div>

      <div className="mt-4">
        <div>Progress: {progress}%</div>
        <div>Status: {status}</div>
      </div>
    </div>
  );
}
