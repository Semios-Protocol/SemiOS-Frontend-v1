<template>
  <div class="box">
    <el-table
      :data="dataList"
      :row-style="{ height: '70px' }"
      :header-cell-style="tableHeaderCellStyle"
      style="width: 100%"
      class="box-table"
    >
      <el-table-column width="40">
        <template #header> </template>
        <template slot-scope="scope">
          <div class="title-one">
            <span style="width: 30px">{{ scope.row.code }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="240">
        <template #header>
          <span class="table-title"
            >{{ $t('nodeDetail.collectionLabel') }}
          </span>
        </template>
        <template slot-scope="scope">
          <div class="title-one">
            <div class="imgdiv">
              <a
                :href="aPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
              >
                <img class="title-img" :src="scope.row.canvasLogo" alt=""
              /></a>
            </div>
            <span class="title-name">
              <a
                :href="aPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
              >
                <span class="fontbtn"> {{ scope.row.canvasName }}</span></a
              >
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" v-if="daoStatus !== 3">
        <template #header>
          <span class="table-title" @click="setOrderBy('mintPrice')"
            >{{ $t('nodeDetail.mintPriceLabel') }}
            <i
              v-show="byName === 'mintPrice'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
            />
          </span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.mintPrice }} </span>
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <el-table-column align="right" v-if="daoStatus !== 3">
        <template #header>
          <span class="table-title" @click="setOrderBy('rdbVol')">
            <el-tooltip
              class="item"
              effect="dark"
              content="1 DAO Renew Block volumn"
              placement="top"
            >
              <span> DRB Vol</span>
            </el-tooltip>
            <i
              v-show="byName === 'rdbVol'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.rdbVol | numFilter }} </span>
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <el-table-column align="right" v-if="daoStatus !== 3">
        <template #header>
          <span class="table-title" @click="setOrderBy('sevenDayRdbVol')"
            ><el-tooltip
              class="item"
              effect="dark"
              content="7 DAO Renew Block volumn"
              placement="top"
            >
              <span> {{ $t('nodeDetail.sDRBVolLabel') }} </span>
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
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('totalVol')"
            >{{ $t('nodeDetail.totalVolLabel') }}
            <i
              v-show="byName === 'totalVol'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.totalVol | numFilter }} </span>
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('ntvr')"
            ><el-tooltip
              class="item"
              effect="dark"
              content="1 DAO Renew Block NFT Trading Volume Rate"
              placement="top"
            >
              <span> {{ $t('nodeDetail.drbTVRLabel') }} </span>
            </el-tooltip>
            <i
              v-show="byName === 'ntvr'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span> {{ scope.row.ntvr }}% </span>
        </template>
      </el-table-column>
      <el-table-column align="right" v-if="daoStatus !== 3">
        <template #header>
          <span class="table-title" @click="setOrderBy('sevenDayNtvr')"
            ><el-tooltip
              class="item"
              effect="dark"
              content="7 DAO Renew Block NFT Trading Volume Rate"
              placement="top"
            >
              <span> {{ $t('nodeDetail.sDTVRLabel') }} </span>
            </el-tooltip>
            <i
              v-show="byName === 'sevenDayNtvr'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span> {{ scope.row.sevenDayNtvr }}% </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('owners')"
            >{{ $t('nodeDetail.ownersLabel') }}
            <i
              v-show="byName === 'owners'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.owners | numFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('nfts')"
            >{{ $t('nodeDetail.nftsLabel') }}
            <i
              v-show="byName === 'nfts'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          /></span>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.nfts | numFilter }}
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
import { daoRewards } from '@/common/api'
import $ from 'jquery'
import _ from 'lodash'
export default {
  components: {
    TableLoading,
  },
  props: {
    daoStatus: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tableData: [],
      byName: 'mintPrice',
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
      const height = document.getElementsByClassName('box-nom')[0].scrollHeight
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
    aPush(item) {
      return `/canvases?type=nfts&id=${item.canvasId}`
    },
    goCanvas(item) {
      this.$router.push({
        path: '/canvases',
        query: {
          type: 'nfts',
          id: item.canvasId,
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
      this.isLoading = true
      const query = {
        daoId: this.$route.query.id,
        pageSize: 50,
        pageNo: this.currentPage,
      }
      const data = await daoRewards(query)
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
    margin-right: 16px;
  }
}
.title-name {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 128px;
  color: #745cd4;
  span {
    cursor: pointer;
  }
}
.title-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 3px;
  cursor: pointer;
}
.box {
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
</style>
