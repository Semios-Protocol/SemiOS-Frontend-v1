<template>
  <div class="index-box">
    <van-swipe
      :height="indexHeight"
      :loop="false"
      indicator-color="white"
      class="back-swipe"
      :initial-swipe="swipe"
    >
      <van-swipe-item>
        <div class="swipe-one">
          <div class="swipe-box">
            <p class="box-p">
              Embark on a fresh new Web3 journey with your own DAO. This will
              take about 1 minute.
            </p>
            <span class="box-span">
              Notice: setting up one DAO cost <span class="noeth">0.1ETH</span>,
              only EVM gas fee now</span
            >
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swipe-two">
          <div class="swipe-box">
            <p class="box-p">
              Everybody says DAO is the future revolution of human organization
              structure, but you take the action now.
            </p>
            <span class="box-span">
              Notice: setting up one DAO cost <span class="noeth">0.1ETH</span>,
              only EVM gas fee now</span
            >
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swipe-thr">
          <div class="swipe-box">
            <p class="box-p">
              ProtoDAO allows you to launch your own DAO by deploying a whole
              series of assets of NFTs and tokens with a daily cycling block
              structure, the focal point of a true Web3 experience.
            </p>
            <span class="box-span">
              Notice: setting up one DAO cost <span class="noeth">0.1ETH</span>,
              only EVM gas fee now</span
            >
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>

    <van-dialog v-model="dialogLoading" :show-confirm-button="false">
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-title">
        Your DAO is being created, it should be confirmed on the blockchain
        shortly.
      </p>
      <p class="dialog-text">
        You are paying only for Ethereum network fees called gas, which varies
        depending on network status.
      </p>
    </van-dialog>

    <van-dialog v-model="dialogSucc" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <div><svg-icon icon-class="rect" style="font-size: 104px" /></div>
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-title">Congratulation!</p>
      <p class="dialog-text">
        You have successfully created a ProtoDAO, Now, it’s time to edit its
        profiles and invite friends. You can mint up to 5 membership NFTs and
        send 4 of them to friends. New holder can then mint another 5.
      </p>
      <div class="flex-btn">
        <van-button color="#745CD4" style="width: 100%" @click="goMember"
          >Mint Membership NFT
        </van-button>
      </div>
      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyDaoId">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <!-- <div class="icon-div">
          <span> <svg-icon icon-class="Twitter" class="icon-font" /></span>
        </div>
        <div class="icon-div">
          <span> <svg-icon icon-class="telegram" class="icon-font" /></span>
        </div> -->
      </div>
    </van-dialog>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import { daoTransactionHash } from "@/common/api";
