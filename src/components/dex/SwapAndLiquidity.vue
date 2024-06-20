<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="and-box" v-else>
    <div class="transaction-card">
      <div class="title-tab">
        <el-tabs v-model="activeName" @tab-click="tabsleClick">
          <el-tab-pane label="Swap" name="swap"></el-tab-pane>
          <el-tab-pane label="Liquidity" name="liquidity"></el-tab-pane>
        </el-tabs>
        <div class="setting-btn">
          <span @click="addEvent"><i class="el-icon-setting"></i></span>
          <div class="setting-box" v-if="isSetting" id="setting-btn">
            <div class="setting-title">
              <h5>Settings</h5>
              <span @click="downSetting">
                <i class="el-icon-close"></i>
              </span>
            </div>
            <h6>
              Slippage tolerance
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  Your transaction will revert if the price changes unfavorably
                  by more than this percentage.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </h6>
            <div class="div-btns">
              <div
                class="btn-item"
                :class="Number(slip.slip) === 0.1 ? 'btn-item-active' : ''"
                @click="setTolerance(0.1)"
              >
                0.1%
              </div>
              <div
                class="btn-item"
                :class="Number(slip.slip) === 0.5 ? 'btn-item-active' : ''"
                @click="setTolerance(0.5)"
              >
                0.5%
              </div>
              <div
                class="btn-item"
                :class="Number(slip.slip) === 1 ? 'btn-item-active' : ''"
                @click="setTolerance(1)"
              >
                1%
              </div>
              <el-input
                v-model="slip.slip"
                size="mini"
                placeholder="0"
                oninput="if(isNaN(value)||Number(value)<0) { value = null }if(Number(value)>50) { value = 50 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              >
                <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                <span slot="suffix">%</span>
              </el-input>
            </div>
            <h6 style="margin: 12px 0 4px 0">Transaction deadline</h6>
            <el-input
              v-model="slip.time"
              size="mini"
              placeholder="0"
              oninput="if(isNaN(value)||Number(value)<0) { value = 0.1 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              disabled
            >
              <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
              <span slot="suffix">minutes</span>
            </el-input>
            <div class="modediv">
              <h6>Expert Mode</h6>
              <div class="modeswitch">
                <el-switch
                  v-model="slip.expert"
                  @change="setMode"
                  active-color="#B3B5F2"
                  inactive-color="#9E9E9E"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
        <!-- <span class="setting-btn"> <i class="el-icon-setting"></i></span> -->
      </div>

      <component :is="activeName" :isSetting="isSetting" />
    </div>
    <div class="transaction-chart">
      <div class="title-tab">
        <el-tabs v-model="chartName" @tab-click="chartClick">
          <el-tab-pane label="Price" name="priceTab"></el-tab-pane>
          <el-tab-pane
            label="Transactions"
            name="transactionsTab"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <component :is="chartName" />
    </div>

    <div class="table-div"><trending-royalty-token /></div>
    <div class="chart-footer"></div>
    <div class="divdia">
      <el-dialog
        title="Are you sure?"
        :visible.sync="isAre"
        :center="true"
        width="408px"
        top="20vh"
        :before-close="collectClose"
        :destroy-on-close="true"
        :close-on-click-modal="false"
      >
        <div class="dialogLoading">
          <p class="p1">
            Expert mode turns off the confirm transaction prompt and allows high
            slippage trades that often result in bad rates and lost funds.
          </p>
          <p class="p2">ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.</p>
          <button class="btn_red3" @click="setExpertMode">
            Turn on Expert Mode
          </button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Swap from './Swap.vue'
