<template>
  <div class="bing-box">
    <el-dialog
      title="Select Top-up Balance"
      :visible.sync="isDialog"
      :before-close="setDialog"
      :close-on-click-modal="false"
      width="896px"
    >
      <div class="dialog-box">
        <el-tabs type="border-card" :stretch="true" v-model="activeName">
          <el-tab-pane label="Top-up Balance" name="topBalance">
            <div
              class="my-tabs-item"
              :class="
                item.workLockStatus !== 1 && activeWork.workId === item.workId
                  ? 'active-item'
                  : ''
              "
              v-for="(item, idx) in unTopUpMintList"
              :key="item.imgUrl + idx"
              @click="setItem(item)"
            >
              <div
                class="active-item-icon"
                v-show="
                  item.workLockStatus !== 1 && activeWork.workId === item.workId
                "
              >
                <i class="el-icon-check" />
              </div>
              <div class="lock-icon" v-show="item.workLockStatus === 1">
                <svg-icon icon-class="unlocking" />
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
          </el-tab-pane>
          <el-tab-pane label="Wallet" name="wallet">
            <div class="bind-body">
              <h4>
                {{ $t('workDetail.balanceText') }}
              </h4>
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
          >Mint NFT</el-button
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
      activeName: 'topBalance',
      activeWork: { workId: null },
    }
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    unTopUpMintList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    isBtn() {
      console.log(this.activeName, 'this.activeName', this.activeWork)
      switch (this.activeName) {
        case 'topBalance':
          return this.activeWork.workId ? true : false
        case 'wallet':
          return true
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
      if (this.activeName === 'topBalance') {
        console.log(this.activeWork, 'this.activeWork')
        const nftIdentifier = {
          erc721Address: this.activeWork.erc721TokenAddress,
          tokenId: this.activeWork.workNumber,
        }
        this.$emit('setEmitIsDialog', nftIdentifier)
      }
      console.log(this.activeName, 'this.activeName ')
      if (this.activeName === 'wallet') {
        const nftIdentifier = {
          erc721Address: ethers.constants.AddressZero,
          tokenId: 0,
        }
        this.$emit('setEmitIsDialog', nftIdentifier)
      }
    },
    setItem(item) {
      if (item.workLockStatus === 1) return
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

  p {
    color: #fff;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
  }

  span {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    display: block;
  }
}

.active-item {
  border-color: #745cd4;
}

.lock-icon {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282f41;
  opacity: 0.8;
  z-index: 1;
  font-size: 24px;
  cursor: no-drop;
  // right: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
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
