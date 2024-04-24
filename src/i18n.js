import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import text from './assets/text.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'fr',
    resources: {
      fr: {
        translation: text,
      },
    },
  });
