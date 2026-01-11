import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./src/locales/en/translation.json";
import it from "./src/locales/it/translation.json";

const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
});

export default i18n;
