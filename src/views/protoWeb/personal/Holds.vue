<template>
  <div ref="waterfall">
    <div class="body-title">NFT Holds</div>
    <div class="irse">
      <div class="icons-q">
        <div
          @click="setWorkType(1)"
          :class="workType === 1 ? 'activeWork' : 'nodeWork'"
        >
          <svg-icon icon-class="work1" />
        </div>
        <div
          @click="setWorkType(2)"
          :class="workType === 2 ? 'activeWork' : 'nodeWork'"
        >
          <svg-icon icon-class="work2" />
        </div>
      </div>
    </div>
    <div>
      <work-item-card
        :list="list"
        :isLoading="isLoading"
        v-if="workType === 1"
      />
      <vue-waterfall-easy
        v-else
        :imgsArr="list"
        :is-loading="isLoading"
        srcKey="imgUrl"
        :card-width="1104"
        :isCardLeft="true"
      >
      </vue-waterfall-easy>
    </div>
    <el-pagination
      v-if="total > 0 && !isLoading"
      background
      :page-size="pageSize"
      layout="prev, pager, next"
      :current-page.sync="pageNo"
      @current-change="getData"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import vueWaterfallEasy from '@/components/vue-waterfall/waterfallWeb'
import WorkItemCard from '@/components/WorkItemCard.vue'
import { workHold } from '@/common/api'
export default {
  components: {
    WorkItemCard,
    vueWaterfallEasy,
  },
  data() {
    return {
      isLoading: true,
      list: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      workType: 1,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    setWorkType(val) {
      if (val === this.workType) return
      this.workType = val
      this.getData()
    },
    async getData() {
      this.list = []
      this.isLoading = true
      const query = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }
      const data = await workHold(query)
      if (data && data.resultCode === 100) {
        this.list = data.dataList.map((item) => {
          return {
            ...item,
            isMore: false,
          }
        })
        this.total = data.page.count
        this.isLoading = false
      } else {
        this.list = []
        this.total = 0
        this.isLoading = false
      }
    },
  },
  beforeDestroy() {
    this.list = []
  },
}
</script>

<style scoped lang="scss">
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

.irse {
  margin-left: auto;
  margin-right: 28px;
  display: flex;
  margin-bottom: 24px;
}
.icons-q {
  height: 34px;
  display: flex;
  background-color: #282f41;
  align-items: center;
  padding: 0 2px;
  border-radius: 4px;
  margin-right: 18px;
  margin-left: auto;
  div {
    width: 30px;
    height: 30px;
    padding: 2px;
    box-sizing: border-box;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  // span {
  //   font-size: 22px;
  // }
}
.activeWork {
  color: #b3b5f2;
  background-color: #1b2233 !important;
}
.nodeWork {
  color: #656a91;
  background-color: #282f41;
}
</style>
