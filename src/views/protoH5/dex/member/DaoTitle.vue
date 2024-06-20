<template>
  <div class="box">
    <div class="banner">
      <img :src="objData.daoBgBanner" alt="" />

      <div class="whitelist">
        <el-tooltip
          class="item"
          effect="dark"
          placement="bottom-end"
          v-if="objData.basicDao === 1"
        >
          <div slot="content">
            The logo means that this DAO has been upgraded to PRO version, PRO
            version allow customisability of strategies and on-chain parameters.
          </div>
          <svg-icon icon-class="Pro" />
        </el-tooltip>

        <svg-icon icon-class="daokey" v-if="objData.whiteList" />
      </div>
    </div>
    <div class="box-nums">
      <div class="num-left">
        <div class="limg">
          <img :src="objData.daoLogoUrl" alt="" />
        </div>
      </div>
      <div class="num-right">
        <div>
          <el-tooltip
            class="item"
            effect="dark"
            :content="objData.daoName"
            v-if="objData.daoName.length > 30"
            placement="top-end"
          >
            <span class="s1">{{ objData.daoName | hasHellipsis(30) }}</span>
          </el-tooltip>
          <span class="s1" v-else>{{ objData.daoName }}</span>
          <!-- <span class="s2">D4A@{{ objData.daoNumber }}</span> -->
          <span class="s2"
            >Creator
            <el-tooltip
              class="item"
              effect="dark"
              :content="objData.creatorAddress"
              placement="top"
            >
              <span
                class="s3 fontbtn"
                style="color: #745cd4"
                @click="openHash(objData.creatorAddress, 'address')"
              >
                <span v-if="objData.userName">{{
                  objData.userName | hasHellipsis(7)
                }}</span>
                <span v-else>{{ objData.creatorAddress | ellipsis }}</span>
              </span>
            </el-tooltip>
          </span>

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
        <div class="icon-r">
          <span class="wai cursor" @click="copyUrl">
            <svg-icon icon-class="copyl" />
          </span>
          <span class="wai cursor">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content" class="content_box">
                Asset Pool<br />{{ objData.daoAssetPool | ethFilter(4) }} ETH
              </div>

              <span @click="openHash(objData.feelPool, 'address')"
                ><svg-icon icon-class="poll"
              /></span>
            </el-tooltip>
          </span>

          <el-dropdown v-if="objData.modifiable && MetaMaskAddress">
            <span class="cursor">
              <svg-icon icon-class="edits" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span class="edititem" @click="editRoute('editInformation')">
                  <svg-icon icon-class="edit" /> Edit Information
                </span>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <span class="edititem" @click="editRoute('editParameters')">
                  <svg-icon icon-class="editchain" /> Edit On-chain Parameter
                </span>
              </el-dropdown-item> -->
              <el-dropdown-item>
                <span class="edititem" @click="editRoute('editStrategies')">
                  <svg-icon icon-class="Strategy" /> Edit Strategy
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="box-nom">
      <div class="box-datas">
        <el-tooltip
          class="item"
          effect="dark"
          content="Works"
          placement="top-end"
        >
          <span class="box-card" v-if="objData.daoStatus !== 3">
            <svg-icon icon-class="worksl" />
            {{ objData.workNumber | numFilter }}
          </span>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="NFTs"
          placement="top-end"
        >
          <span class="box-card">
            <svg-icon icon-class="nftsl" /> {{ objData.nftNumber | numFilter }}/
            {{ objData.totalNftCasting | numFilter }}
          </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="DAO Mint Window"
          placement="top-end"
        >
          <span class="box-card" v-if="objData.daoStatus !== 3">
            <svg-icon icon-class="windowl" />
            {{ objData.mintWindow | numFilter }}/
            {{ objData.daoMintWindow | numFilter }}
          </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="DAO Flow"
          placement="top-end"
        >
          <span class="box-card" style="color: #745cd4">
            <svg-icon icon-class="revenuel" />
            {{ objData.daoFlow | ethFilter(4) }} ETH
          </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="ERC-20 Tokens"
          placement="top-end"
        >
          <span class="box-card">
            <svg-icon icon-class="tokenl" /> {{ objData.daoToken | numFilter }}
          </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Royalty Fee"
          placement="top-end"
        >
          <span class="box-card">
            <svg-icon icon-class="royaltyFee" />
            {{ objData.royaltyFee | royaltyFeeFilter }}%
          </span>
        </el-tooltip>
        <!-- <el-tooltip
          class="item"
          effect="dark"
          content="Total NFT Mint Cap"
          placement="top-end"
        >
          <span class="box-card" v-if="objData.daoStatus !== 3">
            <svg-icon icon-class="castingl" />
            {{ objData.totalNftCasting | numFilter }}
          </span>
        </el-tooltip> -->
      </div>
      <div class="box-markdown">
        <h1>DAO’s Manifesto</h1>
        <markdown-it-vue class="md-body" :content="objData.daoManitesto" />
      </div>
      <div class="box-markdown" v-show="isMore">
        <h1>DAO’s Description</h1>
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
import { mapState } from "vuex";
import { userAuthority } from "@/common/api";
import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
import { Notify } from "vant";
import { copysPro } from "@/utils";
export default {
  components: {
    MarkdownItVue,
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
    };
  },
  computed: {
    ...mapState(["User", "MetaMaskAddress"]),
  },
  mounted() {
    this.getIsAuthority();
  },
  methods: {
    async getIsAuthority() {
      // if (!this.User.address) return;
      const res = await userAuthority({
        daoId: this.objData.daoId,
      });
      this.isAuthority = res.data;
    },
    editRoute(val) {
      if (this.objData.daoStatus === 3) {
        Notify({
          message: "You can no longer edit as the DAO has ended.",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return;
      }
      this.$router.push({
        path: `/${val}`,
        query: {
          id: this.$route.query.id,
        },
      });

      this.showMorePopover = false;
    },
    goOpenUrl(url, http = null) {
      if (url) {
        if (http) {
          window.open(http + url, "_blank");
        } else {
          const newUrl = url.slice(0, 4) === "http" ? url : "https://" + url;
          window.open(newUrl, "_blank");
        }
      }
    },
    copyUrl() {
      copysPro(window.location.href);
      Notify({
        message: "Link copied!",
        color: "#F0F0F0",
        background: "#745CD4",
        duration: 3000,
      });
    },
    async setShou() {
      const halt = this.isHalt(this.objData);
      if (!halt) return;
      this.$emit("setAmount", 1);
    },
  },
};
</script>
<style scoped lang="scss">
.box {
  min-width: 1240px;
}
.banner {
  width: 100%;
  height: 600px;
  position: relative;
  img {
    height: 600px;
    width: 100%;
    object-fit: cover;
  }
}
.box-nums {
  height: 50px;
  width: 100%;
  display: flex;
  border-bottom: 0.5px solid #c5dadd;
  .num-left {
    .limg {
      width: 182px;
      height: 182px;
      margin-top: -134px;
      margin-left: 44px;
      background-color: #fff;
    }
    img {
      width: 180px;
      height: 180px;
      object-fit: cover;
      border: 2px solid #ffffff;
      z-index: 1;
      position: sticky;
    }
  }
  .num-right {
    display: flex;
    align-items: center;
    flex: 1;
    span {
      margin: 0 8px;
      font-family: Inter5;
      .svg-icon {
        font-size: 20px;
      }
    }
    .s1 {
      font-size: 20px;
      color: #bbbaba;
    }
    .s2 {
      font-size: 14px;
      color: #9e9e9e;
    }
    .s3 {
      margin: 0;
      cursor: pointer;
    }
    .icon-r {
      margin-left: auto;
      margin-right: 36px;
      display: flex;
      .waishou {
        margin: 0px !important;
      }
      .wai {
        margin: 0 8px;
        color: #9e9e9e;
        display: flex;
        span {
          margin: 0;
        }
        .fanum {
          display: block;
          width: 26px;
          margin-left: 5px;
        }
      }
    }
  }
}
.box-datas {
  height: 50px;
  display: flex;
  width: max-content;
  margin-left: auto;
  align-items: center;
  margin-right: 24px;
  .box-card {
    margin-right: 20px;
    font-size: 12px;
    color: #b3b5f2;
    cursor: default;
    font-family: Inter6;
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
.halt {
  height: 44px;
  background-color: #6bd8e4;
  font-size: 44px;
  font-weight: 500;
  text-align: center;
  font-size: 14px;
  line-height: 44px;
}
.content_box {
  text-align: center;
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
  padding: 0 20px;
  height: 100%;
  display: block;
}

.whitelist {
  position: absolute;
  position: absolute;
  top: 20px;
  right: 20px;
  .svg-icon {
    font-size: 50px;
    margin-left: 10px;
  }
}
.no-c-text {
  display: block;
  color: #f3f3f3;
}
</style>
