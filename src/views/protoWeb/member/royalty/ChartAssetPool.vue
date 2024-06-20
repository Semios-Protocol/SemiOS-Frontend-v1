<template>
  <div class="charts-box">
    <div class="chat-title">
      <h3>Price on Asset Pool</h3>
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.xdata && chartData.xdata.length > 0">
        <div id="ChartAssetPool" style="height: 390px" />
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
import ChartLoading from "@/components/ChartLoading.vue";
import ChartNoData from "@/components/ChartNoData.vue";
import { echarts } from "@/components/echarts";
import { assetPool } from "@/common/dexApi";
import { numToFilter, bigNumFormat } from "@/utils";
import dayjs from "dayjs";

export default {
  name: "ChartAssetPool",
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
      let _ref = document.getElementById("ChartAssetPool");
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
      const res = await assetPool(query);
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
          let _ref = document.getElementById("ChartAssetPool");
          this.myChart = _ref ? echarts.init(_ref) : null;
          this.newEcharts();
        }, 500);
      }
    },
    newEcharts() {
      const maxprice =
        Number(this.chartData.maxPrice) === 0
          ? 1
          : numToFilter(this.chartData.maxPrice);

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
              // interval: 0,
              formatter: (value) => {
                const date = new Date(value * 1000);
                const hou = date.getHours();
                const mon = date.getMonth();
                const day = date.getDate();
                const isDay = this.xTimeArr.filter((item) => item !== "");
                if (isDay.length < 7) {
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
            name: "",
            // interval: 50,
            max: maxprice,
            interval: maxprice / 5,
            splitLine: {
              lineStyle: {
                color: "#6062AA",
              },
            },
            min: 0,
            // axisLabel: {
            //   formatter: "{value} ",
            // },
            nameLocation: "middle",
            nameGap: 60,
            nameRotate: 90,
            nameTextStyle: {
              color: "#9E9E9E",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 22,
            },
            axisLabel: {
              color: "#9E9E9E",
              formatter: (value) => {
                return value >= 0 ? value : "";
              },
            },
          },
          {
            type: "value",
            name: "Volume",
            show: false,
            splitLine: {
              lineStyle: {
                color: "#6062AA",
              },
            },
            max: maxvolume * 5,
            min: 0,
            interval: maxvolume,
            nameLocation: "middle",
            nameGap: 50,
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
          },
        ],
        series: [
          {
            name: "Price（ETH）",
            type: "line",
            symbol: "circle",
            symbolSize: 1,
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
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
  margin-bottom: 20px;
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
