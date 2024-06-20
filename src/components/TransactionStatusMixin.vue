<script>
import { mapMutations, mapState } from 'vuex'
import { OPEN_URL, Network, localName } from '@/config.js'
import { sig, getBalance } from '@/common/walletService/services'
import { signature, cookieInfo } from '@/common/api'
import { randomCoding } from '@/utils'
import { Notify } from 'vant'
export default {
  computed: {
    ...mapState(['MetaMaskAddress', 'User', 'NetworkId']),
  },
  methods: {
    ...mapMutations(['setUser', 'setBalance', 'setNetworkId']),

    async setChain() {
      if (this.NetworkId === Network) {
        return true
      } else {
        try {
          const success = await this.$onboard.setChain({ chainId: Network })
          return success
        } catch (error) {
          console.log(error)
          return false
        }
      }
    },
    async asyncErr() {},
    async senMsgNit(status, title = '') {
      if (title === 'dao') {
        const titletext =
          status.status || status.logs.length > 0
            ? 'The setup is successful, please open My Nodes to view.'
            : 'The setup is failed, user denied transaction signature.'
        Notify({
          message: titletext,
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 10000,
        })
      }
    },
    async senMsg(status, title = '', open = '') {
      if (!this.User.address) return false
      const type = status.status || status.logs.length > 0 ? 'success' : 'error'
      let titletext = ''
      if (title === 'dao') {
        titletext =
          status.status || status.logs.length > 0
            ? 'The setup is successful, please open My Nodes to view.'
            : 'The setup is failed, user denied transaction signature.'
      }
      if (title === 'canvas') {
        titletext =
          status.status || status.logs.length > 0
            ? 'The setup is successful, please open My Canvas to view.'
            : 'The setup is failed, user denied transaction signature.'
      }

      if (title === 'work') {
        titletext =
          status.status || status.logs.length > 0
            ? 'The work is minted successful, please open NFT Minted to view.'
            : 'The setup is failed, user denied transaction signature.'
      }
      if (title === 'collect') {
        titletext =
          status.status || status.logs.length > 0
            ? 'Collect successfully!'
            : 'Collect failed.'
      }

      if (title === 'Collect&Swap') {
        titletext =
          status.status || status.logs.length > 0
            ? 'The Collect&Swap is successful!'
            : 'The Collect&Swap has failed.'
      }

      if (title === 'Swap') {
        titletext =
          status.status || status.logs.length > 0
            ? 'The swap is successful!'
            : 'The swap has failed.'
      }
      if (title === 'Burn') {
        titletext =
          status.status || status.logs.length > 0
            ? 'The swap is successful!'
            : 'The swap has failed.'
      }
      if (title === 'Transury') {
        titletext =
          status.status || status.logs.length > 0
            ? 'Transaction completed！'
            : 'Transaction completed!'
      }
      if (title === '') {
        titletext =
          status.status || status.logs.length > 0
            ? 'Updated!'
            : 'Updated failed, please retry later!'
      }
      this.openMessageTips(titletext, status.transactionHash, type, open)
      const balance = await getBalance()
      this.setBalance(balance)
      this.dialogLoading = false
    },

    async openHash(val, path) {
      const Win = window.open()
      Win.opener = null
      Win.location = OPEN_URL + '/' + path + '/' + val
    },
    goDetailsByHash() {
      this.$router.push({
        path: `/personal`,
        query: {
          type: 'minted',
        },
      })
    },

    openMessageTips(title, hash, type, open, offset = 10, duration = 10000) {
      const _this = this
      const h = this.$createElement
      if (type === 'success') {
        this.$notify({
          position: 'bottom-right',
          dangerouslyUseHTMLString: true,
          title: title,
          type: type,
          offset: offset,
          duration: duration,
          customClass: type + 'color',
          message: open
            ? h('div', { class: 'message' }, [
                h(
                  'span',
                  {
                    style:
                      "cursor: pointer;color:#11afaf;'border-bottom': '1px solid';'text-decoration': underline;",
                    on: {
                      click: this.goDetailsByHash.bind(_this, open, hash),
                    },
                  },
                  'View'
                ),
              ])
            : '',
        })
      } else {
        this.errNotif(title)
      }
    },
    goOpen(url, type = '') {
      if (url) {
        let Win = window.open()
        Win.opener = null
        Win.location = type + url
      }
    },
    getSig(type = '') {
      const nonce =
        randomCoding(8) +
        '-' +
        randomCoding(4) +
        '-' +
        randomCoding(4) +
        '-' +
        randomCoding(4) +
        '-' +
        randomCoding(12)
      const text = `Welcome to Semios!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${this.MetaMaskAddress}\n\nNonce:\n${nonce}`
      if (this.User.time && this.User.time > 0) {
        const time = new Date().getTime() / 1000 - this.User.time
        // 86400
        if (time <= 86400) {
          return true
        } else {
          const data = type ? this.setSigDataType(text) : this.setSigData(text)
          return data
        }
      } else {
        const data = type ? this.setSigDataType(text) : this.setSigData(text)
        return data
      }
    },

    async setSigDataType(text) {
      try {
        const previouslyConnectedWallets = JSON.parse(
          window.localStorage.getItem(localName)
        )
        const signa = await sig().signMessage(text)
        if (signa) {
          const isSign = await signature({
            userAddress: previouslyConnectedWallets[0].address,
            signatureHash: signa,
            originalText: text,
          })
          const user = await cookieInfo()
          this.setUser(user.data)
          return isSign
        } else {
          return false
        }
      } catch (error) {
        console.log(error, 'error')
        Notify({
          message: 'User denied message signature.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
      }
    },
    async setSigData(text) {
      try {
        const previouslyConnectedWallets = JSON.parse(
          window.localStorage.getItem(localName)
        )
        const signa = await sig().signMessage(text)
        if (signa) {
          const isSign = await signature({
            userAddress: previouslyConnectedWallets[0].address,
            signatureHash: signa,
            originalText: text,
          })
          const user = await cookieInfo()
          this.setUser(user.data)
          return isSign
        } else {
          return false
        }
      } catch (error) {
        console.log(error, 'error')
        this.errNotif('User denied message signature.')
      }
    },
    successNotif(title) {
      this.$notify({
        position: 'bottom-right',
        dangerouslyUseHTMLString: true,
        title: title,
        type: 'success',
        offset: 10,
        duration: 10000,
        customClass: 'errorcolor',
        message: '',
      })
    },
    errNotif(title) {
      this.$notify({
        position: 'bottom-right',
        dangerouslyUseHTMLString: true,
        title: title,
        type: 'error',
        offset: 10,
        duration: 10000,
        customClass: 'errorcolor',
        message: '',
      })
    },
    errMsg(err) {
      if (err.toLowerCase().indexOf('-32000') > -1) {
        this.errNotif('You rejected the request in your wallet.')
        return
      }

      if (err.toLowerCase().indexOf('-32015') > -1) {
        this.errNotif(
          'Execution reverted. Please reach out to the collection owner to troubleshoot.'
        )
        return
      }

      if (err.toLowerCase().indexOf('-32601') > -1) {
        this.errNotif('The method does not exist / is not available.')
      }
      if (err.toLowerCase().indexOf('-32603') > -1) {
        this.errNotif(
          'Execution reverted. Please reach out to the collection owner to troubleshoot.'
        )
        return
      }
      if (err.toLowerCase().indexOf('-4001') > -1) {
        this.errNotif('You rejected the request in your wallet.')

        return
      }
      if (err.toLowerCase().indexOf('-4100') > -1) {
        this.errNotif(
          'The requested method and/or account has not been authorized.'
        )
        return
      }
      if (err.toLowerCase().indexOf('-4902') > -1) {
        this.errNotif('Requested chain has not been added.')
        return
      }
      if (err.toLowerCase().indexOf('0x60be3b59') > -1) {
        this.errNotif('Minting failed. The minting limit has been reached.')
        return
      }
      if (err.toLowerCase().indexOf('insufficient') > -1) {
        this.errNotif('Insufficient wallet funds, please try again later.')
        return
      }
      if (err.toLowerCase().indexOf('execution reverted') > -1) {
        this.errNotif('Transaction may reverted, please try again later.')
        return
      }
      if (err.toLowerCase().indexOf('transaction failed') > -1) {
        this.errNotif('Transaction may reverted, please try again later.')
        return
      }
      if (err.toLowerCase().indexOf('user rejected') > -1) {
        this.errNotif('User denied transaction.')
        return
      }
      if (err.toLowerCase().indexOf('user denied') > -1) {
        this.errNotif('User denied transaction.')
      } else {
        this.errNotif('Transaction has been cancelled, please try again later.')
      }
    },
    errMsgNit(err) {
      if (err.toLowerCase().indexOf('-32000') > -1) {
        Notify({
          message: 'You rejected the request in your wallet.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }

      if (err.toLowerCase().indexOf('-32015') > -1) {
        Notify({
          message:
            'Execution reverted. Please reach out to the collection owner to troubleshoot.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }

      if (err.toLowerCase().indexOf('-32601') > -1) {
        Notify({
          message: 'The method does not exist / is not available.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('-32603') > -1) {
        Notify({
          message:
            'Execution reverted. Please reach out to the collection owner to troubleshoot.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('-4001') > -1) {
        Notify({
          message: 'You rejected the request in your wallet.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('-4100') > -1) {
        Notify({
          message:
            'The requested method and/or account has not been authorized.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('-4902') > -1) {
        Notify({
          message: 'Requested chain has not been added.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('0x60be3b59') > -1) {
        Notify({
          message: 'Minting failed. The minting limit has been reached.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('insufficient') > -1) {
        Notify({
          message: 'Insufficient wallet funds, please try again later.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('execution reverted') > -1) {
        Notify({
          message: 'Transaction may reverted, please try again later.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('transaction failed') > -1) {
        Notify({
          message: 'Transaction may reverted, please try again later.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('user rejected') > -1) {
        Notify({
          message: 'User denied transaction.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      if (err.toLowerCase().indexOf('user denied') > -1) {
        Notify({
          message: 'User denied transaction.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
      } else {
        Notify({
          message: 'Transaction has been cancelled, please try again later.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
      }
    },
  },
}
</script>
