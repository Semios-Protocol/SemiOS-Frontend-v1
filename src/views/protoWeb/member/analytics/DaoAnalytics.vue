<template>
  <div
    class="box-ana"
    :style="{
      width: isMyDao ? '960px' : '100%',
      'min-width': isMyDao ? '960px' : '1240px',
    }"
  >
    <div class="query max-min">
      <div class="irse">
        <el-select v-model="qvalue" @change="qvalueChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <table-loading v-if="isLoading" />
    <div v-else>
      <activity-title :dayTime="qvalue" :daoObj="daoObj" />
      <chart-volume ref="chart_volume" :dayTime="qvalue" />
      <div class="flex-div">
        <div class="left-div">
          <transverse-nft />
        </div>
        <div class="right-div">
          <chart-mint ref="chart_mint" :dayTime="qvalue" />
        </div>
      </div>

      <div class="flex-div">
        <div class="left-div">
          <table-nft-owners />
        </div>
        <div class="right-div">
          <div>
            <transverse-owner />
          </div>
          <div>
            <chart-owners ref="chart_owners" :dayTime="qvalue" />
          </div>
        </div>
      </div>
      <div class="chart-footer"></div>
    </div>
  </div>
</template>

<script>
import TableLoading from "@/components/TableLoading.vue";
import ActivityTitle from "./AnalyticsTitle.vue";
import ChartVolume from "./ChartVolume.vue";
import ChartMint from "./ChartMint.vue";
import TransverseNft from "./TransverseNft.vue";
import TransverseOwner from "./TransverseOwner.vue";

import ChartOwners from "./ChartOwners.vue";
import TableNftOwners from "./TableNftOwners.vue";
export default {
  components: {
    TableLoading,
    ActivityTitle,
    ChartVolume,
    ChartMint,
    TransverseNft,
    TransverseOwner,
    ChartOwners,
    TableNftOwners,
  },
  props: {
    daoObj: {
      type: Object,
    },
    daoStatus: {
      type: Number,
    },
    startDate: {
      type: String,
    },
    isMyDao: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      qvalue: 90,
      options: [
        // {
        //   value: 1,
        //   label: "Last 1 days",
        //   disabled: false,
        // },
        // {
        //   value: 2,
        //   label: "Last 2 days",
        //   disabled: false,
        // },
        {
          value: 7,
          label: "Last 7 days",
          disabled: false,
        },
        {
          value: 30,
          label: "Last 30 days",
          disabled: false,
        },
        {
          value: 90,
          label: "Last 90 days",
          disabled: false,
        },
      ],
    };
  },

  created() {
    if (this.daoStatus === 1) {
      this.$router.push({
        path: "/404",
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.onresize = () => {
        this.$refs.chart_volume.reResizeFn();
        this.$refs.chart_mint.reResizeFn();
        // this.$refs.chart_canvas_mint.reResizeFn();
        // this.$refs.chart_canvas_trading.reResizeFn();
        this.$refs.chart_owners.reResizeFn();
      };
      // const day = (new Date() - new Date(this.startDate)) / 1000 / 60 / 60 / 24;
      // console.log(day, "day");
      // const maxday = Math.ceil(day);
      // if (maxday < 30) {
      //   this.options[1].disabled = true;
      //   this.options[2].disabled = true;
      // }
      // if (maxday < 90) {
      //   this.options[2].disabled = true;
      // }
    });
  },
  methods: {
    qvalueChange() {},
  },
};
</script>
<style scoped lang="scss">
.box-ana {
  max-width: 2560px;
  min-width: 1240px;
  margin: 0 auto;
  padding: 0 28px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.query {
  height: 108px;
  display: flex;
  align-items: center;

  .irse {
    margin-left: auto;
  }

  ::v-deep .el-input__inner {
    width: 210px;
    height: 34px;
    font-size: 12px;
  }
}

.flex-div {
  display: flex;
  margin-top: 20px;

  .right-div {
    width: 50%;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .left-div {
    width: 50%;
    padding-right: 10px;
    box-sizing: border-box;
  }
}

.flex-owners {
  display: flex;
  margin-top: 20px;

  .right-div {
    width: 50%;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .left-div {
    width: 50%;
    padding-right: 10px;
    box-sizing: border-box;
  }
}

.chart-footer {
  margin-top: 140px;
}
</style>
