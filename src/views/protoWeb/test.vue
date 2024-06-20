<template>
  <div style="color: #fff">
    <ul>
      <li
        v-for="(item, index) in list"
        :key="index"
        @click="scrollToElement(item.name)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div v-for="(item, index) in list" :key="index">
      <div :ref="item.name" style="height: 200px; overflow: auto">
        <p>{{ item.content }}</p>
      </div>
    </div>
    <div ref="asdasd">asd</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: "1", name: "Name1", content: "Content 1" },
        { id: "2", name: "Name2", content: "Content 2" },
        { id: "4", name: "Name3", content: "Content 3" },
        { id: "5", name: "Name4", content: "Content 4" },
        { id: "6", name: "Name5", content: "Content 5" },
        { id: "7", name: "Name6", content: "Content 6" },
        { id: "8", name: "Name7", content: "Content 7" },
        { id: "9", name: "Name8", content: "Content 8" },
        { id: "10", name: "Name9", content: "Content 9" },
        // 更多数据...
      ],
    };
  },
  methods: {
    scrollToElement(name) {
      console.log(this.$refs[name][0], "this.$refs");
      const myComponentElement = this.$refs[name][0];
      console.log(myComponentElement, "myComponentElement");
      // 滚动到组件的位置
      window.scrollTo({
        top: myComponentElement.offsetTop,
        behavior: "smooth",
      });
      // let scrollHeight = document.documentElement.scrollTop;
      // document.documentElement.scrollTop += 200;
      // console.log(scrollHeight, "ididid");
      // const element = this.$refs[id];
      // console.log(element, "elementelementelement");
      // if (element.length > 0) {
      //   element[0].scrollTop = element[0].scrollHeight; // 滚动到最底部
      // }
    },
  },
};
</script>
