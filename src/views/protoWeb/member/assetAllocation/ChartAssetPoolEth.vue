<template>
  <div class="charts-box">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.subNodesAssetPoolETHLabel') }}</h3>
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.xdata && chartData.xdata.length > 0">
        <div id="ChartAssetPoolEth" :style="{ height: Mheight }" />
      </div>
      <chart-no-data
        title="No data in this time range"
        text="Try a different time range or check again later."
        v-show="!chartData || !chartData.xdata || chartData.xdata.length <= 0"
      />
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import ChartNoData from '@/components/ChartNoData.vue'
import { echarts } from '@/components/echarts'
import { numToFilter, bigNumFormat } from '@/utils'
import { analyticsAssetPoolEth } from '@/common/api'

import dayjs from 'dayjs'
export default {
  name: 'ChartAssetPoolEth',
  components: {
    ChartLoading,
    ChartNoData,
  },
  props: {
    dayTime: {
      type: Number,
    },
    address: {
      type: String,
    },
    Mheight: {
      type: String,
      default: '390px',
    },
  },
  watch: {
    dayTime() {
      this.getData()
    },
    address() {
      this.getData()
    },
  },
  data() {
    return {
      chartData: {},
      myChart: null,
      isLoading: true,
    }
  },
  mounted() {
    this.isLoading = true
    this.chartData = {}

    this.getData()
    // window.onresize = () => {
    //   this.myChart.resize();
    // };
  },
  methods: {
    reResizeFn() {
      let _ref = document.getElementById('ChartAssetPoolEth')

      let myEchars = _ref ? echarts.getInstanceByDom(_ref) : undefined
      if (myEchars !== undefined) {
        myEchars.resize()
      }
    },
    async getData() {
      this.isLoading = true
      const res = await analyticsAssetPoolEth({ daoId: this.$route.query.id })
      this.chartData = {
        xdata: res.data.time,
        yadata: res.data.changes,
        ybdata: res.data.totalAmount,
        ycdata: res.data.incomes,
        yddata: res.data.costs,
        maxVolume: res.data.maxChanges,
        maxPrice: res.data.maxTotalAmount,
      }
      // this.chartData.yadata[0] = "1";
      // this.chartData.yadata[1] = "0.1";
      this.isLoading = false
      if (
        this.chartData &&
        this.chartData.xdata &&
        this.chartData.xdata.length > 0
      ) {
        setTimeout(() => {
          if (this.myChart) {
            this.myChart.dispose()
          }
          this.myChart = null
          let _ref = document.getElementById('ChartAssetPoolEth')
          this.myChart = _ref ? echarts.init(_ref) : null
          this.newEcharts()
        }, 500)
      }
    },
    newEcharts() {
      let maxvolume = 1
      if (Number(this.chartData.maxPrice) > Number(this.chartData.maxVolume)) {
        maxvolume =
          Number(this.chartData.maxPrice) === 0
            ? 1
            : numToFilter(this.chartData.maxPrice)
      } else {
        maxvolume =
          Number(this.chartData.maxVolume) === 0
            ? 1
            : numToFilter(this.chartData.maxVolume)
      }
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ]
      this.option = {
        grid: {
          top: '20%',
          left: '8%',
          right: '3%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          triggerOn: 'mousemove',
          axisPointer: {
            crossStyle: {
              color: '#999',
            },
          },
          formatter: function (params) {
            const date = dayjs(params[0].name * 1000).format(
              'DD/MM/YYYY HH:mm:ss '
            )
            return `${params[0].marker}${params[0].seriesName}: ${bigNumFormat(
              params[0].value,
              4,
              0.0001
            )}<br/>${params[1].marker}${params[1].seriesName}: ${bigNumFormat(
              params[1].value,
              4,
              0.0001
            )}<br/>${params[2].marker}${params[2].seriesName}: ${bigNumFormat(
              params[2].value,
              4,
              0.0001
            )}<br/>${params[3].marker}${params[3].seriesName}: ${bigNumFormat(
              params[3].value,
              4,
              0.0001
            )}<br/>${date}`
          },
        },
        legend: [
          {
            left: '20px',
            top: '16px',
            itemWidth: 28,
            itemHeight: 10,
            textStyle: {
              color: '#BBBABA',
            },
            data: ['Asset Pool Changes'],
          },
          {
            left: '220px',
            top: '16px',
            itemWidth: 28,
            itemHeight: 2,
            textStyle: {
              color: '#BBBABA',
            },
            data: ['Asset Pool ETH Balance'],
          },
          {
            left: '20px',
            top: '46px',
            itemWidth: 28,
            itemHeight: 2,
            textStyle: {
              color: '#BBBABA',
            },
            data: ['Asset Pool Income'],
          },
          {
            left: '220px',
            top: '46px',
            itemWidth: 28,
            itemHeight: 2,
            textStyle: {
              color: '#BBBABA',
            },
            data: ['Asset Pool Outcome'],
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: this.chartData.xdata,
            axisLabel: {
              // interval: 2,
              color: '#BBBABA',
              formatter: (value) => {
                const date = new Date(value * 1000)
                const mon = date.getMonth()
                const day = date.getDate()
                return `${months[mon]} ${day}`
                // return liangTools.unix2hm(value)
              },
            },
            axisTick: { alignWithLabel: true },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#6062AA',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            // name: "Amount（ETH）",
            // interval: 50,
            max: maxvolume,
            interval: maxvolume / 4,
            min: Number(`-${maxvolume / 4}`),
            // axisLabel: {
            //   formatter: "{value} ",
            // },
            // nameLocation: "middle",
            // nameGap: 50,
            // nameRotate: 90,
            nameTextStyle: {
              color: '#BBBABA',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 22,
            },
            axisLabel: {
              color: '#BBBABA',
              formatter: (value) => {
                return value >= 0 ? value : ''
              },
            },
            splitLine: {
              lineStyle: {
                color: '#6062AA',
              },
            },
          },
          {
            type: 'value',
            name: 'Average Price',
            max: maxvolume * 4,
            interval: maxvolume,
            min: Number(`-${maxvolume}`),
            nameLocation: 'middle',
            nameGap: 50,
            nameRotate: 270,
            show: false,

            // axisTick: {
            //   show: false,
            // },
            // axisLine: {
            //   show: false,
            // },
            // axisLabel: {
            //   show: false,
            // },
          },
        ],
        series: [
          {
            name: 'Asset Pool ETH Balance',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            // yAxisIndex: 1,
            itemStyle: {
              color: '#87D3DE',
              borderColor: '#87D3DE',
            },
            lineStyle: {
              color: '#87D3DE',
            },
            data: this.chartData.ybdata,
          },

          {
            name: 'Asset Pool Income',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            // yAxisIndex: 1,
            itemStyle: {
              color: '#FE8EA9',
              borderColor: '#FE8EA9',
            },
            lineStyle: {
              color: '#FE8EA9',
            },
            data: this.chartData.ycdata,
          },

          {
            name: 'Asset Pool Outcome',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            // yAxisIndex: 1,
            itemStyle: {
              color: '#573DF6',
              borderColor: '#573DF6',
            },
            lineStyle: {
              color: '#573DF6',
            },
            data: this.chartData.yddata,
          },
          {
            name: 'Asset Pool Changes',
            type: 'bar',
            barMaxWidth: 40,
            yAxisIndex: 1,
            itemStyle: {
              color: '#DCE0E1',
            },
            data: this.chartData.yadata,
          },
        ],
      }
      if (this.myChart) {
        this.myChart.setOption(this.option, true)
      }
    },
  },
  destroyed() {
    this.chartData = {}
    if (this.myChart) {
      this.myChart.dispose()
    }
    this.myChart = null
  },
}
</script>

<style scoped lang="scss">
.charts-box {
  box-sizing: border-box;
  // border: 1px solid #6062aa;
  // border-radius: 2px;
  // height: 440px;
  height: 100%;
}

.chat-title {
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

.loading-box {
  min-height: 500px;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-body {
  height: calc(100% - 46px);
  width: 100%;
}
</style>
