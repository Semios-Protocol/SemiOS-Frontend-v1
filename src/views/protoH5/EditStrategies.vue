<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="dao-box" v-else>
    <van-nav-bar
      title="Edit Nodes Strategies"
      left-arrow
      @click-left="onClickLeft"
    />

    <div>
      <div class="black-box">
        <span><van-icon name="question-o" /></span> The order of strategies in
        the list reflects their priority, with the uppermost strategy having a
        higher priority.
      </div>
      <p class="field-lable">Add Work</p>
      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Blacklist Address</p>
        <div v-if="workBlackList.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newWorkBlackList"
            :key="item + idx"
          >
            <div class="item-left">{{ item | ellipsis(15, 15) }}</div>
            <div class="item-right">
              <span @click="deleteBlackAndWhiteAddress(idx, 'workBlack')">
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="workBlackList.length > 3">
          <span v-show="!isWorkBlack" @click="isWorkBlack = !isWorkBlack"
            >See More <van-icon name="arrow-down"
          /></span>
          <span v-show="isWorkBlack" @click="isWorkBlack = !isWorkBlack"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="workBlackShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="workBlackShow" position="bottom">
          <div class="popup-zd">
            <p>Blacklist Address</p>
            <van-field
              v-model="formData.workBlackAddress"
              clearable
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addBlackAndWhiteAddress('workBlack')"
                :disabled="formData.workBlackAddress ? false : true"
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Whitelist Address</p>
        <div v-if="workWhiteList.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newWorkWhiteList"
            :key="item + idx"
          >
            <div class="item-left">{{ item | ellipsis(15, 15) }}</div>
            <div class="item-right">
              <span @click="deleteBlackAndWhiteAddress(idx, 'workWhite')">
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="workWhiteList.length > 3">
          <span v-show="!isWorkWhite" @click="isWorkWhite = !isWorkWhite"
            >See More <van-icon name="arrow-down"
          /></span>
          <span v-show="isWorkWhite" @click="isWorkWhite = !isWorkWhite"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="workWhiteShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="workWhiteShow" position="bottom">
          <div class="popup-zd">
            <p>Whitelist Address</p>
            <van-field
              v-model="formData.workWhiteAddress"
              clearable
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addBlackAndWhiteAddress('workWhite')"
                :disabled="formData.workWhiteAddress ? false : true"
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Whitelist ERC-721</p>
        <div v-if="workERC721List.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newWorkERC721List"
            :key="item + idx"
          >
            <div class="item-left">{{ item | ellipsis(15, 15) }}</div>
            <div class="item-right">
              <span @click="deleteBlackAndWhiteAddress(idx, 'workERC721')">
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="workERC721List.length > 3">
          <span v-show="!isWorkERC721" @click="isWorkERC721 = !isWorkERC721"
            >See More <van-icon name="arrow-down"
          /></span>
          <span v-show="isWorkERC721" @click="isWorkERC721 = !isWorkERC721"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="workERC721Show = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="workERC721Show" position="bottom">
          <div class="popup-zd">
            <p>Whitelist ERC-721</p>
            <van-field
              v-model="formData.workERC721Address"
              clearable
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addERC721Address('workERC721')"
                :disabled="
                  formData.workERC721Address && !erc721Btn ? false : true
                "
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <p class="field-lable">Minting</p>
      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Blacklist Address</p>
        <div v-if="mintingBlackList.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newMintingBlackList"
            :key="item + idx"
          >
            <div class="item-left">{{ item | ellipsis(15, 15) }}</div>
            <div class="item-right">
              <span @click="deleteBlackAndWhiteAddress(idx, 'mintingBlack')">
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="mintingBlackList.length > 3">
          <span
            v-show="!isMintingBlack"
            @click="isMintingBlack = !isMintingBlack"
            >See More <van-icon name="arrow-down"
          /></span>
          <span
            v-show="isMintingBlack"
            @click="isMintingBlack = !isMintingBlack"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="mintingBlackShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="mintingBlackShow" position="bottom">
          <div class="popup-zd">
            <p>Blacklist Address</p>
            <van-field
              v-model="formData.mintingBlackAddress"
              clearable
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addBlackAndWhiteAddress('mintingBlack')"
                :disabled="formData.mintingBlackAddress ? false : true"
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Whitelist Address With Max Minting</p>
        <div v-if="mintingWhiteMaxList.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newMintingWhiteMaxList"
            :key="item + idx"
          >
            <div class="item-left">
              <p class="item-p1">{{ item.address | ellipsis(15, 15) }}</p>
              <p class="item-p2">Amount:{{ item.amount }}</p>
            </div>
            <div class="item-right">
              <span
                @click="deleteMintingAddressMaxAmount(idx, 'mintingWhiteMax')"
              >
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="mintingWhiteMaxList.length > 3">
          <span
            v-show="!isMintingWhiteMax"
            @click="isMintingWhiteMax = !isMintingWhiteMax"
            >See More <van-icon name="arrow-down"
          /></span>
          <span
            v-show="isMintingWhiteMax"
            @click="isMintingWhiteMax = !isMintingWhiteMax"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="mintingWhiteMaxShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="mintingWhiteMaxShow" position="bottom">
          <div class="popup-zd">
            <p>Address</p>
            <van-field
              v-model="formData.mintingWhiteMaxAddress"
              clearable
              placeholder="Please"
            >
            </van-field>
            <p>Max Minting Amount</p>
            <van-field
              v-model="formData.mintingWhiteMaxAmount"
              clearable
              type="digit"
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addMintingAddressMaxAmount('mintingWhiteMax')"
                :disabled="
                  formData.mintingWhiteMaxAddress &&
                  formData.mintingWhiteMaxAmount
                    ? false
                    : true
                "
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Whitelist Address With Unlimited Minting</p>
        <div v-if="mintingUnlimitedList.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newMintingUnlimitedList"
            :key="item + idx"
          >
            <div class="item-left">{{ item | ellipsis(15, 15) }}</div>
            <div class="item-right">
              <span
                @click="deleteBlackAndWhiteAddress(idx, 'mintingUnlimited')"
              >
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="mintingUnlimitedList.length > 3">
          <span
            v-show="!isMintingUnlimited"
            @click="isMintingUnlimited = !isMintingUnlimited"
            >See More <van-icon name="arrow-down"
          /></span>
          <span
            v-show="isMintingUnlimited"
            @click="isMintingUnlimited = !isMintingUnlimited"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="mintingUnlimitedShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="mintingUnlimitedShow" position="bottom">
          <div class="popup-zd">
            <p>Whitelist Address With Unlimited Minting</p>
            <van-field
              v-model="formData.mintingUnlimitedAddress"
              clearable
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addBlackAndWhiteAddress('mintingUnlimited')"
                :disabled="formData.mintingUnlimitedAddress ? false : true"
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Whitelisted ERC-721 With Max Minting</p>
        <div v-if="mintingERC721MaxList.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newMintingERC721MaxList"
            :key="item + idx"
          >
            <div class="item-left">
              <p class="item-p1">{{ item.address | ellipsis(15, 15) }}</p>
              <p class="item-p2">Amount:{{ item.amount }}</p>
            </div>
            <div class="item-right">
              <span
                @click="deleteMintingAddressMaxAmount(idx, 'mintingERC721Max')"
              >
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="mintingERC721MaxList.length > 3">
          <span
            v-show="!isMintingERC721Max"
            @click="isMintingERC721Max = !isMintingERC721Max"
            >See More <van-icon name="arrow-down"
          /></span>
          <span
            v-show="isMintingERC721Max"
            @click="isMintingERC721Max = !isMintingERC721Max"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="mintingERC721MaxShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="mintingERC721MaxShow" position="bottom">
          <div class="popup-zd">
            <p>Address</p>
            <van-field
              v-model="formData.mintingERC721MaxAddress"
              clearable
              placeholder="Please"
            >
            </van-field>
            <p>Max Minting Amount</p>
            <van-field
              v-model="formData.mintingERC721MaxAmount"
              clearable
              type="digit"
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addMintingAddressMaxAmount('mintingERC721Max', 1)"
                :disabled="
                  formData.mintingERC721MaxAddress &&
                  formData.mintingERC721MaxAmount &&
                  !erc721Btn
                    ? false
                    : true
                "
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Whitelist ERC-721 With Unlimited Minting</p>
        <div v-if="mintingERC721List.length > 0">
          <div
            class="strategie-item"
            v-for="(item, idx) in newMintingERC721List"
            :key="item + idx"
          >
            <div class="item-left">{{ item | ellipsis(15, 15) }}</div>
            <div class="item-right">
              <span @click="deleteBlackAndWhiteAddress(idx, 'mintingERC721')">
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="all-btn" v-if="mintingERC721List.length > 3">
          <span
            v-show="!isMintingERC721"
            @click="isMintingERC721 = !isMintingERC721"
            >See More <van-icon name="arrow-down"
          /></span>
          <span
            v-show="isMintingERC721"
            @click="isMintingERC721 = !isMintingERC721"
            >See Less <van-icon name="arrow-up"
          /></span>
        </div>
        <div class="strategie-btn" @click="mintingERC721Show = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="mintingERC721Show" position="bottom">
          <div class="popup-zd">
            <p>Whitelist ERC-721 With Unlimited Minting</p>
            <van-field
              v-model="formData.mintingERC721Address"
              clearable
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addERC721Address('mintingERC721')"
                :disabled="
                  formData.mintingERC721Address && !erc721Btn ? false : true
                "
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="black-box box-two margin-b20">
        <p class="field-lable-two">Unified Minting Cap For DAO</p>
        <div v-if="unifiedMintingCap">
          <div class="strategie-item">
            <div class="item-left">
              Unified Minting Cap For DAO : {{ unifiedMintingCap }}
            </div>
            <div class="item-right">
              <span @click="deleteUnifiedMintingCap">
                <van-icon name="close"
              /></span>
            </div>
          </div>
        </div>
        <div class="strategie-btn" @click="unifiedMintingCapShow = true">
          <van-icon name="plus" />
        </div>
        <van-popup round v-model="unifiedMintingCapShow" position="bottom">
          <div class="popup-zd">
            <p>Unified Minting Cap For DAO</p>
            <van-field
              v-model="formData.unifiedMintingCap"
              clearable
              type="digit"
              placeholder="Please"
            >
            </van-field>
            <div class="pop-btn">
              <van-button
                color="#745CD4"
                style="width: 100%"
                v-preventReClick
                @click="addUnifiedMintingCap"
                :disabled="formData.unifiedMintingCap ? false : true"
                >Add
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>
    </div>

    <div class="no-box"></div>
    <div class="new-btns">
      <van-button
        color="#745CD4"
        style="width: 100%"
        safe-area-inset-bottom
        v-preventReClick
        :disabled="initData.basicDao !== 1"
        @click="create"
        >Submit
      </van-button>
    </div>

    <van-dialog v-model="dialogLoading" :show-confirm-button="false">
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">
        Your change is being processed, it should be finished immedately.
      </p>
    </van-dialog>
    <van-dialog v-model="dialogSucc" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text">
        Nodes Strategies successfully edited! Your changes have been saved
      </p>
    </van-dialog>
  </div>
