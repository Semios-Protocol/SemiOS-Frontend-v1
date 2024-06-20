<template>
  <div class="box">
    <a :href="aPush('')" class="logoclass">
      <!-- <img src="../assets/image/logov2.png" alt /> -->
      <!-- <span class="logo-text">ProtoDAO</span> -->
      <svg-icon
        icon-class="SEMIOSlogoAll"
        style="font-size: 180px; height: 60px"
      />
    </a>
    <div style="width: 20%">
      <el-input
        placeholder="Search Nodes  "
        ref="inputRef"
        v-model="query"
        @keydown.enter.native="searchData"
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
          @click="searchData"
        ></i>
      </el-input>
    </div>
    <div class="menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#1B2233"
        active-text-color="#8c91ff"
        text-color="#fff"
        :popper-append-to-body="true"
      >
        <el-submenu index="create">
          <template slot="title">
            <a :href="aPush('/setupdao')" class="astyle">
              <svg-icon icon-class="add" class="icon-font" />
            </a>
          </template>
          <el-menu-item
            class="menu-item"
            index="create"
            :style="{
              color:
                $route.name === 'create' && $route.query.type === 'dao'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/setupdao')" class="astyle">
              <svg-icon icon-class="Hd" /> Setup Nodes
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="create"
            :style="{
              color:
                $route.name === 'create' && $route.query.type === 'works'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/addWork')" class="astyle">
              <svg-icon icon-class="Hw" /> Add Works
            </a>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="collections">
          <template slot="title">
            <a :href="aPush('/collections?type=works')" class="astyle">
              <span>Explore</span>
            </a>
          </template>
          <el-menu-item
            index="collections"
            class="menu-item"
            :style="{
              color:
                $route.name === 'collections' && $route.query.type === 'works'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/collections?type=works')" class="astyle">
              <svg-icon icon-class="Hw" /> Works
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="collections"
            :style="{
              color:
                $route.name === 'collections' && $route.query.type === 'nfts'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/collections?type=nfts')" class="astyle">
              <svg-icon icon-class="Hs" /> NFTs
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="collections"
            :style="{
              color:
                $route.name === 'collections' &&
                $route.query.type === 'subnodes'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/collections?type=subNodes')" class="astyle">
              <svg-icon icon-class="subnodes" /> SubNodes
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="collections"
            :style="{
              color:
                $route.name === 'collections' &&
                $route.query.type === 'seedNodes'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/collections?type=seedNodes')" class="astyle">
              <svg-icon icon-class="seednodes" /> Seed Nodes
            </a>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="dex">
          <template slot="title">
            <a
              :href="aPush('/dex?type=burn&tab=priceTab')"
              class="astyle"
              target="_blank"
            >
              <span>Redeem</span>
            </a>
          </template>
        </el-menu-item>
        <!-- <el-submenu index="3">
          <template slot="title">
            <a :href="aPush('/rankings?type=daos')" class="astyle">
              <span>Ranking</span>
            </a>
          </template>
          <el-menu-item
            class="menu-item"
            index="rankings"
            :style="{
              color:
                $route.name === 'rankings' && $route.query.type === 'daos'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/rankings?type=daos')" class="astyle">
              <svg-icon icon-class="Hd" /> DAOs Ranking
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="rankings"
            :style="{
              color:
                $route.name === 'rankings' && $route.query.type === 'nfts'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/rankings?type=nfts')" class="astyle">
              <svg-icon icon-class="Hs" /> NFTs Ranking
            </a>
          </el-menu-item>
        </el-submenu> -->
        <el-menu-item index="5" class="nocolor" v-if="!User.address">
          <span
            style="display: flex; align-items: center"
            @click="setMenu('login')"
          >
            <svg-icon icon-class="tou" class="matc"
          /></span>
        </el-menu-item>
        <el-submenu index="5" class="nocolor" v-else>
          <template slot="title">
            <el-avatar
              :src="User.avatar"
              @click="setMenu('/personal', 'profile')"
            ></el-avatar>
          </template>
          <el-menu-item
            class="menu-item"
            index="personal"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'profile'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=profile')" class="astyle">
              <svg-icon icon-class="G1" /> Profile
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="wallet"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'wallet'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=wallet')" class="astyle">
              <svg-icon icon-class="G2" /> Wallet
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="topUpBalance"
            :style="{
              color:
                $route.name === 'personal' &&
                $route.query.type === 'topUpBalance'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=topUpBalance')" class="astyle">
              <svg-icon icon-class="topupb" /> Top-up Balance
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="topUpReward"
            :style="{
              color:
                $route.name === 'personal' &&
                $route.query.type === 'topUpReward'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=topUpReward')" class="astyle">
              <svg-icon icon-class="topupb" /> Top-up Reward
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="myDaos"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'myDaos'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=myDaos')" class="astyle">
              <svg-icon icon-class="Hd" />My Nodes
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="myWorks"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'myWorks'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=myWorks')" class="astyle">
              <svg-icon icon-class="Hw" /> My Works
            </a>
          </el-menu-item>

          <el-menu-item
            class="menu-item"
            index="daos"
            :style="{
              color:
                ($route.name === 'personal' && $route.query.type === 'daos') ||
                ($route.name === 'personal' && $route.query.type === 'works')
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=daos')" class="astyle">
              <svg-icon icon-class="G3" /> Favorite
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="holds"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'holds'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=holds')" class="astyle">
              <svg-icon icon-class="G4" /> NFT Holds
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="minted"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'minted'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a :href="aPush('/personal?type=minted')" class="astyle">
              <svg-icon icon-class="G5" /> NFT Minted
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            style="color: #424242"
            v-if="User.address"
            @click="exit"
          >
            <svg-icon icon-class="G6" /> Log Out
          </el-menu-item>
        </el-submenu>
        <el-menu-item>
          <a
            :href="aPush('/personal?type=wallet')"
            class="astyle"
            v-if="User.address"
          >
            <svg-icon icon-class="many" />
          </a>
          <span
            v-else
            style="display: flex; align-items: center"
            @click="setMenu('login')"
            ><svg-icon icon-class="many"
          /></span>
        </el-menu-item>
      </el-menu>
    </div>

    <el-dialog
      title="Welcome to Semios"
      :visible.sync="IsAcceptSign"
      :modal-append-to-body="false"
      width="412px"
      top="20vh"
      :before-close="close"
    >
      <div class="dialog-img">
        <img src="../assets/image/logo.png" alt />
      </div>
      <p class="dialog-text">
        By using Semios you agree to our
        <a
          :href="goOpenUrl('https://wiki.semios.io/english/terms-of-service')"
          target="_blank"
          style="text-decoration: none"
        >
          <span>Terms of Service</span>
        </a>
        and
        <a
          :href="goOpenUrl('https://wiki.semios.io/english/privacy-policy')"
          target="_blank"
          style="text-decoration: none"
        >
          <span>Privacy Policy</span> </a
        >.
      </p>
      <div class="flex-btn">
        <el-button
          type="primary"
          class="el-dao-btnz"
          style="width: 100%"
          @click="signData"
          >Accept and sign</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { contractAbi, logout } from '@/common/api'
