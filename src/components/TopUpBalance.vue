<template>
  <div v-if="isLoading" class="loading-box">
    <loading />
  </div>
  <div class="balance-box" v-else>
    <el-row class="b-title">
      <el-col :span="8">
        <div class="title-st">{{ $t('workDetail.nftLabel') }}</div>
      </el-col>
      <el-col :span="8">
        <div class="title-st">{{ $t('workDetail.balanceLabel') }}</div>
      </el-col>
      <el-col :span="8">
        <div class="title-st">{{ $t('workDetail.erc20TokensLabel') }}</div>
      </el-col>
    </el-row>
    <div class="table-box">
      <el-row v-for="(item, idx) in list" :key="item.daoName + idx">
        <el-col :span="8">
          <div
            class="title-name"
            @click="goOpen(item.togetherDaoId)"
            v-if="!isTop"
          >
            {{ item.daoName }}
          </div>
          <div class="title-name" @click="goOpenWrok(item.workId)" v-else>
            {{ item.workName }}
            <span>{{ item.daoName }}</span
            >.{{ item.workNumber }}
            <span v-if="item.workLockStatus === 1">
              <svg-icon icon-class="lock" />
            </span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="title-bal">
            {{ item.ethBalance | bigNumFormat(5, 0.00001) }}
            <TokenIcon
              size="14px"
              :payCurrencyType="item.payCurrencyType"
              :inputTokenAddress="item.inputTokenAddress"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="title-bal">
            {{ item.tokenBalance | bigNumFormat(5, 0.00001) }}
            <TokenIcon
              size="14px"
              :daoToken="true"
              :daoSymbol="item.daoSymbol"
              :daoErc20Address="item.daoErc20Address"
            />
          </div>
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
      default: false,
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
  height: 160px;
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
.flexbox {
  height: 160px;
  margin-top: 18px;
}
</style>
