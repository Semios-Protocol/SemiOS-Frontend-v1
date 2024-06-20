<template>
  <div class="bing-box">
    <el-dialog
      :title="$t('workDetail.bindingTopupBalanceLabel')"
      :visible.sync="isDialog"
      :before-close="setDialog"
      :close-on-click-modal="false"
      width="896px"
    >
      <div class="dialog-box">
        <el-tabs type="border-card" :stretch="true" v-model="activeName">
          <el-tab-pane label="Select NFT" name="selectNft">
            <div v-if="topUpMintList.length > 0">
              <div
                class="my-tabs-item"
                :class="activeWork.workId === item.workId ? 'active-item' : ''"
                v-for="(item, idx) in topUpMintList"
                :key="item.imgUrl + idx"
                @click="setItem(item)"
              >
                <div
                  class="active-item-icon"
                  v-show="activeWork.workId === item.workId"
                >
                  <i class="el-icon-check" />
                </div>
                <div class="item-img"><img :src="item.imgUrl" alt="" /></div>
                <div class="item-body">
                  <div class="item-left">
                    <p>
                      {{ item.ethAmount | bigNumFormat(5, 0.00001) }}
                      <TokenIcon
                        size="20px"
                        :payCurrencyType="item.payCurrencyType"
                        :inputTokenAddress="item.inputTokenAddress"
                      />
                    </p>
                    <span>{{ $t('workDetail.balanceLabel') }}</span>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div class="item-right">
                    <p>
                      {{ item.erc20Amount | bigNumFormat(5, 0.00001) }}
                      <TokenIcon
                        size="20px"
                        :daoToken="true"
                        :daoSymbol="item.daoSymbol"
                        :daoErc20Address="item.daoErc20Address"
                      />
                    </p>
                    <span>{{ $t('workDetail.erc20TokensLabel') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="bind-body">
              <h4>{{ $t('workDetail.noNftText') }}</h4>
            </div>
          </el-tab-pane>
          <el-tab-pane label="External NFT" name="externalNft">
            <div class="ext-body">
              <h4>{{ $t('workDetail.comingSoonLabel') }}</h4>
              <el-form
                label-position="right"
                label-width="80px"
                :model="formData"
              >
                <el-form-item :label="$t('workDetail.erc721label')">
                  <el-input
                    v-model="formData.erc"
                    disabled
                    :placeholder="$t('workDetail.erc721Placeholder')"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('workDetail.tokenIdLabel')">
                  <el-input
                    v-model="formData.token"
                    disabled
                    :placeholder="$t('workDetail.tokenIdPlaceholder')"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Bind to this upcoming NFT" name="bindNft">
            <div class="bind-body">
              <h4>{{ $t('workDetail.toThisNFTlabel') }}</h4>
              <div class="my-tabs-item" style="cursor: unset">
                <div class="item-img">
                  <img :src="dataObj.imageUrl" alt="" />
                </div>
                <div class="item-body">
                  <div class="item-left">
                    <p class="flexp">
                      <span
                        class="newprice"
                        v-if="
                          dataObj.royaltyTokenPrice !== null &&
                          dataObj.royaltyTokenPrice !== ''
                        "
                        >{{
                          dataObj.royaltyTokenPrice | bigNumFormat(5, 0.000001)
                        }}
                      </span>
                      <span v-else class="newprice">
                        {{ dataObj.price | bigNumFormat(5, 0.000001) }}
                      </span>

                      <TokenIcon
                        size="20px"
                        :daoToken="dataObj.erc20PaymentMode"
                        :daoSymbol="dataObj.daoSymbol"
                        :daoErc20Address="dataObj.daoErc20Address"
                        :payCurrencyType="dataObj.payCurrencyType"
                        :inputTokenAddress="dataObj.inputTokenAddress"
                      />
                    </p>
                    <span>{{ $t('workDetail.workPriceLabel') }}</span>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div class="item-right">
                    <p>
                      {{
                        dataObj.mintersMaxRewardToken | bigNumFormat(5, 0.00001)
                      }}

                      <TokenIcon
                        size="20px"
                        :daoToken="true"
                        :daoSymbol="dataObj.daoSymbol"
                        :daoErc20Address="dataObj.daoErc20Address"
                      />
                    </p>
                    <span>{{ $t('workDetail.erc20TokensLabel') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          :disabled="!isBtn"
          class="el-dao-btnz"
          @click="setEmitIsDialog"
          style="width: 100%; margin: 0"
          >Top Up</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ethers } from 'ethers'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: {
    TokenIcon,
  },
  data() {
    return {
      activeName: 'selectNft',
      activeWork: { workId: null },
      formData: {},
    }
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    topUpMintList: {
      type: Array,
      default: () => [],
    },
    dataObj: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    isBtn() {
      console.log(this.activeName, 'this.activeName', this.activeWork)
      switch (this.activeName) {
        case 'selectNft':
          return this.activeWork.workId ? true : false
        case 'bindNft':
          return true
        case 'externalNft':
          return false
        default:
          return false // or throw an error if it's unexpected
      }
    },
  },
  methods: {
    setDialog() {
      this.$emit('setEmitIsDialog', null)
    },
    setEmitIsDialog() {
      if (this.activeName === 'selectNft') {
        console.log(this.activeWork, 'this.activeWork')
        const nftIdentifier = {
          erc721Address: this.activeWork.erc721TokenAddress,
          tokenId: this.activeWork.workNumber,
        }
        this.$emit('setEmitIsDialog', nftIdentifier)
      }
      if (this.activeName === 'bindNft') {
        const nftIdentifier = {
          erc721Address: ethers.constants.AddressZero,
          tokenId: 0,
        }
        this.$emit('setEmitIsDialog', nftIdentifier)
      }
    },
    setItem(item) {
      this.activeWork = item
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-tabs--border-card > .el-tabs__header {
  background-color: #282f41 !important;
  border: none !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #3a435b !important;
  border-radius: 8px 8px 0px 0px;
  color: #b3b5f2;
}

::v-deep .el-tabs--border-card {
  background-color: #3a435b !important;
  border: none !important;
  box-shadow: none !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: none !important;
}

::v-deep
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #b3b5f2;
}

::v-deep .el-tabs__content {
  height: 420px;
  border-radius: 8px;
  max-height: 420px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #9e9e9e transparent;
}

::v-deep .el-tabs__item {
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  height: 46px;
  line-height: 46px;
}

::v-deep .el-divider--vertical {
  height: 60px;
  align-items: center;
  background-color: #3a435b;
}

.my-tabs-item {
  height: 142px;
  border-radius: 2px;
  border: 2px solid #3a435b;
  box-sizing: border-box;
  background: #282f41;
  display: flex;
  margin-bottom: 12px;
  cursor: pointer;
  position: relative;
}

.item-img {
  width: 138px;
  height: 138px;

  img {
    object-fit: cover;
    // z-index: 1;
    position: sticky;
    width: 100%;
    height: 100%;
  }
}

.item-body {
  flex: 1;
  display: flex;
  align-items: center;
}

.item-left,
.item-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    // display: block;
  }
  p {
    color: #fff;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
  }
  .newprice {
    color: #fff;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
    padding-right: 6px;
  }
  .flexp {
    display: flex;
    align-items: center;
  }
}

.active-item {
  border-color: #745cd4;
}

.active-item-icon {
  position: absolute;
  right: 0;
  border-radius: 0px 0px 0px 16px;
  background: #745cd4;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;

  i {
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 800;
    color: #282f41;
  }
}

.ext-body {
  width: 50%;
  margin: 0 auto;
  padding-top: 36px;
}

.bind-body {
  padding-top: 36px;
}

h4 {
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  text-align: center;
}
</style>
