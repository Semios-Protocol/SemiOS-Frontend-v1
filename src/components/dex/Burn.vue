<template>
  <table-loading v-if="isLoading" />
  <div class="box" v-else>
    <div>
      <div class="burn-box">
        <div class="burn-title">Redeem</div>
        <div class="box-input">
          <div class="input-flex">
            <div class="flex-left">
              <div class="flex-blance" v-show="MetaMaskAddress">
                Balance: {{ erc20Balance | bigNumFormat(6, 0.000001) }}
              </div>
              <div class="flex-input">
                <div class="swap-input">
                  <el-input
                    v-model="inputErc"
                    placeholder="0"
                    @keyup.native="setSwapIput($event)"
                    oninput="if(isNaN(value)||Number(value)<0) { value = null }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+19)}"
                  ></el-input>
                  <button @click="setMax($event)" v-show="MetaMaskAddress">
                    MAX</button
                  ><span class="flex-texteth erc-type" @click="setErcType">
                    {{ ercToken.erc20Symbol }}
                    <span><i class="el-icon-caret-bottom"></i></span
                  ></span>
                </div>
              </div>
            </div>

            <div class="flex-center">
              <span>
                <svg-icon icon-class="swapleft" />
              </span>
            </div>

            <div class="flex-right">
              <div class="flex-blance" v-show="MetaMaskAddress">
                Balance: {{ ethBalance | bigNumFormat(6, 0.000001) }}
              </div>
              <div class="flex-input disable-input">
                <div class="swap-input">
                  <el-input
                    v-model="inputEth"
                    placeholder="0"
                    disabled
                  ></el-input>
                  <span class="flex-texteth">ETH</span>
                </div>
              </div>
            </div>
          </div>
          <div class="swap-text">
            <span
              >100,000,000 {{ ercToken.erc20Symbol }}={{
                ethVal | bigNumFormat(6, 0.000001)
              }}
              ETH
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  ERC20 revenue = Canvas SubDAO Token Amount / Total Circulating
                  SubDAO Token Amount * Asset Pool Total ETH
                </div>
                <i class="el-icon-info"></i> </el-tooltip
            ></span>
          </div>

          <button
            class="swap-btn"
            v-preventReClick
            v-if="!MetaMaskAddress"
            @click="goLogin"
          >
            Connect Wallet
          </button>
          <div v-else>
            <button class="swap-disable" v-preventReClick v-show="isEnter">
              Enter an amount
            </button>
            <button
              class="swap-disable"
              v-preventReClick
              v-show="isInsufficient"
            >
              Insufficient balance
            </button>
            <!-- 0-5 -->
            <button
              class="swap-btn"
              v-preventReClick
              v-show="isBurn"
              @click="setBurn"
            >
              Redeem
            </button>
          </div>
        </div>
      </div>
      <div class="burn-chart">
        <div class="burn-title">Assets Pool</div>
        <div class="chart-title">
          <div class="div-itemb">
            <p class="p1">Price on Liquidity ({{ ercToken.erc20Symbol }})</p>
            <p class="p2">{{ priceData.price }} ETH</p>
          </div>
          <div class="div-itema">
            <p class="p1">ETH in Pool ({{ ercToken.erc20Symbol }})</p>
            <p class="p3">{{ ercInfo.ethInPool }}</p>
          </div>
          <div class="div-itema">
            <p class="p1">Valuable Royalty Token in pool</p>
            <p class="p3">{{ ercInfo.burnVolume | bigNumFormat(2, 0.01) }}</p>
          </div>
        </div>
        <div class="capy-box">
          Royalty Pool:
          {{ ercInfo.daoAssetPool }}
          <span @click="copy(ercInfo.daoAssetPool)" class="copyicon">
            <svg-icon icon-class="copyhash1" />
          </span>
        </div>

        <div class="box-chart">
          <div class="left-chart">
            <chart-asset-pool-eth
              ref="chart_asset_pool_eth"
              :dayTime="7"
              :Mheight="'320px'"
              :address="ercToken.erc20Address"
            />
          </div>
          <div class="right-chart">
            <chart-royalty-apy
              ref="chart_royalty_apy"
              :dayTime="7"
              :address="ercToken.erc20Address"
            />
          </div>
        </div>
      </div>

      <div class="table-div">
        <div class="burn-title">Transactions</div>
        <burn-transactions-table :address="ercToken.erc20Address" />
      </div>
      <div class="divdia">
        <el-dialog
          title="Are you sure?"
          :visible.sync="isBurnDio"
          :center="true"
          width="408px"
          top="20vh"
          :before-close="collectClose"
          :destroy-on-close="true"
          :close-on-click-modal="false"
        >
          <div class="dialogLoading">
            <p class="p1">
              This is an irreversible operation, will burn a portion of Nodes
              Erc20 Tokens into an Redeemed Pool. You will lose the opportunity
              to get more Royalty Fee in the future and significantly increase
              the earnings of other Royalty Token Holders.
            </p>
            <p class="p2">ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.</p>
            <button class="btn_red3" @click="setExpertMode">
              Continue Redeem
            </button>
          </div>
        </el-dialog>
        <el-dialog
          title="Redeem"
          :visible.sync="dialogLoading"
          :center="true"
          width="408px"
          top="20vh"
          :destroy-on-close="true"
        >
          <div class="dialogLoading">
            <div class="dialog-loading">
              <loading />
            </div>
            <p class="dialog-text">Please continue in the wallet...</p>
          </div>
        </el-dialog>
      </div>
      <select-token
        v-if="isSelectToken"
        :tokenVisible="isSelectToken"
        @confirmation="confirmation"
        @closeShow="closeShow"
      />
    </div>
  </div>
