<template>
  <div class="box-collections" ref="box">
    <div class="query">
      <div v-if="!isCardLeft" class="ilicon">
        <span @click="setQuery">
          <svg-icon icon-class="query" />
        </span>
      </div>
      <div class="llicon" v-else>
        <span @click="setQuery">
          <svg-icon icon-class="left" style="font-size: 34px" />
        </span>
      </div>
      <div class="irse">
        <div class="icons-q">
          <div
            @click="setWorkType(1)"
            :class="workType === 1 ? 'activeWork' : 'nodeWork'"
          >
            <svg-icon icon-class="work1" />
          </div>
          <div
            @click="setWorkType(2)"
            :class="workType === 2 ? 'activeWork' : 'nodeWork'"
          >
            <svg-icon icon-class="work2" />
          </div>
        </div>
        <el-select v-model="qvalue" @change="qvalueChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="box-card">
      <div class="card-left" v-show="isCardLeft">
        <p style="margin-top: 24px">Price Range(ETH)</p>
        <div class="input-box">
          <el-input
            v-model="queryData.minInput"
            placeholder="Min"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+99)}"
          ></el-input>
          <span> to </span>
          <el-input
            v-model="queryData.maxInput"
            placeholder="Max"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+99)}"
          ></el-input>
        </div>
        <div class="box-btn">
          <button
            class="btn_query"
            :disabled="!queryData.minInput && !queryData.maxInput"
            :class="{
              isMainDisabled: !queryData.minInput && !queryData.maxInput,
            }"
            @click="apply"
          >
            Apply
          </button>
        </div>
        <el-divider class="divider-item"></el-divider>
        <div class="typeOfSale">
          <p>Type of Sale</p>
          <el-radio-group v-model="queryData.typeSale" @change="apply">
            <el-radio
              v-for="item in typeSales"
              :key="item.label"
              :label="item.label"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </div>
      </div>

      <div class="work-box-card" v-if="workType === 1">
        <work-item-card :list="list" :isAll="isAll" :isLoading="isLoading" />
      </div>
      <div v-else style="margin: 0 auto">
        <vue-waterfall-easy
          :imgsArr="list"
          :isAll="isAll"
          :is-loading="isLoading"
          srcKey="imgUrl"
          :card-width="cardWidth"
          :isCardLeft="isCardLeft"
          @scrollReachBottom="handleReachBottom"
          card-class="cardStyle"
          @click="handleClick"
        >
        </vue-waterfall-easy>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { workExploreUnmitedWorks } from '@/common/api'
import WorkItemCard from '@/components/WorkItemCard.vue'

import vueWaterfallEasy from '@/components/vue-waterfall/waterfallWeb'
export default {
  components: {
    WorkItemCard,
    vueWaterfallEasy,
  },
  props: {
    daoStatus: {
      type: Number,
    },
  },
  data() {
    return {
      workType: 1,
      isLoading: true,
      list: [],
      queryData: {
        minInput: '',
        maxInput: '',
        typeSale: '2',
      },
      typeSales: [
        {
          name: 'All',
          label: '2',
        },
        {
          name: 'Floating Price',
          label: '0',
        },
        {
          name: 'Fixed Price',
          label: '1',
        },
      ],
      isCardLeft: false,
      qvalue: '0',
      options: [
        {
          value: '0',
          label: 'Recently Listed',
        },
        {
          value: '1',
          label: 'Most Favorited',
        },
        {
          value: '2',
          label: 'Price: High to Low',
        },
        {
          value: '3',
          label: 'Price: Low to High',
        },
      ],
      pageNo: 1,
      pageSize: 10,
      count: 0,
      isApply: false,
      isAll: false,
    }
  },
  computed: {
    ...mapState(['ClientW']),
    cardWidth() {
      if (this.ClientW <= 1379) {
        return 1104
      }
      if (this.ClientW > 1379 && this.ClientW <= 1655) {
        return 1380
      }
      if (this.ClientW > 1655 && this.ClientW <= 1960) {
        return 1656
      }
      if (this.ClientW > 1960 && this.ClientW <= 2220) {
        return 1932
      }
      return 2208
    },
  },
  created() {
    window.addEventListener('scroll', this.lazyLoading, true)
    if (this.daoStatus !== 3) {
      this.getData()
    } else {
      this.$router.push({
        path: '/404',
      })
    }
  },
  methods: {
    setAmount() {},
    async getData() {
      const query = {
        daoId: this.$route.query.id,
        sortCondition: this.qvalue,
        minPrice: this.isApply ? this.queryData.minInput : '',
        maxPrice: this.isApply ? this.queryData.maxInput : '',
        fixedPrice: this.isApply ? this.queryData.typeSale : '',
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }
      const data = await workExploreUnmitedWorks(query)
      const dataList = data.dataList.map((item) => {
        return {
          ...item,
          isMore: false,
        }
      })
      this.list = this.list.concat(dataList)
      this.count = data.page.count
      this.isLoading = false
      this.isAll = this.pageNo * this.pageSize >= this.count
      this.ifScrollHeight()
    },
    ifScrollHeight() {
      if (
        document.body.scrollHeight <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        !this.isAll
      ) {
        this.pageNo += 1
        this.isLoading = true
        this.getData()
      }
    },
    lazyLoading() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (this.pageNo * this.pageSize < this.count) {
        if (scrollHeight - clientHeight <= scrollTop + 580) {
          if (this.isLoading) return
          this.pageNo += 1
          this.isLoading = true
          this.getData()
        }
      }
    },
    handleReachBottom() {
      // this.imgsArr = this.imgsArr.concat(this.imgsArr);
      console.log('--this.imgsArr--', this.imgsArr)
    },
    handleClick(e, instance) {
      console.log('==handleClick===', e, instance)
    },
    setQuery() {
      this.isCardLeft = !this.isCardLeft
    },
    qvalueChange() {
      this.list = []
      this.pageNo = 1
      this.isLoading = true
      this.isAll = false
      this.getData()
    },
    apply() {
      this.isApply = true
      this.qvalue = '3'
      this.qvalueChange()
    },
    setWorkType(val) {
      if (val === this.workType) return
      this.workType = val
      this.qvalueChange()
    },
  },
  beforeDestroy() {
    this.list = []
    window.removeEventListener('scroll', this.lazyLoading, true)
  },
}
</script>

