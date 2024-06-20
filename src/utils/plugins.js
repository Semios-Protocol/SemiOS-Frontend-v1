import Vue from "vue";

Vue.directive("preventReClick", {
  inserted(el) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, 5000);
      }
    });
  },
});
