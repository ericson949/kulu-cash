import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en';
import fr from './fr';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

// Get the device language
const locale = Localization.getLocales()[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: locale, // Use detected language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v3', // Required for Android
  });

export default i18n;
