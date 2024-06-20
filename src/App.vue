<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { contractAbi } from '@/common/api'
import WalletMixin from '@/common/walletService/WalletMixin'
export default {
  name: 'App',
  mixins: [WalletMixin],
  data() {
    return {
      clientW: document.body.clientWidth,
      clientH: document.body.clientHeight,
    }
  },
  computed: {
    ...mapState(['ABI']),
  },
  created() {
    // if (
    //   window.navigator.userAgent.toLowerCase().indexOf("android") < 0 &&
    //   window.navigator.userAgent.toLowerCase().indexOf("ios") < 0 &&
    //   window.navigator.userAgent.toLowerCase().indexOf("ipad") < 0 &&
    //   window.navigator.userAgent.toLowerCase().indexOf("iphone") < 0
    // ) {
    //   document.querySelector("body").setAttribute("style", "overflow-y: auto;");
    // }
    this.getAbiData()
    this.setLogin()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.clientW = document.body.clientWidth
        this.setClientW(this.clientW)
        this.clientH = document.body.clientHeight
        this.setClientH(this.clientH)
      })()
    }
  },
  methods: {
    ...mapMutations(['setClientW', 'setClientH', 'setABI']),
    async getAbiData() {
      if (!this.ABI) {
        const abi = await contractAbi()
        this.setABI(abi.data)
      }
    },
  },
}
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  // min-width: 1400px;
  font-family: Inter4;
  background: #1b2233;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #d9d9d9;
}
</style>
