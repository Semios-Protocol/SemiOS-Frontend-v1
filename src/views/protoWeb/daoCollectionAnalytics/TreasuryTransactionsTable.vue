<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.transactions') }}</h3>
    </div>
    <!-- <el-divider class="divder-item"></el-divider> -->
    <loading v-if="isLoading" />
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
          <el-table-column align="left">
            <template #header>
              <span class="table-title">From </span>
            </template>
            <template slot-scope="scope">
              <a
                :href="bPush(scope.row.fromAddress)"
                style="text-decoration: none; color: #25b0c2"
                target="_blank"
              >
                <span class="fontbtn">
                  {{ scope.row.fromAddress | ellipsis }}</span
                >
              </a>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #header>
              <span class="table-title">To </span>
            </template>
            <template slot-scope="scope">
              <a
                :href="bPush(scope.row.toAddress)"
                style="text-decoration: none; color: #25b0c2"
                target="_blank"
              >
                <span class="fontbtn">
                  {{ scope.row.toAddress | ellipsis }}</span
                >
              </a>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #header>
              <span class="table-title">Txn Hash </span>
            </template>
            <template slot-scope="scope">
              <a
                :href="aPush(scope.row.transactionHash)"
                style="text-decoration: none; color: #25b0c2"
                target="_blank"
              >
                <span class="fontbtn">
                  {{ scope.row.transactionHash | ellipsis }}</span
                >
              </a>
            </template>
          </el-table-column>
          <el-table-column align="right" width="180">
            <template #header>
              <span class="table-title">
                <span>{{ $t('nodeDetail.tokenAmountLabel') }} </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span
                >{{ scope.row.amount | bigNumFormat(5, 0.00001) }}
                <TokenIcon
                  size="14px"
                  :daoToken="true"
                  :daoSymbol="scope.row.daoSymbol"
                  :daoErc20Address="scope.row.erc20Token"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="left" width="260">
            <template #header>
              <span class="table-title">
                <span> {{ $t('nodeDetail.timeLabel') }} </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | timeFormatting(1, 1) }} </span>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #header>
              <span class="table-title">
                <span> {{ $t('nodeDetail.paymentMethodLabel') }} </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span
                >{{ scope.row.isUseTreasury === 1 ? 'Treasury' : 'Wallet' }}
              </span>
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
          :page-size="pageSize"
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
          <el-table-column align="left">
            <template #header>
              <span class="table-title">From </span>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #header>
              <span class="table-title">To </span>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #header>
              <span class="table-title">Txn Hash </span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="140">
            <template #header>
              <span class="table-title">
                <span>{{ $t('nodeDetail.tokenAmountLabel') }} </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="260">
            <template #header>
              <span class="table-title">
                <span> {{ $t('nodeDetail.timeLabel') }} </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #header>
              <span class="table-title">
                <span> {{ $t('nodeDetail.paymentMethodLabel') }} </span>
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
import Loading from '@/components/Loading.vue'
import ChartNoData from '@/components/ChartNoData.vue'
import { treasuryTransaction } from '@/common/api'
import { OPEN_URL } from '@/config.js'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: {
    Loading,
    ChartNoData,
    TokenIcon,
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
      pageSize: 10,
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    nameFilter(item) {
      if (item.name) {
        return item.name
      } else {
        const name = item.address.slice(2, 8).toUpperCase()
        return name
      }
    },
    aPush(item) {
      return `${OPEN_URL}/tx/${item}`
    },
    bPush(item) {
      return `${OPEN_URL}/address/${item}`
    },
    tableHeaderCellStyle() {
      return {
        'border-bottom': '0.5px solid #6062AA',
        background: '#1B2233',
      }
    },
    async getData() {
      this.tableData = []
      this.isLoading = true
      const query = {
        daoId: this.$route.query.id,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
      }
      const data = await treasuryTransaction(query)
      // this.tableData = data.dataList.map((item, index) => {
      //   return {
      //     ...item,
      //     code: index + 1,
      //   };
      // });
      this.tableData = data.dataList
      this.total = data.page.count
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="scss">
.chat-body {
  max-height: 640px;
  min-height: 400px;
  box-sizing: border-box;
  // border: 1px solid #6062aa;
  border-radius: 2px;
  overflow-y: auto;
  // padding: 24px 40px 30px 40px;
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
.flexbox {
  font-size: 16px;
  height: 200px;
}
</style>
