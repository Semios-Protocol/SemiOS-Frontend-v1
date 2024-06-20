<template>
  <loading v-if="isLoading" />
  <div class="mak-box" v-else>
    <div class="box-card mgb20">
      <h4>
        {{ $t('nodeDetail.makerTitle') }}
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('nodeDetail.makerTip')"
          placement="top"
        >
          <span>
            <i class="el-icon-info" />
          </span>
        </el-tooltip>
      </h4>
      <el-divider></el-divider>
      <div class="my-row-box">
        <el-row
          v-for="(item, idx) in formData.ethTransTokenList"
          :key="item.daoName"
        >
          <el-col :span="8"
            ><span
              class="title-name"
              :class="idx === 0 ? 'noColor' : ''"
              @click="goDaoDetail(item)"
              >{{ item.daoName }}</span
            ></el-col
          >
          <el-col :span="8"
            ><span class="title-none">Wallet</span
            ><el-input
              v-model="item.walletRatio"
              oninput="if(isNaN(value)||Number(value)<0||!value) { value = 0 }if(Number(value)>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              size="mini"
              @input="changeInputETH(item, 'walletRatio')"
            >
              <span slot="suffix">%</span>
            </el-input></el-col
          >
          <el-col :span="8"
            ><span class="title-none">Treasury</span
            ><el-input
              v-model="item.treasuryOrPoolRatio"
              oninput="if(isNaN(value)||Number(value)<0||!value) { value = 0 }if(Number(value)>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              size="mini"
              @input="changeInputETH(item, 'treasuryOrPoolRatio')"
            >
              <span slot="suffix">%</span>
            </el-input></el-col
          >
        </el-row>
      </div>

      <el-divider></el-divider>
      <el-button
        type="primary"
        class="el-dao-btnz"
        style="margin: 0 auto; display: block"
        @click="submitFormEth"
        v-preventReClick
        >Submit</el-button
      >
    </div>
    <div class="box-card">
      <h4>
        {{ $t('nodeDetail.makerTitleTwo') }}
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('nodeDetail.makerTwoTip')"
          placement="top"
        >
          <span>
            <i class="el-icon-info" />
          </span>
        </el-tooltip>
      </h4>
      <el-divider></el-divider>
      <div class="my-row-box">
        <el-row
          v-for="(item, idx) in formData.tokenTransEthList"
          :key="item.daoName"
        >
          <el-col :span="8"
            ><span
              class="title-name"
              :class="idx === 0 ? 'noColor' : ''"
              @click="goDaoDetail(item)"
              >{{ item.daoName }}</span
            ></el-col
          >
          <el-col :span="8"
            ><span class="title-none">Wallet</span
            ><el-input
              v-model="item.walletRatio"
              oninput="if(isNaN(value)||Number(value)<0||!value) { value = 0 }if(Number(value)>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              size="mini"
              @input="changeInputToken(item, 'walletRatio')"
            >
              <span slot="suffix">%</span>
            </el-input></el-col
          >
          <el-col :span="8"
            ><span class="title-none">Redeem Asset Pool</span
            ><el-input
              v-model="item.treasuryOrPoolRatio"
              oninput="if(isNaN(value)||Number(value)<0||!value) { value = 0 }if(Number(value)>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              @input="changeInputToken(item, 'treasuryOrPoolRatio')"
              size="mini"
            >
              <span slot="suffix">%</span>
            </el-input></el-col
          >
        </el-row>
      </div>
      <el-divider></el-divider>
      <el-button
        type="primary"
        class="el-dao-btnz"
        style="margin: 0 auto; display: block"
        @click="submitFormERC20"
        v-preventReClick
        >Submit</el-button
      >
    </div>
    <el-dialog
      title="Edit"
      :visible.sync="dialogLoading"
      :center="true"
      width="412px"
      top="20vh"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialogLoading">
        <div class="dialog-loading">
          <loading />
        </div>
        <p class="dialog-text">
          {{ $t('nodeDetail.makerDialog') }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loading from '@/components/Loading.vue'
import { togetherDaoMakerList } from '@/common/api'
import {
  setTopUpOutputSplitRatio,
  setTopUpInputSplitRatio,
} from '@/common/walletService/services'
import BigNumber from 'bignumber.js'
export default {
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: true,
      formData: {
        ethTransTokenList: [],
        tokenTransEthList: [],
      },
      dialogLoading: false,
      ownerAddress: '',
    }
  },
  props: {
    mainDaoId: {
      typeof: Number,
    },
  },
  computed: {
    ...mapState(['User']),
  },
  created() {
    this.getData()
  },
  methods: {
    goDaoDetail(item) {
      if (!item.daoId) return
      this.$router.push({
        path: '/dao',
        query: {
          type: 'nfts',
          id: item.daoId,
        },
      })
    },
    changeInputETH(item, type) {
      // if (isNaN(item[type]) || item[type] === '') {
      //   item[type] = 0
      // } else {
      //   item[type] = new BigNumber(item[type]).toString()
      // }
      if (type === 'walletRatio') {
        item.treasuryOrPoolRatio = new BigNumber(100)
          .minus(item[type])
          .toString()
      } else {
        item.walletRatio = new BigNumber(100).minus(item[type]).toString()
      }
    },
    changeInputToken(item, type) {
      if (type === 'walletRatio') {
        item.treasuryOrPoolRatio = new BigNumber(100)
          .minus(item[type])
          .toString()
      } else {
        item.walletRatio = new BigNumber(100).minus(item[type]).toString()
      }
    },
    async getData() {
      try {
        const res = await togetherDaoMakerList({
          daoId: this.$route.query.id,
        })
        this.ownerAddress = res.data.ownerAddress
        this.formData.ethTransTokenList = [
          {
            daoName: 'Default Ratio',
            daoId: null,
            walletRatio: res.data.ethTransTokenWalletRatioDefault,
            treasuryOrPoolRatio: res.data.ethTransTokenTreasuryRatioDefault,
            projectId: res.data.projectId,
          },
          ...res.data.ethTransTokenList,
        ]
        this.formData.tokenTransEthList = [
          {
            daoName: 'Default Ratio',
            daoId: null,
            walletRatio: res.data.tokenTransEthWalletRatioDefault,
            treasuryOrPoolRatio: res.data.tokenTransEthRedeemRatioDefault,
            projectId: res.data.projectId,
          },
          ...res.data.tokenTransEthList,
        ]

        console.log(res, 'res')
      } catch (error) {
        console.log(error, 'error')
      }
      this.isLoading = false
    },
    async submitFormERC20() {
      if (this.User.address) {
        if (this.User.address.toLowerCase() !== this.ownerAddress.toLowerCase())
          return this.errNotif(
            'You don’t have permission to edit this parameter.'
          )
        this.dialogLoading = true
        try {
          const defaulData = this.formData.tokenTransEthList[0]
          const subDaoIds = this.formData.tokenTransEthList
            .filter((item) => item.daoId !== null)
            .map((item) => item.projectId)
          const ethRatios = this.formData.tokenTransEthList
            .filter((item) => item.daoId !== null)
            .map((item) =>
              new BigNumber(item.treasuryOrPoolRatio).times(100).toString()
            )
          const req = {
            daoId: defaulData.projectId,
            defaultInputRatio: new BigNumber(defaulData.treasuryOrPoolRatio)
              .times(100)
              .toString(),
            subDaoIds: subDaoIds,
            inputRatios: ethRatios,
          }
          console.log(req, 'req')
          const tx = await setTopUpInputSplitRatio(req)

          const res = await tx.wait()
          this.dialogLoading = false
          this.senMsg(res)
        } catch (error) {
          console.log(error, 'error')
          const err = JSON.stringify(error)
          console.log(err, ' this.errMsgText')
          this.dialogLoading = false
          this.errMsg(err)
        }
      } else {
        this.loginWallet()
      }
    },
    async submitFormEth() {
      if (this.User.address) {
        if (this.User.address.toLowerCase() !== this.ownerAddress.toLowerCase())
          return this.errNotif(
            'You don’t have permission to edit this parameter.'
          )
        this.dialogLoading = true
        try {
          const defaulData = this.formData.ethTransTokenList[0]
          const subDaoIds = this.formData.ethTransTokenList
            .filter((item) => item.daoId !== null)
            .map((item) => item.projectId)
          const erc20Ratios = this.formData.ethTransTokenList
            .filter((item) => item.daoId !== null)
            .map((item) =>
              new BigNumber(item.treasuryOrPoolRatio).times(100).toString()
            )
          const req = {
            daoId: defaulData.projectId,
            defaultOutputRatio: new BigNumber(defaulData.treasuryOrPoolRatio)
              .times(100)
              .toString(),
            subDaoIds: subDaoIds,
            outputRatios: erc20Ratios,
          }
          console.log(req, 'req')
          const tx = await setTopUpOutputSplitRatio(req)

          const res = await tx.wait()
          this.dialogLoading = false
          this.senMsg(res)
        } catch (error) {
          console.log(error, 'error')
          const err = JSON.stringify(error)
          console.log(err, ' this.errMsgText')
          this.dialogLoading = false
          this.errMsg(err)
        }
      } else {
        this.loginWallet()
      }
    },
  },
}
</script>
<style scoped lang="scss">
.mak-box {
  width: 100%;
  color: #bbbaba;

  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.2px;
}
.box-card {
  width: 100%;
  border: 1px solid #6062aa;
  padding: 24px;
  box-sizing: border-box;
  .el-row {
    margin-bottom: 24px;
  }
  ::v-deep .el-divider {
    background-color: #6062aa;
  }
  ::v-deep .el-input {
    width: 84px;
  }
  ::v-deep .el-input__suffix {
    display: flex;
    align-items: center;
  }
  ::v-deep .el-row {
    display: flex;
  }
  h4 {
    font-size: 20px;
    color: #bbbaba;
    font-weight: 500;

    margin: 0;
  }
}
.mgb20 {
  margin-bottom: 20px;
}
.title-df {
  font-size: 14px;
  color: #fff;
  font-weight: 400;
  font-family: Roboto;
}
.title-name {
  font-size: 14px;
  color: #25b0c2;
  font-weight: 400;
  font-family: Inter;
  cursor: pointer;
}
.title-none {
  font-size: 14px;
  color: #9e9e9e;
  font-weight: 420;
  font-family: Roboto;
  margin-right: 24px;
}
.my-row-box {
  height: 231px;
  overflow-y: auto;
}
.noColor {
  color: #fff;
  cursor: auto;
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
</style>
