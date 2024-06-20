<template>
  <span>
    <!-- Token -->
    <a class="token-icon" :href="aPush()" target="_blank" v-if="daoToken">
      <el-tooltip
        class="item"
        effect="dark"
        :content="daoSymbol"
        placement="top"
      >
        <span :style="{ 'font-size': size, color: color }">
          {{ truncateString(daoSymbol) }}
        </span>
      </el-tooltip>
    </a>
    <!-- ETH -->
    <a class="token-icon" :href="aPush()" target="_blank" v-else>
      <el-tooltip
        class="item"
        effect="dark"
        :content="payCurrencyType"
        placement="top"
      >
        <span :style="{ 'font-size': size, color: color }">
          {{ truncateString(payCurrencyType) }}
        </span>
      </el-tooltip>
    </a>
  </span>
</template>

<script>
import { OPEN_URL } from '@/config.js'
import { truncateString } from '@/utils'
export default {
  data() {
    return {}
  },
  props: {
    daoToken: {
      type: Boolean,
      default: false,
    },
    daoSymbol: {
      type: String,
      default: '',
    },
    daoErc20Address: {
      type: String,
      default: '',
    },
    payCurrencyType: {
      type: String,
      default: '',
    },
    inputTokenAddress: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#b3b5f2',
    },
    size: {
      type: String,
      default: '16px',
    },
  },
  mounted() {},
  methods: {
    truncateString(val) {
      return truncateString(val)
    },
    aPush() {
      if (this.daoToken) {
        return `${OPEN_URL}/address/${this.daoErc20Address}`
      } else {
        return this.inputTokenAddress
          ? `${OPEN_URL}/address/${this.inputTokenAddress}`
          : `${OPEN_URL}/chart/etherprice`
      }
    },
  },
}
</script>

<style scoped lang="scss">
.token-icon {
  text-decoration: none;
}
</style>
