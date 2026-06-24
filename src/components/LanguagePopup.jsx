import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

function LanguagePopup() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      setIsOpen(true);
    }
  }, []);

  const handleSelectLanguage = (lang) => {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-dialog-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full transform transition-all animate-fade-in text-center">
        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Languages className="w-10 h-10 text-yellow-600" aria-hidden="true" />
        </div>

        <h2 id="language-dialog-title" className="text-3xl font-extrabold text-gray-900 mb-2">
          {t('popup.title')}
        </h2>
        <p className="text-lg text-gray-500 mb-10">
          {t('popup.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            type="button"
            onClick={() => handleSelectLanguage('en')}
            className="flex-1 bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 text-xl font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            {t('popup.en')}
          </button>
          <button 
            type="button"
            onClick={() => handleSelectLanguage('hi')}
            className="flex-1 bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 text-xl font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            {t('popup.hi')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguagePopup;
