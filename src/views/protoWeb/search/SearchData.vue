<template>
  <loading v-if="isLoading" />
  <div class="searc-box" v-else>
    <div class="box-cards">
      <div class="card-item">
        <div class="item-left">Works ({{ amountObj.workAmount }})</div>
        <div class="item-center">
          <div class="center-card" v-if="workList.length > 0">
            <div
              class="ccard-item hvr-grow"
              v-for="(item, idx) in workList"
              :key="idx"
              :style="{ margin: idx === 1 ? '0 26px' : '0' }"
            >
              <a :href="aPush(item, 'work')" style="text-decoration: none">
                <div class="card-img-work">
                  <img :src="item.imgUrl" alt="" />
                </div>
                <div class="item-bom-work">
                  <div class="item-code" v-if="item.workStatus === 1">
                    {{ item.daoName }}.{{ item.workNumber }}
                  </div>
                  <div v-else>
                    <div class="item-code" v-if="item.generate === 1">
                      {{ item.daoName }}#Pass/Unminted
                    </div>
                    <div class="item-code" v-else>
                      {{ item.daoName }}#{{
                        item.creatorAddress | splitAddress
                      }}/Unminted
                    </div>
                  </div>
                  <div class="item-nums">
                    <div class="nums-left">
                      {{
                        item.unifiedPriceSet
                          ? 'Unified Price'
                          : item.fixedPrice
                          ? 'Fixed Price: '
                          : 'Price: '
                      }}
                      <span
                        v-if="
                          item.royaltyTokenPrice !== null &&
                          item.royaltyTokenPrice !== ''
                        "
                        class="flex-span"
                      >
                        <span class="lan"
                          >{{
                            item.royaltyTokenPrice | bigNumFormat(5, 0.00001)
                          }}
                        </span>
                        <svg-icon
                          :icon-class="item.erc20PaymentMode ? 'token' : 'eth'"
                        />
                      </span>
                      <span v-else class="flex-span">
                        <span class="lan"
                          >{{ item.price | bigNumFormat(5, 0.00001) }}
                        </span>
                        <svg-icon
                          :icon-class="
                            item.erc20PaymentMode ? 'tokenzi' : 'eth'
                          "
                        />
                      </span>
                    </div>
                    <div class="nums-right">
                      <span class="item-span">
                        <span
                          @click.stop.prevent="setAmount(item, idx, 'work')"
                        >
                          <svg-icon
                            icon-class="shou"
                            :style="{ color: item.favorited ? '#ffa2a2' : '' }"
                        /></span>
                        <span>{{ item.favoriteAmount | numberFilter }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div class="center-text" v-else>No items found for this search</div>
        </div>
        <div class="item-right">
          <span
            class="fontbtn"
            v-if="workList.length > 0"
            @click="tabsleClick('works')"
            >More <i class="el-icon-arrow-right"></i
          ></span>
        </div>
      </div>
      <div class="card-item">
        <div class="item-left">Nodes ({{ amountObj.daoAmount }})</div>
        <div class="item-center">
          <div class="center-card" v-if="daosList.length > 0">
            <div
              class="ccard-item hvr-grow"
              v-for="(item, idx) in daosList"
              :key="idx"
              :style="{ margin: idx === 1 ? '0 26px' : '0' }"
            >
              <a
                :href="aPush(item, 'dao')"
                style="text-decoration: none; position: absolute"
              >
                <div class="whitelist">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Nodes Creator applied special strategies."
                    placement="top"
                  >
                    <span v-if="item.whiteList"
                      ><svg-icon icon-class="daokey"
                    /></span>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="This logo means that the Nodes has enabled Top-up Mode. In the Top-up mode, the Nodes token obtained by minting is locked. Only after the user spends ETH on minting works under related Nodes will they receive the corresponding proportion of Nodes tokens."
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
                        <span @click.stop.prevent="setAmount(item, idx, 'dao')">
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
          </div>
          <div class="center-text" v-else>No items found for this search</div>
        </div>
        <div class="item-right">
          <span
            class="fontbtn"
            v-if="daosList.length > 0"
            @click="tabsleClick('daos')"
            >More <i class="el-icon-arrow-right"></i
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchAmount,
  favoriteActions,
  favoriteCancel,
  searchWorks,
  searchDaos,
} from '@/common/api'
import Loading from '@/components/Loading.vue'
export default {
  components: { Loading },
  data() {
    return {
      amountObj: { workAmount: 0, daoAmount: 0 },
      isLoading: true,
      workList: [],
      daosList: [],
    }
  },
  computed: {
    // ...mapState(['IsAllPaused']),
  },
  watch: {
    $route: {
      handler(cur, old) {
        if (old && cur) {
          this.isLoading = true
          this.getData()
        }
      },
      deep: true,
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      try {
        const data = await searchAmount(this.$route.query.query)
        const work = await searchWorks(this.$route.query.query, 3)
        const daos = await searchDaos(this.$route.query.query, 3)
        this.amountObj = data.data
        this.daosList = daos.dataList
        this.workList = work.dataList
        // this.workList = [
        //   {
        //     bgColor: "#FFFFFF",
        //     canvasNumber: 2,
        //     daoNumber: 214,
        //     favoriteAmount: 0,
        //     favorited: false,
        //     fixedPrice: true,
        //     height: 257,
        //     imgUrl: "https://image-test.dao4.art/work/W16896624083249060.png",
        //     price: "0.0202",
        //     royaltyTokenPrice: 0.00505,
        //     workDescription: "",
        //     workId: 740,
        //     workNumber: null,
        //   },
        // ];

        this.isLoading = false
      } catch (error) {
        this.daosList = []
        this.workList = []
        this.amountObj = { workAmount: 0, daoAmount: 0 }
        this.isLoading = false
      }
    },

    async setAmount(val, idx, type) {
      // if (e && e.preventDefault){
      //   e.preventDefault();
      // }
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      const sig = await this.getSig()
      if (sig) {
        let query = null
        if (type === 'dao') {
          query = {
            type: 0,
            favoriteId: val.daoId,
          }
        }
        if (type === 'work') {
          query = {
            type: 2,
            favoriteId: val.workId,
          }
        }
        const res = val.favorited
          ? await favoriteCancel(query)
          : await favoriteActions(query)
        if (res) {
          const item = {
            ...val,
          }
          if (type === 'dao') {
            item.favoriteAmount += item.favorited ? -1 : 1
            item.favorited = !item.favorited
            this.$set(this.daosList, idx, item)
          }
          if (type === 'work') {
            item.favoriteAmount += item.favorited ? -1 : 1
            item.favorited = !item.favorited
            this.$set(this.workList, idx, item)
          }
        }
      }
    },

    aPush(item, type) {
      if (type === 'work') {
        return `/workDetails?id=${item.workId}`
      }
      if (type === 'dao') {
        return `/dao?type=nfts&id=${item.daoId}`
      }
    },

    tabsleClick(activeName) {
      this.$router.push({
        path: '/search',
        query: {
          type: activeName,
          query: this.$route.query.query,
        },
      })
    },
  },
}
</script>
<style scoped lang="scss">
.searc-box {
  width: 100%;
}
.box-cards {
  width: 1240px;
  margin: 0 auto;
  margin-top: 24px;
}

