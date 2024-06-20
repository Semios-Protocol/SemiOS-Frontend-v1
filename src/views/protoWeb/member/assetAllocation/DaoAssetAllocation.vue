<template>
  <loading v-if="isLoading" />
  <div class="box" v-else>
    <div class="asset-box">
      <p class="asset-title">
        <span class="spa1">{{ $t('nodeDetail.subDaoAssetPoolLabel') }} : </span
        ><span
          class="spa2"
          @click="openHash(initData.subDaoAssetPool, 'address')"
          style="cursor: pointer"
          >{{ initData.subDaoAssetPool }}</span
        >
        <span @click="copy(initData.subDaoAssetPool)" class="copy">
          <svg-icon icon-class="copyhash1" />
        </span>
      </p>
      <div class="asset-card">
        <div class="card-l">
          <div class="card-title">
            {{ $t('nodeDetail.ethRelevantInformationLabel') }}
          </div>
          <!-- <div class="left-body">Because this is top-up mode, there is no eth-related asset information display.</div> -->
          <div class="left-body">
            <p class="asset-title"></p>
            <div>
              <el-row :gutter="20">
                <el-col :span="16"
                  ><div class="grid-content bg-purple">
                    <el-form
                      ref="formEth"
                      :model="formEth"
                      :hide-required-asterisk="nohide"
                      :rules="formEthRules"
                    >
                      <el-form-item prop="amount">
                        <el-input
                          type="text"
                          placeholder="Please"
                          oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          v-model="formEth.amount"
                        ></el-input>
                      </el-form-item>
                    </el-form></div
                ></el-col>
                <el-col :span="8"
                  ><div class="grid-content bg-purple">
                    <el-button
                      type="primary"
                      class="el-dao-btnz"
                      @click="payEth"
                      >Pay</el-button
                    >
                  </div></el-col
                >
              </el-row>
            </div>
            <p class="asset-title">
              <span class="spa1"
                >{{ $t('nodeDetail.currentDaoEthLabel') }} :
                {{ initData.currentDaoEth | balanceFilter(4) }}
              </span>
            </p>
          </div>
          <div class="chart-mode" style="margin-bottom: 28px">
            <chart-asset-pool-eth :dayTime="qvalue" :address="address" />
          </div>
          <div class="info-module">
            <eth-info />
          </div>
        </div>
        <div class="card-r">
          <div class="card-title">
            {{ $t('nodeDetail.erc20TokensRelevantInformationLabel') }}
          </div>
          <div class="right-body">
            <p class="asset-title">
              <span class="spa1"
                >{{ $t('nodeDetail.erc20ContractLabel') }} : </span
              ><span
                class="spa2"
                @click="openHash(initData.subDaoErc20, 'address')"
                style="cursor: pointer"
                >{{ initData.subDaoErc20 }}</span
              >
              <span @click="copy(initData.subDaoErc20)" class="copy">
                <svg-icon icon-class="copyhash1" />
              </span>
            </p>
            <div>
              <el-row :gutter="20">
                <el-col :span="16"
                  ><div class="grid-content bg-purple">
                    <el-form
                      ref="formData"
                      :model="formData"
                      :hide-required-asterisk="nohide"
                      :rules="formDataRules"
                    >
                      <el-form-item prop="amount">
                        <el-input
                          type="text"
                          placeholder="Please"
                          oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          v-model="formData.amount"
                        ></el-input>
                      </el-form-item>
                    </el-form></div
                ></el-col>
                <el-col :span="8"
                  ><div class="grid-content bg-purple">
                    <el-button
                      type="primary"
                      class="el-dao-btnz"
                      @click="payToken"
                      >Pay</el-button
                    >
                  </div></el-col
                >
              </el-row>
            </div>
            <p class="asset-title">
              <span class="spa1"
                >{{ $t('nodeDetail.currentDaoEthLabel') }} :
                {{ initData.currentDaoToken | balanceFilter(4) }}
              </span>
            </p>
          </div>
          <div class="chart-mode" style="margin-bottom: 28px">
            <chart-asset-pool-token :dayTime="qvalue" :address="address" />
          </div>
          <div class="info-module">
            <dao-info />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="Loading!"
      :visible.sync="dialogLoading"
      :center="true"
      width="412px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialogLoading">
        <div class="dialog-loading">
          <loading />
        </div>
        <p class="dialog-text">
          {{ $t('nodeDetail.daoAssetAllocationDialogText') }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copys } from '@/utils'
