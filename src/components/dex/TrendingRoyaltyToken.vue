<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>Trending Royalty Token</h3>
    </div>
    <el-divider></el-divider>
    <el-table
      ref="tableSort"
      :data="dataList"
      :row-style="{ height: '70px' }"
      :header-cell-style="tableHeaderCellStyle"
      empty-text="No Data"
      style="width: 100%"
    >
      <el-table-column width="50" fixed="left">
        <template #header> </template>
        <template slot-scope="scope">
          <div class="title-one">
            <span style="width: 30px">{{ scope.row.code }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="120" fixed="left">
        <template #header>
          <span class="table-title"> ERC20 Symbol </span>
        </template>
        <template slot-scope="scope">
          <span> {{ scope.row.erc20Symbol }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" min-width="120">
        <template #header>
          <span class="table-title" @click="setOrderBy('price')"
            >Price
            <i
              v-show="byName === 'floorPrice'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
            />
          </span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.price | bigNumFormat(6, 0.000001) }} </span>
          ETH
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('oneDayChanged')">
            <span> 24h%</span>
            <i
              v-show="byName === 'oneDayChanged'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span
            v-if="scope.row.oneDayChanged !== '--'"
            :style="{
              color: itemCompare(scope.row.oneDayChanged, 1)
                ? '#16C784'
                : '#DF5D5D',
            }"
          >
            <i
              :class="
                itemCompare(scope.row.oneDayChanged, 1)
                  ? 'el-icon-caret-top'
                  : 'el-icon-caret-bottom'
              "
            ></i>
            {{
              itemText(scope.row.oneDayChanged)
                ? lessNum
                : Math.abs(scope.row.oneDayChanged) + "%"
            }}
          </span>
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('sevenDayChanged')">
            <span> 7d%</span>
            <i
              v-show="byName === 'sevenDayChanged'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span
            v-if="scope.row.sevenDayChanged !== '--'"
            :style="{
              color: itemCompare(scope.row.sevenDayChanged, 1)
                ? '#16C784'
                : '#DF5D5D',
            }"
          >
            <i
              :class="
                itemCompare(scope.row.sevenDayChanged, 1)
                  ? 'el-icon-caret-top'
                  : 'el-icon-caret-bottom'
              "
            ></i>
            {{
              itemText(scope.row.sevenDayChanged)
                ? lessNum
                : Math.abs(scope.row.sevenDayChanged) + "%"
            }}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="160">
        <template #header>
          <span class="table-title" @click="setOrderBy('oneDayVolume')"
            >Volume(24h)
            <i
              v-show="byName === 'oneDayVolume'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <div class="volume24">
            <span
              >{{ scope.row.oneDayVolume | bigNumFormat(4, 0.0001) }} ETH</span
            >
            <span
              v-if="scope.row.oneDayVolumeChanged !== '--'"
              :style="{
                color: itemCompare(scope.row.oneDayVolumeChanged, 1)
                  ? '#16C784'
                  : '#DF5D5D',
              }"
            >
              <i
                :class="
                  itemCompare(scope.row.oneDayVolumeChanged, 1)
                    ? 'el-icon-caret-top'
                    : 'el-icon-caret-bottom'
                "
              />
              {{
                itemText(scope.row.oneDayVolumeChanged)
                  ? lessNum
                  : Math.abs(scope.row.oneDayVolumeChanged) + "%"
              }}
            </span>
            <span v-else>--</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="right" width="120">
        <template #header>
          <span class="table-title" @click="setOrderBy('marketCap')">
            Market Cap
            <i
              v-show="byName === 'marketCap'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span> {{ scope.row.marketCap | bigNumFormat(4, 0.0001) }} ETH </span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120">
        <template #header>
          <span class="table-title" @click="setOrderBy('royaltyFee')"
            >Royalty Fee
            <i
              v-show="byName === 'royaltyFee'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.royaltyFee | bigNumFormat(4, 0.0001) }} ETH
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="260">
        <template #header>
          <span class="table-title" @click="setOrderBy('nftNumber')"
            >DAO
            <i
              v-show="byName === 'nftNumber'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <div class="title-one">
            <!-- <span style="width: 30px">{{ scope.row.code }}</span> -->

            <span class="title-name">
              <span class="fontbtn"> {{ scope.row.daoName | nameFilter }}</span>
            </span>
            <div class="imgdiv">
              <img class="title-img" :src="scope.row.daoLogoUrl" alt="" />
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <table-loading v-if="isLoading" />
    <el-pagination
      v-if="itemCompare(total) && !isLoading"
      background
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="getData"
      :total="total"
      :page-size="10"
    >
    </el-pagination>
    <div class="noData" v-if="total === 0 && !isLoading">
      No data to display
    </div>
  </div>
