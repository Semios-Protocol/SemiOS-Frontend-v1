<template>
  <div class="box-body">
    <div class="body-title">{{ $t('walletDetail.walletTitle') }}</div>
    <div class="wallet-title">
      <div class="title-body">
        <div class="ttop">
          <span class="many">
            <svg-icon icon-class="many" /> {{ $t('walletDetail.walletTitle') }}
          </span>
          <span class="ttleft">
            <span @click="copy(User.address)" class="copy">
              <svg-icon icon-class="copyhash1" />
            </span>
            {{ User.address | ellipsis }}
          </span>
        </div>
        <el-divider></el-divider>
        <div class="eth">
          <div class="tbom">
            <span> ETH </span>
            <span class="tbright">{{ Balance | ethFilter(4) }}</span>
          </div>
          <el-divider></el-divider>
        </div>
      </div>
    </div>
    <div class="wallet-details">
      <!-- 123 -->

      <table-loading v-if="tableLoading" />
      <div class="details-body" v-else>
        <div class="ttop">
          <span class="many"> <svg-icon icon-class="income" /> Income </span>
          <span class="drbtns">
            <span @click="setCollect(1)"
              ><svg-icon icon-class="collect" /> Collect All</span
            >
          </span>
        </div>
        <el-divider></el-divider>
        <div v-if="daoIncomeList.length > 0">
          <div
            class="erc-list"
            v-for="item in daoIncomeList"
            :key="item.daoNumber"
          >
            <div class="daonames">
              <span><svg-icon icon-class="Hd" /> {{ item.daoName }}</span>
              <span> {{ item.daoSymbol }}</span>
            </div>
            <div class="item_type">
              <span class="type_name"
                ><svg-icon icon-class="mint" />
                {{ $t('walletDetail.ethEarningLabel') }}
              </span>
              <div class="type_item">
                {{ item.mintReward | ethFilter(4) }}
                <TokenIcon
                  size="12px"
                  :payCurrencyType="item.payCurrencyType"
                  :inputTokenAddress="item.inputTokenAddress"
                />
              </div>
            </div>
            <div class="item_type">
              <span class="type_name"
                ><svg-icon icon-class="mint" />
                {{ $t('walletDetail.tokenEarningLabel') }}
              </span>
              <div class="type_item">
                {{ item.mintRewardToken | ethFilter(4) }}
                <TokenIcon
                  size="12px"
                  :daoToken="true"
                  :daoSymbol="item.daoSymbol"
                  :daoErc20Address="item.daoErc20Address"
                />
              </div>
            </div>
            <div class="item_conceal" v-if="item.indexArr.indexOf(1) > -1">
              <div
                class="conceal_item"
                v-for="itemData in item.mintRewardList"
                :key="itemData.canvasNumber"
              >
                <span class="cleft">{{ itemData.canvasName }}</span>
                <span class="cright"
                  >{{ itemData.ethAmount | ethFilter(4) }}
                  <TokenIcon
                    size="12px"
                    :payCurrencyType="item.payCurrencyType"
                    :inputTokenAddress="item.inputTokenAddress"
                  />
                </span>
              </div>
            </div>
            <div class="item_type">
              <span class="type_name"
                ><svg-icon icon-class="erc203" />
                {{ $t('walletDetail.erc20CollectableLabel') }}
              </span>
              <div class="type_item">
                <span>
                  <span class="sp3">{{
                    item.erc20Collectable | balanceFilter(2)
                  }}</span>
                </span>
              </div>
            </div>
            <div class="item_type magtb2">
              <span class="type_name nocursor"
                ><svg-icon icon-class="erc204" />
                {{ $t('walletDetail.ethCollectableLabel') }}
              </span>
              <div class="type_item">
                <span>
                  <span class="sp3"
                    >{{ item.ethCollectable }}
                    <TokenIcon
                      size="12px"
                      :payCurrencyType="item.payCurrencyType"
                      :inputTokenAddress="item.inputTokenAddress"
                  /></span>
                </span>
              </div>
            </div>
            <div class="item_type magtb2">
              <span class="type_name nocursor"
                ><svg-icon icon-class="erc204" />
                {{ $t('walletDetail.erc20Collectedlabel') }}
              </span>
              <div class="type_item">
                <span>
                  <span class="sp3">{{
                    item.erc20Collected | balanceFilter(2)
                  }}</span>
                </span>
              </div>
            </div>
            <div class="item_type magtb2">
              <span class="type_name nocursor"
                ><svg-icon icon-class="erc204" />
                {{ $t('walletDetail.ethCollectedLabel') }}
              </span>
              <div class="type_item">
                <span>
                  <span class="sp3"
                    >{{ item.ethCollected }}
                    <TokenIcon
                      size="12px"
                      :payCurrencyType="item.payCurrencyType"
                      :inputTokenAddress="item.inputTokenAddress"
                  /></span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="noData" v-else>No income yet</div>
        <el-divider></el-divider>
      </div>
    </div>

    <el-dialog
      :title="this.collectType === 1 ? 'Collect All' : 'Collect'"
      :visible.sync="collectDialog"
      width="412px"
      :before-close="collectClose"
    >
      <div class="collect_box">
        <p>
          {{
            !isLoading
              ? 'Confirm to collect all tokens'
              : 'Please continue in the wallet...'
          }}
        </p>
        <div class="collect_btns" v-if="!isLoading">
          <button class="elbtns-b" @click="collectClose">Cancel</button>
          <button
            class="elbtns-l"
            style="margin-left: 20px"
            @click="confirmSet()"
          >
            Confirm
          </button>
        </div>
        <div class="collect_btns" v-else>
          <loading />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copys } from '@/utils'
