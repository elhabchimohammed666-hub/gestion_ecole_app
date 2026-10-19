import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('ecole_lang') || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('ecole_lang', lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Switch font family class on body
    if (lang === 'ar') {
      document.body.className = document.body.className.replace('font-sans', 'font-arabic');
      if (!document.body.className.includes('font-arabic')) {
        document.body.className += ' font-arabic';
      }
    } else {
      document.body.className = document.body.className.replace('font-arabic', 'font-sans');
      if (!document.body.className.includes('font-sans')) {
        document.body.className += ' font-sans';
      }
    }
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['ar']?.[key] || key;
  };

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
