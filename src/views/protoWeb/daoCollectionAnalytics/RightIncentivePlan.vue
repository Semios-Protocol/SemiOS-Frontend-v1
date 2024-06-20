<template>
  <loading v-if="isLoading" />
  <div class="list-box" v-else>
    <div class="add-title" @click="setupPlan">
      <p><i class="el-icon-plus" /></p>
      <span>{{ $t('incentivePlan.cilckBtn') }} </span>
    </div>
    <div class="box-bom">
      <IncentivePlanItemCard :list="dataList" />
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import { togetherPlanList } from '@/common/api'
import IncentivePlanItemCard from './IncentivePlanItemCard.vue'

export default {
  components: { Loading, IncentivePlanItemCard },
  data() {
    return {
      isLoading: true,
      dataList: [],
      tabName: 'collection',
      currentPage: 1,
      total: 0,
      pageSize: 10,
    }
  },
  props: {
    mainDaoId: {
      type: Number,
    },
    projectId: {
      type: String,
    },
  },
  created() {
    this.getData()
  },
  methods: {
    aPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
    },
    setupPlan() {
      this.$router.push({
        path: '/setupPlan',
        query: {
          id: this.projectId,
        },
      })
    },
    async getData() {
      try {
        const res = await togetherPlanList({ daoId: this.$route.query.id })
        this.dataList = res.dataList.map((item) => {
          return {
            ...item,
            activeName: 'currentBlockInformation',
          }
        })
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
  },
}
</script>
<style scoped lang="scss">
.list-box {
  width: 920px;
  margin: 0 auto;
  font-family: Inter;
}
.add-title {
  height: 90px;
  width: 920px;
  border-radius: 2px;
  border: 1px dashed #6062aa;
  background: #252b3a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