</template>

<script>
import TableLoading from '@/components/TableLoading.vue'
import ChartAssetPoolEth from './ChartAssetPoolEth.vue'
import ChartRoyaltyApy from './ChartRoyaltyApy.vue'
import BurnTransactionsTable from './BurnTransactionsTable.vue'
import SelectToken from './SelectToken.vue'
import { mapState } from 'vuex'
import { copys } from '@/utils'
import {
  liquidityDefault,
  assetPoolPrice,
  liquidityPrice,
  assetPoolInfo,
} from '@/common/dexApi'
import {
  getBalance,
  getErc20Balance,
  exchangeOutputToInput,
} from '@/common/walletService/services'
import { OPEN_URL } from '@/config.js'
import { BigNumber } from 'bignumber.js'
import Loading from '@/components/Loading.vue'
export default {
  components: {
    Loading,
    TableLoading,
    ChartAssetPoolEth,
    ChartRoyaltyApy,
    BurnTransactionsTable,
    SelectToken,
  },
  data() {
    return {
      isLoading: true,
      inputErc: null,
      inputEth: null,
      isEth: true,
      starttime: 0,
      swapType: 1,
      isSelectToken: false,
      ercToken: {
        erc20Symbol: '',
        erc20Address: '',
        erc20Name: '',
      },
      ethVal: 0,
      priceData: {
        price: 0,
      },
      ercInfo: { ethInPool: '', burnVolume: '', daoAssetPool: '' },
      ethBalance: 0,
      erc20Balance: 0,
      isInsufficient: false,
      isBurn: false,
      isEnter: true,
      isBurnDio: false,
      dialogLoading: false,
    }
  },
  watch: {
    'ercToken.erc20Address'() {
      this.getData()
    },
    MetaMaskAddress() {
      this.getData()
    },
    ERCToken(cur) {
      this.ercToken = cur
    },
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'ERCToken']),
  },
  mounted() {
    this.getDefault()
    this.$nextTick(() => {
      window.onresize = () => {
        this.$refs.chart_asset_pool_eth.reResizeFn()
        this.$refs.chart_royalty_apy.reResizeFn()
      }
    })
  },
  methods: {
    bPush(item) {
      return `${OPEN_URL}/address/${item}`
    },
    setBurn() {
      this.isBurnDio = true
    },
    goLogin() {
      this.loginWallet()
    },
    async getDefault() {
      if (this.$route.query.address) {
        const res = await liquidityPrice({
          erc20Address: this.$route.query.address,
        })
        this.ercToken = res.data
      } else {
        const res = await liquidityDefault()
        this.ercToken = res.data
      }
      this.isShow = true
      this.getData()
    },
    async getData() {
      this.inputEth = null
      this.inputErc = null
      this.isEnter = true
      this.isBurn = false
      this.isInsufficient = false
      const priceData = await assetPoolPrice({
        erc20Address: this.ercToken.erc20Address,
      })
      this.ethVal = new BigNumber(priceData.data.assetPoolPrice)
        .multipliedBy(1e8)
        .gt(0)
        ? new BigNumber(priceData.data.assetPoolPrice)
            .multipliedBy(1e8)
            .toString()
        : 0
      const ercPrice = await liquidityPrice({
        erc20Address: this.ercToken.erc20Address,
      })
      this.priceData = ercPrice.data
      const info = await assetPoolInfo({
        erc20Address: this.ercToken.erc20Address,
      })
      this.ercInfo = info.data
      if (this.MetaMaskAddress) {
        const eth = await getBalance()
        const erc20 = await getErc20Balance(
          this.ercToken.erc20Address,
          this.MetaMaskAddress
        )
        this.ethBalance = eth
        this.erc20Balance = new BigNumber(erc20).div(1e18).toString()
      } else {
        this.ethBalance = 0
        this.erc20Balance = 0
      }
      this.isLoading = false
    },
    closeShow() {
      this.isSelectToken = false
    },
    confirmation(val) {
      this.isSelectToken = false
      this.inputErc = null
      this.inputEth = 0
      this.ercToken = val
      this.$router.push({
        path: '/dex',
        query: {
          type: 'burn',
          tab: 'priceTab',
          address: val.erc20Address,
        },
      })
    },
    setErcType() {
      this.isSelectToken = true
    },
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
    collectClose() {
      this.isBurnDio = false
    },
    async setExpertMode() {
      this.isBurnDio = false
      this.dialogLoading = true
      try {
        const tx = await exchangeOutputToInput(
          this.priceData.projectId,
          new BigNumber(this.inputErc).multipliedBy(1e18).toFixed(),
          this.MetaMaskAddress
        )
        const res = await tx.wait()
        this.inputEth = null
        this.inputErc = null
        this.isEnter = true
        this.isBurn = false
        this.isInsufficient = false
        this.successNotif('Successful transaction')
        if (res.status || res.logs.length > 0) {
          this.getData()
        }
        this.dialogLoading = false
      } catch (error) {
        console.log(error, 'error')
        if (JSON.stringify(error).indexOf('0x0cb09dc7') > -1) {
          const err = `${this.ercToken.erc20Symbol} This function is suspended for security reasons.`
          this.errNotif(err)
        } else {
          if (JSON.stringify(error).indexOf('0x14f8ad9d') > -1) {
            const err = `D4A This function is suspended for security reasons.`
            this.errNotif(err)
          } else {
            this.errMsg(JSON.stringify(error))
          }
        }
        this.inputErc = null
        this.dialogLoading = false
      }
    },
    setMax(event) {
      this.inputErc = this.erc20Balance
      this.setSwapIput(event)
    },
    setSwapIput(event) {
      this.starttime = event.timeStamp
      let e = event
      setTimeout(() => {
        if (this.starttime - e.timeStamp === 0) {
          if (this.inputErc && Number(this.inputErc) > 0) {
            this.inputEth = new BigNumber(this.inputErc)
              .times(this.ethVal)
              .div(1e8)
              .toFixed()
            if (
              new BigNumber(this.inputErc).gt(0) &&
              new BigNumber(this.inputErc).lte(this.erc20Balance)
            ) {
              this.isEnter = false
              this.isBurn = true
              this.isInsufficient = false
            }
            if (new BigNumber(this.inputErc).gt(this.erc20Balance)) {
              this.isEnter = false
              this.isBurn = false
              this.isInsufficient = true
            }
          } else {
            this.inputEth = null
            this.isEnter = true
            this.isBurn = false
            this.isInsufficient = false
          }
        }
      }, 1000)
    },
  },
}
</script>
<style scoped lang="scss">
.box {
  min-width: 1240px;
  max-width: 2560px;

  padding: 30px 24px;
}
.transaction-card {
  // margin-top: 64px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  padding: 20px 40px 30px 40px;
}

