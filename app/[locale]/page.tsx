import { useTranslations } from 'next-intl';
import TodoApp from '../../components/TodoApp';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('app');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('subtitle')}
          </p>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <TodoApp />
        </div>

      </div>
    </div>
  );
}
