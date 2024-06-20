import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    MetaMaskAddress: "",
    IsAllPaused: 0,
    IsAllDaoPaused: 0,
    IsAllCanvasPaused: 0,
    Balance: 0,
    NetworkId: "",
    Pendings: [],
    ABI: null,
    AppType: null,
    User: {
      name: null,
      address: "",
      avatar: "",
      time: "",
      token: "",
    },
    IsAcceptSign: false,
    // User: {
    //   name: "My_damowang_xxxxxxxxxxxxxxxxxxxx",
    //   address: "0xc537a223b7fe86483d31442248c5918177526bef",
    //   avatar: "https://image-test.dao4.art/user/11.png",
    //   time: "",
    //   token: "",
    // },
    OriginalText: `This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 24 hours.`,
    ClientW: document.body.clientWidth,
    ClientH: document.body.clientHeight,
    ERCToken: {
      erc20Address: "",
      erc20Balance: "0",
      erc20Name: "",
      erc20Symbol: "",
      ethBalance: "0",
      price: "0",
    },
  },
  mutations: {
    setUser(state, val) {
      state.User = val;
    },
    setIsAcceptSign(state, val) {
      state.IsAcceptSign = val;
    },
    setIsAllPaused(state, val) {
      state.IsAllPaused = val;
    },
    setIsAllDaoPaused(state, val) {
      state.IsAllDaoPaused = val;
    },
    setIsAllCanvasPaused(state, val) {
      state.IsAllCanvasPaused = val;
    },
    setNetworkId(state, val) {
      state.NetworkId = val;
    },
    setMetaMaskAddress(state, val) {
      state.MetaMaskAddress = val ? val.toLowerCase() : "";
    },
    setBalance(state, val) {
      state.Balance = val;
    },
    setPendings(state, val) {
      state.Pendings = val;
    },
    setABI(state, val) {
      state.ABI = val;
    },
    setClientW(state, val) {
      state.ClientW = val;
    },
    setClientH(state, val) {
      state.ClientH = val;
    },
    setERCToken(state, val) {
      state.ERCToken = val;
    },
    setAppType(state, val) {
      state.AppType = val;
    },
  },
  actions: {},
  modules: {},
});
