<template>
  <loading v-if="isLoading" />
  <div v-else class="work-box">
    <div
      class="work-img"
      :style="{ width: clientWidth + 'px', height: clientWidth + 'px' }"
    >
      <img :src="dataObj.imageUrl" alt="" />
    </div>
    <div class="work-details">
      <div class="deta-top">
        <div class="det-lt" v-if="dataObj.workStatus === 1">
          <span class="daoname-col" @click="goDaoDetail">{{
            dataObj.daoName
          }}</span
          >.{{ dataObj.workNumber }}
        </div>
        <div v-else>
          <div class="det-lt" v-if="dataObj.generate === 1">
            <span class="daoname-col" @click="goDaoDetail">{{
              dataObj.daoName
            }}</span
            >#<span
              class="daoname-col"
              @click="goOpenAddress(dataObj.creatorAddress)"
              >Pass</span
            >/Unminted
          </div>
          <div class="item-text" v-else>
            <span class="daoname-col" @click="goDaoDetail">{{
              dataObj.daoName
            }}</span
            >#<span
              class="daoname-col"
              @click="goOpenAddress(dataObj.creatorAddress)"
              >{{ dataObj.creatorAddress | splitAddress }}</span
            >/Unminted
          </div>
        </div>
        <div class="det-rt">
          <span
            style="margin-right: 16px"
            @click="goEdit"
            v-if="MetaMaskAddress && dataObj.ownerAddress === MetaMaskAddress"
          >
            <svg-icon icon-class="setting"
          /></span>
          <!-- <span @click="shareActionsPopover = true">
            <svg-icon icon-class="fx"
          /></span> -->
          <div class="popbox">
            <van-popover
              v-model="shareActionsPopover"
              theme="dark"
              trigger="click"
              placement="bottom-end"
              :offset="[10, 5]"
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
                <span> <svg-icon icon-class="fx" /></span>
              </template>
            </van-popover>
          </div>
        </div>
      </div>
      <div class="deta-ctext">
        <div class="ct-le">
          <p class="ct-le-tp">
            {{
              dataObj.unifiedPriceSet
                ? 'Unified Price'
                : dataObj.fixedPrice
                ? 'Fixed Price'
                : 'Price'
            }}
          </p>
          <p class="ct-le-bp">
            {{ dataObj.price }}
            <svg-icon icon-class="eth" />
          </p>
        </div>
        <div class="ct-ri" v-if="dataObj.unifiedPriceModeOff">
          <p class="ct-le-tm">
            {{ dataObj.havePassesQuantity }}/{{ dataObj.passesTotalQuantity }}
          </p>
        </div>
      </div>
      <div class="deta-bom">
        <markdown-it-vue class="md-body" :content="dataObj.workDescription" />
        <!-- {{ dataObj.workDescription }} -->
      </div>
    </div>
    <!-- <div class="none-box"></div> -->
    <div class="new-btns" v-if="dataObj.nextDrbStartTime <= 0">
      <van-button
        v-if="dataObj.workStatus === 0"
        color="#745CD4"
        class="btn-two"
        style="width: 100%; margin-right: 18px"
        @click="mintNft"
        safe-area-inset-bottom
        v-preventReClick
        >Mint NFT
      </van-button>
      <van-button
        v-if="dataObj.workStatus === 0"
        color="#745CD4"
        style="width: 100%"
        safe-area-inset-bottom
        v-preventReClick
        @click="setMintTransferDio"
        >Mint & Transfer
      </van-button>
      <van-button
        v-if="dataObj.workStatus === 1"
        color="#745CD4"
        class="btn-two"
        style="width: 100%; margin-right: 18px"
        safe-area-inset-bottom
        v-preventReClick
        @click="goOpenUrl(dataObj.tradeNft)"
        >Trade NFT
      </van-button>
      <van-button
        v-if="
          dataObj.workStatus === 1 &&
          MetaMaskAddress &&
          dataObj.ownerAddress === MetaMaskAddress
        "
        color="#745CD4"
        style="width: 100%"
        safe-area-inset-bottom
        v-preventReClick
        @click="transferNFTs"
        >Transfer NFT
      </van-button>
    </div>
    <div class="new-btns" v-else>
      <van-button
        color="#745CD4"
        style="width: 100%; margin-right: 18px"
        safe-area-inset-bottom
        v-preventReClick
        disabled
        >{{ drbData.h }} Hours : {{ drbData.m }} Minutes :
        {{ drbData.s }} Seconds
      </van-button>
    </div>
    <van-dialog v-model="dialogShow" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <div><svg-icon icon-class="smiley" style="font-size: 104px" /></div>
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text" v-if="dataObj.basicDao === 2">
        You are transferring this work to another address. The recipient can
        enter this DAO and mint up to 5 more NFTs.DO NOT TRANSFER YOUR ONLY NFT!
        Or you will lose access to this DAO.
      </p>
      <p class="dialog-text" v-else>
        You are transferring this work to another address.
      </p>
      <div class="text-dialog-box">
        <van-field
          v-model="mainnetAddress"
          placeholder="Please input ETH Mainnet Address"
        />
      </div>
      <div class="flex-btn">
        <van-button
          color="#745CD4"
          style="width: 100%"
          :disabled="mainnetAddress && mainnetAddress !== '' ? false : true"
          @click="setMintTransfer"
          >Mint & Transfer
        </van-button>
      </div>
      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.discordLink"
            @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.twitterLink"
            @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </van-dialog>

    <van-dialog v-model="dialogSucc" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <div>
          <svg-icon
            :icon-class="isTransferNFTs ? 'smiley' : 'rect'"
            style="font-size: 104px"
          />
        </div>
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-title" v-if="!isTransferNFTs">Congratulation!</p>
      <p class="dialog-text">
        {{
          !isTransferNFTs
            ? 'You have successfully minted a work. Now, it’s time to show or transfer your NFT to your friends.'
            : dataObj.basicDao === 2
            ? 'You are transferring this work to another address. The recipient can enter this DAO and mint up to 5 more NFTs.DO NOT TRANSFER YOUR ONLY NFT! Or you will lose access to this DAO.'
            : 'You are transferring this work to another address. '
        }}
      </p>
      <div class="text-dialog-box" v-if="isTransferNFTs">
        <van-field
          v-model="mainnetAddress"
          placeholder="Please input ETH Mainnet Address"
        />
      </div>
      <div class="flex-btn">
        <van-button
          color="#745CD4"
          style="width: 100%"
          @click="transferNFTs"
          v-if="!isTransferNFTs"
          v-preventReClick
          >Transfer NFT
        </van-button>
        <van-button
          color="#745CD4"
          style="width: 100%"
          :disabled="mainnetAddress && mainnetAddress !== '' ? false : true"
          @click="setTransferNFTs"
          v-else
          v-preventReClick
          >Transfer NFT
        </van-button>
      </div>
      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.discordLink"
            @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.twitterLink"
            @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </van-dialog>

    <van-dialog v-model="dialogMinting" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text">
        You don't have the membership NFT for this DAO, no minting is possible.
        You can acquire one on marketplaces like OpenSea or ask a friend who has
        a spare one.
      </p>
      <div class="flex-btn">
        <van-button
          color="#745CD4"
          style="width: 100%"
          @click="goOpenUrl(dataObj.tradeNft)"
          >Trade NFT
        </van-button>
      </div>
    </van-dialog>

    <van-dialog v-model="dialogRestrict" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text">
        You have reached the limit of 5 mints, no more minting possible for this
        address in this DAO unless the DAO creator change settings in PRO
        version.
      </p>
      <div class="flex-btn">
        <van-button
          color="#745CD4"
          style="width: 100%"
          @click="dialogRestrict = false"
          >OK</van-button
        >
      </div>
    </van-dialog>

    <van-dialog v-model="dialogTransfer" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text">Your work has been successfully transferred!</p>
      <div class="flex-btn">
        <van-button
          color="#745CD4"
          style="width: 100%"
          @click="dialogTransfer = false"
          >OK</van-button
        >
      </div>
    </van-dialog>

    <van-dialog v-model="dialogLoading" :show-confirm-button="false">
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">
        {{ loadingText }}
      </p>
    </van-dialog>

    <van-dialog v-model="dialogSuccTwo" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <div><svg-icon icon-class="smiley" style="font-size: 104px" /></div>
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-title">Congratulation!</p>
      <p class="dialog-text">Your work has been successfully transferred!</p>
      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.discordLink"
            @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.twitterLink"
            @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </van-dialog>

    <van-dialog v-model="dialogTime" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text">
        This DAO has reached its Daily Mint Cap, you need to wait for the next
        DRB to mint.
      </p>
    </van-dialog>
  </div>
