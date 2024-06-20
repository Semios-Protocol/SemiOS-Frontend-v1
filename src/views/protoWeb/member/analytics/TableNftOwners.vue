<template>
  <div class="chat-body">
    <div class="chat-title">
      <h3>{{ $t('nodeDetail.nftOwnersLabel') }}</h3>
    </div>
    <div class="title-num">Top 100</div>
    <div v-if="isLoading" class="loading-box">
      <chart-loading />
    </div>
    <div class="body-box" v-else>
      <div v-if="tableData && tableData.length > 0" style="height: 100%">
        <el-table
          :data="tableData"
          :row-style="{
            height: '70px',
            backgroundColor: 'transparent',
            border: 'none',
          }"
          :header-cell-style="tableHeaderCellStyle"
          empty-text="No Data"
          style="width: 100%"
          max-height="800"
        >
          <el-table-column width="50" fixed="left">
            <template #header> </template>
            <template slot-scope="scope">
              <div class="title-one">
                <span style="width: 50px; text-align: center">{{
                  scope.row.code
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="160" fixed="left">
            <template #header>
              <span class="table-title"> Name </span>
            </template>
            <template slot-scope="scope">
              <div class="title-one">
                <div class="imgdiv">
                  <a
                    :href="aPush(scope.row)"
                    style="text-decoration: none; color: #745cd4"
                    target="_blank"
                  >
                    <img class="title-img" :src="scope.row.headImg" alt=""
                  /></a>
                </div>
                <span class="title-name">
                  <a
                    :href="aPush(scope.row)"
                    style="text-decoration: none; color: #745cd4"
                    target="_blank"
                  >
                    <span class="fontbtn"> {{ nameFilter(scope.row) }}</span>
                  </a>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120">
            <template #header>
              <span class="table-title">Wallet </span>
            </template>
            <template slot-scope="scope">
              <span style="color: #9e9e9e; text-align: center">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Contract"
                  placement="top"
                >
                  <span>
                    <i
                      class="el-icon-document"
                      v-if="scope.row.isContract === 1"
                    ></i
                  ></span>
                </el-tooltip>

                {{ scope.row.address | ellipsis }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> Owned </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span style="color: #9e9e9e">{{ scope.row.amount }} </span>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span class="table-title">
                <span> %Owned </span>
              </span>
            </template>
            <template slot-scope="scope">
              <span style="color: #9e9e9e"
                >{{
                  itemText(scope.row.ratio) ? lessNum : scope.row.ratio + '%'
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <chart-no-data
        title="No events have occurred yet"
        text="Check again later."
        v-else
      />
    </div>
  </div>
</template>

<script>
import ChartLoading from '@/components/ChartLoading.vue'
import ChartNoData from '@/components/ChartNoData.vue'
import { analyticsNftTopOwners } from '@/common/api'
import { OPEN_URL } from '@/config.js'
export default {
  name: 'TableNftOwners',
  components: {
    ChartLoading,
    ChartNoData,
  },
  data() {
    return {
      isLoading: true,
      tableData: [],
      lessNum: '< 1%',
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    itemText(item) {
      return Math.abs(item) < 1 && Math.abs(item) > 0
    },
    nameFilter(item) {
      if (item.name) {
        return item.name
      } else {
        const name = item.address.slice(2, 8).toUpperCase()
        return name
      }
    },
    aPush(item) {
      return `${OPEN_URL}/address/${item.address}`
    },
    goDao(item) {
      const path = 'nfts'
      this.$router.push({
        path: '/dao',
        query: {
          type: path,
          id: item.daoId,
        },
      })
    },
    tableHeaderCellStyle() {
      return {
        background: '#1B2233',
      }
    },
    async getData() {
      this.tableData = []
      this.isLoading = true
      const query = { daoId: this.$route.query.id }
      const data = await analyticsNftTopOwners(query)
      this.tableData = data.dataList.map((item, index) => {
        return {
          ...item,
          code: index + 1,
        }
      })
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="scss">
.chat-body {
  height: 900px;
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
  // overflow-y: auto;
}
.chat-title {
  display: flex;
  margin-top: 24px;
  padding-left: 24px;
  h3 {
    color: #bbbaba;
    font-family: Inter6;
    font-size: 18px;
    margin: 0;
  }
}
::v-deep .el-table td.el-table__cell {
  border: 0px;
}
::v-deep .el-table th.el-table__cell.is-leaf {
  border: 0px;
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
  margin: 0;
  margin-top: 24px;
}
::v-deep .el-table__body tr.hover-row > td.el-table__cell {
  background-color: #424a5f;
}
.title-num {
  font-size: 14px;
  color: #bbbaba;
  font-family: Inter4;
  height: 22px;
  line-height: 22px;
  margin: 0 24px;
  margin-top: 6px;
}
::v-deep .el-table {
  height: 100%;
  background-color: transparent;
  // min-width: 450px;
}
::v-deep .el-table__fixed::before {
  height: 0px;
}
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
  background-color: #1b2233 !important;
}
// ::v-deep .el-table__body-wrapper {
//   overflow-y: auto;
//   height: calc(100% - 54px);
// }
.title-one {
  display: flex;
  align-items: center;
  color: #9e9e9e;
  .imgdiv {
    width: 50px;
    height: 50px;
    background: #f2f4f6;
    border-radius: 50px;
    margin-right: 16px;
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
// ::v-deep .el-table__body {
//   width: initial !important;
// }
::v-deep .el-table__fixed {
  bottom: 0;
}
</style>
