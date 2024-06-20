<template>
  <div class="box-input">
    <div class="input-text">
      <h4>Manage Liquidity</h4>
      <p>
        {{
          isAdd
            ? "By adding liquidity, you will earn a fee of 0.3% of the corresponding trading volume according to your proportion in the liquidity pool. The handling fee will be added to the liquidity pool in real time, and when you withdraw the liquidity, you will also get back the handling fee you earned."
            : "Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive."
        }}
      </p>
      <div class="add-rem">
        Remove Liquidity
        <el-switch
          v-model="isAdd"
          active-color="#B3B5F2"
          inactive-color="#B3B5F2"
          @change="switchChange"
        >
        </el-switch>
        Add Liquidity
      </div>
    </div>
    <div v-if="isAdd">
      <div class="input-flex">
        <div class="flex-left">
          <div class="flex-blance" v-show="MetaMaskAddress">
            Balance: {{ balance.eth | bigNumFormat(6, 0.000001) }}
          </div>
          <div class="flex-input">
            <div class="swap-input">
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
        <div class="flex-center">
          <span>
            <svg-icon icon-class="add" />
          </span>
        </div>
        <div class="flex-right">
          <div class="flex-blance" v-show="MetaMaskAddress">
            Balance: {{ balance.erc20 | bigNumFormat(6, 0.000001) }}
          </div>
          <div class="flex-input">
            <div class="swap-input">
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
      </div>
      <div class="liq-text" v-show="isLoading">
        <span><i class="el-icon-loading"></i> Fetching price...</span>
      </div>
      <div class="swap-text" v-if="isAddInfo">
        <div
          class="text-top"
          v-if="receiveData.isShow && priceData.liquidityStatus === 2"
        >
          You'll receive (at least):
          <span
            >≈ {{ receiveData.tokens | bigNumFormat(6, 0.000001) }} ETH/{{
              ERCToken.erc20Symbol
            }}
            Pool Tokens</span
          >
        </div>
        <div class="swap-info">
          <h4>Initial prices and pool share</h4>
          <div class="info-divs">
            <div>
              <p class="divs-top">
                {{ poolShare.erc20 | bigNumFormat(6, 0.000001) }}
              </p>
              <p class="divs-bom">ETH per {{ ERCToken.erc20Symbol }}</p>
            </div>
            <div>
              <p class="divs-top">
                {{ poolShare.eth | bigNumFormat(6, 0.000001) }}
              </p>
              <p class="divs-bom">{{ ERCToken.erc20Symbol }} per ETH</p>
            </div>
            <div>
              <p class="divs-top">{{ poolShare.pool }}%</p>
              <p class="divs-bom">Share of Pool</p>
            </div>
          </div>
        </div>
        <div class="liquidity-status" v-if="priceData.liquidityStatus === 0">
          This will create a liquidity pool simultaneously as currently no
          liquidity pool created for this DAO.
        </div>
      </div>
      <div class="is-approve" v-show="isAllowance && isSupply">
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
        <button
          class="swap-btn swap-disable"
          v-preventReClick
          v-show="isEnterAmount"
        >
          Enter an amount
        </button>
        <button
          class="swap-btn swap-disable"
          v-preventReClick
          v-show="isInsufficient"
        >
          Insufficient balance
        </button>

        <button
          class="swap-btn"
          v-preventReClick
          v-show="isSupply"
          @click="setData"
        >
          Supply
        </button>
      </div>
      <!-- 5-15 // 15-专家模式 -->
      <!-- <button class="swap-btn swap-red" v-preventReClick>Swap Anyway</button> -->
      <!-- 15 没有专家模式-->
      <!-- <button class="swap-btn swap-red swap-red-dis" v-preventReClick>
      Price Impact Too High
    </button> -->
    </div>
    <div class="disable-input" v-else>
      <div class="flex-top">
        <div class="flex-blance" v-show="MetaMaskAddress">
          Balance: {{ pairBlance | bigNumFormat(6, 0.000001) }}
        </div>
        <div class="flex-input">
          <div class="swap-input">
            <el-input
              v-model="inputPair"
              placeholder="0"
              @keyup.native="setRemoSwapIput($event)"
              @blur="swapBlur(1)"
              oninput="if(isNaN(value)||Number(value)<0) { value = null }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+19)}"
            ></el-input>
            <!-- <button @click="setMax()">MAX</button> -->
            <span class="flex-texteth"
              >ETH/{{ ERCToken.erc20Symbol }}Pool Tokens</span
            >
          </div>
        </div>
      </div>
      <div class="receive">
        <span>You'll receive (at least):</span>
      </div>
      <div class="input-flex">
        <div class="flex-left">
          <div class="flex-blance" v-show="MetaMaskAddress">
            Balance: {{ balance.eth | bigNumFormat(6, 0.000001) }}
          </div>
          <div class="flex-input">
            <div class="swap-input">
              <!-- <el-input v-model="pairData.eth" disabled></el-input> -->
              <!-- <button @click="setMax()">MAX</button> -->
              <span class="pair-text">
                {{ pairData.eth | bigNumFormat(6, 0.000001) }}
              </span>
              <span class="flex-texteth" style="margin-left: auto"> ETH</span>
            </div>
          </div>
        </div>
        <div class="flex-center">
          <span>
            <svg-icon icon-class="remo" />
          </span>
        </div>
        <div class="flex-right">
          <div class="flex-blance" v-show="MetaMaskAddress">
            Balance: {{ balance.erc20 | bigNumFormat(6, 0.000001) }}
          </div>
          <div class="flex-input">
            <div class="swap-input">
              <!-- <el-input v-model="pairData.erc20" disabled></el-input> -->
              <!-- <button @click="setMax()">MAX</button> -->
              <span class="pair-text">
                {{ pairData.erc20 | bigNumFormat(6, 0.000001) }}
              </span>
              <span class="flex-texteth" style="margin-left: auto">
                {{ ERCToken.erc20Symbol }}
              </span>
            </div>
          </div>
        </div>
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
        <button
          class="swap-btn swap-disable"
          v-preventReClick
          v-show="isRemoEnterAmount"
        >
          Enter an amount
        </button>
        <button
          class="swap-btn swap-disable"
          v-preventReClick
          v-show="isRemoInsufficient"
        >
          Insufficient balance
        </button>
        <button
          class="swap-btn"
          v-preventReClick
          v-show="isRemove"
          @click="removeData"
        >
          Remove
        </button>
      </div>
    </div>
    <select-token
      v-if="isSelectToken"
      :tokenVisible="isSelectToken"
      @confirmation="confirmation"
      @closeShow="closeShow"
    />
    <el-dialog
      :title="isAdd ? 'Add Liquidity' : 'Remove Liquidity'"
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
import { liquidityPrice, dexLiquidityTime } from "@/common/dexApi";
import {
  getBalance,
  getErc20Balance,
  getAllowance,
  approve,
  addLiquidityETH,
  getPairBalanceOf,
  sig,
  getNonce,
  removeLiquidityETHWithPermit,
  getTotalSupply,
} from "@/common/walletService/services";

