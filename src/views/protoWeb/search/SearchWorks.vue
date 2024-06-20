<template>
  <div>
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
    <div v-if="amountObj.workAmount > 0">
      <div class="work-box-card" v-if="workType === 1">
        <work-item-card :list="list" :isLoading="isLoading" />
      </div>
      <div v-else style="margin: 0 auto">
        <vue-waterfall-easy
          :imgsArr="list"
          :isAll="isAll"
          :is-loading="isLoading"
          srcKey="imgUrl"
          :card-width="cardWidth"
        >
        </vue-waterfall-easy>
      </div>
    </div>
    <div v-else class="nodata">
      <p>No items found for this search</p>
      <div>
        <button class="btnle btnl" @click="back">Back to all items</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import vueWaterfallEasy from '@/components/vue-waterfall/waterfallWeb'
import WorkItemCard from '@/components/WorkItemCard.vue'
import { searchWorks } from '@/common/api'
export default {
  components: {
    vueWaterfallEasy,
    WorkItemCard,
  },
  props: {
    amountObj: {
      type: Object,
    },
  },
  data() {
    return {
      list: [],
      isLoading: false,
      pageNo: 1,
      pageSize: 20,
      isAll: false,
      workType: 1,
    }
  },
  computed: {
    ...mapState(['ClientW']),
    cardWidth() {
      if (this.ClientW <= 1379) {
        return 1104
      }
      if (this.ClientW > 1379 && this.ClientW <= 1655) {
        return 1380
      }

      if (this.ClientW > 1655 && this.ClientW <= 1960) {
        return 1656
      }
      if (this.ClientW > 1960 && this.ClientW <= 2220) {
        return 1932
      }
      return 2208
    },
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
    setWorkType(val) {
      if (val === this.workType) return
      this.workType = val
      this.getData()
    },
    back() {
      this.$router.push({
        path: '/collections',
        query: {
          type: 'works',
        },
      })
    },
    async getData() {
      this.list = []
      this.isLoading = true
      const data = await searchWorks(this.$route.query.query)
      this.list = data.dataList
      this.isAll = true
      this.isLoading = false
    },
  },
  beforeDestroy() {
    this.list = []
  },
}
</script>
<style scoped lang="scss">
.nodata {
  margin-top: 78px;
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
.irse {
  margin-left: auto;
  margin-right: 24px;
  display: flex;
  margin-bottom: 24px;
  margin-top: 24px;
}
</style>
