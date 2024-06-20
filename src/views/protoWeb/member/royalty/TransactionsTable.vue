<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>Transactions</h3>
    </div>
    <!-- <el-divider class="divder-item"></el-divider> -->
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
              <a
                :href="aPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
                target="_blank"
              >
                <span class="fontbtn">
                  {{ scope.row.transactionHash | ellipsis }}</span
                >
              </a>
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
              <a
                :href="bPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
                target="_blank"
              >
                <span>{{ scope.row.account | ellipsis }} </span>
              </a>
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
      <div v-else>
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
          style="margin-top: 5%"
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
  name: "TableNftOwners",
  components: {
    ChartLoading,
    ChartNoData,
  },
  props: {
    dayTime: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  data() {
    return {
      isLoading: true,
      tableData: [],
      currentPage: 1,
      total: 0,
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
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
    tableHeaderCellStyle() {
      return {
        "border-bottom": "0.5px solid #6062AA",
        background: "#1B2233",
      };
    },
    async getData() {
      this.tableData = [];
      this.isLoading = true;
      const query = {
        erc20Address: this.address,
        tradeType: [1, 2, 5],
        pageNo: this.currentPage,
      };
      const data = await transaction(query);
      // this.tableData = data.dataList.map((item, index) => {
      //   return {
      //     ...item,
      //     code: index + 1,
      //   };
      // });
      this.tableData = data.dataList;
      this.total = data.page.count;
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.chat-body {
  // height: 880px;
  min-height: 400px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
  // overflow-y: auto;
  padding: 24px 40px 30px 40px;
}
.chat-title {
  display: flex;
  margin-bottom: 24px;
  h3 {
    color: #bbbaba;
    font-family: Inter6;
    font-size: 18px;
    margin: 0;
  }
}
.loading-box {
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.body-box {
  height: calc(100% - 98px);
  box-sizing: border-box;
}
.title-num {
  font-size: 14px;
  color: #757575;
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
::v-deep .el-table tr {
  background: #1b2233;
}
.el-table {
  background: #1b2233;
  color: #9e9e9e;
  border-bottom: 1px solid transparent;
  border-right: 1px solid transparent;
}
::v-deep .el-table__row td {
  border-bottom: 0.5px solid #6062aa !important;
}
::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: #424a5f;
}
.divder-item {
  margin: 16px 0 0 0;
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

::v-deep .el-pagination {
  text-align: center;
  // margin: 70px 0;
  margin-top: 30px;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #fff;
  color: #b3b5f2;
  border: 1px solid;
  border-color: #6062aa;
}
::v-deep .el-pager li {
  background-color: transparent !important;
  color: #9e9e9e !important;
}
::v-deep .el-pagination .btn-next {
  background-color: transparent !important;
  color: #9e9e9e !important;
}
::v-deep .el-pagination .btn-prev {
  background-color: transparent !important;
  color: #9e9e9e !important;
}
::v-deep .el-table--border::after,
.el-table--group::after,
.el-table::before {
  border-bottom: transparent;
}
.table-title {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
}
</style>
