<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.mintLabel') }}</h3>
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
      <div v-show="chartData.xtime && chartData.xtime.length > 0">
        <div id="ChartMint" style="height: 400px" class="charts-box" />
      </div>
      <chart-no-data
        title="No data in this time range"
        text="Try a different time range or check again later."
        v-show="!chartData.xtime || chartData.xtime.length <= 0"
      />
    </div>
  </div>
</template>

<script>
import { echarts } from '@/components/echarts'
import $ from 'jquery'
import ChartLoading from '@/components/ChartLoading.vue'
import ChartNoData from '@/components/ChartNoData.vue'
import { analyticsMintScatterPlot } from '@/common/api'
import dayjs from 'dayjs'
export default {
  name: 'ChartMint',
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
      checked: true,
      axisPointerType: 'line',
    }
  },
  mounted() {
    this.isLoading = true
    this.chartData = null
    this.getData()
  },
  methods: {
    reResizeFn() {
      let _ref = document.getElementById('ChartMint')

      let myEchars = _ref ? echarts.getInstanceByDom(_ref) : undefined
      if (myEchars !== undefined) {
        myEchars.resize()
      }
    },
    async getData() {
      this.isLoading = true
      this.chartData = null
      const query = {
        daoId: this.$route.query.id,
        dayTime: this.dayTime,
        fixedPrice: this.checked ? 1 : 0,
      }
      const data = await analyticsMintScatterPlot(query, 'query')
      this.chartData = data.data
      // this.chartData.xtime.length = 3;
      // this.chartData.price.length = 3;
      // this.chartData.xtime = [
      //   "1685161444",
      //   "1685261444",
      //   "1685281444",
      //   "1685361444",
      //   "1685371444",
      //   "1685461444",
      //   "1685561444",
      //   "1685661444",
      //   "1685761444",
      //   "1685861444",
      // ];
      // this.chartData.price = [
      //   "0.0101",
      //   "0.005",
      //   "0.01",
      //   "0.0101",
      //   "0.01",
      //   "0.0101",
      //   "0.005",
      //   "0.01",
      //   "0.0101",
      //   "0.01",
      // ];
      // this.chartData.price = [0.005, 0.0101, 0.01, 0, 0, 0, 0];
      // this.chartData.text = [
      //   ["2023-4-24 10:55:48", 0.005],
      //   ["2023-4-24 12:7:0", 0.004],
      //   ["2023-4-24 12:7:0", 0.001],
      //   ["2023-4-25 0:0:0", 0],
      //   ["2023-4-26 0:0:0", 0],
      //   ["2023-4-27 0:0:0", 0],
      //   ["2023-4-28 0:0:0", 0],
      // ];
      this.isLoading = false
      if (this.chartData.xtime && this.chartData.xtime.length > 0) {
        setTimeout(() => {
          if (this.myChart) {
            this.myChart.dispose()
          }
          this.myChart = null
          let _ref = document.getElementById('ChartMint')
          this.myChart = _ref
            ? echarts.init(_ref, null, { locale: 'EN' })
            : null
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
      this.option = {
        grid: {
          top: '10%',
          left: '6%',
          right: '3%',
          bottom: '6%',
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'mousemove',
          // enterable: true,
          extraCssText: `
  background-color: red;
  height: 92px;
  width: 320px;
  background: #ffffff;
  border: 1px solid #c5dadd;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 10px;
  box-sizing: border-box;`,
          formatter: (params) => {
            if (params.value[1] !== '') {
              const name = this.chartData.name[params.dataIndex]
              const img = this.chartData.image[params.dataIndex]
              const date = dayjs(params.value[0]).format('DD/MM/YYYY HH:mm:ss ')
              //  new Date(params.value[0] * 1000);
              const htmlText =
                `
    <div  id=${params.dataIndex + 'tooltip_one'} class="custom-tooltip-box">
      <div class="skeleton__item" style="width: 72px; height: 72px"></div>
      <div style="flex: 1; margin-left: 12px">
        <div style="height: 18px; width: 30%" class="skeleton__item"></div>
        <div
          style="height: 18px; width: 90%; margin: 6px 0"
          class="skeleton__item"
        ></div>
        <div style="height: 18px; width: 55%" class="skeleton__item"></div>
      </div>
    </div>
    <div id=${
      params.dataIndex + 'tooltip_two'
    } class="custom-tooltip-box" style="display: none;">
      <div style="width: 72px; height: 72px;border: 1px solid #C5DADD;">` +
                "<img style='object-fit: contain; width: 100%; height: 100%;' src='" +
                img +
                "'/>" +
                ` </div>
      <div style="flex: 1; margin-left: 12px">
        <div style="height: 18px; width: 100%;color:#424242 ;font-style: normal;
font-weight: 600;font-size: 16px;">${params.value[1]} ETH</div>
        <div style="height: 18px; width: 100%; margin: 6px 0">
         ${name}
        </div>
        <div style="height: 18px; width: 100%">${date}</div>
      </div>
    </div>
    `
              // $(`#${params.dataIndex + "tooltip_two"}`).css("display", "none");
              // $(`#${params.dataIndex + "tooltip_one"}`).css("display", "block");
              setTimeout(() => {
                $(`#${params.dataIndex + 'tooltip_two'}`).css('display', 'flex')
                $(`#${params.dataIndex + 'tooltip_one'}`).css('display', 'none')
              }, 1000)
              //         const htmlText = `
              // <div class="custom-tooltip-box">
              //   <div style="width: 72px; height: 72px">123</div>
              //   <div style="flex: 1; margin-left: 12px">
              //     <div style="height: 18px; width: 100%">4.08 ETH</div>
              //     <div style="height: 18px; width: 100%; margin: 6px 0">
              //       D4A@211/Canvas*57/NFT#149
              //     </div>
              //     <div style="height: 18px; width: 100%">Feb 17 at 08:45AM</div>
              //   </div>
              // </div>`;
              return htmlText
            } else {
              return ''
            }
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#E5E5E5',
            },
          },
        },
        xAxis: {
          type: 'time',
          min: function (value) {
            const das = dayjs(value.min).format('YYYY-MM-DD')
            return dayjs(das).unix() * 1000
          },
          max: function (value) {
            const das = dayjs(value.max).add(1, 'day').format('YYYY-MM-DD')
            // console.log(das, "das", value);
            return dayjs(das).unix() * 1000
          },
          splitNumber: 5,
          dataZoom: [
            {
              show: true,
              start: 0,
              end: 50,
            },
          ],
          axisLabel: {
            // interval: 2,
            color: '#9E9E9E',
            // formatter: "{MMM}{d}",
            // formatter: (value) => {
            //   console.log(value, "asd");
            //   const date = new Date(value);
            //   const mon = date.getMonth();
            //   const day = date.getDate();
            //   return `${months[mon]} ${day}`;
            // },
            formatter: '{MMM} {d}',
          },
          // axisTick: { alignWithLabel: true },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#6062AA',
            },
          },
          // data: this.chartData.xtime,
        },
        yAxis: {
          type: 'value',
          name: 'Price（ETH）',
          nameLocation: 'middle',
          nameGap: 70,
          nameRotate: 90,
          nameTextStyle: {
            color: '#9E9E9E',
            fontWeight: 500,
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: '#6062AA',
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },

          axisLabel: {
            color: '#9E9E9E',
          },
        },
        series: [
          {
            // type: "scatter",
            symbolSize: 8,
            itemStyle: {
              color: 'rgba(37, 176, 194, 0.6)',
            },
            data: this.chartData.xtime.map((item, idx) => {
              return [new Date(item * 1000), this.chartData.price[idx]]
            }),
            // data: this.chartData.price,
            type: 'effectScatter',
            showEffectOn: 'emphasis',
            rippleEffect: {
              //设置涟漪动画样式
              // color:'purple',
              // brushType:'fill'
              period: 3,
              scale: '3',
              brushType: 'fill',
            },
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
.chat-body {
  height: 440px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
}

::v-deep .custom-tooltip-box {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

::v-deep .skeleton__item {
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: el-skeleton-loading 1.4s ease infinite;
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
