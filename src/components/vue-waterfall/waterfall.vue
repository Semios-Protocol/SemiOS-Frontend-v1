<template>
  <div
    class="vue-waterfall-container"
    :style="{
      width: '100%',
      height: parseFloat(height) == height ? height + 'px' : height,
    }"
  >
    <div class="vue-waterfall-scroll" ref="scrollEl" :style="{ width: '100%' }">
      <slot name="waterfall-head" />
      <div class="vue-waterfall" :style="{ height: colHeight + 'px' }">
        <div
          class="img-box"
          v-for="(item, index) in imgsArr_c"
          :key="index"
          :class="[cardAnimationClass, { __err__: item._error }]"
          :style="{
            width: isMobile ? '' : colWidth + 'px',
          }"
        >
          <div
            class="card-box hvr-grow"
            @click="handleClickImage(item.workId)"
            v-if="!isDelete"
          >
            <div class="img-box-header" v-if="hasHeaderSlot">
              <slot name="header" :data="item" />
            </div>
            <component class="img-inner-box" :is="linkName" :data-index="index">
              <div
                :style="{
                  'background-color': item.bgColor,
                  height: item.height + 'px',
                }"
              >
                <img
                  :src="item[srcKey]"
                  style="
                    width: 100%;
                    background-color: #f5f5f5;
                    object-fit: cover;
                    height: 100%;
                  "
                />
              </div>
              <span class="span-pos" v-if="isDelete">
                <svg-icon
                  :icon-class="
                    deleteIds.indexOf(item.workId) > -1 ? 'caryes' : 'carno'
                  "
                />
              </span>
            </component>
            <div class="img-box-footer">
              <!-- <h3>{{ item.workDescription }}</h3> -->

              <div class="item-text" v-if="item.workStatus === 1">
                {{ item.daoName }}.{{ item.workNumber }}
              </div>
              <div v-else>
                <div class="item-text" v-if="item.generate === 1">
                  {{ item.daoName }}#Pass/Unminted
                </div>
                <div class="item-text" v-else>
                  {{ item.daoName }}#{{
                    item.creatorAddress | splitAddress
                  }}/Unminted
                </div>
              </div>
              <div class="item-nums">
                <div
                  class="nums-left"
                  :class="item.fixedPrice ? 'fixedPrice' : ''"
                >
                  {{
                    item.unifiedPriceSet
                      ? "Unified Price"
                      : item.fixedPrice
                      ? "Fixed Price: "
                      : "Price: "
                  }}
                  <span
                    class="lan"
                    v-if="
                      item.royaltyTokenPrice !== null &&
                      item.royaltyTokenPrice !== ''
                    "
                    >{{ item.royaltyTokenPrice | bigNumFormat(5, 0.00001) }}
                  </span>
                  <span class="lan" v-else
                    >{{ item.price | bigNumFormat(5, 0.00001) }}
                  </span>

                  <span
                    class="oldPrice"
                    v-if="
                      item.royaltyTokenPrice !== null &&
                      item.royaltyTokenPrice !== ''
                    "
                    >{{ item.price }}
                  </span>
                  <svg-icon icon-class="eth" />
                </div>
                <!-- <div class="nums-left">
                  Fixed Price
                  <span class="lan"
                    >{{ item.price | bigNumFormat(5, 0.00001) }}
                  </span>
                  <svg-icon icon-class="eth" />
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flexbox" v-if="imgLoading">
      <div class="sk-circle-bounce">
        <div class="sk-child sk-circle-1"></div>
        <div class="sk-child sk-circle-2"></div>
        <div class="sk-child sk-circle-3"></div>
        <div class="sk-child sk-circle-4"></div>
        <div class="sk-child sk-circle-5"></div>
        <div class="sk-child sk-circle-6"></div>
        <div class="sk-child sk-circle-7"></div>
        <div class="sk-child sk-circle-8"></div>
        <div class="sk-child sk-circle-9"></div>
        <div class="sk-child sk-circle-10"></div>
        <div class="sk-child sk-circle-11"></div>
        <div class="sk-child sk-circle-12"></div>
      </div>
    </div>

    <div v-if="imgsArr.length === 0 && !imgLoading" class="noData">
      {{ isNoData }}
    </div>

    <div class="noList" v-if="isAll && imgsArr.length > 0 && !imgLoading">
      <div class="xian"></div>
      <div>All Contents Loaded</div>
      <div class="xian"></div>
    </div>
  </div>
</template>

