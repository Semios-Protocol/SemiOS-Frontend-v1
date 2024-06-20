<template>
  <div v-if="isLoading" class="balance-box">
    <loading />
  </div>
  <div class="balance-box" v-else>
    <el-row class="b-title">
      <el-col :span="5">
        <div class="title-st">Minted NFT</div>
      </el-col>
      <el-col :span="5">
        <div class="title-st">Voucher NFT</div>
      </el-col>
      <el-col :span="5">
        <div class="title-st">Operation Time</div>
      </el-col>
      <el-col :span="5">
        <div class="title-st">Mint Fee</div>
      </el-col>
      <el-col :span="4">
        <div class="title-st">Block Countdown</div>
      </el-col>
    </el-row>
    <div class="table-box">
      <el-row v-for="(item, idx) in list" :key="item.mintedWorkId + idx">
        <el-col :span="5">
          <div class="title-name" @click="goOpenWrok(item.mintedWorkId)">
            {{ item.mintedDaoName }}.{{ item.mintedWorkNumber }}
          </div>
        </el-col>
        <el-col :span="5">
          <div class="title-name" @click="goOpenWrok(item.voucherWorkId)">
            {{ item.voucherDaoName }}.{{ item.voucherWorkNumber }}
          </div>
        </el-col>
        <el-col :span="5">
          <div class="title-bal">
            {{ item.operationTime | timeFormatting(0, 1) }}
          </div>
        </el-col>
        <el-col :span="5">
          <div class="title-bal">
            {{ item.mintFee }}
            <TokenIcon
              size="14px"
              :payCurrencyType="item.mintedDaoPayCurrencyType"
              :inputTokenAddress="item.mintedDaoInputTokenAddress"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="title-bal">{{ item.endBlockTime | claimTime(0) }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import TokenIcon from '@/components/TokenIcon.vue'
import Loading from '@/components/Loading.vue'
export default {
  components: {
    TokenIcon,
    Loading,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isTop: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    goOpen(id) {
      this.$router.push({
        path: `/daoCollectionAnalytics`,
        query: {
          id: id,
        },
      })
    },
    goOpenWrok(id) {
      this.$router.push({
        path: `/workDetails`,
        query: {
          id: id,
        },
      })
    },
  },
}
</script>

<style scoped>
.balance-box {
  min-height: 160px;
}
.b-title {
  background: #2a2f41;
  color: #9e9e9e;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.2px;
  text-transform: capitalize;

  margin-top: 18px;
}

.el-row {
  line-height: 40px;
  height: 40px;
}

.title-name {
  color: #25b0c2;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
}

.title-bal {
  color: #fff;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}

.table-box {
  max-height: 120px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #9e9e9e transparent;
}
.flexbox {
  height: 160px;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #d9d9d9;
}
</style>