</template>

<script>
import {
  workDetail,
  canvasExists,
  userAuthority,
  workAuthority,
  daoMerkle,
  topupEthbalance,
  merkleWork,
} from '@/common/api'
import {
  mintNFT,
  // createCanvasAndMintNFT,
  transferNFTs,
  // mintNFTAndTransfer,
} from '@/common/walletService/services'
import Loading from '@/components/Loading.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { Notify } from 'vant'
import { mapState } from 'vuex'
import { copysPro } from '@/utils'
import { ethers } from 'ethers'
import MarkdownItVue from 'markdown-it-vue'
import { BigNumber } from 'bignumber.js'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import { OPEN_URL } from '@/config.js'
export default {
  components: { Loading, SvgIcon, MarkdownItVue },
  data() {
    return {
      networkId: '',
      dataObj: {},
      isLoading: true,
      dialogShow: false,
      mainnetAddress: '',
      dialogSucc: false,
      dialogMinting: false,
      dialogRestrict: false,
      dialogLoading: false,
      dialogSuccTwo: false,
      isTransferNFTs: false,
      dialogTransfer: false,
      loadingText: '',
      shareActions: [
        { name: 'Copy Link', value: 'copy', disabled: false },
        { name: 'Open On Opensea', value: 'opensea', disabled: false },
        { name: 'Open On Telegram', value: 'discord', disabled: false },
        { name: 'Open On Twitter', value: 'twitter', disabled: false },
      ],
      socialLinkList: [],
      shareActionsPopover: false,
      myTimeDisplay: null,
      drbData: {
        h: 0,
        m: 0,
        s: 0,
      },
      dialogTime: false,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    goEdit() {
      this.$router.push({
        path: '/editWorkInformation',
        query: {
          id: this.dataObj.workId,
        },
      })
    },
    copyLink() {
      const url = location.origin + '/WorkDetails?id=' + this.dataObj.workId
      // :8080/dao?id=7
      copysPro(url)
      Notify({
        message: 'Copied!',
        color: '#F0F0F0',
        background: '#745CD4',
        duration: 3000,
      })
    },
    setActionsPopover(val) {
      if (val.value === 'copy') {
        this.copyLink()
      } else {
        if (val.disabled) return
        let url = null
        let http = null
        if (val.value === 'opensea') {
          url = this.dataObj.openseaLink
          http = 'https://opensea.io/'
          this.goOpenUrl(url, http)
          return
        }
        if (val.value === 'discord') {
          url = this.dataObj.discordLink
          http = 'https://t.me/'
          this.goOpenUrl(url, http)
          return
        }
        if (val.value === 'twitter') {
          url = this.dataObj.twitterLink
          http = 'https://twitter.com/'
          this.goOpenUrl(url, http)
          return
        }
        this.goOpenUrl(val.value)
      }
      this.shareActionsPopover = false
    },
    goDaoDetail() {
      this.$router.push({
        path: '/dao',
        query: {
          id: this.dataObj.daoId,
        },
      })
    },
    goOpenAddress(value) {
      const url = `${OPEN_URL}/address/${value}`
      this.goOpenUrl(url)
    },
    async setMintTransfer() {
      if (this.User.address) {
        const chain = await this.setChain()
        if (!chain) return
        const strArr = this.mainnetAddress.match(/^(0x)?[0-9a-fA-F]{40}$/)
        const isAddress = ethers.utils.isAddress(this.mainnetAddress)
        if (!strArr || !isAddress) {
          Notify({
            message: 'The address is wrong, please correct it',
            color: '#F0F0F0',
            background: '#745CD4',
            duration: 3000,
          })
          return
        }
        const isWork = await workAuthority({ daoId: this.dataObj.daoId })
        if (!isWork.data.mintWork) {
          Notify({
            message: 'You are ineligible to mint work.',
            color: '#F0F0F0',
            background: '#745CD4',
            duration: 3000,
          })
          return
        }
        this.dialogLoading = true
        const merkle = await daoMerkle({
          daoId: this.dataObj.daoId,
          type: 2,
        })
        const res = await canvasExists({
          daoId: this.dataObj.daoId,
          workId: this.dataObj.workId,
        })
        let ethPrice = this.dataObj.mintedPrice
        if (!this.dataObj.topupMode) {
          const ethbalance = await topupEthbalance({
            daoId: this.dataObj.daoId,
          })
          const isLte = new BigNumber(ethbalance.data.ethBalance).lt(ethPrice)
          if (isLte) {
            ethPrice = new BigNumber(ethPrice)
              .minus(ethbalance.data.ethBalance)
              .toString()
          } else {
            ethPrice = 0
          }
        }
        // if (res.data) {
        //   try {
        //     const reqData = {
        //       daoId: this.dataObj.projectId,
        //       canvasId: this.dataObj.canvasId,
        //       tokenUri: this.dataObj.workUri,
        //       proof: merkle.data.proof,
        //       nftFlatPrice:
        //         this.dataObj.fixedPrice || this.dataObj.unifiedPriceSet
        //           ? this.dataObj.mintedPrice
        //           : "0",
        //       signature: this.dataObj.createSignHash,
        //       price: this.dataObj.mintedPrice,
        //       nftOwner: this.mainnetAddress,
        //     };
        //     const tx = await mintNFTAndTransfer(reqData);
        //     await tx.wait();
        //     this.dialogLoading = false;
        //     this.dialogShow = false;
        //     this.dialogSuccTwo = true;
        //     this.getData();
        //   } catch (error) {
        //     console.log(error, "error");
        //     const err = JSON.stringify(error);
        //     this.errMsgNit(err);
        //     this.dialogLoading = false;
        //   }
        // } else {
        //   try {
        //     const merkleWorkData = await merkleWork({
        //       workId: this.dataObj.workId,
        //     });
        //     const reqData = {
        //       daoId: this.dataObj.projectId,
        //       canvasId: this.dataObj.canvasId,
        //       tokenUri: this.dataObj.workUri,
        //       to: this.dataObj.creatorAddress,
        //       canvasUri: this.dataObj.canvasUri,
        //       signature: this.dataObj.createSignHash,
        //       price: this.dataObj.mintedPrice,
        //       nftFlatPrice:
        //         this.dataObj.fixedPrice || this.dataObj.unifiedPriceSet
        //           ? this.dataObj.mintedPrice
        //           : "0",
        //       proof: merkle.data.proof,
        //       canvasProof: merkleWorkData.data.proof,
        //       nftOwner: this.mainnetAddress,
        //     };
        //     const tx = await createCanvasAndMintNFT(reqData);
        //     await tx.wait();
        //     this.dialogLoading = false;
        //     this.dialogSuccTwo = true;
        //     this.getData();
        //   } catch (error) {
        //     console.log(error, "error");
        //     const err = JSON.stringify(error);
        //     this.errMsgNit(err);
        //     this.dialogLoading = false;
        //   }
        // }
      } else {
        this.loginWallet()
      }
    },
    async setMintTransferDio() {
      if (this.User.address) {
        const chain = await this.setChain()
        if (!chain) return
        this.loadingText =
          'Your transfer is being processed. It should be confirmed on the blockchain shortly.'
        const isAuthority = await userAuthority({
          daoId: this.dataObj.daoId,
        })

        if (isAuthority.data === 0) {
          this.dialogMinting = true
        }
        if (0 < isAuthority.data && isAuthority.data < 5) {
          this.dialogShow = true
        }
        if (isAuthority.data >= 5) {
          this.dialogRestrict = true
        }
      } else {
        this.loginWallet()
      }
    },
    async setTransferNFTs() {
      if (this.User.address) {
        const chain = await this.setChain()
        if (!chain) return
        this.loadingText =
          'Your transfer is being processed. It should be confirmed on the blockchain shortly.'
        const strArr = this.mainnetAddress.match(/^(0x)?[0-9a-fA-F]{40}$/)
        const isAddress = ethers.utils.isAddress(this.mainnetAddress)
        if (!strArr || !isAddress) {
          Notify({
            message: 'The address is wrong, please correct it',
            color: '#F0F0F0',
            background: '#745CD4',
            duration: 3000,
          })
          return
        } else {
          this.dialogLoading = true
          try {
            const reqData = {
              projectId: this.dataObj.projectId,
              address: this.MetaMaskAddress,
              to: this.mainnetAddress,
              tokenId: this.dataObj.workNumber,
            }
            const tx = await transferNFTs(reqData)
            await tx.wait()
            this.dialogSucc = false
            this.dialogLoading = false
            this.dialogSuccTwo = true
          } catch (error) {
            const err = JSON.stringify(error)
            this.errMsgNit(err)

            this.dialogLoading = false
            console.log(error, 'errorerrorerror')
          }
        }
      } else {
        this.loginWallet()
      }
    },
    transferNFTs() {
      if (this.User.address) {
        this.dialogSucc = true
        this.isTransferNFTs = true
      } else {
        this.loginWallet()
      }
    },
    goOpenUrl(url, http = null) {
      if (http) {
        window.open(http + url, '_blank')
      } else {
        const newUrl = url.slice(0, 4) === 'http' ? url : 'https://' + url
        window.open(newUrl, '_blank')
      }
    },
    close() {
      this.dialogShow = false
      this.dialogSucc = false
      this.dialogMinting = false
      this.dialogRestrict = false
      this.dialogSuccTwo = false
      this.isTransferNFTs = false
      this.mainnetAddress = ''
      this.dialogTransfer = false
      this.dialogTime = false
    },
    async mintNft() {
      if (this.User.address) {
        const chain = await this.setChain()
        if (!chain) return
        this.loadingText =
          'Your transcation is being processed, it should be confirmed on the blockchain shortly.'
        const isWork = await workAuthority({ daoId: this.dataObj.daoId })
        if (!isWork.data.mintWork) {
          Notify({
            message: 'You are ineligible to mint work.',
            color: '#F0F0F0',
            background: '#745CD4',
            duration: 3000,
          })
          return
        }
        const isAuthority = await userAuthority({
          daoId: this.dataObj.daoId,
        })

        if (isAuthority.data === 0) {
          this.dialogMinting = true
        }
        if (0 < isAuthority.data && isAuthority.data < 5) {
          this.dialogLoading = true
          const merkle = await daoMerkle({
            daoId: this.dataObj.daoId,
            type: 2,
          })
          const res = await canvasExists({
            daoId: this.dataObj.daoId,
            workId: this.dataObj.workId,
          })
          let ethPrice = this.dataObj.mintedPrice
          if (!this.dataObj.topupMode) {
            const ethbalance = await topupEthbalance({
              daoId: this.dataObj.daoId,
            })
            const isLte = new BigNumber(ethbalance.data.ethBalance).lt(ethPrice)
            if (isLte) {
              ethPrice = new BigNumber(ethPrice)
                .minus(ethbalance.data.ethBalance)
                .toString()
            } else {
              ethPrice = 0
            }
          }
          if (res.data) {
            try {
              const reqData = {
                daoId: this.dataObj.projectId,
                canvasId: this.dataObj.canvasId,
                tokenUri: this.dataObj.workUri,
                proof: merkle.data.proof,
                nftFlatPrice:
                  this.dataObj.fixedPrice || this.dataObj.unifiedPriceSet
                    ? this.dataObj.mintedPrice
                    : '0',
                signature: this.dataObj.createSignHash,
                price: this.dataObj.mintedPrice,
              }
              const tx = await mintNFT(reqData)
              await tx.wait()
              this.dialogLoading = false
              this.dialogSucc = true
              this.getData()
            } catch (error) {
              console.log(error, 'error')
              const err = JSON.stringify(error)
              this.errMsgNit(err)
              this.dialogLoading = false
            }
          } else {
            // try {
            //   const merkleWorkData = await merkleWork({
            //     workId: this.dataObj.workId,
            //   })
            //   const reqData = {
            //     daoId: this.dataObj.projectId,
            //     canvasId: this.dataObj.canvasId,
            //     tokenUri: this.dataObj.workUri,
            //     to: this.dataObj.creatorAddress,
            //     canvasUri: this.dataObj.canvasUri,
            //     signature: this.dataObj.createSignHash,
            //     price: this.dataObj.mintedPrice,
            //     nftFlatPrice:
            //       this.dataObj.fixedPrice || this.dataObj.unifiedPriceSet
            //         ? this.dataObj.mintedPrice
            //         : '0',
            //     proof: merkle.data.proof,
            //     canvasProof: merkleWorkData.data.proof,
            //     nftOwner: this.MetaMaskAddress,
            //   }
            //   const tx = await createCanvasAndMintNFT(reqData)
            //   await tx.wait()
            //   this.dialogLoading = false
            //   this.dialogSucc = true
            //   this.getData()
            // } catch (error) {
            //   console.log(error, 'error')
            //   const err = JSON.stringify(error)
            //   this.errMsgNit(err)
            //   this.dialogLoading = false
            // }
          }
        }
        if (isAuthority.data >= 5) {
          this.dialogRestrict = true
        }
        //true no one
      } else {
        this.loginWallet()
      }
    },
    async getData() {
      const data = await workDetail(this.$route.query.id)
      this.dataObj = data.data
      this.shareActions[1].disabled = this.dataObj.openseaLink ? false : true
      this.shareActions[2].disabled = this.dataObj.discordLink ? false : true
      this.shareActions[3].disabled = this.dataObj.twitterLink ? false : true
      const filter = this.dataObj.socialLinks.filter((item) => item !== '')
      this.socialLinkList = filter.map((item, idx) => {
        return {
          name: 'Open External Link ' + (idx + 1),
          value: item,
          disabled: false,
        }
      })
      // this.dataObj.nextDrbStartTime = 10;
      if (this.dataObj.nextDrbStartTime > 0) {
        this.dialogTime = true
        this.drbData.h = parseInt(this.dataObj.nextDrbStartTime / 60 / 60)
        this.drbData.m = parseInt(
          this.dataObj.nextDrbStartTime / 60 - this.drbData.h * 60
        )
        this.drbData.s = parseInt(
          this.dataObj.nextDrbStartTime -
            this.drbData.h * 60 * 60 -
            this.drbData.m * 60
        )
        this.setTimeNum()
      }
      this.isLoading = false
    },
    async setTimeNum() {
      clearInterval(this.myTimeDisplay)
      this.myTimeDisplay = null
      this.myTimeDisplay = setInterval(() => {
        this.dataObj.nextDrbStartTime -= 1
        if (this.dataObj.nextDrbStartTime > 0) {
          this.drbData.h = parseInt(this.dataObj.nextDrbStartTime / 60 / 60)
          this.drbData.m = parseInt(
            this.dataObj.nextDrbStartTime / 60 - this.drbData.h * 60
          )
          this.drbData.s = parseInt(
            this.dataObj.nextDrbStartTime -
              this.drbData.h * 60 * 60 -
              this.drbData.m * 60
          )
        } else {
          this.dialogTime = false
          this.getData()
        }
      }, 1000)
    },
  },
  beforeDestroy() {
    clearInterval(this.myTimeDisplay)
    this.myTimeDisplay = null
  },
}
</script>
<style scoped lang="scss">
.work-box {
  overflow-y: auto;
}
.work-img {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.work-details {
  border-radius: 8px 8px 0px 0px;
  // background: #282f41;

  padding: 12px 20px;
  padding-bottom: 100px;
  .deta-top {
    display: flex;
    color: #fff;
    // padding: 12px 0px;
    margin-bottom: 12px;
    .det-lt {
      color: #f3f3f3;
      font-family: Roboto;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 50px;
    }
    .det-rt {
      margin-left: auto;
      font-size: 36px;
      display: flex;
    }
  }
  .deta-ctext {
    display: flex;
    .ct-le {
      width: 50%;
    }
    .ct-ri {
      width: 50%;
      display: flex;
      align-items: flex-end;
      padding-bottom: 10px;
      justify-content: flex-end;
    }
  }
  .ct-le-tp {
    color: #c4c4c4;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }

  .ct-le-bp {
    color: #745cd4;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
  }
  .ct-le-tm {
    color: #f3f3f3;
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
  }
  .deta-bom {
    color: #999;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    word-wrap: break-word;
    word-break: keep-all;
    // overflow-y: auto;
    // height: 140px;
  }
}
.none-box {
  height: 100px;
}
.text-dialog-box {
  margin-bottom: 32px;

  ::v-deep .van-cell {
    background-color: transparent;
  }
  ::v-deep .van-cell-group {
    background-color: transparent;
  }
  ::v-deep .van-field {
    font-size: 12px;
    width: 100%;
    color: #757575;
    border: 1px solid #3a445c;
  }
  ::v-deep .van-field__control {
    height: auto;
  }
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.daoname-col {
  color: #745cd4;
}
::v-deep .van-popover--light .van-popover__arrow {
  color: #282f41;
}
.popbox {
  // height: 24px;
  // width: 24px;
  // margin: 0 12px;
  // line-height: 24px;
  color: #b3b5f2;
  // font-size: 24px;
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
.markdown-body {
  color: #999;
}
</style>
