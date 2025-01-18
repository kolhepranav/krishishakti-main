// components/GoogleTranslate.js
import { useEffect, useState } from 'react';
import { getCookie, setCookie, hasCookie } from 'cookies-next';

const languages = [
  { label: 'English', value: '/auto/en' },
  { label: 'Русский', value: '/auto/ru' },
  { label: 'Polski', value: '/auto/pl' },
  { label: 'हिन्दी', value: '/auto/hi' }, // Hindi
  { label: 'मराठी', value: '/auto/mr' }, // Marathi
  { label: 'ಕನ್ನಡ', value: '/auto/kn' }, // Kannada
  // Add more languages as needed
];

const GoogleTranslate = () => {
  const [selected, setSelected] = useState('/auto/en');

  useEffect(() => {
    const addScript = document.createElement('script');
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'auto',
          autoDisplay: false,
          includedLanguages: 'en,ru,pl,hi,mr,kn', // Add more languages as needed
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    if (hasCookie('googtrans')) {
      setSelected(getCookie('googtrans'));
    }
  }, []);

  const handleLanguageChange = (e) => {
    const langValue = e.target.value;
    setCookie('googtrans', langValue);
    setSelected(langValue);
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
        Select Language:
      </label>
      <select
        id="language-select"
        value={selected}
        onChange={handleLanguageChange}
        className="mt-1 block w-64 h-12 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GoogleTranslate;