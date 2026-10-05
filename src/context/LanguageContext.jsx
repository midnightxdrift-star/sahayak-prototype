import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('sahayak_language') || 'hi';
    } catch {
      return 'hi';
    }
  });

  const setLanguage = (newLang) => {
    const langCode = (newLang === 'en' || newLang === 'hi') ? newLang : 'hi';
    setLanguageState(langCode);
    try {
      localStorage.setItem('sahayak_language', langCode);
    } catch (e) {
      console.warn("Could not save language to localStorage", e);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'hi',
      setLanguage: () => {},
      t: translations.hi
    };
  }
  return context;
}

export default LanguageContext;
