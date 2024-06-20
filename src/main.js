import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
import Vant from "vant";
import "vant/lib/index.css";
import "./utils/filter.js";
import "./icons";
import "./assets/style/vanStyle.scss";
import "./assets/style/initStyle.scss";
import "./assets/style/elementStyle.scss";
import TransactionStatusMixin from "./components/TransactionStatusMixin";
import LoginMixin from "./components/LoginMixin";
// import HaltMixin from "./components/HaltMixin";
import "./utils/plugins";
import { initWeb3Onboard } from "./common/walletService/wallet";

import i18n from './i18n'
Vue.use(Vant);
Vue.use(ElementUI, { locale });
Vue.mixin(TransactionStatusMixin);
Vue.mixin(LoginMixin);
// Vue.mixin(HaltMixin);
Vue.prototype.$onboard = initWeb3Onboard;

new Vue({
  router,
  store, i18n,
  render: (h) => h(App),
}).$mount("#app");
