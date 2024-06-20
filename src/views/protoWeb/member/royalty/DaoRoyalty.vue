<template>
  <div
    class="box"
    :style="{
      width: isMyDao ? '960px' : '100%',
      'min-width': isMyDao ? '960px' : '1240px',
    }"
  >
    <div class="query max-min">
      <div class="irse">
        <el-select v-model="qvalue" @change="qvalueChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <table-loading v-if="isLoading" />
    <div v-else>
      <!-- <div class="body-box">
        <h4>Royalty Token DATA</h4>
        <el-divider></el-divider>
        <div class="box-title">
          <div class="title-left">
            <div class="lprice">Price ({{ priceData.erc20Symbol }})</div>
            <div class="lnum">{{ priceData.price | formatThousand }} ETH</div>
          </div>
          <div class="title-right">
            <button>
              <a
                :href="aPush()"
                style="text-decoration: none; color: currentcolor"
                target="_blank"
              >
                Start Swap Royalty Token <i class="el-icon-right"></i>
              </a>
            </button>
          </div>
        </div>
        <div class="box-chart">
          <div class="left-chart">
            <chart-price-liquidity
              ref="chart_price_liquidity"
              :dayTime="qvalue"
              :address="address"
            />
          </div>
          <div class="right-chart">
            <chart-royalty-apy
              ref="chart_royalty_apy"
              :dayTime="qvalue"
              :address="address"
            />
          </div>
        </div>
        <div class="capy-box">
          Contracts:
          <a
            :href="bPush(priceData.erc20Address)"
            style="text-decoration: none; color: #bbbaba"
            class="copy-text"
            target="_blank"
            >{{ priceData.erc20Address }}</a
          >
          <span
            @click="copy(priceData.erc20Address)"
            v-show="priceData.erc20Address"
            style="cursor: pointer"
          >
            <svg-icon icon-class="copyhash1" />
          </span>
        </div>
        <el-divider class="divder-item"></el-divider>
        <div class="card-info">
          <div class="info-a">
            <p class="tp1">
              7 Days Volume
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  A measure of how much of a cryptocurrency was traded in the
                  last 24 hours.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p class="tp2">
              {{ objData.sevenDaysVolume | bigNumFormat(4, 0.0001) }} ETH
            </p>
            <p class="tp1 tpm">
              Total Volume
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  A measure of how many cryptocurrencies have been traded in
                  total in the past.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p class="tp2">
              {{ objData.totalVolume | bigNumFormat(4, 0.0001) }} ETH
            </p>
          </div>
          <div class="info-b">
            <p class="tp1">
              Market Cap
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  The total market value of a cryptocurrency's circulating
                  supply. It is analogous to the free-float capitalization in
                  the stock market. Market Cap = Price on Liquidity x
                  Circulating Supply.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p class="tp2">
              {{ objData.marketCap | bigNumFormat(4, 0.0001) }} ETH
            </p>
          </div>
          <div class="info-b">
            <p class="tp1">
              Fully Diluted Market Cap
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  The market cap if the max supply was in circulation.
                  Fully-diluted market cap (FDMC) = price x max supply.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p class="tp2">
              {{ objData.fullyDiluted | bigNumFormat(4, 0.0001) }} ETH
            </p>
          </div>
          <div class="info-b">
            <p class="tp1">
              Circulating Supply
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  The amount of tokens that are circulating in the market and
                  are in public hands. It is analogous to the flowing shares in
                  the stock market.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p class="tp2">
              {{ objData.circulatingSupply | bigNumFormat(2, 0.01) }}
            </p>
            <p class="tp1 tpm">
              Redeem
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  The current number of tokens that have been Redeemed.
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p class="tp2">
              {{ objData.burnVolume | bigNumFormat(2, 0.01) }}
            </p>

         
          </div>
        </div>
      </div> -->
      <div class="flex-div">
        <div class="left-div">
          <table-nft-owners :dayTime="qvalue" :address="address" />
        </div>
        <div class="right-div">
          <div>
            <chart-asset-pool
              ref="chart_asset_pool"
              :dayTime="qvalue"
              :address="address"
            />
          </div>
          <div class="chart-item">
            <chart-asset-pool-eth
              ref="chart_asset_pool_eth"
              :dayTime="qvalue"
              :address="address"
            />
          </div>
        </div>
      </div>

      <div class="table-div">
        <transactions-table :dayTime="qvalue" :address="address" />
      </div>
      <div class="chart-footer"></div>
    </div>
  </div>
</template>

<script>
import TableLoading from "@/components/TableLoading.vue";
import ChartAssetPool from "./ChartAssetPool.vue";
import TableNftOwners from "./TableNftOwners.vue";
import ChartAssetPoolEth from "./ChartAssetPoolEth.vue";
import TransactionsTable from "./TransactionsTable.vue";
import { statistics, liquidityPrice } from "@/common/dexApi";
import { copys } from "@/utils";
import { OPEN_URL } from "@/config.js";

import { BigNumber } from "bignumber.js";

