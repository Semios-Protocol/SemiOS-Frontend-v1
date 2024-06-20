<template>
  <div v-if="isLoading" class="loading-box">
    <loading />
  </div>
  <div class="balance-box" v-else>
    <el-row class="b-title">
      <el-col :span="10">
        <div class="title-st">{{ $t('topUpBalance.incentivePlanLabel') }}</div>
      </el-col>
      <el-col :span="7">
        <div class="title-st">Collected Reward</div>
      </el-col>
      <el-col :span="7">
        <div class="title-st">
          {{ $t('topUpBalance.collectableRewardLabel') }}
        </div>
      </el-col>
    </el-row>
    <div class="table-box" v-if="list.length > 0">
      <el-row v-for="item in list" :key="item.planId">
        <el-col :span="10">
          <div class="title-bal">
            {{ dataObj.daoName }} Top-Up Holders Incentive Plan #{{
              item.planNumber
            }}
          </div>
        </el-col>
        <el-col :span="7">
          <div class="title-bal">
            {{ item.collectedAmount | bigNumFormat(5, 0.00001) }}
            <TokenIcon
              size="14px"
              :payCurrencyType="item.rewardTokenSymbol"
              :inputTokenAddress="item.rewardToken"
            />
          </div>
        </el-col>
        <el-col :span="7">
          <div class="title-bal">
            {{ item.collectableAmount | bigNumFormat(5, 0.00001) }}
            <TokenIcon
              size="14px"
              :payCurrencyType="item.rewardTokenSymbol"
              :inputTokenAddress="item.rewardToken"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else class="noData">No items to display</div>
  </div>
</template>

<script>
import TokenIcon from '@/components/TokenIcon.vue'
import Loading from '@/components/Loading.vue'
export default {
  components: {
    TokenIcon,
    Loading,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    dataObj: {
      type: Object,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  methods: {},
}
</script>

<style scoped>
.balance-box {
  height: 160px;
}
.b-title {
  background: #2a2f41;
  color: #9e9e9e;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.2px;
  text-transform: capitalize;

  margin-top: 18px;
}

.el-row {
  line-height: 40px;
  height: 40px;
}

.title-name {
  color: #25b0c2;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
}

.title-bal {
  color: #fff;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 12px;
}

.table-box {
  max-height: 120px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #9e9e9e transparent;
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
.noData {
  margin-top: 24px;
  color: #9e9e9e;
}
.flexbox {
  height: 160px;
  margin-top: 18px;
}
.title-st {
  margin: 0 12px;
}
</style>
