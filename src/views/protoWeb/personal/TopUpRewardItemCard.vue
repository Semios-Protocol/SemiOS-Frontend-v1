<template>
  <div class="top-body">
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <div class="top-card" v-if="list.length > 0">
        <div class="card-item" v-for="item in list" :key="item.projectId + 'a'">
          <div class="item-title">
            <div class="title-left"><img :src="item.daoLogoUrl" alt="" /></div>
            <div class="title-cen">
              <h4>
                {{ item.daoName }}
              </h4>
              <p>{{ item.daoDescription }}</p>
            </div>
            <div class="title-right">
              <el-button type="primary" @click="collectNft(item)"
                >Collect</el-button
              >
            </div>
          </div>
          <!-- <el-row class="centext">
            <el-col :span="11">
              <p>
                {{ item.totalCollected | bigNumFormat(5, 0.00001) }}
                <TokenIcon
                  size="20px"
                  :daoToken="true"
                  :daoSymbol="item.daoSymbol"
                  :daoErc20Address="item.daoErc20Address"
                />
              </p>
              <span>{{
                $t('topUpBalance.totalCollectedRewardLabel')
              }}</span></el-col
            >
            <el-col :span="2">
              <el-divider direction="vertical"></el-divider
            ></el-col>
            <el-col :span="11">
              <p>
                {{ item.totalCollectable | bigNumFormat(5, 0.00001) }}
                <TokenIcon
                  size="20px"
                  :daoToken="true"
                  :daoSymbol="item.daoSymbol"
                  :daoErc20Address="item.daoErc20Address"
                />
              </p>
              <span>{{
                $t('topUpBalance.totalCollectableRewardLabel')
              }}</span></el-col
            >
          </el-row> -->
          <div class="right-bom">
            <TopUpRewardItemTable
              :isLoading="item.isLoading"
              :list="item.rewardDetailList"
              :dataObj="item"
            />
          </div>
        </div>
      </div>
      <div v-else class="noData">No items to display</div>
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
      <p class="dialog-text">
        {{ $t('topUpBalance.dialogLoading') }}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import {
  topupBalanceReward,
  topupNft,
  topupBalanceRewardDetail,
} from '@/common/api'
import Loading from '@/components/Loading.vue'
import TopUpRewardItemTable from './TopUpRewardItemTable.vue'
import { mapState } from 'vuex'

import { claimDaoPlanRewardForMultiNft } from '@/common/walletService/services'
export default {
  components: { Loading, TopUpRewardItemTable },
  data() {
    return {
      isLoading: true,
      list: [],
      appLoading: false,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  created() {
    this.getData()
  },
  methods: {
    async collectNft(item) {
      if (item.totalCollectable === 0)
        return this.errNotif('No Collectable Reward.')
      if (this.User.address) {
        this.appLoading = true
        try {
          const nfts = await topupNft({ projectId: item.projectId })
          const nftIdentifierfts = nfts.dataList.map((item) => {
            return {
              erc721Address: item.erc721Token,
              tokenId: item.workNumber,
            }
          })
          const tx = await claimDaoPlanRewardForMultiNft({
            projectId: item.projectId,
            nfts: nftIdentifierfts,
          })
          const res = await tx.wait()
          this.getData()
          this.appLoading = false
          this.senMsg(res, 'Transury')
        } catch (error) {
          console.log(error, 'error')
          this.appLoading = false
          const err = JSON.stringify(error)
          this.errMsg(err)
        }
      } else {
        this.loginWallet()
      }
    },

    async getItemDetail(item) {
      const res = await topupBalanceRewardDetail({ projectId: item.projectId })
      item.rewardDetailList = res.dataList
      item.isLoading = false
    },
    async getData() {
      try {
        this.list = []
        this.isLoading = true
        const data = await topupBalanceReward()
        this.list = data.dataList.map((item) => {
          return {
            ...item,
            isLoading: true,
            rewardDetailList: [],
          }
        })
        this.isLoading = false
        for (let i = 0; i < this.list.length; i++) {
          await this.getItemDetail(this.list[i])
        }
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="scss">
.top-card {
  margin: 0 auto;
  width: 920px;
  padding: 0 36px;
  margin-top: 20px;
}

::v-deep .el-pagination {
  text-align: center;
  margin: 70px 0;
}

::v-deep .el-pager li {
  background-color: transparent !important;
  color: #9e9e9e !important;
}

::v-deep .el-pager .active {
  color: #b3b5f2 !important;
  border: 1px solid;
  border-color: #b3b5f2;
}

::v-deep .el-pagination .btn-next {
  background-color: transparent !important;
  color: #9e9e9e !important;
}

::v-deep .el-pagination .btn-prev {
  background-color: transparent !important;
  color: #9e9e9e !important;
}

.card-item {
  // border: 1px solid #6062aa;
  border-radius: 2px;
  background: #252b3a;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.item-title {
  height: 68px;
  width: 100%;
  display: flex;
  margin-bottom: 24px;
  .title-left {
    width: 68px;
    height: 68px;
    margin-right: 12px;
    img {
      width: 68px;
      height: 68px;
      object-fit: cover;
      z-index: 1;
      position: sticky;
    }
  }
  .title-cen {
    flex: 1;
    h4 {
      color: #bbbaba;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.2px;
      margin: 0;
      margin-bottom: 4px;
      span {
        color: #9e9e9e;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 0.2px;
      }
    }
    p {
      color: #ffffff;
      font-family: Roboto;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
      letter-spacing: 0.2px;
      margin: 0;
    }
  }
  .title-right {
    width: 200px;
    margin-left: auto;
    text-align: end;
  }
  .item-span {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    margin-right: 16px;
  }
}
.box-icons {
  text-align: center;
  padding-top: 26px;

  p {
    margin: 0;
    margin-bottom: 10px;
    color: #757575;
    font-size: 18px;
  }
}
.seebtn {
  font-size: 14px !important;
  color: #b3b5f2;
  cursor: pointer;
}
.centext {
  display: flex;
  align-items: center;
  margin: 12px 0;
  p {
    color: #fff;
    font-size: 20px;
    margin: 0;
  }

  span {
    color: #9e9e9e;
    font-size: 14px;
  }
}
::v-deep .el-divider--vertical {
  height: 24px;
  background: #3a435b;
}
.dialog-loading .flexbox {
  height: 200px;
}
</style>
