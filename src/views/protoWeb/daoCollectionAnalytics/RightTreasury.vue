<template>
  <loading v-if="isLoading" />
  <div class="tre-box" v-else>
    <p class="tre-title">
      {{ $t('nodeDetail.treasuryAddressLabel') }}
      <el-tooltip
        class="item"
        effect="dark"
        :content="initData.treasuryAddress"
        placement="top"
      >
        <span
          class="cen-lan"
          @click="openHash(initData.treasuryAddress, 'address')"
        >
          <span>{{ initData.treasuryAddress | ellipsis }}</span>
        </span>
      </el-tooltip>
      <span class="copy" @click="copy(initData.treasuryAddress)">
        <svg-icon icon-class="copyhash1" />
      </span>
    </p>

    <p class="tre-title">
      {{ $t('nodeDetail.erc20ContractAddressLabel') }}
      <el-tooltip
        class="item"
        effect="dark"
        :content="initData.erc20Address"
        placement="top"
      >
        <span
          class="cen-lan"
          @click="openHash(initData.erc20Address, 'address')"
        >
          <span>{{ initData.erc20Address | ellipsis }}</span>
        </span>
      </el-tooltip>
      <span class="copy" @click="copy(initData.erc20Address)">
        <svg-icon icon-class="copyhash1" />
      </span>
    </p>
    <div class="box-card mgb20">
      <h4>{{ $t('nodeDetail.treasuryDepositLabel') }}</h4>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-input
            v-model="formData.erc20Amount"
            oninput="if(isNaN(value)||Number(value)<0||!value) { value = 0 }if(Number(value)>1000000000) { value = 1000000000 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          >
          </el-input
        ></el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="setGrantTreasury"
            v-preventReClick
            >Pay</el-button
          ></el-col
        >
      </el-row>
    </div>

    <div class="box-card mgb20">
      <h4>{{ $t('nodeDetail.erc20AllocationToSubNodesLabel') }}</h4>
      <el-divider></el-divider>
      <el-form
        ref="ruleFormWorks"
        :model="formData"
        label-position="right"
        label-width="184px"
      >
        <el-form-item>
          <template slot="label">
            <span>Select Nodes : </span>
          </template>
          <el-select
            v-model="formData.daoId"
            filterable
            no-data-text="No Nodes can be selected."
            placeholder="Please select Nodes."
          >
            <el-option
              v-for="item in treasuryDataList"
              :key="item.daoId"
              :label="item.daoName"
              :value="item.projectId"
            >
              <span style="float: left"
                >{{ item.daoName }}

                <!-- <span class="suspend" v-show="item.daoStatus === 4">
                    <i class="el-icon-warning-outline"></i>
                    Suspend</span
                  > -->
              </span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px"
                  >D4A@{{ item.daoNumber }}</span
                > -->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span>{{ $t('nodeDetail.erc20AllocationLabel') }} : </span>
          </template>
          <div class="inputw">
            <el-input
              v-model="formData.itemErc20Amount"
              oninput="if(isNaN(value)||Number(value)<0||!value) { value = 0 }if(Number(value)>1000000000) { value = 1000000000 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            >
            </el-input>
            <el-button
              type="primary"
              class="el-dao-btnz"
              style="margin-left: 20px"
              @click="setUserGrantDaoAssetPool"
              v-preventReClick
              >Pay</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="box-card mgb20">
      <TransactionsTable
        :address="'0x27b2d8aa30a70c3f125af78ca22fa30157cc9aeb'"
      />
    </div>

    <el-dialog
      title="Loading!"
      :visible.sync="appLoading"
      :close-on-click-modal="false"
      :show-close="false"
      width="426px"
    >
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">{{ $t('nodeDetail.loadingText') }}</p>
    </el-dialog>

    <el-dialog
      :title="$t('nodeDetail.sourceOfAllocationLabel')"
      :visible.sync="sourceLoading"
      :close-on-click-modal="false"
      width="426px"
      :before-close="handleClose"
    >
      <p class="dialog-text">
        {{ $t('nodeDetail.sourceOfAllocationText') }}
      </p>
      <div class="dialog_box">
        <el-button
          type="primary"
          @click="setUserTreasury(true)"
          v-preventReClick
          >Treasury</el-button
        >
        <el-button
          type="primary"
          class="btn-two"
          style="width: 100%; margin-right: 18px; border-radius: 2px"
          @click="setUserTreasury(false)"
          v-preventReClick
          >My Wallet</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copys } from '@/utils'
import TransactionsTable from './TreasuryTransactionsTable.vue'
import { mapState } from 'vuex'
import { treasuryInfo, treasuryList } from '@/common/api'
import { BigNumber } from 'bignumber.js'
import Loading from '@/components/Loading.vue'
import {
  approveWork,
  getAllowanceTreasury,
  decimals,
  grantTreasury,
  grantDaoAssetPool,
} from '@/common/walletService/services'

