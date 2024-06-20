<template>
  <div class="charts-box">
    <div class="chat-title">
      <h3>Price on Liquidity</h3>
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.xdata && chartData.xdata.length > 0">
        <div id="ChartPriceLiquidity" style="height: 312px"></div>
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
import { echarts } from "@/components/echarts";
import { priceFoldLine } from "@/common/dexApi";
import ChartLoading from "@/components/ChartLoading.vue";
import ChartNoData from "@/components/ChartNoData.vue";
import { numToFilter, bigNumFormat } from "@/utils";
import dayjs from "dayjs";
import { BigNumber } from "bignumber.js";
export default {
  name: "ChartPriceLiquidity",
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
  },
  watch: {
    dayTime() {
      this.getData();
    },
    address() {
      this.getData();
    },
  },
  data() {
    return {
      chartData: {},
      myChart: null,
      isLoading: true,
      xTimeArr: [],
    };
  },
  mounted() {
    this.isLoading = true;
    this.chartData = {};
    this.getData();
  },
  methods: {
    reResizeFn() {
      let _ref = document.getElementById("ChartPriceLiquidity");
      let myEchars = _ref ? echarts.getInstanceByDom(_ref) : undefined;
      if (myEchars !== undefined) {
        myEchars.resize();
      }
    },
    async getData() {
      let timeArr = [];
      this.xTimeArr = [];
      this.isLoading = true;
      const query = { erc20Address: this.address, dayTime: this.dayTime };
      const res = await priceFoldLine(query);
      timeArr = res.data.time.map((item) => {
        return dayjs(item * 1000).format("YYYY-MM-DD");
      });
      timeArr.forEach((ele) => {
        if (this.xTimeArr.indexOf(ele) > -1) {
          this.xTimeArr.push("");
        } else {
          this.xTimeArr.push(ele);
        }
      });
      this.chartData = {
        xdata: res.data.time,
        yadata: res.data.volume,
        ybdata: res.data.price,
        maxVolume: res.data.maxVolume,
        maxPrice: res.data.maxPrice,
      };

      // this.chartData = {
      //   xdata: [
      //     1685239200, 1685242800, 1685246400, 1685250000, 1685253600,
      //     1685257200, 1685260800,
      //   ],
      //   yadata: ["0", "0.000103080924304503", "0.001", "0", "0", "0", "0"],
      //   ybdata: [
      //     "0.0000015",
      //     "0.000001566374",
      //     "0.00000145145",
      //     "0.0000015",
      //     "0.000001566689",
      //     "0.0000015",
      //     "0.0000015",
      //   ],
      //   maxVolume: "0.001",
      //   maxPrice: "0.000001566689",
      // };
      this.isLoading = false;
      if (
        this.chartData &&
        this.chartData.xdata &&
        this.chartData.xdata.length > 0
      ) {
        setTimeout(() => {
          if (this.myChart) {
            this.myChart.dispose();
          }
          this.myChart = null;
          let _ref = document.getElementById("ChartPriceLiquidity");
          this.myChart = _ref ? echarts.init(_ref) : null;
          this.newEcharts();
        }, 500);
      }
    },
    numFormat(value, type, num = 5) {
      if (type === 1) {
        return new BigNumber(value).times(num).toNumber();
      } else {
        return new BigNumber(value).div(num).toNumber();
      }
    },
    newEcharts() {
      let y2num = 1;
      const arr = this.chartData.maxPrice.toString().split(".");
      const maxprice =
        Number(this.chartData.maxPrice) === 0
          ? 1
          : numToFilter(this.chartData.maxPrice);
      if (arr.length > 1) {
        const abr = arr[1].split("");
        // abr.filter(item=>)
        const index = abr.findIndex((item) => Number(item) > 0);
        y2num = `1e${index + 2}`;
      }

      console.log(y2num, "y2num");
      //  numToFilter(this.chartData.maxPrice);
      // const maxvolume = numToFilter(this.chartData.maxVolume);
      const maxvolume =
        Number(this.chartData.maxVolume) === 0
          ? 1
          : numToFilter(this.chartData.maxVolume);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      this.option = {
        grid: {
          top: "10%",
          left: "8%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: "axis",
          triggerOn: "mousemove",
          axisPointer: {
            crossStyle: {
              color: "#999",
            },
          },
          formatter: function (params) {
            const date = dayjs(params[0].name * 1000).format(
              "DD/MM/YYYY HH:mm:ss "
            );
            return `${params[0].marker}Price:${bigNumFormat(
              params[0].value,
              12,
              0.000000000001
            )}<br/>${params[1].marker}Volume: ${bigNumFormat(
              params[1].value,
              6,
              0.000001
            )}<br/>${date}`;
          },
        },
        xAxis: [
          {
            type: "category",
            data: this.chartData.xdata,
            axisLabel: {
              color: "#9E9E9E",
              hideOverlap: true,
              showMaxLabel: true,
              // interval: 0,
              formatter: (value) => {
                const date = new Date(value * 1000);
                const hou = date.getHours();
                const mon = date.getMonth();
                const day = date.getDate();
                const isDay = this.xTimeArr.filter((item) => item !== "");
                if (isDay.length <= 7) {
                  return `${months[mon]} ${day} ${hou}:00`;
                } else {
                  return `${months[mon]} ${day}`;
                }
              },
            },
            axisTick: { alignWithLabel: true },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: "#6062AA",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Price（ETH）",
            // interval: 50,
            max: maxprice,
            interval: this.numFormat(maxprice, 2),
            min: 0,
            // axisLabel: {
            //   formatter: "{value} ",
            // },
            nameLocation: "middle",
            nameGap: 75,
            nameRotate: 90,
            axisLabel: {
              formatter: (value) => {
                return value >= 0 ? value : "";
              },
            },
            splitLine: {
              lineStyle: {
                color: "#6062AA",
              },
            },
          },
          {
            type: "value",
            name: "Volume",
            show: false,
            max: this.numFormat(maxvolume, 1),
            min: 0,
            interval: maxvolume,
            nameLocation: "middle",
            nameRotate: 270,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#6062AA",
              },
            },
          },
        ],
        series: [
          {
            name: "Price（ETH）",
            type: "line",
            symbol: "circle",
            symbolSize: 1,
            // yAxisIndex: 1,
            itemStyle: {
              color: "#87D3DE",
              borderColor: "#87D3DE",
            },
            lineStyle: {
              color: "#87D3DE",
            },
            data: this.chartData.ybdata,
          },
          {
            name: "Volume",
            type: "bar",
            barMaxWidth: 40,
            yAxisIndex: 1,
            itemStyle: {
              color: "#DCE0E1",
            },
            data: this.chartData.yadata,
          },
        ],
      };
      if (this.myChart) {
        this.myChart.setOption(this.option, true);
      }
    },
  },
  destroyed() {
    this.chartData = {};
    if (this.myChart) {
      this.myChart.dispose();
    }
    this.myChart = null;
  },
};
</script>

<style scoped lang="scss">
.charts-box {
  // box-sizing: border-box;
  // border: 1px solid #6062AA;
  // border-radius: 2px;
  // margin-bottom: 20px;
  height: 360px;
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
