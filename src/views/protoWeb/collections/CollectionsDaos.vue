<template>
  <div class="box">
    <div class="box-top">
      <!-- <div v-if="!isCardLeft" class="ilicon">
        <span @click="setQuery">
          <svg-icon icon-class="query" />
        </span>
      </div>
      <div class="llicon" v-else>
        <span @click="setQuery">
          <svg-icon icon-class="left" />
        </span>
      </div> -->
      <div class="irse">
        <el-select v-model="qvalue" @change="qvalueChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="box-bom">
      <div class="card-left" v-show="isCardLeft">
        <p style="margin-top: 24px">Price Range(ETH)</p>
        <div class="input-box">
          <el-input
            v-model="queryData.minInput"
            placeholder="Min"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+99)}"
          ></el-input>
          <span> to </span>
          <el-input
            v-model="queryData.maxInput"
            placeholder="Max"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+99)}"
          ></el-input>
        </div>
        <div class="box-btn">
          <button
            class="btn_query"
            :class="{
              isMainDisabled: !queryData.minInput && !queryData.maxInput,
            }"
            :disabled="!queryData.minInput && !queryData.maxInput"
            @click="apply"
          >
            Apply
          </button>
        </div>
      </div>
      <div class="cards" :style="{ width: cardWidth + 'px' }">
        <div class="cards-box">
          <div
            class="card-item hvr-grow"
            v-for="(item, idx) in list"
            :key="idx + 'a'"
          >
            <a
              :href="aPush(item)"
              style="text-decoration: none; position: absolute"
            >
              <div class="whitelist">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="DAO Creator applied special strategies."
                  placement="top"
                >
                  <span v-if="item.whiteList"
                    ><svg-icon icon-class="daokey"
                  /></span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="This logo means that the DAO has enabled Top-up Mode. In the Top-up mode, the ERC-20 Tokens obtained by minting is locked. Only after the user spends ETH on minting works under related DAOs will they receive the corresponding proportion of ERC-20 Tokenss."
                  placement="top"
                >
                  <span v-if="item.topupMode"
                    ><svg-icon icon-class="topup"
                  /></span>
                </el-tooltip>
              </div>
              <div class="card-img">
                <img :src="item.daoLogoUrl" alt="" />
              </div>
              <div class="item-bom">
                <h3>{{ item.daoName }}</h3>
                <div class="item-nums">
                  <!-- <div class="nums-left">
                    Price: <span class="lan">{{ item.price }} </span>
                    <svg-icon icon-class="eth" />
                  </div> -->
                  <div class="nums-right">
                    <!-- <span class="item-span">
                      <svg-icon icon-class="canvasesl" />
                      <span>{{ item.canvasAmount | numberFilter }}</span>
                    </span>
                    <span class="item-span">
                      <svg-icon icon-class="work" />
                      <span>{{ item.workAmount | numberFilter }}</span>
                    </span> -->
                    <span
                      class="item-span"
                      style="
                        position: absolute;
                        bottom: 14px;
                        right: 14px;
                        display: flex;
                        align-items: center;
                      "
                    >
                      <span @click.stop.prevent="setAmount(item, idx)">
                        <svg-icon
                          icon-class="shou"
                          :style="{ color: item.favorited ? '#ffa2a2' : '' }"
                        />
                      </span>
                      <span>{{ item.favoriteAmount | numberFilter }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <el-skeleton
            :loading="loading"
            animated
            :count="1"
            v-for="item in 20"
            :key="item + 'b'"
          >
            <template slot="template">
              <div
                style="
                  width: 396px;
                  height: 554px;
                  margin: 22px 8px;
                  background-color: #1b2233;
                "
              >
                <el-skeleton-item
                  variant="text"
                  style="width: 396px; height: 396px"
                />
                <div style="margin-top: 9px">
                  <el-skeleton-item
                    variant="h3"
                    style="width: 50%; display: block; margin: 0 auto"
                  />
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
        <div v-if="count === 0 && !loading" class="noData">
          No items to display
        </div>
        <div class="noList" v-if="isAll && count > 0">
          <div class="xian"></div>
          <div>All Contents Loaded</div>
          <div class="xian"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { daoCollections, favoriteActions, favoriteCancel } from "@/common/api";
export default {
  data() {
    return {
      loading: false,
      list: [],
      isApply: false,
      pageSize: 20,
      pageNo: 1,
      count: 0,
      isCardLeft: false,
      isAll: false,
      queryData: {
        minInput: undefined,
        maxInput: undefined,
      },
      qvalue: "0",
      options: [
        {
          value: "0",
          label: "Recently Listed",
        },
        {
          value: "1",
          label: "Most Favorited",
        },
        // {
        //   value: "2",
        //   label: "Price: High to Low",
        // },
        // {
        //   value: "3",
        //   label: "Price: Low to High",
        // },
      ],
    };
  },
  computed: {
    ...mapState(["ClientW", "User"]),
    cardWidth() {
      if (this.ClientW < 1648 + 20) {
        return this.isCardLeft ? 1236 - 412 : 1236;
      }
      if (this.ClientW >= 1648 && this.ClientW < 2060 + 20) {
        return this.isCardLeft ? 1648 - 412 : 1648;
      }
      if (this.ClientW >= 2060 && this.ClientW < 2472 + 20) {
        return this.isCardLeft ? 2060 - 412 : 2060;
      }
      return this.isCardLeft ? 2472 - 412 : 2472;
    },
  },
  created() {
    window.removeEventListener("scroll", this.lazyLoading, true);
    window.addEventListener("scroll", this.lazyLoading, true);
    this.loading = true;
    this.getData();
  },
  mounted() {},
  methods: {
    async setAmount(val, idx) {
      if (!this.User.address) {
        this.loginWallet();
        return;
      }
      const sig = await this.getSig();
      if (sig) {
        const query = {
          type: 0,
          favoriteId: val.daoId,
        };
        const res = val.favorited
          ? await favoriteCancel(query)
          : await favoriteActions(query);
        if (res) {
          const item = {
            ...val,
          };
          item.favoriteAmount += item.favorited ? -1 : 1;
          item.favorited = !item.favorited;
          val.favoriteAmount += item.favoriteAmount;
          val.favorited = item.favorited;
          this.$set(this.list, idx, item);
        }
      }
    },
    async getData() {
      const query = {
        sortCondition: this.qvalue,
        minPrice: this.isApply ? this.queryData.minInput : "",
        maxPrice: this.isApply ? this.queryData.maxInput : "",
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      const data = await daoCollections(query);
      this.list = this.list.concat(data.dataList);
      this.count = data.page.count;
      this.isAll = this.pageNo * this.pageSize >= this.count;
      this.loading = false;
      this.ifScrollHeight();
    },
    ifScrollHeight() {
      if (
        document.body.scrollHeight <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        !this.isAll
      ) {
        this.pageNo += 1;
        this.loading = true;
        this.getData();
      }
    },
    lazyLoading() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (this.pageNo * this.pageSize < this.count) {
        if (scrollHeight - clientHeight <= scrollTop + 560) {
          if (this.loading) return;
          this.pageNo += 1;
          this.loading = true;
          this.getData();
        }
      }
    },
    aPush(item) {
      // return `/dao?type=${item.daoStatus === 3 ? "nfts" : "unmintedWorks"}&id=${
      //   item.daoId
      // }`;
      return `/dao?type=nfts&id=${item.daoId}`;
    },
    goExploreUnmintedWorks(item) {
      const path = "nfts";
      this.$router.push({
        path: "/dao",
        query: {
          type: path,
          id: item.daoId,
        },
      });
    },
    setQuery() {
      this.isCardLeft = !this.isCardLeft;
    },
    qvalueChange() {
      this.list = [];
      this.pageNo = 1;
      this.loading = true;
      this.isAll = false;
      this.getData();
    },
    apply() {
      this.isApply = true;
      this.qvalue = "3";
      this.qvalueChange();
    },
  },
  beforeDestroy() {
    this.list = [];
    window.removeEventListener("scroll", this.lazyLoading, true);
  },
};
</script>
<style scoped lang="scss">
.box-bom {
  max-width: 2560px;
  min-width: 1240px;
  display: flex;
  margin: 0 auto;
}
.cards-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}
.noList {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbbaba;
  font-size: 18px;
  margin: 42px auto;
  .xian {
    height: 1px;
    width: 45px;
    background-color: #d9d9d9;
    margin: 0 15px;
  }
}
.box-top {
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
      font-size: 34px;
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

    ::v-deep .el-input__inner {
      background-color: #282f41;
      color: #fff;
      border-color: #282f41;
    }
  }
  ::v-deep .el-input__inner {
    width: 210px;
    height: 34px;
    font-size: 12px;
  }
}
.card-left {
  width: 272px;
  border-right: 1px solid #c5dadd;
  box-sizing: border-box;
  .box-btn {
    margin: 0 12px;
  }
  p {
    color: #757575;
    font-size: 14px;
    margin: 0;
    margin-left: 12px;
  }
  .input-box {
    display: flex;
    align-items: center;
    width: 248px;
    margin: 20px auto;
    ::v-deep .el-input__inner {
      border: 0;
    }
    span {
      margin: 0 auto;
      color: #757575;
      font-size: 14px;
    }
    ::v-deep .el-input {
      width: 98px;
    }
    ::v-deep .el-input__inner {
      width: 98px;
      background-color: #282f41;
      color: #fff;
    }
  }
}
.cards {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}
.card-item {
  width: 396px;
  height: 556px;
  margin: 22px 8px;
  cursor: pointer;
  box-sizing: border-box;
  .item-bom {
    height: 158px;
    background-color: #1b2233;
  }

  h3 {
    text-align: center;
    font-size: 20px;
    padding: 12px 14px;

    margin: 0;
    color: #9e9e9e;
    font-family: Inter5;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    width: 396px;
  }
  .item-text {
    font-size: 14px;
    color: #d9d9d9;
    font-family: Roboto4;
    line-height: 20px;
    margin: 0;
    padding: 0 14px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-wrap: break-word;
    word-break: break-all;
  }
  .item-code {
    padding: 0 14px;
    color: #9e9e9e;
    font-size: 12px;
    margin: 14px 0;
    span {
      font-family: Inter6;
    }
  }
  .item-nums {
    padding: 0 14px;
    color: #9e9e9e;
    display: flex;
    font-size: 12px;
    font-family: Inter5;
    .nums-right {
      margin-left: auto;
      .item-span {
        margin-left: 8px;
        .svg-icon {
          margin-right: 6px;
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

  .card-canverimg {
    width: 100%;
    height: 396px;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    div {
      width: 132px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 400ms ease 0s;
      }
    }
    .img1 {
      height: 396px;
    }
    .img2 {
      height: 350px;
    }
    .img3 {
      height: 300px;
    }
  }
}
.card-item:hover {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  // .whitelist {
  //   display: none;
  // }
}
.card-img {
  width: 100%;
  height: 396px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 400ms ease 0s;
  }
}
.el-select-dropdown__item {
  font-size: 12px;
}
.el-range-editor.is-active,
.el-range-editor.is-active:hover,
.el-select .el-input.is-focus .el-input__inner {
  border-color: #282f41 !important;
}

::v-deep .el-button--primary.is-disabled,
.el-button--primary.is-disabled:active,
.el-button--primary.is-disabled:focus,
.el-button--primary.is-disabled:hover {
  color: #fff;
  background-color: #a8dfe7;
  border-color: #a8dfe7;
}
::v-deep .el-button {
  width: 100%;
}
::v-deep .el-button--primary {
  color: #fff;
  background-color: #745cd4;
  border-color: #745cd4;
}
::v-deep .el-select .el-input__inner:focus {
  border-color: #282f41;
}
.lan {
  color: #745cd4;
  font-size: 14px;
}
::v-deep .el-skeleton__item {
  border-radius: 0 !important;
}
.svg-icon {
  font-size: 16px;
}
.svg-icon {
  color: #bababa;
}
.svg-icon:hover {
  color: #ffa2a2;
}
.whitelist {
  position: absolute;
  right: 14px;
  top: 14px;
  .svg-icon {
    font-size: 50px;
  }
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
.btn_query {
  width: 100%;
  display: flex;
  height: 33px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 2px;
  background: #745cd4;
  color: #f3f3f3;
  border-style: none;
}
.btn_query:active {
  background: #533fa1;
}
.isMainDisabled {
  background: #2e2555 !important;
  border-color: #2e2555 !important;
  cursor: no-drop !important;
}
.isMainDisabled:active {
  background: #533fa1;
}
.noData {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbbaba;
  font-size: 18px;
  margin: 42px auto;
}
</style>
