<template>
  <div class="box-body">
    <div class="body-title">Favorite Nodes</div>
    <loading v-if="isLoading" />
    <div v-else>
      <div class="box-bom">
        <daos-item-card :list="list" />
      </div>
      <el-pagination
        v-if="total > 0"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="getData"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DaosItemCard from '@/components/DaosItemCard.vue'
import Loading from '@/components/Loading.vue'
import { favoriteDao, favoriteActions, favoriteCancel } from '@/common/api'
export default {
  components: { DaosItemCard, Loading },
  data() {
    return {
      list: [],
      isLoading: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  created() {
    this.getData()
  },
  methods: {
    async setAmount(val, idx) {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      const sig = await this.getSig()
      if (sig) {
        const query = {
          type: 0,
          favoriteId: val.daoId,
        }
        const res = val.favorited
          ? await favoriteCancel(query)
          : await favoriteActions(query)
        if (res) {
          const item = {
            ...val,
          }
          item.favoriteAmount += item.favorited ? -1 : 1
          item.favorited = !item.favorited
          this.$set(this.list, idx, item)
        }
      }
    },
    async getData() {
      try {
        this.list = []
        this.isLoading = true
        const query = {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
        }
        const data = await favoriteDao(query)
        // const data = {
        //   resultCode: 100,
        //   resultDesc: "success",
        //   dataList: [
        //     {
        //       daoId: 105,
        //       projectId:
        //         "0x1c77b12b4f90d4160e7e34b8703cfae50e181e5887f5891767e5477eedca6adc",
        //       daoName: "20240109 Ft",
        //       daoLogoUrl:
        //         "https://image-test.protodao.io/dao/dao_default_logo.png",
        //       daoDescription: "asd",
        //       daoManitesto: "asd",
        //       daoNumber: 333,
        //       erc20Name: "20240109 Ft",
        //       mintWindowInfoVo: {
        //         minters: 0,
        //         mintFee: "0",
        //         mintedWorks: 0,
        //         blockRewardToken: "16666.6667",
        //         blockRewardEth: "0",
        //         internalRewardToken: "0",
        //         internalRewardEth: "0",
        //       },
        //       basicInformationVo: {
        //         mintCap: 0,
        //         totalMintCap: 10000,
        //         mintWindowCap: 0,
        //         totalMintWindowCap: 10000,
        //         mintWindowDuration: 24,
        //         remainingMintWindow: 60,
        //         subDaoAssetPoolEth: "0",
        //         subDaoAssetPoolDaoToken: "1000000",
        //       },
        //       modeStatusVo: {
        //         lotteryMode: false,
        //         lotteryDuration: 0,
        //         daoToken: false,
        //         topupMode: false,
        //         unifiedPriceMode: false,
        //         unifiedPrice: null,
        //         erc20PaymentMode: false,
        //         speicialStrategy: false,
        //         infiniteMode: false,
        //       },
        //       receivedEthFromOther: [],
        //       allocationEthToOtherDao: [],
        //       receivedTokenFromOther: [],
        //       allocationTokenToOtherDao: [],
        //     },
        //   ],
        //   page: {
        //     count: 1,
        //     size: 10,
        //   },
        // };
        const objDataList = data.dataList.map((item) => {
          return {
            ...item,
            activeName: 'currentMintWindowInformation',
          }
        })
        this.list = objDataList
        this.total = data.page.count
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
    aPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
    },
  },
}
</script>
<style scoped lang="scss">
.box-bom {
  // display: flex;
  // // min-width: 1104px;
  // max-width: 2263px;
  // margin: 0 auto;
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
    position: relative;
  }

  h3 {
    text-align: center;
    font-size: 20px;
    padding: 12px 14px;
    margin: 0;
    color: #757575;
    font-family: Inter5;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
.el-select-dropdown__item {
  font-size: 12px;
}
.el-range-editor.is-active,
.el-range-editor.is-active:hover,
.el-select .el-input.is-focus .el-input__inner {
  border-color: #c0c4cc !important;
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
  border-color: #c0c4cc;
}
.body-box {
  width: 960px;
  margin: 0 auto;
  font-family: Roboto4;
  margin-top: 80px;
}
.body-title {
  height: 80px;
  border-bottom: 1px solid #6062aa;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  color: #bbbaba;
  margin-bottom: 20px;
}
::v-deep .el-pagination {
  text-align: center;
  margin: 70px 0;
}
::v-deep .el-pager li {
  background-color: transparent !important;
  color: #9e9e9e !important;
}
::v-deep .el-pager .active {
  color: #b3b5f2 !important;
  border: 1px solid;
  border-color: #b3b5f2;
}

::v-deep .el-pagination .btn-next {
  background-color: transparent !important;
  color: #9e9e9e !important;
}

::v-deep .el-pagination .btn-prev {
  background-color: transparent !important;
  color: #9e9e9e !important;
}

.svg-icon {
  color: #bababa;
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
.noList {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbbaba;
  font-size: 18px;
  margin: 42px 0;
}
</style>