<style scoped lang="scss">
.box-collections {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.work-box-card {
  flex: 1;
}
.card-left {
  width: 272px;
  border-right: 1px solid #b3b5f2;
  box-sizing: border-box;
  .box-btn {
    margin: 0 12px;
  }
  p {
    color: #bbbaba;
    font-size: 14px;
    margin: 0;
    margin-left: 12px;
  }
  .input-box {
    display: flex;
    align-items: center;
    width: 248px;
    margin: 20px auto;
    ::v-deep .el-input__inner {
      border: 0;
    }
    span {
      margin: 0 auto;
      color: #757575;
      font-size: 14px;
    }
    ::v-deep .el-input {
      width: 98px;
    }
    ::v-deep .el-input__inner {
      width: 98px;
      background-color: #282f41;
      color: #fff;
    }
  }
  .divider-item {
    width: 90%;
    margin: 24px auto;
    background: #b3b5f2;
  }
  .typeOfSale {
    margin: 20px 12px;
    p {
      margin: 0;
      text-align: left;
    }
    ::v-deep .el-radio-group {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    ::v-deep .el-radio__inner:hover {
      border-color: #745cd4;
    }
    ::v-deep .el-radio__input.is-checked .el-radio__inner {
      border-color: #745cd4;
      background: #745cd4;
    }
    ::v-deep .el-radio__inner {
      font-size: 14px;
    }
    ::v-deep .el-radio {
      margin-bottom: 12px;
      color: #bbbaba;
    }
    ::v-deep .el-radio__input.is-checked + .el-radio__label {
      color: #745cd4;
    }
  }
}
.box-card {
  display: flex;
  flex: 1;
}
.query {
  height: 108px;
  display: flex;
  align-items: center;

  .ilicon {
    font-size: 34px;
    width: 272px;
    // border-right: 1px solid #c5dadd;
    // box-sizing: border-box;
    height: 100%;
    line-height: 108px;
    text-align: start;
    span {
      cursor: pointer;
    }
    .svg-icon {
      margin-left: 28px;
    }
  }
  .llicon {
    font-size: 24px;
    width: 272px;
    border-right: 1px solid #b3b5f2;

    border-bottom: 1px solid #b3b5f2;
    box-sizing: border-box;
    height: 100%;
    line-height: 108px;
    text-align: end;
    span {
      cursor: pointer;
    }
    .svg-icon {
      margin-right: 12px;
      font-size: 34px;
    }
  }
  .irse {
    margin-left: auto;
    margin-right: 28px;

    display: flex;
  }
  ::v-deep .el-input__inner {
    width: 210px;
    height: 34px;
    font-size: 12px;
  }
}
.title {
  height: 360;
}
.item {
  // border: 1px solid #ac0;
  width: 260px;
  margin: 0 8px;
}
.masonry-container {
  /* width: 55%; */
  position: relative;
  overflow: hidden;
}

.el-select-dropdown__item {
  font-size: 12px;
}
.el-range-editor.is-active,
.el-range-editor.is-active:hover,
.el-select .el-input.is-focus .el-input__inner {
  border-color: #c0c4cc !important;
}

::v-deep .el-button {
  width: 100%;
}
::v-deep .el-select .el-input__inner:focus {
  border-color: #c0c4cc;
}
.btn_query {
  width: 100%;
  display: flex;
  height: 33px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 2px;
  background: #745cd4;
  color: #f3f3f3;
  border-style: none;
}
.btn_query:active {
  background: #533fa1;
}
.isMainDisabled {
  background: #2e2555 !important;
  border-color: #2e2555 !important;
  cursor: no-drop !important;
}
.isMainDisabled:active {
  background: #533fa1;
}

.icons-q {
  height: 34px;
  display: flex;
  background-color: #282f41;
  align-items: center;
  padding: 0 2px;
  border-radius: 4px;
  margin-right: 18px;
  div {
    width: 30px;
    height: 30px;
    padding: 2px;
    box-sizing: border-box;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  // span {
  //   font-size: 22px;
  // }
}
.activeWork {
  color: #b3b5f2;
  background-color: #1b2233 !important;
}
.nodeWork {
  color: #656a91;
  background-color: #282f41;
}
</style>