import Burn from './Burn.vue'
import Liquidity from './Liquidity.vue'
import PriceTab from './PriceTab.vue'
import TrendingRoyaltyToken from './TrendingRoyaltyToken.vue'
import TransactionsTab from './TransactionsTable.vue'
import Loading from '@/components/Loading.vue'
import { ethers } from 'ethers'
export default {
  components: {
    Swap,
    Burn,
    Liquidity,
    PriceTab,
    TrendingRoyaltyToken,
    TransactionsTab,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      activeName: 'burn',
      chartName: 'priceTab',
      isSetting: false,
      tolerance: 0.1,
      deadline: 30,
      modeValue: false,
      isAre: false,
      slip: {
        time: 20,
        slip: 0.1,
        expert: false,
      },
      isComponent: true,
    }
  },
  mounted() {
    // this.getP();
    // this.$nextTick(() => {
    //   window.onresize = () => {
    //     this.$refs.chart_canvas_mint.reResizeFn();
    //     this.$refs.chart_canvas_trading.reResizeFn();
    //     this.$refs.chart_asset_pool.reResizeFn();
    //     this.$refs.chart_price_liquidity.reResizeFn();
    //     this.$refs.chart_royalty_apy.reResizeFn();
    //     this.$refs.chart_asset_pool_eth.reResizeFn();
    //   };
    // });
    const slip = sessionStorage.getItem('D4ARTSlip')
    this.slip = JSON.parse(slip)
    // this.activeName = this.$route.query.type ? this.$route.query.type : "swap";
    this.chartName = this.$route.query.tab ? this.$route.query.tab : 'priceTab'
  },
  methods: {
    collectClose() {
      this.slip.expert = false
      this.isAre = false
    },
    setExpertMode() {
      this.slip.expert = true
      this.isAre = false
    },
    setMode(val) {
      if (val) {
        this.isAre = true
      }
    },
    async getP() {
      // const p = new ethers.providers.InfuraProvider();
      // console.log(ethers.providers, "=-=--=-");
      // const p = new ethers.getDefaultProvider("homestead");
      const p = ethers.providers.InfuraProvider.getWebSocketProvider(
        'homestead',
        'a221e1d3d6984f6c8b7e12e5ce671c76'
      )
      await p.getBlockNumber()
    },
    addEvent() {
      this.isSetting = true
    },
    downSetting() {
      if (!this.slip.slip || Number(this.slip.slip) === 0) {
        this.slip.slip = 0.1
      }
      sessionStorage.setItem('D4ARTSlip', JSON.stringify(this.slip))
      this.isSetting = false
    },
    setTolerance(val) {
      this.slip.slip = val
    },
    tabsleClick() {
      this.$router.push({
        path: '/dex',
        query: {
          type: this.activeName,
          tab: this.chartName,
          address: this.$route.query.address,
        },
      })
    },
    chartClick() {
      this.$router.push({
        path: '/dex',
        query: {
          type: this.activeName,
          tab: this.chartName,
          address: this.$route.query.address,
        },
      })
    },
  },
}
</script>
<style scoped lang="scss">
.and-box {
  // width: 94%;
  margin: 0 auto;
  min-width: 1240px;
  max-width: 2560px;
  padding: 30px 24px;
  box-sizing: border-box;
}

.transaction-card {
  // margin-top: 64px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  padding: 20px 40px 30px 40px;
}

.title-tab {
  height: 38px;
  // border-bottom: 0.5px solid #6062AA;
  // border-top: 0.5px solid #6062AA;
  box-sizing: border-box;
  line-height: 38px;
  // min-width: 1240px;
}

// ::v-deep .el-tabs__nav {
//   float: none;
//   margin: 0 auto;
//   text-align: center;
// }
::v-deep .el-tabs__active-bar {
  background-color: #b3b5f2;
}

::v-deep .el-tabs__item:hover {
  color: #b3b5f2;
}

::v-deep .el-tabs__item.is-active {
  color: #b3b5f2;
}

// ::v-deep .el-tabs__header {
//   margin: 0;
// }
::v-deep .el-tabs__nav-wrap::after {
  background-color: #6062aa;
}

::v-deep .el-tabs__item {
  color: #bbbaba;
  font-family: Inter5;
  font-size: 18px;
}

.setting-btn {
  float: right;
  margin-top: -54px;
  position: relative;
  z-index: 5;
  font-size: 20px;

  .el-icon-setting {
    cursor: pointer;
    color: #bbbaba;
  }

  .el-icon-setting:hover {
    color: #533fa1;
  }

  .el-icon-setting:active {
    color: #533fa1;
  }
}

.transaction-chart {
  margin-top: 20px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  padding: 20px 40px 30px 40px;
}

.chart-footer {
  margin-top: 34px;
}

.setting-box {
  position: absolute;
  box-sizing: border-box;
  width: 340px;
  height: 230px;
  background-color: #1b2233;
  border: 1px solid #6062aa;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  left: -320px;
  padding: 16px;
  border-radius: 2px;

  h5 {
    font-size: 14px;
    color: #9e9e9e;
    font-family: Inter5;
    margin: 0;
    line-height: 18px;
    margin-bottom: 12px;
  }

  h6 {
    font-size: 14px;
    color: #757575;
    font-family: Inter4;
    margin: 0;
    line-height: 18px;
  }
}

::v-deep .modeswitch .is-checked .el-switch__core {
  background-color: #745cd4 !important;
  border-color: #745cd4 !important;
}

::v-deep .setting-box .el-input__inner {
  background-color: transparent;
  border: 1px solid #6062aa;

  &:focus {
    border: 1px solid #9483d7;
  }
}

.div-btns {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.btn-item {
  width: 62px;
  height: 26px;
  background: #9e9e9e;
  border-radius: 2px;
  margin-right: 8px;
  color: #1b2233;
  font-size: 12px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
}

.btn-item-active {
  background-color: #745cd4;
  color: #fff;
}

.modediv {
  display: flex;
  align-items: center;
}

.modeswitch {
  margin-left: auto;
}

.setting-title {
  display: flex;
  line-height: 16px;

  span {
    margin-left: auto;
    font-size: 18px;

    i {
      cursor: pointer;
      color: #757575;
    }

    i:hover {
      color: #bbbaba;
    }

    i:active {
      color: #9e9e9e;
    }
  }
}

.dialogLoading {
  text-align: center;

  .p1 {
    margin: 0;
    margin-bottom: 24px;
    font-size: 16px;
    color: #bbbaba;
    word-break: break-word;
  }

  .p2 {
    margin: 0;
    margin-bottom: 24px;
    font-size: 20px;
    color: #bbbaba;
    word-break: break-word;
  }
}
</style>
