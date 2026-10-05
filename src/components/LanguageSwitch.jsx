import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage();

  const toggle = () => {
    const nextLang = lang === 'en' ? 'bn' : 'en';
    setLang(nextLang);
  };

  return (
    <button
      onClick={toggle}
      className="lang-switch-btn"
      aria-label="Toggle language"
      title={`Switch to ${lang === 'en' ? 'Bangla' : 'English'}`}
    >
      <span className="lang-icon">🌐</span>
      <span className="lang-text">{t('language')}</span>
    </button>
  );
}
