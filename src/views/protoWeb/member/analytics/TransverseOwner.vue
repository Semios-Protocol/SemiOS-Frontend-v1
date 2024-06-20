<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.nftOwnerDistributionLabel') }}</h3>
    </div>
    <div class="title-num">
      {{ chartData.length === 0 ? 0 : amount | numberToCurrencyNo }}
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.length > 0">
        <div class="body-box">
          <div
            class="box-item"
            v-for="(item, idx) in chartData"
            :key="item.range + idx"
            :style="marginStyle()"
          >
            <div class="item-text">
              <span>{{
                itemText(item.ratio) ? lessNum : item.ratio + '%'
              }}</span>
              <span class="text-right">{{ item.range }}</span>
            </div>
            <div class="item-div">
              <div class="div-item" :style="{ width: item.ratio + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <chart-no-data
        title="No events have occurred yet"
        text="Check again later."
        v-show="!chartData || itemCompare(chartData.length, 3)"
      />
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import ChartNoData from '@/components/ChartNoData.vue'
import { analyticsOwnerDistribution } from '@/common/api'
import { itemCompare } from '@/utils'
export default {
  name: 'TransverseOwner',
  components: {
    ChartLoading,
    ChartNoData,
  },
  data() {
    return {
      chartData: [],
      isLoading: true,
      amount: 0,
      lessNum: '< 1%',
    }
  },
  mounted() {
    this.itemCompare = itemCompare
    this.getData()
  },
  methods: {
    itemText(item) {
      return Math.abs(item) < 1 && Math.abs(item) > 0
    },
    async getData() {
      this.isLoading = true
      this.chartData = []
      const query = {
        daoId: this.$route.query.id,
      }
      const data = await analyticsOwnerDistribution(query)
      this.chartData = data.dataList
      // this.chartData = [
      //   {
      //     range: "1 item",
      //     amount: null,
      //     ratio: 50.0,
      //     order: 1,
      //   },
      //   {
      //     range: "2-5 item",
      //     amount: null,
      //     ratio: 25,
      //     order: 2,
      //   },
      //   {
      //     range: "6-8 item",
      //     amount: null,
      //     ratio: 0,
      //     order: 3,
      //   },
      //   {
      //     range: "9-11 item",
      //     amount: null,
      //     ratio: 0,
      //     order: 4,
      //   },
      //   {
      //     range: "12+ item",
      //     amount: null,
      //     ratio: 25,
      //     order: 5,
      //   },
      // ];
      this.amount = data.data.amount
      this.isLoading = false
    },
    marginStyle() {
      const length = this.chartData.length
      return {
        'margin-bottom': (344 - length * 54) / length + 'px',
      }
    },
  },
}
</script>

<style scoped lang="scss">
.chat-body {
  height: 440px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
}

.chat-title {
  display: flex;
  margin-top: 24px;
  padding-left: 24px;

  h3 {
    color: #9e9e9e;
    font-family: Inter6;
    font-size: 18px;
    margin: 0;
  }
}

.body-box {
  box-sizing: border-box;
  margin: 0 24px;
  margin-top: 8px;

  .box-item {
    height: 54px;
  }
}

.item-text {
  height: 22px;
  line-height: 22px;
  color: #9e9e9e;
  font-size: 14px;
  font-family: Inter6;
  margin-bottom: 8px;

  .text-right {
    float: right;
    color: #9e9e9e;
  }
}

.item-div {
  height: 24px;
  background: rgba(37, 176, 194, 0.12);
  border-radius: 2px;
}

.div-item {
  background: #87d3de;
  border-radius: 2px;
  height: 100%;
}

.title-num {
  font-size: 14px;
  color: #757575;
  font-family: Inter4;
  height: 22px;
  line-height: 22px;
  margin: 0 24px;
  margin-top: 6px;
}

.loading-box {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-body {
  height: calc(100% - 68px);
  width: 100%;
}
</style>
