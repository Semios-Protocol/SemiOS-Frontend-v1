<template>
  <div class="home">
    <el-dialog
      title="Select a Token"
      v-if="tokenVisible"
      :visible.sync="tokenVisible"
      :before-close="handleClose"
      width="420px"
      top="20vh"
    >
      <div class="dialog-body">
        <div class="input-box">
          <el-input
            placeholder="Search name or paste address"
            v-model="queryToken"
            @keyup.native="querySearch($event)"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="divder"></div>
        <div v-if="isLoading" class="item-no"><chart-loading /></div>
        <div v-else>
          <div class="item-box" v-show="tableData.length > 0">
            <div
              class="input-table"
              v-for="(item, idx) in tableData"
              :key="item.erc20Symbol + idx"
              @click="confirmation(item)"
            >
              <div class="table-l">
                <p class="tp1">{{ item.erc20Name }}</p>
                <p class="tp2">{{ item.erc20Symbol }}</p>
              </div>
              <div class="table-r" v-if="MetaMaskAddress">
                {{ item.erc20Balance | bigNumFormat }}
              </div>
            </div>
          </div>
          <div class="item-no" v-show="tableData.length === 0">
            No tokens found.
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { liquidityErc20Token } from "@/common/dexApi";
import ChartLoading from "@/components/ChartLoading.vue";
export default {
  components: {
    ChartLoading,
  },
  props: {
    tokenVisible: {
      type: Boolean,
      default: false,
    },
    bodyText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      queryToken: "",
      tableData: [],
      isLoading: true,
    };
  },
  computed: {
    ...mapState(["MetaMaskAddress", "ERCToken"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["setERCToken"]),
    querySearch(event) {
      this.starttime = event.timeStamp;
      let e = event;
      setTimeout(() => {
        if (this.starttime - e.timeStamp === 0) {
          this.getData();
        }
      }, 1000);
    },
    async getData() {
      this.isLoading = true;
      this.tableData = [];
      const query = {
        searchWord: this.queryToken,
        userAddress: this.MetaMaskAddress,
      };
      const res = await liquidityErc20Token(query);
      this.isLoading = false;
      this.tableData = res.dataList;
      // this.tableData = [
      //   { name: "test1", num: "123", id: 1 },
      //   { name: "test2", num: "123", id: 2 },
      //   { name: "test3", num: "123", id: 3 },
      // ];
    },
    confirmation(item) {
      this.$emit("confirmation", item);
    },
    handleClose() {
      this.$emit("closeShow", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.divder {
  margin: 0;
  margin-top: 14px;
  border-bottom: 1px solid #6062aa;
}

::v-deep .el-input__inner {
  border: 1px solid #6062aa;
  background-color: transparent;
}
.dialog-body {
  padding: 14px 0;
}
.input-box {
  margin: 0 14px;
}
.input-table {
  display: flex;
  height: 60px;
  padding: 0 14px;
  border-bottom: 1px solid #6062aa;
  cursor: pointer;
}

.input-table:hover {
  background-color: #1b2233;
}
.table-l {
  display: flex;
  // align-items: center;
  flex-direction: column;
  justify-content: center;
  .tp1 {
    margin: 0;
    margin-bottom: 4px;
    font-size: 16px;
    color: #9e9e9e;
    font-family: Inter5;
  }
  .tp2 {
    margin: 0;
    font-size: 12px;
    color: #bbbaba;
    font-family: Inter4;
  }
}
.table-r {
  font-size: 16px;
  color: #9e9e9e;
  font-family: Inter4;
  margin-left: auto;
  line-height: 60px;
}
.item-box {
  max-height: 420px;
  overflow: auto;
  height: auto;
}
.item-no {
  text-align: center;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
