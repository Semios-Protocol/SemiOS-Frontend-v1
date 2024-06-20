<template>
  <loading v-if="isLoading" />
  <div class="sea-box" v-else>
    <div class="title-tab">
      <el-tabs v-model="activeName" @tab-click="tabsleClick">
        <el-tab-pane
          :label="`ꔷ Works (${amountObj.workAmount})`"
          name="works"
        ></el-tab-pane>
        <el-tab-pane
          :label="`ꔷ SubNodes (${amountObj.daoAmount})`"
          name="subNodes"
        ></el-tab-pane>
        <el-tab-pane
          :label="`ꔷ Seed Node (${amountObj.seedNodesAmount})`"
          name="seedNode"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName" :amountObj="amountObj" />
  </div>
</template>

<script>
import subNodes from './SearchDaos.vue'
import works from './SearchWorks.vue'
import seedNode from './SearchSeedNode.vue'
import { searchAmount } from '@/common/api'
import Loading from '@/components/Loading.vue'
export default {
  name: 'Search',
  components: { subNodes, works, seedNode, Loading },
  data() {
    return {
      activeName: 'works',
      amountObj: { workAmount: 0, daoAmount: 0, seedNodesAmount: 0 },
      isLoading: true,
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
  created() {
    this.activeName = this.$route.query.type ? this.$route.query.type : 'works'
    this.getData()
  },
  methods: {
    async getData() {
      const data = await searchAmount(this.$route.query.query)
      console.log(data, 'datadatadatadatadatadata')
      this.amountObj = data.data
      this.isLoading = false
    },
    tabsleClick() {
      this.$router.push({
        path: '/search',
        query: {
          type: this.activeName,
          query: this.$route.query.query,
        },
      })
    },
  },
}
</script>
<style scoped lang="scss">
.sea-box {
  width: 100%;
}
.title-tab {
  height: 85px;
  border-bottom: 1px solid #6062aa;
  box-sizing: border-box;
  line-height: 85px;
  min-width: 1240px;
}

::v-deep .el-tabs__nav {
  float: none;
  margin: 0 auto;
  text-align: center;
}
::v-deep .el-tabs__active-bar {
  display: none;
}
::v-deep .el-tabs__item {
  color: #9e9e9e;
}
::v-deep .el-tabs__item:hover {
  color: #b3b5f2;
}
::v-deep .el-tabs__item.is-active {
  color: #b3b5f2;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
</style>
