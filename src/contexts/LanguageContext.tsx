import React, { createContext, useState, useContext } from "react";

type Lang = "en" | "hi";

const LanguageContext = createContext({
  lang: "en" as Lang,
  setLang: (l: Lang) => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