import WalletMixin from '@/common/walletService/WalletMixin'
import { copys } from '@/utils'
export default {
  mixins: [WalletMixin],
  components: {},
  computed: {
    ...mapState(['MetaMaskAddress', 'ABI', 'Balance', 'User', 'IsAcceptSign']),
  },
  data() {
    return {
      activeIndex: '',
      query: '',
      starttime: 0,
      isDrb: false,
      drbData: { nextPrbStartTime: 0, proportion: 0, h: 0, m: 0, s: 0 },
      myTimeDisplay: null,
      isHover: false,
      dialogVisible: true,
    }
  },
  watch: {
    $route(to) {
      this.activeIndex = to.name
      if (to.name !== 'search' && to.name !== 'searchData') {
        this.query = ''
      }
    },
    MetaMaskAddress(cur, old) {
      if (old) {
        this.close()
      }
    },
  },
  created() {
    this.getCookieUser()
    // this.getAbiData();
    // this.getLiquidityErc20
  },
  mounted() {
    this.activeIndex = this.$route.name
  },
  methods: {
    ...mapMutations(['setABI', 'setUser', 'setERCToken', 'setIsAcceptSign']),
    async signData() {
      const sig = await this.getSig(1)
      if (sig) {
        this.setIsAcceptSign(false)
        this.getUser()
      }
    },
    close() {
      this.setIsAcceptSign(false)
      this.exit()
    },
    handleMouseLeave2() {
      this.isHover = false
      this.handleMouseLeave()
    },
    handleMouseLeave() {
      setTimeout(() => {
        if (this.isHover) return
        clearInterval(this.myTimeDisplay)
        this.myTimeDisplay = null
        this.isDrb = false
        this.drbData = { nextPrbStartTime: 0, proportion: 0, h: 0, m: 0, s: 0 }
      }, 400)
    },
    aPush(push) {
      return location.origin + push
    },
    getCookieUser() {
      const cookies = document.cookie.split('; ')
      if (cookies && cookies.length > 0 && cookies[0] !== '') {
        let json = {}
        for (let i = 0; i < cookies.length; i++) {
          let data = cookies[i].split('=')
          json[data[0]] = data[1]
        }
        json.name = json.name
          ? json.name.replace(new RegExp('_', 'g'), ' ')
          : ''
        this.setUser(json)
      }
    },
    goRoute(rou) {
      this.$router.push(rou)
    },
    goOpenUrl(url) {
      return url
    },
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
    async exit() {
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

    setMenu(path, type, tab = null) {
      if (path === 'login') {
        this.loginWallet()
        return
      }
      if (tab) {
        this.$router.push({
          path: path,
          query: {
            type: type,
            tab: tab,
          },
        })
      } else {
        this.$router.push({
          path: path,
          query: {
            type: type,
          },
        })
      }
    },
    searchData() {
      if (!this.query) return
      this.$refs.inputRef.blur()
      this.$router.push({
        path: '/search',
        query: {
          query: this.query,
        },
      })
    },
    async getAbiData() {
      if (!this.ABI) {
        const abi = await contractAbi()
        this.setABI(abi.data)
      }
    },
    goHome() {
      this.$router.push({
        path: `/`,
      })
    },
  },
}
</script>

<style scoped lang="scss">
// .textbold {
//   color: #745CD4;
//   font-family: Inter7;
// }
// .btns {
// 	margin: 0 36px;
// 	button {
// 		background: #745CD4;
// 		border: 1px solid #745CD4;
// 		border-radius: 3px;
// 		padding: 8px 12px;
// 		color: #ffffff;
// 	}
// }
.box {
  height: 60px;
  display: flex;
  // justify-content: center;
  align-items: center;
  margin: 0 auto;
  .logoclass {
    .svg-icon {
      margin: 0 36px;
    }
  }
  img {
    height: 24px;
    margin: auto 0;
    margin-right: 12px;
    cursor: pointer;
    display: block;
    margin-left: 36px;
  }
}
.el-input {
  // width: 300px;
  margin-left: auto;
  margin-right: 10px;
}
::v-deep .el-input__inner {
  border-radius: 5px;
  background: #282f41;
  border: none;
  font-size: 14px;
  color: #9e9e9e;
}
::v-deep .el-input__icon {
  font-size: 14px;
  cursor: pointer;
}
::v-deep .el-menu-item {
  font-weight: 500 !important;
  margin: 0 20px !important;
  padding: 0 !important;
  border: none !important;
  display: flex;
  align-items: center;
}
::v-deep .el-menu-item:hover {
  color: #745cd4;
}
::v-deep .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
  display: none !important;
}
::v-deep .el-submenu__title:hover {
  background-color: transparent !important;
}
::v-deep .el-submenu__title {
  font-weight: 500 !important;
  margin: 0 20px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  border: none !important;
}
::v-deep .el-menu--horizontal > .el-menu-item {
  height: 32px;
  line-height: 32px;
  background-color: transparent !important;
}
::v-deep .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 32px;
  line-height: 32px;
}
::v-deep .el-menu.el-menu--horizontal {
  border-bottom: none;
}
::v-deep .el-avatar {
  width: 24px;
  height: 24px;
}
.svg-icon {
  font-size: 24px;
}
.drahader {
  font-size: 14px;
  color: #757575;
  display: flex;
  align-items: center;

  ::v-deep .el-avatar {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
}
.dracard {
  .svg-icon {
    font-size: 14px;
    margin-right: 8px;
  }
}

.drabox-2 {
  height: 56px;
  box-sizing: border-box;
  border-bottom: 1px solid #6062aa;
  border-top: 1px solid #c5dadd;
  padding: 0 14px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #757575;
  background-color: #f8f8f8;
  .dnum,
  .dstar {
    display: block;
  }
  .dnum {
    margin-left: auto;
  }
}
.drabox-1 {
  height: 56px;
  box-sizing: border-box;
  border-bottom: 1px solid #6062aa;
  padding: 0 14px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #757575;
  background-color: #f8f8f8;
  .dnum,
  .dstar {
    display: block;
  }
  .dnum {
    margin-left: auto;
  }
}
.copyicon {
  cursor: pointer;
}
.menu-item {
  font-size: 14px;
  font-family: 'Inter4';
  color: #bbbaba !important;
  .svg-icon {
    margin-right: 12px;
    font-size: 14px;
  }
}
.menu-item:hover {
  color: #745cd4 !important;
}
.menu {
  margin-left: auto;
}
.noData {
  font-size: 14px;
  color: #757575;
  height: 240px;
  line-height: 240px;
  text-align: center;
}
.mag0 {
  margin: 0px !important;
}
.title_address {
  font-size: 12px !important;
  margin-top: 4px;
  .svg-icon {
    font-size: 12px !important;
    margin-right: 4px;
    cursor: pointer;
  }
}

// .no-title {
//   ::v-deep .el-submenu__title {
//     // border-bottom: 2px solid transparent !important;
//     color: #424242 !important;
//   }
// }
.inputCard {
  padding: 8px 0;
  h4 {
    margin: 0;
    color: #fff;
    font-size: 12px;
    padding: 0 18px;
  }
  .cardItem {
    display: flex;
    margin-top: 16px;
    cursor: pointer;
    padding: 4px 18px;
  }
  .cardItem:hover {
    background: #f5f5f5;
  }
  .cardLeft {
    display: flex;
    flex-direction: column;
  }
  .cardRight {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    color: #757575;
    font-size: 16px;
  }
  .cardLeftTwo {
    display: flex;
    align-items: center;
    img {
      object-fit: contain;
      width: 38px;
      height: 38px;
      margin: 0;
      margin-right: 24px;
    }
  }
  .cardRight {
    display: flex;
    flex-direction: column;
  }
  .itempa {
    margin: 0;
    margin-bottom: 6px;
    font-size: 16px;
    color: #757575;
  }
  .itempd {
    width: 320px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .itempb {
    margin: 0;
    font-size: 14px;
    color: #bbbaba;
  }
}
::v-deep .el-submenu__title {
  border-color: transparent !important;
}
.el-submenu {
  display: flex;
  align-items: center;
}
.dex-input {
  ::v-deep .el-input {
    width: 480px;
  }
}

.drbSelect {
  position: fixed;
  margin-top: 10px;
  border: none;
  padding: 5px 0;
  border-radius: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  width: 380px;
}
.timesvg {
  display: flex;
  align-items: center;
  .svg-icon {
    font-size: 20px;
    // margin-top: 8px;
  }
}
.time-card {
  width: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  .card-left {
    width: 44%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card-right {
    margin-left: 3%;
    width: 50%;
    h4 {
      font-size: 14px;
      color: #fff;
      font-family: Inter4;
    }
    .right-item {
      border: 1px solid #6062aa;
      margin-bottom: 12px;
      display: flex;
    }
  }
  .num-span {
    display: block;
    width: 40%;
    text-align: end;
    margin-right: 20px;
    font-size: 18px;
    color: #fff;
    font-family: Inter7;
  }
  .type-span {
    display: block;
    flex: 1;
    font-size: 14px;
    color: #fff;
    font-family: Inter4;
  }
}
.astyle {
  text-decoration: none;
  color: currentcolor;
  display: flex;
  align-items: center;
}
.logo-text {
  color: #8c91ff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  margin-right: 36px;
}
.van-dialog {
  width: 40% !important;
}
.dialog-img {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 26px;
}
</style>
