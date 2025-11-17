import React from "react";

export default function HelpFAQ() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Help & FAQ</h2>
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="font-semibold">How does encryption work?</h3>
          <p>We derive an AES-256 key from your password using PBKDF2 and encrypt the file using AES-GCM.</p>
        </div>
        <div>
          <h3 className="font-semibold">Do you store my password?</h3>
          <p>No — backend only performs crypto operations and does not store passwords or files unless you configure storage.</p>
        </div>
      </div>
    </div>
  );
}
