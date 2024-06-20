<template>
  <div>
    <div class="dao-title">
      <div class="title-name">{{ $t('setupPlan.setupPlanTitle') }}</div>
    </div>
    <div class="box-form">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <el-form-item prop="io">
          <template slot="label">
            <span
              >{{ $t('setupPlan.ioLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupPlan.ioTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-radio-group v-model="formData.io">
            <el-radio
              v-for="item in outputType"
              :key="item.label"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="tokenForThisPlan">
          <template slot="label">
            <span
              >Token For This Plan
              <el-tooltip
                class="item"
                effect="dark"
                content="Define what Reward Token is issued by this Plan. It can be the Input or Output Token of this Seed Nodes, or it can be any kind of ERC-20."
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-select v-model="formData.tokenForThisPlan" placeholder="Please">
            <el-option
              v-for="item in tokenList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="tokenForThisPlanAddress"
          v-if="formData.tokenForThisPlan === 3"
        >
          <template slot="label">
            <span
              >Token ERC-20 Contract Address
              <el-tooltip
                class="item"
                effect="dark"
                content="Token ERC-20 Contract Address"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.tokenForThisPlanAddress"
            placeholder="Please Enter ERC-20 Contract Address"
          ></el-input>
        </el-form-item>
        <el-form-item prop="planStartDate">
          <template slot="label">
            <span
              >{{ $t('setupPlan.planStartDateLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupPlan.planStartDateTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-date-picker
            v-model="formData.planStartDate"
            type="date"
            :disabled="!planTime || !planTime.currentTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :placeholder="$t('setupPlan.planStartDateDer')"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="totalReward">
          <template slot="label">
            <span
              >{{ $t('setupPlan.totalRewardLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupPlan.totalRewardTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.totalReward"
            oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(Number(value)>1000000000) { value = 1000000000}if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            placeholder="Please Enter Amount "
          ></el-input>
        </el-form-item>

        <el-form-item prop="totalRounds">
          <template slot="label">
            <span
              >{{ $t('setupPlan.totalRoundsLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupPlan.totalRoundsTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.totalRounds"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,''); if(parseInt(value) > 1000) value = 1000;"
            :placeholder="$t('setupPlan.totalRoundsDer')"
          ></el-input>
        </el-form-item>

        <el-form-item prop="duration">
          <template slot="label">
            <span
              >{{ $t('setupPlan.durationLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupPlan.durationTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.duration"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,''); if(parseInt(value) > 1000) value = 1000;"
            placeholder="Please set the duration"
          >
            <span slot="suffix">Hours</span></el-input
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="new-btn">
      <el-button
        type="primary"
        class="el-dao-btnz"
        v-preventReClick
        @click="submit"
        >Submit</el-button
      >
    </div>
    <el-dialog
      title="Source Of This Payment"
      :visible.sync="isSource"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeDialog"
    >
      <div class="dialog_allocation">
        <p class="dialog-text">
          {{ $t('setupPlan.dialogText') }}
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
        {{ $t('setupPlan.dialogLoading') }}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import { createPlanParam, daoTimes } from '@/common/api'
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import {
  createPlan,
  getAllowanceTreasury,
  approveWork,
  getCode,
} from '@/common/walletService/services'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  components: { Loading },
  data() {
    return {
      outputType: [
        { label: 'Input Token Incentive', value: false },
        { label: 'Output Token Incentive', value: true },
      ],
      tokenList: [
        { label: 'Input Token Of This Seed Nodes', value: 1 },
        { label: 'Output Token Of This Seed Nodes', value: 2 },
        { label: 'Custom Reward Tokens', value: 3 },
      ],
      formData: {
        io: false,
        planStartDate: '',
        duration: 24,
        totalReward: 0,
        totalRounds: 1,
        useTreasury: false,
        tokenForThisPlan: 1,
        tokenForThisPlanAddress: '',
      },
      rules: {
        planStartDate: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        duration: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        totalReward: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        totalRounds: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        io: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        tokenForThisPlan: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        tokenForThisPlanAddress: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
              const isAddress = ethers.utils.isAddress(value)
              if (!strArr || !isAddress) {
                const str = 'Wrong address please modify and resubmit.'
                return callback(new Error(str))
              }
              const isCode = await getCode(value)
              if (!isCode) {
                return callback(new Error('Invalid ERC-20 Contract'))
              }
              return
            },
            trigger: ['change'],
          },
        ],
      },
      planTime: { currentTime: 0 },
      appLoading: false,
      isSource: false,
      reqData: {},
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
    pickerOptions() {
      let _this = this
      const currentTime = (_this.planTime.currentTime - 86400) * 1000
      return {
        disabledDate(time) {
          // return time.getTime() < Date.now();
          return time.getTime() < currentTime
        },
      }
    },
  },
  mounted() {
    this.getPlanTime()
  },
  methods: {
    closeDialog() {
      this.isSource = false
    },
    async getPlanTime() {
      try {
        const time = await daoTimes()
        this.planTime = time.data
        this.formData.planStartDate = dayjs(
          this.planTime.currentTime * 1000
        ).format('YYYY-MM-DD')
      } catch (error) {
        console.log(error)
      }
    },
    submit() {
      if (this.User.address) {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const req = {
              projectId: this.$route.query.id,
              planStartDate: this.formData.planStartDate,
              duration: this.formData.duration,
              customTokenAddress: this.formData.tokenForThisPlanAddress,
            }
            const res = await createPlanParam(req)
            this.reqData = {
              ...this.formData,
              ...res.data,
              projectId: this.$route.query.id,
              rewardToken:
                this.formData.tokenForThisPlan === 1
                  ? res.data.inputTokenAddress
                  : this.formData.tokenForThisPlan === 2
                  ? res.data.erc20TokenAddress
                  : this.formData.tokenForThisPlanAddress,
            }
            this.reqData.decimalsNum =
              this.formData.tokenForThisPlan === 1
                ? this.reqData.inputTokenDecimals
                : this.formData.tokenForThisPlan === 2
                ? this.reqData.erc20TokenDecimals
                : this.reqData.customTokenDecimal
            console.log(this.reqData, 'reqDatareqDatareqDatareqData')
            if (
              this.reqData.tokenForThisPlan === 1 ||
              (this.reqData.tokenForThisPlanAddress &&
                this.reqData.tokenForThisPlanAddress.toLowerCase() ===
                  this.reqData.inputTokenAddress.toLowerCase())
            ) {
              if (this.reqData.payCurrencyType === 'ETH') {
                this.appLoading = true
                this.formData.useTreasury = false
                this.reqData.useTreasury = false
                this.setCreatePlan()
              } else {
                this.appLoading = true
                this.setWallet()
              }
              return
            }
            if (
              this.reqData.tokenForThisPlan === 2 ||
              (this.reqData.tokenForThisPlanAddress &&
                this.reqData.tokenForThisPlanAddress.toLowerCase() ===
                  this.reqData.erc20TokenAddress.toLowerCase())
            ) {
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
                this.setWallet()
              }
              return
            }
            if (this.reqData.tokenForThisPlan === 3) {
              this.appLoading = true
              this.setWallet()
              return
            }
          }
        })
      } else {
        this.loginWallet()
      }
    },
    async setAmountGt() {
      if (Number(this.formData.totalReward) > 0) {
        this.appLoading = true
        this.isSource = false
        try {
          BigNumber.config({ EXPONENTIAL_AT: 38 })
          const num = new BigNumber(this.reqData.totalReward)
            .times(`1e${this.reqData.decimalsNum}`)
            .toString()
          const allowance = await getAllowanceTreasury(
            this.reqData.rewardToken,
            this.MetaMaskAddress
          )
          console.log(allowance, 'allowance')
          const appNum = new BigNumber(num).minus(allowance).toNumber()
          if (appNum > 0) {
            this.setApprove(this.reqData.rewardToken, num)
            return
          }
          this.setCreatePlan()
        } catch (error) {
          console.log(error, 'error')
          this.appLoading = false
          const err = JSON.stringify(error)
          console.log(err, ' this.errMsgText')
          this.errMsg(err)
        }
      } else {
        this.setCreatePlan()
      }
    },
    async setApprove(address, amount) {
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
    async setCreatePlan() {
      try {
        this.isSource = false
        const tx = await createPlan(this.reqData)
        const res = await tx.wait()
        this.appLoading = false
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
      this.setCreatePlan()
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
.dao-title {
  // margin-top: 24px;
  margin-bottom: 40px;
  width: 100%;
  .title-name {
    color: #f3f3f3;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    height: 84px;
    line-height: 84px;
    text-align: center;
    border-bottom: 0.5px solid #6062aa;
    margin-bottom: 16px;
  }
}
.box-form {
  width: 840px;
  margin: 0 auto;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.new-btn {
  text-align: center;
  margin: 60px 0;
}
.flexbox {
  height: 200px;
}
.el-select {
  width: 100%;
}
</style>
