import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Fetch from 'i18next-fetch-backend';

function createFakeFetchJsonAnswer(data) {
  return new Response(JSON.stringify(data, null, 0), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function fetchTextOrFallback(url, option) {
  return fetch(url, option)
    .then((ans) => {
      if (!ans.ok) {
        throw new Error(`Unable to fetch ${url}`);
      }
      return ans;
    })
    .catch((e) => {
      console.warn(`Error on retrieve remote texts, use fallback texts (${e.message})`);
      // Lazy loading of fallback texts to avoid merging them with main chunk and reduce its size
      return import(/* webpackChunkName: "fallbackTexts" */ '../assets/text.json')
        .then((module) => createFakeFetchJsonAnswer(module)); // we trick i18n-fetch-backend
    });
}

i18n
  .use(initReactI18next) // react integration for i18n
  .use(Fetch) // fetch api integration for i18n to load remote texts
  .init({
    fallbackLng: 'fr',
    backend: {
      loadPath: `${APP_ENV_API_PATH}/textes?lang={{lng}}`,
      requestOptions: {
        mode: 'cors',
        credentials: 'omit',
        cache: 'default',
      },
      fetch: fetchTextOrFallback, // custom fetch call to go to fallback texts if error
    },
  }, (error) => {
    if (error) {
      console.warn('Error while initiating i18n', error);
    }
  });
