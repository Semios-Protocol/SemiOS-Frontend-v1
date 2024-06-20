<template>
  <div class="box">
    <el-table
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
      <el-table-column width="370">
        <template #header>
          <span class="table-title table-cursor"
            >{{ $t('nodeDetail.mintedNFTsLabel') }}
          </span>
        </template>
        <template slot-scope="scope">
          <div class="title-one">
            <div class="imgdiv">
              <a
                :href="aPush(scope.row)"
                style="text-decoration: none; color: #745cd4"
              >
                <img class="title-img" :src="scope.row.imgUrl" alt="" />
              </a>
            </div>
            <a
              :href="aPush(scope.row)"
              style="text-decoration: none; color: #745cd4"
            >
              <span class="title-name fontbtn">
                <span
                  >{{ scope.row.daoName }}.{{ scope.row.nftNumber }}</span
                ></span
              >
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('price')"
            >{{ $t('nodeDetail.mintedPriceLabel') }}
            <i
              v-show="byName === 'price'"
              :class="byWay ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
            />
          </span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.price }} </span>
          <svg-icon icon-class="eth" />
        </template>
      </el-table-column>
      <!-- <el-table-column align="right">
        <template #header>
          <span class="table-title" @click="setOrderBy('floorPrice')"
            >Floor Price
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
      </el-table-column> -->

      <el-table-column align="right">
        <template #header>
          <span class="table-title table-cursor">Nodes </span>
        </template>
        <template slot-scope="scope">
          <div class="title-imgy">
            <a
              :href="daoPush(scope.row)"
              style="text-decoration: none; color: #745cd4"
            >
              <img class="title-img" :src="scope.row.daoLogo" alt=""
            /></a>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <span class="table-title table-cursor">Creator </span>
        </template>
        <template slot-scope="scope">
          <span
            class="clickspan fontbtn"
            v-if="scope.row.creatorName"
            @click="openHash(scope.row.creator, 'address')"
            >{{ scope.row.creatorName | hasHellipsis(7) }}</span
          >
          <span
            class="clickspan fontbtn"
            v-else
            @click="openHash(scope.row.creator, 'address')"
            >{{ scope.row.creator | ellipsis }}</span
          >
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <span class="table-title table-cursor">Minter </span>
        </template>
        <template slot-scope="scope">
          <span
            class="clickspan fontbtn"
            v-if="scope.row.minterName"
            @click="openHash(scope.row.minter, 'address')"
          >
            {{ scope.row.minterName | hasHellipsis(7) }}
          </span>
          <span
            class="clickspan fontbtn"
            v-else
            @click="openHash(scope.row.minter, 'address')"
          >
            {{ scope.row.minter | ellipsis }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <span class="table-title table-cursor">Owner </span>
        </template>
        <template slot-scope="scope">
          <span
            class="clickspan fontbtn"
            v-if="scope.row.ownerName"
            @click="openHash(scope.row.owner, 'address')"
            >{{ scope.row.ownerName | hasHellipsis(7) }}</span
          >
          <span
            class="clickspan fontbtn"
            v-else
            @click="openHash(scope.row.owner, 'address')"
            >{{ scope.row.owner | ellipsis }}</span
          >
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
import { nftsRankings } from '@/common/api'
import $ from 'jquery'
import _ from 'lodash'
export default {
  components: {
    TableLoading,
  },
  data() {
    return {
      tableData: [],
      byName: 'price',
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
    aPush(item) {
      return `/workDetails?id=${item.workId}`
    },
    daoPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
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
      const data = await nftsRankings(query)
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
.title-imgd {
  width: 50px;
  height: 50px;
  background: #f2f4f6;
  border-radius: 3px;
  margin-left: auto;
}

.title-imgy {
  width: 50px;
  height: 50px;
  background: #f2f4f6;
  border-radius: 50px;
  margin-left: auto;

  img {
    border-radius: 50px;
    width: 50px;
    height: 50px;
  }
}

.title-one {
  display: flex;
  align-items: center;

  .imgdiv {
    width: 50px;
    height: 50px;
    background: #f2f4f6;
    // border-radius: 3px;
    margin-right: 16px;

    .title-img {
      border-radius: 0;
    }
  }
}

.title-name {
  display: block;
  cursor: pointer;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // cursor: pointer;
  // width: 128px;
  color: #745cd4;
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

::v-deep .el-table {
  overflow: visible;
  background: #1b2233;
  color: #757575;
  border-bottom: 1px solid transparent;
  border-right: 1px solid transparent;
}

::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #282f41 !important;
}

.table-title {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
}

.fontbtn {
  color: #6062aa;
}

.table-cursor {
  cursor: auto;
}

::v-deep .el-table {
  font-size: 12px;
  font-weight: 600;
  color: #757575;
}

::v-deep .el-table tr {
  background: transparent;
}

::v-deep .el-pagination {
  text-align: center;
  margin: 70px 0;
}
::v-deep .el-pager li {
  background-color: transparent !important;
  color: #9e9e9e !important;
}
::v-deep .el-pager .active {
  color: #b3b5f2 !important;
  border: 1px solid;
  border-color: #b3b5f2;
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

.clickspan {
  cursor: pointer;
  color: #757575;
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