import { Notify } from "vant";
import { mapState } from "vuex";
import { copysPro } from "@/utils";
export default {
  components: { Loading },
  data() {
    return {
      swipe: 0,
      daoName: "",
      dialogLoading: false,
      dialogSucc: false,
      timer: null,
      daoId: null,
      dialogProDao: false,
    };
  },
  computed: {
    ...mapState(["MetaMaskAddress", "User"]),
  },
  mounted() {},
  methods: {
    goMember() {
      this.$router.push({
        path: "/dao",
        query: {
          id: this.daoId,
        },
      });
    },
    copyDaoId() {
      const url = location.origin + "/dao?id=" + this.daoId;
      copysPro(url);
      Notify({
        message: "Copied!",
        color: "#F0F0F0",
        background: "#745CD4",
        duration: 3000,
      });
    },
    close() {
      this.dialogSucc = false;
      this.dialogProDao = false;
    },
    async getDaoId(res) {
      const data = await daoTransactionHash({
        transactionHash: "" + res.transactionHash,
      });
      if (data.data) {
        this.daoId = data.data;
        this.dialogLoading = false;
        // this.senMsgNit(res, "dao");
        this.dialogSucc = true;
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style scoped lang="scss">
.index-box {
  margin: 0 auto;
  color: #757575;
  display: flex;
  flex-direction: column;
}
::v-deep .van-swipe {
  flex: 1;
}
.top-card {
  margin-top: 130px;
  display: flex;
  // flex-direction: column;
  .tcard-left {
    width: 50%;
    margin-right: 20px;
    h1 {
      font-size: 56px;
      color: #424242;
      font-family: Inter7;
      // text-transform: capitalize;
      margin-bottom: 37px;
      margin-top: 36px;
      line-height: 68px;
      cursor: pointer;
    }
    // h1:hover {
    //   color: #533FA1;
    // }
    // h1:active {
    //   color: #745CD4;
    // }
    p {
      font-size: 20px;
      color: #757575;
      margin: 0;
      margin-bottom: 18px;
      line-height: 24px;
      font-family: Inter4;
    }
    .card-btns {
      margin-top: 30px;
      button {
        width: 178px;
        height: 52px;
        border-radius: 2px;
        font-size: 18px;
        font-family: Inter5;
      }
      .card-lb {
        margin-right: 30px;
        background-color: #745cd4;
        color: #fff;
        border: 1px solid #745cd4;
      }
      .card-rb {
        color: #745cd4;
        border-color: #745cd4;
        border: 1px solid #745cd4;
        background-color: #fff;
      }
    }
  }
  .tcard-right {
    width: 50%;
    margin-left: 20px;
    .card-img {
      margin-top: 16px;
      img {
        width: 100%;
        height: 436px;
        object-fit: cover;
        transition: opacity 400ms ease 0s;
      }
    }
  }
}

.el-col-6 {
  font-size: 14px;
  text-align: center;
  font-family: Inter5;
}

.center-card {
  // margin-top: 120px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 140px;
}
::v-deep .el-skeleton {
  display: flex;
  justify-content: space-between;
}

.bom-card {
  height: 392px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 150px;
  .bcard-left {
    width: 50%;
    height: 100%;
    margin-right: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h2 {
      font-size: 41px;
      color: #212121;
      margin: 0;
      margin-bottom: 16px;
      font-family: Inter5;
    }
    p {
      font-size: 20px;
      margin: 0;
      line-height: 28px;
    }
  }
  .bcard-right {
    width: 50%;
    height: 100%;
    margin-left: 60px;
  }
}
::v-deep .el-collapse {
  border-top: none !important;
}
::v-deep .el-collapse-item__header {
  font-size: 20px;
  color: #000000;
  height: 68px;
  line-height: 68px;
  font-family: Inter5;
}
::v-deep .el-collapse-item__arrow {
  font-size: 14px;
}
::v-deep .el-collapse-item__content {
  font-size: 16px;
  color: hsl(0, 0%, 46%);
  padding-bottom: 20px;
  line-height: 24px;
}
::v-deep .el-collapse {
  border-top: 0;
}
::v-deep .el-carousel__arrow {
  display: none !important;
}
.btnspan {
  cursor: pointer;
}
::v-deep .el-collapse-item__header {
  line-height: 28px !important;
}
.tcard-left {
  ::v-deep .el-carousel__container {
    height: 280px !important;
  }
  ::v-deep .el-carousel__indicators--outside {
    display: none;
  }
}
.collapse-d {
  ::v-deep .el-collapse-item__header {
    height: 90px;
  }
}
::v-deep .el-collapse-item__header.focusing:focus:not(:hover) {
  color: #000000;
}
.swipe-one,
.swipe-two,
.swipe-thr,
.swipe-four {
  height: 100%;
  display: flex;
  align-items: center;
}
.swipe-box {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  .box-p {
    color: #f3f3f3;
    text-align: center;
    font-feature-settings: "clig" off, "liga" off;
    font-family: Roboto;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;
    margin-bottom: 32px;
  }
  .box-span {
    color: #d4d4d4;
    text-align: center;
    font-feature-settings: "clig" off, "liga" off;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 21px;
  }
  .four-p {
    color: #f3f3f3;
    text-align: center;
    font-feature-settings: "clig" off, "liga" off;
    font-family: Roboto;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 30px;
    margin-bottom: 32px;
  }
  .four-span {
    color: #d4d4d4;
    text-align: center;
    font-feature-settings: "clig" off, "liga" off;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 21px;
  }
  .four-input {
    margin-bottom: 42px;
    margin-top: 12px;
    ::v-deep .van-cell {
      background-color: transparent;
      padding: 0px 14px;
    }
    ::v-deep .van-cell__value {
      line-height: 64px;
    }
    ::v-deep .van-field__control {
      caret-color: #bfbfbf;
      color: #f0f0f0;
      font-size: 52px;
      text-align: center;
    }
    ::v-deep .van-field__control--right {
      text-align: center;
    }
    // ::v-deep .van-cell__value--alone {
    //   color: F0F0F0;
    // }
    ::v-deep .van-field__body {
      border-bottom: 1px solid #bfbfbf;
    }
  }
}
.noeth {
  color: #745cd4;
  text-decoration: line-through;
}
.skip-box {
  text-align: center;
  margin-top: 12px;
  height: 80px;
  margin-bottom: 20px;
  span {
    color: #b3b5f2;
  }
  span:active {
    color: #6851be;
  }
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.to-btn {
  margin-top: 20px;
}
</style>
