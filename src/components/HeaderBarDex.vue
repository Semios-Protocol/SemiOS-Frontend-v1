<template>
  <div class="box">
    <a
      :href="aPush('')"
      style="text-decoration: none; color: currentcolor"
      target="_blank"
    >
      <img src="../assets/image/logo.png" alt />
    </a>
    <div v-show="$route.name === 'dex'" class="dex-input">
      <el-input
        placeholder="Search Tokens"
        v-model="query"
        @keyup.native="querySearch($event)"
        @focus="focusInput"
        @blur="blurInput"
        slot="reference"
        ref="inputRef"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div v-show="isInput" class="inputSelect">
        <table-loading v-if="haderLoading" />
        <div v-else>
          <div class="inputCard" v-show="showQuery">
            <h4>
              {{
                queryTokens.length > 0 ? "Popular tokens" : "No tokens found."
              }}

              <span style="float: right" v-if="queryTokens.length > 0"
                >price</span
              >
            </h4>
            <div
              class="cardItem"
              v-for="item in queryTokens"
              :key="item.erc20Symbol + 'a'"
              @click="setToken(item)"
            >
              <div class="cardLeft">
                <p class="itempa">{{ item.erc20Name }}</p>
                <p class="itempb">{{ item.erc20Symbol }}</p>
              </div>
              <div class="cardRight">
                {{ item.price | bigNumFormat(12, 0.000000000001) }} ETH
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#fff"
        active-text-color="#745CD4"
        text-color="#424242"
        :popper-append-to-body="true"
      >
        <el-submenu index="99">
          <template slot="title">
            <span
              class="timesvg"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <svg-icon icon-class="hadertime" />
            </span>
          </template>
          <el-menu-item style="height: 240px; background-color: #fff">
            <div class="time-card" v-if="!isDrb">
              <table-loading />
            </div>
            <div
              class="time-card"
              v-else
              @mouseenter="handleMouseEnter2"
              @mouseleave="handleMouseLeave2"
            >
              <div class="card-left">
                <drb-charts :drbData="drbData" />
              </div>
              <div class="card-right">
                <div>
                  <h4>Approaching the end of DRB:</h4>
                  <div class="right-item">
                    <span class="num-span">{{ drbData.h }}</span>
                    <span class="type-span">HOURS</span>
                  </div>
                  <div class="right-item">
                    <span class="num-span">{{ drbData.m }}</span>
                    <span class="type-span">MINUTES</span>
                  </div>
                  <div class="right-item">
                    <span class="num-span">{{ drbData.s }}</span>
                    <span class="type-span">SECONDS</span>
                  </div>
                </div>
              </div>
            </div>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          index="index"
          v-show="$route.name === 'dex'"
          class="no-acctive"
        >
          <a :href="aPush('')" style="text-decoration: none" target="_blank">
            <span style="">Home</span>
          </a>
        </el-menu-item>
        <el-submenu
          index="royaltydex"
          :class="$route.name === 'dex' ? 'active-title' : ''"
        >
          <template slot="title">
            <a
              :href="aPush('/dex?type=swap&tab=priceTab')"
              style="text-decoration: none; color: currentcolor"
            >
              <span class="textbold">Royalty DEX</span>
            </a>
          </template>
          <el-menu-item
            class="menu-item"
            index="create"
            :style="{
              color:
                $route.name === 'dex' && $route.query.type === 'swap'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a
              :href="aPush('/dex?type=swap&tab=priceTab')"
              style="text-decoration: none; color: currentcolor"
            >
              <svg-icon icon-class="Burn" /> Swap
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="create"
            :style="{
              color:
                $route.name === 'dex' && $route.query.type === 'liquidity'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a
              :href="aPush('/dex?type=liquidity&tab=priceTab')"
              style="text-decoration: none; color: currentcolor"
            >
              <svg-icon icon-class="Liquidity" /> Liquidity
            </a>
          </el-menu-item>
          <el-menu-item
            class="menu-item"
            index="create"
            :style="{
              color:
                $route.name === 'dex' && $route.query.type === 'burn'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a
              :href="aPush('/dex?type=burn&tab=priceTab')"
              style="text-decoration: none; color: currentcolor"
            >
              <svg-icon icon-class="swaph" /> Redeem
            </a>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="5" class="nocolor">
          <template slot="title">
            <div v-if="!User.address">
              <a
                :href="aPush('/personal?type=profile')"
                target="_blank"
                style="text-decoration: none; color: currentcolor"
              >
                <svg-icon icon-class="tou" class="matc" />
              </a>
            </div>
            <a
              v-else
              :href="aPush('/personal?type=profile')"
              target="_blank"
              style="text-decoration: none; color: currentcolor"
            >
              <el-avatar :src="User.avatar"></el-avatar>
            </a>
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
            <a
              :href="aPush('/personal?type=profile')"
              style="text-decoration: none; color: currentcolor"
              target="_blank"
            >
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
            <a
              :href="aPush('/personal?type=wallet')"
              style="text-decoration: none; color: currentcolor"
              target="_blank"
            >
              <svg-icon icon-class="G2" /> Wallet
            </a>
          </el-menu-item>
          <!-- <el-menu-item
            class="menu-item"
            index="activity"
            :style="{
              color:
                $route.name === 'personal' && $route.query.type === 'activity'
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a
              :href="aPush('/personal?type=activity')"
              style="text-decoration: none; color: currentcolor"
            >
              <svg-icon icon-class="active" /> Activity
            </a>
          </el-menu-item> -->
          <el-menu-item
            class="menu-item"
            index="daos"
            :style="{
              color:
                ($route.name === 'personal' && $route.query.type === 'daos') ||
                ($route.name === 'personal' && $route.query.type === 'works') ||
                ($route.name === 'personal' && $route.query.type === 'canvases')
                  ? '#745CD4'
                  : '#424242',
            }"
          >
            <a
              :href="aPush('/personal?type=daos')"
              style="text-decoration: none; color: currentcolor"
              target="_blank"
            >
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
            <a
              :href="aPush('/personal?type=holds')"
              style="text-decoration: none; color: currentcolor"
              target="_blank"
            >
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
            <a
              :href="aPush('/personal?type=minted')"
              style="text-decoration: none; color: currentcolor"
              target="_blank"
            >
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
        <el-menu-item class="nocolor">
          <div @click="setDrawer">
            <svg-icon icon-class="many" class="matc" />
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- <div class="btns">
			<button>Connect Wallet</button>
		</div> -->

    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :append-to-body="true"
      :destroy-on-close="true"
      size="350px"
    >
      <template slot="title">
        <div class="drahader">
          <el-avatar :src="User.avatar"></el-avatar>
          <div>
            <div>
              <span v-if="User.name">{{ User.name | hasHellipsis(15) }}</span>
              <span v-else> Unnamed </span>
            </div>
            <div class="title_address" v-if="User.address">
              <span @click="copy(User.address)" class="copy">
                <svg-icon icon-class="copyhash" />
              </span>
              {{ User.address | ellipsis }}
            </div>
          </div>
        </div>
      </template>
      <div class="dracard">
        <div class="drabox-1">
          <span class="dstar"> <svg-icon icon-class="many1" />Wallet </span>
          <span class="dnum">
            <span class="btnblue fontbtn" @click="goSwap">
              <svg-icon icon-class="dex" /> Royalty DEX</span
            >
          </span>
        </div>
        <div class="drabox-blance">
          <div class="blance_item">
            <span class="dstar">ETH </span>
            <span class="dnum">{{ Balance | ethFilter(4) }}</span>
          </div>
          <div
            class="blance_item"
            v-for="item in atList"
            :key="item.erc20Number"
          >
            <span class="dstar"> {{ item.erc20Number }} </span>
            <span class="dnum">{{ item.erc20Balance | balanceFilter(2) }}</span>
          </div>
        </div>
        <!-- <div class="drabox-2">
          <span class="dstar">ETH </span>
          <span class="dnum">{{ Balance | balanceFilter }}</span>
        </div> -->
        <div class="drabox-2">
          <span class="dstar">
            <svg-icon icon-class="many1" />ERC20 Collectable
          </span>
          <span class="dnum">
            <span class="btnblue fontbtn" @click="setCollect(1)">
              <svg-icon icon-class="dex" /> Collect All</span
            >
          </span>
        </div>
        <table-loading v-if="tableLoading" />
        <div class="drabox-blance" v-if="unList.length > 0 && !tableLoading">
          <div
            class="blance_item"
            v-for="item in unList"
            :key="item.erc20Number"
          >
            <span class="dstar">{{ item.daoSymbol }} </span>
            <span class="dnum">{{ item.erc20Balance | balanceFilter(2) }}</span>
          </div>
        </div>
        <div v-if="unList.length === 0 && !tableLoading" class="noData">
          No collectable ERC20
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :title="collectTitle"
      :visible.sync="collectDialog"
      width="412px"
      :before-close="collectClose"
      :modal-append-to-body="false"
    >
      <div class="collect_box">
        <p>
          {{ !isLoading ? collectText : "Please continue in the wallet..." }}
        </p>
        <div class="collect_btns" v-if="!isLoading">
          <button class="dbtnl btnb" @click="collectClose">Cancel</button>
          <button class="dbtnr btnl" @click="confirmSet">
            {{ collectBtn }}
          </button>
        </div>
        <div class="collect_btns" v-else>
          <button class="btn_m3 btn_disable">
            <i class="el-icon-loading"></i>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import {
  contractAbi,
  walletReceived,
  walletUnclaimed,
  logout,
  drbInfo,
} from "@/common/api";
import { liquidityErc20 } from "@/common/dexApi";
import WalletMixin from "@/common/walletService/WalletMixin";
import TableLoading from "./TableLoading.vue";
import { copys } from "@/utils";
import { claimMultiReward } from "@/common/walletService/services";
import DrbCharts from "../views/protoWeb/member/DrbCharts.vue";
export default {
  mixins: [WalletMixin],
  components: {
    TableLoading,
    DrbCharts,
  },
  computed: {
    ...mapState(["MetaMaskAddress", "ABI", "Balance", "User"]),
  },
  data() {
    return {
      activeIndex: "",
      query: "",
      drawer: false,
      daoList: [],
      canvasList: [],
      tableLoading: true,
      atList: [],
      unList: [],
      canvasIdList: [],
      projectIdList: [],
      collectDialog: false,
      isLoading: false,
      collectBtn: "",
      collectText: "",
      collectTitle: "",
      isInput: false,
      showQuery: true,
      timmer: null,
      queryTokens: [],
      queryNfts: [],
      starttime: 0,
      haderLoading: false,
      daoCollect: [],
      isDrb: false,
      drbData: { nextPrbStartTime: 0, proportion: 0, h: 0, m: 0, s: 0 },
      myTimeDisplay: null,
      isHover: false,
    };
  },
  watch: {
    $route(to) {
      this.activeIndex = to.name;
      if (to.name !== "search") {
        this.query = "";
      }
      // this.isInput = false;
    },
    MetaMaskAddress(cur, old) {
      if (!cur && old) {
        this.exit();
      }
      if (cur && old) {
        this.switchAddress();
      }
    },
    drawer(cur) {
      if (!cur) {
        this.canvasList = [];
        this.daoList = [];
      }
    },
  },
  created() {
    this.getCookieUser();
    this.getAbiData();
    // this.getLiquidityErc20
  },
  mounted() {
    this.activeIndex = this.$route.query.name;
  },
  methods: {
    ...mapMutations(["setABI", "setUser", "setERCToken"]),
    handleMouseEnter2() {
      this.isHover = true;
    },
    handleMouseLeave2() {
      this.isHover = false;
      this.handleMouseLeave();
    },
    async handleMouseEnter() {
      const res = await drbInfo();
      this.drbData = { ...this.drbData, ...res.data };
      this.drbData.h = parseInt(this.drbData.nextPrbStartTime / 60 / 60);
      this.drbData.m = parseInt(
        this.drbData.nextPrbStartTime / 60 - this.drbData.h * 60
      );
      this.drbData.s = parseInt(
        this.drbData.nextPrbStartTime -
          this.drbData.h * 60 * 60 -
          this.drbData.m * 60
      );
      if (this.drbData.nextPrbStartTime >= 0) {
        this.setTimeNum();
      } else {
        clearInterval(this.myTimeDisplay);
        this.myTimeDisplay = null;
      }
      this.isDrb = true;
    },
    setTimeNum() {
      clearInterval(this.myTimeDisplay);
      this.myTimeDisplay = null;
      this.myTimeDisplay = setInterval(() => {
        this.drbData.nextPrbStartTime -= 1;
        if (this.drbData.nextPrbStartTime >= 0) {
          this.drbData.h = parseInt(this.drbData.nextPrbStartTime / 60 / 60);
          this.drbData.m = parseInt(
            this.drbData.nextPrbStartTime / 60 - this.drbData.h * 60
          );
          this.drbData.s = parseInt(
            this.drbData.nextPrbStartTime -
              this.drbData.h * 60 * 60 -
              this.drbData.m * 60
          );
        } else {
          this.handleMouseEnter();
        }
      }, 1000);
    },
    handleMouseLeave() {
      setTimeout(() => {
        if (this.isHover) return;
        clearInterval(this.myTimeDisplay);
        this.myTimeDisplay = null;
        this.isDrb = false;
        this.drbData = { nextPrbStartTime: 0, proportion: 0, h: 0, m: 0, s: 0 };
      }, 400);
    },
    setToken(val) {
      this.setERCToken(val);
      this.$router.push({
        path: "/dex",
        query: {
          type: this.$route.query.type ? this.$route.query.type : "swap",
          tab: this.$route.query.tab ? this.$route.query.tab : "priceTab",
          address: val.erc20Address,
        },
      });
      this.isInput = false;
    },
    querySearch(event) {
      this.starttime = event.timeStamp;
      let e = event;
      setTimeout(async () => {
        if (this.starttime - e.timeStamp === 0) {
          const req = {
            searchWord: this.query,
            userAddress: this.MetaMaskAddress,
          };
          const res = await liquidityErc20(req);
          this.queryTokens = res.dataList;
        }
      }, 1000);
    },
    blurInput() {
      setTimeout(() => {
        this.isInput = false;
      }, 1000);
    },
    async focusInput() {
      this.isInput = true;
      this.haderLoading = true;
      const req = {
        searchWord: this.query,
        userAddress: this.MetaMaskAddress,
      };
      const res = await liquidityErc20(req);
      this.queryTokens = res.dataList;
      this.haderLoading = false;
      this.showQuery = true;
    },
    aPush(push) {
      return location.origin + push;
    },
    getCookieUser() {
      const cookies = document.cookie.split("; ");
      if (cookies && cookies.length > 0 && cookies[0] !== "") {
        let json = {};
        for (let i = 0; i < cookies.length; i++) {
          let data = cookies[i].split("=");
          json[data[0]] = data[1];
        }
        json.name = json.name
          ? json.name.replace(new RegExp("_", "g"), " ")
          : "";
        this.setUser(json);
      }
    },
    goRoute(rou) {
      this.$router.push(rou);
    },
    goOpenUrl(url) {
      return url;
    },
    goSwap() {
      this.drawer = !this.drawer;
      this.$router.push({
        path: `/dex`,
        query: {
          type: "swap",
          tab: "priceTab",
        },
      });
      // this.$router.push({
      //   path: "/personal",
      //   query: {
      //     type: "wallet",
      //   },
      // });
    },
    copy(hash) {
      copys(hash, this, "Copied!");
    },
    async exit() {
      this.logOut();
      const data = await logout();
      if (data) {
        this.setUser({
          name: null,
          address: null,
          avatar: "",
          time: 0,
          token: null,
        });
        if (this.$route.meta.auth && this.$route.name !== "login") {
          this.$router.push({
            path: "/",
          });
        }
      }
    },

    async switchAddress() {
      this.logOut();
      const data = await logout();
      if (data) {
        this.setUser({
          name: null,
          address: null,
          avatar: "",
          time: 0,
          token: null,
        });
        this.loginWallet();
      }
    },
    setMenu(path, type, tab = null) {
      if (tab) {
        this.$router.push({
          path: path,
          query: {
            type: type,
            tab: tab,
          },
        });
      } else {
        this.$router.push({
          path: path,
          query: {
            type: type,
          },
        });
      }
    },
    setDrawer() {
      // this.drawer = !this.drawer;
      if (this.User.address) {
        this.atList = [];
        this.unList = [];
        this.canvasIdList = [];
        this.projectIdList = [];
        this.drawer = !this.drawer;
        this.getDatas();
      } else {
        this.$router.push({
          path: `/login`,
          query: {
            redirect: this.$route.fullPath,
          },
        });
      }
    },
    async getDatas() {
      try {
        this.tableLoading = true;
        const res = await walletReceived();
        this.atList = res.dataList;
        const data = await walletUnclaimed();
        this.unList = data.data.unclaimedIncomeVos;
        this.canvasIdList = data.data.canvasIdList;
        this.projectIdList = data.data.projectIdList;
        this.daoCollect = data.data;
      } catch (error) {
        console.log(error, "error");
      }
      this.tableLoading = false;
    },
    async getAbiData() {
      // const data = await erc20();
      if (!this.ABI) {
        const abi = await contractAbi();
        this.setABI(abi.data);
      }
    },
    goHome() {
      this.$router.push({
        path: `/`,
      });
    },
    setCollect() {
      this.collectBtn = "Confirm";
      this.collectText = "Confirm to collect all tokens";
      this.collectTitle = "Collect All";
      this.drawer = !this.drawer;
      this.collectDialog = true;
    },
    async confirmSet() {
      let struct = [];
      if (
        this.daoCollect.canvasId2List.length > 0 ||
        this.daoCollect.projectId2List.length > 0
      ) {
        struct.push({
          protocol: this.ABI.protocol_contract_v2,
          canvasIds: this.daoCollect.canvasId2List,
          daoIds: this.daoCollect.projectId2List,
        });
      }
      if (
        this.daoCollect.canvasIdList.length > 0 ||
        this.daoCollect.projectIdList.length > 0
      ) {
        struct.push({
          protocol: this.ABI.protocol_contract,
          canvasIds: this.daoCollect.canvasIdList,
          daoIds: this.daoCollect.projectIdList,
        });
      }
      if (struct.length > 0) {
        this.isLoading = true;
        try {
          const tx = await claimMultiReward(struct);
          const res = await tx.wait();
          this.senMsg(res, "collect");
          this.collectDialog = false;
        } catch (error) {
          console.log(error, "error");
          const err = error.toString();
          this.errMsg(err);
          this.collectDialog = false;
          this.isLoading = false;
        }
      } else {
        this.collectDialog = false;
        this.errNotif("No collectable ERC20");
      }
    },
    collectClose() {
      this.isLoading = false;
      this.collectDialog = false;
    },
  },
};
</script>

