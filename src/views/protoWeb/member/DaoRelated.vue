<template>
  <div class="daos-box">
    <div class="box-top">
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
    <div class="add-title" @click="setupDao">
      <p><i class="el-icon-plus" /></p>
      <span>{{ $t('nodeDetail.setupDaoText') }} </span>
    </div>
    <div>
      <daos-item-card :list="list" :isAll="isAll" :isLoading="loading" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DaosItemCard from '@/components/DaosItemCard.vue'
import { protodaoRelated, favoriteActions, favoriteCancel } from '@/common/api'
export default {
  components: { DaosItemCard },
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
    setupDao() {
      this.$router.push({
        path: '/setupdao',
        query: {
          id: this.$route.query.id,
        },
      })
    },
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
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        daoId: this.$route.query.id,
      }
      const data = await protodaoRelated(query)
      const objDataList = data.dataList.map((item) => {
        return {
          ...item,
          activeName: 'currentMintWindowInformation',
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
    qvalueChange() {
      this.list = []
      this.pageNo = 1
      this.loading = true
      this.isAll = false
      this.getData()
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
.add-title {
  height: 90px;
  border-radius: 2px;
  border: 1px dashed #6062aa;
  background: #252b3a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 920px;
  cursor: pointer;
  margin-bottom: 16px;
  P {
    margin: 0;
    font-size: 24px;
    color: #fff;
  }
  span {
    color: #9e9e9e;
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
