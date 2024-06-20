<template>
  <div class="daos-box">
    <div class="daos-card">
      <div
        class="list-item-box"
        v-for="(item, idx) in list"
        :key="item.daoName + idx"
      >
        <div class="item-title">
          <div class="title-left"><img :src="item.daoLogoUrl" alt="" /></div>
          <div class="title-cen">
            <a :href="aPush(item)" style="text-decoration: none">
              <h4>
                {{ item.daoName }} <span>{{ item.erc20Name }}</span>
              </h4>
            </a>
            <p>
              {{ item.daoDescription }}
            </p>
          </div>
          <div class="title-right">
            <span class="item-span">
              <span @click.stop.prevent="setAmount(item, idx)">
                <svg-icon
                  icon-class="shou"
                  :style="{ color: item.favorited ? '#ffa2a2' : '' }"
              /></span>
              <span> {{ item.favoriteAmount | numberFilter }}</span>
            </span>
            <!-- <a :href="aPush(item)" style="text-decoration: none">
              <el-button class="view-btn" type="text"
                >View <i class="el-icon-arrow-right"
              /></el-button>
            </a> -->
          </div>
        </div>
        <div class="item-tab">
          <el-tabs v-model="item.activeName">
            <el-tab-pane
              :label="$t('nodeItemCard.tabNames')[0]"
              name="currentMintWindowInformation"
            >
              <div class="infor-tab">
                <el-row>
                  <el-col :span="9"
                    ><div class="card-num">
                      {{
                        item.mintWindowInfoVo.minters
                          | bigNumFormat(5, 0.000001)
                      }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.mintWindowInfoVo.mintFee
                          | bigNumFormat(5, 0.000001)
                      }}
                      <TokenIcon
                        :daoToken="item.modeStatusVo.daoToken"
                        :daoSymbol="item.daoSymbol"
                        :daoErc20Address="item.daoErc20Address"
                        :payCurrencyType="item.payCurrencyType"
                        :inputTokenAddress="item.inputTokenAddress"
                      /></div
                  ></el-col>
                  <el-col :span="7"
                    ><div class="card-num">
                      {{
                        item.mintWindowInfoVo.mintedWorks
                          | bigNumFormat(5, 0.000001)
                      }}
                    </div></el-col
                  >
                </el-row>
                <el-row class="row-item">
                  <el-col :span="9"
                    ><div class="card-name">
                      {{ $t('nodeDetail.mintersLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.mintFeeLabel') }}
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="card-name">
                      {{ $t('nodeDetail.mintedWorksLabel') }}
                    </div></el-col
                  >
                </el-row>
                <el-row>
                  <el-col :span="9"
                    ><div class="card-num">
                      {{
                        item.mintWindowInfoVo.blockRewardToken
                          | bigNumFormat(5, 0.000001)
                      }}
                      <TokenIcon
                        :daoToken="true"
                        :daoSymbol="item.daoSymbol"
                        :daoErc20Address="item.daoErc20Address"
                      />
                      <span v-if="!item.modeStatusVo.topupMode">
                        + {{ item.mintWindowInfoVo.blockRewardEth }}
                        <TokenIcon
                          :payCurrencyType="item.payCurrencyType"
                          :inputTokenAddress="item.inputTokenAddress"
                      /></span></div
                  ></el-col>
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.mintWindowInfoVo.internalRewardToken
                          | bigNumFormat(5, 0.000001)
                      }}
                      <TokenIcon
                        :daoToken="true"
                        :daoSymbol="item.daoSymbol"
                        :daoErc20Address="item.daoErc20Address"
                      />
                      <span v-if="!item.modeStatusVo.topupMode">
                        +
                        {{ item.mintWindowInfoVo.internalRewardEth }}
                        <TokenIcon
                          :payCurrencyType="item.payCurrencyType"
                          :inputTokenAddress="item.inputTokenAddress"
                      /></span></div
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="9"
                    ><div class="card-name">
                      {{ $t('nodeDetail.blockRewardLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.internalIncentivesLabel') }}
                    </div></el-col
                  >
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('nodeItemCard.tabNames')[1]"
              name="basicInformation"
            >
              <div class="infor-tab">
                <el-row>
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.basicInformationVo.mintCap
                          | bigNumFormat(5, 0.000001)
                      }}
                      /
                      {{
                        item.basicInformationVo.totalMintCap
                          | bigNumFormat(5, 0.000001)
                      }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.basicInformationVo.mintWindowCap
                          | bigNumFormat(5, 0.000001)
                      }}
                      /
                      {{
                        item.basicInformationVo.totalMintWindowCap
                          | bigNumFormat(5, 0.000001)
                      }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.basicInformationVo.subDaoAssetPoolEth
                          | bigNumFormat(5, 0.000001)
                      }}
                      <TokenIcon
                        :payCurrencyType="item.payCurrencyType"
                        :inputTokenAddress="item.inputTokenAddress"
                      /></div
                  ></el-col>
                </el-row>
                <el-row class="row-item">
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.totalERC721MintCapLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.blockMintedWorkByBlockMintCapLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.subNodesAssetPoolETHLabel') }}
                    </div></el-col
                  >
                </el-row>
                <el-row>
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.basicInformationVo.mintWindowDuration
                          | bigNumFormat(5, 0.000001)
                      }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.basicInformationVo.remainingMintWindow
                          | bigNumFormat(5, 0.000001)
                      }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-num">
                      {{
                        item.basicInformationVo.subDaoAssetPoolDaoToken
                          | bigNumFormat(5, 0.000001)
                      }}
                      <TokenIcon
                        :daoToken="true"
                        :daoSymbol="item.daoSymbol"
                        :daoErc20Address="item.daoErc20Address"
                      /></div
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.blockWindowDurationLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.remainingBlockWindowsLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('nodeDetail.subNodesAssetPoolERC20TokensLabel') }}
                    </div></el-col
                  >
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="ꔷ Mode Status" name="modeStatus">
              <div class="item-tab">
                <el-row class="row-item2">
                  <el-col :span="9"
                    ><div class="card-name card-item">
                      <p>
                        <svg-icon
                          :icon-class="
                            item.modeStatusVo.lotteryMode ? 'suc' : 'err'
                          "
                        />
                      </p>
                      <span>{{ $t('nodeDetail.lotteryModeLabel') }}</span>
                      <span v-if="item.modeStatusVo.lotteryMode"
                        >Rollover: {{ item.modeStatusVo.lotteryDuration }}</span
                      >
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name card-item">
                      <p>
                        <svg-icon
                          :icon-class="
                            item.modeStatusVo.daoToken ? 'suc' : 'err'
                          "
                        />
                      </p>
                      <span>{{ $t('nodeDetail.erc20TokenModeLabel') }}</span>
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="card-name card-item">
                      <p>
                        <svg-icon
                          :icon-class="
                            item.modeStatusVo.topupMode ? 'suc' : 'err'
                          "
                        />
                      </p>
                      <span>{{ $t('nodeDetail.topupModeLabel') }}</span>
                    </div></el-col
                  >
                </el-row>

                <el-row>
                  <el-col :span="9"
                    ><div class="card-name card-item">
                      <p>
                        <svg-icon
                          :icon-class="
                            item.modeStatusVo.unifiedPriceMode ? 'suc' : 'err'
                          "
                        />
                      </p>
                      <span>{{ $t('nodeDetail.unifiedPriceModeLabel') }}</span>
                      <span
                        class="unified-span"
                        v-if="item.modeStatusVo.unifiedPriceMode"
                        ><span>{{ item.modeStatusVo.unifiedPrice }} </span>
                        <TokenIcon
                          style="margin-left: 5px"
                          size="14px"
                          :daoToken="item.modeStatusVo.daoToken"
                          :daoSymbol="item.daoSymbol"
                          :daoErc20Address="item.daoErc20Address"
                          :payCurrencyType="item.payCurrencyType"
                          :inputTokenAddress="item.inputTokenAddress"
                        />
                      </span></div
                  ></el-col>
                  <el-col :span="8"
                    ><div class="card-name card-item">
                      <p>
                        <svg-icon
                          :icon-class="
                            item.modeStatusVo.speicialStrategy ? 'suc' : 'err'
                          "
                        />
                      </p>
                      <span>{{ $t('nodeDetail.specialStartegyLabel') }}</span>
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="card-name card-item">
                      <p>
                        <svg-icon
                          :icon-class="
                            item.modeStatusVo.infiniteMode ? 'suc' : 'err'
                          "
                        />
                      </p>
                      <span>{{ $t('nodeDetail.infiniteModeLabel') }}</span>
                    </div></el-col
                  >
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="ꔷ ETH" name="ethTab">
              <div class="infor-tab" v-if="item.activeName === 'ethTab'">
                <eth-info :daoId="item.daoId" :tabName="tabName" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="ꔷ ERC-20 Token" name="daoToken"
              ><div class="infor-tab" v-if="item.activeName === 'daoToken'">
                <dao-info :daoId="item.daoId" :tabName="tabName" /></div
            ></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="flexbox" v-if="isLoading">
      <div class="sk-circle-bounce">
        <div class="sk-child sk-circle-1"></div>
        <div class="sk-child sk-circle-2"></div>
        <div class="sk-child sk-circle-3"></div>
        <div class="sk-child sk-circle-4"></div>
        <div class="sk-child sk-circle-5"></div>
        <div class="sk-child sk-circle-6"></div>
        <div class="sk-child sk-circle-7"></div>
        <div class="sk-child sk-circle-8"></div>
        <div class="sk-child sk-circle-9"></div>
        <div class="sk-child sk-circle-10"></div>
        <div class="sk-child sk-circle-11"></div>
        <div class="sk-child sk-circle-12"></div>
      </div>
    </div>
    <div
      v-if="list.length === 0 && !isLoading"
      class="noList"
      style="height: 350px; margin: 0"
    >
      No items to display
    </div>

    <div class="noList" v-if="isAll && list.length > 0 && !isLoading">
      <div class="xian"></div>
      <div>All Contents Loaded</div>
      <div class="xian"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { favoriteActions, favoriteCancel } from '@/common/api'
