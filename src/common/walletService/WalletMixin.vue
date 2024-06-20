<script>
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import { localName } from '@/config.js'
export default {
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  mounted() {},
  methods: {
    ...mapMutations([
      'setMetaMaskAddress',
      'setNetworkId',
      'setBalance',
      'setUser',
    ]),
    async setLogin() {
      if (
        document.cookie.indexOf('user=') > -1 &&
        document.cookie.indexOf('address=') > -1
      ) {
        const previouslyConnectedWallets = JSON.parse(
          window.localStorage.getItem(localName)
        )
        if (
          previouslyConnectedWallets &&
          previouslyConnectedWallets.length > 0
        ) {
          Vue.prototype.$wallets = await Vue.prototype.$onboard.connectWallet({
            autoSelect: {
              label: previouslyConnectedWallets[0].label,
              disableModals: true,
            },
          })

          this.setStore()
          this.subscribe()
          const cookies = document.cookie.split('; ')
          if (cookies && cookies.length > 0 && cookies[0] !== '') {
            let json = {}
            for (let i = 0; i < cookies.length; i++) {
              let data = cookies[i].split('=')
              // let arr = data.filter((index) => {
              //   return index !== 0;
              // });
              json[data[0]] = data[1]
            }
            json.name = json.name
              ? json.name.replace(new RegExp('_', 'g'), ' ')
              : ''
            this.setUser(json)
          }
        }
      } else {
        window.localStorage.setItem(localName, JSON.stringify([]))
        this.logOut()
      }
    },
    async login() {
      try {
        Vue.prototype.$wallets = await Vue.prototype.$onboard.connectWallet()
        this.setStore()
        this.subscribe()
        return true
      } catch (error) {
        console.log(error, 'error')
        return false
      }
    },

    setStore() {
      const index = Vue.prototype.$wallets[0].accounts.length - 1
      console.log(Vue.prototype.$wallets, ' prototype.$wallets')
      this.setMetaMaskAddress(Vue.prototype.$wallets[0].accounts[index].address)
      this.setNetworkId(Vue.prototype.$wallets[0].chains[index].id)
      const balance = Vue.prototype.$wallets[0].accounts[index].balance
        ? Vue.prototype.$wallets[0].accounts[index].balance.ETH
        : 0
      this.setBalance(balance)

      const data = [
        {
          label: Vue.prototype.$wallets[0].label,
          address: Vue.prototype.$wallets[0].accounts[index].address,
        },
      ]
      window.localStorage.setItem(localName, JSON.stringify(data))
    },
    async logOut() {
      const [primaryWallet] = Vue.prototype.$onboard.state.get().wallets
      if (primaryWallet) {
        await Vue.prototype.$onboard.disconnectWallet({
          label: primaryWallet.label,
        })
      }
    },
    // async setChain() {
    //   try {
    //     await Vue.prototype.$onboard.setChain({
    //       chainId: Network,
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    subscribe() {
      const wallets = Vue.prototype.$onboard.state.select('wallets')
      this.onWallets = wallets.subscribe((update) => {
        if (update.length > 0) {
          const connectedWallets = update.map((item) => {
            return {
              label: item.label,
              address: item.accounts[0].address,
            }
          })
          window.localStorage.setItem(
            localName,
            JSON.stringify(connectedWallets)
          )
          this.setMetaMaskAddress(update[0].accounts[0].address)
          this.setNetworkId(update[0].chains[0].id)
          const balance = update[0].accounts[0].balance
            ? update[0].accounts[0].balance.ETH
            : 0
          this.setBalance(balance)
        } else {
          this.setMetaMaskAddress('')
          window.localStorage.setItem(localName, JSON.stringify([]))
          this.setNetworkId('')
          this.setBalance(0)
        }
      })
    },
    // beforeDestroy() {
    //   this.onWallets();
    // },
  },
}
</script>
