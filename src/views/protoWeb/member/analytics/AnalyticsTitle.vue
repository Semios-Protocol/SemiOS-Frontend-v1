<template>
  <div class="title-box">
    <!-- <div class="capy-box">
      Contracts:
      <a
        :href="bPush(daoObj.erc721Address)"
        style="text-decoration: none; color: #424242"
        class="copy-text"
        target="_blank"
        >{{ daoObj.erc721Address }}</a
      >
      <span @click="copy(daoObj.erc721Address)" style="cursor: pointer">
        <svg-icon icon-class="copyhash1" />
      </span>
    </div> -->
    <el-row :gutter="20" class="box-row">
      <el-col :span="8" v-for="item in top" :key="item.name"
        ><div class="box-card">
          <p class="card-name">{{ item.name }}</p>
          <p class="card-num">
            {{ item.value }}
            <TokenIcon
              v-if="item.icon > 0"
              size="20px"
              :daoToken="item.erc20PaymentMode"
              :daoSymbol="item.daoSymbol"
              :daoErc20Address="item.daoErc20Address"
              :payCurrencyType="item.payCurrencyType"
              :inputTokenAddress="item.inputTokenAddress"
            />
          </p>
          <p
            class="card-rate"
            v-if="item.increase !== null"
            :style="{
              color: itemCompare(item.increase)
                ? '#16C784'
                : itemCompare(item.increase, 2)
                ? '#DF5D5D'
                : '',
            }"
          >
            <i
              :class="
                itemCompare(item.increase)
                  ? 'el-icon-caret-top'
                  : itemCompare(item.increase, 2)
                  ? 'el-icon-caret-bottom'
                  : ''
              "
            ></i>
            {{
              itemText(item.increase) ? lessNum : Math.abs(item.increase) + '%'
            }}
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="box-row">
      <el-col :span="8" v-for="(item, idx) in bom" :key="item.name"
        ><div class="box-card">
          <p class="card-name">{{ item.name }}</p>
          <p class="card-num">
            {{ item.value }}
            <TokenIcon
              v-if="item.icon > 0"
              size="20px"
              :daoToken="item.erc20PaymentMode"
              :daoSymbol="item.daoSymbol"
              :daoErc20Address="item.daoErc20Address"
              :payCurrencyType="item.payCurrencyType"
              :inputTokenAddress="item.inputTokenAddress"
            />
          </p>

          <div class="card-rate">
            <p
              v-if="item.increase !== null"
              :style="{
                color: itemCompare(item.increase)
                  ? '#16C784'
                  : itemCompare(item.increase, 2)
                  ? '#DF5D5D'
                  : '',
              }"
            >
              <i
                :class="
                  itemCompare(item.increase)
                    ? 'el-icon-caret-top'
                    : itemCompare(item.increase, 2)
                    ? 'el-icon-caret-bottom'
                    : ''
                "
              ></i>
              {{
                itemText(item.increase)
                  ? lessNum
                  : Math.abs(item.increase) + '%'
              }}
            </p>
            <a
              v-if="item.url !== null"
              :href="aPush(item)"
              style="text-decoration: none; float: right; color: #745cd4"
              :target="itemCompare(idx, 1, 1) ? '_blank' : ''"
              >View details</a
            >
            <!-- <button
              class="btn_text"
              v-if="item.url !== null"
              style="float: right"
              v-preventReClick
            >
              View details
            </button> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { analyticsStatistics } from '@/common/api'
import { copys, itemCompare } from '@/utils'
import { OPEN_URL } from '@/config.js'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: {
    TokenIcon,
  },
  props: {
    dayTime: {
      type: Number,
    },
    daoObj: {
      type: Object,
    },
  },
  watch: {
    dayTime() {
      this.getData()
    },
  },
  data() {
    return {
      icons: ['eth'],
      top: [],
      bom: [],
      lessNum: '< 1%',
    }
  },
  computed: {},
  mounted() {
    this.itemCompare = itemCompare
    this.getData()
  },
  methods: {
    itemText(item) {
      return Math.abs(item) < 1 && Math.abs(item) > 0
    },
    bPush(item) {
      return `${OPEN_URL}/token/${item}`
    },
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
    aPush(item) {
      return `${item.url}`
    },
    async getData() {
      // timeDay
      const query = { daoId: this.$route.query.id, dayTime: this.dayTime }
      const res = await analyticsStatistics(query)
      this.top = res.dataList.slice(0, 3)
      this.bom = res.dataList.slice(3, 6)
    },
  },
}
</script>
<style scoped lang="scss">
.box-card {
  height: 110px;
  border: 1px solid #6062aa;
  border-radius: 2px;
  padding: 16px 18px;
  box-sizing: border-box;
  p {
    margin: 0;
  }
  .card-name {
    font-size: 12px;
    color: #9e9e9e;
  }
  .card-num {
    font-size: 20px;
    color: #bbbaba;
    font-family: Inter5;
    margin: 8px 0;
  }
  .card-rate {
    font-size: 14px;
    color: #9e9e9e;
    display: flex;
    align-items: center;
    a {
      display: block;
      margin-left: auto;
    }
  }
}
.box-row {
  margin-bottom: 20px;
}
.capy-box {
  font-size: 14px;
  color: #9e9e9e;
  margin-bottom: 18px;
  height: 24px;
  span {
    color: #424242;
  }
  .copy-text {
    margin-right: 12px;
    cursor: pointer;
  }
}
</style>
