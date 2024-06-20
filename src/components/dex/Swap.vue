<template>
  <div class="box-input">
    <div class="input-flex">
      <div class="flex-left" v-show="isEth">
        <div class="flex-blance" v-show="MetaMaskAddress">
          Balance: {{ balance.eth | bigNumFormat(6, 0.000001) }}
        </div>
        <div class="flex-input">
          <div class="swap_input">
            <el-input
              v-model="inputEth"
              placeholder="0"
              @keyup.native="setSwapIput($event, 1)"
              @blur="swapBlur(1)"
              oninput="if(isNaN(value)||Number(value)<0) { value = null }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+19)}"
            ></el-input>
            <button @click="setMax(1, $event)" v-show="MetaMaskAddress">
              MAX
            </button>
            <span class="flex-texteth">ETH</span>
          </div>
        </div>
      </div>
      <div class="flex-left" v-show="!isEth">
        <div class="flex-blance" v-show="MetaMaskAddress">
          Balance: {{ balance.erc20 | bigNumFormat(6, 0.000001) }}
        </div>
        <div class="flex-input">
          <div class="swap_input">
            <el-input
              v-model="inputErc"
              placeholder="0"
              @keyup.native="setSwapIput($event, 2)"
              @blur="swapBlur(2)"
              oninput="if(isNaN(value)||Number(value)<0) { value = null }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+19)}"
            ></el-input>
            <button @click="setMax(2, $event)" v-show="MetaMaskAddress">
              MAX
            </button>
            <span class="flex-texteth erc-type" @click="setErcType">
              {{ ERCToken.erc20Symbol }}
              <span><i class="el-icon-caret-bottom"></i></span
            ></span>
          </div>
        </div>
      </div>

      <div class="flex-center">
        <span @click="setIsEth($event)">
          <svg-icon icon-class="swapleft" />
        </span>
      </div>

      <div class="flex-right" v-show="isEth">
        <div class="flex-blance" v-show="MetaMaskAddress">
          Balance: {{ balance.erc20 | bigNumFormat(6, 0.000001) }}
        </div>
        <div class="flex-input">
          <div class="swap_input">
            <el-input
              v-model="inputErc"
              placeholder="0"
              @keyup.native="setSwapIput($event, 2)"
              @blur="swapBlur(2)"
              oninput="if(isNaN(value)||Number(value)<0) { value = null }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+19)}"
            ></el-input>
            <button @click="setMax(2, $event)" v-show="MetaMaskAddress">
              MAX
            </button>
            <span class="flex-texteth erc-type" @click="setErcType">
              {{ ERCToken.erc20Symbol }}
              <span><i class="el-icon-caret-bottom"></i></span
            ></span>
          </div>
        </div>
      </div>
      <div class="flex-right" v-show="!isEth">
        <div class="flex-blance" v-show="MetaMaskAddress">
          Balance: {{ balance.eth | bigNumFormat(6, 0.000001) }}
        </div>
        <div class="flex-input">
          <div class="swap_input">
            <el-input
              v-model="inputEth"
              placeholder="0"
              @keyup.native="setSwapIput($event, 1)"
              @blur="swapBlur(1)"
              oninput="if(isNaN(value)||Number(value)<0) { value = null }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+19)}"
            ></el-input>
            <button @click="setMax(1, $event)" v-show="MetaMaskAddress">
              MAX
            </button>
            <span class="flex-texteth">ETH</span>
          </div>
        </div>
      </div>
    </div>
    <div class="swap-text" v-show="isLoading">
      <span><i class="el-icon-loading"></i> Fetching price...</span>
    </div>
    <div
      class="swap-text"
      v-show="isDataInfo && !liquidityNo && priceData.liquidityStatus === 2"
    >
      <span
        >1 ETH={{ ethErcPrice | bigNumFormat(6, 0.000001) }}
        {{ ERCToken.erc20Symbol }}</span
      >
      <div class="swap-info">
        <p class="mag0">
          Expected Output
          <span v-if="isEth"
            >{{ inputErc | bigNumFormat(6, 0.000001) }}
            {{ ERCToken.erc20Symbol }}</span
          >
          <span v-else>{{ inputEth | bigNumFormat(6, 0.000001) }} ETH</span>
        </p>
        <p>
          Price Impact <span>{{ priceImpact | bigNumFormat }}%</span>
        </p>
        <p class="mag0" v-show="isEth">
          {{
            swapType === 1
              ? "Minimum received after slippage"
              : " Maximum sent after slippage"
          }}
          <span>
            {{ minimum | bigNumFormat(6, 0.000001) }}
            {{ swapType === 1 ? ERCToken.erc20Symbol : "ETH" }}</span
          >
        </p>
        <p class="mag0" v-show="!isEth">
          {{
            swapType === 2
              ? "Minimum received after slippage"
              : " Maximum sent after slippage"
          }}
          <span>
            {{ minimum | bigNumFormat(6, 0.000001) }}
            {{ swapType === 1 ? ERCToken.erc20Symbol : "ETH" }}</span
          >
        </p>
      </div>
    </div>
    <div
      class="is-approve"
      v-show="
        (isSwap && priceImpact * 1 > 15 && slipData.expert && isAllowance) ||
        (isSwap && isAllowance && priceImpact * 1 <= 15)
      "
    >
      Please note that you need to perform an approve operation before making
      this trade.
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
      <div v-if="priceData.liquidityStatus !== 2">
        <button class="swap-disable" v-preventReClick>
          Insufficient liquidity for this trade
        </button>
      </div>
      <div v-else>
        <button class="swap-disable" v-preventReClick v-if="liquidityNo">
          Insufficient liquidity for this trade
        </button>

        <div v-else>
          <button class="swap-disable" v-preventReClick v-show="isEnter">
            Enter an amount
          </button>
          <button class="swap-disable" v-preventReClick v-show="isInsufficient">
            Insufficient balance
          </button>
          <button
            class="swap-btn"
            v-preventReClick
            v-show="isSwap && priceImpact * 1 <= 5"
            @click="setSwap"
          >
            Swap
          </button>

          <button
            class="swap-btn swap-red"
            v-preventReClick
            v-show="isSwap && priceImpact * 1 > 5 && priceImpact * 1 <= 15"
            @click="setSwap"
          >
            Swap Anyway
          </button>

          <button
            class="swap-btn swap-red"
            v-preventReClick
            v-show="isSwap && priceImpact * 1 > 15 && slipData.expert"
            @click="setSwap"
          >
            Swap Anyway
          </button>

          <button
            class="swap-btn swap-red-dis"
            v-preventReClick
            v-show="isSwap && priceImpact * 1 > 15 && !slipData.expert"
          >
            Price Impact Too High
          </button>
        </div>
      </div>
    </div>
    <!-- 0-5 -->
    <!-- 5-15 // 15-专家模式 -->
    <!-- <button class="swap-btn swap-red" v-preventReClick>Swap Anyway</button> -->
    <!-- 15 没有专家模式-->
    <!-- <button class="swap-btn swap-red swap-red-dis" v-preventReClick>
      Price Impact Too High
    </button> -->
    <select-token
      v-if="isSelectToken"
      :tokenVisible="isSelectToken"
      @confirmation="confirmation"
      @closeShow="closeShow"
    />
    <el-dialog
      title="Swap"
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
</template>

