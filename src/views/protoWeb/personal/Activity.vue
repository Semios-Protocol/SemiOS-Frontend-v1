<template>
  <div class="box-body">
    <div class="body-title">Activity</div>
    <div class="box-table">
      <div class="table_text">Erc20 Token Txns</div>
      <el-table
        :data="tableData"
        :row-style="{ height: '70px' }"
        :header-cell-style="tableHeaderCellStyle"
        style="width: 100%"
      >
        <el-table-column>
          <template #header>
            <span class="table-title"> </span>
          </template>
          <template slot-scope="scope">
            <span>
              <svg-icon :icon-class="`activity${scope.row.type}`" />
              {{ types[scope.row.type] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <span class="table-title">Token Symbol </span>
          </template>
          <template slot-scope="scope">
            <span
              class="spanbtn fontbtn"
              @click="openHash(scope.row.daoErc20Address, 'token')"
            >
              {{ scope.row.daoReward }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <span class="table-title">Txn Hash</span>
          </template>
          <template slot-scope="scope">
            <span
              class="spanbtn fontbtn"
              @click="openHash(scope.row.transactionHash, 'tx')"
            >
              {{ scope.row.transactionHash | hasHellipsis(7) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <span class="table-title">From</span>
          </template>
          <template slot-scope="scope">
            <span
              class="spanbtn fontbtn"
              @click="openHash(scope.row.fromAddress, 'address')"
              v-if="scope.row.fromAddress === MetaMaskAddress"
            >
              you
            </span>
            <span
              class="spanbtn fontbtn"
              @click="openHash(scope.row.fromAddress, 'address')"
              v-else
            >
              {{
                scope.row.fromName
                  ? scope.row.fromName
                  : scope.row.fromAddress | ellipsis
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template #header>
            <span class="table-title">To</span>
          </template>
          <template slot-scope="scope">
            <span
              class="spanbtn fontbtn"
              @click="openHash(scope.row.toAddress, 'address')"
              v-if="scope.row.toAddress === MetaMaskAddress"
            >
              you
            </span>
            <span
              class="spanbtn fontbtn"
              @click="openHash(scope.row.toAddress, 'address')"
              v-else
            >
              {{
                scope.row.toName
                  ? scope.row.toName
                  : scope.row.toAddress | ellipsis
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <span class="table-title">Amount</span>
          </template>
          <template slot-scope="scope">
            <span> {{ scope.row.value | balanceFilter(2) }} </span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="220">
          <template #header>
            <span class="table-title"> Time</span>
          </template>
          <template slot-scope="scope">
            <span> {{ scope.row.time | timeFormatting() }} </span>
          </template>
        </el-table-column>
      </el-table>

      <table-loading v-if="isLoading" />
      <el-pagination
        v-if="total > 0 && !isLoading"
        background
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        @current-change="getData"
        :total="total"
        :page-size="50"
      >
      </el-pagination>

      <div v-if="total === 0 && !isLoading" class="noData">
        No data to display
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TableLoading from "@/components/TableLoading.vue";
import { tokenActivity } from "@/common/api";
import $ from "jquery";
export default {
  components: {
    TableLoading,
  },
  computed: {
    ...mapState(["MetaMaskAddress"]),
  },
  data() {
    return {
      tableData: [],
      byWay: false,
      currentPage: 1,
      total: 0,
      isLoading: true,
      types: ["Collect", "Swap", "Transfer"],
    };
  },

  created() {
    this.getData();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll() {
      const scrollTop1 =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop1 >= 142) {
        // let top = scrollTop - (heightTop + 52);
        $(".el-table__header-wrapper")[0].style.position = "fixed";
        $(".el-table__header-wrapper")[0].style.zIndex = "500";
        $(".el-table__header-wrapper")[0].style.top = `60px`;
      } else {
        $(".el-table__header-wrapper")[0].style.position = "";
        $(".el-table__header-wrapper")[0].style.top = "";
        $(".el-table__header-wrapper")[0].style.zIndex = "";
      }
    },
    tableHeaderCellStyle() {
      return "border-bottom:1px solid #C5DADD;";
    },
    async getData() {
      try {
        this.tableData = [];
        this.isLoading = true;
        const query = {
          pageSize: 50,
          pageNo: this.currentPage,
        };
        const data = await tokenActivity(query);
        this.tableData = data.dataList;
        this.total = data.page.count;
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
<style scoped lang="scss">
.body-title {
  height: 80px;
  border-bottom: 1px solid #6062aa;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  color: #bbbaba;
}
.title-one {
  display: flex;
  align-items: center;
  .imgdiv {
    width: 50px;
    height: 50px;
    background: #f2f4f6;
    border-radius: 3px;
    margin: 0 16px;
  }
}
.title-name {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 3px;
}
.box {
  width: 1200px;
  margin: 0 auto;
}
.box-table {
  width: 1032px;
  margin: 0 auto;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent !important;
}
.table-title {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
}

::v-deep .el-table {
  font-size: 12px;
  font-weight: 600;
  color: #757575;
}
::v-deep .el-pagination {
  text-align: center;
  margin: 70px 0;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #fff;
  color: #745cd4;
  border: 1px solid;
  border-color: #745cd4;
}
::v-deep .el-pager li {
  background-color: #fff !important;
  color: #9e9e9e !important;
}
::v-deep .el-pagination .btn-next {
  background-color: #fff !important;
  color: #9e9e9e !important;
}
::v-deep .el-pagination .btn-prev {
  background-color: #fff !important;
  color: #9e9e9e !important;
}
::v-deep .el-table--border::after,
.el-table--group::after,
.el-table::before {
  border-bottom: transparent;
}

::v-deep .el-table--border th,
td {
  border-bottom: 1px solid #c5dadd !important;
  border-right: none;
}

::v-deep .el-table__row td {
  border-bottom: 1px solid #c5dadd !important;
  border-right: none;
}

.el-table::before {
  height: 0;
}
::v-deep .el-table__empty-text {
  display: none !important;
}
::v-deep .el-table__empty-block {
  display: none !important;
}
.table_text {
  border-bottom: 1px solid #6062aa;
  font-size: 18px;
  color: #757575;
  font-weight: 500;
  height: 60px;
  line-height: 60px;
}
::v-deep .el-table__header tr,
::v-deep .el-table__header th {
  height: 60px;
}
.spanbtn {
  cursor: pointer;
  color: #745cd4;
}
</style>
