<template>
  <div class="Personal-box">
    <van-tabs
      v-model="activeName"
      background="#000"
      color="#745CD4"
      title-active-color="#b3b5f2"
      title-inactive-color="#999"
      @change="changeActive"
    >
      <van-tab name="nftHolds" title="NFT Holds" />
      <van-tab name="myWorks" title="My Works" />
      <van-tab name="myDaos" title="My DAOs" />
    </van-tabs>
    <component :is="activeName" v-if="isComponent" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import myWorks from "./PersonalWorks.vue";
import nftHolds from "./PersonalHold.vue";
import myDaos from "./PersonalDaos.vue";
export default {
  components: { myWorks, nftHolds, myDaos },
  data() {
    return {
      activeName: "myWorks",
      isComponent: true,
    };
  },
  watch: {
    $route(to) {
      if (to.name === "personal") {
        this.activeName = this.$route.query.type;
        this.isComponent = false;
        this.isComponent = true;
      }
    },
  },
  computed: {
    ...mapState(["MetaMaskAddress", "User"]),
  },
  mounted() {
    this.activeName = this.$route.query.type
      ? this.$route.query.type
      : "myWorks";
    // if (this.MetaMaskAddress) {
    //   this.activeName = this.$route.query.type
    //     ? this.$route.query.type
    //     : "myWorks";
    // } else {
    //   this.$router.push({
    //     path: "/",
    //   });
    // }
  },
  methods: {
    changeActive(val) {
      this.$router.push({
        path: "/personal",
        query: {
          type: val,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.Personal-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}
.to-btn {
  margin-top: 20px;
}
::v-deep .van-tabs__line {
  width: 30% !important;
  background-color: #b3b5f2 !important ;
}
::v-deep .van-tab {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}
::v-deep .van-tab--active {
  font-weight: 500;
}
::v-deep .van-tabs--line {
  margin-bottom: 20px;
}

.my-sheet {
  background-color: #282f41;
  color: #f3f3f3;
  font-size: 16px;
  height: 54px;
  line-height: 54px;
  text-align: center;
}
.my-sheet:active {
  background-color: #424a5f;
}
</style>
