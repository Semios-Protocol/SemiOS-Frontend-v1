<template>
  <loading v-if="isLoading" />
  <div class="collections-box" v-else>
    <!-- <div class="collbanner">
      <img src="../../../assets/image/Group.png" alt="" />
    </div> -->
    <div class="title-tab">
      <el-tabs v-model="activeName" @tab-click="tabsleClick">
        <el-tab-pane label="ꔷ Mintable Works" name="works"></el-tab-pane>
        <el-tab-pane label="ꔷ NFTs" name="nfts"></el-tab-pane>
        <el-tab-pane label="ꔷ SubNodes" name="subNodes"></el-tab-pane>
        <el-tab-pane label="ꔷ Seed Nodes" name="seedNodes"></el-tab-pane>
      </el-tabs>
    </div>
    <component
      :is="activeName"
      :dao-status="daoData.daoStatus"
      :start-date="daoData.startDate"
      :address="daoData.erc20Address"
      :daoObj="daoData"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import works from './CollectionsWorks.vue'
import subNodes from './CollectionsDaosV2.vue'
import seedNodes from './SeedNodes.vue'
import nfts from './CollectionsNFTs.vue'
import Loading from '@/components/Loading.vue'
export default {
  components: {
    works,
    nfts,
    Loading,
    subNodes,
    seedNodes,
  },
  data() {
    return {
      activeName: 'works',
      isLoading: true,
      daoData: { daoDescription: '' },
      startTime: 0,
      startDaoTimer: null,
      networkId: '',
      dialogShow: true,
      dialogTitleOne: false,
      dialogTitleTwo: false,
      shareActionsPopover: false,
      daoTime: {
        h: 0,
        m: 0,
        s: 0,
      },
      myTimeDisplay: null,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  watch: {
    MetaMaskAddress() {
      this.getData()
    },
  },
  mounted() {
    this.activeName = this.$route.query.type ? this.$route.query.type : 'works'
    this.getData()
  },
  methods: {
    async getData() {
      // const data = await daoDetail({ daoId: this.$route.query.id });
      // this.daoData = data.data;
      // if (this.daoData.daoStatus === 1 && this.daoData.startTime > 0) {
      //   this.daoTime.h = parseInt(this.daoData.startTime / 60 / 60);
      //   this.daoTime.m = parseInt(
      //     this.daoData.startTime / 60 - this.daoTime.h * 60
      //   );
      //   this.daoTime.s = parseInt(
      //     this.daoData.startTime -
      //       this.daoTime.h * 60 * 60 -
      //       this.daoTime.m * 60
      //   );
      //   this.setTimeNum();
      // }
      this.activeName = this.$route.query.type
        ? this.$route.query.type
        : this.daoData.daoStatus === 3
        ? 'nfts'
        : 'works'
      this.isLoading = false
    },
    tabsleClick() {
      this.$router.push({
        path: '/collections',
        query: {
          type: this.activeName,
          id: this.$route.query.id,
        },
      })
    },
  },
  beforeDestroy() {
    clearInterval(this.startDaoTimer)
    this.startDaoTimer = null
  },
}
</script>
<style scoped lang="scss">
.collections-box {
  // min-width: 1240px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.title-tab {
  height: 85px;
  border-bottom: 0.5px solid #b3b5f2;
  border-top: 0.5px solid #b3b5f2;
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
::v-deep .el-tabs__item:hover {
  color: #b3b5f2;
}
::v-deep .el-tabs__item.is-active {
  color: #b3b5f2;
}
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
::v-deep .el-tabs__item {
  color: #bbbaba;
  font-weight: 400 !important;
}
.collbanner {
  width: 100%;
  height: 600px;
  position: relative;
  img {
    height: 600px;
    width: 100%;
    object-fit: cover;
  }
}
</style>
