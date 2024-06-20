<template>
  <div class="info-box">
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div class="infor-tab" v-else>
      <el-row>
        <el-col :span="8"
          ><div class="card-num" v-if="basicData.incentiveType === 1">
            Input Token :
            <TokenIcon
              :payCurrencyType="basicData.inputTokenSymbol"
              :inputTokenAddress="basicData.inputTokenAddress"
            />
          </div>
          <div class="card-num" v-else>
            Output Token :
            <TokenIcon
              :daoToken="true"
              :daoSymbol="basicData.outputTokenSymbol"
              :daoErc20Address="basicData.erc20TokenAddress"
            /></div
        ></el-col>
        <el-col :span="8"
          ><div class="card-num">{{ basicData.remainBlock }}</div></el-col
        >
        <el-col :span="8"
          ><div class="card-num">{{ basicData.duration }} Hours</div></el-col
        >
      </el-row>
      <el-row class="row-item">
        <el-col :span="8"
          ><div class="card-name">Incentivized Token Type</div></el-col
        >
        <el-col :span="8"><div class="card-name">Remaing Block</div></el-col>
        <el-col :span="8"><div class="card-name">Block Duration</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"
          ><div class="card-num">
            {{ basicData.incentiveAmount | bigNumFormat(5) }}
            <TokenIcon
              :payCurrencyType="basicData.rewardTokenSymbol"
              :inputTokenAddress="basicData.rewardToken"
            /></div
        ></el-col>
        <el-col :span="8"
          ><div class="card-num">
            {{ basicData.releasedAmount | bigNumFormat(5) }}
            <TokenIcon
              :payCurrencyType="basicData.rewardTokenSymbol"
              :inputTokenAddress="basicData.rewardToken"
            /></div
        ></el-col>
        <el-col :span="8"
          ><div class="card-num">
            {{ basicData.startDate | dateFormat(1) }}
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8"
          ><div class="card-name">
            Total Tokens Allocated For This Plan
          </div></el-col
        >
        <el-col :span="8"
          ><div class="card-name">
            Tokens already released for this plan
          </div></el-col
        >
        <el-col :span="8"><div class="card-name">Strat Date</div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import TokenIcon from '@/components/TokenIcon.vue'
import { togetherPlanBasicInfo } from '@/common/api'
export default {
  components: {
    ChartLoading,
    TokenIcon,
  },
  props: {
    planId: {
      type: Number,
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
      basicData: {},
    }
  },
  mounted() {
    this.isLoading = true
    this.getData()
  },
  methods: {
    async getData() {
      const info = await togetherPlanBasicInfo({
        planId: this.planId,
      })
      this.basicData = info.data
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="scss">
.info-box {
  margin-top: 12px;
  min-height: 109px;
}
.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 109px;
}
.infor-tab {
  margin-top: 12px;
  width: 100%;
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
