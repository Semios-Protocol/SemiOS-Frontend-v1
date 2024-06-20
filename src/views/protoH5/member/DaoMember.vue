<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="member-box" v-else>
    <van-notice-bar
      color="#fff"
      background="#745CD4"
      left-icon="info-o"
      v-if="daoData.daoStatus === 1"
    >
      This DAO will start to mint in {{ daoTime.h }} hours :
      {{ daoTime.m }} minutes : {{ daoTime.s }} seconds.
    </van-notice-bar>

    <!-- <div class="notiftime">
      The DAO has reached its Daily Minting Cap,and it will start to mint again
      in： 13 hours : 30 minutes ： 29
    </div> -->
    <div style="padding: 0 20px">
      <transition name="van-slide-down">
        <div class="details-box">
          <div class="deb-top">
            <div class="dep-top-img">
              <img :src="daoData.daoLogoUrl" alt="" />
            </div>
            <div class="dep-top-card">
              <div class="card-top">
                <div class="card-top-left" @click="dialogTitleOne = true">
                  DAO Flow <van-icon name="warning-o" />
                </div>

                <div
                  style="margin-left: auto; display: flex; align-items: center"
                >
                  <!-- <div
                    class="card-top-aright"
                    @click="dialogTitlePro = true"
                    v-if="daoData.basicDao === 1"
                  >
                    <svg-icon icon-class="Pro" />
                  </div> -->
                  <div class="card-top-aright" @click="dialogTitleTwo = true">
                    <svg-icon icon-class="why" />
                  </div>
                  <div class="popbox">
                    <van-popover
                      v-model="shareActionsPopover"
                      theme="dark"
                      trigger="click"
                      placement="bottom-end"
                      :offset="[15, 5]"
                    >
                      <div class="new-popover-box">
                        <div
                          v-for="item in shareActions"
                          :key="item.name"
                          class="popover-item"
                          :class="item.disabled ? 'popdisabled' : ''"
                          @click="setActionsPopover(item)"
                        >
                          {{ item.name }}
                        </div>
                        <div
                          v-for="item in socialLinkList"
                          :key="item.name"
                          class="popover-item"
                          @click="setActionsPopover(item)"
                        >
                          {{ item.name }}
                        </div>
                      </div>
                      <template #reference>
                        <span> <svg-icon icon-class="share" /></span>
                      </template>
                    </van-popover>
                  </div>
                  <div
                    class="popbox"
                    style="margin: 0"
                    v-if="
                      MetaMaskAddress &&
                      MetaMaskAddress === daoData.creatorAddress
                    "
                  >
                    <van-popover
                      v-model="showMorePopover"
                      theme="dark"
                      trigger="click"
                      placement="bottom-end"
                      :offset="[15, 5]"
                    >
                      <div class="new-popover-box">
                        <div
                          v-for="item in moreActions"
                          :key="item.name"
                          class="popover-item"
                          :class="item.disabled ? 'popdisabled' : ''"
                          @click="onMoreSelect(item)"
                        >
                          {{ item.name }}
                        </div>
                      </div>
                      <template #reference>
                        <span> <svg-icon icon-class="dddd" /></span>
                      </template>
                    </van-popover>
                  </div>
                </div>
              </div>
              <div class="card-top-two">
                <span>{{ daoData.daoFlow }}</span>
                <svg-icon icon-class="eth" />
              </div>
              <div class="card-top-thr">
                {{ daoData.daoName }}
              </div>
              <div class="card-top-bom">
                Creator
                <span @click="goOpen(daoData.creatorAddress)">{{
                  daoData.creatorAddress | ellipsis
                }}</span>
              </div>
            </div>
          </div>
          <div class="dep-cen">
            <van-row>
              <van-col span="8">
                <div class="box-col">
                  <p class="col-p1">{{ daoData.workNumber }}</p>
                  <p class="col-p2">Works</p>
                </div></van-col
              >
              <van-col span="8"
                ><div class="box-col cen-col">
                  <p class="col-p1">
                    {{ daoData.nftNumber }}/{{ daoData.totalNftCasting }}
                  </p>
                  <p class="col-p2">NFTs</p>
                </div></van-col
              >
              <van-col span="8"
                ><div class="box-col rig-col">
                  <p class="col-p1">
                    {{ daoData.mintWindow }}/{{ daoData.daoMintWindow }}
                  </p>
                  <p class="col-p2">DAO Mint Window</p>
                </div></van-col
              >
            </van-row>
          </div>
          <div class="dep-cen">
            <van-row>
              <van-col span="8">
                <div class="box-col">
                  <p class="col-p1">{{ daoData.daoToken | numFilter }}</p>
                  <p class="col-p2">DAO Token</p>
                </div></van-col
              >
              <van-col span="8"
                ><div class="box-col cen-col">
                  <p class="col-p1 col-zi">
                    <span @click="goOpen(daoData.feelPool)">{{
                      daoData.daoAssetPool | numFilter
                    }}</span>
                  </p>
                  <p class="col-p2">Asset Pool</p>
                </div></van-col
              >
              <van-col span="8"
                ><div class="box-col rig-col">
                  <p class="col-p1">
                    {{ daoData.royaltyFee | royaltyFeeFilter }}%
                  </p>
                  <p class="col-p2">Royalty Fee</p>
                </div></van-col
              >
            </van-row>
          </div>
          <div class="dep-dis" v-show="!isOpen">
            <p>DAO’s Manifesto</p>
            <div>
              <markdown-it-vue
                class="md-body"
                :content="daoData.daoManitesto"
              />
            </div>
            <p>DAO’s Description</p>
            <div>
              <markdown-it-vue
                class="md-body"
                :content="daoData.daoDescription"
              />
            </div>
          </div>
        </div>
      </transition>

      <div class="show-open">
        <span v-if="isOpen" @click="setOpen">
          <svg-icon icon-class="open" style="font-size: 24px"
        /></span>
        <span v-else @click="setOpen">
          <svg-icon icon-class="offtop" style="font-size: 24px"
        /></span>
      </div>
      <van-tabs
        v-model="activeName"
        background="#000"
        color="#745CD4"
        title-active-color="#B3B5F2"
        title-inactive-color="#999"
      >
        <van-tab
          name="works"
          title="Mintable Works"
          v-if="daoData.daoStatus !== 3"
        />
        <van-tab name="nfts" title="NFTs" />
        <van-tab name="drb" title="DRB NFTs" />
        <van-tab
          name="related"
          title="Related Nodes"
          v-if="daoData.basicDao === 1"
        />
      </van-tabs>
      <component :is="activeName" />
    </div>

    <van-dialog v-model="dialogShow" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <div><svg-icon icon-class="smiley" style="font-size: 104px" /></div>
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-title">Congratulation!</p>
      <p class="dialog-text">If you are a member of this DAO, you can now</p>
      <div class="flex-btn">
        <van-button color="#745CD4" style="width: 100%" @click="membership"
          >Mint & Transfer Membership NFT
        </van-button>
      </div>
      <div class="flex-btn to-btn">
        <van-button color="#745CD4" style="width: 100%" @click="goAddWork"
          >Add your own works</van-button
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
    </van-dialog>

    <van-dialog v-model="dialogTitleOne" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="dialogTitleOne = false"
          ><van-icon name="cross"
        /></span>
      </div>

      <p class="dialog-text">
        Total revenue received from NFT minting, NFT trading royalties and other
        activities (such as directly added liquidity).
      </p>
    </van-dialog>

    <van-dialog
      v-model="dialogTitleTwo"
      :show-confirm-button="false"
      style="max-height: 600px; overflow: auto"
    >
      <div slot="title" class="dialog-title">
        <span>Guidelines for Users</span>
        <span class="dialog-icon" @click="dialogTitleTwo = false"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text no-center">
        <span class="no-c-text"
          >1. All membership NFTs are priced 0.01 ether each.</span
        >
        <span class="no-c-text">
          2. All minting revenue, trading royalties and other forms of liquidity
          go into DAO’s asset pool.
        </span>
        <span class="no-c-text"
          >3. All members receive DAO Token rewards for their contributions,
          creating DAO, creating work, minting, etc. These tokens can trade
          against the DAO’s asset pool.</span
        >

        <span class="no-c-text no-c-t2">
          3.1 50%, 25% and 25% of DAO Tokens are rewarded to DAO Creator, Work
          Creators and Members respectively, based on their contribution. The
          issuance is linear within the DAO’s mint window.
        </span>
        <span class="no-c-text no-c-t2">
          3.2 Only 5% of the DAO Tokens will be issued in non-PRO version DAO.
          Once upgraded to PRO version, the other 95% becomes available for
          issuance with customisability.</span
        >
        <span class="no-c-text">
          4. Non-PRO DAOs have a set mint window of 60 days.</span
        >
        <span class="no-c-text">
          5. Once DAO Flow reaches 2 ethers in total revenue, PRO features opens
          to the creator. These are extremely powerful and versatile
          functionalities, use with caution.</span
        >
        <span class="no-c-text no-c-t2">
          5.1 PRO version allow customisability of all above parameters.
        </span>
        <span class="no-c-text no-c-t2">
          5.2 PRO players take the shortcut by directly transferring ethers into
          the DAO’s asset pool.</span
        >
      </p>
    </van-dialog>

    <van-dialog
      v-model="dialogTitlePro"
      :show-confirm-button="false"
      style="max-height: 600px; overflow: auto"
    >
      <div slot="title" class="dialog-title">
        <span>Guidelines for Users</span>
        <span class="dialog-icon" @click="dialogTitlePro = false"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text no-center">
        <span class="no-c-text"
          >The logo means that this DAO has been upgraded to PRO version, PRO
          version allow customisability of strategies and on-chain
          parameters.</span
        >
      </p>
    </van-dialog>

    <van-dialog v-model="dialogTitleThr" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="dialogTitleThr = false"
          ><van-icon name="cross"
        /></span>
      </div>

      <p class="dialog-text">
        Currently, you can't edit on-chain parameters, you can upgrade to PRO
        version after the DAO Flow reaches 2 ethers.
      </p>
    </van-dialog>
  </div>
