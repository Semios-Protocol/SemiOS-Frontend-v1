<template>
  <transition>
    <div ref="dragIcon" class="dragIcon">
      <span
        >Are you sure to delete these {{ deleteIds.length }} unminted works.
      </span>
      <div class="btns">
        <button class="elbtns-b" @click="cancel">Cancel</button>
        <button
          class="elbtns-l"
          @click="sure"
          :disabled="deleteIds.length === 0"
          :class="{
            isDisabled: deleteIds.length === 0,
          }"
        >
          Sure
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    text: {
      type: String,
      default: "a",
    },
    itemWidth: {
      type: Number,
      default: 148,
    },
    itemHeight: {
      type: Number,
      default: 42,
    },
    deleteIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["ClientW"]),
  },
  data() {
    return {
      left: 0,
      top: 90,
      Pending: [],
      types: [],
      timerTransaction: null,
      currentTop: null,
      currentleft: null,
    };
  },
  watch: {
    // Pendings(cur, old) {
    // 	console.log(cur, 'curcurcurcurcurcurcurcurcurcur')
    // },
    clientW(cur) {
      this.left = cur - this.itemWidth - 40;
    },
  },
  created() {
    this.left = this.clientW - this.itemWidth - 40;
  },
  methods: {
    cancel() {
      this.$emit("deleteTable", false);
    },
    sure() {
      this.$emit("deleteTable", true);
    },
  },
};
</script>

<style scoped lang="scss">
.isDisabled {
  background: #2e2555 !important;
  border-color: #2e2555 !important;
  cursor: no-drop !important;
}
.dragIcon {
  position: fixed;
  color: #bbbaba;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  z-index: 999;
  width: 100%;
  background: #282f41;
  border: 1px solid #6062aa;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.13);
  border-radius: 2px;
  height: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  span {
    margin-left: 16px;
  }
  i {
    margin-right: 10px;
  }
}

.v-enter {
  opacity: 1;
}

.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}
.btns {
  margin-left: auto;
  margin-right: 28px;

  display: flex;

  .elbtns-l {
    margin-left: 24px;
  }
}
</style>
