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
              {{ daoToken.totalSupply | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-num">
              {{ daoToken.daoTokenBalance | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-num">
              {{ daoToken.redeemAssetPoolEth | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
        </el-row>
        <el-row class="row-item">
          <el-col :span="8"
            ><div class="card-name">
              {{ $t('nodeDetail.totalSupplyLabel') }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-name">
              {{ $t('nodeDetail.circulatingerc20Label') }}
            </div></el-col
          >
          <el-col :span="8"
            ><div class="card-name">
              {{ $t('nodeDetail.ethRedeemPoolLabel') }}
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8"
            ><div class="card-num">
              {{ daoToken.redeemedErc20Amont | bigNumFormat(5, 0.00001) }}
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="card-name">{{ $t('nodeDetail.redeemedLabel') }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import { togetherDaoToken } from '@/common/api'
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
      daoToken: {
        totalSupply: 0,
        daoTokenBalance: 0,
        redeemAssetPoolEth: 0,
        redeemedErc20Amont: 0,
        erc20Address: '',
      },
    }
  },
  mounted() {
    this.isLoading = true
    this.getData()
  },
  methods: {
    async getData() {
      const info = await togetherDaoToken({
        daoId: this.daoId,
      })
      console.log(info, 'oasdasdasdasdasd')
      this.daoToken = info.data
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