</template>

<script>
import works from './MemberWorks.vue'
import nfts from './MemberNFTs.vue'
import drb from './MemberDrb.vue'
import related from './MemberRelated.vue'
import { Notify } from 'vant'
import { daoDetail } from '@/common/api'
import { copysPro } from '@/utils'
import { OPEN_URL } from '@/config.js'
import { mapState } from 'vuex'
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import Loading from '@/components/Loading.vue'
export default {
  components: { works, nfts, drb, related, Loading, MarkdownItVue },
  data() {
    return {
      dialogShow: true,
      activeName: 'works',
      isOpen: true,
      shareActions: [
        { name: 'Copy Link', value: 'copy', disabled: false },
        { name: 'Open On Opensea', value: 'opensea', disabled: false },
        { name: 'Open On Telegram', value: 'discord', disabled: false },
        { name: 'Open On Twitter', value: 'twitter', disabled: false },
      ],
      socialLinkList: [],
      showMorePopover: false,
      moreActions: [
        { name: 'Edit Information', value: 'editInformation' },
        // { name: "Edit On-Chain Parameters", value: "editParameters" },
        { name: 'Edit Nodes Strategies', value: 'editStrategies' },
      ],
      daoData: {},
      dialogTitleOne: false,
      dialogTitleTwo: false,
      dialogTitleThr: false,
      dialogTitlePro: false,
      shareActionsPopover: false,
      isLoading: true,
      daoTime: {
        h: 0,
        m: 0,
        s: 0,
      },
      myTimeDisplay: null,
    }
  },
  watch: {
    '$route.query.id': {
      handler(newVal) {
        //判断newVal有没有值监听路由变化
        if (newVal) {
          this.isLoading = true
          this.dialogShow = true
          this.getData()
        }
      },
    },
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  mounted() {
    this.activeName = this.$route.query.type ? this.$route.query.type : 'works'
    this.getData()
  },
  methods: {
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
      if (http) {
        window.open(http + url, '_blank')
      } else {
        const newUrl = url.slice(0, 4) === 'http' ? url : 'https://' + url
        window.open(newUrl, '_blank')
      }
    },
    copyLink() {
      const url = location.origin + '/dao?id=' + this.daoData.daoId
      // :8080/dao?id=7
      copysPro(url)
      Notify({
        message: 'Copied!',
        color: '#F0F0F0',
        background: '#745CD4',
        duration: 3000,
      })
    },
    async getData() {
      const data = await daoDetail({ daoId: this.$route.query.id })
      this.daoData = data.data
      this.shareActions[1].disabled = this.daoData.openseaLink ? false : true
      this.shareActions[2].disabled = this.daoData.discordLink ? false : true
      this.shareActions[3].disabled = this.daoData.twitterLink ? false : true
      const filter = this.daoData.socialLinks.filter((item) => item !== '')
      this.socialLinkList = filter.map((item, idx) => {
        return {
          name: 'Open External Link ' + (idx + 1),
          value: item,
          disabled: false,
        }
      })
      // this.daoData.daoStatus = 1;
      // this.daoData.startTime = 3588;
      if (this.daoData.daoStatus === 1 && this.daoData.startTime > 0) {
        this.daoTime.h = parseInt(this.daoData.startTime / 60 / 60)
        this.daoTime.m = parseInt(
          this.daoData.startTime / 60 - this.daoTime.h * 60
        )
        this.daoTime.s = parseInt(
          this.daoData.startTime -
            this.daoTime.h * 60 * 60 -
            this.daoTime.m * 60
        )
        this.setTimeNum()
      }
      this.activeName = this.$route.query.type
        ? this.$route.query.type
        : this.daoData.daoStatus === 3
        ? 'nfts'
        : 'works'
      this.isLoading = false
    },

    async setTimeNum() {
      clearInterval(this.myTimeDisplay)
      this.myTimeDisplay = null
      this.myTimeDisplay = setInterval(() => {
        this.daoData.startTime -= 1
        if (this.daoData.startTime > 0) {
          this.daoTime.h = parseInt(this.daoData.startTime / 60 / 60)
          this.daoTime.m = parseInt(
            this.daoData.startTime / 60 - this.daoTime.h * 60
          )
          this.daoTime.s = parseInt(
            this.daoData.startTime -
              this.daoTime.h * 60 * 60 -
              this.daoTime.m * 60
          )
        } else {
          this.getData()
        }
      }, 1000)
    },
    setMore() {
      this.showMore = !this.showMore
    },
    onMoreSelect(val) {
      if (this.daoData.daoStatus === 3) {
        Notify({
          message: 'You can no longer edit as the DAO has ended.',
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 3000,
        })
        return
      }
      this.$router.push({
        path: `/${val.value}`,
        query: {
          id: this.$route.query.id,
        },
      })

      this.showMorePopover = false
      // if(val.value ==='chainParameter'){
      //     this.$router.push({
      //     path: `/${val.value}`,
      //     query: {
      //       id: this.$route.query.id,
      //     },
      //   });
      //   return
      // }
      // editParameters
      // else {
      //   this.dialogTitleThr = true;
      // }
    },
    setActionsPopover(val) {
      if (val.value === 'copy') {
        this.copyLink()
      } else {
        if (val.disabled) return
        let url = null
        let http = null
        if (val.value === 'opensea') {
          url = this.daoData.openseaLink
          http = 'https://opensea.io/'
          this.goOpenUrl(url, http)
          return
        }
        if (val.value === 'discord') {
          url = this.daoData.discordLink
          http = 'https://t.me/'
          this.goOpenUrl(url, http)
          return
        }
        if (val.value === 'twitter') {
          url = this.daoData.twitterLink
          http = 'https://twitter.com/'
          this.goOpenUrl(url, http)
          return
        }
        this.goOpenUrl(val.value)
      }
      this.shareActionsPopover = false
    },
    close() {
      this.dialogShow = false
      this.dialogTitlePro = false
    },
    setOpen() {
      this.isOpen = !this.isOpen
    },
  },
  beforeDestroy() {
    clearInterval(this.myTimeDisplay)
    this.myTimeDisplay = null
  },
}
</script>

