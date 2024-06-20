<template>
  <div class="home">
    <component :is="activeName" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import PageH5 from './PageH5.vue'
import PagWeb from './PagWeb.vue'
export default {
  components: {
    PageH5,
    PagWeb,
  },
  data() {
    return {
      activeName: 'PagWeb',
    }
  },
  created() {
    this.activeName = 'PagWeb'
    // if (
    //   window.navigator.userAgent.toLowerCase().indexOf("android") > -1 ||
    //   window.navigator.userAgent.toLowerCase().indexOf("ios") > -1 ||
    //   window.navigator.userAgent.toLowerCase().indexOf("ipad") > -1 ||
    //   window.navigator.userAgent.toLowerCase().indexOf("iphone") > -1
    // ) {
    //   this.setAppType("H5");
    //   this.activeName = "PageH5";
    //   // this.pageState = true;
    // } else {
    //   this.setAppType("Web");
    //   this.activeName = "PagWeb";
    //   // this.pageState = false;
    // }
  },
  methods: {
    ...mapMutations(['setAppType']),
  },
}
</script>
<style scoped lang="scss">
.home {
  min-height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
