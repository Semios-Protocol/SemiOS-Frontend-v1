<template>
  <loading v-if="isLoading" />
  <div class="title-box" v-else>
    <div class="box-top">
      <div class="top-left">
        <img :src="objData.daoLogoUrl" alt="" />
      </div>
      <div class="top-cen">
        <div class="cen-top">
          <span class="cen-name">{{ objData.daoName | hasHellipsis(30) }}</span>
          <div v-if="objData.modifiable">
            <el-dropdown>
              <span class="cursor">
                <svg-icon icon-class="edits" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span class="edititem" @click="editRoute('editInformation')">
                    <svg-icon icon-class="edit" />
                    {{ $t('nodeDetail.editTabNames')[0] }}
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
              <span>{{ objData.creatorAddress | ellipsis }}</span>
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
          {{ $t('nodeDetail.outputTokenContractAddressLabel') }}
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
    </div>
  </div>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import { copys } from '@/utils'
import { togetherDaoInfo } from '@/common/api'
import Loading from '@/components/Loading.vue'
export default {
  name: 'RightMember',
  components: {
    MarkdownItVue,
    Loading,
  },
  props: {},
  data() {
    return {
      isMore: true,
      isShou: false,
      isLoading: true,
      isAuthority: { createCanvas: false, mintWork: false },
      drbData: { nextPrbStartTime: 0, proportion: 0, h: 0, m: 0, s: 0 },
      objData: {
        creatorAddress: '',
        daoDescription: '',
        daoId: null,
        daoLogoUrl: '',
        daoManitesto: '',
        daoName: '',
        daoNumber: null,
        daoStatus: null,
        discordLink: '',
        erc20Address: '',
        erc721Address: '',
        feePool: '',
        modifiable: false,
        openseaLink: '',
        projectId: null,
        twitterLink: '',
        socialLinks: ['', '', ''],
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    copy(hash) {
      copys(hash, this, 'Copied!')
    },
    async getData() {
      try {
        const res = await togetherDaoInfo({ daoId: this.$route.query.id })
        this.objData = res.data
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
    editRoute(val) {
      if (this.objData.daoStatus === 3) {
        this.errNotif('You can no longer edit as the DAO has ended.')
        return
      }
      this.$router.push({
        path: `/${val}`,
        query: {
          id: this.objData.daoId,
        },
      })
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
      // copys(window.location.href, this, "Link copied!");
    },
  },
}
</script>
<style scoped lang="scss">
.title-box {
  width: 100%;
}
.box-top {
  width: 100%;
  height: 120px;
  display: flex;
  margin-bottom: 40px;
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
  }
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
</style>