<script>
import Link from "./link.vue";
import _ from "lodash";
import { mapState } from "vuex";
export default {
  name: "pt-vue-waterfall",
  props: {
    isNft: {
      type: Boolean,
      default: false,
    },
    isNoData: {
      type: String,
      default: "No items to display",
    },
    isPage: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isAll: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
    },
    height: {
      type: [Number, String],
    },
    isCardLeft: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    daoStatus: {
      type: Number,
      default: 0,
    },
    cardWidth: {
      type: Number,
      default: 1024,
    },
    loadingDotCount: {
      type: Number,
      default: 3,
    },
    loadingDotStyle: {
      type: Object,
    },
    srcKey: {
      type: String,
      default: "src",
    },
    imgWidth: {
      type: Number,
      default: 260,
    },
    gap: {
      type: Number,
      default: 16,
    },
    mobileGap: {
      type: Number,
      default: 12,
    },
    deleteIds: {
      type: Array,

      default: () => [],
    },
    imgsArr: {
      type: Array,
      required: true,
    },
    maxCols: {
      type: Number,
      default: 8,
    },
    cardAnimationClass: {
      type: [String],
      default: "default-card-animation",
    },
    cardClass: {
      type: [String],
      default: "",
    },
    enablePullDownEvent: {
      type: Boolean,
      default: false,
    },
    reachBottomDistance: {
      type: Number, // selector
      default: 20,
    },
  },
  data() {
    return {
      isMobile: true,
      imgsArr_c: [],
      cols: NaN,
      loadedCount: 0,
      isFirstLoad: true,
      imgBoxEls: null,
      beginIndex: 0,
      colsHeightArr: [],
      linkName: "Link",
      maxHeight: 0,
      topArr: [],
      heightArr: [],
      imgLoading: true,
      newImgsArr: [],
    };
  },
  components: {
    Link,
  },
  computed: {
    ...mapState(["MetaMaskAddress", "User"]),
    hasFooterSlot() {
      return !!this.$scopedSlots.footer;
    },
    hasHeaderSlot() {
      return !!this.$scopedSlots.header;
    },
    bodyWidth() {
      if (this.isCardLeft) {
        return this.cardWidth - 272;
      } else {
        return this.cardWidth;
      }
    },
    imgWidth_c() {
      return this.isMobile ? window.innerWidth / 2 : this.imgWidth;
    },
    gap_c() {
      return this.isMobile ? this.mobileGap : this.gap;
    },
    colWidth() {
      return this.imgWidth_c + this.gap_c;
    },
    colHeight() {
      // const sortArr = this.heightArr.sort((x, y) => y - x)
      // const line = Math.ceil(this.heightArr.length / this.cols)
      const maxH = _.max(this.heightArr);
      const maxTop = _.max(this.topArr);
      if (maxH > maxTop) {
        if (maxH > 2 * maxTop) {
          return maxH + maxTop;
        } else {
          return maxH + maxTop + 200;
        }
      } else {
        // return maxTop + 200 + this.heightArr[this.heightArr.length - 1];
        const start =
          this.heightArr.length > this.cols
            ? this.heightArr.length - this.cols
            : 0;
        const maxHeight =
          this.heightArr.length > 0
            ? _.max(this.heightArr.slice(start, this.heightArr.length))
            : 0;
        return _.isFinite(maxTop + maxHeight) ? maxTop + maxHeight : 0;
      }

      // return maxTop + maxHeight;
    },
  },
  watch: {
    imgsArr(newVal) {
      if (!this.isPage) {
        if (
          this.imgsArr_c.length > newVal.length ||
          (this.imgsArr_c.length > 0 && newVal[0] && !newVal[0].height)
        ) {
          this.reset();
        }
      } else {
        this.reset();
      }
      this.preload();
    },
    isCardLeft() {
      this.response();
    },
    isLoading(cur) {
      if (cur) {
        this.imgLoading = true;
      }
    },
    isAll(cur) {
      if (cur) {
        this.imgLoading = false;
      }
    },
  },
  methods: {
    preload() {
      if (this.imgsArr.length === 0) {
        this.$emit("preloaded");
      }
      const newArr = this.imgsArr.filter(
        (item) => !this.imgsArr_c.some((ele) => ele.workId === item.workId)
      );
      const clientWidth = parseInt((document.body.clientWidth - 80) / 2);
      const newheightArr = newArr.map((item) => {
        return {
          ...item,
          height: parseInt((clientWidth / 260) * item.height),
        };
      });
      this.newImgsArr = this.newImgsArr.concat(newheightArr);
      this.newImgsArr.forEach((imgItem, imgIndex) => {
        if (imgIndex < this.loadedCount) return;
        this.loadedCount++;
        if (this.loadedCount === this.newImgsArr.length) {
          this.$emit("preloaded");
        }
      });
    },
    calcuCols() {
      let waterfallWidth = this.width ? this.width : this.bodyWidth;
      let cols = Math.max(parseInt(waterfallWidth / this.colWidth), 1);
      let co = Math.min(cols, this.maxCols);
      // return this.isMobile ? 2 : Math.min(cols, this.maxCols);
      return co >= 4 ? co : 3;
    },
    waterfall() {
      this.imgBoxEls = this.$el.getElementsByClassName("img-box");
      if (!this.imgBoxEls || this.imgBoxEls.length === 0) return;
      let top,
        left,
        height,
        colWidth = this.isMobile
          ? this.imgBoxEls[0].offsetWidth
          : this.colWidth;
      if (this.beginIndex === 0) {
        this.colsHeightArr = [];
        this.heightArr = [];
        this.maxHeight = 0;
        this.topArr = [];
      }
      for (let i = this.beginIndex; i < this.newImgsArr.length; i++) {
        if (!this.imgBoxEls[i]) return;
        height = this.imgBoxEls[i].offsetHeight;
        this.heightArr.push(height);
        this.maxHeight += height;
        if (i < this.cols) {
          this.colsHeightArr.push(height);
          top = 0;
          left = i * colWidth;
        } else {
          let minHeight = Math.min.apply(null, this.colsHeightArr);
          let minIndex = this.colsHeightArr.indexOf(minHeight);
          top = minHeight;
          left = minIndex * colWidth;
          this.colsHeightArr[minIndex] = minHeight + height;
        }
        this.imgBoxEls[i].style.left = left + "px";
        this.imgBoxEls[i].style.top = top + "px";
        this.topArr.push(top);
      }
      this.beginIndex = this.newImgsArr.length;
    },
    response() {
      let old = this.cols;
      this.cols = 2;
      if (old === this.cols) return;
      this.beginIndex = 0;
      this.waterfall(1);
    },

    aPush(item) {
      return `/workDetails?id=${item.workId}`;
    },
    handleClickImage(id) {
      if (this.isDelete) {
        this.$emit("handleClickImage", id);
        return;
      } else {
        this.$router.push({
          path: "/workDetails",
          query: {
            id: id,
          },
        });
      }
      // if (this.daoStatus !== 3) {
      //   this.$router.push({
      //     path: "/workDetails",
      //     query: {
      //       id: id,
      //     },
      //   });
      // } else {
      //   this.openMessageTips(
      //     "DAO reaches limit, no NFTs can be minted",
      //     "",
      //     "error",
      //     null
      //   );
      // }
    },
    footerHeight() {},
    reset() {
      this.imgsArr_c = [];
      this.newImgsArr = [];
      this.beginIndex = 0;
      this.loadedCount = 0;
      this.isFirstLoad = true;
      this.topArr = [];
      this.heightArr = [];
    },
  },
  mounted() {
    // this.isMobile = isMobile();
    this.preload();
    this.cols = 2;
    this.$on("preloaded", () => {
      this.isFirstLoad = false;
      this.imgsArr_c = this.newImgsArr.concat([]);
      this.imgLoading = false;
      this.$nextTick(() => {
        this.waterfall(0);
      });
    });
    if (!this.isMobile && !this.width)
      window.addEventListener("resize", this.response);
    if (this.isMobile && this.enablePullDownEvent) this.pullDown();
    // this.scroll();
  },
};
</script>

