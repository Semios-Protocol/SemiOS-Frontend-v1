<template>
  <div class="daos-box">
    <div class="daos-card">
      <div
        class="list-item-box"
        v-for="(item, idx) in dataList"
        :key="item.daoName + idx"
      >
        <div class="item-title">
          <div class="title-left"><img :src="item.planLogoUrl" alt="" /></div>
          <div class="title-cen">
            <h4>
              {{ item.daoName }} Top-Up Holders Incentive Plan #{{
                item.planNumber
              }}
            </h4>
            <p>
              {{ $t('incentivePlan.planAPRLabel') }} ：
              {{ item.rewardType !== 3 ? item.planAPR + '%' : 'Not Available' }}
            </p>
          </div>
          <div class="title-right">
            <el-button
              type="primary"
              @click="setAddToken(item)"
              v-preventReClick
              >{{ $t('incentivePlan.addTokensPlanBtn') }}</el-button
            >
          </div>
        </div>
        <div class="item-tab">
          <el-tabs v-model="item.activeName">
            <el-tab-pane
              :label="$t('incentivePlan.currentBlockInformationLabel')"
              name="currentBlockInformation"
            >
              <div class="infor-tab" v-if="item.incentiveStatus === 2">
                <el-row>
                  <el-col :span="8"
                    ><div class="card-num">
                      {{ item.topupHolders | bigNumFormat(5) }}
                    </div></el-col
                  >

                  <el-col :span="8"
                    ><div class="card-num">
                      {{ item.topupBalance | bigNumFormat(5) }}
                      <TokenIcon
                        v-if="item.incentiveType === 1"
                        :payCurrencyType="item.inputTokenSymbol"
                        :inputTokenAddress="item.inputTokenAddress"
                      />
                      <TokenIcon
                        v-else
                        :daoToken="true"
                        :daoSymbol="item.outputTokenSymbol"
                        :daoErc20Address="item.erc20TokenAddress"
                      /></div
                  ></el-col>
                  <el-col :span="8"
                    ><div class="card-num">
                      {{ item.blockReward | bigNumFormat(5) }}
                      <TokenIcon
                        :payCurrencyType="item.rewardTokenSymbol"
                        :inputTokenAddress="item.rewardToken"
                      /></div
                  ></el-col>
                </el-row>
                <el-row class="row-item">
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('incentivePlan.topupHoldersLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('incentivePlan.topupBalanceLabel') }}
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('incentivePlan.blockRewardLabel') }}
                    </div></el-col
                  >
                </el-row>
                <el-row>
                  <el-col :span="8"
                    ><div class="card-num">
                      {{ item.blockEndTime | timeFormatting() }}
                    </div></el-col
                  >
                </el-row>
                <el-row>
                  <el-col :span="8"
                    ><div class="card-name">
                      {{ $t('incentivePlan.blockEndTimeLabel') }}
                    </div></el-col
                  >
                </el-row>
              </div>

              <div class="not-data" v-else>
                {{
                  item.incentiveStatus === 1
                    ? 'This plan has not started yet'
                    : 'This plan is closed'
                }}
              </div>
            </el-tab-pane>
            <el-tab-pane label="ꔷ Basic Information" name="basicInformation">
              <div class="tab-plan">
                <PlanBasicInfo
                  :planId="item.planId"
                  v-if="item.activeName === 'basicInformation'"
                />
              </div>
            </el-tab-pane>
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

    <el-dialog
      title="Add Tokens To Plan"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="426px"
      :before-close="setIsAdd"
    >
      <div class="dialog_allocation">
        <el-form
          ref="formData"
          :model="formData"
          label-width="120px"
          :hide-required-asterisk="true"
        >
          <el-form-item prop="totalReward">
            <template slot="label">
              <span>{{ $t('incentivePlan.addTokensLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('incentivePlan.addTokensDer')"
              oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(Number(value)>1000000000) { value = 1000000000}if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
              v-model="formData.totalReward"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button
            type="primary"
            class="el-dao-btnz"
            style="width: 100%"
            @click="submit"
            v-preventReClick
            >Submit</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('incentivePlan.sourcePaymentTitle')"
      :visible.sync="isSource"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeDialog"
    >
      <div class="dialog_allocation">
        <p class="dialog-text">
          {{ $t('incentivePlan.dialogText') }}
        </p>
        <div class="allocation-btn">
          <el-button
            type="primary"
            class="el-dao-btnz"
            style="width: 100%"
            @click="setTreasury"
            v-preventReClick
            >Treasury</el-button
          >
          <el-button
            type="info"
            v-preventReClick
            style="margin: 0; width: 100%; margin-top: 12px"
            @click="setWallet"
            >My Wallet</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="Setup Plan"
      :visible.sync="appLoading"
      :close-on-click-modal="false"
      :show-close="false"
      width="426px"
    >
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">
        {{ $t('incentivePlan.appLoadingText') }}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loading from '@/components/Loading.vue'
import TokenIcon from '@/components/TokenIcon.vue'
import {
  getAllowanceTreasury,
  approveWork,
  addPlanTotalReward,
} from '@/common/walletService/services'
import { BigNumber } from 'bignumber.js'
export default {
  components: {
    TokenIcon,
    Loading,
    PlanBasicInfo: () => import('./PlanBasicInfo.vue'),
  },
  data() {
    return {
      tabName: 'collection',
      isAdd: false,
      formData: {
        totalReward: 0,
      },
      isSource: false,
      appLoading: false,
      dataList: [],
      reqData: {},
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
  mounted() {
    this.dataList = [...this.list]
  },
  methods: {
    closeDialog() {
      this.isSource = false
    },
    setIsAdd() {
      this.isAdd = false
    },
    setAddToken(item) {
      if (this.User.address) {
        if (item.incentiveStatus === 3)
          return this.errNotif('This plan is closed')
        this.formData.totalReward = 0
        this.reqData = { ...item }
        console.log('sasasdasd', this.reqData)
        this.isAdd = true
      } else {
        this.loginWallet()
      }
    },
    submit() {
      if (this.User.address) {
        this.isAdd = false
        this.reqData.decimalsNum = this.reqData.rewardTokenDecimal
        if (this.reqData.rewardType === 1) {
          if (this.reqData.rewardTokenSymbol === 'ETH') {
            this.appLoading = true
            this.formData.useTreasury = false
            this.reqData.useTreasury = false
            this.setPlanTotal()
          } else {
            this.appLoading = true
            this.setWallet()
          }
          return
        }

        if (this.reqData.rewardType === 2) {
          if (Number(this.formData.totalReward) > 0) {
            if (
              this.reqData.ownerAddress.toLowerCase() ===
              this.MetaMaskAddress.toLowerCase()
            ) {
              this.isSource = true
            } else {
              this.appLoading = true
              this.setWallet()
            }
          } else {
            this.appLoading = true
            this.setPlanTotal()
          }
          return
        }
        if (this.reqData.rewardType === 3) {
          this.appLoading = true
          this.setWallet()
          return
        }
      } else {
        this.loginWallet()
      }
    },
    async setAmountGt() {
      console.log(
        Number(this.formData.totalReward),
        'Number(this.formData.totalReward)'
      )
      if (Number(this.formData.totalReward) > 0) {
        this.appLoading = true
        this.isSource = false
        try {
          BigNumber.config({ EXPONENTIAL_AT: 38 })
          const num = new BigNumber(this.formData.totalReward)
            .times(`1e${this.reqData.decimalsNum}`)
            .toString()
          console.log(num, 'num')
          const allowance = await getAllowanceTreasury(
            this.reqData.rewardToken,
            this.MetaMaskAddress
          )
          console.log(allowance, 'allowance')
          const appNum = new BigNumber(num).minus(allowance).toNumber()
          console.log(appNum, 'appNum')
          if (appNum > 0) {
            this.setApprove(this.reqData.rewardToken, num)
            return
          }
          this.setPlanTotal()
        } catch (error) {
          console.log(error, 'error')
          this.appLoading = false
          const err = JSON.stringify(error)
          console.log(err, ' this.errMsgText')
          this.errMsg(err)
        }
      } else {
        this.setPlanTotal()
      }
    },
    async setApprove(address, amount) {
      console.log(address, amount, '============授权')
      try {
        this.appLoading = true
        const app = await approveWork(address, amount)
        await app.wait()
        this.successNotif('Successful transaction')
        this.appLoading = false
      } catch (error) {
        this.errMsg(JSON.stringify(error))
        this.appLoading = false
      }
    },
    async setPlanTotal() {
      try {
        console.log(
          this.formData.totalReward,
          'this.formData.totalReward',
          this.reqData
        )
        this.isSource = false
        BigNumber.config({ EXPONENTIAL_AT: 38 })
        const req = {
          planId: this.reqData.planCode,
          amount: new BigNumber(this.formData.totalReward)
            .times(`1e${this.reqData.decimalsNum}`)
            .toString(),
          useTreasury: this.reqData.useTreasury
            ? this.reqData.useTreasury
            : false,
          totalReward: this.formData.totalReward,
          rewardTokenSymbol: this.reqData.rewardTokenSymbol,
        }
        const tx = await addPlanTotalReward(req)
        const res = await tx.wait()
        this.appLoading = false
        this.reqData = {}
        this.formData = {
          totalReward: 0,
        }
        this.senMsg(res, 'Transury')
      } catch (error) {
        console.log(error, 'error')
        this.appLoading = false
        const err = JSON.stringify(error)
        console.log(err, ' this.errMsgText')
        this.errMsg(err)
      }
    },
    setTreasury() {
      this.formData.useTreasury = true
      this.reqData.useTreasury = true
      this.appLoading = true
      this.setPlanTotal()
    },
    setWallet() {
      this.formData.useTreasury = false
      this.reqData.useTreasury = false
      this.setAmountGt()
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
      color: #ffffff;
      font-family: Roboto;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
      letter-spacing: 0.2px;
      margin: 0;
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
.not-data {
  height: 121px;
  line-height: 121px;
  text-align: center;
}

.flexbox {
  height: 200px;
}
.tab-plan {
  height: 109px;
}
</style>
