<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="dao-box" v-else>
    <van-nav-bar
      title="Edit On-Chain Parameters"
      left-arrow
      @click-left="onClickLeft"
    />

    <div>
      <div class="black-box">
        <span><van-icon name="question-o" /></span>
        All modifications, except for DAO token allocation, will take effect
        immediately, while DAO token allocation will apply in the next DRB.
      </div>
      <p class="field-lable">
        DAO Related Parameters
        <van-icon
          name="info-o"
          @click="
            setTitleShow(
              'DAO Related Parameters : These parameters mainly define the life cycle and DAO Token supply of the DAO.'
            )
          "
        />
      </p>
      <div class="black-box box-two">
        <p class="field-lable-two">
          DAO Token Allocation
          <van-icon
            name="info-o"
            @click="
              setTitleShow(
                `DAO Token Allocation: This parameter determines how many DAO tokens are allocated to this DAO. Keep in mind:
                1. Unissued DAO Tokens: Tokens allocated but not issued yet.
                2. Remaining DAO Tokens (up to 1 billion): Tokens available for allocation to each DAO.
                Note that DAO Token allocation is cumulative. For example, if you initially allocate 5000 and later add 7000, the total will be 12,000, not a replacement of 5000 with 7000.`
              )
            "
          />
        </p>
        <van-field
          v-model="formData.tokenAllocation"
          type="number"
          placeholder="When editing, this value is not required."
          oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          @blur="bluTokenAllocation"
        >
        </van-field>
        <p class="token-text">
          Unissued DAO Token : {{ formData.daoTokenLeave }}
        </p>
        <p class="token-text">
          Remaining DAO Token: {{ formData.daoTokenAllocation }}
        </p>

        <p class="field-lable-two margin-t20">
          DAO Mint Windows
          <van-icon
            name="info-o"
            @click="
              setTitleShow(
                'DAO Mint Windows : DAO cannot mint works after Mint window. 1 DRB cycle happens every 7,158 Ethereum blocks (roughly 24 hours).'
              )
            "
          />
        </p>
        <van-field
          type="textarea"
          v-model="formData.daoMintWindow"
          placeholder="Please"
          rows="1"
          autosize
          readonly
          clickable
          @click="showWindowsPicker = true"
        />
        <van-popup round v-model="showWindowsPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="windowsList"
            @cancel="showWindowsPicker = false"
            @confirm="windowsConfirm"
            confirm-button-text="confirm"
            cancel-button-text="cancel"
            visible-item-count="5"
            ref="mintWindowsRef"
            :default-index="initData.daoMintWindow"
          />
        </van-popup>

        <p class="field-lable-two margin-t20">
          Total NFT Mint Cap
          <van-icon
            name="info-o"
            @click="
              setTitleShow(
                'Total NFT Mint Cap : Maximum number of NFTs that the DAO can mint.'
              )
            "
          />
        </p>
        <van-field
          type="textarea"
          v-model="formData.totalNftMintCap"
          placeholder="Please"
          rows="1"
          autosize
          readonly
          clickable
          @click="showMinCapPicker = true"
        />
        <van-popup round v-model="showMinCapPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="capList"
            @cancel="showMinCapPicker = false"
            @confirm="capConfirm"
            confirm-button-text="confirm"
            cancel-button-text="cancel"
            visible-item-count="5"
            ref="minCapRef"
            :default-index="initData.totalNftMintCap"
          />
        </van-popup>

        <p class="field-lable-two margin-t20">
          Daily Mint Cap
          <van-icon
            name="info-o"
            @click="
              setTitleShow(
                'Daily Mint Cap : Maximum number of NFTs that the DAO can mint daily.'
              )
            "
          />
        </p>
        <van-field
          v-model="formData.dailyMintCap"
          type="digit"
          placeholder="Please"
          @blur="bluDailyMintCap"
        >
        </van-field>
      </div>

      <p class="field-lable">
        Work Related Parameters
        <van-icon
          name="info-o"
          @click="
            setTitleShow(
              `Work Related Parameters : These parameters mainly define the work price related parameters. The following explanations can help you set parameters: 
             Builder: The creator or uploader of the work.
             Starter: The person or entity responsible for initiating the launch of this DAO.
             Minter: The person who transforms the work into an NFT.
             DAO Mint Fee: The portion of ETH deposited into the DAO's Asset pool.`
            )
          "
        />
      </p>
      <div class="black-box box-two">
        <div
          v-show="initData.unifiedPriceSet && Number(initData.unifiedPrice) > 0"
        >
          <p class="field-lable-two">
            Unified Price
            <van-icon
              name="info-o"
              @click="
                setTitleShow(
                  `Unified Price: The prices of all works under this DAO can only be minted at this price.`
                )
              "
            />
          </p>
          <van-field
            v-model="formData.unifiedPrice"
            type="number"
            placeholder="Please"
            oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            @blur="blurUnifiedPrice"
          >
          </van-field>
        </div>
        <div v-show="!initData.unifiedPriceSet">
          <p class="field-lable-two">
            DAO Floor Price
            <van-icon
              name="info-o"
              @click="
                setTitleShow(
                  `DAO Floor Price : The floor price of all works under DAO when they are created.`
                )
              "
            />
          </p>
          <van-field
            type="textarea"
            v-model="formData.daoFloorPrice"
            placeholder="Please"
            rows="1"
            autosize
            readonly
            clickable
            @click="showFloorPricePicker = true"
          />
          <van-popup round v-model="showFloorPricePicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="newFllorPeices"
              @cancel="showFloorPricePicker = false"
              @confirm="floorPriceConfirm"
              confirm-button-text="confirm"
              cancel-button-text="cancel"
              visible-item-count="5"
              :default-index="initData.daoFloorPrice"
            />
          </van-popup>
          <p class="field-lable-two margin-t20">
            Price Fluctuation Method
            <van-icon
              name="info-o"
              @click="
                setTitleShow(
                  `Price Fluctuation Method : The method of price fluctuation for other works under the same builder within the same DAO when minting an NFT.`
                )
              "
            />
          </p>
          <div class="box-two-new">
            <van-tabs type="card" v-model="pethodType">
              <van-tab title="Exponential" name="Exponential" class="tab-left">
                <div>
                  <p class="field-lable-two margin-t20">
                    Doubling Factor
                    <van-icon
                      name="info-o"
                      @click="
                        setTitleShow(
                          `Doubling Factor : The price increases or decrease exponentially, the price calculation formula is: current price * doubling factor.`
                        )
                      "
                    />
                  </p>
                  <van-field
                    v-model="formData.doublingFactor"
                    type="number"
                    placeholder="Please"
                    oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                    @blur="blurDoublingFactor"
                  >
                  </van-field>
                </div>
              </van-tab>
              <van-tab title="Linear" name="Linear" class="tab-right">
                <div>
                  <p class="field-lable-two margin-t20">
                    Growth Factor
                    <van-icon
                      name="info-o"
                      @click="
                        setTitleShow(
                          `Growth Factor :The price increases or decrease linearly, the price calculation formula is: current price + growth factor.`
                        )
                      "
                    />
                  </p>
                  <van-field
                    v-model="formData.growthFactor"
                    type="number"
                    placeholder="Please"
                    oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                    @blur="blurGrowthFactor"
                  >
                  </van-field>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>

        <p class="field-lable-two margin-t20">
          Reserve Ratio
          <van-icon
            name="info-o"
            @click="
              setTitleShow(
                `Researve Ratio : The reserve ratio  determine the allocation of the minting fee. 
The PDAO(ProtoDAO) mint fee should fix at 2.5%, while the remaining 97.5% is split between the Builder and DAO. The DAO mint fee and Builder mint fee can be adjusted as desired, with the condition that the DAO mint fee proportion remains between 2.5% and 97.5% .The combined total of these three should equate to 100%.`
              )
            "
          />
        </p>
        <div class="box-two-new" v-show="!initData.unifiedPriceSet">
          <p class="field-lable-two">DAO Price Reserve Ratio</p>
          <div class="ratio-box">
            <div class="ratio-lable">DAO Mint Fee</div>
            <van-field
              v-model="formData.canvasPric.dao"
              type="number"
              placeholder="Please"
              oninput="if(Number(value)>97.5) { value = 97.5 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              @blur="blurCanvasPricDao"
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">Builder Mint Fee</div>
            <van-field
              v-model="formData.canvasPric.canvas"
              type="number"
              placeholder="Please"
              oninput="if(Number(value)>95) { value = 95 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              @blur="blurCanvasPricCanvas"
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">PDAO Mint Fee</div>
            <van-field
              v-model="formData.canvasPric.d4a"
              placeholder="Please"
              disabled
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
        </div>
        <div class="box-two-new" style="margin-top: 8px">
          <p class="field-lable-two">Fixed or Unified Price Reserve Ratio</p>
          <div class="ratio-box">
            <div class="ratio-lable">DAO Mint Fee</div>
            <van-field
              v-model="formData.fixedPric.dao"
              type="number"
              placeholder="Please"
              oninput="if(Number(value)>97.5) { value = 97.5 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              @blur="blurFixedPricDao"
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">Builder Mint Fee</div>
            <van-field
              v-model="formData.fixedPric.canvas"
              type="number"
              placeholder="Please"
              oninput="if(Number(value)>95) { value = 95 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              @blur="blurFixedPricCanvas"
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">PDAO Mint Fee</div>
            <van-field
              v-model="formData.fixedPric.d4a"
              placeholder="Please"
              disabled
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
        </div>

        <p class="field-lable-two margin-t20">
          DAO Token
          <van-icon
            name="info-o"
            @click="
              setTitleShow(
                `DAO Token : ProtoDAO automatically generated DAO tokens for each DAO. Rewarded to Builder, Minter and Starter based on Asset Pool Reserve Ratio.The PDAO Reward should fix at 2%, while the remaining 98% is split between the Builder, Minter and Starter. The Builder Reward, Minter Reward and Starter Reward can be adjusted as desired.The combined total of these four should equate to 100%.`
              )
            "
          />
        </p>
        <div class="box-two-new">
          <p class="field-lable-two">DAO Price Reserve Ratio</p>
          <div class="ratio-box">
            <div class="ratio-lable">Builder Reward</div>
            <van-field
              v-model="formData.royalty.canvas"
              type="number"
              placeholder="Please"
              oninput="if(Number(value)>98) { value = 98 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              @blur="bluRoyaltyCanvas"
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">Minter Reward</div>
            <van-field
              v-model="formData.royalty.minter"
              type="number"
              placeholder="Please"
              oninput="if(Number(value)>98) { value = 98 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              @blur="bluRoyaltyMinter"
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">Starter Reward</div>
            <van-field
              v-model="formData.royalty.dao"
              placeholder="Please"
              disabled
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
          <div class="ratio-box">
            <div class="ratio-lable">PDAO Reward</div>
            <van-field
              v-model="formData.royalty.d4a"
              placeholder="Please"
              disabled
            >
              <span slot="right-icon">%</span>
            </van-field>
          </div>
        </div>
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
        Parameters successfully edited! Your changes have been saved
      </p>
    </van-dialog>

    <van-dialog v-model="dialogTitleShow" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span>Parameter Description</span>
        <span class="dialog-icon" @click="dialogTitleShow = false"
          ><van-icon name="cross"
        /></span>
      </div>

      <p class="dialog-text">{{ dialogTitleText }}</p>
    </van-dialog>
  </div>
