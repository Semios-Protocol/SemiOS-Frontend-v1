<template>
  <div class="work-box">
    <van-nav-bar title="Add Work" left-arrow @click-left="onClickLeft" />
    <p class="field-lable">Select DAO</p>
    <van-cell-group>
      <van-field
        type="textarea"
        v-model="formData.daoName"
        placeholder="DAO name"
        rows="1"
        autosize
        readonly
        clickable
        @click="showPicker = true"
      />
      <div v-if="isCanvas">
        <p class="field-lable">Mintable Works</p>
        <div class="show-num" v-if="canvasInfo.unmintedWorkAmount === 0">
          No Work Yet, Please Add
        </div>
        <div v-else>
          <div class="show-box">
            <div
              class="show-card"
              v-for="item in canvasInfo.unmintedWorkUrls"
              :key="item"
            >
              <img :src="item" alt="" />
            </div>
          </div>
          <span class="show-num"
            >{{ canvasInfo.unmintedWorkAmount }} Works</span
          >
        </div>
      </div>
      <p class="field-lable">Add Work</p>
      <div class="no-body">
        <van-field type="textarea" autosize readonly clickable>
          <van-uploader
            slot="input"
            v-model="fileList"
            :before-read="beforeRead"
            :after-read="afterRead"
            @delete="logoDelete"
          />
        </van-field>
      </div>
      <p class="field-lable">Work Description</p>
      <van-field
        v-model="formData.workDescription"
        rows="3"
        autosize
        type="textarea"
        maxlength="5000"
        placeholder="To upload work in other formats like text, audio or video, simply add a link of your work in the description."
        show-word-limit
        @focus="isSumbit = false"
        @blur="isSumbit = true"
      />
    </van-cell-group>
    <div v-if="canvasInfo.unifiedPrice">
      <van-tabs type="card" v-model="pethodType">
        <van-tab title="Unified Price" name="unifiedPrice" class="tab-left">
          <div class="tab-box">
            <p class="tab-box-title">
              The price of work will be dynamically adjusted based on the sales
              of works under the same work creator.
            </p>
            <van-row>
              <van-col span="12">
                <span class="row-left">Unified Price</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.canvasCurrentPrice }}
                  <svg-icon icon-class="ethh" />
                </span>
              </van-col>
            </van-row>
            <div class="tab-box">
              <van-row>
                <van-col span="12">
                  <span class="row-left">DAO Mint Fee</span>
                </van-col>
                <van-col span="12">
                  <span class="row-right"
                    >{{ canvasInfo.fixedDaoReserveRatio.daoMintFee }}%</span
                  >
                </van-col>
              </van-row>
              <van-row>
                <van-col span="12">
                  <span class="row-left">Builder Mint Fee</span>
                </van-col>
                <van-col span="12">
                  <span class="row-right"
                    >{{ canvasInfo.fixedDaoReserveRatio.canvasMintFee }}%</span
                  >
                </van-col>
              </van-row>
              <van-row class="row-2">
                <van-col span="12">
                  <span class="row-left">PDAO Mint Fee</span>
                </van-col>
                <van-col span="12">
                  <span class="row-right"
                    >{{ canvasInfo.fixedDaoReserveRatio.d4aMintFee }}%</span
                  >
                </van-col>
              </van-row>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div v-else>
      <van-tabs
        type="card"
        v-model="pethodType"
        v-if="this.canvasInfo.basicDao && this.canvasInfo.basicDao !== 2"
      >
        <van-tab title="DAO Price" name="daoPrice" class="tab-left">
          <div class="tab-box">
            <p class="tab-box-title">
              The price of work will be dynamically adjusted based on the sales
              of works under the same work creator.
            </p>
            <van-row>
              <van-col span="12">
                <span class="row-left">Current Price</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.canvasCurrentPrice }}
                  <svg-icon icon-class="ethh" />
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <span class="row-left">DAO Floor Price</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.daoFloorPrice }} <svg-icon icon-class="ethh" />
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <span class="row-left">DAO Mint Fee</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.daoReserveRatio.daoMintFee }} %</span
                >
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <span class="row-left">Builder Mint Fee</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.daoReserveRatio.canvasMintFee }}%
                </span>
              </van-col>
            </van-row>
            <van-row class="row-2">
              <van-col span="12">
                <span class="row-left">PDAO Mint Fee</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.daoReserveRatio.d4aMintFee }}%</span
                >
              </van-col>
            </van-row>
          </div>
        </van-tab>
        <van-tab title="Fixed Price" name="fixedPrice" class="tab-right">
          <div class="tab-box">
            <p class="tab-box-title">
              Work is listed for sale at the price you set.
            </p>
            <van-row style="display: flex; align-items: center">
              <van-col span="12">
                <span class="row-left">Fixed Price</span>
              </van-col>
              <van-col span="12">
                <span class="row-right">
                  <van-field
                    v-model="formData.fixedPrice"
                    clearable
                    type="number"
                    placeholder="Please set a price"
                    oninput="if(isNaN(value||Number(value)<0)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                  >
                    <span slot="right-icon">
                      <svg-icon icon-class="ethh" />
                    </span>
                  </van-field>
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <span class="row-left">DAO Floor Price</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.daoFloorPrice }} <svg-icon icon-class="ethh" />
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <span class="row-left">DAO Mint Fee</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.fixedDaoReserveRatio.daoMintFee }}%</span
                >
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <span class="row-left">Builder Mint Fee</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.fixedDaoReserveRatio.canvasMintFee }}%</span
                >
              </van-col>
            </van-row>
            <van-row class="row-2">
              <van-col span="12">
                <span class="row-left">PDAO Mint Fee</span>
              </van-col>
              <van-col span="12">
                <span class="row-right"
                  >{{ canvasInfo.fixedDaoReserveRatio.d4aMintFee }}%</span
                >
              </van-col>
            </van-row>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- <van-tabs
      type="card"
      v-model="pethodType"
      v-if="this.canvasInfo.basicDao && this.canvasInfo.basicDao !== 2"
    >
      <van-tab
        titlw
        <van-tab
        title="Unified Price"
        name="unifiedPrice"
        class="tab-left"
      >
        <div class="tab-box">
          <p class="tab-box-title">
            The price of work will be dynamically adjusted based on the sales of
            works under the same work creator.
          </p>
          <van-row>
            <van-col span="12">
              <span class="row-left">Current Price</span>
            </van-col>
            <van-col span="12">
              <span class="row-right"
                >{{ canvasInfo.canvasCurrentPrice }}
                <svg-icon icon-class="ethh" />
              </span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <span class="row-left">DAO Floor Price</span>
            </van-col>
            <van-col span="12">
              <span class="row-right"
                >{{ canvasInfo.daoFloorPrice }} <svg-icon icon-class="ethh" />
              </span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <span class="row-left">DAO Mint Fee</span>
            </van-col>
            <van-col span="12">
              <span class="row-right"
                >{{ canvasInfo.daoReserveRatio.daoMintFee }} %</span
              >
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <span class="row-left">Builder Mint Fee</span>
            </van-col>
            <van-col span="12">
              <span class="row-right"
                >{{ canvasInfo.daoReserveRatio.canvasMintFee }}%
              </span>
            </van-col>
          </van-row>
          <van-row class="row-2">
            <van-col span="12">
              <span class="row-left">PDAO Mint Fee</span>
            </van-col>
            <van-col span="12">
              <span class="row-right"
                >{{ canvasInfo.daoReserveRatio.d4aMintFee }}%</span
              >
            </van-col>
          </van-row>
        </div>
      </van-tab>
    </van-tabs> -->

    <div class="no-box" safe-area-inset-bottom></div>
    <div class="new-btns" v-show="isSumbit">
      <van-button
        color="#745CD4"
        style="width: 100%"
        :disabled="canvasInfo.workUri && formData.daoName ? false : true"
        v-preventReClick
        @click="addWork"
        >Submit
      </van-button>
    </div>
    <van-popup round v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        confirm-button-text="confirm"
        cancel-button-text="cancel"
        visible-item-count="5"
        ref="daopicker"
      />
    </van-popup>

    <van-dialog v-model="dialogLoading" :show-confirm-button="false">
      <div class="dialog-loading">
        <loading />
      </div>
      <!-- <p class="dialog-title">Congratulation!</p> -->
      <p class="dialog-text">
        Your work upload is being processed, it should be finished immedately.
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
        You have successfully uploaded your work. You can mint or invite others
        to mint your work to empower the DAO. Your work, once minted, count as
        membership NFT as well.
      </p>
      <div class="flex-btn">
        <van-button color="#745CD4" style="width: 100%" @click="goWork"
          >Mint & Transfer Membership NFT
        </van-button>
      </div>
      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="canvasInfo.discordLink"
            @click="goOpenUrl(canvasInfo.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="canvasInfo.twitterLink"
            @click="goOpenUrl(canvasInfo.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import {
  daoListProtodao,
  createWorkInfo,
  workCreate,
  workAuthority,
} from "@/common/api";
import { sig } from "@/common/walletService/services";
import { ethers } from "ethers";
import { Notify } from "vant";
import { mapState } from "vuex";
import Loading from "@/components/Loading.vue";
import { copysPro } from "@/utils";
export default {
  components: { Loading },
  data() {
    return {
      networkId: "",
      showPicker: false,
      columns: [],
      columnObjs: [],
      fileList: [],
      formData: {
        daoName: "",
        logoUrl: "",
        workDescription: "",
        image: null,
        fixedPrice: null,
      },
      canvasInfo: {
        unmintedWorkUrls: [],
        unmintedWorkAmount: 0,
        unmintedWorkTotal: 0,
        workUri: null,
        daoCreatorFee: 0,

        canvasCurrentPrice: 0,
        daoFloorPrice: 0,

        fixedPricedaoMintFee: 0,
        daoReserveRatio: {
          daoMintFee: 0,
          d4aMintFee: 0,
          canvasMintFee: 0,
        },
        fixedDaoReserveRatio: {
          daoMintFee: 0,
          d4aMintFee: 0,
          canvasMintFee: 0,
        },
        basicDao: 2,
      },
      isCanvas: false,
      dialogLoading: false,
      dialogSucc: false,
      seccWork: {},
      isSumbit: true,
      pethodType: "daoPrice",
    };
  },
  computed: {
    ...mapState(["MetaMaskAddress", "User"]),
  },
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    goOpenUrl(url, http = null) {
      if (http) {
        window.open(http + url, "_blank");
      } else {
        window.open(url, "_blank");
      }
    },
    goWork() {
      this.$router.push({
        path: "/workDetails",
        query: {
          id: this.seccWork.workId,
        },
      });
    },
    copyLink() {
      const url = location.origin + "/WorkDetails?id=" + this.seccWork.workId;
      // :8080/daoMember?id=7
      copysPro(url);
      Notify({
        message: "Copied!",
        color: "#F0F0F0",
        background: "#745CD4",
        duration: 3000,
      });
    },
    close() {
      this.seccWork = {};
      this.dialogSucc = false;
    },
    async addWork() {
      if (this.pethodType === "fixedPrice") {
        if (!this.formData.fixedPrice) {
          Notify({
            message: `Fixed price is below DAO floor price (${this.canvasInfo.daoFloorPrice} ETH)`,
            color: "#F0F0F0",
            background: "#745CD4",
            duration: 3000,
          });
          return;
        }
        if (
          Number(this.formData.fixedPrice) <
          Number(this.canvasInfo.daoFloorPrice)
        ) {
          Notify({
            message: `Fixed price is below DAO floor price (${this.canvasInfo.daoFloorPrice} ETH)`,
            color: "#F0F0F0",
            background: "#745CD4",
            duration: 3000,
          });
          return;
        }
        if (Number(this.formData.fixedPrice) > 10000) {
          Notify({
            message: `The amount cannot exceed 10,000`,
            color: "#F0F0F0",
            background: "#745CD4",
            duration: 3000,
          });
          return;
        }
      }
      if (this.User.address) {
        const chain = await this.setChain();
        if (!chain) return;
        const idx = this.columns.indexOf(this.formData.daoName);
        const id = this.columnObjs[idx].daoId;
        const res = await createWorkInfo({ daoId: id });
        this.canvasInfo = res.data;
        const chainID = await sig().getChainId();
        const isSig = await this.getSig(1);
        if (!isSig) return;
        const domain = {
          name: "ProtoDaoProtocol",
          version: "1",
          chainId: chainID,
          verifyingContract: this.canvasInfo.protocolContract,
        };
        const types = {
          MintNFT: [
            { name: "canvasID", type: "bytes32" },
            { name: "tokenURIHash", type: "bytes32" },
            { name: "flatPrice", type: "uint256" },
          ],
        };
        const value = {
          canvasID: this.canvasInfo.canId,
          tokenURIHash: ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(this.canvasInfo.workUri)
          ),
          flatPrice:
            this.pethodType === "daoPrice" || this.pethodType === "unifiedPrice"
              ? 0
              : ethers.utils.parseEther(this.formData.fixedPrice + ""),
          // flatPrice: ethers.utils.parseEther(0.01 + ""),
        };
        try {
          this.dialogLoading = true;
          const signature = await sig()._signTypedData(domain, types, value);
          this.formData.createSignHash = signature;
          this.formData.workUriRandom = this.canvasInfo.workUriRandom;
          const idx = this.columns.indexOf(this.formData.daoName);
          const id = this.columnObjs[idx].daoId;
          this.formData.daoId = id;
          this.formData.canvasId = this.canvasInfo.canId;
          if (
            this.pethodType === "daoPrice" ||
            this.pethodType === "unifiedPrice"
          ) {
            this.formData.fixedPrice = null;
            this.formData.priceType = 0;
          }
          this.formData.priceType =
            this.pethodType === "daoPrice" || this.pethodType === "unifiedPrice"
              ? 0
              : 1;
          const isWork = await workAuthority({ daoId: this.formData.daoId });
          if (!isWork.data.createCanvas) {
            this.dialogLoading = false;
            Notify({
              message: "You are ineligible to add works.",
              color: "#F0F0F0",
              background: "#745CD4",
              duration: 3000,
            });
            return;
          }
          const res = await workCreate(this.formData);
          if (res.resultCode === 100) {
            this.seccWork = res.data;
            this.dialogLoading = false;
            this.dialogSucc = true;
            this.formData.image = null;
            this.formData.logoUrl = null;
            this.formData.workDescription = "";
            this.formData.image = null;
            this.formData.createSignHash = null;
            this.formData.workUriRandom = null;
            this.formData.daoId = null;
            this.formData.canvasId = null;
            this.formData.flatPrice = null;
            this.fileList = [];
            this.onConfirm(this.formData.daoName);
            // this.selectConvasInfo(this.formData.canvasId);
            // this.$refs.ruleFormWorks.clearValidate();
          } else {
            this.dialogLoading = false;
            // this.errNotif(data.resultDesc);
          }
        } catch (error) {
          Notify({
            message: "User denied message signature.",
            color: "#F0F0F0",
            background: "#745CD4",
            duration: 3000,
          });
          this.dialogLoading = false;
          return;
        }
      } else {
        this.loginWallet();
      }
    },
    async getData() {
      const data = await daoListProtodao();
      this.columns = data.dataList.map((item) => item.daoName);
      this.columnObjs = data.dataList;
      if (this.$route.query.id) {
        const fileObj = data.dataList.filter(
          (item) => item.daoId === this.$route.query.id
        );
        this.formData.daoName = fileObj.length > 0 ? fileObj[0].daoName : "";
        setTimeout(() => {
          this.onConfirm(this.formData.daoName);
        }, 500);
      }
    },
    beforeRead(file) {
      const typs = ["image/png", "image/jpeg", "image/gif", "image/jpg"];
      const isJPG = typs.indexOf(file.type) > -1;
      if (!isJPG) {
        Notify({
          message: "Invalid file type",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return false;
      }

      const isLt = file.size / 1024 / 1024 < 20;
      if (!isLt) {
        Notify({
          message: "File size exceeds limit",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return false;
      }
      return true;
    },
    afterRead(files) {
      const URL = window.URL || window.webkitURL;
      this.formData.logoUrl = URL.createObjectURL(new Blob([files.file]));
      this.formData.image = files.file;
    },
    logoDelete() {
      this.formData.logoUrl = "";
      this.formData.image = null;
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    async onConfirm(value) {
      this.formData.daoName = value;
      this.showPicker = false;
      const idx = this.columns.indexOf(this.formData.daoName);
      const id = this.columnObjs[idx].daoId;
      const res = await createWorkInfo({ daoId: id });
      this.canvasInfo = res.data;
      this.pethodType = this.canvasInfo.unifiedPrice
        ? "unifiedPrice"
        : this.canvasInfo.basicDao === 1
        ? "daoPrice"
        : "fixedPrice";
      this.formData.fixedPrice = this.canvasInfo.unifiedPrice
        ? this.canvasInfo.canvasCurrentPrice
        : this.canvasInfo.basicDao === 2
        ? 0.01
        : null;
      this.isCanvas = true;
    },
  },
};
</script>
<style scoped lang="scss">
.work-box {
  padding: 0 20px;
  overflow-y: auto;
  ::v-deep .van-tabs {
    margin-top: 20px !important;
    margin-bottom: 150px;
  }
}
::v-deep .van-cell {
  background-color: transparent;
}
::v-deep .van-cell-group {
  background-color: transparent;
}
.show-box {
  display: flex;
  margin-top: 12px;
  margin-bottom: 6px;
}
.show-card {
  width: 104px;
  height: 104px;
  margin-right: 16px;
  border-radius: 2px;
  img {
    // object-fit: cover;
    height: 100%;
    width: 100%;
  }
}
.show-num {
  color: #f3f3f3;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
.no-body {
  ::v-deep .van-cell {
    border: none !important;
    padding: 0px !important;
  }
  ::v-deep .van-field__textarea-wrap .van-field {
    background-color: transparent;
    padding: 0;
    border: none;
  }
  ::v-deep .van-uploader__wrapper {
    margin: 0;
  }
  ::v-deep .van-uploader__wrapper {
    width: 104px;
    height: 104px;
  }
  ::v-deep .van-uploader__upload {
    width: 104px;
    height: 104px;
    background-color: transparent;
    margin: 0;
    border: 1px dashed #6062aa;
    border-radius: 5px;
  }
  ::v-deep .van-uploader__input {
    width: 104px;
    height: 104px;
  }
  ::v-deep .van-uploader__preview {
    height: 100%;
    width: 100%;
    margin: 0;
  }
  ::v-deep .van-uploader__preview-image {
    height: 100%;
    width: 100%;
  }
  ::v-deep .van-uploader__preview-delete {
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 0 14px;
  }
  ::v-deep .van-image__img {
    border-radius: 2px;
  }
  ::v-deep .van-uploader__file {
    width: 104px;
    height: 104px;
    border-radius: 2px;
    background-color: transparent;
    border: 1px dashed #353245;
  }
  ::v-deep .van-uploader__file-status {
    width: 104px;
    height: 104px;
    border-radius: 2px;
    background-color: transparent;
  }
}
.no-box {
  height: 100px;
}
.field-lable {
  color: #fff;
  margin: 0;
  color: #999;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 6px !important;
  margin-top: 20px !important;
}

.van-cell {
  border: 1px solid #6062aa;
  border-radius: 5px !important;
}
.van-cell::after {
  display: none;
}

.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.tab-box-title {
  color: #757575;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}
.van-row {
  color: #f0f0f0;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 24px;
}
.row-right {
  float: right;
  ::v-deep .van-field__right-icon {
    padding: 0;
  }
}
.row-2 {
  color: #757575;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}
</style>
