<template>
  <div class="charts-box">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.nftOwnersQuantityLabel') }}</h3>
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.xdata && chartData.xdata.length > 0">
        <div id="ChartOwners" style="height: 390px" />
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
import { analyticsNftOwnersQuantity } from '@/common/api'
import dayjs from 'dayjs'

export default {
  name: 'ChartOwners',
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
    // window.onresize = () => {
    //   this.myChart.resize();
    // };
  },
  methods: {
    reResizeFn() {
      let _ref = document.getElementById('ChartOwners')

      let myEchars = _ref ? echarts.getInstanceByDom(_ref) : undefined
      if (myEchars !== undefined) {
        myEchars.resize()
      }
    },
    async getData() {
      this.isLoading = true
      const query = { daoId: this.$route.query.id, dayTime: this.dayTime }
      const res = await analyticsNftOwnersQuantity(query)
      this.chartData = {
        xdata: res.data.times,
        yadata: res.data.price,
        ybdata: res.data.volume,
        maxVolume: res.data.maxVolume,
        maxPrice: res.data.maxPrice,
      }
      // this.chartData = {
      //   xdata: [
      //     1680480000, 1680566400, 1680652800, 1680739200, 1680825600,
      //     1680912000, 1680998400, 1681084800, 1681171200, 1681257600,
      //     1681344000, 1681430400, 1681516800, 1681603200, 1681689600,
      //     1681776000, 1681862400, 1681948800, 1682035200, 1682121600,
      //     1682208000, 1682294400, 1682380800, 1682467200, 1682553600,
      //     1682640000, 1682726400, 1682812800, 1682899200, 1682985600,
      //     1683072000, 1683158400, 1683244800, 1683331200, 1683417600,
      //     1683504000, 1683590400, 1683676800, 1683763200, 1683849600,
      //     1683936000, 1684022400, 1684108800, 1684195200, 1684281600,
      //     1684368000, 1684454400, 1684540800, 1684627200, 1684713600,
      //     1684800000, 1684886400, 1684972800, 1685059200, 1685145600,
      //     1685232000, 1685318400, 1685404800, 1685491200, 1685577600,
      //     1685664000, 1685750400, 1685836800, 1685923200, 1686009600,
      //     1686096000, 1686182400,
      //   ],
      //   yadata: [
      //     31, 22, 15, 19, 16, 7, 16, 11, 23, 0, 18, 5, 7, 11, 12, 13, 0, 0, 0,
      //     0, 0, 0, 51, 46, 6, 0, 4, 0, 0, 0, 14, 0, 33, 6, 19, 0, 0, 0, 0, 0, 0,
      //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      //     0, 0, 0,
      //   ],
      //   ybdata: [
      //     31, 53, 68, 87, 103, 110, 126, 137, 160, 160, 178, 183, 190, 201, 213,
      //     226, 226, 226, 226, 226, 226, 226, 277, 323, 329, 329, 333, 333, 333,
      //     333, 347, 347, 380, 386, 405, 405, 405, 405, 405, 405, 405, 405, 405,
      //     405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,
      //     405, 405, 405, 405, 405, 405, 405, 405, 405, 405,
      //   ],
      //   maxVolume: 405,
      //   maxPrice: 51,
      // };
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
          let _ref = document.getElementById('ChartOwners')
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
        Number(this.chartData.maxPrice) === 0 ? 1 : this.chartData.maxPrice
      const maxvolume =
        Number(this.chartData.maxVolume) === 0 ? 1 : this.chartData.maxVolume
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
          top: '10%',
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
            return `${params[0].marker}NFT Owners Quantity: <span style="height: 18px; width: 100%;color:#424242 ;font-style: normal;
font-weight: 600;font-size: 16px;"> ${params[0].value}</span><br/>${params[1].marker}NFT Owners Changes:<span style="height: 18px; width: 100%;color:#424242 ;font-style: normal;
font-weight: 600;font-size: 16px;"> ${params[1].value}</span><br/>${date}`
          },
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData.xdata,
            axisLabel: {
              // interval: 2,
              color: '#757575',
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
              lineStyle: {
                color: '#6062AA',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Quantity',
            max: maxvolume,
            interval: maxvolume / 5,
            min: Number(`-${maxvolume / 5}`),
            // axisLabel: {
            //   formatter: "{value} ",
            // },
            nameLocation: 'middle',
            nameGap: 40,
            nameRotate: 90,
            nameTextStyle: {
              color: '#BBBABA',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 22,
            },
            splitLine: {
              lineStyle: {
                color: '#6062AA',
              },
            },
            axisLabel: {
              formatter: (value) => {
                return value >= 0 ? value : ''
              },
            },
          },
          {
            type: 'value',
            name: 'Average Price',
            max: maxprice * 5,
            interval: maxprice,
            min: Number(`-${maxprice}`),
            nameLocation: 'middle',
            nameGap: 50,
            nameRotate: 270,
            splitLine: {
              lineStyle: {
                color: '#6062AA',
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: 'Quantity',
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
            name: 'Average Price',
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
  border: 1px solid #6062aa;
  border-radius: 2px;
  margin-top: 20px;
  height: 440px;
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
.loading-box {
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