export default {
  components: {
    TableLoading,
    ChartAssetPool,
    TableNftOwners,
    ChartAssetPoolEth,
    TransactionsTable,
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
  },
  data() {
    return {
      isLoading: false,
      qvalue: 90,
      options: [
        {
          value: 7,
          label: "Last 7 days",
        },
        {
          value: 30,
          label: "Last 30 days",
        },
        {
          value: 90,
          label: "Last 90 days",
        },
      ],
      priceData: {
        erc20Name: "",
        erc20Symbol: "",
        price: 0,
        erc20Address: "",
      },
      objData: {
        burnVolume: "0",
        circulatingSupply: "0",
        sevenDaysVolume: "0",
        totalSupply: "0",
        totalVolume: "0",
        valuableSupply: "0",
        marketCap: "0",
        fullyDiluted: "0",
      },
    };
  },

  created() {
    if (this.daoStatus === 1) {
      this.$router.push({
        path: "/404",
      });
    }
  },
  mounted() {
    this.getData();
    this.$nextTick(() => {
      window.onresize = () => {
        this.$refs.chart_asset_pool.reResizeFn();
        this.$refs.chart_price_liquidity.reResizeFn();
        this.$refs.chart_royalty_apy.reResizeFn();
        this.$refs.chart_asset_pool_eth.reResizeFn();
      };
    });
  },
  methods: {
    bPush(item) {
      return `${OPEN_URL}/token/${item}`;
    },
    aPush() {
      return (
        location.origin + `/dex?type=swap&tab=priceTab&address=${this.address}`
      );
    },
    goSwap() {
      this.$router.push({
        path: `/dex`,
        query: {
          type: "swap",
          tab: "priceTab",
        },
      });
    },
    async getData() {
      const price = await liquidityPrice({ erc20Address: this.address });
      this.priceData = price.data;
      const res = await statistics({ erc20Address: this.address });
      this.objData = res.data;
      this.objData.marketCap = new BigNumber(this.priceData.price)
        .multipliedBy(this.objData.circulatingSupply)
        .toString();

      this.objData.fullyDiluted = new BigNumber(this.priceData.price)
        .multipliedBy(this.objData.valuableSupply)
        .toString();
    },
    copy(hash) {
      copys(hash, this, "Copied!");
    },
    qvalueChange() {},
  },
};
</script>
<style scoped lang="scss">
.chart-item {
  height: 440px;
}
.box {
  // width: 94%;
  margin: 0 auto;
  padding: 0 28px;
  min-width: 1240px;
  max-width: 2560px;
  box-sizing: border-box;
  padding-bottom: 30px;
}
.query {
  height: 108px;
  display: flex;
  align-items: center;
  .irse {
    margin-left: auto;
  }
  ::v-deep .el-input__inner {
    width: 210px;
    height: 34px;
    font-size: 12px;
  }
}

::v-deep .el-select .el-input__inner:focus {
  border-color: #c0c4cc;
}
::v-deep .el-divider {
  background-color: #6062aa;
}
.flex-div {
  display: flex;
  margin-top: 20px;
  .right-div {
    width: 50%;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .left-div {
    width: 50%;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.flex-owners {
  display: flex;
  margin-top: 20px;
  .right-div {
    width: 50%;
    margin-left: 10px;
  }
  .left-div {
    width: 50%;
    margin-right: 10px;
  }
}
.chart-footer {
  margin-top: 140px;
}

.body-box {
  height: 850px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  padding: 28px 40px;
  h4 {
    font-size: 18px;
    font-family: Inter6;
    color: #bbbaba;
    margin: 0;
  }
}
.el-divider {
  color: #c5dadd;
  margin: 18px 0 34px 0;
}
.box-title {
  display: flex;
  .lprice {
    font-size: 18px;
    color: #9e9e9e;
    font-family: Inter5;
    margin-bottom: 16px;
  }
  .lnum {
    font-size: 28px;
    font-family: Inter5;
    color: #745cd4;
  }
  .title-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    button {
      width: 300px;
      height: 36px;
      background: #745cd4;
      border-radius: 2px;
      font-size: 14px;
      color: #ffffff;
      font-family: Inter5;
      border-style: none;
    }

    button:hover {
      background-color: #8280e8;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
      border-color: #533fa1;
    }
    button:active {
      background-color: #9da2fc;
    }
    i {
      font-size: 16px;
      color: #ffffff;
      font-weight: 600;
    }
  }
}
.box-chart {
  display: flex;
  margin-top: 18px;
  .left-chart {
    border: 1px solid #6062aa;
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
  margin-top: 20px;
}
.capy-box {
  font-size: 14px;
  color: #9e9e9e;
  margin-top: 18px;
  span {
    color: #bbbaba;
  }
  .copy-text {
    margin-right: 12px;
    cursor: pointer;
  }
}
.divder-item {
  margin: 18px 0;
}
.card-info {
  display: flex;
  height: 192px;
  .tp1 {
    color: #9e9e9e;
    font-size: 14px;
    margin: 0;
  }
  .tp2 {
    font-size: 16px;
    color: #745cd4;
    font-family: Roboto5;
    margin: 0;
    margin-top: 8px;
  }
  .tpm {
    margin-top: 20px;
  }
  .info-a {
    width: 25%;
    height: 100%;
  }
  .info-b {
    width: 25%;
    height: 100%;

    border-left: 1px solid #6062aa;
    box-sizing: border-box;
    padding-left: 16px;
  }
}
.el-icon-minus {
  color: #745cd4;
  margin: 0 12px;
}
</style>
