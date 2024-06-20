<template>
  <div class="price-box">
    <div class="box-title">
      <div class="title-left">
        <div class="lprice">Price ({{ priceData.erc20Symbol }})</div>
        <div class="lnum">{{ priceData.price | formatThousand }} ETH</div>
      </div>
      <!-- <div class="title-right">
        <button>Start Swap Royalty Token <i class="el-icon-right"></i></button>
      </div> -->
    </div>
    <div class="box-chart">
      <div class="left-chart">
        <chart-price-liquidity
          ref="chart_price_liquidity"
          :dayTime="7"
          :address="ERCToken.erc20Address"
        />
      </div>
      <div class="right-chart">
        <chart-royalty-apy
          ref="chart_royalty_apy"
          :dayTime="7"
          :address="ERCToken.erc20Address"
        />
      </div>
    </div>
    <div class="capy-box">
      Contracts:
      <a
        :href="bPush(priceData.erc20Address)"
        style="text-decoration: none; color: #9e9e9e"
        class="copy-text"
        target="_blank"
        >{{ priceData.erc20Address }}</a
      >
      <span @click="copy(priceData.erc20Address)" class="copyicon">
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
              A measure of how much of a tokens was traded in the last 7 days.
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
              A measure of how many tokens have been traded in total in the
              past.
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
              The total market value of a tokens' circulating supply. It is
              analogous to the free-float capitalization in the stock market.
              Market Cap = Price on Liquidity x Circulating Supply.
            </div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </p>
        <p class="tp2">{{ objData.marketCap | bigNumFormat(4, 0.0001) }} ETH</p>
      </div>
      <div class="info-b">
        <p class="tp1">
          Fully Diluted Market Cap
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              The market cap if the max supply was in circulation. Fully-diluted
              market cap (FDMC) = price x max supply.
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
              The amount of tokens that are circulating in the market and are in
              public hands. It is analogous to the flowing shares in the stock
              market.
            </div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </p>
        <p class="tp2">
          {{ objData.circulatingSupply | bigNumFormat(2, 0.01) }}
        </p>
        <p class="tp1 tpm">
          <!-- Total Supply
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              The maximum amount of coins that will ever exist in the lifetime
              of the tokens. It is analogous to the fully diluted shares in the
              stock market.
            </div>
            <i class="el-icon-info"></i> </el-tooltip
          > -->
          <!-- <i class="el-icon-minus"></i>  -->
          Redeem
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              The current number of tokens that have been Redeemed.
            </div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </p>
        <p class="tp2">
          <!-- {{ objData.totalSupply | bigNumFormat(2, 0.01) }}
          <i class="el-icon-minus"></i> -->
          {{ objData.burnVolume | bigNumFormat(2, 0.01) }}
        </p>

        <!-- <p class="tp1 tpm">
          Valuable Supply
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">Valuable Supply = Total Supply - Redeem</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </p>
        <p class="tp2" style="color: #B3B5F2">
          {{ objData.valuableSupply | bigNumFormat(2, 0.01) }}
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import ChartPriceLiquidity from "./ChartPriceLiquidity.vue";
import ChartRoyaltyApy from "./ChartRoyaltyApy.vue";
import { statistics, liquidityPrice } from "@/common/dexApi";
import { BigNumber } from "bignumber.js";
import { mapState } from "vuex";
import { copys } from "@/utils";
import { OPEN_URL } from "@/config.js";
export default {
  components: {
    ChartPriceLiquidity,
    ChartRoyaltyApy,
  },
  data() {
    return {
      swapErc: null,
      swapEth: null,
      isEth: true,
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
  watch: {
    "ERCToken.erc20Address": {
      handler() {
        this.getData();
      },
    },
  },
  computed: {
    ...mapState(["MetaMaskAddress", "ERCToken"]),
  },
  mounted() {
    setTimeout(() => {
      this.getData();
    }, 500);
    this.$nextTick(() => {
      this.isShow = true;
      window.onresize = () => {
        this.$refs.chart_price_liquidity.reResizeFn();
        this.$refs.chart_royalty_apy.reResizeFn();
      };
    });
  },
  methods: {
    bPush(item) {
      return `${OPEN_URL}/token/${item}`;
    },
    async getData() {
      const price = await liquidityPrice({
        erc20Address: this.ERCToken.erc20Address,
      });
      this.priceData = price.data;
      const res = await statistics({
        erc20Address: this.ERCToken.erc20Address,
      });
      this.objData = res.data;
      this.objData.marketCap = new BigNumber(this.priceData.price)
        .multipliedBy(this.objData.circulatingSupply)
        .toString();

      this.objData.fullyDiluted = new BigNumber(this.priceData.price)
        .multipliedBy(this.objData.valuableSupply)
        .toString();
    },
    setMax() {},
    setIsEth() {
      this.isEth = !this.isEth;
    },
    copy(hash) {
      copys(hash, this, "Copied!");
    },
  },
};
</script>
<style scoped lang="scss">
.price-box {
  // height: 850px;
  width: 100%;
  box-sizing: border-box;
  // border: 1px solid #6062AA;
  padding-top: 36px;
  h4 {
    font-size: 18px;
    font-family: Inter6;
    color: #9e9e9e;
    margin: 0;
  }
}
::v-deep .el-divider {
  background-color: #6062aa;
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
    color: #b3b5f2;
  }
  .title-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    button {
      width: 300px;
      height: 36px;
      background: #b3b5f2;
      border-radius: 2px;
      font-size: 14px;
      color: #ffffff;
      font-family: Inter5;
    }

    button:hover {
      background-color: #533fa1;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
      border-color: #533fa1;
    }
    button:active {
      background-color: #533fa1;
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
    color: #9e9e9e;
  }
  .copy-text {
    margin-right: 12px;
    cursor: pointer;
  }
  .copyicon {
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
    color: #757575;
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
  color: #b3b5f2;
  margin: 0 12px;
}

.table-div {
  margin-top: 20px;
}
</style>
