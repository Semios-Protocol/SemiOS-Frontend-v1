<template>
  <div class="chat-body">
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div class="body-box" v-else>
      <div v-if="tableData && tableData.length > 0" style="height: 100%">
        <el-table
          ref="tableSort"
          :data="tableData"
          :row-style="{ height: '70px' }"
          :header-cell-style="tableHeaderCellStyle"
          empty-text="No Data"
          style="width: 100%"
          class="box-table"
        >
          <el-table-column width="200">
            <template #header> </template>
            <template slot-scope="scope">
              <div class="title-one">
                {{ scope.row.tradeTypeDesc }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template #header>
              <span class="table-title">Txn Hash </span>
            </template>
            <template slot-scope="scope">
              <span class="fontbtn">
                {{ scope.row.transactionHash | ellipsis }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> In Token Amount </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span
                >{{ scope.row.inTokenAmount | bigNumFormat(4, 0.0001) }}
                {{ scope.row.inTokenUnit }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Out Token Amount </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span
                >{{ scope.row.outTokenAmount | bigNumFormat(4, 0.0001) }}
                {{ scope.row.outTokenUnit }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Swapped Rate </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span
                >{{ scope.row.swappedRate | bigNumFormat(6, 0.000001) }}
                {{ scope.row.swappedRateUnit }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Account </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.account | ellipsis }} </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Time </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.tradeTime | timeFormatting() }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="total > 0"
          background
          layout="prev, pager, next"
          :current-page.sync="currentPage"
          @current-change="getData"
          :total="total"
          :page-size="10"
        >
        </el-pagination>
      </div>
      <div v-else style="height: 100%">
        <el-table
          ref="tableSort"
          :row-style="{ height: '70px' }"
          :header-cell-style="tableHeaderCellStyle"
          empty-text="No Data"
          style="width: 100%"
          class="box-table"
        >
          <el-table-column width="200">
            <template #header> </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template #header>
              <span class="table-title">Txn Hash </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> In Token Amount </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Out Token Amount </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Swapped Rate </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Account </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Time </span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <chart-no-data
          title="No events have occurred yet"
          text="Check again later."
          style="margin-top: 8%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ChartLoading from "@/components/ChartLoading.vue";
import ChartNoData from "@/components/ChartNoData.vue";
import { transaction } from "@/common/dexApi";
import { OPEN_URL } from "@/config.js";
export default {
  name: "TransactionsTable",
  components: {
    ChartLoading,
    ChartNoData,
  },
  data() {
    return {
      isLoading: true,
      tableData: [],
      currentPage: 1,
      total: 0,
    };
  },
  props: {
    dayTime: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  watch: {
    address() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    nameFilter(item) {
      if (item.name) {
        return item.name;
      } else {
        const name = item.address.slice(2, 8).toUpperCase();
        return name;
      }
    },
    aPush(item) {
      return `${OPEN_URL}/tx/${item.transactionHash}`;
    },
    bPush(item) {
      return `${OPEN_URL}/address/${item.account}`;
    },
    goDao(item) {
      const path = "nfts";
      this.$router.push({
        path: "/dao",
        query: {
          type: path,
          id: item.daoId,
        },
      });
    },
    tableHeaderCellStyle() {
      return "border-bottom:1px solid #6062AA;";
    },
    async getData() {
      this.tableData = [];
      this.isLoading = true;
      const query = {
        erc20Address: this.address,
        tradeType: [5],
        pageNo: this.currentPage,
      };
      const data = await transaction(query);
      this.tableData = data.dataList.map((item, index) => {
        return {
          ...item,
          code: index + 1,
        };
      });
      // this.tableData = [
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      //   {
      //     name: "Swaps D4A_T123 for ETH",
      //     hash: "1234567...",
      //     amount: "In Token Amount",
      //     rate: "0.0000012 ETH",
      //     account: "0X1234...1234",
      //     time: "21-11-2022 09:55:36",
      //   },
      // ];
      if (this.currentPage === 1) {
        this.total = data.page.count;
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.chat-body {
  border-radius: 2px;
  // overflow-y: auto;
  min-height: 400px;

  display: flex;
  // align-items: center;
  justify-content: center;
}
.loading-box {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.body-box {
  height: calc(100% - 98px);
  box-sizing: border-box;
  // margin-top: 24px;
  width: 100%;
}
.title-num {
  font-size: 14px;
  color: #9e9e9e;
  font-family: Inter4;
  height: 22px;
  line-height: 22px;
  margin: 0 24px;
  margin-top: 6px;
}
// ::v-deep .el-table {
//   height: 750px;
// }
.el-table__row > td {
  border: none;
}
/* 去掉上面的线 */
.el-table th.is-leaf {
  border: none;
}
/* 去掉最下面的那一条线 */
.el-table::before {
  height: 0px;
}
::v-deep .el-table__empty-block {
  display: none !important;
}
::v-deep .el-table__body-wrapper {
  overflow-y: auto;
  height: calc(100% - 112px);
}
.title-one {
  display: flex;
  align-items: center;
}
.title-name {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 188px;
  color: #745cd4;
  span {
    cursor: pointer;
  }
}
.title-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
}
::v-deep .el-table tr {
  background-color: transparent;
}
::v-deep .el-pagination {
  text-align: center;
  // margin: 70px 0;
  margin-top: 30px;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: transparent;
  color: #b3b5f2 !important;
  border: 1px solid;
  border-color: #b3b5f2;
}
::v-deep .el-pager li {
  background-color: transparent !important;
  color: #9e9e9e !important;
}
::v-deep .el-pagination .btn-next {
  background-color: transparent !important;
  color: #d9d9d9 !important;
}
::v-deep .el-pagination .btn-prev {
  background-color: transparent !important;
  color: #d9d9d9 !important;
}
::v-deep .el-table__header {
  height: 70px;
}
::v-deep .el-divider--horizontal {
  margin: 0;
  margin-top: 24px;
}
::v-deep .el-divider {
  background-color: #6062aa;
}
::v-deep .el-table {
  font-size: 12px;
  color: #9e9e9e;
}
::v-deep .el-table thead {
  color: #9e9e9e;
}
::v-deep .el-table thead tr > th {
  background-color: transparent !important;
}

::v-deep .el-table tbody tr > td {
  background-color: transparent !important;
}
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent !important;
}
::v-deep .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
</style>
