<template>
  <div class="box">
    <van-notify
      v-model="notifyshow"
      type="success"
      class="notify-box"
      v-if="NetworkId && networkId !== NetworkId"
    >
      <van-icon name="bell" style="margin-right: 4px" />
      <span
        >You're viewing data from the
        {{ networkId === '0xaa36a7' ? 'sepolia' : 'mainnet' }} network
        (Ethereum), but your wallet is connected to the incorrect network.
        Please switch network to
        {{ networkId === '0xaa36a7' ? 'sepolia' : 'mainnet' }} network
        (Ethereum).</span
      >
    </van-notify>
    <div class="bar-left" @click="goIndex">
      <img src="../assets/image/logo.png" alt />
      <span class="logo-text">ProtoDAO</span>
    </div>
    <div class="bar-right">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="activeName"
          @change="setUpAdd"
          :options="addOption"
        >
          <span slot="title">
            <svg-icon icon-class="add" class="icon-font" />
          </span>
        </van-dropdown-item>
      </van-dropdown-menu>
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="activeName"
          @change="goDex"
          :options="exploreOption"
        >
          <span slot="title" class="font-e"> DEX </span>
        </van-dropdown-item>
      </van-dropdown-menu>
      <div class="wallet-icon" v-if="!User.address">
        <span @click="setLogin">
          <svg-icon icon-class="user" class="icon-font icon-wallet"
        /></span>
      </div>
      <van-dropdown-menu v-else>
        <van-dropdown-item
          v-model="activeName"
          :options="userOption"
          @change="setPersonal"
        >
          <span slot="title">
            <svg-icon icon-class="userlog" class="icon-font" />
          </span>
        </van-dropdown-item>
      </van-dropdown-menu>
      <div class="wallet-icon">
        <span @click="goWallet"
          ><svg-icon icon-class="wallet" class="icon-font icon-wallet"
        /></span>
      </div>
    </div>
    <van-dialog v-model="IsAcceptSign" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        Welcome to ProtoDAO
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <div class="dialog-img">
        <img src="../assets/image/logo.png" alt />
      </div>
      <p class="dialog-text">
        By using ProtoDAO you agree to our
        <span
          @click="goOpenUrl('https://wiki.semios.io/english/terms-of-service')"
          >Terms of Service</span
        >
        and
        <span
          @click="goOpenUrl('https://wiki.semios.io/english/privacy-policy')"
          >Privacy Policy</span
        >.
      </p>
      <div class="flex-btn">
        <van-button color="#745CD4" style="width: 100%" @click="signData"
          >Accept and sign</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { logout, contractAbi, cookieInfo } from '@/common/api'