<style scoped lang="scss">
::v-deep .van-popover__content {
  background-color: red;
}
.member-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding: 0 20px;
}
.to-btn {
  margin-top: 20px;
}
::v-deep .van-tabs__line {
  width: 30% !important;
  background-color: #b3b5f2 !important ;
}
::v-deep .van-tab {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}
::v-deep .van-tab--active {
  font-weight: 500;
}
.show-open {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}
::v-deep .van-tabs--line {
  margin-bottom: 20px;
}

.details-box {
  margin-top: 18px;
}
.deb-top {
  height: 110px;
  display: flex;
  width: 100%;
  .dep-top-img {
    margin-right: 14px;
    width: 110px;
    img {
      width: 110px;
      height: 110px;
      object-fit: cover;
    }
  }
  .dep-top-card {
    color: #fff;
    flex: 1;
  }
  .card-top {
    display: flex;
    align-items: center;
  }
  .card-top-left {
    color: #9e9e9e;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    .van-icon {
      color: #b3b5f2;
    }
  }
  .card-top-aright,
  .card-top-bright {
    color: #ffffff;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    // float: right;
    // margin-top: -6px;
  }
  .card-top-aright {
    // margin-left: 18px;
    height: 24px;
    line-height: 24px;
    color: #b3b5f2;
    // margin-left: 12px;
  }
}
.card-top-two {
  color: #745cd4;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-top: 8px;
}
.card-top-thr {
  color: #f3f3f3;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 8px;
  width: 220px;
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-top-bom {
  color: #9e9e9e;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 6px;
  span {
    color: #745cd4;
    margin-left: 12px;
  }
}
.dep-cen {
  margin-top: 18px;
  color: #fff;
}
.box-col {
  display: flex;
  flex-direction: column;
}
.cen-col {
  align-items: center;
}
.rig-col {
  align-items: flex-end;
}
.col-p1 {
  color: #b3b5f2;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  margin: 0;
}
.col-p2 {
  color: #999;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  margin: 0;
}
.col-zi {
  color: #745cd4;
}
.dep-dis {
  margin-bottom: 12px;
  p {
    color: #c4c4c4;
    text-align: center;
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-top: 20px;
    margin-bottom: 18px;
  }
  div {
    color: #c4c4c4;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}

// .my-sheet {
//   background-color: #282f41;
//   color: #f3f3f3;
//   font-size: 16px;
//   height: 54px;
//   line-height: 54px;
//   text-align: center;
// }
// .my-sheet:active {
//   background-color: #424a5f;
// }
.van-cell {
  border: 1px solid #6062aa;
  border-radius: 5px !important;
}
.no-center {
  text-align: left;
}
.no-c-text {
  display: block;
  color: #f3f3f3;
}
.no-c-t2 {
  padding-left: 18px;
}
// .dis-sheet {
//   color: #999999;
// }
// .dis-sheet:active {
//   color: #999999 !important;
// }
::v-deep .van-popover--light .van-popover__arrow {
  color: #282f41;
}
.popbox {
  height: 24px;
  width: 24px;
  margin: 0 12px;
  line-height: 24px;
  color: #b3b5f2;
  font-size: 24px;
}
.popdisabled {
  color: #999999;
}
.popdisabled:active {
  background-color: #282f41 !important;
}
.new-popover-box {
  // padding: 8px 16px;
  // width: 240px;
  // background-color: #282f41;
  color: #f0f0f0;
  text-align: center;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
.popover-item {
  padding: 8px 16px;
}
.popover-item:active {
  background-color: #424a5f;
}
</style>
<style>
.van-popover--dark .van-popover__content {
  width: 180px;
  background-color: #282f41 !important;
}
.van-popover--dark .van-popover__arrow {
  top: 1px !important;
  color: #282f41;
}
.notiftime {
  background: #745cd4;
  color: #fff;
}
.markdown-body {
  color: #999;
}
</style>
