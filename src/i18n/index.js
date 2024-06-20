import Vue from "vue"
import VueI18n from "vue-i18n"
import zh from './langs/zh'
import en from './langs/en'

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: sessionStorage.getItem('lang') || "ENG",
  messages: {
    'ZH': {
      ...zh
    },
    'ENG': {
      ...en
    }
  },
});

export default i18n