.box-input {
  width: 100%;
  margin-top: 34px;
}
.input-flex {
  display: flex;
}
.flex-center {
  width: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    margin-top: 20px;
    font-size: 24px;
  }
}
.flex-left {
  width: calc(50% - 38px);
}
.flex-right {
  width: calc(50% - 38px);
}
.flex-blance {
  color: #9e9e9e;
  font-size: 12px;
  text-align: end;
}

.swap-input {
  height: 60px;
  border: 1px solid #6062aa;
  border-radius: 2px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  ::v-deep .el-input {
    flex: 1;
  }
  button {
    width: 38px;
    height: 22px;
    border: 1px solid #b3b5f2;
    border-radius: 2px;
    font-size: 12px;
    color: #b3b5f2;
    background-color: transparent;
    margin-right: 10px;
  }
  button:hover {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  }
  button:active {
    background-color: #533fa1;
  }
  ::v-deep .el-input__inner {
    border: none;
    font-size: 20px;
    font-family: Roboto5;
    background-color: transparent;
  }
  .flex-texteth {
    color: #9e9e9e;
    font-size: 16px;
    margin: 0 12px;
  }
}
.swap-text {
  margin-top: 12px;
  span {
    margin-bottom: 12px;
    color: #9e9e9e;
    font-size: 14px;
  }
}
.swap-btn {
  background: repeating-linear-gradient(
    110deg,
    #504092,
    #504092 15px,
    #6062aa 0,
    #6062aa 30px
  );
  border-radius: 2px;
  height: 52px;
  width: 100%;
  margin-top: 28px;
  font-size: 18px;
  color: #bbbbbb;
  border: none;
}
.swap-btn:hover {
  background: repeating-linear-gradient(
    110deg,
    #4077aa,
    #4077aa 15px,
    #7596be 0,
    #7596be 30px
  );
  color: #ffffff;
}
.swap-btn:active {
  background: repeating-linear-gradient(
    110deg,
    #4174a3,
    #4174a3 15px,
    #748eaf 0,
    #748eaf 30px
  );
  color: #ffffff;
}
.swap-disable {
  cursor: no-drop !important;
  background: repeating-linear-gradient(
    110deg,
    #151626,
    #151626 15px,
    #1b2233 0,
    #1b2233 30px
  );
  border: none;
  border-radius: 2px;
  height: 52px;
  width: 100%;
  margin-top: 28px;
  font-size: 18px;
  color: #9e9e9e;
}
.swap-red {
  background-color: #df5d5d;
  color: #000000;
}
.swap-red:hover {
  background-color: #ffa1a1;
}
.swap-red:active {
  background-color: #b44c4c;
}
.swap-red-dis {
  background-color: #ffd7d7 !important;
  color: #fff;
  cursor: no-drop !important;
}