<style scoped lang="scss">
.textbold {
  color: #745cd4;
  font-family: Inter7;
}
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
  img {
    height: 30px;
    margin: auto 0;
    margin-right: 50px;
    cursor: pointer;
    display: block;
    margin-left: 36px;
  }
}
.el-input {
  width: 300px;
  margin-left: auto;
  margin-right: 10px;
}
::v-deep .el-input__inner {
  background: #f5f5f5;
  border-radius: 5px;
  border: none;
  font-size: 14px;
  color: #424242;
}
::v-deep .el-input__icon {
  font-size: 14px;
  cursor: pointer;
}
::v-deep .el-menu-item {
  font-weight: 500 !important;
  margin: 0 20px !important;
  padding: 0 !important;
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
::v-deep .el-drawer.ltr,
.el-drawer.rtl {
  margin-top: 60px;
}
// ::v-deep .el-drawer {
//   width: 296px !important;
// }
.svg-icon {
  font-size: 24px;
}
.nocolor {
  // color: #fff !important;
  border-bottom-color: #fff !important;
  ::v-deep .el-submenu__title {
    border-bottom-color: #fff !important;
  }
}
::v-deep .el-drawer__header {
  margin: 0px;
  padding: 0 14px;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #6062aa;
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
  font-family: "Inter4";
  .svg-icon {
    margin-right: 12px;
    font-size: 14px;
  }
}
.menu-item-no {
  font-size: 14px;
  font-family: "Inter4";
  color: #fff;
  .svg-icon {
    margin-right: 12px;
    font-size: 14px;
  }
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
.matc {
  margin-top: 5px;
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
.btnblue {
  color: #745cd4;
  font-weight: 600;
  cursor: pointer;
}
.drabox-blance {
  margin-left: 34px;
  padding-top: 20px;
  .blance_item {
    display: flex;
    font-size: 14px;
    font-weight: 600;
    color: #757575;
    margin-bottom: 20px;
    .dstar {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .dnum {
      margin-left: auto;
      margin-right: 14px;
    }
  }
}
.drabox_erc {
  padding: 0 14px;
  font-size: 14px;
  color: #757575;
  border-top: 1px solid #c5dadd;
  padding-bottom: 17px;
  border-bottom: 1px solid #6062aa;
  background-color: #f8f8f8;
  .erc_title {
    margin: 17px 0;
  }
  .erc_btns {
    color: #745cd4;
    font-weight: 600;
    text-align: end;
    span {
      margin-left: 12px;
      cursor: pointer;
    }
    .svg-icon {
      margin: 0;
      color: #745cd4;
    }
  }
}

.collect_box {
  p {
    margin: 0;
    font-size: 16px;
    color: #757575;
    text-align: center;
  }
  .collect_btns {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    .dbtnl {
      width: 135px;
      height: 34px;
      color: #745cd4;
      background-color: #fff;
      border: 1px solid #745cd4;
      font-size: 14px;
      margin-right: 20px;
      border-radius: 3px;
    }
    .dbtnr {
      width: 135px;
      height: 34px;
      border: 1px solid #745cd4;
      background-color: #745cd4;
      color: #ffffff;
      font-size: 14px;
      margin-left: 20px;
      border-radius: 3px;
    }
  }
}

.no-title {
  ::v-deep .el-submenu__title {
    border-bottom: 2px solid transparent !important;
    color: #424242 !important;
  }
}
.inputSelect {
  position: fixed;
  margin-top: 10px;

  border: none;
  padding: 5px 0;
  border-radius: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  width: 480px;
}
.inputCard {
  padding: 8px 0;
  h4 {
    margin: 0;
    color: #bbbaba;
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
.active-title {
  ::v-deep .el-submenu__title {
    border-color: #745cd4 !important;
  }
}
.dex-input {
  ::v-deep .el-input {
    width: 480px;
  }
}
.no-acctive {
  color: #424242 !important;
  border-bottom: none !important;
}
.timesvg {
  .svg-icon {
    font-size: 20px;
    margin-top: 8px;
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
      color: #00000073;
      font-family: Inter4;
    }
    .right-item {
      border: 1px solid #e6e7e7;
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
    color: #000000;
    font-family: Inter7;
  }
  .type-span {
    display: block;
    flex: 1;
    font-size: 14px;
    color: #00000073;
    font-family: Inter4;
  }
}
</style>
