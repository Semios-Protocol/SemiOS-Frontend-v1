<template>
  <loading v-if="isLoading" />
  <div class="box" v-else>
    <el-alert center :closable="false" v-if="daoData.daoStatus === 1">
      <div slot="title">
        <i class="el-icon-info"></i> This Nodes will start to mint in
        {{ startTime | claimTime }}
      </div>
    </el-alert>
    <dao-title :objData="daoData" @setAmount="setAmount" />
    <div class="title-tab">
      <el-tabs v-model="activeName" @tab-click="tabsleClick">
        <el-tab-pane
          v-if="daoData.daoStatus !== 3"
          label="ꔷ Mintable Works"
          name="works"
        ></el-tab-pane>
        <el-tab-pane label="ꔷ NFTs" name="nfts"></el-tab-pane>
        <el-tab-pane
          v-if="daoData.daoStatus !== 3"
          label="ꔷ DRB NFTs"
          name="drb"
        ></el-tab-pane>
        <el-tab-pane label="ꔷ Related Nodes" name="related"></el-tab-pane>
        <!-- <el-tab-pane label="ꔷ Activity" name="activity"></el-tab-pane> -->
        <el-tab-pane
          v-if="daoData.daoStatus !== 1"
          label="ꔷ Analytics"
          name="analytics"
        ></el-tab-pane>

        <!-- <el-tab-pane
          label="ꔷ Royalty"
          name="royalty"
          v-if="daoData.daoStatus !== 1"
        ></el-tab-pane> -->

        <el-tab-pane
          label="ꔷ Asset Allocation Overview"
          name="assetAllocation"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <component
      :is="activeName"
      :dao-status="daoData.daoStatus"
      :start-date="daoData.startDate"
      :address="daoData.erc20Address"
      :daoObj="daoData"
    />

    <el-dialog
      title="Congratulation!"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      width="426px"
      :before-close="close"
    >
      <div class="dialog-title">
        <div><svg-icon icon-class="smiley" style="font-size: 104px" /></div>
      </div>
      <p class="dialog-text">If you are a member of this DAO, you can now</p>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="info"
          @click="membership"
          style="width: 100%; margin-bottom: 24px"
          >Mint & Transfer NFT</el-button
        >
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="goAddWork"
          style="width: 100%; margin: 0"
          >Add your own works</el-button
        >
      </div>

      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="daoData.discordLink"
            @click="goOpenUrl(daoData.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="daoData.twitterLink"
            @click="goOpenUrl(daoData.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DaoTitle from './DaoTitleV2.vue'
import works from './DaoUnmintedWorks.vue'
import related from './DaoRelated.vue'
import nfts from './DaoNFTs.vue'
import drb from './DaoDrb.vue'
// import activity from "./DaoActivity.vue";
import analytics from './analytics/DaoAnalytics.vue'
import assetAllocation from './assetAllocation/DaoAssetAllocation.vue'
import { copys } from '@/utils'
import Loading from '@/components/Loading.vue'
import { OPEN_URL } from '@/config.js'
import { analyticsDetail, favoriteCancel, favoriteActions } from '@/common/api'

export default {
  components: {
    DaoTitle,
    works,
    // activity,
    drb,
    nfts,
    Loading,
    analytics,
    related,
    assetAllocation,
  },
  data() {
    return {
      activeName: 'works',
      isLoading: true,
      daoData: { daoDescription: '' },
      startTime: 0,
      startDaoTimer: null,
      networkId: '',
      dialogShow: false,
      shareActionsPopover: false,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  watch: {
    MetaMaskAddress() {
      this.getData()
    },
    '$route.query.id': {
      handler(newVal, old) {
        //判断newVal有没有值监听路由变化
        if (newVal && old) {
          this.isLoading = true
          this.dialogShow = true
          this.getData()
        }
      },
    },
  },
  mounted() {
    this.activeName = this.$route.query.type ? this.$route.query.type : 'works'
    this.getData()
  },
  methods: {
    copyLink() {
      const url = location.origin + '/dao?id=' + this.daoData.daoId
      copys(url, this, 'Link copied!')
    },
    close() {
      this.dialogShow = false
      this.dialogTitlePro = false
    },
    goAddWork() {
      this.$router.push({
        path: `/addWork`,
        query: {
          id: this.daoData.daoId,
        },
      })
    },
    membership() {
      this.dialogShow = false
    },
    goOpen(value) {
      const url = `${OPEN_URL}/address/${value}`
      this.goOpenUrl(url)
    },
    goOpenUrl(url, http = null) {
      if (url) {
        if (http) {
          window.open(http + url, '_blank')
        } else {
          const newUrl = url.slice(0, 4) === 'http' ? url : 'https://' + url
          window.open(newUrl, '_blank')
        }
      }
    },
    async getData() {
      this.isLoading = true
      clearInterval(this.startDaoTimer)
      this.startDaoTimer = null
      const data = await analyticsDetail({ daoId: this.$route.query.id })
      this.daoData = data.data
      this.startTime = this.daoData.startTime
      this.timeCompute()
      this.activeName = this.$route.query.type
        ? this.$route.query.type
        : this.daoData.daoStatus === 3
        ? 'nfts'
        : 'works'
      this.isLoading = false
    },
    timeCompute() {
      this.startDaoTimer = setInterval(() => {
        if (this.startTime > 0) {
          this.startTime--
        } else {
          clearInterval(this.startDaoTimer)
          this.startDaoTimer = null
        }
      }, 1000)
    },
    tabsleClick() {
      this.$router.push({
        path: '/dao',
        query: {
          type: this.activeName,
          id: this.$route.query.id,
        },
      })
    },
    async setAmount() {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      const sig = await this.getSig()
      if (sig) {
        const query = {
          type: 0,
          favoriteId: this.daoData.daoId,
        }
        const res = this.daoData.favorited
          ? await favoriteCancel(query)
          : await favoriteActions(query)
        if (res) {
          this.daoData.favoriteAmount += this.daoData.favorited ? -1 : 1
          this.daoData.favorited = !this.daoData.favorited
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.startDaoTimer)
    this.startDaoTimer = null
  },
}
</script>
<style scoped lang="scss">
.dbtns {
  display: flex;
  flex-direction: column;
}
.box {
  min-width: 1240px;
  width: 100%;
  // background: #1b2233;
}
.title-tab {
  height: 85px;
  border-bottom: 0.5px solid #b3b5f2;
  border-top: 0.5px solid #b3b5f2;
  box-sizing: border-box;
  line-height: 85px;
  min-width: 1240px;
}
::v-deep .el-tabs__nav {
  float: none;
  margin: 0 auto;
  text-align: center;
}
::v-deep .el-tabs__active-bar {
  display: none;
}
::v-deep .el-tabs__item:hover {
  color: #b3b5f2;
}
::v-deep .el-tabs__item.is-active {
  color: #b3b5f2;
}
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
::v-deep .el-tabs__item {
  color: #bbbaba;
  font-weight: 400 !important;
}
::v-deep .el-alert {
  border-radius: 0;
  color: rgb(255, 255, 255);
  background-color: #745cd4;
}
</style>
