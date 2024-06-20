<template>
  <div v-if="amountObj.daoAmount > 0" class="nei-box">
    <daos-item-card :list="list" :isAll="isAll" :isLoading="loading" />
  </div>
  <div v-else class="nodata">
    <p>No items found for this search</p>
    <div>
      <button class="btnle btnl" @click="back">Back to all items</button>
    </div>
  </div>
</template>

<script>
import DaosItemCard from '@/components/DaosItemCard.vue'
import { searchDaos } from '@/common/api'
export default {
  components: { DaosItemCard },
  props: {
    amountObj: {
      type: Object,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      pageSize: 20,
      pageNo: 1,
      isAll: false,
    }
  },
  watch: {
    $route: {
      handler(cur, old) {
        if (old && cur) {
          this.getData()
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    back() {
      this.$router.push({
        path: '/collections',
        query: {
          type: 'subNodes',
        },
      })
    },
    aPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
    },
    async getData() {
      this.list = []
      this.loading = true
      const data = await searchDaos(this.$route.query.query)
      const objDataList = data.dataList.map((item) => {
        return {
          ...item,
          activeName: 'currentMintWindowInformation',
        }
      })
      this.list = objDataList
      this.isAll = true
      this.loading = false
    },
  },
  beforeDestroy() {
    this.list = []
  },
}
</script>
<style scoped lang="scss">
.nei-box {
  margin-top: 24px;
}
.nodata {
  margin-top: 136px;
  text-align: center;

  p {
    font-size: 18px;
    color: #757575;
  }

  .btnle {
    width: 160px;
    height: 34px;
    background-color: #745cd4;
    color: #fff;
    font-size: 14px;
    margin-top: 28px;
    border: none;
    border-radius: 2px;
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
.svg-icon {
  font-size: 16px;
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
</style>
