import React from "react";
import EncryptionFlow from "@/components/EncryptionFlow";
import DecryptionFlow from "@/components/DecryptionFlow";
import LanguageToggle from "@/components/LanguageToggle";

export default function Welcome() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Welcome to Surakshitam Secure Vault</h2>
        <LanguageToggle />
      </div>

      <p>Encrypt files locally or let our secure backend perform encryption for you.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <EncryptionFlow />
        <DecryptionFlow />
      </div>
    </div>
  );
}