import { ethers } from "ethers";
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
      isAdd: true,
      isSelectToken: false,
      ercToken: {
        name: "D4A_T 12",
        id: 1,
      },
      isLoading: false,
      balance: {
        eth: 0,
        erc20: 0,
      },
      priceData: {
        erc20Name: "",
        erc20Symbol: "",
        price: 0,
        erc20Address: "",
        liquidityStatus: 0,
        pairAddress: "",
        pairBalance: 0,
      },
      poolShare: {
        eth: 0,
        erc20: 0,
        pool: 0,
      },
      isEnterAmount: true,
      isInsufficient: false,
      isSupply: false,
      isAddInfo: false,
      dialogLoading: false,
      receiveData: {
        isShow: false,
        tokens: 0,
      },
      pairBlance: 0,
      inputPair: null,
      pairData: {
        eth: 0,
        erc20: 0,
      },
      isRemove: false,
      isRemoEnterAmount: true,
      isRemoInsufficient: false,
      slipData: null,
      pairBalance: 0,
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
      this.switchChange();
    },
  },
  computed: {
    ...mapState(["MetaMaskAddress", "ERCToken", "ABI"]),
  },
  mounted() {
    this.getSlip();
    if (this.ABI) {
      this.getData();
    }
  },
  methods: {
    ...mapMutations(["setERCToken"]),
    getSlip() {
      const slip = sessionStorage.getItem("D4ARTSlip");
      this.slipData = JSON.parse(slip);
    },
    switchChange(val) {
      if (val) {
        this.inputPair = null;
        this.pairData = {
          eth: 0,
          erc20: 0,
        };
        this.isRemove = false;
        this.isRemoEnterAmount = true;
        this.isRemoInsufficient = false;
      } else {
        this.isAllowance = false;
        this.allowance = 0;
        this.inputErc = null;
        this.inputEth = null;
        this.isAddInfo = false;
        this.isInsufficient = false;
        this.isSupply = false;
        this.isEnterAmount = true;
      }
    },
    async removeData() {
      this.dialogLoading = true;
      let splittedSignature = null;
      let deadline = null;
      let signature = null;
      try {
        const chainID = await sig().getChainId();
        const domain = {
          name: "D4ASwap LP Token",
          version: "1",
          chainId: chainID,
          verifyingContract: this.priceData.pairAddress,
        };
        const types = {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        };
        const nonce = await getNonce(
          this.priceData.pairAddress,
          this.MetaMaskAddress
        );
        deadline = await dexLiquidityTime();
        const value = {
          owner: this.MetaMaskAddress,
          spender: this.ABI.router_contract,
          value: new BigNumber(this.inputPair).times(1e18).toFixed(),
          nonce: nonce.toString(),
          deadline: deadline.data + Number(this.slipData.time) * 60,
        };
        signature = await sig()._signTypedData(domain, types, value);
        splittedSignature = ethers.utils.splitSignature(signature);
      } catch (error) {
        this.dialogLoading = false;
        this.errNotif("User denied message signature.");
      }
      if (signature) {
        try {
          const slipNum = new BigNumber(1)
            .minus(new BigNumber(this.slipData.slip).div(100).toString())
            .toString();
          const reqObj = {
            erc20Address: this.priceData.erc20Address,
            input: new BigNumber(this.inputPair).times(1e18).toFixed(),
            amountTokenMin: new BigNumber(this.pairData.erc20)
              .times(slipNum)
              .times(1e18)
              .toFixed(0),
            amountETHMin: new BigNumber(this.pairData.eth)
              .times(slipNum)
              .times(1e18)
              .toFixed(0),
            to: this.MetaMaskAddress,
            deadline: deadline.data + this.slipData.time * 60,
            approveMax: false,
            v: splittedSignature.v,
            r: splittedSignature.r,
            s: splittedSignature.s,
          };
          const tx = await removeLiquidityETHWithPermit(reqObj);
          await tx.wait();
          this.successNotif("Successful transaction");
          this.pairData = {
            eth: 0,
            erc20: 0,
          };
          this.isRemove = false;
          this.isRemoEnterAmount = true;
          this.isRemoInsufficient = false;
          this.dialogLoading = false;
          this.getData();
        } catch (error) {
          this.dialogLoading = false;
          this.errMsg(JSON.stringify(error));
        }
      }
    },
    // async signature() {
    //   const chainID = await sig().getChainId();
    //   console.log(chainID, "chainID");
    //   const domain = {
    //     name: "D4ASwap LP Token",
    //     version: "1",
    //     chainId: chainID,
    //     verifyingContract: this.ABI.router_contract,
    //   };
    //   console.log(domain, "domaindomain");
    //   const types = {
    //     Permit: [
    //       { name: "owner", type: "address" },
    //       { name: "spender", type: "address" },
    //       { name: "value", type: "uint256" },
    //       { name: "nonce", type: "uint256" },
    //       { name: "deadline", type: "uint256" },
    //     ],
    //   };
    //   const nonce = await getNonce(
    //     this.priceData.pairAddress,
    //     this.MetaMaskAddress
    //   );
    //   console.log(nonce.toString(), "noncenoncenoncenoncenoncenonce");
    //   const deadline = await dexLiquidityTime();
    //   const value = {
    //     owner: this.MetaMaskAddress,
    //     spender: this.ABI.router_contract,
    //     value: new BigNumber(this.inputPair).times(1e18).toFixed(),
    //     nonce: nonce.toString(),
    //     deadline: deadline.data + 1200,
    //   };
    //   const signature = await sig()._signTypedData(domain, types, value);
    //   console.log(signature, "signature");
    // },

    // const splittedSignature = ethers.utils.splitSignature(signature);
    // const v = splittedSignature.v;
    // const r = splittedSignature.r;
    // const s = splittedSignature.s;
    goLogin() {
      this.loginWallet();
    },
    async setAddLiquidityETH() {
      try {
        const time = await dexLiquidityTime();
        const slipNum = new BigNumber(1)
          .minus(new BigNumber(this.slipData.slip).div(100).toString())
          .toString();
        const data = {
          address: this.ERCToken.erc20Address,
          erc20: new BigNumber(this.inputErc).times(1e18).toFixed(),
          erc20min: new BigNumber(this.inputErc)
            .times(1e18)
            .times(slipNum)
            .toFixed(0, 1),
          eth: this.inputEth,
          ethmin: new BigNumber(this.inputEth)
            .times(1e18)
            .times(slipNum)
            .toFixed(0, 1),
          metamask: this.MetaMaskAddress,
          deadline: time.data + this.slipData.time * 60,
        };
        const tx = await addLiquidityETH(data);
        await tx.wait();
        this.successNotif("Successful transaction");
        this.inputErc = null;
        this.inputEth = null;
        this.isAddInfo = false;
        this.isInsufficient = false;
        this.isSupply = false;
        this.isEnterAmount = true;
        this.isLoading = false;
        this.getData();
        this.dialogLoading = false;
      } catch (error) {
        console.log(error, "error");
        this.errMsg(JSON.stringify(error));
        this.dialogLoading = false;
      }
    },
    async setApprove() {
      try {
        const app = await approve(this.ERCToken.erc20Address);
        await app.wait();
        this.successNotif("Successful transaction");
        this.dialogLoading = false;
      } catch (error) {
        this.errMsg(JSON.stringify(error));
        this.dialogLoading = false;
      }
    },
    async setData() {
      this.dialogLoading = true;
      const res = await getAllowance(
        this.ERCToken.erc20Address,
        this.MetaMaskAddress
      );
      if (
        new BigNumber(res).lt(
          new BigNumber(this.inputErc).times(1e18).toString()
        )
      ) {
        this.setApprove();
      } else {
        this.setAddLiquidityETH();
      }
    },
    async getData() {
      this.isAllowance = false;
      this.allowance = 0;
      this.pairBalance = 0;
      this.receiveData = {
        isShow: false,
        tokens: 0,
      };
      this.poolShare = {
        eth: 0,
        erc20: 0,
        pool: 0,
      };
      this.pairData = {
        eth: 0,
        erc20: 0,
      };
      this.inputPair = null;
      this.inputErc = null;
      this.inputEth = null;
      this.isRemove = false;
      this.isRemoEnterAmount = this.isAdd ? false : true;
      this.isRemoInsufficient = false;
      this.isInsufficient = false;
      this.isAddInfo = false;
      this.isSupply = false;
      this.isEnterAmount = this.isAdd ? true : false;

      const price = await liquidityPrice({
        erc20Address: this.ERCToken.erc20Address,
      });

      //TODO priceData
      this.priceData = price.data;
      if (this.MetaMaskAddress && price.data.liquidityStatus === 2) {
        const pairBalance = await getTotalSupply(price.data.pairAddress);
        this.pairBalance = new BigNumber(pairBalance).div(1e18).toString();
      } else {
        this.pairBalance = 1;
      }
      if (!this.MetaMaskAddress) return;
      if (!this.ABI) return;
      const eth = await getBalance();
      const erc20 = await getErc20Balance(
        this.ERCToken.erc20Address,
        this.MetaMaskAddress
      );
      if (this.priceData.pairAddress) {
        const pair = await getPairBalanceOf(
          this.priceData.pairAddress,
          this.MetaMaskAddress
        );
        this.pairBlance = new BigNumber(pair).div(1e18).toString();
      } else {
        this.pairBlance = 0;
      }

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
          type: "liquidity",
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
      // if (val === 1) {
      //   this.inputErc = 0;
      // } else {
      //   this.inputEth = 0;
      // }
    },
    setRemoSwapIput(event) {
      if (!this.MetaMaskAddress) return;
      this.starttime = event.timeStamp;
      let e = event;
      setTimeout(async () => {
        if (this.starttime - e.timeStamp === 0) {
          if (
            this.priceData.liquidityStatus === 2 &&
            this.inputPair &&
            Number(this.inputPair > 0)
          ) {
            if (
              new BigNumber(this.inputPair).gt(this.pairBlance) &&
              this.pairBlance
            ) {
              this.pairData = {
                eth: 0,
                erc20: 0,
              };
              this.isRemove = false;
              this.isRemoEnterAmount = false;
              this.isRemoInsufficient = true;
            } else {
              const a = new BigNumber(1)
                .minus(new BigNumber(this.slipData.slip).div(100))
                .toString();
              this.pairData = {
                eth: new BigNumber(this.inputPair)
                  .div(this.pairBalance)
                  .times(this.priceData.ethBalance)
                  .times(a)
                  .toString(),
                erc20: new BigNumber(this.inputPair)
                  .div(this.pairBalance)
                  .times(this.priceData.erc20Balance)
                  .times(a)
                  .toString(),
              };
              this.isRemove = true;
              this.isRemoEnterAmount = false;
              this.isRemoInsufficient = false;
            }
          } else {
            this.pairData = {
              eth: 0,
              erc20: 0,
            };
            this.isRemove = false;
            this.isRemoEnterAmount = true;
            this.isRemoInsufficient = false;
          }
        }
      }, 1000);
    },
    setSwapIput(event, type) {
      BigNumber.config({ EXPONENTIAL_AT: 32 });
      if (!this.MetaMaskAddress) return;
      this.isAddInfo = false;
      this.isInsufficient = false;
      this.isSupply = false;
      this.isEnterAmount = true;
      this.isLoading = false;
      this.isAllowance = false;
      this.allowance = 0;
      this.starttime = event.timeStamp;
      let e = event;
      if (
        this.inputEth &&
        Number(this.inputEth) > 0 &&
        this.inputErc &&
        Number(this.inputErc) > 0
      ) {
        this.isLoading = true;
        setTimeout(async () => {
          if (this.starttime - e.timeStamp === 0) {
            this.isAddInfo = false;
            const price = await liquidityPrice({
              erc20Address: this.ERCToken.erc20Address,
            });
            this.priceData = price.data;
            if (this.MetaMaskAddress && price.data.liquidityStatus === 2) {
              const pairBalance = await getTotalSupply(price.data.pairAddress);
              this.pairBalance = new BigNumber(pairBalance)
                .div(1e18)
                .toString();
            } else {
              this.pairBalance = 1;
            }

            if (
              Number(this.inputErc) > Number(this.balance.erc20) ||
              Number(this.inputEth) > Number(this.balance.eth) - 0.01
            ) {
              this.isEnterAmount = false;
              this.isSupply = false;
              this.isInsufficient = true;
            } else {
              this.isEnterAmount = false;
              this.isInsufficient = false;
              this.isSupply = true;

              if (this.MetaMaskAddress) {
                const allowance = await getAllowance(
                  this.ERCToken.erc20Address,
                  this.MetaMaskAddress
                );
                this.allowance = new BigNumber(allowance).div(1e18).toNumber();
                this.isAllowance = new BigNumber(this.allowance).lt(
                  this.inputErc
                );
              }
            }
            if (this.priceData.liquidityStatus === 0) {
              this.poolShare = {
                eth: new BigNumber(this.inputErc).div(this.inputEth).toString(),
                erc20: new BigNumber(this.inputEth)
                  .div(this.inputErc)
                  .toString(),
                pool: 100,
              };
              this.isAddInfo = true;
            }
            if (this.priceData.liquidityStatus === 1) {
              this.poolShare = {
                eth: new BigNumber(this.inputErc).div(this.inputEth).toFixed(),
                erc20: new BigNumber(this.inputEth)
                  .div(this.inputErc)
                  .toFixed(),
                pool: 100,
              };
              this.isAddInfo = true;
            }
            if (this.priceData.liquidityStatus === 2) {
              if (type === 1) {
                if (this.inputEth && Number(this.inputEth) > 0) {
                  this.inputErc = new BigNumber(this.priceData.erc20Balance)
                    .div(this.priceData.ethBalance)
                    .times(this.inputEth)
                    .dp(18)
                    .toString();
                } else {
                  this.inputErc = 0;
                  this.isInsufficient = false;
                  this.isAddInfo = false;
                  this.isSupply = false;
                  this.poolShare = {
                    eth: 0,
                    erc20: 0,
                    pool: 0,
                  };
                  this.isEnterAmount = true;
                }
              }
              if (type === 2) {
                if (this.inputErc && Number(this.inputErc) > 0) {
                  this.inputEth = new BigNumber(this.inputErc)
                    .times(this.priceData.price)
                    .dp(18)
                    .toString();
                } else {
                  this.inputEth = 0;
                  this.isInsufficient = false;
                  this.isAddInfo = false;
                  this.isSupply = false;
                  this.poolShare = {
                    eth: 0,
                    erc20: 0,
                    pool: 0,
                  };
                  this.isEnterAmount = true;
                }
              }
              if (
                this.inputErc &&
                Number(this.inputErc) > 0 &&
                this.inputEth &&
                Number(this.inputEth) > 0
                // &&
                // Number(this.inputErc) <= Number(this.balance.erc20) &&
                // Number(this.inputEth) <= Number(this.balance.eth) - 0.1
              ) {
                const a = new BigNumber(1)
                  .minus(new BigNumber(this.slipData.slip).div(100))
                  .toString();
                this.receiveData = {
                  isShow: true,
                  tokens: new BigNumber(this.inputEth)
                    .div(this.priceData.ethBalance)
                    .times(this.pairBalance)
                    .times(a)
                    .toString(),
                };
                this.poolShare = {
                  eth: new BigNumber(this.priceData.erc20Balance)
                    .div(this.priceData.ethBalance)
                    .toFixed(),
                  erc20: new BigNumber(this.priceData.price).toString(),
                  pool: new BigNumber(this.inputEth)
                    .div(
                      new BigNumber(this.inputEth).plus(
                        this.priceData.ethBalance
                      )
                    )
                    .times(100)
                    .toFixed(2, 1),
                };
                if (
                  Number(this.inputErc) <= Number(this.balance.erc20) &&
                  Number(this.inputEth) <= Number(this.balance.eth) - 0.01
                ) {
                  this.isInsufficient = false;
                  this.isEnterAmount = false;
                  this.isAddInfo = true;
                  this.isSupply = true;

                  if (this.MetaMaskAddress) {
                    const allowance = await getAllowance(
                      this.ERCToken.erc20Address,
                      this.MetaMaskAddress
                    );
                    this.allowance = new BigNumber(allowance)
                      .div(1e18)
                      .toNumber();
                    this.isAllowance = new BigNumber(this.allowance).lt(
                      this.inputErc
                    );
                  }
                } else {
                  this.isInsufficient = true;
                  this.isEnterAmount = false;
                  this.isAddInfo = true;
                  this.isSupply = false;
                }
              } else {
                this.isEnterAmount = false;
                this.isAddInfo = false;
                this.isSupply = false;
                this.isInsufficient = true;
              }
            }

            this.isLoading = false;
          }
        }, 1000);
      } else {
        this.isLoading = true;
        setTimeout(async () => {
          if (this.starttime - e.timeStamp === 0) {
            const price = await liquidityPrice({
              erc20Address: this.ERCToken.erc20Address,
            });
            this.priceData = price.data;
            if (this.priceData.liquidityStatus === 2) {
              if (type === 1) {
                if (this.inputEth && Number(this.inputEth) > 0) {
                  this.inputErc = new BigNumber(this.priceData.erc20Balance)
                    .div(this.priceData.ethBalance)
                    .times(this.inputEth)
                    .dp(18)
                    .toString();
                } else {
                  this.inputErc = 0;
                  this.isInsufficient = false;
                  this.isAddInfo = false;
                  this.isSupply = false;
                  this.poolShare = {
                    eth: 0,
                    erc20: 0,
                    pool: 0,
                  };
                  this.isEnterAmount = true;
                }
              }
              if (type === 2) {
                if (this.inputErc && Number(this.inputErc) > 0) {
                  this.inputEth = new BigNumber(this.inputErc)
                    .times(this.priceData.price)
                    .dp(18)
                    .toString();
                } else {
                  this.inputEth = 0;
                  this.isInsufficient = false;
                  this.isAddInfo = false;
                  this.isSupply = false;
                  this.poolShare = {
                    eth: 0,
                    erc20: 0,
                    pool: 0,
                  };
                  this.isEnterAmount = true;
                }
              }
              if (
                this.inputErc &&
                Number(this.inputErc) > 0 &&
                this.inputEth &&
                Number(this.inputEth) > 0
              ) {
                const a = new BigNumber(1)
                  .minus(new BigNumber(this.slipData.slip).div(100))
                  .toString();

                this.receiveData = {
                  isShow: true,
                  tokens: new BigNumber(this.inputEth)
                    .div(this.priceData.ethBalance)
                    .times(this.pairBalance)
                    .times(a)
                    .toString(),
                };
                this.poolShare = {
                  eth: new BigNumber(this.priceData.erc20Balance)
                    .div(this.priceData.ethBalance)
                    .toFixed(),
                  erc20: new BigNumber(this.priceData.price).toString(),
                  pool: new BigNumber(this.inputEth)
                    .div(
                      new BigNumber(this.inputEth).plus(
                        this.priceData.ethBalance
                      )
                    )
                    .times(100)
                    .toFixed(2, 1),
                };
                if (
                  Number(this.inputErc) <= Number(this.balance.erc20) &&
                  Number(this.inputEth) <= Number(this.balance.eth) - 0.01
                ) {
                  this.isInsufficient = false;
                  this.isEnterAmount = false;
                  this.isAddInfo = true;
                  this.isSupply = true;

                  if (this.MetaMaskAddress) {
                    const allowance = await getAllowance(
                      this.ERCToken.erc20Address,
                      this.MetaMaskAddress
                    );
                    this.allowance = new BigNumber(allowance)
                      .div(1e18)
                      .toNumber();
                    this.isAllowance = new BigNumber(this.allowance).lt(
                      this.inputErc
                    );
                  }
                } else {
                  this.isInsufficient = true;
                  this.isEnterAmount = false;
                  this.isAddInfo = true;
                  this.isSupply = false;
                }
              }
            } else {
              this.isAddInfo = false;
              this.isInsufficient = false;
              this.isSupply = false;
              this.isEnterAmount = true;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        }, 1000);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.box-input {
  width: 100%;
  margin-top: 24px;
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
    color: #bbbaba;
    font-size: 16px;
    margin: 0 12px;
  }
}
.swap-text {
  margin-top: 12px;
  .text-top {
    box-sizing: border-box;
    height: 66px;
    line-height: 66px;
    border: 1px solid #6062aa;
    border-radius: 2px;
    padding: 0 15px;
    font-size: 16px;
    color: #9e9e9e;
    span {
      float: right;
      color: #9e9e9e;
      font-size: 18px;
    }
  }
  // span {
  //   margin-bottom: 12px;
  //   color: #9e9e9e;
  //   font-size: 14px;
  // }
  .swap-info {
    background: #282f41;
    border: 1px solid #6062aa;
    box-sizing: border-box;
    padding: 16px;
    margin-top: 12px;
    h4 {
      color: #bbbaba;
      font-size: 18px;
      margin: 0;
      margin-bottom: 10px;
      font-family: Inter5;
    }
    .info-divs {
      display: flex;
      div {
        width: 33%;
        // display: flex;
        align-items: center;
        text-align: center;
      }
    }
    .divs-top {
      font-size: 20px;
      color: #9e9e9e;
      font-family: Roboto5;
      margin: 16px 0;
    }
    .divs-bom {
      color: #bbbaba;
      font-size: 14px;
      font-family: Inter4;
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
  background-color: #2e2555 !important;
  color: #9e9e9e;
  cursor: no-drop !important;
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
.input-text {
  h4 {
    color: #bbbaba;
    font-size: 18px;
    margin: 0;
    margin-bottom: 10px;
    font-family: Inter5;
  }
  p {
    margin: 0;
    color: #9e9e9e;
    font-size: 16px;
    font-family: Inter4;
  }
}
.add-rem {
  margin: 22px 0;
  font-size: 16px;
  color: #bbbaba;
  font-family: Inter5;
}
::v-deep .add-rem .el-switch__core {
  margin: 0 16px;
  background-color: #745cd4 !important;
  border: none;
}
::v-deep .add-rem .el-switch.is-checked .el-switch__core::after {
  margin-left: -18px;
}
::v-deep .add-rem .el-switch__core:after {
  top: 2px;
}
.disable-input {
  .swap-input {
    background-color: transparent;
  }
}
.flex-top {
  width: 100%;
  .swap-input {
    background-color: transparent;
  }
}
.receive {
  font-size: 16px;
  color: #9e9e9e;
  margin: 22px 0;
  font-family: Inter5;
}
.erc-type {
  cursor: pointer;
}

.liq-text {
  margin-top: 12px;
  span {
    margin-bottom: 12px;
    color: #9e9e9e;
    font-size: 14px;
  }
  .mag0 {
    margin: 0;
  }
}
.dialogLoading {
  height: 150px;
  text-align: center;
  p {
    font-size: 16px;
    color: #bbbaba;
    text-align: center;
    margin: 0;
    padding: 30px 0 40px 0;
  }
}
.liquidity-status {
  font-size: 16px;
  color: #ffa1a1;
  margin-top: 8px;
}
.pair-text {
  font-family: Roboto5;
  font-size: 20px;
  color: #c0c4cc;
  padding-left: 15px;
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