</template>

<script>
import { distribute } from "@/common/api";
import { mapState } from "vuex";
import Loading from "@/components/Loading.vue";
import { BigNumber } from "bignumber.js";
import { setDaoParams, decimals } from "@/common/walletService/services";
export default {
  components: { Loading },
  data() {
    return {
      capList: [
        { text: "1k", disabled: false, value: 0, num: 1000 },
        { text: "5k", disabled: false, value: 1, num: 5000 },
        { text: "10k", disabled: false, value: 2, num: 10000 },
        { text: "50k", disabled: false, value: 3, num: 50000 },
        { text: "100k", disabled: false, value: 4, num: 100000 },
      ],
      newCapList: ["1k", "5k", "10k", "50k", "100k"],
      showMinCapPicker: false,
      windowsList: [
        { text: "30 DRB", disabled: false, value: 0, num: 30 },
        { text: "60 DRB", disabled: false, value: 1, num: 60 },
        { text: "90 DRB", disabled: false, value: 2, num: 90 },
        { text: "120 DRB", disabled: false, value: 3, num: 120 },
        { text: "180 DRB", disabled: false, value: 4, num: 180 },
        { text: "270 DRB", disabled: false, value: 5, num: 270 },
        { text: "360 DRB", disabled: false, value: 6, num: 360 },
      ],
      newWindowsList: [
        "30 DRB",
        "60 DRB",
        "90 DRB",
        "120 DRB",
        "180 DRB",
        "270 DRB",
        "360 DRB",
      ],
      showWindowsPicker: false,
      fllorPeices: [
        { label: "0.01 ETH", value: 0 },
        { label: "0.02 ETH", value: 1 },
        { label: "0.03 ETH", value: 2 },
        { label: "0.05 ETH", value: 3 },
        { label: "0.1 ETH", value: 4 },
        { label: "0.2 ETH", value: 5 },
        { label: "0.3 ETH", value: 6 },
        { label: "0.5 ETH", value: 7 },
        { label: "1 ETH", value: 8 },
        { label: "2 ETH", value: 9 },
        { label: "3 ETH", value: 10 },
        { label: "5 ETH", value: 11 },
        { label: "10 ETH", value: 12 },
      ],
      newFllorPeices: [
        "0.01 ETH",
        "0.02 ETH",
        "0.03 ETH",
        "0.05 ETH",
        "0.1 ETH",
        "0.2 ETH",
        "0.3 ETH",
        "0.5 ETH",
        "1 ETH",
        "2 ETH",
        "3 ETH",
        "5 ETH",
        "10 ETH",
      ],
      showFloorPricePicker: false,
      formData: {
        royalty: {
          dao: 3,
          d4a: 2,
          canvas: 90,
          minter: 5,
        },
        canvasPric: {
          dao: 30,
          d4a: 2.5,
          canvas: 67.5,
        },
        fixedPric: {
          dao: 35,
          d4a: 2.5,
          canvas: 62.5,
        },
        totalNftMintCap: "",
        daoFloorPrice: "",
        doublingFactor: null,
        growthFactor: null,
        fluctuationMethod: null,
        daoMintWindow: "",
        tokenAllocation: null,
        unifiedPrice: 0.01,
      },
      dialogSucc: false,
      pethodType: "Exponential",
      isLoading: true,
      isPro: false,
      initData: {},
      dialogLoading: false,
      dialogTitleShow: false,
      dialogTitleText: "",
      decimalsNum: 1e18,
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
    setTitleShow(val) {
      this.dialogTitleText = val;
      this.dialogTitleShow = true;
    },
    blurGrowthFactor() {
      if (!this.formData.growthFactor) {
        this.formData.growthFactor = 0;
        return;
      }
      if (this.formData.growthFactor > 10) {
        this.formData.growthFactor = 10;
        return;
      }
    },
    blurDoublingFactor() {
      if (!this.formData.doublingFactor || this.formData.doublingFactor < 1) {
        this.formData.doublingFactor = 1;
        return;
      }
      if (this.formData.doublingFactor > 5) {
        this.formData.doublingFactor = 5;
        return;
      }
    },
    bluDailyMintCap() {
      if (!this.formData.dailyMintCap || this.formData.dailyMintCap < 1) {
        this.formData.dailyMintCap = 1;
        return;
      }
      if (this.formData.dailyMintCap > 10000) {
        this.formData.dailyMintCap = 10000;
        return;
      }
    },
    bluTokenAllocation() {
      if (!this.formData.tokenAllocation) {
        this.formData.tokenAllocation = 0;
        return;
      }

      if (this.formData.tokenAllocation > this.formData.daoTokenAllocation) {
        this.formData.tokenAllocation = this.formData.daoTokenAllocation;
        return;
      }
    },
    blurUnifiedPrice() {
      if (
        !this.formData.unifiedPrice ||
        Number(this.formData.unifiedPrice) < 0.0001
      ) {
        this.formData.unifiedPrice = 0.0001;
        return;
      }
      if (this.formData.unifiedPrice > 100) {
        this.formData.unifiedPrice = 100;
        return;
      }
    },
    blurCanvasPricDao() {
      if (!this.formData.canvasPric.dao || this.formData.canvasPric.dao < 2.5) {
        this.formData.canvasPric.dao = 2.5;
      }
      this.formData.canvasPric.canvas = new BigNumber(97.5)
        .minus(this.formData.canvasPric.dao)
        .toString();
    },
    blurCanvasPricCanvas() {
      if (!this.formData.canvasPric.canvas) {
        this.formData.canvasPric.canvas = 0;
      }
      this.formData.canvasPric.dao = new BigNumber(97.5)
        .minus(this.formData.canvasPric.canvas)
        .toString();
    },
    blurFixedPricDao() {
      if (!this.formData.fixedPric.dao || this.formData.fixedPric.dao < 2.5) {
        this.formData.fixedPric.dao = 2.5;
      }
      this.formData.fixedPric.canvas = new BigNumber(97.5)
        .minus(this.formData.fixedPric.dao)
        .toString();
    },
    blurFixedPricCanvas() {
      if (!this.formData.fixedPric.canvas) {
        this.formData.fixedPric.canvas = 0;
      }
      this.formData.fixedPric.dao = new BigNumber(97.5)
        .minus(this.formData.fixedPric.canvas)
        .toString();
    },
    bluRoyaltyCanvas() {
      if (!this.formData.royalty.canvas) {
        this.formData.royalty.canvas = 0;
      }
      if (this.formData.royalty.canvas >= 98) {
        this.formData.royalty.dao = 0;
        this.formData.royalty.minter = 0;
      } else {
        const addTop = new BigNumber(this.formData.royalty.canvas)
          .plus(this.formData.royalty.minter)
          .toNumber();
        if (addTop >= 98) {
          this.formData.royalty.minter = new BigNumber(98)
            .minus(this.formData.royalty.canvas)
            .toNumber();
          this.formData.royalty.dao = 0;
        } else {
          this.formData.royalty.dao = new BigNumber(98)
            .minus(this.formData.royalty.canvas)
            .minus(this.formData.royalty.minter)
            .toNumber();
        }
      }
    },
    bluRoyaltyMinter() {
      if (!this.formData.royalty.minter) {
        this.formData.royalty.minter = 0;
      }
      if (this.formData.royalty.minter >= 98) {
        this.formData.royalty.dao = 0;
        this.formData.royalty.canvas = 0;
      } else {
        const addTop = new BigNumber(this.formData.royalty.canvas)
          .plus(this.formData.royalty.minter)
          .toNumber();
        if (addTop >= 98) {
          this.formData.royalty.canvas = new BigNumber(98)
            .minus(this.formData.royalty.minter)
            .toNumber();
          this.formData.royalty.dao = 0;
        } else {
          this.formData.royalty.dao = new BigNumber(98)
            .minus(this.formData.royalty.canvas)
            .minus(this.formData.royalty.minter)
            .toNumber();
        }
      }
    },
    close() {
      this.isPro = false;
      this.dialogSucc = false;
    },

    async create() {
      BigNumber.config({ EXPONENTIAL_AT: 32 });
      this.dialogLoading = true;
      try {
        const req = {
          daoId: this.formData.projectId,
          nftMaxSupply: this.newCapList.indexOf(this.formData.totalNftMintCap),
          mintableRound: this.newWindowsList.indexOf(
            this.formData.daoMintWindow
          ),
          floorPrice: this.newFllorPeices.indexOf(this.formData.daoFloorPrice),
          priceTemplateType: this.pethodType === "Exponential" ? 0 : 1,
          nftPriceFactor:
            this.pethodType === "Exponential"
              ? new BigNumber(this.formData.doublingFactor)
                  .times(10000)
                  .toString()
              : new BigNumber(this.formData.growthFactor)
                  .times(this.decimalsNum)
                  .toString(),
          daoCreatorERC20Ratio: new BigNumber(this.formData.royalty.dao)
            .times(100)
            .toString(),
          canvasCreatorERC20Ratio: new BigNumber(this.formData.royalty.canvas)
            .times(100)
            .toString(),
          nftMinterERC20Ratio: new BigNumber(this.formData.royalty.minter)
            .times(100)
            .toString(),
          daoFeePoolETHRatio: this.initData.unifiedPriceSet
            ? new BigNumber(this.formData.fixedPric.dao).times(100).toString()
            : new BigNumber(this.formData.canvasPric.dao).times(100).toString(),
          daoFeePoolETHRatioFlatPrice: new BigNumber(
            this.formData.fixedPric.dao
          )
            .times(100)
            .toString(),
          dailyMintCap: this.formData.dailyMintCap,
          addedDaoToken: this.formData.tokenAllocation
            ? new BigNumber(this.formData.tokenAllocation)
                .times(this.decimalsNum)
                .toString()
            : "0",
          unifiedPrice: this.formData.unifiedPrice
            ? new BigNumber(this.formData.unifiedPrice)
                .times(this.decimalsNum)
                .toString()
            : "0",
        };
        const tx = await setDaoParams(req);
        await tx.wait();
        // Notify({
        //   message: "Updated!",
        //   color: "#F0F0F0",
        //   background: "#745CD4",
        //   duration: 3000,
        // });
        this.dialogLoading = false;
        this.dialogSucc = true;
      } catch (error) {
        console.log(error, "error");
        this.dialogLoading = false;
        const err = error.toString();
        this.errMsgNit(err);
      }
    },
    async getData() {
      const res = await distribute({
        daoId: this.$route.query.id,
      });
      this.initData = res.data;
      const decNum = await decimals(this.initData.erc20Address);
      this.decimalsNum = `1e${decNum}`;
      // daoMintWindow
      this.formData = {
        ...this.formData,
        ...res.data,

        totalNftMintCap: this.newCapList[res.data.totalNftMintCap],
        daoMintWindow: this.newWindowsList[res.data.daoMintWindow],
        daoFloorPrice: this.newFllorPeices[res.data.daoFloorPrice],
        fluctuationMethod: res.data.canvasPriceFluctuationMethod,
        doublingFactor:
          res.data.canvasPriceFluctuationMethod === 0
            ? new BigNumber(res.data.fluctuationMethodFactor)
                .div(10000)
                .toString()
            : 2,
        growthFactor:
          res.data.canvasPriceFluctuationMethod === 1
            ? new BigNumber(res.data.fluctuationMethodFactor)
                .div(this.decimalsNum)
                .toString()
            : 0.1,
        royalty: {
          dao: res.data.daoRoyaltyToken.daoReward,
          d4a: res.data.daoRoyaltyToken.d4aReward,
          canvas: res.data.daoRoyaltyToken.canvasReward,
          minter: res.data.daoRoyaltyToken.minterReward,
        },
        canvasPric: {
          dao: res.data.unFixedReserveRatio.daoMintFee,
          d4a: res.data.unFixedReserveRatio.d4aMintFee,
          canvas: res.data.unFixedReserveRatio.canvasMintFee,
        },
        fixedPric: {
          dao: res.data.fixedReserveRatio.daoMintFee,
          d4a: res.data.fixedReserveRatio.d4aMintFee,
          canvas: res.data.fixedReserveRatio.canvasMintFee,
        },
      };
      this.pethodType =
        this.formData.fluctuationMethod === 0 ? "Exponential" : "Linear";
      this.capList = this.capList.map((item) => {
        return {
          ...item,
          disabled: item.num < this.initData.nftNumber ? true : false,
        };
      });
      this.windowsList = this.windowsList.map((item) => {
        return {
          ...item,
          disabled: item.num < this.initData.mintWindow ? true : false,
        };
      });
      this.isPro = this.formData.basicDao === 2;
      this.isLoading = false;
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    windowsConfirm(val) {
      this.formData.daoMintWindow = val.text;
      this.showWindowsPicker = false;
    },
    capConfirm(val) {
      this.formData.totalNftMintCap = val.text;
      this.showMinCapPicker = false;
    },
    floorPriceConfirm(val) {
      this.formData.daoFloorPrice = val;
      this.showFloorPricePicker = false;
    },
  },
};
</script>
<style scoped lang="scss">
.dao-box {
  padding: 0 20px;
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
  color: #fff;
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
.my-flex-field {
  display: flex;
  margin-bottom: 6px !important;
  margin-top: 20px !important;
  align-items: center;
  .my-flex-lable {
    width: 60%;
    color: #999;
  }

  ::v-deep .van-switch {
    margin-left: auto;
  }
}
.field-margin {
  margin-bottom: 6px !important;
  margin-top: 20px !important;
  border: none;
  padding: 0;
  ::v-deep .van-field__label {
    color: #999;
  }
}
.show-open {
  display: flex;
  justify-content: center;
  margin: 18px 0;
}
.black-box {
  margin-bottom: 6px !important;
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
}
.token-text {
  color: #999;
  font-family: Roboto;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  margin: 4px 0;
}
.box-two {
  margin-top: 0 !important;
}
.box-two-new {
  border-radius: 12px;
  background: #282a2c;
  padding: 12px 8px;
}
.ratio-box {
  display: flex;
  align-items: center;
  margin-top: 16px;
  ::v-deep .van-cell {
    width: 55%;
  }
  ::v-deep .van-field--disabled {
    border: 1px solid #3c4458;
    background: #2c2f36;
  }
}

.ratio-lable {
  color: #999;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  flex: 1;
}
</style>
