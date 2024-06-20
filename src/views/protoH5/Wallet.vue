<template>
  <div class="wallet-box" v-if="tableLoading">
    <loading />
  </div>
  <div class="wallet-box" v-else>
    <div class="wallet-top">
      <div class="wtop-ti">
        <span class="ti-lef">
          <svg-icon icon-class="wallet" class="icon-font icon-wallet" /> Wallet
        </span>
        <span class="ti-rig text-vbtn" @click="goDex">
          <svg-icon icon-class="group" /> DEX</span
        >
      </div>
      <van-row>
        <van-col span="12">ETH</van-col>
        <van-col span="12" class="col-old">{{
          Balance | ethFilter(4)
        }}</van-col>
      </van-row>
      <van-row v-for="item in projectIdList" :key="item.erc20Number">
        <van-col span="12"> {{ item.erc20Number }}</van-col>
        <van-col span="12" class="col-old">{{
          item.erc20Balance | balanceFilter(2)
        }}</van-col>
      </van-row>
    </div>
    <div class="wallet-bom">
      <div class="wtop-ti">
        <span class="ti-lef">
          <svg-icon icon-class="wallet" class="icon-font icon-wallet" /> ERC20
          Collectable
        </span>
        <span class="ti-rig text-vbtn" @click="setCollect">
          <svg-icon icon-class="group" /> Collect All</span
        >
      </div>
      <van-row v-for="item in canvasIdList" :key="item.erc20Number">
        <van-col span="12">{{ item.daoSymbol }}</van-col>
        <van-col span="12" class="col-old">
          {{ item.erc20Balance | balanceFilter(2) }}</van-col
        >
      </van-row>

      <div class="noCoolect" v-if="canvasIdList.length === 0">
        No collectable DAO token
      </div>
    </div>

    <van-dialog v-model="dialogCollect" :show-confirm-button="false">
      <div v-if="!isCollect">
        <div slot="title" class="dialog-title">
          <span class="dialog-icon" @click="close"
            ><van-icon name="cross"
          /></span>
        </div>
        <p class="dialog-text">Confirm to collect all token</p>
        <div class="flex-btn">
          <van-button color="#745CD4" style="width: 100%" @click="setConfirm"
            >Confirm</van-button
          >
        </div>
      </div>
      <div v-else>
        <div class="dialog-loading">
          <loading />
          <p class="dialog-text">Please continue in the wallet</p>
        </div>
      </div>
    </van-dialog>

    <van-dialog v-model="dialogSuccsess" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>

      <p class="dialog-text">Collection successful!</p>
      <!-- <div class="flex-btn">
        <van-button color="#745CD4" style="width: 100%" @click="close"
          >OK</van-button
        >
      </div> -->
    </van-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/Loading.vue";
import { walletReceived, walletUnclaimed } from "@/common/api";
import { claimMultiReward } from "@/common/walletService/services";
import { Notify } from "vant";
export default {
  components: { Loading },
  computed: {
    ...mapState(["Balance", "User", "ABI"]),
  },
  data() {
    return {
      dialogCollect: false,
      isCollect: false,
      dialogSuccsess: false,
      isSuccess: false,
      tableLoading: false,
      projectIdList: [],
      canvasIdList: [],
      daoCollect: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    goDex() {
      // this.$router.push({
      //   path: "/dex",
      // });
      // const url = location.origin + "/dex";
      // let Win = window.open();
      // Win.opener = null;
      // Win.location = url;

      const url = location.origin + "/dex";
      window.open(url, "_blank");
    },
    async getData() {
      try {
        this.tableLoading = true;

        const alist = await walletReceived();
        const blist = await walletUnclaimed();
        this.projectIdList = alist.dataList;
        this.canvasIdList = blist.data.unclaimedIncomeVos;
        this.daoCollect = blist.data;
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
      }
    },
    async setConfirm() {
      let struct = [];
      this.isCollect = true;
      if (
        this.daoCollect.canvasId2List.length > 0 ||
        this.daoCollect.projectId2List.length > 0
      ) {
        struct.push({
          protocol: this.ABI.protocol_contract,
          canvasIds: this.daoCollect.canvasId2List,
          daoIds: this.daoCollect.projectId2List,
        });
      }
      if (struct.length > 0) {
        try {
          const tx = await claimMultiReward(struct);
          const res = await tx.wait();
          this.senMsgNit(res, "collect");
          this.isCollect = false;
          this.dialogCollect = false;
          this.dialogSuccsess = true;
        } catch (error) {
          console.log(error, "error");
          const err = JSON.stringify(error);
          this.errMsgNit(err);
          this.isCollect = false;
        }
      } else {
        this.isCollect = false;
        Notify({
          message: "No collectable ERC20",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
      }
    },
    async setCollect() {
      if (this.canvasIdList.length === 0) return;

      const chain = await this.setChain();
      if (!chain) return;
      this.dialogCollect = true;
    },
    close() {
      this.dialogCollect = false;
      this.dialogSuccsess = false;
    },
  },
};
</script>

<style scoped lang="scss">
.wallet-box {
  padding: 20px;
  color: #fff;
}
.wtop-ti {
  height: 60px;
  border-radius: 6px;
  background: #282f41;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.ti-lef {
  color: #f3f3f3;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  .icon-wallet {
    font-size: 20px;
  }
}
.ti-rig {
  margin-left: auto;
}
.van-row {
  margin: 12px 12px 12px 42px;
  color: #c4c4c4;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
.col-old {
  text-align: end;
}
.noCoolect {
  color: #c4c4c4;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
  height: 42px;
  line-height: 42px;
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
</style>
