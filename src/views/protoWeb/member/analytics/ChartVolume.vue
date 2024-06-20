<template>
  <div class="charts-box">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.volumeAndAveragePriceLabel') }}</h3>
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.xdata && chartData.xdata.length > 0">
        <div id="ChartVolume" style="height: 420px"></div>
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
import { echarts } from '@/components/echarts'
import { analyticsAveragePrice } from '@/common/api'
import ChartLoading from '@/components/ChartLoading.vue'
import ChartNoData from '@/components/ChartNoData.vue'
import { numToFilter } from '@/utils'
import dayjs from 'dayjs'
import { BigNumber } from 'bignumber.js'
export default {
  name: 'ChartVolume',
  components: {
    ChartLoading,
    ChartNoData,
  },
  props: {
    dayTime: {
      type: Number,
    },
  },
  watch: {
    dayTime() {
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
  },
  methods: {
    // numFormat(val) {
    //   const num = parseInt(val);
    //   const numLength = num.toString().length;
    //   if (numLength > 1) {
    //     const a = num.toString().slice(0, 1);
    //     const b = Number(a) > 5 ? 10 : 5;
    //     const c = b * `1e${numLength - 1}`;
    //     return c;
    //   } else {
    //     return Number(num) > 5 ? 10 : 5;
    //   }
    // },
    // numFilter(val) {
    //   if (Number(val) >= 1) {
    //     const num = this.numFormat(val);
    //     return num;
    //   } else {
    //     const nums = val.split(".");
    //     const numLength = nums[1].length;
    //     const num = this.numFormat(nums[1]);
    //     const c = num / `1e${numLength}`;
    //     return c;
    //   }
    // },
    reResizeFn() {
      let _ref = document.getElementById('ChartVolume')

      let myEchars = _ref ? echarts.getInstanceByDom(_ref) : undefined
      if (myEchars !== undefined) {
        myEchars.resize()
      }
    },
    async getData() {
      this.isLoading = true
      const query = { daoId: this.$route.query.id, dayTime: this.dayTime }
      const res = await analyticsAveragePrice(query)
      this.chartData = {
        xdata: res.data.times,
        yadata: res.data.volume,
        ybdata: res.data.price,
        maxVolume: res.data.maxVolume,
        maxPrice: res.data.maxPrice,
      }
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
          let _ref = document.getElementById('ChartVolume')
          this.myChart = _ref ? echarts.init(_ref) : null
          this.newEcharts()
        }, 500)
      }
    },
    newEcharts() {
      let utc = require('dayjs/plugin/utc')
      var timezone = require('dayjs/plugin/timezone')
      dayjs.extend(utc)
      dayjs.extend(timezone)
      dayjs.tz.guess()
      const maxprice =
        this.chartData.maxPrice === 0 ? 1 : numToFilter(this.chartData.maxPrice)
      const maxvolume =
        this.chartData.maxVolume === 0
          ? 1
          : numToFilter(this.chartData.maxVolume)

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
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          triggerOn: 'mousemove',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#E5E5E5',
            },
          },
          formatter: function (params) {
            const date = dayjs(params[0].name * 1000).format(
              'DD/MM/YYYY HH:mm:ss '
            )
            return `${params[0].marker}${params[0].seriesName}: <span style="height: 18px; width: 100%;color:#424242 ;font-style: normal;font-weight: 400;font-size: 14px;"> 
              ${params[0].value}
            </span>
            <br/>
            ${params[1].marker}${params[1].seriesName}: 
              <span style="height: 18px; width: 100%;color:#424242 ;font-style: normal;font-weight: 400;font-size: 14px;"> 
                ${params[1].value}
              </span>
            <br/>
            ${date}`
          },
        },
        legend: {
          left: '20px',
          top: '16px',
          itemWidth: 20,
          itemHeight: 2,
          textStyle: {
            color: '#9E9E9E',
          },
          data: ['Volume', 'Average Price'],
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData.xdata,
            axisLabel: {
              // interval: 2,
              color: '#9E9E9E',
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
              onZero: true,
              lineStyle: {
                color: '#6062AA',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Volume（ETH）',
            splitLine: {
              lineStyle: {
                color: '#6062AA',
              },
            },
            // interval: 50,
            max: maxvolume,
            interval: new BigNumber(maxvolume).div(5).toString() * 1,
            nameTextStyle: {
              color: '#9E9E9E',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 22,
            },
            axisLabel: {
              color: '#9E9E9E',
              formatter: '{value} ',
            },
            nameLocation: 'middle',
            nameGap: 60,
            nameRotate: 90,
          },
          {
            type: 'value',
            name: 'Average Price（ETH）',
            // interval: 5,
            max: maxprice,
            splitLine: {
              lineStyle: {
                color: '#6062AA',
              },
            },
            interval: new BigNumber(maxprice).div(5).toString() * 1,
            nameTextStyle: {
              color: '#9E9E9E',
              fontWeight: 500,
              fontSize: 14,
            },
            axisLabel: {
              color: '#9E9E9E',
              formatter: '{value} ',
            },
            nameLocation: 'middle',
            nameGap: 60,
            nameRotate: 270,
          },
        ],
        series: [
          {
            name: 'Volume',
            type: 'bar',
            barMaxWidth: 40,
            itemStyle: {
              color: '#DCE0E1',
            },
            emphasis: {
              itemStyle: {
                color: '#745CD4',
              },
            },
            data: this.chartData.yadata,
          },
          {
            name: 'Average Price',
            type: 'line',
            symbol: 'circle',
            yAxisIndex: 1,
            itemStyle: {
              borderWidth: 2,
              color: '#745CD4',
              borderColor: '#FFFFFF',
            },
            showSymbol: false,
            symbolSize: 8,
            lineStyle: {
              color: '#87D3DE',
            },
            data: this.chartData.ybdata,
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
  border: 1px solid #6062aa;
  border-radius: 2px;
  margin-bottom: 20px;
  height: 480px;
}

.chat-title {
  display: flex;
  margin-top: 24px;
  padding-left: 24px;

  h3 {
    color: #bbbaba;
    font-family: Inter;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
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