</template>

<script>
import { blackandwhiteList, whitelistProof } from "@/common/api";
import { whitelistFiltre, arrConversion, isErcEq } from "@/utils";
import { StandardMerkleTree } from "@/utils/openzeppelin/index.js";
import _ from "lodash";
import {
  getIsErc721,
  setMintCapAndPermission,
} from "@/common/walletService/services";
import { ethers } from "ethers";
import { Notify } from "vant";
import { mapState } from "vuex";
import Loading from "@/components/Loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      dialogSucc: false,
      isLoading: true,
      formData: {
        workBlackAddress: "",
        workWhiteAddress: "",
        workERC721Address: "",
        mintingBlackAddress: "",
        mintingWhiteMaxAddress: "",
        mintingWhiteMaxAmount: null,
        mintingUnlimitedAddress: "",
        mintingERC721MaxAddress: "",
        mintingERC721MaxAmount: null,
        unifiedMintingCap: null,
        mintingERC721Address: "",
      },

      workBlackShow: false,
      workBlackList: [],
      isWorkBlack: false,
      workWhiteShow: false,
      workWhiteList: [],
      isWorkWhite: false,
      workERC721List: [],
      isWorkERC721: false,
      workERC721Show: false,
      erc721Btn: false,
      mintingBlackShow: false,
      mintingBlackList: [],
      isMintingBlack: false,
      mintingWhiteMaxList: [],
      isMintingWhiteMax: false,
      mintingWhiteMaxShow: false,
      mintingUnlimitedList: [],
      isMintingUnlimited: false,
      mintingUnlimitedShow: false,
      mintingERC721MaxList: [],
      isMintingERC721Max: false,
      mintingERC721MaxShow: false,
      unifiedMintingCap: null,
      unifiedMintingCapShow: false,
      mintingERC721List: [],
      isMintingERC721: false,
      mintingERC721Show: false,
      isHint: 0,
      initData: {},
      isPro: false,
      dialogLoading: false,
    };
  },
  computed: {
    ...mapState(["MetaMaskAddress", "User"]),
    newWorkBlackList() {
      return this.isWorkBlack
        ? this.workBlackList
        : this.workBlackList.slice(0, 3);
    },
    newWorkWhiteList() {
      return this.isWorkWhite
        ? this.workWhiteList
        : this.workWhiteList.slice(0, 3);
    },
    newWorkERC721List() {
      return this.isWorkERC721
        ? this.workERC721List
        : this.workERC721List.slice(0, 3);
    },
    newMintingBlackList() {
      return this.isMintingBlack
        ? this.mintingBlackList
        : this.mintingBlackList.slice(0, 3);
    },
    newMintingWhiteMaxList() {
      return this.isMintingWhiteMax
        ? this.mintingWhiteMaxList
        : this.mintingWhiteMaxList.slice(0, 3);
    },
    newMintingUnlimitedList() {
      return this.isMintingUnlimited
        ? this.mintingUnlimitedList
        : this.mintingUnlimitedList.slice(0, 3);
    },
    newMintingERC721MaxList() {
      return this.isMintingERC721Max
        ? this.mintingERC721MaxList
        : this.mintingERC721MaxList.slice(0, 3);
    },
    newMintingERC721List() {
      return this.isMintingERC721
        ? this.mintingERC721List
        : this.mintingERC721List.slice(0, 3);
    },
  },
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    deleteBlackAndWhiteAddress(idx, name) {
      this[`${name}List`].splice(idx, 1);
    },
    addBlackAndWhiteAddress(name) {
      const strArr = this.formData[`${name}Address`].match(
        /^(0x)?[0-9a-fA-F]{40}$/
      );
      const isAddress = ethers.utils.isAddress(this.formData[`${name}Address`]);
      if (!strArr || !isAddress) {
        const str = "Wrong address please modify and resubmit.";
        Notify({
          message: str,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      const addressList = this[`${name}List`].map((item) => {
        return item.slice(0, 2) === "0x"
          ? item.toLowerCase()
          : "0x" + item.toLowerCase();
      });
      const address =
        this.formData[`${name}Address`].slice(0, 2) === "0x"
          ? this.formData[`${name}Address`]
          : "0x" + this.formData[`${name}Address`];
      if (addressList.indexOf(address.toLowerCase()) > -1) {
        Notify({
          message: `The address “${
            this.formData[`${name}Address`]
          }” is already in the list.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      if (this[`${name}List`].length >= 100) {
        Notify({
          message: `You've reached the address limit of 100. Please remove an address before adding a new one.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      this[`${name}List`].unshift(address);
      this.formData[`${name}Address`] = "";
      Notify({
        message: `Added successfully`,
        color: "#F0F0F0",
        background: "#745CD4",
        duration: 3000,
      });
      // this[`${name}Show`] = false;
    },

    async addERC721Address(name) {
      // mintingERC721
      const strArr = this.formData[`${name}Address`].match(
        /^(0x)?[0-9a-fA-F]{40}$/
      );
      const isAddress = ethers.utils.isAddress(this.formData[`${name}Address`]);
      if (!strArr || !isAddress) {
        const str = "Wrong address please modify and resubmit.";
        Notify({
          message: str,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      const addressList = this[`${name}List`].map((item) => {
        return item.slice(0, 2) === "0x"
          ? item.toLowerCase()
          : "0x" + item.toLowerCase();
      });
      const address =
        this.formData[`${name}Address`].slice(0, 2) === "0x"
          ? this.formData[`${name}Address`]
          : "0x" + this.formData[`${name}Address`];

      if (addressList.indexOf(address.toLowerCase()) > -1) {
        Notify({
          message: `The address “${
            this.formData[`${name}Address`]
          }” is already in the list.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      if (this[`${name}List`].length >= 100) {
        Notify({
          message: `You've reached the address limit of 100. Please remove an address before adding a new one.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      this.erc721Btn = true;
      const isErc721 = await getIsErc721(address);
      if (isErc721) {
        this[`${name}List`].unshift(address);
        this.formData[`${name}Address`] = "";
        Notify({
          message: `Added successfully`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        this.formData[`${name}Address`] = "";
        this.erc721Btn = false;
      } else {
        this.erc721Btn = false;
        Notify({
          message: "Wrong address please modify and resubmit.",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
      }
      this.erc721Btn = false;
    },

    async addMintingAddressMaxAmount(name, type = 0) {
      const strArr = this.formData[`${name}Address`].match(
        /^(0x)?[0-9a-fA-F]{40}$/
      );
      const isAddress = ethers.utils.isAddress(this.formData[`${name}Address`]);
      if (!strArr || !isAddress) {
        Notify({
          message: "Wrong address please modify and resubmit.",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      const addressList = this[`${name}List`].map((item) => {
        return item.address.slice(0, 2) === "0x"
          ? item.address.toLowerCase()
          : "0x" + item.address.toLowerCase();
      });
      const address =
        this.formData[`${name}Address`].slice(0, 2) === "0x"
          ? this.formData[`${name}Address`]
          : "0x" + this.formData[`${name}Address`];

      if (type === 1) {
        this.erc721Btn = true;
        const isErc721 = await getIsErc721(address);
        if (!isErc721) {
          this.erc721Btn = false;
          Notify({
            message: "Wrong address please modify and resubmit.",
            color: "#F0F0F0",
            background: "#745CD4",
            duration: 3000,
          });
          return;
        }
        this.erc721Btn = false;
      }

      if (addressList.indexOf(address.toLowerCase()) > -1) {
        Notify({
          message: `The address “${
            this.formData[`${name}Address`]
          }” is already in the list.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      if (this[`${name}List`].length >= 100) {
        Notify({
          message: `You've reached the address limit of 100. Please remove an address before adding a new one.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      if (
        this.formData[`${name}Amount`] > 10000 ||
        this.formData[`${name}Amount`] < 1
      ) {
        Notify({
          message: `Max Minting Amount should not be less than 1 and should not exceed 10,000.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      const data = {
        address: address,
        amount: this.formData[`${name}Amount`],
      };
      this[`${name}List`].unshift(data);
      this.formData[`${name}Address`] = "";
      this.formData[`${name}Amount`] = null;
      Notify({
        message: `Added successfully`,
        color: "#F0F0F0",
        background: "#745CD4",
        duration: 3000,
      });
    },
    deleteMintingAddressMaxAmount(idx, name) {
      this[`${name}List`].splice(idx, 1);
    },
    addUnifiedMintingCap() {
      if (
        this.formData.unifiedMintingCap < 1 ||
        this.formData.unifiedMintingCap > 10000
      ) {
        Notify({
          message: `Max Minting Amount should not be less than 1 and should not exceed 10,000.`,
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      this.unifiedMintingCap = this.formData.unifiedMintingCap;
      this.unifiedMintingCapShow = false;
      this.formData.unifiedMintingCap = null;
    },
    deleteUnifiedMintingCap() {
      this.formData.unifiedMintingCap = null;
      this.unifiedMintingCap = null;
    },
    close() {
      this.isPro = false;
      this.dialogSucc = false;
    },
    async getData() {
      try {
        let data = await blackandwhiteList({ daoId: this.$route.query.id });
        // data = {
        //   data: {
        //     daoId: 282,
        //     projectId:
        //       "0x73a3d0043c11fabf3015045bc2a7f2edabbfbcdcb0aece3d032708f2c3d67c61",
        //     createCanvas: {
        //       whiteList: {
        //         whiteListAddress: [
        //           "0xC537A223b7Fe86483d31442248c5918177526BEf",
        //         ],
        //         rootHash:
        //           "0xfaa7d7f64883be37cc95484d5be1b12f03a2c8405ea364700cd6289b93d41976",
        //       },
        //       whiteListedERC721: ["0xcdc94acbe217b5c7fd89775093c34d460ec561c0"],
        //       blackList: ["0xc537a223b7fe86483d31442248c5918177526bef"],
        //       designatedMintCaps: [],
        //       maxMintingAmount: 0,
        //     },
        //     minting: {
        //       whiteList: {
        //         whiteListAddress: [
        //           "0xc537a223b7fe86483d31442248c5918177526bef",
        //           "0xcdc94acbe217b5c7fd89775093c34d460ec561c0",
        //         ],
        //         rootHash:
        //           "0x8249f66e1d3f07a570d8d5e0c6916816345e0bf0ba9eb4c1e6a67e0f33ac2990",
        //       },
        //       whiteListedERC721: ["0xcdc94acbe217b5c7fd89775093c34d460ec561c0"],
        //       blackList: ["0xc537a223b7fe86483d31442248c5918177526bef"],
        //       designatedMintCaps: [
        //         {
        //           account: "0xc537a223b7fe86483d31442248c5918177526bef",
        //           cap: 2,
        //         },
        //         {
        //           account: "0xcdc94acbe217b5c7fd89775093c34d460ec561c0",
        //           cap: 2,
        //         },
        //       ],
        //       erc721MintCaps: [
        //         {
        //           account: "0xc537a223b7fe86483d31442248c5918177526bef",
        //           cap: 2,
        //         },
        //         {
        //           account: "0xcdc94acbe217b5c7fd89775093c34d460ec561c0",
        //           cap: 2,
        //         },
        //       ],
        //       maxMintingAmount: 2,
        //     },
        //     daoStatus: 2,
        //     daoVersion: 3,
        //   },
        // };
        this.initData = data.data;
        const resData = { ...data.data };
        const designatedMintCaps =
          resData.minting && resData.minting.designatedMintCaps.length > 0
            ? resData.minting.designatedMintCaps.map((item) => {
                return {
                  address: item.account,
                  amount: item.cap,
                };
              })
            : [];
        const maxAddrList =
          designatedMintCaps.length > 0
            ? designatedMintCaps.map((item) => item.address)
            : [];
        const minterWhites =
          resData.minting && resData.minting.whiteList
            ? [...resData.minting.whiteList.whiteListAddress]
            : [];

        const minterWhiteDelMaxAddrList = minterWhites.filter(
          (v) => maxAddrList.findIndex((el) => el === v) === -1
        );
        this.workBlackList = resData.createCanvas.blackList
          ? [...resData.createCanvas.blackList]
          : [];
        this.workWhiteList = resData.createCanvas.whiteList
          ? [...resData.createCanvas.whiteList.whiteListAddress]
          : [];
        this.workERC721List = resData.createCanvas.whiteListedERC721
          ? [...resData.createCanvas.whiteListedERC721]
          : [];
        this.mintingBlackList = resData.minting.blackList
          ? [...resData.minting.blackList]
          : [];

        this.mintingWhiteMaxList = designatedMintCaps;

        this.mintingUnlimitedList = minterWhiteDelMaxAddrList;

        this.mintingERC721MaxList = resData.minting.erc721MintCaps
          ? resData.minting.erc721MintCaps.map((item) => {
              return {
                address: item.account,
                amount: item.cap,
              };
            })
          : [];
        this.mintingERC721List = resData.minting.whiteListedERC721
          ? [...resData.minting.whiteListedERC721]
          : [];
        this.unifiedMintingCap = resData.minting.maxMintingAmount;
        this.isPro = resData.basicDao === 2;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
      }
      this.isLoading = false;
    },
    onClickLeft() {
      this.$router.back(-1);
    },

    filterBlacklist(val, initData) {
      const accounts = whitelistFiltre(val);
      //Whether the blacklist array exists
      if (initData.length > 0) {
        //Whether two arrays are equal
        const isArr = isErcEq(accounts, initData);
        if (isArr) {
          this.isHint++;
          return {
            deleteArr: [],
            addArr: [],
          };
        } else {
          //It's in the old array, it's not in the new array
          const deleteArr = _.difference(initData, accounts);
          //It didn't exist in the old array, but it exists in the new array
          const addArr = _.difference(accounts, initData);
          return {
            deleteArr: deleteArr,
            addArr: addArr,
          };
        }
      } else {
        if (accounts.length > 0) {
          const addArr = _.difference(accounts, []);
          // this.editData.blacklist.minterAccounts = addArr;
          return {
            deleteArr: [],
            addArr: addArr,
          };
        } else {
          this.isHint++;
          return {
            deleteArr: [],
            addArr: [],
          };
        }
      }
    },

    minterMaxAddressAmounEq(val) {
      // const minterMaxAddressAmountList = val.map((item) => item.address);
      // const minterMaxAddressAmouns = initData.map((item) => item.account);
      if (val.length > 0) {
        this.isHint++;
        return val.map((item) => {
          return {
            account: item.address,
            cap: item.amount,
          };
        });
      } else {
        return [];
      }
    },
    filterERC21Adderss(val, initData) {
      if (isErcEq(val, initData)) {
        this.isHint++;
        return val;
      } else {
        return val;
      }
    },
    filterMerkle(val, initData, arr = []) {
      const newVal = whitelistFiltre(val, arr);
      if (val.length > 0 || arr.length > 0) {
        const tree = StandardMerkleTree.of(arrConversion(newVal), ["address"]);
        if (initData && tree.root === initData.rootHash) {
          this.isHint++;
        }

        return {
          root: tree.root,
          // proof: JSON.stringify(proofArr),
          address: JSON.stringify(newVal),
        };
      } else {
        if (!initData) {
          this.isHint++;
        }
        return {
          root: ethers.constants.HashZero,
          proof: "",
          address: "",
        };
      }
    },
    async create() {
      // console.log(this.workBlackList, "this.workBlackList ");
      // console.log(this.workWhiteList, "this.workWhiteList");
      // console.log(this.workERC721List, " this.workERC721List");
      // console.log(this.mintingBlackList, "this.mintingBlackList ");
      // console.log(this.mintingWhiteMaxList, " this.mintingWhiteMaxList");
      // console.log(this.mintingUnlimitedList, " this.mintingUnlimitedList ");
      // console.log(this.mintingERC721MaxList, " this.mintingERC721MaxList ");
      // console.log(this.mintingERC721List, "this.mintingERC721List ");
      this.isHint = 0;
      const chain = await this.setChain();
      if (!chain) return;
      //  this.workBlackList = this.initData.createCanvas.blackList
      //     ? this.initData.createCanvas.blackList
      //     : [];
      //   this.workWhiteList = this.initData.createCanvas.whiteList
      //     ? this.initData.createCanvas.whiteList
      //     : [];
      //   this.workERC721List = this.initData.createCanvas.whiteListedERC721
      //     ? this.initData.createCanvas.whiteListedERC721
      //     : [];
      //   this.mintingBlackList = this.initData.minting.blackList
      //     ? this.initData.minting.blackList
      //     : [];

      //   this.mintingWhiteMaxList = this.initData.minting.designatedMintCaps
      //     ? this.initData.minting.designatedMintCaps
      //     : [];

      //   this.mintingUnlimitedList = this.initData.minting.whiteList
      //     ? this.initData.minting.whiteList
      //     : [];
      //   this.mintingERC721MaxList = this.initData.minting.erc721MintCaps
      //     ? this.initData.minting.erc721MintCaps
      //     : [];
      //   this.mintingERC721List = this.initData.minting.whiteListedERC721
      //     ? this.initData.minting.whiteListedERC721
      //     : [];
      //   this.unifiedMintingCap = this.initData.minting.maxMintingAmount;
      try {
        const editData = {
          unblacklist: { minterAccounts: [], canvasCreatorAccounts: [] },
          blacklist: { minterAccounts: [], canvasCreatorAccounts: [] },
          designatedMintCaps: [],
          whitelist: {
            minterNFTHolderPasses: [],
            minterMerkleRoot: "",
            canvasCreatorNFTHolderPasses: [],
            canvasCreatorMerkleRoot: "",
          },
          nftMinterCapInfo: [],
          mintCap: 0,
        };

        const mintingBlackList =
          this.initData.minting && this.initData.minting.blackList
            ? this.initData.minting.blackList
            : [];
        const newMintingBlackList = this.filterBlacklist(
          this.mintingBlackList,
          mintingBlackList
        );
        editData.unblacklist.minterAccounts = newMintingBlackList.deleteArr;
        editData.blacklist.minterAccounts = newMintingBlackList.addArr;

        const minterMaxAddressAmouns =
          this.initData.minting && this.initData.minting.designatedMintCaps
            ? this.initData.minting.designatedMintCaps
            : [];
        editData.designatedMintCaps = this.minterMaxAddressAmounEq(
          this.mintingWhiteMaxList,
          minterMaxAddressAmouns
        );
        const mintingERC721MaxList =
          this.initData.minting && this.initData.minting.erc721MintCaps
            ? this.initData.minting.erc721MintCaps
            : [];
        editData.nftMinterCapInfo = this.minterMaxAddressAmounEq(
          this.mintingERC721MaxList,
          mintingERC721MaxList
        );
        const mintingWhiteListedERC721 =
          this.initData.minting && this.initData.minting.whiteListedERC721
            ? this.initData.minting.whiteListedERC721
            : [];
        editData.whitelist.minterNFTHolderPasses = this.filterERC21Adderss(
          this.mintingERC721List,
          mintingWhiteListedERC721
        );

        const mintingWhiteList =
          this.initData.minting && this.initData.minting.whiteList
            ? this.initData.minting.whiteList
            : "";

        const mintingRootObj = this.filterMerkle(
          this.mintingUnlimitedList,
          mintingWhiteList,
          this.mintingWhiteMaxList.map((item) => item.address)
        );
        editData.whitelist.minterMerkleRoot = mintingRootObj.root;
        const canvasBlackList =
          this.initData.createCanvas && this.initData.createCanvas.blackList
            ? this.initData.createCanvas.blackList
            : [];

        const createCanvasBlackList = this.filterBlacklist(
          this.workBlackList,
          canvasBlackList
        );
        editData.unblacklist.canvasCreatorAccounts =
          createCanvasBlackList.deleteArr;
        editData.blacklist.canvasCreatorAccounts = createCanvasBlackList.addArr;

        const createCanvasWhiteListedERC721 =
          this.initData.createCanvas &&
          this.initData.createCanvas.whiteListedERC721
            ? this.initData.createCanvas.whiteListedERC721
            : [];
        editData.whitelist.canvasCreatorNFTHolderPasses =
          this.filterERC21Adderss(
            this.workERC721List,
            createCanvasWhiteListedERC721
          );
        const createCanvasWhiteList =
          this.initData.createCanvas && this.initData.createCanvas.whiteList
            ? this.initData.createCanvas.whiteList
            : "";
        const createCanvasRootObj = this.filterMerkle(
          this.workWhiteList,
          createCanvasWhiteList
        );
        editData.whitelist.canvasCreatorMerkleRoot = createCanvasRootObj.root;

        editData.mintCap = this.unifiedMintingCap
          ? this.unifiedMintingCap
          : "0";
        const setProofData = {
          canvasCreateOriginAddress: createCanvasRootObj.address,
          canvasCreateMerkleRoot: createCanvasRootObj.root,
          mintingOriginAddress: mintingRootObj.address,
          mintingMerkleRoot: mintingRootObj.root,
        };
        this.sendModifyPermission(editData, setProofData);
      } catch (error) {
        this.dialogLoading = false;
        const err = JSON.stringify(error);
        this.errMsgNit(err);
      }
    },
    async sendModifyPermission(editData, setProofData) {
      if (this.initData.daoStatus < 3) {
        try {
          this.dialogLoading = true;
          this.isHint = 0;
          await whitelistProof(setProofData);
          const tx = await setMintCapAndPermission({
            daoId: this.initData.projectId,
            ...editData,
          });
          await tx.wait();
          this.dialogSucc = true;
          this.dialogLoading = false;
          // this.senMsg(res);
          this.isHint = 0;
        } catch (error) {
          this.dialogLoading = false;
          const err = JSON.stringify(error);
          this.errMsgNit(err);
        }
      } else {
        Notify({
          message: "You can no longer edit as the DAO Mint Window has ended.",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.dao-box {
  padding: 0 20px;
  ::v-deep .van-popup {
    background: #282f41;
  }
}
::v-deep .van-cell {
  background-color: transparent;
}
::v-deep .van-cell-group {
  background-color: transparent;
}
.no-box {
  height: 100px;
}
.field-lable {
  color: #f0f0f0;
  margin: 0;
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
.black-box {
  margin-bottom: 6px;
  margin-top: 20px !important;
  border-radius: 12px;
  background: #1e2021;
  color: #999;
  text-overflow: ellipsis;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  padding: 16px 20px;
}
.field-lable-two {
  color: #999;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin: 0;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.box-two {
  margin-top: 0 !important;
}
.strategie-btn {
  border-radius: 5px;
  border: 1px dashed #6062aa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 0;
  margin-top: 12px;
}
.popup-zd {
  height: 300px;
  width: 90%;
  margin: 0 auto;
  p {
    color: #999;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
  .pop-btn {
    position: fixed;
    bottom: 20px;
    width: 90%;
  }
}
.all-btn {
  text-align: center;
  color: #b3b5f2;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
.strategie-item {
  display: flex;
  align-items: center;
  .item-right {
    margin-left: auto;
  }
}
.item-p2 {
  margin: 0;
}
.item-p1 {
  margin: 0;
}
</style>
