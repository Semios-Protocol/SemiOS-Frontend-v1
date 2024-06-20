<template>
  <loading v-if="isLoading" />
  <div v-else class="dex-box">
    <component :is="activeName" :defaultData="defaultData" v-if="isComponent" />
  </div>
</template>

<script>
import Swap from '@/components/dex/SwapAndLiquidity.vue'
import liquidity from '@/components/dex/SwapAndLiquidity.vue'
import Burn from '@/components/dex/Burn.vue'
import Loading from '@/components/Loading.vue'
import { liquidityDefault, liquidityPrice } from '@/common/dexApi'
import { SlipName } from '@/config.js'
import { mapMutations } from 'vuex'
export default {
  components: {
    Swap,
    Burn,
    liquidity,
    Loading,
  },
  data() {
    return {
      defaultData: {
        erc20Address: '',
        erc20Balance: '0',
        erc20Name: '',
        erc20Symbol: '',
        ethBalance: '0',
        price: '0',
      },
      isLoading: true,
      activeName: 'burn',
      isComponent: true,
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'dex') {
        this.activeName = this.$route.query.type
        this.isComponent = false
        this.isComponent = true
      }
    },
  },
  created() {
    this.getData()
    const slipName = SlipName
    const slip = sessionStorage.getItem(slipName)
    if (!slip) {
      const data = {
        time: 20,
        slip: 0.1,
        expert: false,
      }
      sessionStorage.setItem(slipName, JSON.stringify(data))
    }
  },
  mounted() {
    this.addMeta('viewport', 'width=device-width,initial-scale=0.1')
    this.activeName = 'burn'
  },
  methods: {
    ...mapMutations(['setERCToken']),
    addMeta(name, content) {
      const meta = document.createElement('meta')
      meta.content = content
      meta.name = name
      document.getElementsByTagName('head')[0].appendChild(meta)
    },
    async getData() {
      this.isLoading = true
      if (this.$route.query.address) {
        const res = await liquidityPrice({
          erc20Address: this.$route.query.address,
        })
        if (res.data) {
          this.defaultData = res.data
          this.setERCToken(this.defaultData)
        } else {
          this.$router.push({
            path: '/',
          })
        }
      } else {
        const res = await liquidityDefault()
        this.defaultData = res.data
        this.setERCToken(this.defaultData)
      }
      this.isLoading = false
    },
  },
  beforeDestroy() {
    this.addMeta('viewport', 'width=device-width,initial-scale=1')
  },
}
</script>
<style scoped lang="scss">
.dex-box {
  width: 100%;
}
</style>
