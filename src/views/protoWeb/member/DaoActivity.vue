<template>
  <div class="activit-box">
    <el-table
      :data="dataList"
      :row-style="{ height: '70px' }"
      :header-cell-style="tableHeaderCellStyle"
      style="width: 100%"
      class="box-table"
    >
      <el-table-column>
        <template #header>
          <span class="table-title" @click="setOrderBy('daoRebaseBlock')">
            <el-tooltip
              class="item"
              effect="dark"
              content="DAO Renew Block"
              placement="top"
            >
              <span> {{ $t('nodeDetail.drbLabel') }} </span>
            </el-tooltip>
            <i
              v-show="byName === 'daoRebaseBlock'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            <svg-icon icon-class="hdrb" />
            {{ scope.row.daoRebaseBlock | numFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('floorPrice')"
            >{{ $t('nodeDetail.floorPriceLabel') }}
            <i
              v-show="byName === 'floorPrice'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
            />
          </span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.floorPrice }} </span>
          <svg-icon
            :icon-class="scope.row.erc20PaymentMode ? 'token' : 'eth'"
          />
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('sevenDayRdbVol')"
            ><el-tooltip
              class="item"
              effect="dark"
              content="7 Nodes Block window volumn"
              placement="top"
            >
              <span>{{ $t('nodeDetail.totalVolLabel') }} </span>
            </el-tooltip>
            <i
              v-show="byName === 'sevenDayRdbVol'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.sevenDayRdbVol | numFilter }} </span>
          <svg-icon
            :icon-class="scope.row.erc20PaymentMode ? 'token' : 'eth'"
          />
        </template>
      </el-table-column>
      <el-table-column align="right" width="220">
        <template #header>
          <span class="table-title" @click="setOrderBy('daoAssetPool')"
            >{{ $t('nodeDetail.assetPoolLabel') }}
            <i
              v-show="byName === 'daoAssetPool'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.daoAssetPool | numFilter }} </span>
          <svg-icon
            :icon-class="scope.row.erc20PaymentMode ? 'token' : 'eth'"
          />
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('daoReward')"
            >{{ $t('nodeDetail.incentivesLabel') }}
            <i
              v-show="byName === 'daoReward'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span> {{ scope.row.daoReward | numFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('ownersNumber')"
            >{{ $t('nodeDetail.ownersLabel') }}
            <i
              v-show="byName === 'ownersNumber'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.ownersNumber | numFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('nftNumber')"
            >{{ $t('nodeDetail.nftsLabel') }}
            <i
              v-show="byName === 'nftNumber'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.nftNumber | numFilter }}
          </span>
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
</template>

<script>
import TableLoading from '@/components/TableLoading.vue'
import { daoActivity } from '@/common/api'
import $ from 'jquery'
import _ from 'lodash'
export default {
  components: {
    TableLoading,
  },
  data() {
    return {
      tableData: [],
      byName: 'daoRebaseBlock',
      byWay: false,
      currentPage: 1,
      total: 0,
      isLoading: true,
    }
  },

  computed: {
    dataList() {
      return _.orderBy(
        this.tableData,
        [this.byName],
        [this.byWay ? 'asc' : 'desc']
      )
      // this.tableData.sort(compare("age"))
    },
  },
  created() {
    this.getData()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll() {
      const height =
        document.getElementsByClassName('activit-box')[0].scrollHeight
      const scrollTop1 =
        document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop1 >= 795 + height) {
        // let top = scrollTop - (heightTop + 52);
        $('.el-table__header-wrapper')[0].style.position = 'fixed'
        $('.el-table__header-wrapper')[0].style.zIndex = '500'
        $('.el-table__header-wrapper')[0].style.top = `60px`
      } else {
        $('.el-table__header-wrapper')[0].style.position = ''
        $('.el-table__header-wrapper')[0].style.top = ''
        $('.el-table__header-wrapper')[0].style.zIndex = ''
      }
    },
    tableHeaderCellStyle() {
      return {
        'border-bottom': '0.5px solid #6062aa',
        background: '#1B2233',
      }
    },
    setOrderBy(val) {
      this.byWay = this.byName === val ? !this.byWay : false
      this.byName = val
    },
    async getData() {
      this.isLoading = true
      const query = {
        daoId: this.$route.query.id,
        pageSize: 50,
        pageNo: this.currentPage,
      }
      const data = await daoActivity(query)
      // const data = {
      //   dataList: [
      //     {
      //       daoRebaseBlock: 6441,
      //       floorPrice: 0.015,
      //       sevenDayRdbVol: 0.0,
      //       daoAssetPool: 0.0385,
      //       daoReward: 1110091531,
      //       canvasNumber: 1,
      //       ownersNumber: 1,
      //       nftNumber: 4,
      //       dre: 0.1377,
      //     },
      //     {
      //       daoRebaseBlock: 6440,
      //       floorPrice: 0.015,
      //       sevenDayRdbVol: 0.0,
      //       daoAssetPool: 0.0385,
      //       daoReward: 1110091531,
      //       canvasNumber: 1,
      //       ownersNumber: 1,
      //       nftNumber: 4,
      //       dre: 0.14,
      //     },
      //   ],
      // };
      this.tableData = data.dataList.map((item, index) => {
        return {
          ...item,
          code: index + (this.currentPage - 1) * 50 + 1,
        }
      })
      this.total = data.page.count
      this.isLoading = false
    },
  },
}
</script>
<style scoped lang="scss">
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
.activit-box {
  width: 1200px;
  margin: 0 auto;
}
.box-table {
  margin-top: 60px;
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
  padding-bottom: 30px;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #fff;
  color: #6062aa;
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
.noData {
  font-size: 18px;
  color: #bbbaba;
  height: 350px;
  line-height: 350px;
  text-align: center;
  margin: 0 auto;
}
::v-deep .el-table tr {
  background: #1b2233;
}
.el-table {
  background: #1b2233;
  border-bottom: 1px solid transparent;
  border-right: 1px solid transparent;
}
::v-deep .el-table__row td {
  border-bottom: 0.5px solid #6062aa !important;
}
</style>