import { mapState } from 'vuex'
import { walletReceived, walletDao } from '@/common/api'
import TableLoading from '@/components/TableLoading.vue'
import { claimMultiReward } from '@/common/walletService/services'
import Vue from 'vue'
import Loading from '@/components/Loading.vue'
import { localName } from '@/config.js'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: { TableLoading, Loading, TokenIcon },
  computed: {
    ...mapState(['Balance', 'User', 'ABI']),
  },
  data() {
    return {
      collectDialog: false,
      isLoading: false,
      atList: [],
      daoIncomeList: [],
      projectIdList: [],
      canvasIdList: [],
      collectObj: {},
      collectType: 1,
      tableLoading: true,
      ProtoDAOConnectedWallets: {},
      daoCollect: {},
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    const ProtoDAOConnectedWallets = JSON.parse(
      window.localStorage.getItem(localName)
    )
    this.ProtoDAOConnectedWallets =
      ProtoDAOConnectedWallets && ProtoDAOConnectedWallets.length > 0
        ? ProtoDAOConnectedWallets[0]
        : {}
  },
  methods: {
    goOpenUrl(item) {
      return `/dex?type=swap&tab=priceTab&address=${item.erc20Address}`
    },
    setMetamaskToken(val) {
      Vue.prototype.$wallets[0].provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: val.erc20Address,
              symbol: val.erc20Number,
              decimals: 18,
              image: '',
            },
          },
        })
        .then((success) => {
          if (success) {
            console.log('FOO successfully added to wallet!')
          } else {
            new Error('Something went wrong.')
          }
        })
        .catch(console.error)
    },
    async getData() {
      try {
        this.tableLoading = true
        const res = await walletReceived()
        this.atList = res.dataList
        const dao = await walletDao()
        this.daoIncomeList = dao.data.daoIncomeVos.map((item) => {
          return {
            ...item,
            indexArr: [],
          }
        })
        this.projectIdList = dao.data.projectIdList
        this.canvasIdList = dao.data.canvasIdList
        this.daoCollect = dao.data
        this.tableLoading = false
      } catch (error) {
        this.tableLoading = false
      }
    },

    setCollect(type, obj = {}) {
      this.collectType = type
      if (type === 1) {
        this.collectObj = {}
        this.collectDialog = true
      } else {
        if (obj.canvasIds.length > 0 || obj.projectIds.length > 0) {
          this.collectObj = obj
          this.isLoading = true
          this.collectDialog = true
          this.confirmSet(obj.daoVersion)
        } else {
          this.errNotif('No collectable ERC20')
        }
      }
    },
    async confirmSet(version = null) {
      let struct = []
      if (this.collectType === 1) {
        if (
          this.daoCollect.canvasId2List.length > 0 ||
          this.daoCollect.projectId2List.length > 0
        ) {
          struct.push({
            protocol: this.ABI.protocol_contract,
            canvasIds: this.daoCollect.canvasId2List,
            daoIds: this.daoCollect.projectId2List,
          })
        }
        if (
          this.daoCollect.canvasIdList.length > 0 ||
          this.daoCollect.projectIdList.length > 0
        ) {
          struct.push({
            protocol: this.ABI.protocol_contract,
            canvasIds: this.daoCollect.canvasIdList,
            daoIds: this.daoCollect.projectIdList,
          })
        }
      } else {
        if (
          this.collectObj.canvasIds.length > 0 ||
          this.collectObj.projectIds.length > 0
        ) {
          struct.push({
            protocol:
              version > 2
                ? this.ABI.protocol_contract_v2
                : this.ABI.protocol_contract,
            canvasIds: this.collectObj.canvasIds,
            daoIds: this.collectObj.projectIds,
          })
        }
      }
      if (struct.length > 0) {
        if (struct[0].canvasIds.length > 0 || struct[0].daoIds.length > 0) {
          this.isLoading = true
          try {
            const tx = await claimMultiReward(struct)
            const res = await tx.wait()
            this.senMsg(res, 'collect')
            if (res.status || res.logs.length > 0) {
              this.getData()
            }
            this.collectDialog = false
            this.isLoading = false
          } catch (error) {
            console.log(error, 'error')
            const err = error.toString()
            this.errMsg(err)
            this.isLoading = false
            this.collectDialog = false
          }
        }
      } else {
        this.collectDialog = false
        this.isLoading = false
        this.collectObj = {}
        this.errNotif('No collectable ERC20')
      }
    },
    collectClose() {
      this.isLoading = false
      this.collectDialog = false
    },
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
  },
}
</script>
<style scoped lang="scss">
.aopen {
  text-decoration: none;
  color: #745cd4;
}

