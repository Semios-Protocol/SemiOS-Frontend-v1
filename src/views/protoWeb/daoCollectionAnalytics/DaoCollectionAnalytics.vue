<template>
  <loading v-if="isLoading" />
  <div class="as-box" v-else>
    <div class="box-left">
      <div
        class="left-item"
        :class="activeName === 'rightMember' ? 'activItem' : ''"
        @click="setActiv('rightMember')"
      >
        <h4>{{ $t('nodeDetail.membersOfSeedNodesLabel') }}</h4>
        <p>
          {{ $t('nodeDetail.starterLabel') }} :
          <span>{{ daoMember.starter | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('setupNodes.builderLabel') }} :
          <span>{{ daoMember.builder | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('setupNodes.minterLabel') }} :
          <span>{{ daoMember.mintter | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.nftHoldersLabel') }} :
          <span>{{ daoMember.nftHolders | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.erc20HoldersLabel') }} :
          <span>{{ daoMember.erc20Holders | bigNumFormat(5, 0.00001) }}</span>
        </p>
      </div>
      <div
        class="left-item"
        :class="activeName === 'rightDaoListItem' ? 'activItem' : ''"
        @click="setActiv('rightDaoListItem')"
      >
        <p>
          {{ $t('nodeDetail.subNodesQuantityLabel') }} :
          <span>{{ daoAmount.totalAmount | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.inProgressLabel') }} :
          <span>{{
            daoAmount.runningDaoAmount | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.closedLabel') }} :
          <span>{{ daoAmount.endedDaoAmount | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.upcomingLabel') }} :
          <span>{{
            daoAmount.notStartedDaoAmount | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
      </div>
      <div
        class="left-item"
        @click="setActiv('rightRoyalty')"
        :class="activeName === 'rightRoyalty' ? 'activItem' : ''"
      >
        <h4>{{ $t('nodeDetail.seedNodeserc20InfoLabel') }}</h4>
        <p>
          {{ $t('nodeDetail.totalSupplyLabel') }} :
          <span>{{ daoToken.totalSupply | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.circulatingerc20Label') }} :
          <span>{{ daoToken.daoTokenBalance | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.ethRedeemPoolLabel') }} :
          <span>{{
            daoToken.redeemAssetPoolEth | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.redeemedLabel') }} :
          <span>{{
            daoToken.redeemedErc20Amont | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
      </div>
      <div
        class="left-item"
        @click="setActiv('rightMaker')"
        :class="activeName === 'rightMaker' ? 'activItem' : ''"
      >
        <p>
          {{ $t('nodeDetail.makerLabel') }} :
          <span>{{
            daoMaker.makerTotalAmount | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.totalUnspentETHLabel') }} :
          <span>{{
            daoMaker.noSpendEthAmount | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.totalLockedrec20Label') }} :
          <span>{{
            daoMaker.noSpendTokenAmount | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
      </div>
      <div
        class="left-item"
        @click="setActiv('rightTreasury')"
        :class="activeName === 'rightTreasury' ? 'activItem' : ''"
      >
        <h4>{{ $t('nodeDetail.treasuryLabel') }}</h4>
        <p>
          {{ $t('nodeDetail.treasuryBalanceLabel') }} :
          <span>{{
            daoTreasury.treasuryTotalAmount | bigNumFormat(5, 0.00001)
          }}</span>
        </p>
      </div>

      <div
        class="left-item"
        @click="setActiv('rightIncentivePlan')"
        :class="activeName === 'rightIncentivePlan' ? 'activItem' : ''"
      >
        <p>
          {{ $t('nodeDetail.incentivePlanLabel') }} :
          <span>{{ daoPlan.planTotal | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.inProgressLabel') }} :
          <span>{{ daoPlan.planOngoing | bigNumFormat(5, 0.00001) }}</span>
        </p>

        <p>
          {{ $t('nodeDetail.closedLabel') }} :
          <span>{{ daoPlan.planEnd | bigNumFormat(5, 0.00001) }}</span>
        </p>
        <p>
          {{ $t('nodeDetail.upcomingLabel') }} :
          <span>{{ daoPlan.planNotStarted | bigNumFormat(5, 0.00001) }}</span>
        </p>
      </div>

      <a :href="goSetUp()" style="text-decoration: none">
        <div class="left-item add-title">
          <p><i class="el-icon-plus" /></p>
          <span>{{ $t('nodeDetail.addNodesBtnText') }} </span>
        </div></a
      >
    </div>
    <div class="box-right" v-if="!isLoading">
      <component
        :is="activeName"
        :address="daoToken.erc20Address"
        :mainDaoId="daoAmount.mainDaoId"
        :projectId="daoPlan.projectId"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loading from '@/components/Loading.vue'
import rightMember from './RightMember.vue'
// import rightDaoListItem from "./RightDaoListItem.vue";
// import rightMaker from "./RightMaker.vue";
// import rightRoyalty from "./RightRoyaltyToken.vue";
import {
  togetherDaoMember,
  togetherDaoAmount,
  togetherDaoToken,
  togetherDaoMaker,
  togetherTreasury,
  togetherPlan,
} from '@/common/api'
export default {
  name: 'DaoCollectionAnalytics',
  components: {
    rightMember,
    // rightMember: () => import("./RightMember.vue"),
    rightDaoListItem: () => import('./RightDaoListItem.vue'),
    rightMaker: () => import('./RightMaker.vue'),
    rightRoyalty: () => import('./RightRoyaltyToken.vue'),
    rightTreasury: () => import('./RightTreasury.vue'),
    rightIncentivePlan: () => import('./RightIncentivePlan.vue'),
    Loading,
  },
  data() {
    return {
      activeName: 'rightMember',
      isLoading: true,
      daoMember: {
        starter: 0,
        builder: 0,
        mintter: 0,
        nftHolders: 0,
        erc20Holders: 0,
      },
      daoAmount: {
        totalAmount: 0,
        runningDaoAmount: 0,
        endedDaoAmount: 0,
        notStartedDaoAmount: 0,
      },
      daoToken: {
        totalSupply: 0,
        daoTokenBalance: 0,
        redeemAssetPoolEth: 0,
        redeemedErc20Amont: 0,
        erc20Address: '',
      },
      daoMaker: {
        makerTotalAmount: 0,
        noSpendEthAmount: 0,
        noSpendTokenAmount: 0,
      },
      daoTreasury: { treasuryTotalAmount: 0 },
      daoPlan: {
        planTotal: 0,
        planOngoing: 0,
        planEnd: '',
        planNotStarted: 0,
        projectId: '',
      },
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  created() {
    this.getData()
  },
  methods: {
    goSetUp() {
      console.log('wewewqaeawde')
      return `/setupdao?id=${this.daoAmount.mainDaoId}`
    },
    async getData() {
      try {
        const query = {
          daoId: this.$route.query.id,
        }
        const daoMemberRes = await togetherDaoMember(query)
        this.daoMember = daoMemberRes.data
        const daoAmountRes = await togetherDaoAmount(query)
        this.daoAmount = daoAmountRes.data
        const daoTokenRes = await togetherDaoToken(query)
        this.daoToken = daoTokenRes.data
        const daoMakerRes = await togetherDaoMaker(query)
        this.daoMaker = daoMakerRes.data
        const daoTreasury = await togetherTreasury(query)
        this.daoTreasury = daoTreasury.data
        const daoPlan = await togetherPlan(query)
        this.daoPlan = daoPlan.data
      } catch (error) {
        console.log(error, 'error')
      }
      this.activeName = 'rightMember'
      this.isLoading = false
    },
    setActiv(name) {
      this.activeName = name
    },
  },
}
</script>
<style scoped lang="scss">
.as-box {
  color: #9e9e9e;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  display: flex;
  min-width: 1240px;
  padding: 0 48px;
  margin-top: 40px;
  box-sizing: border-box;
  .box-left {
    width: 232px;
    margin-right: 40px;
  }
  .box-right {
    flex: 1;
  }
  .left-item {
    border-radius: 2px;
    background: #282f41;
    width: 232px;
    margin-bottom: 4px;
    padding: 8px;
    box-sizing: border-box;
    cursor: pointer;
    h4 {
      margin: 0;
      margin-bottom: 12px;
    }
    p {
      margin: 0;
      font-size: 14px;
      margin-bottom: 6px;
      span {
        color: #fff;
      }
    }
  }
  .activItem {
    border: 1px solid #6062aa;
    background-color: #364159;
  }
  .p-text {
    color: #fff;
  }
}

.add-title {
  border-radius: 2px;
  border: 1px dashed #6062aa;
  background: #252b3a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  p {
    margin: 0;
    font-size: 24px;
    color: #fff;
  }
  span {
    color: #9e9e9e;
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
  i {
    font-size: 24px;
  }
}
</style>