import { Network } from '../config.js'
export default {
  components: {},
  computed: {
    ...mapState([
      'MetaMaskAddress',
      'ABI',
      'Balance',
      'User',
      'IsAcceptSign',
      'NetworkId',
    ]),
  },
  data() {
    return {
      addOption: [{ text: 'Add Work', value: 'addWork' }],
      exploreOption: [{ text: 'Redeem', value: 'burn' }],
      userOption: [
        { text: 'NFT Holds', value: 'nftHolds' },
        { text: 'My Works', value: 'myWorks' },
        { text: 'My DAOs', value: 'myDaos' },
        { text: 'Log Out', value: 'logOut' },
      ],
      names: ['setupDao', 'addWork', 'burn', 'nftHolds', 'myWorks', 'myDaos'],
      proNames: ['nftHolds', 'myWorks', 'myDaos'],
      exploreNames: ['burn'],
      activeName: null,
      activeNameDex: '',
      activeNameUser: '',
      notifyshow: true,
      networkId: '',
    }
  },
  watch: {
    // activeName(cur) {
    //   if(cur==='dex'){
    //     this.activeName
    //   }
    // },
    MetaMaskAddress(cur, old) {
      if (!cur && old) {
        this.switchAddress()
      }
      if (cur && old) {
        this.switchAddress()
      }
    },
    $route(to) {
      if (to.name === 'index') {
        this.activeName =
          to.query.setupdao && to.query.setupdao === 'basicdao'
            ? 'setupDao'
            : null
        return
      }
      if (to.name === 'personal') {
        this.activeName = to.query.type
        return
      }
      if (to.name === 'workDetails' || to.name === 'dao') {
        this.activeName = to.name
        return
      }
      this.activeName = to.name
    },
  },

  created() {
    this.networkId = Network
  },
  mounted() {
    this.getAbiData()
  },
  methods: {
    ...mapMutations(['setABI', 'setUser', 'setERCToken', 'setIsAcceptSign']),

    goOpenUrl(url) {
      window.open(url, '_blank')
    },
    async switchAddress() {
      this.setIsAcceptSign(false)
      this.logOut()
      const data = await logout()
      if (data) {
        this.setUser({
          name: null,
          address: null,
          avatar: '',
          time: 0,
          token: null,
        })
        this.$router.push({
          path: '/',
        })
      }
    },
    goDex(val) {
      // this.activeName = val;
      // this.$router.push({
      //   path: "/dex",
      //   query: {
      //     type: val,
      //   },
      // });
      const url = location.origin + '/dex?type=' + val
      window.open(url, '_blank')
    },
    setUpAdd(val) {
      if (val === 'setupDao') {
        this.$router.push({
          path: `/`,
          query: {
            setupdao: 'basicdao',
          },
        })
        return
      } else {
        this.$router.push({
          path: '/' + val,
        })
      }
    },

    async signData() {
      const sig = await this.getSig(1)
      if (sig) {
        this.setIsAcceptSign(false)
        this.getUser()
      }
    },
    async getUser() {
      const user = await cookieInfo()
      this.setUser(user.data)
    },
    async getAbiData() {
      // const data = await erc20();
      if (!this.ABI) {
        const abi = await contractAbi()
        this.setABI(abi.data)
      }
    },
    async setPersonal(val) {
      if (val === 'logOut') {
        this.logOut()
        const data = await logout()
        if (data) {
          this.setUser({
            name: null,
            address: null,
            avatar: '',
            time: 0,
            token: null,
          })
          this.$router.push({
            path: '/',
          })
        }
      } else {
        // this.activeName = val;
        this.$router.push({
          path: '/personal',
          query: {
            type: val,
          },
        })
      }
    },
    goWallet() {
      if (this.User.address) {
        this.$router.push({
          path: `/wallet`,
        })
      } else {
        this.loginWallet()
      }
    },
    async close() {
      try {
        this.setIsAcceptSign(false)
        this.logOut()
        await logout()
        this.setUser({
          name: null,
          address: null,
          avatar: '',
          time: 0,
          token: null,
        })
      } catch (error) {
        console.log(error)
      }
    },
    setLogin() {
      if (this.User.address) {
        console.log(this.User)
      } else {
        this.loginWallet()
      }
    },
    goIndex() {
      this.activeName = ''
      this.$router.push({
        path: `/`,
      })
    },
    changeOption() {
      this.$router.push({
        path: `/explore`,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.box {
  height: 60px;
  width: 100%;
  display: flex;
  background: #000;
  border-bottom: 1px solid #353245;

  .bar-left {
    height: 100%;
    display: flex;
    align-items: center;
    width: 140px;
    img {
      height: 30px;
      margin-left: 15px;
      margin-right: 8px;
    }
  }
  .bar-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep .van-dropdown-menu {
  background-color: transparent;
  height: 60px;
}
[class*='van-hairline']::after {
  border-bottom: none;
}
::v-deep .van-dropdown-menu__title::after {
  display: none;
}
.logo-text {
  color: #8c91ff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}
::v-deep .van-dropdown-menu__title {
  padding: 0 !important;
}
::v-deep .van-dropdown-menu {
  height: 24px;
  margin-right: 18px;
}
.icon-font {
  font-size: 24px;
}
.wallet-icon {
  margin-right: 18px;
  width: 24px;
  height: 24px;
}
.font-e {
  color: #f3f3f3;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
}
::v-deep .van-dropdown-item {
  top: 60px !important;
}
::v-deep .van-popup {
  background-color: #f0f0f0;
}
::v-deep .van-cell {
  background-color: #282f41;
  color: #f0f0f0;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
::v-deep .van-dropdown-item__option--active {
  color: #fff;
  background-color: #424a5f;
}
::v-deep .van-cell__value {
  display: none !important;
}
::v-deep .van-cell:not(:last-child)::after {
  border: none !important;
}
::v-deep .van-cell--clickable:active {
  background-color: #424a5f;
}
.icon-wallet:active {
  opacity: 0.7;
}
.dialog-img {
  display: flex;
  margin: 12px 0;
  justify-content: center;
  img {
    height: 44px;
  }
}
.dialog-text {
  color: #f3f3f3;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  margin: 16px 0;
  span {
    color: #745cd4;
  }
}
.notify-box {
  background-color: #745cd4 !important;
  color: #f0f0f0 !important;
}
</style>
