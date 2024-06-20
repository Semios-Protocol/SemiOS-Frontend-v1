<template>
  <div class="Personal-box">
    <component :is="activeName" />
  </div>
</template>

<script>
import daoMemberH5 from "./DaoMemberH5.vue";
import daoMemberWeb from "./DaoMemberWeb.vue";
export default {
  components: { daoMemberH5, daoMemberWeb },
  data() {
    return {
      activeName: "daoMemberH5",
    };
  },
  created() {
    if (
      window.navigator.userAgent.toLowerCase().indexOf("android") > -1 ||
      window.navigator.userAgent.toLowerCase().indexOf("ios") > -1 ||
      window.navigator.userAgent.toLowerCase().indexOf("ipad") > -1 ||
      window.navigator.userAgent.toLowerCase().indexOf("iphone") > -1
    ) {
      console.log(
        window.navigator.userAgent.toLowerCase(),
        "window.navigator.userAgent.toLowerCase()"
      );
      this.activeName = "daoMemberH5";
    } else {
      this.activeName = "daoMemberWeb";
    }
  },
};
</script>