<script>
import SelectToken from "./SelectToken.vue";
import { mapMutations, mapState } from "vuex";
import {
  getBalance,
  getErc20Balance,
  swapExactETHForTokens,
  swapETHForExactTokens,
  swapExactTokensForETH,
  approve,
  getAllowance,
  swapTokensForExactETH,
} from "@/common/walletService/services";
import { liquidityPrice, dexLiquidityTime } from "@/common/dexApi";
import { BigNumber } from "bignumber.js";
import Loading from "@/components/Loading.vue";
export default {
  components: { Loading, SelectToken },
  props: {
    isSetting: Boolean,
  },
  data() {
    return {
      inputErc: null,
      inputEth: null,
      isEth: true,
      starttime: 0,
      swapType: 1,
      isSelectToken: false,
      priceData: {
        erc20Name: "",
        erc20Symbol: "",
        price: 0,
        erc20Address: "",
        liquidityStatus: 0,
      },
      isLoading: false,
      balance: {
        eth: 0,
        erc20: 0,
      },
      isInsufficient: false,
      isEnter: true,
      isSwap: false,
      isDataInfo: false,
      ethErcPrice: 0,
      priceImpact: 0,
      minimum: 0,
      slipData: null,
      liquidityNo: false,
      dialogLoading: false,
      allowance: 0,
      isAllowance: false,
    };
  },
  watch: {
    isSetting() {
      this.getSlip();
    },
    MetaMaskAddress() {
      this.getData();
    },
    ABI() {
      this.getData();
    },
    "ERCToken.erc20Address"() {
      this.getData();
    },
  },
  computed: {
    ...mapState(["MetaMaskAddress", "ERCToken", "ABI"]),
  },
  mounted() {
    this.getSlip();
    this.getData();
  },
  methods: {
    ...mapMutations(["setERCToken"]),
    getSlip() {
      const slip = sessionStorage.getItem("D4ARTSlip");
      this.slipData = JSON.parse(slip);
    },
    getPriceImpact() {
      const x =
        Number(this.priceData.ethBalance) === 0
          ? 1
          : new BigNumber(this.priceData.erc20Balance)
              .div(this.priceData.ethBalance)
              .toString();
      const y = this.ethErcPrice;
      const z = new BigNumber(x).minus(y).abs().toString();
      if (this.isEth) {
        this.priceImpact = new BigNumber(z).div(x).times(100).toString();
      } else {
        this.priceImpact = new BigNumber(z).div(y).times(100).toString();
      }
    },
    getMinimum() {
      const a = new BigNumber(1)
        .minus(new BigNumber(this.slipData.slip).div(100))
        .toString();
      const b = new BigNumber(1)
        .plus(new BigNumber(this.slipData.slip).div(100))
        .toString();
      if (this.isEth) {
        this.minimum =
          this.swapType === 1
            ? new BigNumber(this.inputErc).times(a).toString()
            : new BigNumber(this.inputEth).times(b).toString();
      } else {
        this.minimum =
          this.swapType === 1
            ? new BigNumber(this.inputErc).times(b).toString()
            : new BigNumber(this.inputEth).times(a).toString();
      }
    },
    async setSwap() {
      BigNumber.config({ EXPONENTIAL_AT: 32 });
      this.dialogLoading = true;
      const deadline = await dexLiquidityTime();
      if (this.isEth) {
        if (this.swapType === 1) {
          try {
            const slipNum = new BigNumber(1)
              .minus(new BigNumber(this.slipData.slip).div(100).toString())
              .toString();
            const req = {
              inputEth: this.inputEth,
              amountOutMin: new BigNumber(this.inputErc)
                .times(slipNum)
                .times(1e18)
                .toFixed(),
              path: [this.priceData.ethAddress, this.ERCToken.erc20Address],
              to: this.MetaMaskAddress,
              deadline: Number(this.slipData.time) * 60 + deadline.data,
            };
            const tx = await swapExactETHForTokens(req);
            await tx.wait();
            this.successNotif("Successful transaction");
            this.isInsufficient = false;
            this.isEnter = true;
            this.isSwap = false;
            this.inputEth = null;
            this.inputErc = null;
            this.isDataInfo = false;
            this.liquidityNo = false;
            this.getData();
            this.dialogLoading = false;
          } catch (error) {
            console.log(error, "errorerrorerrorerrorerror");
            this.dialogLoading = false;
            this.errMsg(JSON.stringify(error));
          }
        } else {
          try {
            const slipNum = new BigNumber(1)
              .plus(new BigNumber(this.slipData.slip).div(100).toString())
              .toString();
            const req = {
              inputEth: new BigNumber(this.inputEth).times(slipNum).toFixed(18),
              amountOut: new BigNumber(this.inputErc).times(1e18).toFixed(),
              path: [this.priceData.ethAddress, this.ERCToken.erc20Address],
              to: this.MetaMaskAddress,
              deadline: Number(this.slipData.time) * 60 + deadline.data,
            };
            const tx = await swapETHForExactTokens(req);
            await tx.wait();
            this.successNotif("Successful transaction");
            this.isInsufficient = false;
            this.isEnter = true;
            this.isSwap = false;
            this.inputEth = null;
            this.inputErc = null;
            this.isDataInfo = false;
            this.liquidityNo = false;
            this.getData();
            this.dialogLoading = false;
          } catch (error) {
            this.dialogLoading = false;
            this.errMsg(JSON.stringify(error));
          }
        }
      } else {
        if (this.swapType === 2) {
          const allowance = await getAllowance(
            this.priceData.erc20Address,
            this.MetaMaskAddress
          );
          if (
            new BigNumber(allowance).gte(
              new BigNumber(this.inputErc).times(1e18)
            )
          ) {
            try {
              const slipNum = new BigNumber(1)
                .minus(new BigNumber(this.slipData.slip).div(100).toString())
                .toString();
              const req = {
                amountIn: new BigNumber(this.inputErc).times(1e18).toFixed(0),
                amountOutMin: new BigNumber(this.inputEth)
                  .times(slipNum)
                  .times(1e18)
                  .toFixed(0),
                path: [this.ERCToken.erc20Address, this.priceData.ethAddress],
                to: this.MetaMaskAddress,
                deadline: Number(this.slipData.time) * 60 + deadline.data,
              };
              const tx = await swapExactTokensForETH(req);
              await tx.wait();
              this.successNotif("Successful transaction");
              this.isInsufficient = false;
              this.isEnter = true;
              this.isSwap = false;
              this.inputEth = null;
              this.inputErc = null;
              this.isDataInfo = false;
              this.liquidityNo = false;
              this.getData();
              this.dialogLoading = false;
            } catch (error) {
              this.dialogLoading = false;
              this.errMsg(JSON.stringify(error));
            }
          } else {
            try {
              const app = await approve(this.ERCToken.erc20Address);
              await app.wait();
              this.successNotif("Successful transaction");
              this.dialogLoading = false;
            } catch (error) {
              this.errMsg(JSON.stringify(error));
              this.dialogLoading = false;
            }
          }
        } else {
          const allowance = await getAllowance(
            this.priceData.erc20Address,
            this.MetaMaskAddress
          );
          if (
            new BigNumber(allowance).gte(
              new BigNumber(this.inputErc).times(1e18)
            )
          ) {
            try {
              const slipNum = new BigNumber(1)
                .plus(new BigNumber(this.slipData.slip).div(100).toString())
                .toString();
              const req = {
                amountOut: new BigNumber(this.inputEth).times(1e18).toFixed(0),
                amountInMax: new BigNumber(this.inputErc)
                  .times(slipNum)
                  .times(1e18)
                  .toFixed(0),
                path: [this.ERCToken.erc20Address, this.priceData.ethAddress],
                to: this.MetaMaskAddress,
                deadline: Number(this.slipData.time) * 60 + deadline.data,
              };
              const tx = await swapTokensForExactETH(req);
              await tx.wait();
              this.successNotif("Successful transaction");
              this.isInsufficient = false;
              this.isEnter = true;
              this.isSwap = false;
              this.inputEth = null;
              this.inputErc = null;
              this.isDataInfo = false;
              this.liquidityNo = false;
              this.getData();
              this.dialogLoading = false;
            } catch (error) {
              this.dialogLoading = false;
              this.errMsg(JSON.stringify(error));
            }
          } else {
            try {
              const app = await approve(this.ERCToken.erc20Address);
              await app.wait();
              this.successNotif("Successful transaction");
              this.dialogLoading = false;
            } catch (error) {
              this.errMsg(JSON.stringify(error));
              this.dialogLoading = false;
            }
          }
        }
      }
    },
    goLogin() {
      this.loginWallet();
      // this.$router.push({
      //   path: `/login`,
      //   query: {
      //     redirect: this.$route.fullPath,
      //   },
      // });
    },
    async getData() {
      this.isAllowance = false;
      this.allowance = 0;
      this.isInsufficient = false;
      this.isEnter = true;
      this.isSwap = false;
      this.inputEth = null;
      this.inputErc = null;
      this.ethErcPrice = 0;
      this.isDataInfo = false;
      this.liquidityNo = false;
      this.isLoading = false;
      const price = await liquidityPrice({
        erc20Address: this.ERCToken.erc20Address,
      });
      this.priceData = price.data;
      if (!this.MetaMaskAddress) return;
      if (!this.ABI) return;
      const eth = await getBalance();
      const erc20 = await getErc20Balance(
        this.ERCToken.erc20Address,
        this.MetaMaskAddress
      );
      this.balance.eth = eth;
      this.balance.erc20 = new BigNumber(erc20).div(1e18).toString();
    },
    closeShow() {
      this.isSelectToken = false;
    },
    confirmation(val) {
      this.isSelectToken = false;
      this.setERCToken(val);
      this.$router.push({
        path: "/dex",
        query: {
          type: "swap",
          tab: this.$route.query.tab ? this.$route.query.tab : "priceTab",
          address: val.erc20Address,
        },
      });
      // this.ercToken = val;
    },
    setErcType() {
      this.isSelectToken = true;
    },
    setMax(type, event) {
      if (type === 1) {
        const eth = new BigNumber(this.balance.eth).minus(0.01).toString();
        this.inputEth = Number(eth) < 0 ? 0 : eth;
      } else {
        this.inputErc = this.balance.erc20;
      }
      this.setSwapIput(event, type);
    },
    swapBlur(val) {
      this.swapType = val;
    },
    setIsEth(event) {
      // if (this.swapType === 1) {
      //   this.inputErc = this.inputEth ? this.inputEth : null;
      //   this.inputEth = this.inputErc ? this.inputErc * 5 : null;
      // } else {
      //   this.inputEth = this.inputErc ? this.inputErc : null;
      //   this.inputEth = this.inputErc ? this.inputErc * 0.2 : null;
      // }
      this.isEth = !this.isEth;
      this.setSwapIput(event, this.swapType);
    },
    setSwapIput(event, type) {
      this.isAllowance = false;
      this.allowance = 0;
      this.isInsufficient = false;
      this.isSwap = false;
      this.liquidityNo = false;
      this.isDataInfo = false;
      this.isEnter = true;
      this.swapType = type;
      this.starttime = event.timeStamp;
      let e = event;
      if (this.isEth) {
        if (type === 1) {
          if (this.inputEth && Number(this.inputEth) > 0) {
            this.isDataInfo = false;
            this.isLoading = true;
            setTimeout(async () => {
              if (this.starttime - e.timeStamp === 0) {
                const x = new BigNumber(997)
                  .times(this.inputEth)
                  .times(this.priceData.erc20Balance)
                  .toFixed();
                const y = new BigNumber(1000)
                  .times(this.priceData.ethBalance)
                  .plus(new BigNumber(997).times(this.inputEth))
                  .toFixed();
                const z = Number(y) === 0 ? 1 : y;
                this.inputErc = new BigNumber(x).div(z).toNumber();
                if (
                  new BigNumber(this.inputEth).gt(
                    new BigNumber(this.balance.eth).minus(0.01)
                  )
                ) {
                  this.isInsufficient = true;
                  this.isEnter = false;
                  this.isSwap = false;
                } else {
                  this.isInsufficient = false;
                  this.isEnter = false;
                  this.isSwap = true;
                }
                this.ethErcPrice = new BigNumber(this.inputErc)
                  .div(this.inputEth)
                  .toString();

                this.getMinimum();
                this.getPriceImpact();
                this.isLoading = false;
                this.liquidityNo = false;
                this.isDataInfo = true;
              }
            }, 1000);
          } else {
            this.isInsufficient = false;
            this.isEnter = true;
            this.isSwap = false;
            this.inputErc = null;
            this.ethErcPrice = 0;
            this.isDataInfo = false;
            this.liquidityNo = false;
            this.isLoading = false;
          }
        }
        if (type === 2) {
          if (this.inputErc && Number(this.inputErc) > 0) {
            this.isDataInfo = false;
            this.isLoading = true;
            setTimeout(async () => {
              if (this.starttime - e.timeStamp === 0) {
                this.inputEth = 0;
                const x = new BigNumber(1000)
                  .times(this.priceData.ethBalance)
                  .times(this.inputErc);
                const y = new BigNumber(997)
                  .times(
                    new BigNumber(this.priceData.erc20Balance).minus(
                      this.inputErc
                    )
                  )
                  .toFixed();
                const z = Number(y) === 0 ? 1 : y;
                this.inputEth = new BigNumber(x).div(z).toNumber();
                this.liquidityNo = false;
                this.isInsufficient = false;
                this.isEnter = false;
                this.isSwap = true;

                this.isLoading = false;
                this.ethErcPrice =
                  Number(this.inputEth) > 0
                    ? new BigNumber(this.inputErc).div(this.inputEth).toString()
                    : 0;
                if (
                  new BigNumber(this.inputEth).gt(
                    new BigNumber(this.balance.eth).minus(0.01)
                  )
                ) {
                  this.isInsufficient = true;
                  this.liquidityNo = false;
                  this.isEnter = false;
                  this.isSwap = false;
                }
                if (
                  new BigNumber(this.inputErc).gt(this.priceData.erc20Balance)
                ) {
                  this.liquidityNo = true;
                  this.isInsufficient = false;
                  this.isEnter = false;
                  this.isSwap = false;
                  this.inputEth = 0;
                }

                this.getMinimum();
                this.getPriceImpact();
                this.isDataInfo = true;
              }
            }, 1000);
          } else {
            this.isInsufficient = false;
            this.isEnter = true;
            this.isSwap = false;
            this.inputEth = null;
            this.ethErcPrice = 0;
            this.liquidityNo = false;
            this.isDataInfo = false;
            this.isLoading = false;
          }
        }
      } else {
        if (type === 1) {
          if (this.inputEth && Number(this.inputEth) > 0) {
            this.isDataInfo = false;
            this.isLoading = true;
            setTimeout(async () => {
              if (this.starttime - e.timeStamp === 0) {
                if (
                  new BigNumber(this.inputEth).gt(this.priceData.ethBalance)
                ) {
                  this.liquidityNo = true;
                  this.isInsufficient = false;
                  this.isEnter = false;
                  this.isSwap = false;
                  this.inputErc = 0;
                } else {
                  const x = new BigNumber(1000)
                    .times(this.priceData.erc20Balance)
                    .times(this.inputEth);
                  const y = new BigNumber(997)
                    .times(
                      new BigNumber(this.priceData.ethBalance).minus(
                        this.inputEth
                      )
                    )
                    .toFixed();
                  const z = Number(y) === 0 ? 1 : y;
                  this.inputErc = new BigNumber(x).div(z).toNumber();
                  if (new BigNumber(this.inputErc).gt(this.balance.erc20)) {
                    this.liquidityNo = false;
                    this.isInsufficient = true;
                    this.isEnter = false;
                    this.isSwap = false;
                  } else {
                    this.isInsufficient = false;
                    this.isEnter = false;
                    this.isSwap = true;
                    this.liquidityNo = false;

                    if (this.MetaMaskAddress) {
                      const allowance = await getAllowance(
                        this.priceData.erc20Address,
                        this.MetaMaskAddress
                      );
                      this.allowance = new BigNumber(allowance)
                        .div(1e18)
                        .toNumber();
                      this.isAllowance = new BigNumber(this.allowance).lt(
                        this.inputErc
                      );
                    }
                  }
                  this.ethErcPrice = new BigNumber(this.inputErc)
                    .div(this.inputEth)
                    .toString();
                  this.getMinimum();
                  this.getPriceImpact();
                  this.isDataInfo = Number(this.ethErcPrice) > 0;
                }
                this.isLoading = false;
              }
            }, 1000);
          } else {
            this.isInsufficient = false;
            this.isEnter = true;
            this.isSwap = false;
            this.inputErc = null;
            this.isDataInfo = false;
            this.liquidityNo = false;
            this.isLoading = false;
          }
        }
        if (type === 2) {
          if (this.inputErc && Number(this.inputErc) > 0) {
            this.isDataInfo = false;
            this.isLoading = true;
            setTimeout(async () => {
              if (this.starttime - e.timeStamp === 0) {
                const x = new BigNumber(997)
                  .times(this.inputErc)
                  .times(this.priceData.ethBalance)
                  .toFixed();
                const y = new BigNumber(1000)
                  .times(this.priceData.erc20Balance)
                  .plus(new BigNumber(997).times(this.inputErc))
                  .toFixed();
                const z = Number(y) === 0 ? 1 : y;
                this.inputEth = new BigNumber(x).div(z).toNumber();
                if (new BigNumber(this.inputErc).gt(this.balance.erc20)) {
                  this.liquidityNo = false;
                  this.isInsufficient = true;
                  this.isEnter = false;
                  this.isSwap = false;
                } else {
                  this.liquidityNo = false;
                  this.isInsufficient = false;
                  this.isEnter = false;
                  this.isSwap = true;
                  if (this.MetaMaskAddress) {
                    const allowance = await getAllowance(
                      this.priceData.erc20Address,
                      this.MetaMaskAddress
                    );
                    this.allowance = new BigNumber(allowance)
                      .div(1e18)
                      .toNumber();
                    this.isAllowance = new BigNumber(this.allowance).lt(
                      this.inputErc
                    );
                  }
                }
                this.isLoading = false;
                this.ethErcPrice =
                  Number(this.inputEth) > 0
                    ? new BigNumber(this.inputErc).div(this.inputEth).toString()
                    : 0;
                this.getMinimum();
                this.getPriceImpact();
                this.isDataInfo = true;
              }
            }, 1000);
          } else {
            this.isInsufficient = false;
            this.isEnter = true;
            this.isSwap = false;
            this.liquidityNo = false;
            this.inputEth = null;
            this.isDataInfo = false;
            this.isLoading = false;
          }
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
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
    cursor: pointer;
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

.swap_input {
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
    color: #757575;
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
  .swap-info {
    background: #282f41;
    border: 1px solid #6062aa;
    box-sizing: border-box;
    padding: 16px;
    margin-top: 12px;
    p {
      color: #9e9e9e;
      font-size: 14px;
    }
    span {
      float: right;
      color: #9e9e9e;
    }
  }
  .mag0 {
    margin: 0;
  }
}
.swap-btn {
  background: #745cd4;
  border-radius: 2px;

  height: 52px;
  width: 100%;
  margin-top: 28px;
  font-size: 18px;
  color: #fff;
  border: none;
}
.swap-btn:hover {
  background: #947cf4;
}
.swap-btn:active {
  background: #847ca4;
}
.swap-disable {
  cursor: no-drop !important;
  border-radius: 2px;
  height: 52px;
  width: 100%;
  margin-top: 28px;
  font-size: 18px;
  border: none;
  background-color: #2e2555 !important;
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
.erc-type {
  cursor: pointer;
}
.dialogLoading {
  height: 150px;
  text-align: center;
  p {
    font-size: 16px;
    color: #9e9e9e;
    text-align: center;
    margin: 0;
    padding: 30px 0 40px 0;
  }
}
.is-approve {
  color: #ffa1a1;
  font-size: 16px;
  margin-top: 12px;
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
</style>
