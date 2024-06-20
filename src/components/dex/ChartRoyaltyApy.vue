<template>
  <div class="charts-box">
    <div class="chat-title">
      <h3>Royalty APY</h3>
    </div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div v-else class="chart-body">
      <div v-show="chartData && chartData.xdata && chartData.xdata.length > 0">
        <div id="ChartRoyaltyApy" style="height: 312px"></div>
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
import { getApy } from "@/common/dexApi";
import ChartLoading from "@/components/ChartLoading.vue";
import ChartNoData from "@/components/ChartNoData.vue";
import _ from "lodash";
// import { numToFilter } from "@/utils";
import dayjs from "dayjs";
export default {
  name: "ChartRoyaltyApy",
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
    };
  },
  mounted() {
    this.isLoading = true;
    this.chartData = {};
    this.getData();
  },
  methods: {
    reResizeFn() {
      let _ref = document.getElementById("ChartRoyaltyApy");
      let myEchars = _ref ? echarts.getInstanceByDom(_ref) : undefined;
      if (myEchars !== undefined) {
        myEchars.resize();
      }
    },
    async getData() {
      this.isLoading = true;
      const query = { erc20Address: this.address, dayTime: this.dayTime };
      const res = await getApy(query);
      const arr = _.orderBy(_.uniq([...res.data.time, ...res.data.dottedTime]));
      const length = res.data.apy.length;
      const newArr = length > 0 ? new Array(length - 1) : [];
      const curArr = [...newArr, ...res.data.dottedApy];
      this.chartData = {
        xdata: arr,
        yadata: res.data.apy,
        ybdata: curArr,
        maxVolume: res.data.maxApy,
      };
      // this.chartData = {
      //   xdata: [
      //     "1682309220",
      //     "1682352000",
      //     "1682438400",
      //     "1682524800",
      //     "1682611200",
      //     "1682711200",
      //     "1682811200",
      //     "1682911200",
      //     "1683011200",
      //   ],
      //   seriesData: [
      //     [150, 230, 224, 218, 135, 147, "", "", ""],
      //     ["", "", "", "", "", 147, 240, 135, 147],
      //   ],
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
          let _ref = document.getElementById("ChartRoyaltyApy");
          this.myChart = _ref ? echarts.init(_ref) : null;
          this.newEcharts();
        }, 500);
      }
    },
    newEcharts() {
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
        color: ["#B3B5F2"],
        grid: {
          top: "12%",
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
            const value = params[0].value ? params[0].value : params[1].value;
            return `${params[0].marker}APY: ${value}%<br/>${date}`;
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            // interval: 2,
            color: "#9E9E9E",
            formatter: (value) => {
              const date = new Date(value * 1000);
              const mon = date.getMonth();
              const day = date.getDate();
              return `${months[mon]} ${day}`;
              // return liangTools.unix2hm(value)
            },
          },
          axisTick: { alignWithLabel: true },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#6062AA",
            },
          },
          data: this.chartData.xdata,
        },
        yAxis: {
          name: "APY",
          nameLocation: "middle",
          nameGap: 50,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            // interval: 2,
            color: "#9E9E9E",
            formatter: (value) => {
              return `${value}%`;
            },
          },
          splitLine: {
            lineStyle: {
              color: "#6062AA",
            },
          },
        },
        series: [
          {
            data: this.chartData.yadata,
            type: "line",
            showSymbol: false,
          },
          {
            data: this.chartData.ybdata,
            type: "line",
            showSymbol: false,
            lineStyle: {
              width: 2,
              type: "dotted",
            },
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
  height: 100%;
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
