<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.pricerangeofNFTsLabel') }}</h3>
      <div class="checked-box">
        <el-checkbox v-model="checked" @change="getData"
          >{{ $t('nodeDetail.fixedPriceIncludedLabel') }}
        </el-checkbox>
      </div>
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
import { analyticsPriceRange } from '@/common/api'
import { itemCompare } from '@/utils'
export default {
  name: 'TransverseNft',
  components: {
    ChartLoading,
    ChartNoData,
  },
  data() {
    return {
      chartData: [],
      isLoading: true,
      checked: true,
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
        fixedPrice: this.checked ? 1 : 0,
      }
      const data = await analyticsPriceRange(query)
      this.chartData = data.dataList
      this.isLoading = false
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
    color: #bbbaba;
    font-family: Inter6;
    font-size: 18px;
    margin: 0;
  }
}

.body-box {
  box-sizing: border-box;
  margin: 0 24px;
  margin-top: 24px;

  .box-item {
    margin-bottom: 18px;
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

.checked-box {
  margin-left: auto;
  margin-right: 24px;

  ::v-deep .el-checkbox {
    color: #424242;
  }

  ::v-deep .el-checkbox__label {
    font-size: 14px;
    font-family: Inter6;
  }

  ::v-deep .el-checkbox__label {
    background-color: transparent;
    color: #9e9e9e;
  }

  ::v-deep .el-checkbox__inner:hover {
    border-color: #745cd4;
  }

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #745cd4;
    border-color: #745cd4;
  }

  ::v-deep .el-checkbox__inner {
    background-color: transparent;
    border-color: #c5dadd;
  }
}

.loading-box {
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-body {
  height: calc(100% - 46px);
  width: 100%;
}
</style>