.card-item {
  height: 460px;
  margin-bottom: 24px;
  background-color: #282f41;
  display: flex;

  .item-left {
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9e9e9e;
    font-size: 20px;
    font-weight: 800;
    font-family: Inter8;
  }

  .item-right {
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      color: #745cd4;
    }
    .fontbtn {
      color: #b3b5f2;
      cursor: pointer;
    }
  }

  .item-center {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .center-card {
    height: 416px;
    display: flex;
  }

  .center-text {
    width: 100%;
    font-size: 20px;
    color: #757575;
    font-family: Inter5;
    text-align: center;
  }
}

.ccard-item {
  cursor: pointer;
  margin: 8px;
  width: 280px;
  box-sizing: border-box;
  height: 416px;
  cursor: pointer;
  box-sizing: border-box;

  .item-bom-work {
    height: 86px;
    background-color: #1b2233;
    overflow: hidden;
  }

  .item-bom {
    height: 86px;
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
    width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .item-text {
    font-size: 14px;
    color: #bbbaba;
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
    color: #d9d9d9;
    font-size: 12px;
    margin: 32px 0px 10px 0px;

    span {
      font-family: Inter6;
    }

    .concert {
      color: #bbbaba;
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
      display: flex;
      align-items: center;

      .item-span {
        color: #9e9e9e;
        margin-left: 8px;

        .svg-icon {
          margin-right: 2px;
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

  .card-img-work {
    height: 330px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 400ms ease 0s;
    }
  }

  .card-img {
    width: 100%;
    height: 330px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 400ms ease 0s;
    }
  }

  .card-canverimg {
    width: 100%;
    height: 330px;
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
      height: 296px;
    }

    .img2 {
      height: 250px;
    }

    .img3 {
      height: 200px;
    }
  }
}

.ccard-item:hover {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  // .whitelist {
  //   display: none;
  // }
}

.nums-left {
  display: flex;
  align-items: flex-end;
}
.flex-span {
  display: flex;
  align-items: center;
}
.lan {
  color: #b3b5f2;
  font-size: 14px;
  max-width: 100px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 6px;
}

::v-deep .el-skeleton__item {
  border-radius: 0 !important;
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

.oldPrice {
  color: #757575;
  font-size: 12px;
  text-decoration: line-through;
}
</style>
