<template>
  <div class="info-box">
    <!-- <div class="info-title">
      <h3>标题站位</h3>
    </div> -->
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="info-body">
      <h4>{{ $t('nodeItemCard.erc20TokensReceivedfromotherNodesLabel') }}</h4>
      <div class="body-card" v-if="infoData.receivedTokenFromOther.length > 0">
        <el-row
          v-for="item in infoData.receivedTokenFromOther"
          :key="item.daoName + 'receivedTokenFromOther'"
        >
          <el-col :span="20"
            ><span class="name-btn" @click="goDaoDetail(item)">{{
              item.daoName
            }}</span></el-col
          >
          <el-col :span="4">{{ item.royaltyProportion }}%</el-col>
        </el-row>
      </div>

      <div class="body-card no-data" v-else>No Data</div>
      <h4>{{ $t('nodeItemCard.erc20TokensAllocationtoeachNodesLabel') }}</h4>
      <div
        class="body-card"
        v-if="infoData.allocationTokenToOtherDao.length > 0"
      >
        <el-row
          v-for="item in infoData.allocationTokenToOtherDao"
          :key="item.daoName + 'allocationTokenToOtherDao'"
        >
          <el-col :span="20"
            ><span class="name-btn" @click="goDaoDetail(item)">{{
              item.daoName
            }}</span></el-col
          >
          <el-col :span="4">{{ item.royaltyProportion }}%</el-col>
        </el-row>
      </div>

      <div class="body-card no-data" v-else>No Data</div>
      <div v-if="tabName !== 'collection'">
        <h4>ERC-20 Tokens</h4>
        <div class="body-token">
          <el-row>
            <el-col :span="20"
              ><span class="name-mo">{{
                $t('nodeItemCard.builderIncentivesLabel')
              }}</span></el-col
            >
            <el-col :span="4">{{ infoData.royaltyToken.canvasReward }}%</el-col>
          </el-row>
          <el-row>
            <el-col :span="20"
              ><span class="name-mo">Starter Incentives</span></el-col
            >
            <el-col :span="4">{{ infoData.royaltyToken.daoReward }}%</el-col>
          </el-row>
          <el-row>
            <el-col :span="20"
              ><span class="name-mo">{{
                $t('nodeItemCard.minterIncentivesLabel')
              }}</span></el-col
            >
            <el-col :span="4">{{ infoData.royaltyToken.minterReward }}%</el-col>
          </el-row>
          <el-row>
            <el-col :span="20"
              ><span class="name-mo">{{
                $t('nodeItemCard.semiosIncentivesLabel')
              }}</span></el-col
            >
            <el-col :span="4">{{ infoData.royaltyToken.d4aReward }}%</el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import { allocationInfo } from '@/common/api'
export default {
  name: 'DaoInfo',
  components: {
    ChartLoading,
  },
  props: {
    address: {
      type: String,
    },
    daoId: {
      type: Number,
    },
    tabName: {
      type: String,
    },
  },
  watch: {
    address() {
      this.getData()
    },
  },
  data() {
    return {
      isLoading: true,
      infoData: {},
    }
  },
  mounted() {
    this.isLoading = true

    this.getData()
    // window.onresize = () => {
    //   this.myChart.resize();
    // };
  },
  methods: {
    async getData() {
      const info = await allocationInfo({
        daoId: this.daoId ? this.daoId : this.$route.query.id,
      })
      this.infoData = info.data
      this.isLoading = false
    },
    goDaoDetail(item) {
      if (item.royaltyType === 0) {
        this.$router.push({
          path: '/dao',
          query: {
            id: item.daoId,
          },
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.info-box {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-body {
  height: calc(100% - 46px);
  width: 100%;
}

.info-title {
  display: flex;
  margin-top: 24px;
  // padding-left: 24px;

  h3 {
    color: #bbbaba;
    font-family: Inter6;
    font-size: 18px;
    margin: 0;
  }
}

h4 {
  color: #9e9e9e;
  /* Body/regular */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  padding-top: 12px;
  margin: 0;
}

.el-row {
  color: #9e9e9e;
  /* Body/regular */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  padding-top: 12px;
}

.name-btn {
  color: #25b0c2;
  cursor: pointer;
}

.name-mo {
  color: #9e9e9e;
}

.body-card {
  height: 100px;
  overflow-y: auto;
  margin-bottom: 24px;
}

.body-token {
  height: 140px;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #d9d9d9;
}

.no-data {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
}
</style>