<style scoped lang="scss">
.noList {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3f3f3;
  text-align: center;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  width: 90%;
  margin: 24px auto;
  .xian {
    height: 1px;
    width: 45px;
    background-color: #d9d9d9;
    margin: 0 15px;
  }
}
.vue-waterfall-container {
  margin: 0 auto;
  .vue-waterfall-scroll {
    width: 100%;
    // position: relative;
    // height: 100%;
    // overflow-x: hidden;
    // overflow-y: scroll;
    // -webkit-overflow-scrolling: touch;

    height: auto;
    overflow: auto;
    margin: 0 auto;
  }
  .card-box {
    cursor: pointer;
    padding: 6px;
    width: 100%;
    // border: 0.5px solid #c5dadd;
    box-sizing: border-box;
  }
  .card-box:hover {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  }
  .vue-waterfall {
    position: relative;
    overflow: hidden;
    // height: 2230px;

    @keyframes show-card {
      0% {
        transform: scale(0.5);
      }
      100% {
        transform: scale(1);
      }
    }

    .img-box {
      position: absolute;
      box-sizing: border-box;
      width: 50%; //移动端生效
      .img-box-footer {
        height: 86px;
        // border: 0.5px solid #c5dadd;
        // box-sizing: border-box;
        // border-top: none;
        background-color: #282f41;

        .item-bom {
          border: 1px solid #c5dadd;
          box-sizing: border-box;
          border-top: none;
          height: 160px;
        }
        h3 {
          text-align: center;
          font-size: 14px;
          margin: 0;
          margin-bottom: 10px;
          padding: 0 12px;
          padding-top: 6px;
          color: #9e9e9e;
          height: 20px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          font-family: Roboto7;
          word-break: break-all;
        }
        .item-text {
          color: #999;
          font-family: Roboto;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          line-height: 18px;
          word-wrap: break-word;
          padding: 8px 6px;
          box-sizing: border-box;
        }
        .item-nums {
          padding: 0 6px;
          color: #999;
          font-family: Roboto;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          position: fixed;
          bottom: 16px;
          .nums-right {
            margin-left: auto;
            .item-delete {
              color: #745cd4;
              cursor: pointer;
            }
            .item-span {
              margin-left: 5px;
              .svg-icon {
                margin-right: 5px;
              }
            }
          }
          // .item-span {
          //   font-size: 12px;
          //   span {
          //     color: #745CD4;
          //   }
          // }
          // padding-bottom: 24px;
        }
      }
      &.default-card-animation {
        animation: show-card 0.4s;
        transition: left 0.6s, top 0.6s;
        transition-delay: 0.1s;
      }

      .img-inner-box {
        // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        // border: 0.5px solid #c5dadd;
        // box-sizing: border-box;
        // border-bottom: none;
        border-radius: 4px;
        display: block;
        position: relative;

        & > img {
          width: 100%;
          display: block;
          border: none;
        }
      }
    }
  }
}
.lan {
  color: #f3f3f3;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}
.oldPrice {
  color: #757575;
  font-size: 12px;
  text-decoration: line-through;
}
.span-pos {
  position: absolute;
  right: 10px;
  top: 10px;
  .svg-icon {
    font-size: 34px;
  }
}
.svg-icon {
  font-size: 16px;
}

.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
}
.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  -webkit-transform: scale(1.01);
  transform: scale(1.01);
}

