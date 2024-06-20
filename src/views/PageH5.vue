<template>
  <div class="home">
    <header-bar-h5 />
    <div class="home-body">
      <router-view :style="{ height: bodyHeight }" />
    </div>
  </div>
</template>

<script>
import HeaderBarH5 from "@/components/HeaderBarH5.vue";
export default {
  components: {
    HeaderBarH5,
  },
};
</script>
<style scoped lang="scss">
.home {
  min-height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.home-body {
  background-image: url(../assets/image/bg.png);
  // background-repeat: no-repeat;
  background-size: cover;
  flex: 1;
  // margin-top: 60px;
  // overflow: auto;
}
</style>
