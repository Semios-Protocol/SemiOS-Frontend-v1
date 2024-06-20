<template>
  <div class="title-box">
    <div class="box-top">
      <div class="top-left">
        <img :src="objData.daoLogoUrl" alt="" />
      </div>
      <div class="top-cen">
        <div class="cen-top">
          <span class="cen-name">{{ objData.daoName | hasHellipsis(30) }}</span>
          <div v-if="MetaMaskAddress">
            <el-dropdown v-if="objData.modifiable || objData.isMainDaoCreator">
              <span class="cursor">
                <svg-icon icon-class="edits" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="MetaMaskAddress === objData.creatorAddress"
                >
                  <span class="edititem" @click="editRoute('editInformation')">
                    <svg-icon icon-class="edit" />
                    {{ $t('nodeDetail.editTabNames')[0] }}
                  </span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="edititem" @click="editRoute('editParameters')">
                    <svg-icon icon-class="editchain" />
                    {{ $t('nodeDetail.editTabNames')[1] }}
                  </span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="edititem" @click="editRoute('editStrategies')">
                    <svg-icon icon-class="Strategy" />
                    {{ $t('nodeDetail.editTabNames')[2] }}
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div>
            <span
              class="cursor"
              @click="goOpenUrl(objData.openseaLink, 'https://opensea.io/')"
            >
              <svg-icon
                :icon-class="objData.openseaLink ? 'openseazi' : 'disOpensea'"
              />
            </span>
            <span
              class="cursor"
              @click="goOpenUrl(objData.discordLink, 'https://t.me/')"
            >
              <svg-icon
                :icon-class="objData.discordLink ? 'telegramzi' : 'telegramDis'"
              />
            </span>
            <span
              class="cursor"
              @click="goOpenUrl(objData.twitterLink, 'https://twitter.com/')"
            >
              <svg-icon
                :icon-class="objData.twitterLink ? 'Twitterzi' : 'disTwitter'"
              />
            </span>

            <span
              class="cursor"
              v-for="(item, idx) in objData.socialLinks"
              :key="item + idx"
              @click="goOpenUrl(item)"
            >
              <svg-icon icon-class="openlink" v-if="item !== ''" />
            </span>
          </div>
        </div>
        <p>
          {{ $t('nodeDetail.creatorAddressLabel') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="objData.creatorAddress"
            placement="top"
          >
            <span
              class="cen-lan"
              @click="openHash(objData.creatorAddress, 'address')"
            >
              <span v-if="objData.userName">{{
                objData.userName | hasHellipsis(7)
              }}</span>
              <span v-else>{{ objData.creatorAddress | ellipsis }}</span>
            </span>
          </el-tooltip>
          <span class="copy" @click="copy(objData.creatorAddress)">
            <svg-icon icon-class="copyhash1" />
          </span>
        </p>
        <p>
          {{ $t('nodeDetail.feePoolLabel') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="objData.feePool"
            placement="top"
          >
            <span
              class="cen-lan"
              @click="openHash(objData.feePool, 'address')"
              >{{ objData.feePool | ellipsis }}</span
            >
          </el-tooltip>

          <span class="copy" @click="copy(objData.feePool)">
            <svg-icon icon-class="copyhash1" />
          </span>
        </p>
        <p>
          {{ $t('nodeDetail.erc721AddressLabel') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="objData.erc721Address"
            placement="top"
          >
            <span
              class="cen-lan"
              @click="openHash(objData.erc721Address, 'address')"
              >{{ objData.erc721Address | ellipsis }}</span
            >
          </el-tooltip>
          <span class="copy" @click="copy(objData.erc721Address)">
            <svg-icon icon-class="copyhash1" />
          </span>
        </p>
        <p v-show="objData.inputTokenAddress !== ''">
          {{ $t('nodeDetail.inputTokenContractAddressLabel') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="objData.inputTokenAddress"
            placement="top"
          >
            <span
              class="cen-lan"
              @click="openHash(objData.inputTokenAddress, 'address')"
              >{{ objData.inputTokenAddress | ellipsis }}</span
            >
          </el-tooltip>
          <span class="copy" @click="copy(objData.inputTokenAddress)">
            <svg-icon icon-class="copyhash1" />
          </span>
        </p>
        <p>
          {{ $t('nodeDetail.erc20AddressLabel') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="objData.erc20Address"
            placement="top"
          >
            <span
              class="cen-lan"
              @click="openHash(objData.erc20Address, 'address')"
              >{{ objData.erc20Address | ellipsis }}</span
            >
          </el-tooltip>
          <span class="copy" @click="copy(objData.erc20Address)">
            <svg-icon icon-class="copyhash1" />
          </span>
        </p>
      </div>
      <div class="top-rig">
        <el-button type="primary" @click="goOpen(objData.mainDaoId)"
          >Seed Nodes <i class="el-icon-right"
        /></el-button>
        <p>
          {{ $t('nodeDetail.totalDaoNumberLabel') }}:
          {{ objData.totalDaoNumber }}
        </p>
      </div>
    </div>

    <div class="box-two" v-if="objData.daoStatus < 3">
      <div class="two-lef">
        <div class="card-left">
          <drb-charts v-if="!isLoading" :proportion="drbData.proportion + ''" />
        </div>
        <div class="card-right">
          <div>
            <h4>{{ $t('nodeDetail.blockWindowCountdownLabel') }}</h4>
            <div class="right-item" v-if="!isLoading">
              <span class="num-span">{{ drbData.h }}</span>
              <span class="type-span">HOURS</span>
            </div>
            <div class="right-item" v-if="!isLoading">
              <span class="num-span">{{ drbData.m }}</span>
              <span class="type-span">MINUTES</span>
            </div>
            <div class="right-item" v-if="!isLoading">
              <span class="num-span">{{ drbData.s }}</span>
              <span class="type-span">SECONDS</span>
            </div>
          </div>
        </div>
      </div>

      <div class="two-rig">
        <div class="rig-box">
          <el-row>
            <el-col :span="24">
              <div class="rig-tit">
                {{ $t('nodeDetail.currentBlockWindowInformationLabel') }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <div class="card-num">
                {{
                  objData.mintWindowInfoVo.minters | bigNumFormat(5, 0.000001)
                }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="card-num">
                {{
                  objData.mintWindowInfoVo.mintFee | bigNumFormat(5, 0.000001)
                }}
                <TokenIcon
                  :daoToken="objData.modeStatusVo.daoToken"
                  :daoSymbol="objData.daoSymbol"
                  :daoErc20Address="objData.erc20Address"
                  :payCurrencyType="objData.payCurrencyType"
                  :inputTokenAddress="objData.inputTokenAddress"
                />
              </div>
            </el-col>
            <el-col :span="7">
              <div class="card-num">
                {{
                  objData.mintWindowInfoVo.mintedWorks
                    | bigNumFormat(5, 0.000001)
                }}
              </div>
            </el-col>
          </el-row>
          <el-row class="row-item">
            <el-col :span="9">
              <div class="card-name">{{ $t('nodeDetail.mintersLabel') }}</div>
            </el-col>
            <el-col :span="8">
              <div class="card-name">{{ $t('nodeDetail.mintFeeLabel') }}</div>
            </el-col>
            <el-col :span="7">
              <div class="card-name">
                {{ $t('nodeDetail.mintedWorksLabel') }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <div class="card-num">
                {{
                  objData.mintWindowInfoVo.blockRewardToken
                    | bigNumFormat(5, 0.000001)
                }}
                <TokenIcon
                  :daoToken="true"
                  :daoSymbol="objData.daoSymbol"
                  :daoErc20Address="objData.erc20Address"
                />
                <span v-if="!objData.topupMode">
                  + {{ objData.mintWindowInfoVo.blockRewardEth }}
                  <TokenIcon
                    :payCurrencyType="objData.payCurrencyType"
                    :inputTokenAddress="objData.inputTokenAddress"
                  />
                </span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="card-num">
                {{
                  objData.mintWindowInfoVo.internalRewardToken
                    | bigNumFormat(5, 0.000001)
                }}
                <TokenIcon
                  :daoToken="true"
                  :daoSymbol="objData.daoSymbol"
                  :daoErc20Address="objData.erc20Address"
                />
                <span v-if="!objData.topupMode">
                  + {{ objData.mintWindowInfoVo.internalRewardEth }}
                  <TokenIcon
                    :payCurrencyType="objData.payCurrencyType"
                    :inputTokenAddress="objData.inputTokenAddress"
                /></span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <div class="card-name">
                {{ $t('nodeDetail.blockRewardLabel') }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="card-name">
                {{ $t('nodeDetail.internalIncentivesLabel') }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="box-two" v-else>
      <span class="daoEnd"> {{ $t('nodeDetail.notAvailableText') }}</span>
    </div>
    <div class="box-thr">
      <el-row>
        <el-col :span="13">
          <div class="thr-left">
            <h3>{{ $t('nodeDetail.basicInformationLabel') }}</h3>
            <el-row>
              <el-col :span="9">
                <div class="card-num">
                  {{
                    objData.basicInformation.mintCap | bigNumFormat(5, 0.000001)
                  }}
                  /
                  {{
                    objData.basicInformation.totalMintCap
                      | bigNumFormat(5, 0.000001)
                  }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-num">
                  {{
                    objData.basicInformation.mintWindowCap
                      | bigNumFormat(5, 0.000001)
                  }}
                  /
                  {{
                    objData.basicInformation.totalMintWindowCap
                      | bigNumFormat(5, 0.000001)
                  }}
                </div>
              </el-col>
              <el-col :span="7">
                <div class="card-num">
                  {{
                    objData.basicInformation.subDaoAssetPoolEth
                      | bigNumFormat(5, 0.000001)
                  }}
                  <TokenIcon
                    :payCurrencyType="objData.payCurrencyType"
                    :inputTokenAddress="objData.inputTokenAddress"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row class="row-item">
              <el-col :span="9">
                <div class="card-name">
                  {{ $t('nodeDetail.totalERC721MintCapLabel') }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-name">
                  {{ $t('nodeDetail.blockMintedWorkByBlockMintCapLabel') }}
                </div>
              </el-col>
              <el-col :span="7">
                <div class="card-name">
                  {{ $t('nodeDetail.subNodesAssetPoolETHLabel') }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <div class="card-num">
                  {{
                    objData.basicInformation.mintWindowDuration
                      | bigNumFormat(5, 0.000001)
                  }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-num">
                  {{
                    objData.basicInformation.remainingMintWindow
                      | bigNumFormat(5, 0.000001)
                  }}
                </div>
              </el-col>
              <el-col :span="7">
                <div class="card-num">
                  {{
                    objData.basicInformation.subDaoAssetPoolDaoToken
                      | bigNumFormat(5, 0.000001)
                  }}
                  <TokenIcon
                    :daoToken="true"
                    :daoSymbol="objData.daoSymbol"
                    :daoErc20Address="objData.erc20Address"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row class="row-item">
              <el-col :span="9">
                <div class="card-name">
                  {{ $t('nodeDetail.blockWindowDurationLabel') }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-name">
                  {{ $t('nodeDetail.remainingBlockWindowsLabel') }}
                </div>
              </el-col>
              <el-col :span="7">
                <div class="card-name">
                  {{ $t('nodeDetail.subNodesAssetPoolERC20TokensLabel') }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="11" style="display: flex">
          <div class="thr-right" style="flex: 1">
            <h3>{{ $t('nodeDetail.modeStatusLabel') }}</h3>
            <el-row class="row-item2">
              <el-col :span="9">
                <div class="card-name card-item">
                  <p>
                    <svg-icon
                      :icon-class="
                        objData.modeStatusVo.lotteryMode ? 'suc' : 'err'
                      "
                    />
                  </p>
                  <span>{{ $t('nodeDetail.lotteryModeLabel') }}</span>
                  <span v-if="objData.modeStatusVo.lotteryMode"
                    >Rollover: {{ objData.modeStatusVo.lotteryDuration }}</span
                  >
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-name card-item">
                  <p>
                    <svg-icon
                      :icon-class="
                        objData.modeStatusVo.daoToken ? 'suc' : 'err'
                      "
                    />
                  </p>
                  <span>{{ $t('nodeDetail.erc20TokenModeLabel') }}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="card-name card-item">
                  <p>
                    <svg-icon
                      :icon-class="
                        objData.modeStatusVo.topupMode ? 'suc' : 'err'
                      "
                    />
                  </p>
                  <span>{{ $t('nodeDetail.topupModeLabel') }}</span>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="9">
                <div class="card-name card-item">
                  <p>
                    <svg-icon
                      :icon-class="
                        objData.modeStatusVo.unifiedPriceMode ? 'suc' : 'err'
                      "
                    />
                  </p>
                  <span>{{ $t('nodeDetail.unifiedPriceModeLabel') }}</span>
                  <span v-if="objData.modeStatusVo.unifiedPriceMode"
                    >{{ objData.modeStatusVo.unifiedPrice }}
                    <TokenIcon
                      size="14px"
                      color="#9e9e9e"
                      :daoToken="objData.modeStatusVo.daoToken"
                      :daoSymbol="objData.daoSymbol"
                      :daoErc20Address="objData.erc20Address"
                      :payCurrencyType="objData.payCurrencyType"
                      :inputTokenAddress="objData.inputTokenAddress"
                  /></span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="card-name card-item">
                  <p>
                    <svg-icon
                      :icon-class="
                        objData.modeStatusVo.speicialStrategy ? 'suc' : 'err'
                      "
                    />
                  </p>
                  <span>{{ $t('nodeDetail.specialStartegyLabel') }}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="card-name card-item">
                  <p>
                    <svg-icon
                      :icon-class="
                        objData.modeStatusVo.infiniteMode ? 'suc' : 'err'
                      "
                    />
                  </p>
                  <span>{{ $t('nodeDetail.infiniteModeLabel') }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="box-bom">
      <div class="box-markdown">
        <h1>{{ $t('nodeDetail.nodesManifestoLabel') }}</h1>
        <markdown-it-vue class="md-body" :content="objData.daoManitesto" />
      </div>
      <div class="box-markdown" v-show="isMore">
        <h1>{{ $t('nodeDetail.nodesDescriptionLabel') }}</h1>
        <markdown-it-vue class="md-body" :content="objData.daoDescription" />
      </div>

      <div class="box-icons" v-show="!isMore">
        <span @click="isMore = true" class="seebtn fontbtn">
          See More <i class="el-icon-arrow-down"></i>
        </span>
      </div>
      <div class="box-icons" v-show="isMore">
        <span @click="isMore = false" class="seebtn fontbtn">
          See Less <i class="el-icon-arrow-up"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MarkdownItVue from 'markdown-it-vue'
import DrbCharts from './DrbCharts.vue'
import TokenIcon from '@/components/TokenIcon.vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import { copys } from '@/utils'
export default {
  components: {
    MarkdownItVue,
    DrbCharts,
    TokenIcon,
  },
  props: {
    objData: {
      type: Object,
    },
  },
  data() {
    return {
      isMore: false,
      isShou: false,
      isAuthority: { createCanvas: false, mintWork: false },
      drbData: { nextPrbStartTime: 0, proportion: 0, h: 0, m: 0, s: 0 },
      endTime: 0,
      myTimeDisplay: null,
      isLoading: true,
    }
  },
  computed: {
    ...mapState(['User', 'MetaMaskAddress']),
  },
  mounted() {
    this.getTime()
  },
  methods: {
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
    aPush(item) {
      return `/dao?type=nfts&id=${item.mainDaoId}`
    },
    async getTime() {
      // if (!this.User.address) return;
      // const res = await userAuthority({
      //   daoId: this.objData.daoId,
      // });
      // this.isAuthority = res.data;
      // proportion
      // nextMintWindowStartTime
      if (this.objData.daoStatus === 3) return
      this.endTime = Math.floor(this.objData.countdown / 1000)
      console.log(this.endTime, 'this.endTime')
      const minutes = Math.floor(this.endTime / 60) //分钟
      this.drbData.s = this.endTime % 60 //秒
      this.drbData.h = minutes > 60 ? Math.floor(minutes / 60) : 0
      this.drbData.m = minutes > 60 ? minutes % 60 : minutes

      console.log(this.drbData.proportion, 'this.drbData.proportion')
      if (this.endTime >= 0) {
        this.drbData.proportion = parseInt(this.objData.proportion)
        this.setTimeNum()
      } else {
        this.drbData.proportion = 0
        clearInterval(this.myTimeDisplay)
        this.myTimeDisplay = null
      }
      this.isLoading = false
    },
    setTimeNum() {
      clearInterval(this.myTimeDisplay)
      this.myTimeDisplay = null
      this.myTimeDisplay = setInterval(() => {
        if (this.endTime > 0) {
          this.endTime -= 1
          const minutes = Math.floor(this.endTime / 60)
          this.drbData.s = this.endTime % 60
          this.drbData.h = minutes > 60 ? Math.floor(minutes / 60) : 0
          this.drbData.m = minutes > 60 ? minutes % 60 : minutes
        } else {
          this.drbData.proportion = 0
          clearInterval(this.myTimeDisplay)
          this.myTimeDisplay = null
          // this.getIsAuthority();
        }
      }, 1000)
    },
    goOpen(id) {
      this.$router.push({
        path: `/daoCollectionAnalytics`,
        query: {
          id: id,
        },
      })
    },
    editRoute(val) {
      // if (this.objData.daoStatus === 3) {
      //   this.errNotif("You can no longer edit as the DAO has ended.");
      //   return;
      // }
      this.$router.push({
        path: `/${val}`,
        query: {
          id: this.$route.query.id,
        },
      })

      this.showMorePopover = false
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
    copyUrl() {
      copys(window.location.href, this, 'Link copied!')
    },
    async setShou() {
      this.$emit('setAmount', 1)
    },
  },
  destroyed() {
    clearInterval(this.myTimeDisplay)
    this.myTimeDisplay = null
  },
}
</script>
<style scoped lang="scss">
.title-box {
  min-width: 1240px;
  padding: 0 48px;
  box-sizing: border-box;
}

.box-top {
  width: 100%;
  height: 120px;
  display: flex;
  margin-bottom: 40px;
  margin-top: 24px;

  .top-left {
    width: 120px;
    height: 120px;
    margin-right: 32px;

    img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border: 2px solid #ffffff;
      box-sizing: border-box;
      z-index: 1;
      position: sticky;
    }
  }

  .top-cen {
    .cen-top {
      display: flex;
      align-items: center;

      .cursor {
        font-size: 24px;
        margin-left: 12px;
      }
    }

    .cen-name {
      color: #bbbaba;
      font-family: Inter;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
    }

    .cen-lan {
      color: #25b0c2;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      cursor: pointer;
    }

    .copy {
      margin-left: 12px;
      font-size: 12px;
      cursor: pointer;
    }

    p {
      margin: 0;
      margin-top: 2px;
      color: #9e9e9e;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
    }
  }

  .top-rig {
    margin-left: auto;

    .el-icon-right {
      font-weight: 800;
    }

    p {
      color: #9e9e9e;

      text-align: center;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }
  }
}

.box-two {
  width: 100%;
  height: 230px;
  background-color: #252b3a;
  margin-bottom: 40px;
  display: flex;
}

.rig-box {
  height: 198px;
  width: 100%;
  font-family: Inter;
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  padding-top: 22px;
  box-sizing: border-box;

  .rig-tit {
    color: #9e9e9e;
    margin-bottom: 24px;
  }
}

.card-name {
  color: #9e9e9e;
  font-size: 14px;
  font-weight: 400;
}

.card-num {
  color: #fff;
  // margin-bottom: 12px;
}

.card-item {
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
    margin-bottom: 6px;
  }
}

.two-rig {
  flex: 1;
  display: flex;
  align-items: center;
}

.two-lef {
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 48px;
  margin-left: 24px;

  .card-left {
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-right {
    margin-left: 3%;
    width: 57%;

    h4 {
      color: #9e9e9e;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }

    .right-item {
      margin-bottom: 12px;
      display: flex;
      height: 32px;
      background-color: #2e3547;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      color: #9e9e9e;
      align-items: center;
    }

    .num-span {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      display: block;
      width: 40%;
      text-align: end;
      margin-right: 20px;
    }
  }
}

.box-thr {
  width: 100%;
  // height: 230px;
  background-color: #252b3a;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
    margin-bottom: 24px;
  }

  .thr-left {
    // display: flex;
    // flex-direction: column;
    margin: 0 56px;
  }
}

.row-item {
  margin-bottom: 24px;
}

.row-item2 {
  margin-bottom: 12px;
}

.box-markdown {
  width: 100%;
  margin: 0 auto;
  padding: 0 30px;
  box-sizing: border-box;

  h1 {
    font-size: 26px;
    color: #757575;
    margin: 60px 0;
    text-align: center;
    font-family: Roboto5;
  }
}

.box-icons {
  text-align: center;
  padding: 26px 0;

  p {
    margin: 0;
    margin-bottom: 10px;
    color: #757575;
    font-size: 18px;
  }

  span {
    cursor: pointer;
    font-size: 24px;
  }
}

.cursor {
  cursor: pointer;
}

.md-body {
  margin-bottom: 42px;
}

::v-deep .anchor {
  display: none;
}

::v-deep .markdown-body {
  color: #9e9e9e;
}

::v-deep .markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  border: none;
  font-size: 20px !important;
}

.seebtn {
  font-size: 14px !important;
  color: #b3b5f2;
  cursor: pointer;
}

.el-popper {
  min-width: 160px !important;
}

::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #fff !important;
  background-color: #424a5f;
}

::v-deep .el-dropdown-menu__item {
  padding: 0 !important;
}

.edititem {
  padding-right: 12px !important;
}

.el-divider--vertical {
  background-color: #6062aa;
}

.daoEnd {
  color: #9e9e9e;
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