.flexbox {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  .sk-circle-bounce {
    width: 4em;
    height: 4em;
    position: relative;
    margin: auto;
  }
  .sk-circle-bounce .sk-child {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .sk-circle-bounce .sk-child:before {
    content: "";
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #745cd4;
    border-radius: 100%;
    -webkit-animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
    animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
  }
  .sk-circle-bounce .sk-circle-2 {
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg);
  }
  .sk-circle-bounce .sk-circle-3 {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  .sk-circle-bounce .sk-circle-4 {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .sk-circle-bounce .sk-circle-5 {
    -webkit-transform: rotate(120deg);
    transform: rotate(120deg);
  }
  .sk-circle-bounce .sk-circle-6 {
    -webkit-transform: rotate(150deg);
    transform: rotate(150deg);
  }
  .sk-circle-bounce .sk-circle-7 {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .sk-circle-bounce .sk-circle-8 {
    -webkit-transform: rotate(210deg);
    transform: rotate(210deg);
  }
  .sk-circle-bounce .sk-circle-9 {
    -webkit-transform: rotate(240deg);
    transform: rotate(240deg);
  }
  .sk-circle-bounce .sk-circle-10 {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  .sk-circle-bounce .sk-circle-11 {
    -webkit-transform: rotate(300deg);
    transform: rotate(300deg);
  }
  .sk-circle-bounce .sk-circle-12 {
    -webkit-transform: rotate(330deg);
    transform: rotate(330deg);
  }
  .sk-circle-bounce .sk-circle-2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  .sk-circle-bounce .sk-circle-3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
  .sk-circle-bounce .sk-circle-4:before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }
  .sk-circle-bounce .sk-circle-5:before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }
  .sk-circle-bounce .sk-circle-6:before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }
  .sk-circle-bounce .sk-circle-7:before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }
  .sk-circle-bounce .sk-circle-8:before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }
  .sk-circle-bounce .sk-circle-9:before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }
  .sk-circle-bounce .sk-circle-10:before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }
  .sk-circle-bounce .sk-circle-11:before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }
  .sk-circle-bounce .sk-circle-12:before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }

  @-webkit-keyframes sk-circle-bounce-delay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes sk-circle-bounce-delay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
}
.svg-icon {
  color: #bababa;
}
.svg-icon:hover {
  color: #ffa2a2;
}
.fixedPrice {
  color: #745cd4;
}
</style>
