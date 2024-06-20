<template>
  <div class="top-body">
    <div class="body-title">{{ $t('topUpBalance.topupRewardTitle') }}</div>
    <TopUpRewardItemCard />
  </div>
</template>

<script>
import TopUpRewardItemCard from './TopUpRewardItemCard.vue'
export default {
  components: { TopUpRewardItemCard },
  data() {
    return {}
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
</style>
