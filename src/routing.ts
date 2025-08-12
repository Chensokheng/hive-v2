import { defineRouting } from 'next-intl/routing';

const supportedLocales = ['en', 'fr', 'es']

export type ILocales = typeof supportedLocales;


export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLocales,

  // Used when no locale matches
  defaultLocale: 'en'
});
