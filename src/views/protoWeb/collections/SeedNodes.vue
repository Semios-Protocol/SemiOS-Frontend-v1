<template>
  <div class="daos-box">
    <div class="box-top">
      <!-- <div class="irse">
        <el-select v-model="qvalue" @change="qvalueChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div> -->
    </div>
    <div>
      <seed-node-card :list="list" :isAll="isAll" :isLoading="loading" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SeedNodeCard from '@/components/SeedNodeCard.vue'
import {
  seedNodesCollections,
  favoriteActions,
  favoriteCancel,
} from '@/common/api'
export default {
  components: { SeedNodeCard },
  data() {
    return {
      loading: false,
      list: [],
      isApply: false,
      pageSize: 10,
      pageNo: 1,
      count: 0,
      isCardLeft: false,
      isAll: false,
      queryData: {
        minInput: undefined,
        maxInput: undefined,
      },
      qvalue: '0',
      options: [
        {
          value: '0',
          label: 'Recently Listed',
        },
        {
          value: '1',
          label: 'Most Favorited',
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
      tabName: 'collection',
    }
  },
  computed: {
    ...mapState(['ClientW', 'User']),
  },
  created() {
    window.removeEventListener('scroll', this.lazyLoading, true)
    window.addEventListener('scroll', this.lazyLoading, true)
    this.loading = true
    this.getData()
  },
  mounted() {},
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
          val.favoriteAmount += item.favoriteAmount
          val.favorited = item.favorited
          this.$set(this.list, idx, item)
        }
      }
    },
    async getData() {
      const query = {
        sortCondition: this.qvalue,
        minPrice: this.isApply ? this.queryData.minInput : '',
        maxPrice: this.isApply ? this.queryData.maxInput : '',
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }
      const data = await seedNodesCollections(query)
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
          activeName: 'membersOfSeedNodes',
        }
      })
      this.list = this.list.concat(objDataList)
      this.count = data.page.count
      this.isAll = this.pageNo * this.pageSize >= this.count
      this.loading = false
      this.ifScrollHeight()
    },
    ifScrollHeight() {
      if (
        document.body.scrollHeight <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        !this.isAll
      ) {
        this.pageNo += 1
        this.loading = true
        this.getData()
      }
    },
    lazyLoading() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (this.pageNo * this.pageSize < this.count) {
        if (scrollHeight - clientHeight <= scrollTop + 560) {
          if (this.loading) return
          this.pageNo += 1
          this.loading = true
          this.getData()
        }
      }
    },
    aPush(item) {
      // return `/dao?type=${item.daoStatus === 3 ? "nfts" : "unmintedWorks"}&id=${
      //   item.daoId
      // }`;
      return `/dao?type=nfts&id=${item.daoId}`
    },
    goExploreUnmintedWorks(item) {
      const path = 'nfts'
      this.$router.push({
        path: '/dao',
        query: {
          type: path,
          id: item.daoId,
        },
      })
    },
    setQuery() {
      this.isCardLeft = !this.isCardLeft
    },
    qvalueChange() {
      this.list = []
      this.pageNo = 1
      this.loading = true
      this.isAll = false
      this.getData()
    },
    apply() {
      this.isApply = true
      this.qvalue = '3'
      this.qvalueChange()
    },
  },
  beforeDestroy() {
    this.list = []
    window.removeEventListener('scroll', this.lazyLoading, true)
  },
}
</script>

<style scoped lang="scss">
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
</style>