.aopen:hover {
  color: #746de4;
}

.box-body {
  margin-bottom: 38px;
}

.body-box {
  width: 960px;
  margin: 0 auto;
  font-family: Roboto4;
  margin-top: 80px;
}

.body-title {
  height: 80px;
  border-bottom: 1px solid #6062aa;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  color: #bbbaba;
}

.wallet-title {
  width: 860px;
  // height: 136px;
  border: 1px solid #6062aa;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wallet-table {
  width: 860px;
  border: 1px solid #6062aa;
  margin: 0 auto;
  margin-bottom: 180px;
}

.title-body {
  width: 100%;
  padding: 0 80px;
  box-sizing: border-box;

  ::v-deep .el-divider--horizontal {
    background-color: #6062aa;
    margin: 8px 0;
  }
}

.ttop {
  height: 38px;
  width: 100%;
  line-height: 46px;
  font-size: 14px;
  color: #9e9e9e;
  display: flex;

  .ttleft {
    font-size: 12px;
    color: #745cd4;
    display: block;
    margin-left: auto;
  }
}
.eth {
  margin-left: 26px;
}
.tbom {
  height: 38px;
  width: 100%;
  line-height: 46px;
  font-size: 14px;
  color: #757575;
  font-weight: 600;
  display: flex;

  .tbright {
    display: block;
    margin-left: auto;
  }
}

.copy {
  font-size: 12px;
  cursor: pointer;

  .svg-icon {
    font-size: 12px;
  }
}

.erc_item {
  height: 60px;
  display: flex;
  padding-top: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #757575;

  .ercright {
    margin-left: auto;

    .blanceswap {
      font-size: 14px;
      color: #757575;
      font-weight: 600;
      margin-left: 12px;
    }

    p {
      margin-top: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #757575;
      text-align: end;
    }
  }
}