export default {
  components: {
    TransactionsTable,
    Loading,
  },
  data() {
    return {
      isLoading: true,
      appLoading: false,
      formData: {
        itemErc20Amount: 0,
        erc20Amount: 0,
        daoId: null,
      },
      initData: {
        treasuryAddress: null,
        erc20Address: null,
        projectId: null,
        ownerAddress: null,
      },
      treasuryDataList: [],
      loadingText: '',
      sourceLoading: false,
      useTreasury: false,
    }
  },
  computed: {
    ...mapState(['User']),
  },
  created() {
    this.getData()
  },
  methods: {
    handleClose() {
      this.sourceLoading = false
    },
    async getData() {
      try {
        const infoRes = await treasuryInfo({ daoId: this.$route.query.id })
        console.log(infoRes, infoRes)
        this.initData = infoRes.data
        const dataList = await treasuryList({
          daoId: this.$route.query.id,
          pageSize: -1,
        })
        this.treasuryDataList = await dataList.dataList
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
    async setApprove(amount) {
      try {
        this.appLoading = true
        const app = await approveWork(this.initData.erc20Address, amount)
        await app.wait()
        this.successNotif('Successful transaction')
        this.appLoading = false
      } catch (error) {
        this.errMsg(JSON.stringify(error))
        this.appLoading = false
      }
    },
    setUserGrantDaoAssetPool() {
      if (this.User.address) {
        if (
          this.User.address.toLowerCase() ===
            this.initData.ownerAddress.toLowerCase() &&
          this.formData.daoId &&
          Number(this.formData.itemErc20Amount) > 0
        ) {
          this.sourceLoading = true
        } else {
          this.setGrantDaoAssetPool(false)
        }
      } else {
        this.loginWallet()
      }
    },
    setUserTreasury(type) {
      this.sourceLoading = false
      this.setGrantDaoAssetPool(type)
    },
    async setGrantDaoAssetPool(type) {
      if (this.formData.daoId && Number(this.formData.itemErc20Amount) > 0) {
        this.appLoading = true
        try {
          BigNumber.config({ EXPONENTIAL_AT: 38 })
          const decimalsNum = await decimals(this.initData.erc20Address)
          const num = new BigNumber(this.formData.itemErc20Amount)
            .times(`1e${decimalsNum}`)
            .toString()
          if (!type) {
            const allowance = await getAllowanceTreasury(
              this.initData.erc20Address,
              this.MetaMaskAddress
            )
            console.log(allowance, 'allowanceallowance')
            const appNum = new BigNumber(num).minus(allowance).toNumber()
            if (appNum > 0) {
              this.setApprove(num)
              return
            }
          }
          const req = {
            daoId: this.formData.daoId,
            amount: num,
            useTreasury: type,
            tokenUri: 'grant asset pool nft',
            address: this.initData.erc20Address,
          }
          console.log(req, 'req')
          const tx = await grantDaoAssetPool(req)
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
      }
    },
    async setGrantTreasury() {
      console.log('123123123123123')
      if (this.User.address) {
        if (Number(this.formData.erc20Amount) > 0) {
          this.appLoading = true
          try {
            BigNumber.config({ EXPONENTIAL_AT: 38 })
            const decimalsNum = await decimals(this.initData.erc20Address)
            const num = new BigNumber(this.formData.erc20Amount)
              .times(`1e${decimalsNum}`)
              .toString()
            const allowance = await getAllowanceTreasury(
              this.initData.erc20Address,
              this.MetaMaskAddress
            )
            const appNum = new BigNumber(num).minus(allowance).toNumber()
            if (appNum > 0) {
              this.setApprove(num)
              return
            }
            const req = {
              daoId: this.initData.projectId,
              amount: num,
              tokenUri: 'grant treasury nft',
              address: this.initData.erc20Address,
            }
            const tx = await grantTreasury(req)
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
        }
      } else {
        this.loginWallet()
      }
    },
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
  },
}
</script>
<style scoped lang="scss">
.tre-box {
  width: 100%;
  color: #bbbaba;

  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.2px;
  ::v-deep .el-select {
    width: 50%;
  }
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
.cen-lan {
  color: #25b0c2;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
}
.copy {
  margin-left: 12px;
  font-size: 12px;
  cursor: pointer;
}
.tre-title {
  font-size: 14px;
  color: #9e9e9e;
  font-weight: 500;
}
.inputw {
  ::v-deep .el-input {
    width: 50%;
  }
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.dialog_box {
  display: flex;
  flex-direction: column;
  .el-button {
    margin: 0;
    margin-bottom: 12px;
    border-radius: 2px;
    border: none;
    text-align: center;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    height: 44px !important;
  }
}
</style>
