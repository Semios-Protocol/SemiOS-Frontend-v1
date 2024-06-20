<template>
  <div class="top-body">
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <div class="top-card" v-if="list.length > 0">
        <div class="card-item" v-for="(item, idx) in list" :key="idx + 'a'">
          <div class="item-title">
            <div class="title-left"><img :src="item.daoLogoUrl" alt="" /></div>
            <div class="title-cen">
              <h4>
                {{ item.daoName }}
              </h4>
              <p>{{ item.daoDescription }}</p>
            </div>
          </div>
          <div class="right-bom">
            <PendingTable
              :isLoading="item.isLoading"
              :list="item.topUpBalanceList"
              :isTop="true"
            />
          </div>
        </div>
      </div>
      <div v-else class="noData">No items to display</div>
    </div>
  </div>
</template>

<script>
import { topupBalancePending, topupBalancePendingDetail } from '@/common/api'
import Loading from '@/components/Loading.vue'
import PendingTable from './PendingTable.vue'
export default {
  components: { Loading, PendingTable },
  data() {
    return {
      isLoading: true,
      list: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getItemDetail(item) {
      const res = await topupBalancePendingDetail({ projectId: item.projectId })
      item.topUpBalanceList = res.dataList
      item.isLoading = false
      //TODO 获取接口对应数据并传递子组件
    },
    async getData() {
      try {
        this.list = []
        this.isLoading = true
        const data = await topupBalancePending()
        console.log(data, 'data')
        // this.list = data.dataList.map
        this.list = data.dataList.map((item) => {
          return {
            ...item,
            isLoading: true,
            topUpBalanceList: [
              // {
              //   createTimestamp: '2024-05-13T02:41:03.000+00:00',
              //   endBlockTime: 156535,
              //   mintFee: 0.0001,
              //   mintedDaoId: 282,
              //   mintedDaoName: 'zhyyao2',
              //   mintedWorkId: 314,
              //   mintedWorkNumber: 2,
              //   operationTime: 1715568063000,
              //   voucherDaoId: 282,
              //   voucherDaoName: 'zhyyao2',
              //   voucherWorkId: 316,
              //   voucherWorkNumber: 2,
              // },
              // {
              //   createTimestamp: '2024-05-13T02:41:03.000+00:00',
              //   endBlockTime: 156535,
              //   mintFee: 0.0001,
              //   mintedDaoId: 282,
              //   mintedDaoName: 'zhyyao2',
              //   mintedWorkId: 316,
              //   mintedWorkNumber: 2,
              //   operationTime: 1715568063000,
              //   voucherDaoId: 282,
              //   voucherDaoName: 'zhyyao2',
              //   voucherWorkId: 316,
              //   voucherWorkNumber: 2,
              // },
              // {
              //   createTimestamp: '2024-05-13T02:41:03.000+00:00',
              //   endBlockTime: 156535,
              //   mintFee: 0.0001,
              //   mintedDaoId: 282,
              //   mintedDaoName: 'zhyyao2',
              //   mintedWorkId: 315,
              //   mintedWorkNumber: 2,
              //   operationTime: 1715568063000,
              //   voucherDaoId: 282,
              //   voucherDaoName: 'zhyyao2',
              //   voucherWorkId: 316,
              //   voucherWorkNumber: 2,
              // },
              // {
              //   createTimestamp: '2024-05-13T02:41:03.000+00:00',
              //   endBlockTime: 156535,
              //   mintFee: 0.0001,
              //   mintedDaoId: 282,
              //   mintedDaoName: 'zhyyao2',
              //   mintedWorkId: 317,
              //   mintedWorkNumber: 2,
              //   operationTime: 1715568063000,
              //   voucherDaoId: 282,
              //   voucherDaoName: 'zhyyao2',
              //   voucherWorkId: 316,
              //   voucherWorkNumber: 2,
              // },
            ],
          }
        })
        this.isLoading = false
        for (let i = 0; i < this.list.length; i++) {
          await this.getItemDetail(this.list[i])
        }
      } catch (error) {
        console.log(error)
      }
    },
    aPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
    },
  },
}
</script>

<style scoped lang="scss">
.top-card {
  margin: 0 auto;
  width: 920px;
  padding: 0 36px;
}

.card-item {
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
}
</style>
