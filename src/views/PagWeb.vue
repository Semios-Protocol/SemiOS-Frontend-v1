<template>
  <el-container direction="vertical" class="home-body">
    <el-header>
      <header-bar-web />
    </el-header>
    <el-main>
      <span class="network" v-if="NetworkId && networkId !== NetworkId"
        >You're viewing data from the
        {{ networkId === '0xaa36a7' ? 'sepolia' : 'mainnet' }} network
        (Ethereum), but your wallet is connected to the incorrect network.
        Please switch network to
        {{ networkId === '0xaa36a7' ? 'sepolia' : 'mainnet' }} network
        (Ethereum).</span
      >
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import HeaderBarWeb from '@/components/HeaderBarWeb.vue'
import { Network } from '@/config.js'
import { mapState } from 'vuex'
export default {
  components: {
    HeaderBarWeb,
  },
  computed: {
    ...mapState(['NetworkId']),
  },
  created() {
    this.networkId = Network
  },
  methods: {},
}
</script>
<style scoped lang="scss">
.el-header {
  height: 60px !important;
  padding: 0 !important;
  background: #1b2233;
  border-bottom: 1px solid #6062aa;
  flex: 0;
  position: fixed;
  width: 100%;
  z-index: 9;
  min-width: 1240px;
}
.el-container {
  min-height: 100%;
  flex: 1;
}
.el-main {
  padding: 0px !important;
  overflow: initial !important;
  flex: 1;
  background-color: transparent;
  margin-top: 60px;
  background: #1b2233;
  background-size: cover;
  display: flex;
  flex-direction: column;
}
.el-footer {
  height: 220px !important;
  padding: 0px !important;
  background: #fbfbfb 0% 0% no-repeat padding-box;
  flex: 0;
  min-width: 1240px;
}
.network {
  background-color: #745cd4 !important;
  color: #f0f0f0 !important;
  display: block;
  /* height: 44px; */
  /* line-height: 24px; */
  text-align: center;
  font-size: 18px;
}
</style>
