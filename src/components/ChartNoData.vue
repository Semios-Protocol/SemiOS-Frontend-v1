<template>
  <div class="no-data">
    <div>
      <p><i class="el-icon-time"></i></p>
      <h4>{{ title }}</h4>
      <h5>{{ text }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss">
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  text-align: center;
  i {
    font-size: 28px;
    color: #6062aa;
  }
  h4 {
    margin: 12px 0;
    font-size: 14px;
    color: #757575;
  }
  h5 {
    margin: 0;
    font-size: 14px;
    color: #9e9e9e;
  }
}
</style>
