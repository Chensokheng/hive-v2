'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    router.push(`/${newLocale}`);
    
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('switchLanguage')}:</span>
      <div className="flex space-x-1">
        {['en', 'fr', 'es'].map((lang) => (
          <button
            key={lang}
            onClick={() => switchLanguage(lang)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              locale === lang
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