.dialogLoading {
  text-align: center;
  .p1 {
    margin: 0;
    margin-bottom: 24px;
    font-size: 16px;
    color: #9e9e9e;
    word-break: break-word;
  }
  .p2 {
    margin: 0;
    margin-bottom: 24px;
    font-size: 20px;
    color: #9e9e9e;
    word-break: break-word;
  }
}
.burn-title {
  height: 38px;
  line-height: 38px;
  border-bottom: 1px solid #6062aa;
  font-size: 18px;
  color: #9e9e9e;
  font-family: Inter6;
}
.burn-box {
  border: 1px solid #6062aa;
  padding: 30px 40px;
}
.burn-chart {
  box-sizing: border-box;
  border: 1px solid #6062aa;
  margin-top: 20px;
  padding: 30px 40px;
}
.chart-title {
  display: flex;
  margin-top: 30px;
  .p1 {
    color: #9e9e9e;
    font-size: 18px;
    font-family: Inter5;
    margin: 0;
    margin-bottom: 16px;
  }
  .p2 {
    color: #b3b5f2;
    font-size: 28px;
    font-family: Roboto5;
    margin: 0;
  }
  .p3 {
    color: #9e9e9e;
    font-size: 28px;
    font-family: Roboto5;
    margin: 0;
  }
}
.div-itema {
  /* width: 33.3%; */
  margin-left: auto;
}
.capy-box {
  font-size: 14px;
  color: #9e9e9e;
  margin-top: 18px;
  span {
    color: #757575;
  }
  .copy-text {
    margin-right: 12px;
  }
  .copyicon {
    cursor: pointer;
  }
}

.box-chart {
  display: flex;
  margin-top: 18px;
  .left-chart {
    // border: 1px solid #6062AA;
    border-radius: 2px;
    box-sizing: border-box;
    margin-right: 10px;
    width: 50%;
    height: 360px;
  }
  .right-chart {
    border: 1px solid #6062aa;
    border-radius: 2px;
    box-sizing: border-box;
    margin-left: 10px;
    width: 50%;
    height: 360px;
  }
}
.table-div {
  box-sizing: border-box;

  border: 1px solid #6062aa;
  margin-bottom: 80px;
  margin-top: 20px;
  padding: 30px 40px;
}
.erc-type {
  cursor: pointer;
}
::v-deep .el-table td.el-table__cell {
  border-color: #6062aa;
}
.disable-input {
  .swap-input {
    background-color: transparent;
  }
}
</style>