import { mapState } from 'vuex'
import { daoAllocation } from '@/common/api'
import {
  transferPay,
  transactionEth,
  transactionERC20,
  decimals,
} from '@/common/walletService/services'
import { BigNumber } from 'bignumber.js'
import ChartAssetPoolEth from './ChartAssetPoolEth.vue'
import ChartAssetPoolToken from './ChartAssetPoolToken.vue'
import DaoInfo from './DaoInfo.vue'
import EthInfo from './EthInfo.vue'
import Loading from '@/components/Loading.vue'
export default {
  components: {
    Loading,
    ChartAssetPoolEth,
    ChartAssetPoolToken,
    DaoInfo,
    EthInfo,
  },
  props: {
    daoStatus: {
      type: Number,
    },
    isMyDao: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    daoObj: {
      type: Object,
    },
  },
  data() {
    return {
      isLoading: true,
      nohide: true,
      qvalue: 90,
      initData: {
        subDaoAssetPool: '',
        subDaoErc20: '',
        currentDaoToken: '',
        currentDaoEth: '',
      },
      dialogLoading: false,
      formData: {
        amount: '',
      },
      formEth: {
        amount: '',
      },
      infoData: {},
      formDataRules: {
        amount: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            if (value <= 0) {
              return callback(new Error('Field is required'))
            }
            if (value > 1000000000) {
              return callback(new Error('Field is required'))
            }
            return
          },
          trigger: ['change'],
        },
      },
      formEthRules: {
        amount: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            if (value <= 0) {
              return callback(new Error('Field is required'))
            }
            if (value > 1000000000) {
              return callback(new Error('Field is required'))
            }
            return
          },
          trigger: ['change'],
        },
      },
    }
  },
  computed: {
    ...mapState(['ClientW', 'User']),
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    async getData() {
      const res = await daoAllocation({ daoId: this.$route.query.id })
      this.initData = res.data
      // const info = await allocationInfo({ daoId: this.$route.query.id });
      // console.log(info, "oasdasdasdasdasd");
      // this.infoData = info.data;
      this.isLoading = false
    },
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
    payToken() {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          this.dialogLoading = true
          BigNumber.config({ EXPONENTIAL_AT: 32 })
          try {
            const decimalsNum = await decimals(this.daoObj.erc20Address)
            const tx = await transferPay({
              to: this.initData.subDaoAssetPool,
              amount: new BigNumber(this.formData.amount)
                .times(`1e${decimalsNum}`)
                .toString(),
              contract: this.initData.subDaoErc20,
            })
            await tx.wait()
            this.successNotif(
              `Your contribution to the DAO's asset pool has been received and recorded.`
            )
            this.dialogLoading = false
          } catch (error) {
            const err = JSON.stringify(error)
            this.errMsg(err)
            this.dialogLoading = false
            console.log(error, 'error')
          }
        }
      })
    },
    payEth() {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      this.$refs.formEth.validate(async (valid) => {
        if (valid) {
          this.dialogLoading = true
          BigNumber.config({ EXPONENTIAL_AT: 32 })
          try {
            let tx = null
            if (this.initData.payCurrencyType === 'ETH') {
              console.log(this.initData.subDaoAssetPool, this.formEth.amount)
              tx = await transactionEth(
                this.initData.subDaoAssetPool,
                this.formEth.amount
              )
            } else {
              const amount = new BigNumber(this.formEth.amount)
                .times(`1e${this.initData.inputTokenDecimals}`)
                .toString()
              tx = await transactionERC20(
                this.initData.inputTokenAddress,
                this.initData.subDaoAssetPool,
                amount
              )
            }
            console.log(tx, 'txtxtxtxtxtxtx')
            await tx.wait()
            this.successNotif(
              `Your contribution to the DAO's asset pool has been received and recorded.`
            )
            this.dialogLoading = false
          } catch (error) {
            const err = JSON.stringify(error)
            this.errMsg(err)
            this.dialogLoading = false
            console.log(error, 'error')
          }
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.box {
  // width: 94%;
  margin: 0 auto;
  padding: 0 28px;
  min-width: 1240px;
  max-width: 2560px;
  box-sizing: border-box;
  padding-bottom: 30px;
}
.asset-box {
  width: 1168px;
  margin: 0 auto;
  // height: 600px;
}
.copy {
  font-size: 14px;
  cursor: pointer;
  margin-left: 14px;
  .svg-icon {
    font-size: 14px;
  }
}
.asset-title {
  color: #fff;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  height: 14px;
  .spa1 {
    color: #9e9e9e;
  }
}
.asset-card {
  display: flex;
  margin-top: 36px;
  .card-l {
    width: 562px;
    border: 1px solid #6062aa;
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .card-r {
    width: 562px;
    border: 1px solid #6062aa;
    margin-left: auto;
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .card-title {
    color: #f3f3f3;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    padding: 28px 0;
    text-align: center;
    border-bottom: 0.5px solid #6062aa;
  }
}
.left-body {
  color: #9e9e9e;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // flex: 1;
}
.right-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}
.el-dao-btnz {
  width: 100%;
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.el-form-item {
  margin: 0 !important;
}
.chart-mode {
  min-height: 300px;
}
</style>
