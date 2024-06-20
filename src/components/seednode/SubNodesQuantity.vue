<template>
  <div class="info-box">
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="info-body">
      <div class="infor-tab">
        <el-row>
          <el-col :span="8"
            ><div class="card-num">
              {{ daoAmount.runningDaoAmount | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-num">
              {{ daoAmount.endedDaoAmount | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-num">
              {{ daoAmount.notStartedDaoAmount | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
        </el-row>
        <el-row class="row-item">
          <el-col :span="8"
            ><div class="card-name">
              {{ $t('nodeDetail.inProgressLabel') }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-name">
              {{ $t('nodeDetail.closedLabel') }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-name">
              {{ $t('nodeDetail.upcomingLabel') }}
            </div></el-col
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import { togetherDaoAmount } from '@/common/api'
export default {
  components: {
    ChartLoading,
  },
  props: {
    daoId: {
      type: Number,
    },
  },
  data() {
    return {
      isLoading: true,
      daoAmount: {
        totalAmount: 0,
        runningDaoAmount: 0,
        endedDaoAmount: 0,
        notStartedDaoAmount: 0,
      },
    }
  },
  mounted() {
    this.isLoading = true
    this.getData()
  },
  methods: {
    async getData() {
      const info = await togetherDaoAmount({
        daoId: this.daoId,
      })
      console.log(info, 'oasdasdasdasdasd')
      this.daoAmount = info.data
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="scss">
.info-box {
  min-height: 80px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
}

.info-body {
  height: calc(100% - 46px);
  width: 100%;
}

.infor-tab {
  margin-top: 12px;
  .row-item {
    margin-bottom: 24px;
  }
}
.card-name {
  color: #9e9e9e;
  font-size: 14px;
  font-weight: 400;
}
.card-num {
  color: #fff;
  // margin-bottom: 12px;
}
.card-item {
  display: flex;
  flex-direction: column;
  p {
    margin: 0;
    margin-bottom: 6px;
  }
  span {
    display: block;
  }
}
</style>