import DaoInfo from '../views/protoWeb/member/assetAllocation/DaoInfo.vue'
import EthInfo from '../views/protoWeb/member/assetAllocation/EthInfo.vue'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: { DaoInfo, EthInfo, TokenIcon },
  data() {
    return {
      tabName: 'collection',
    }
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isAll: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  mounted() {},
  methods: {
    async setAmount(val, idx) {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      const sig = await this.getSig()
      if (sig) {
        const query = {
          type: 0,
          favoriteId: val.daoId,
        }
        const res = val.favorited
          ? await favoriteCancel(query)
          : await favoriteActions(query)
        if (res) {
          const item = {
            ...val,
          }
          item.favoriteAmount += item.favorited ? -1 : 1
          item.favorited = !item.favorited
          val.favoriteAmount += item.favoriteAmount
          val.favorited = item.favorited
          this.$set(this.list, idx, item)
        }
      }
    },

    aPush(item) {
      // return `/dao?type=${item.daoStatus === 3 ? "nfts" : "unmintedWorks"}&id=${
      //   item.daoId
      // }`;
      return `/dao?type=nfts&id=${item.daoId}`
    },
    goExploreUnmintedWorks(item) {
      const path = 'nfts'
      this.$router.push({
        path: '/dao',
        query: {
          type: path,
          id: item.daoId,
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.daos-card {
  margin: 0 auto;
  width: 920px;
}
.list-item-box {
  border-radius: 2px;
  background: #252b3a;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 16px;
}
.item-title {
  height: 68px;
  width: 100%;
  display: flex;
  margin-bottom: 24px;
  .title-left {
    width: 68px;
    height: 68px;
    margin-right: 12px;
    img {
      width: 68px;
      height: 68px;
      object-fit: cover;
      z-index: 1;
      position: sticky;
    }
  }
  .title-cen {
    flex: 1;
    h4 {
      color: #bbbaba;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.2px;
      margin: 0;
      margin-bottom: 4px;
      span {
        color: #9e9e9e;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 0.2px;
      }
    }
    p {
      color: #9e9e9e;
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
      letter-spacing: 0.2px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  .title-right {
    width: 200px;
    margin-left: auto;
    text-align: end;
  }
  .item-span {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    margin-right: 16px;
  }
}
.view-btn {
  padding: 0 !important;
}
::v-deep .el-button--text {
  color: #25b0c2;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.2px;
}
::v-deep .el-button--text:active {
  color: #138493;
}
::v-deep .el-button--text:focus {
  color: #138493;
}
::v-deep .el-button--text:hover {
  color: #47c4d6;
}

.title-tab {
  height: 85px;
  border-bottom: 0.5px solid #b3b5f2;
  border-top: 0.5px solid #b3b5f2;
  box-sizing: border-box;
  line-height: 85px;
  min-width: 1240px;
}
::v-deep .el-tabs__nav {
  float: none;
  margin: 0 auto;
  text-align: start !important;
}
::v-deep .el-tabs__active-bar {
  display: none;
}
::v-deep .el-tabs__item:hover {
  color: #8c91ff;
}
::v-deep .el-tabs__item.is-active {
  color: #8c91ff;
}
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
::v-deep .el-tabs__item {
  color: #bbbaba;
  font-weight: 400 !important;

  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px; /* 200% */
  letter-spacing: 0.2px;
}

.row-item2 {
  margin-bottom: 24px;
}
.infor-tab {
  margin-top: 12px;
  .row-item {
    margin-bottom: 24px;
  }
}

.card-name {
  color: #9e9e9e;
  font-size: 14px;
  font-weight: 400;
}
.card-num {
  color: #fff;
  // margin-bottom: 12px;
}
.card-item {
  display: flex;
  flex-direction: column;
  p {
    margin: 0;
    margin-bottom: 6px;
  }
  span {
    display: block;
  }
}
.flexbox {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  .sk-circle-bounce {
    width: 4em;
    height: 4em;
    position: relative;
    margin: auto;
  }
  .sk-circle-bounce .sk-child {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .sk-circle-bounce .sk-child:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #745cd4;
    border-radius: 100%;
    -webkit-animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
    animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
  }
  .sk-circle-bounce .sk-circle-2 {
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg);
  }
  .sk-circle-bounce .sk-circle-3 {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  .sk-circle-bounce .sk-circle-4 {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .sk-circle-bounce .sk-circle-5 {
    -webkit-transform: rotate(120deg);
    transform: rotate(120deg);
  }
  .sk-circle-bounce .sk-circle-6 {
    -webkit-transform: rotate(150deg);
    transform: rotate(150deg);
  }
  .sk-circle-bounce .sk-circle-7 {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .sk-circle-bounce .sk-circle-8 {
    -webkit-transform: rotate(210deg);
    transform: rotate(210deg);
  }
  .sk-circle-bounce .sk-circle-9 {
    -webkit-transform: rotate(240deg);
    transform: rotate(240deg);
  }
  .sk-circle-bounce .sk-circle-10 {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  .sk-circle-bounce .sk-circle-11 {
    -webkit-transform: rotate(300deg);
    transform: rotate(300deg);
  }
  .sk-circle-bounce .sk-circle-12 {
    -webkit-transform: rotate(330deg);
    transform: rotate(330deg);
  }
  .sk-circle-bounce .sk-circle-2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  .sk-circle-bounce .sk-circle-3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
  .sk-circle-bounce .sk-circle-4:before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }
  .sk-circle-bounce .sk-circle-5:before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }
  .sk-circle-bounce .sk-circle-6:before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }
  .sk-circle-bounce .sk-circle-7:before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }
  .sk-circle-bounce .sk-circle-8:before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }
  .sk-circle-bounce .sk-circle-9:before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }
  .sk-circle-bounce .sk-circle-10:before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }
  .sk-circle-bounce .sk-circle-11:before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }
  .sk-circle-bounce .sk-circle-12:before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }

  @-webkit-keyframes sk-circle-bounce-delay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes sk-circle-bounce-delay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
}
.noList {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbbaba;
  font-size: 18px;
  margin: 42px 0;
  .xian {
    height: 1px;
    width: 45px;
    background-color: #d9d9d9;
    margin: 0 15px;
  }
}
.unified-span {
  display: flex !important;
  align-items: center;
}
</style>