.wallet-details {
  width: 860px;
  border: 1px solid #6062aa;
  margin: 0 auto;
}

.details-body {
  width: 100%;
  margin: 0 auto;
  padding: 0 80px 16px 80px;
  box-sizing: border-box;

  ::v-deep .el-divider--horizontal {
    background-color: #6062aa;
    margin: 8px 0;
  }
}

.drbtns {
  color: #745cd4;
  font-weight: 600;
  margin-left: auto;

  span {
    cursor: pointer;
  }

  span:hover {
    color: #746de4;
  }

  .btnsri {
    margin-left: 24px;
  }
}

.erc-list {
  padding-top: 4px;

  .daonames {
    margin-left: 16px;
    font-size: 14px;
    color: #757575;
    margin-bottom: 26px;

    .svg-icon {
      font-size: 14px;
    }

    span {
      margin-right: 22px;
    }
  }
}

.item_type {
  display: flex;
  font-size: 12px;
  color: #757575;
  height: 38px;

  .type_name {
    margin-left: 34px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 12px;
  }

  .type_item {
    margin-left: auto;
    font-weight: 600;

    // display: flex;
    // flex-direction: column;
    p {
      margin: 4px 0;
      font-weight: 400;
      color: #757575;
      text-align: end;
    }

    .sp1,
    .sp2 {
      color: #745cd4;
      cursor: pointer;
    }

    .sp1:hover {
      color: #533fa1;
    }

    .sp2:hover {
      color: #533fa1;
    }

    .sp2 {
      margin: 0 14px;
    }
  }
}

.item_conceal {
  .conceal_item {
    display: flex;
    margin-left: 50px;
    font-size: 12px;
    color: #757575;
    margin-bottom: 24px;

    .cright {
      margin-left: auto;
    }
  }
}

.nocursor {
  cursor: auto !important;
}

.magtb {
  margin-top: 16px;
  // margin-bottom: 6px;
}

.magtb2 {
  margin-top: 8px;
}

.magbom {
  margin-bottom: 6px;
}

.swapdia {
  .swap_title {
    display: flex;
    margin: 0;
    color: #757575;
    font-size: 14px;

    span {
      margin-left: auto;
      font-size: 12px;
      color: #757575;
    }
  }

  .swap_text {
    font-size: 12px;
    color: #757575;
    margin: 0;
    margin-top: 4px;
  }
}

.swap_input {
  height: 40px;
  border: 1px solid #6062aa;
  border-radius: 2px;
  margin-top: 4px;
  display: flex;
  align-items: center;

  button {
    width: 50px;
    height: 24px;
    border: 1px solid #745cd4;
    border-radius: 2px;
    font-size: 12px;
    color: #745cd4;
    background-color: #fff;
    margin-right: 10px;
  }

  button:hover {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  }

  ::v-deep .el-input__inner {
    border: none;
  }
}

.icon_swap {
  text-align: center;
  margin: 20px 0;

  .svg-icon {
    font-size: 24px;
  }
}

.swap_num {
  border: 1px solid #6062aa;
  border-radius: 2px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 32px;

  p {
    width: 100%;
    display: flex;
    color: #757575;
    margin: 0;
    padding-left: 15px;
    font-size: 14px;
    line-height: 40px;

    span {
      margin-left: auto;
      color: #757575;
      font-size: 16px;
      margin-right: 10px;
    }
  }
}

.collect_box {
  p {
    margin: 0;
    font-size: 16px;
    color: #757575;
    text-align: center;
  }

  .collect_btns {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    .flexbox {
      height: 120px;
    }
  }
}

.bombtns {
  margin-left: 34px;
  margin-bottom: 22px;
}

.btnspanto {
  font-size: 14px;
  color: #745cd4;
  cursor: pointer;
}

.disableBtn {
  background-color: #a8dfe7 !important;
  cursor: no-drop;
}

.noData {
  font-size: 14px;
  color: #757575;
  height: 240px;
  line-height: 240px;
  text-align: center;
  margin: 0 auto;
}
</style>
