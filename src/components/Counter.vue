// Counter.vue
<template>
  <div>
    <h3>{{ count }}</h3>
    <button class="btn" @click="increment">+</button>
  </div>
</template>

<script>
export default {
  name: "Counter",
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
