<template>
  <div class="ran-box">
    <div class="title-tab">
      <el-tabs v-model="activeName" @tab-click="tabsleClick">
        <el-tab-pane label="ꔷ DAOs Ranking" name="daos"></el-tab-pane>
        <el-tab-pane label="ꔷ NFTs Ranking" name="nfts"></el-tab-pane>
      </el-tabs>
    </div>

    <component :is="activeName" />
  </div>
</template>

<script>
import daos from "./Daos.vue";
import nfts from "./Nfts.vue";
export default {
  components: { daos, nfts },
  data() {
    return {
      activeName: "",
    };
  },
  watch: {
    $route: {
      handler(cur) {
        this.activeName = cur.query.type;
      },
      deep: true,
    },
  },
  created() {
    this.activeName = this.$route.query.type;
  },
  mounted() {},
  methods: {
    tabsleClick() {
      this.$router.push({
        path: "/rankings",
        query: {
          type: this.activeName,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.ran-box {
  width: 100%;
}
.title-tab {
  height: 85px;
  border-bottom: 0.5px solid #6062aa;
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
