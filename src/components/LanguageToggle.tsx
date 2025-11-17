import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex gap-2">
      <button onClick={() => setLang("en")} className={lang === "en" ? "font-bold" : ""}>EN</button>
      <button onClick={() => setLang("hi")} className={lang === "hi" ? "font-bold" : ""}>HI</button>
    </div>
  );
}