</template>

<script>
import TableLoading from "@/components/TableLoading.vue";
import _ from "lodash";
import { priceTrending } from "@/common/dexApi";
import { OPEN_URL } from "@/config.js";
import { itemCompare } from "@/utils";

export default {
  components: {
    TableLoading,
  },
  data() {
    return {
      tableData: [],
      byName: "oneDayVolume",
      byWay: false,
      currentPage: 1,
      total: 0,
      isLoading: true,
      lessNum: "< 1%",
    };
  },

  computed: {
    dataList() {
      return _.orderBy(
        this.tableData,
        [this.byName],
        [this.byWay ? "asc" : "desc"]
      );
    },
  },
  created() {
    this.itemCompare = itemCompare;
  },
  mounted() {
    this.getData();
  },
  methods: {
    itemText(item) {
      return Math.abs(item) < 1 && Math.abs(item) > 0;
    },
    cPush(item) {
      return `${OPEN_URL}/address/${item.feePool}`;
    },
    bPush(item) {
      return `${OPEN_URL}/token/${item.erc20Address}`;
    },
    aPush(item) {
      return `/dao?type=royalty&id=${item.daoId}`;
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
    setOrderBy(val) {
      this.byWay = this.byName === val ? !this.byWay : false;
      this.byName = val;
    },
    async getData() {
      this.tableData = [];
      this.isLoading = true;
      const query = {
        pageSize: 10,
        pageNo: this.currentPage,
      };
      const data = await priceTrending(query);
      this.tableData = data.dataList.map((item, index) => {
        return {
          ...item,
          code: index + (this.currentPage - 1) * 10 + 1,
        };
      });
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
  // height: 880px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
  margin-top: 20px;
  // overflow-y: auto;
  padding: 24px 40px 30px 40px;
}
.chat-title {
  display: flex;
  h3 {
    color: #bbbaba;
    font-family: Inter6;
    font-size: 18px;
    margin: 0;
  }
}
.title-one {
  display: flex;
  align-items: center;
  float: right;
  .imgdiv {
    width: 50px;
    height: 50px;
    background: #f2f4f6;
    border-radius: 50px;
    margin-left: 16px;
    img {
      border-radius: 50px;
      margin: 0;
    }
  }
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
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent !important;
}
.table-title {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
}
::v-deep .el-table tr {
  background-color: transparent;
}
::v-deep .el-table thead {
  color: #9e9e9e;
}
::v-deep .el-table {
  font-size: 12px;
  font-weight: 600;
  color: #9e9e9e;
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
::v-deep .el-table--border::after,
::v-deep .el-table--group::after,
::v-deep .el-table::before {
  border-bottom: transparent;
}
::v-deep .el-divider {
  background-color: #6062aa;
}

::v-deep .el-table__fixed::before {
  background-color: transparent;
}
::v-deep .el-table--border th,
td {
  border-bottom: 1px solid #6062aa !important;
  border-right: none;
}

::v-deep .el-table__row td {
  border-bottom: 1px solid #6062aa !important;
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
.el-table {
  overflow: visible;
}
.el-table__header-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
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

<style>
.volume24 {
  display: flex;
  flex-direction: column;
}
::v-deep .el-table {
  font-size: 12px;
  color: #9e9e9e;
}
::v-deep .el-table thead {
  color: #9e9e9e;
}
</style>
