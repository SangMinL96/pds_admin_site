import i18n from "i18next";
import i18nextHttpBackend from 'i18next-http-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";

i18n
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'ko_KR',
    debug: true,
    ns: ['000'],
    defaultNS: 'special',
    backend: {
      // load from i18next-gitbook repo
      loadPath: process.env.REACT_APP_API_GW_URL+'/api/v1/langs/{{lng}}/{{ns}}',
      crossDomain: true
    }
  }, function(err, t) {
    // init set content
  });

  export default i18n;