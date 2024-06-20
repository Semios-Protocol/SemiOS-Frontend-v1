<template>
  <div class="box">
    <el-table
      ref="tableSort"
      :data="dataList"
      :row-style="{ height: '70px' }"
      :header-cell-style="tableHeaderCellStyle"
      empty-text="No Data"
      style="width: 100%"
      class="box-table"
    >
      <el-table-column width="50">
        <template #header> </template>
        <template slot-scope="scope">
          <div class="title-one">
            <span style="width: 30px">{{ scope.row.code }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="300">
        <template #header>
          <span class="table-title"> Collection </span>
        </template>
        <template slot-scope="scope">
          <div class="title-one">
            <!-- <span style="width: 30px">{{ scope.row.code }}</span> -->
            <div class="imgdiv">
              <a
                :href="aPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
              >
                <img class="title-img" :src="scope.row.daoLogoUrl" alt=""
              /></a>
            </div>
            <span class="title-name">
              <a
                :href="aPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
              >
                <span class="fontbtn"> {{ scope.row.daoName }}</span></a
              >
            </span>
          </div>
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
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('drbVol')">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('nodeDetail.oDRBVolTip')"
              placement="top"
            >
              <span> {{ $t('nodeDetail.oDRBVolLabel') }}</span>
            </el-tooltip>
            <i
              v-show="byName === 'drbVol'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.drbVol }} </span>
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('sevenDayRdbVol')"
            ><el-tooltip
              class="item"
              effect="dark"
              :content="$t('nodeDetail.sDRBVolTip')"
              placement="top"
            >
              <span> {{ $t('nodeDetail.sDRBVolLabel') }}</span>
            </el-tooltip>
            <i
              v-show="byName === 'sevenDayRdbVol'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.sevenDayRdbVol | numFilter }} </span>
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <el-table-column align="right" width="160">
        <template #header>
          <span class="table-title" @click="setOrderBy('daoAssetPool')"
            >{{ $t('nodeDetail.royaltyPoolLabel') }}
            <i
              v-show="byName === 'daoAssetPool'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.daoAssetPool | numFilter }}
            <!-- <a
              :href="bPush(scope.row)"
              style="text-decoration: none; color: #745CD4"
            >
              <span class="fontbtn">
                {{ scope.row.daoAssetPool | numFilter }}</span
              ></a
            > -->
          </span>
          <svg-icon icon-class="eth" />
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
    <div class="noData" v-if="total === 0 && !isLoading">
      No data to display
    </div>
  </div>
</template>

<script>
import TableLoading from '@/components/TableLoading.vue'
import { daoRankings } from '@/common/api'
import { OPEN_URL } from '@/config'
import $ from 'jquery'
import _ from 'lodash'
export default {
  components: {
    TableLoading,
  },
  data() {
    return {
      tableData: [],
      byName: 'sevenDayRdbVol',
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
      const scrollTop1 =
        document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop1 >= 150) {
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
    bPush(item) {
      return `${OPEN_URL}/address/${item.feePool}`
    },
    aPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
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
      return 'border-bottom:1px solid #C5DADD;'
    },
    setOrderBy(val) {
      this.byWay = this.byName === val ? !this.byWay : false
      this.byName = val
    },
    async getData() {
      this.tableData = []
      this.isLoading = true
      const query = {
        daoId: this.$route.query.id,
        pageSize: 50,
        pageNo: this.currentPage,
      }
      const data = await daoRankings(query)
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
.box {
  padding-bottom: 50px;
}
.title-one {
  display: flex;
  align-items: center;

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

span {
  cursor: pointer;
}

.title-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
}

.box {
  width: 1200px;
  margin: 0 auto;
}

.box-table {
  margin-top: 60px;
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
  margin-top: 30px;
}

::v-deep .el-pager .active {
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
  color: #9e9e9e !important;
}

::v-deep .el-pagination .btn-prev {
  background-color: transparent !important;
  color: #9e9e9e !important;
}

::v-deep .el-table {
  overflow: visible;
  background: #1b2233;
  color: #757575;
  border-bottom: 1px solid transparent;
  border-right: 1px solid transparent;
}

.el-table__header-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
}

::v-deep .el-table--border::after,
.el-table--group::after,
.el-table::before {
  border-bottom: transparent;
  height: 0;
}

::v-deep .el-table tr {
  background: transparent;
}

::v-deep .el-table--border th,
td {
  border-bottom: 1px solid #6062aa !important;
  border-right: none;
}

::v-deep .el-table__empty-text {
  display: none !important;
}

::v-deep .el-table__empty-block {
  display: none !important;
}

::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: #282f41;
}

::v-deep .el-table td.el-table__cell {
  background-color: transparent;
  border-bottom: 1px solid #6062aa !important;
}

::v-deep .el-table th.el-table__cell {
  background-color: #282f41;
  color: #757575;
  border-bottom: 1px solid #6062aa !important;
}
</style>
