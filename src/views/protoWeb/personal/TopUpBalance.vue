<template>
  <div class="top-body">
    <div class="body-title">{{ $t('workDetail.topupBalanceLabel') }}</div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Available" name="available">
        <TopUpBalanceAvailable v-if="activeName === 'available'" />
      </el-tab-pane>
      <el-tab-pane label="Pending" name="pending">
        <TopUpBalancePending v-if="activeName === 'pending'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TopUpBalanceAvailable from './TopUpBalanceAvailable.vue'
import TopUpBalancePending from './TopUpBalancePending.vue'
export default {
  components: { TopUpBalanceAvailable, TopUpBalancePending },
  data() {
    return {
      activeName: 'available',
    }
  },
  methods: {},
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
  // margin-bottom: 20px;
}

::v-deep .el-tabs__content {
  padding-top: 20px;
}
::v-deep .el-tabs__nav {
  float: none;
  margin: 0 auto;
  text-align: center;
  border-bottom: 1px solid #6062aa;
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
</style>
