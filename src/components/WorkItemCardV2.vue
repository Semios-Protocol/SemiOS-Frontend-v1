<template>
  <div class="works-box">
    <div
      class="work-item-card"
      v-for="(item, index) in list"
      :key="item.workId"
    >
      <div class="card-box">
        <div class="card-box-left">
          <a :href="aPush(item)" style="text-decoration: none; color: #fff">
            <img :src="item.imgUrl"
          /></a>
        </div>
        <div class="card-box-right">
          <div class="item-name">
            <a :href="aPush(item)" style="text-decoration: none; color: #fff">
              <span class="item-text" v-if="item.workStatus === 1">
                {{ item.daoName
                }}<span style="color: #d9d9d9">.{{ item.workNumber }}</span>
              </span>
              <span v-else>
                <span class="item-text" v-if="item.generate === 1">
                  {{ item.daoName }}<span style="color: #fff">#</span
                  ><span style="color: #b3b5f2">Pass</span
                  ><span style="color: #d9d9d9">/Unminted</span>
                </span>
                <span class="item-text" v-else>
                  {{ item.daoName }}<span style="color: #fff">#</span
                  ><span style="color: #b3b5f2">{{
                    item.creatorAddress | splitAddress
                  }}</span
                  ><span style="color: #d9d9d9">/Unminted</span>
                </span>
              </span></a
            >
            <span class="item-span">
              <span @click.stop.prevent="setAmount(item, index)">
                <svg-icon
                  icon-class="shou"
                  :style="{ color: item.favorited ? '#ffa2a2' : '' }"
              /></span>
              <span> {{ item.favoriteAmount | numberFilter }}</span>
            </span>
          </div>

          <div class="item-price">
            <span class="price-name">{{ priceType[item.priceType] }}: </span>
            <span
              v-if="
                item.royaltyTokenPrice !== null && item.royaltyTokenPrice !== ''
              "
            >
              <span
                >{{ item.royaltyTokenPrice | bigNumFormat(5, 0.00001) }}
              </span>
              <TokenIcon
                :daoToken="item.erc20PaymentMode"
                :daoSymbol="item.daoSymbol"
                :daoErc20Address="item.daoErc20Address"
                :payCurrencyType="item.payCurrencyType"
                :inputTokenAddress="item.inputTokenAddress"
              />
            </span>
            <span v-else>
              <span>{{ item.price | bigNumFormat(5, 0.00001) }} </span>
              <TokenIcon
                :daoToken="item.erc20PaymentMode"
                :daoSymbol="item.daoSymbol"
                :daoErc20Address="item.daoErc20Address"
                :payCurrencyType="item.payCurrencyType"
                :inputTokenAddress="item.inputTokenAddress"
              />
            </span>
            <span
              class="price-work"
              v-if="item.workStatus === 0 && item.passesTotalQuantity"
            >
              <span class="price-name"
                >{{
                  $t(
                    'workDetail.matchMediaintedPassesByTotalMintablePassesLabel'
                  )
                }}:</span
              >
              {{ item.havePassesQuantity }}/{{ item.passesTotalQuantity }}
            </span>
          </div>
          <div class="item-des">
            {{ item.workDescription }}
          </div>
        </div>
      </div>
      <div class="box-detail">
        <span class="det-title">{{
          $t('nodeDetail.currentBlockWindowInformationLabel')
        }}</span>
        <div class="infor-tab">
          <el-row>
            <el-col :span="8"
              ><div class="card-num">
                {{ item.minters | bigNumFormat(5, 0.000001) }}
              </div></el-col
            >
            <el-col :span="8"
              ><div class="card-num">
                {{ item.mintFee | bigNumFormat(5, 0.000001) }}
                <TokenIcon
                  :daoToken="item.erc20PaymentMode"
                  :daoSymbol="item.daoSymbol"
                  :daoErc20Address="item.daoErc20Address"
                  :payCurrencyType="item.payCurrencyType"
                  :inputTokenAddress="item.inputTokenAddress"
                /></div
            ></el-col>
            <el-col :span="8"
              ><div class="card-num">
                {{ item.mintedWorks | bigNumFormat(5, 0.000001) }}
              </div></el-col
            >
          </el-row>
          <el-row class="row-item">
            <el-col :span="8"
              ><div class="card-name">
                {{ $t('nodeDetail.mintersLabel') }}
              </div></el-col
            >
            <el-col :span="8"
              ><div class="card-name">
                {{ $t('nodeDetail.mintFeeLabel') }}
              </div></el-col
            >
            <el-col :span="8"
              ><div class="card-name">
                {{ $t('nodeDetail.mintedWorksLabel') }}
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="8"
              ><div class="card-num">
                {{ item.blockRewardToken | bigNumFormat(5, 0.000001) }}
                <TokenIcon
                  :daoToken="true"
                  :daoSymbol="item.daoSymbol"
                  :daoErc20Address="item.daoErc20Address"
                />
                <span v-if="!item.topupMode">
                  + {{ item.blockRewardEth }}
                  <TokenIcon
                    :payCurrencyType="item.payCurrencyType"
                    :inputTokenAddress="item.inputTokenAddress"
                /></span></div
            ></el-col>
            <el-col :span="8"
              ><div class="card-num">
                {{ item.internalRewardToken | bigNumFormat(5, 0.000001) }}
                <TokenIcon
                  :daoToken="true"
                  :daoSymbol="item.daoSymbol"
                  :daoErc20Address="item.daoErc20Address"
                />
                <span v-if="!item.topupMode">
                  + {{ item.internalRewardEth }}
                  <TokenIcon
                    :payCurrencyType="item.payCurrencyType"
                    :inputTokenAddress="item.inputTokenAddress"
                /></span></div
            ></el-col>
            <el-col :span="8" v-if="item.workStatus === 0"
              >{{ item.mintersMaxRewardToken | bigNumFormat(5, 0.00001) }}
              <TokenIcon
                :daoToken="true"
                :daoSymbol="item.daoSymbol"
                :daoErc20Address="item.daoErc20Address" />
              <span v-if="!item.topupMode">
                + {{ item.mintersMaxRewardEth | bigNumFormat(5, 0.00001) }}
                <TokenIcon
                  :payCurrencyType="item.payCurrencyType"
                  :inputTokenAddress="item.inputTokenAddress" /></span
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="8"
              ><div class="card-name">
                {{ $t('nodeDetail.blockRewardLabel') }}
              </div></el-col
            >
            <el-col :span="8"
              ><div class="card-name">
                {{ $t('nodeDetail.internalIncentivesLabel') }}
              </div></el-col
            >
            <el-col :span="8" v-if="item.workStatus === 0">
              <div class="card-name">
                {{ $t('nodeDetail.minterWorkLabel') }}
              </div></el-col
            >
          </el-row>
        </div>
      </div>
      <!-- <div class="box-icons" v-show="!item.isMore">
        <span @click="item.isMore = true" class="seebtn fontbtn">
          See More <i class="el-icon-arrow-down"></i>
        </span>
      </div>
      <div class="box-icons" v-show="item.isMore">
        <span @click="item.isMore = false" class="seebtn fontbtn">
          See Less <i class="el-icon-arrow-up"></i>
        </span>
      </div> -->
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
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: {
    TokenIcon,
  },
  data() {
    return {
      priceType: ['Price', 'Fixed Price', 'Unified Price'],
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
  methods: {
    aPush(item) {
      return `/workDetails?id=${item.workId}`
    },
    async setAmount(val, idx) {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      const sig = await this.getSig()
      if (sig) {
        const query = {
          type: 2,
          favoriteId: val.workId,
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
  },
}
</script>

<style scoped lang="scss">
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
.box-detail {
  margin-left: 32px;
  margin-top: 16px;
  border-radius: 2px;
  background: #2a2f41;
  padding: 16px;
  box-sizing: border-box;
  .infor-tab {
    color: #fff;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    .row-item {
      margin-bottom: 16px;
    }
  }
  .card-name {
    color: #9e9e9e;

    font-family: Inter;
    font-size: 14px;
  }
  .det-title {
    display: block;
    color: #9e9e9e;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 16px;
  }
}
.card-box {
  display: flex;
  .card-box-left {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .card-box-right {
    flex: 1;
    .item-span {
      color: #9e9e9e;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      float: right;
      cursor: pointer;
    }
  }
  .item-name {
    color: #fff;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0.2px;
    margin-bottom: 12px;
  }
  .item-price {
    color: #fff;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
  .price-work {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    margin-left: 12px;
    margin-bottom: 12px;
  }
  .item-des {
    color: #fff;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    // height: 72px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.box-icons {
  color: #25b0c2;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  margin-top: 8px;
  .seebtn {
    cursor: pointer;
  }
}
.works-box {
  width: 896px;
  margin: 0 auto;
}
.work-item-card {
  width: 100%;
  // min-height: 220px;
  border-radius: 2px;
  background: #252b3a;
  margin-bottom: 16px;
  padding: 24px;
  box-sizing: border-box;
}
.item-text {
  color: #8c91ff;
}
.price-name {
  color: #9e9e9e;
  font-size: 12px;
  font-weight: 400;
}
</style>
