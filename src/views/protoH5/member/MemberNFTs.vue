<template>
  <div class="box" ref="box">
    <div class="box-card max-min">
      <vue-waterfall-easy
        :imgsArr="list"
        :isAll="isAll"
        :is-loading="isLoading"
        :isNoData="noData"
        srcKey="imgUrl"
        @scrollReachBottom="handleReachBottom"
        card-class="cardStyle"
        @click="handleClick"
        :isNft="true"
      >
      </vue-waterfall-easy>
    </div>
  </div>
</template>

<script>
import vueWaterfallEasy from "@/components/vue-waterfall/waterfall";
import { daoNfts } from "@/common/api";
export default {
  components: {
    vueWaterfallEasy,
  },
  data() {
    return {
      noData: `No items to display`,
      isLoading: true,
      list: [],
      pageNo: 1,
      pageSize: 20,
      count: 0,
      isAll: false,
    };
  },
  created() {
    window.addEventListener("scroll", this.lazyLoading, true);
    this.getData();
  },
  mounted() {},
  methods: {
    async getData() {
      const query = {
        daoId: this.$route.query.id,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      const data = await daoNfts(query);
      this.list = this.list.concat(data.dataList);
      this.count = data.page.count;
      this.isAll =
        data.dataList.length === 0
          ? true
          : this.count === this.list.length
          ? true
          : false;
      this.isLoading = false;
      this.ifScrollHeight();
    },
    ifScrollHeight() {
      const height =
        document.getElementsByClassName("home-body")[0].scrollTop + 180;
      const clientHeight = document.documentElement.clientHeight * this.pageNo;

      if (height >= clientHeight && !this.isAll) {
        this.pageNo += 1;
        this.isLoading = true;
        this.getData();
      }
    },
    lazyLoading() {
      const height =
        document.getElementsByClassName("home-body")[0].scrollTop + 180;
      const clientHeight = document.documentElement.clientHeight * this.pageNo;

      if (!this.isAll) {
        if (height >= clientHeight) {
          if (this.isLoading) return;
          this.pageNo += 1;
          this.isLoading = true;
          this.getData();
        }
      }
    },
    handleReachBottom() {
      // this.imgsArr = this.imgsArr.concat(this.imgsArr);
      console.log("--this.imgsArr--", this.imgsArr);
    },
    handleClick(e, instance) {
      console.log("==handleClick===", e, instance);
    },
  },
  beforeDestroy() {
    this.list = [];
    window.removeEventListener("scroll", this.lazyLoading, true);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box-card {
  display: flex;
  margin: 0 auto;
}
.max-min {
  width: 100%;
  margin: 0 auto;
}
.query {
  height: 108px;
  display: flex;
  align-items: center;
  .ilicon {
    font-size: 24px;
    width: 272px;
    // border-right: 1px solid #c5dadd;
    // box-sizing: border-box;
    height: 100%;
    line-height: 108px;
    text-align: start;
    span {
      cursor: pointer;
    }
    .svg-icon {
      margin-left: 28px;
    }
  }
  .llicon {
    font-size: 24px;
    width: 272px;
    border-right: 1px solid #c5dadd;

    border-bottom: 1px solid #6062aa;
    box-sizing: border-box;
    height: 100%;
    line-height: 108px;
    text-align: end;
    span {
      cursor: pointer;
    }
    .svg-icon {
      margin-right: 12px;
      font-size: 34px;
    }
  }
  .irse {
    margin-left: auto;
    margin-right: 28px;
  }
  ::v-deep .el-input__inner {
    width: 210px;
    height: 34px;
    font-size: 12px;
  }
}
.title {
  height: 360;
}
.item {
  // border: 1px solid #ac0;
  width: 260px;
  margin: 0 8px;
}
.masonry-container {
  /* width: 55%; */
  position: relative;
  overflow: hidden;
}

.el-select-dropdown__item {
  font-size: 12px;
}
.el-range-editor.is-active,
.el-range-editor.is-active:hover,
.el-select .el-input.is-focus .el-input__inner {
  border-color: #c0c4cc !important;
}

::v-deep .el-button {
  width: 100%;
}
::v-deep .el-select .el-input__inner:focus {
  border-color: #c0c4cc;
}
</style>
