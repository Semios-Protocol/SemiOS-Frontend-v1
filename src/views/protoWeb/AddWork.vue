<template>
  <div class="box-addw">
    <div class="body-title">{{ $t('addWork.addWorksTitle') }}</div>
    <div class="body-box">
      <div class="box-form">
        <el-form
          ref="ruleFormWorks"
          :model="formData"
          :rules="rules"
          label-position="right"
          label-width="184px"
        >
          <el-form-item prop="daoId">
            <template slot="label">
              <span>{{ $t('addWork.daoIdLabel') }} : </span>
            </template>
            <el-select
              v-model="formData.daoId"
              filterable
              :filter-method="filterMethod"
              @change="selectConvas"
              @focus="selectFocus"
              no-data-text="No Nodes can be selected."
              :placeholder="$t('addWork.daoIdPlaceholder')"
            >
              <el-option
                v-for="item in options"
                :key="item.daoId"
                :label="item.daoName"
                :value="item.daoId"
                :disabled="item.daoStatus === 4"
              >
                <span style="float: left"
                  >{{ item.daoName }}

                  <!-- <span class="suspend" v-show="item.daoStatus === 4">
                    <i class="el-icon-warning-outline"></i>
                    Suspend</span
                  > -->
                </span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px"
                  >D4A@{{ item.daoNumber }}</span
                > -->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="noworks" v-if="canvasInfo.canId">
            <template slot="label">
              <span
                >{{ $t('addWork.mintableWorksLabel') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Unminted works cannot exceed 500."
                  placement="top"
                >
                  <span>
                    <svg-icon icon-class="InfoCircle" />
                  </span>
                </el-tooltip>
                :
              </span>
            </template>
            <div class="info" v-if="canvasInfo.unmintedWorkAmount === 0">
              No works yet, please add
            </div>
            <div class="images" v-else>
              <div
                v-for="(i, idx) in canvasInfo.unmintedWorkUrls"
                :key="i + idx"
                class="img-item"
              >
                <img :src="i" alt="" />
              </div>
              <span class="unminted"
                >{{ canvasInfo.unmintedWorkAmount }}/{{
                  canvasInfo.unmintedWorkTotal
                }}</span
              >
            </div>
          </el-form-item>
          <el-form-item label="Add Work :">
            <div class="upload-div">
              <div class="img">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="logoBeforeAvatarUpload"
                >
                  <img
                    v-if="formData.logoUrl"
                    :src="formData.logoUrl"
                    class="avatar"
                  />
                  <div v-else class="upload-no">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    <p>{{ $t('addWork.uploadLabel') }}</p>
                  </div>
                </el-upload>
              </div>
              <div class="logotext">
                {{ $t('addWork.urlSizeText') }}
              </div>
            </div>
            <div class="upload-err" v-show="logoErr">
              {{ logoErr }}
            </div>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span>{{ $t('addWork.workDescriptionLabel') }} : </span>
            </template>
            <el-input
              type="textarea"
              :rows="3"
              maxlength="5000"
              show-word-limit
              v-model="formData.workDescription"
              :placeholder="$t('addWork.workDescriptionPlaceholder')"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="Choose a Type of Sale :"
            v-if="this.canvasInfo.basicDao && this.canvasInfo.basicDao !== 2"
          >
            <div class="unified-box" v-if="canvasInfo.unifiedPrice">
              <el-tabs
                type="card"
                v-model="pethodType"
                @tab-click="handleClick"
                v-if="canvasInfo.unifiedPrice"
              >
                <el-tab-pane name="unifiedPrice">
                  <span slot="label" class="tabname">
                    {{ $t('addWork.unifiedPriceLabel') }}
                    <svg-icon
                      slot="suffix"
                      class="fontsize"
                      icon-class="Frame"
                    />
                  </span>
                  <p class="pane-title">
                    {{ $t('addWork.unifiedPriceText') }}
                  </p>
                  <p class="pane-text">
                    {{ $t('addWork.unifiedPriceLabel') }}
                    <span
                      >{{ canvasInfo.canvasCurrentPrice }}
                      <TokenIcon
                        size="12px"
                        :payCurrencyType="canvasInfo.payCurrencyType"
                        :inputTokenAddress="canvasInfo.inputTokenAddress"
                      />
                    </span>
                  </p>
                  <p class="pane-text">
                    {{ $t('addWork.subNodesFeeLabel') }}
                    <span
                      >{{ canvasInfo.fixedDaoReserveRatio.daoMintFee }}%</span
                    >
                  </p>
                  <p class="pane-text pane-nom">
                    {{ $t('addWork.builderFeeLabel') }}
                    <span
                      >{{ canvasInfo.fixedDaoReserveRatio.canvasMintFee }}%
                    </span>
                  </p>
                  <p class="pane-text pane-nom">
                    {{ $t('addWork.semiosFeeLabel') }}
                    <span
                      ><span class="old-fee">2.5</span>
                      {{ canvasInfo.fixedDaoReserveRatio.d4aMintFee }}%</span
                    >
                  </p>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="price-box" v-else>
              <el-tabs
                type="card"
                v-model="pethodType"
                @tab-click="handleClick"
              >
                <el-tab-pane name="daoPrice">
                  <span slot="label" class="tabname">
                    {{ $t('addWork.floatingPriceLabel') }}
                    <svg-icon
                      slot="suffix"
                      class="fontsize"
                      icon-class="Frame"
                    />
                  </span>
                  <p class="pane-title">
                    {{ $t('addWork.floatingPriceText') }}
                  </p>
                  <p class="pane-text">
                    {{ $t('addWork.currentPriceLabel') }}
                    <span
                      >{{ canvasInfo.canvasCurrentPrice }}
                      <TokenIcon
                        size="12px"
                        :daoToken="canvasInfo.erc20PaymentMode"
                        :daoSymbol="canvasInfo.daoSymbol"
                        :daoErc20Address="canvasInfo.daoErc20Address"
                        :payCurrencyType="canvasInfo.payCurrencyType"
                        :inputTokenAddress="canvasInfo.inputTokenAddress"
                      />
                      <!-- <svg-icon
                        :icon-class="
                          canvasInfo.erc20PaymentMode ? 'token' : 'eth'
                        "
                    /> -->
                    </span>
                  </p>
                  <p class="pane-text">
                    {{ $t('addWork.floorPriceLabel') }}
                    <span
                      >{{ canvasInfo.daoFloorPrice }}
                      <TokenIcon
                        color="#b3b5f2"
                        size="12px"
                        :daoToken="canvasInfo.erc20PaymentMode"
                        :daoSymbol="canvasInfo.daoSymbol"
                        :daoErc20Address="canvasInfo.daoErc20Address"
                        :payCurrencyType="canvasInfo.payCurrencyType"
                        :inputTokenAddress="canvasInfo.inputTokenAddress"
                      />
                      <!-- <svg-icon
                        :icon-class="
                          canvasInfo.erc20PaymentMode ? 'token' : 'eth'
                        "
                    /> -->
                    </span>
                  </p>
                  <p class="pane-text">
                    {{ $t('addWork.subNodesFeeLabel') }}
                    <span>{{ canvasInfo.daoReserveRatio.daoMintFee }}%</span>
                  </p>
                  <p class="pane-text pane-nom">
                    {{ $t('addWork.builderFeeLabel') }}
                    <span>{{ canvasInfo.daoReserveRatio.canvasMintFee }}%</span>
                  </p>
                  <p class="pane-text pane-nom">
                    {{ $t('addWork.semiosFeeLabel') }}
                    <span
                      ><span class="old-fee">2.5</span
                      >{{ canvasInfo.daoReserveRatio.d4aMintFee }}%</span
                    >
                  </p>
                </el-tab-pane>
                <el-tab-pane name="fixedPrice">
                  <span slot="label">{{ $t('addWork.fixedPriceLabel') }} </span>
                  <p class="pane-title">
                    {{ $t('addWork.fixedPriceText') }}
                  </p>
                  <p class="pane-text bomtext">
                    <el-form-item label="Set a Fixed Price" prop="fixedPrice">
                      <el-input
                        v-model="formData.fixedPrice"
                        placeholder="Please set a price "
                        oninput="if(isNaN(value||Number(value)<0)) { value = null } if(Number(value)>1000000000){
                          value = 1000000000
                        } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                      >
                        <TokenIcon
                          size="12px"
                          :daoToken="canvasInfo.erc20PaymentMode"
                          :daoSymbol="canvasInfo.daoSymbol"
                          :daoErc20Address="canvasInfo.daoErc20Address"
                          :payCurrencyType="canvasInfo.payCurrencyType"
                          :inputTokenAddress="canvasInfo.inputTokenAddress"
                        />
                        <!-- <svg-icon
                          slot="suffix"
                          :icon-class="
                            canvasInfo.erc20PaymentMode ? 'token' : 'eth'
                          "
                        /> -->
                      </el-input>
                    </el-form-item>
                  </p>

                  <p class="pane-text">
                    {{ $t('addWork.floorPriceLabel') }}
                    <span
                      >{{ canvasInfo.daoFloorPrice }}
                      <TokenIcon
                        size="12px"
                        :daoToken="canvasInfo.erc20PaymentMode"
                        :daoSymbol="canvasInfo.daoSymbol"
                        :daoErc20Address="canvasInfo.daoErc20Address"
                        :payCurrencyType="canvasInfo.payCurrencyType"
                        :inputTokenAddress="canvasInfo.inputTokenAddress"
                      />
                      <!-- <svg-icon
                        slot="suffix"
                        :icon-class="
                          canvasInfo.erc20PaymentMode ? 'token' : 'eth'
                        "
                    /> -->
                    </span>
                  </p>
                  <p class="pane-text">
                    {{ $t('addWork.subNodesFeeLabel') }}
                    <span
                      >{{ canvasInfo.fixedDaoReserveRatio.daoMintFee }}%</span
                    >
                  </p>
                  <p class="pane-text pane-nom">
                    {{ $t('addWork.builderFeeLabel') }}
                    <span
                      >{{
                        canvasInfo.fixedDaoReserveRatio.canvasMintFee
                      }}%</span
                    >
                  </p>
                  <p class="pane-text pane-nom">
                    {{ $t('addWork.semiosFeeLabel') }}
                    <span
                      ><span class="old-fee">2.5</span
                      >{{ canvasInfo.fixedDaoReserveRatio.d4aMintFee }}%</span
                    >
                  </p>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btns">
      <button class="btn_m3 btn_ml" @click="create" v-preventReClick>
        Create
      </button>
    </div>

    <el-dialog
      title="Loading"
      :visible.sync="dialogLoading"
      :close-on-click-modal="false"
      :show-close="false"
      width="426px"
    >
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">
        {{ $t('addWork.loadingDialogText') }}
      </p>
    </el-dialog>
    <el-dialog
      title="Congratulation!"
      :visible.sync="dialogSucc"
      :close-on-click-modal="false"
      width="426px"
      :before-close="close"
    >
      <div class="dialog-title">
        <div><svg-icon icon-class="smiley" style="font-size: 104px" /></div>
      </div>
      <p class="dialog-text">
        {{ $t('addWork.congratulationDialogText') }}
      </p>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="goWork"
          style="width: 100%; margin: 0"
          >Mint & Transfer NFT</el-button
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
            v-if="canvasInfo.discordLink"
            @click="goOpenUrl(canvasInfo.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="canvasInfo.twitterLink"
            @click="goOpenUrl(canvasInfo.twitterLink, 'https://twitter.com/')"
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
import {
  daoListProtodao,
  createWorkInfo,
  workCreate,
  workAuthority,
} from '@/common/api'
import { sig, decimals } from '@/common/walletService/services'
import { ethers } from 'ethers'
import { Notify } from 'vant'
import Loading from '@/components/Loading.vue'
import { copysPro } from '@/utils'
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: { Loading, TokenIcon },
  data() {
    return {
      logoUrl: '',
      dialogVisible: false,
      dialogLoading: false,
      daos: [],
      options: [],
      formData: {
        daoId: null,
        canvasId: null,
        logoUrl: null,
        workDescription: '',
        image: null,
        fixedPrice: null,
        priceType: '0',
      },
      canvasInfo: {
        unmintedWorkUrls: [],
        unmintedWorkAmount: 0,
        unmintedWorkTotal: 0,
        workUri: null,
        daoCreatorFee: 0,

        canvasCurrentPrice: 0,
        daoFloorPrice: 0,

        fixedPricedaoMintFee: 0,
        daoReserveRatio: {
          daoMintFee: 0,
          d4aMintFee: 0,
          canvasMintFee: 0,
        },
        fixedDaoReserveRatio: {
          daoMintFee: 0,
          d4aMintFee: 0,
          canvasMintFee: 0,
        },
        basicDao: 2,
      },
      rules: {
        daoId: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        canvasId: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        logoUrl: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
      },
      logoErr: null,

      pethodType: 'daoPrice',
      isLoading: true,
      viewWork: {
        canvasCurrentPrice: 0,
        canvasName: '',
        daoName: '',
        imageUrl: '',
        workHash: '',
      },
      seccWork: {},
      dialogSucc: false,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
  },
  mounted() {
    this.getData()
  },
  methods: {
    close() {
      this.seccWork = {}
      this.dialogSucc = false
    },
    goOpenUrl(url, http = null) {
      if (http) {
        window.open(http + url, '_blank')
      } else {
        window.open(url, '_blank')
      }
    },
    copyLink() {
      const url = location.origin + '/WorkDetails?id=' + this.seccWork.workId
      // :8080/daoMember?id=7
      copysPro(url)
      Notify({
        message: 'Copied!',
        color: '#F0F0F0',
        background: '#745CD4',
        duration: 3000,
      })
    },
    handleClose() {
      this.viewWork = {
        canvasCurrentPrice: 0,
        canvasName: '',
        daoName: '',
        imageUrl: '',
        workHash: '',
      }
      this.logoUrl = ''
      this.dialogLoading = false
      this.isLoading = true
    },
    handleClick() {
      this.formData.priceType = this.pethodType === 'fixedPrice' ? '1' : '0'
      if (this.pethodType !== 'fixedPrice') {
        // this.formData.fixedPrice = null
        this.rules = {
          daoId: [
            {
              required: true,
              message: 'This field is required',
              trigger: 'change',
            },
          ],
        }
        this.$nextTick(() => {
          this.$refs.ruleFormWorks.clearValidate()
        })
      } else {
        this.rules = {
          daoId: [
            {
              required: true,
              message: 'This field is required',
              trigger: 'change',
            },
          ],
          fixedPrice: [
            { required: true, message: 'Please set a price ', trigger: 'blur' },
            {
              validator: async (rule, value, callback) => {
                if (Number(this.canvasInfo.daoFloorPrice) === 0) {
                  return callback(
                    new Error(
                      `The current DAO does not support adding work with a fixed price.`
                    )
                  )
                }
              },
              trigger: 'blur',
            },
          ],
        }
        this.$nextTick(() => {
          this.$refs.ruleFormWorks.clearValidate()
        })
      }
    },
    goWork() {
      this.$router.push({
        path: '/workDetails',
        query: {
          id: this.viewWork.workId,
        },
      })
    },
    selectFocus() {
      this.options = [...this.daos]
    },
    filterMethod(val) {
      if (val) {
        this.options = this.daos.filter(
          (item) =>
            item.daoName.indexOf(val) > -1 ||
            item.daoName.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
            item.daoNumber.indexOf(val) > -1 ||
            `D4A@${item.daoNumber}`.toUpperCase().indexOf(val.toUpperCase()) >
              -1
        )
      } else {
        this.options = [...this.daos]
      }
    },
    async getData() {
      const data = await daoListProtodao()
      this.daos = data.dataList
      this.options = [...this.daos]
      if (this.$route.query.id) {
        const daoobj = this.options.find(
          (item) => item.daoId === this.$route.query.id
        )
        if (daoobj.daoStatus !== 4) {
          this.formData.daoId = this.$route.query.id
          this.selectConvas(this.formData.daoId)
        }
      }
    },
    async create() {
      if (this.User.address) {
        this.$refs.ruleFormWorks.validate(async (valid) => {
          if (valid) {
            BigNumber.config({ EXPONENTIAL_AT: 38 })
            this.logoUrl = this.formData.logoUrl
            const res = await createWorkInfo({ daoId: this.formData.daoId })
            this.canvasInfo = res.data
            const chainID = await sig().getChainId()
            const isSig = await this.getSig(1)
            if (!isSig) return
            const decimalsNum = this.canvasInfo.erc20PaymentMode
              ? await decimals(this.canvasInfo.daoErc20Address)
              : this.canvasInfo.inputTokenDecimals
            console.log(decimalsNum, 'decimalsNumdecimalsNumdecimalsNum')
            const domain = {
              name: 'ProtoDaoProtocol',
              version: '1',
              chainId: chainID,
              verifyingContract: this.canvasInfo.protocolContract,
            }
            const types = {
              MintNFT: [
                { name: 'canvasID', type: 'bytes32' },
                { name: 'tokenURIHash', type: 'bytes32' },
                { name: 'flatPrice', type: 'uint256' },
              ],
            }
            const value = {
              canvasID: this.canvasInfo.canId,
              tokenURIHash: ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes(this.canvasInfo.workUri)
              ),
              flatPrice:
                this.pethodType === 'daoPrice' ||
                this.pethodType === 'unifiedPrice'
                  ? 0
                  : new BigNumber(this.formData.fixedPrice)
                      .times(`1e${decimalsNum}`)
                      .toString(),
              // flatPrice: ethers.utils.parseEther(0.01 + ""),
            }
            try {
              console.log(domain, types, value, '-=---')
              this.dialogLoading = true
              const signature = await sig()._signTypedData(domain, types, value)
              console.log(signature, 'signature')
              this.formData.createSignHash = signature
              this.formData.workUriRandom = this.canvasInfo.workUriRandom
              this.formData.canvasId = this.canvasInfo.canId
              if (
                this.pethodType === 'daoPrice' ||
                this.pethodType === 'unifiedPrice'
              ) {
                this.formData.fixedPrice = null
                this.formData.priceType = 0
              } else {
                this.formData.priceType = 1
              }
              const isWork = await workAuthority({
                daoId: this.formData.daoId,
              })
              if (!isWork.data.createCanvas) {
                this.dialogLoading = false
                this.errNotif('You are ineligible to add works.')
                return
              }
              const data = await workCreate(this.formData)
              if (data.resultCode === 100) {
                this.isLoading = false
                this.formData.logoUrl = null
                this.formData.workDescription = ''
                this.formData.image = null
                this.viewWork = data.data
                this.seccWork = data.data
                this.dialogLoading = false
                this.dialogSucc = true

                this.selectConvas(this.formData.daoId)
              } else {
                this.dialogLoading = false
              }
            } catch (error) {
              this.errNotif('User denied message signature.')
              this.dialogLoading = false
              return
            }
          }
        })
      } else {
        this.loginWallet()
      }
    },
    preview() {
      this.$refs.ruleFormWorks.validate(async (valid) => {
        if (valid) {
          this.formData.daoName = this.daos.filter(
            (item) => item.daoId === this.formData.daoId
          )[0].daoName
          this.formData.canvasName = this.convas.filter(
            (item) => item.canvasId === this.formData.canvasId
          )[0].canvasName
          this.dialogVisible = true
        }
      })
    },
    logoBeforeAvatarUpload(file) {
      const typs = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg']
      const isJPG = typs.indexOf(file.raw.type) > -1
      if (!isJPG) {
        this.logoErr = 'Invalid file type'
        return false
      }
      const isLt = file.raw.size / 1024 / 1024 < 20
      if (!isLt) {
        this.logoErr = 'File size exceeds limit'
        return false
      }
      this.logoErr = null

      var URL = window.URL || window.webkitURL
      this.formData.logoUrl = URL.createObjectURL(new Blob([file.raw]))
      this.formData.image = file.raw
      this.$nextTick(() => {
        this.$refs.ruleFormWorks.clearValidate('logoUrl')
      })
      // return isJPG && isLt2M;
    },

    async selectConvas(value) {
      // const idx = this.columns.indexOf(this.formData.daoName);
      // const id = this.columnObjs[idx].daoId;
      const res = await createWorkInfo({ daoId: value })

      this.pethodType = res.data.unifiedPrice
        ? 'unifiedPrice'
        : res.data.basicDao === 1
        ? 'daoPrice'
        : 'fixedPrice'
      this.handleClick()
      this.formData.fixedPrice = res.data.unifiedPrice
        ? res.data.canvasCurrentPrice
        : res.data.basicDao === 2
        ? 0.01
        : null
      this.canvasInfo = { ...this.formData, ...res.data }
    },
  },
}
</script>
<style scoped lang="scss">
.dbtns {
  display: flex;
  flex-direction: column;
}
.box-addw {
  flex: 1;
}
.isDisabled {
  background: #a8dfe7 !important;
  border-color: #a8dfe7 !important;
  // cursor: no-drop !important;
}
.unminted {
  font-size: 14px;
  color: #757575;
}
.info {
  font-size: 14px;
  color: #424242;
}
.images {
  height: 120px;
  display: flex;
  .img-item {
    height: 104px;
    width: 104px;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 86px;
      height: 86px;
      object-fit: cover;
    }
  }
}
.body-box {
  width: 100%;
  padding: 0 28px;
  box-sizing: border-box;
  margin: 0 auto;
  font-family: Roboto4;
}
.body-title {
  height: 80px;
  border-bottom: 0.5px solid #6062aa;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  color: #bbbaba;
}
::v-deep .el-divider__text {
  padding: 0;
  padding-right: 10px;
  font-size: 18px;
  color: #757575;
}
::v-deep .el-divider__text.is-left {
  left: 0;
  transform: translateY(-55%);
}
::v-deep .el-divider--horizontal {
  margin-top: 45px;
  margin-bottom: 18px;
}
::v-deep .el-divider {
  background-color: #6062aa;
}
.titee-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  font-family: Roboto4;
  margin-bottom: 40px;
}
.box-form {
  width: 675px;
  margin: 0 auto;
  margin-top: 60px;
}
::v-deep .el-form-item__label {
  color: #9e9e9e;
}
::v-deep .el-input__inner {
  border-radius: 2px;
  background-color: #282f41;
  border-color: #6062aa;
  color: #9e9e9e;
}
::v-deep .el-input__inner:focus {
  border-color: #6062aa;
}
::v-deep .el-input__inner:hover {
  border-color: #6062aa;
}
::v-deep .el-form-item {
  margin-bottom: 35px;
}
::v-deep
  .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  color: #6062aa;
}
::v-deep .el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
  border-color: #6062aa;
}
::v-deep .el-textarea__inner:focus {
  border-color: #6062aa;
  box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
}
::v-deep .el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
  border-color: #6062aa;
}
::v-deep .el-form-item.is-error .el-textarea__inner {
  border-color: #6062aa;
}
.input-title {
  font-size: 14px;
  color: #757575;
}
::v-deep .el-textarea__inner {
  font-family: Roboto4;
  border-radius: 2px;
  background-color: #282f41;
  border-color: #6062aa;
  color: #9e9e9e;
}
.upload-div {
  display: flex;
  .img {
    width: 100px;
    height: 100px;
    border-radius: 2px;
    border: 1px dashed #6062aa;
    // box-sizing: border-box;
    background: #282f41;
    cursor: pointer;
    .avatar-uploader {
      height: 100px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 400ms ease 0s;
    }
  }
}
.logotext {
  flex: 1;
  font-size: 14px;
  line-height: 22px;
  color: #9e9e9e;
  margin-left: 16px;
}
.upload-no {
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  i {
    font-size: 12px;
    color: #6062aa;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #9e9e9e;
  }
}
::v-deep .el-upload {
  width: 100%;
  height: 100%;
}
.upload-err {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  line-height: 16px;
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 288px;
}
::v-deep .el-radio__inner:hover {
  border-color: #6062aa;
}
::v-deep .el-radio__input.is-checked .el-radio__inner {
  border-color: #6062aa;
  background: #6062aa;
}
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #757575;
}
.slider-box {
  width: 100%;
  ::v-deep .el-slider__runway {
    width: 90%;
    height: 4px;
    background: #f5f5f5;
  }
  ::v-deep .el-slider__marks-text {
    width: 80px;
    text-align: center;
  }
  ::v-deep .el-slider__button {
    width: 14px;
    height: 14px;
    box-sizing: border-box;
    border: 2px solid #6062aa;
    // background-color: transparent;
  }
  ::v-deep .el-slider__stop {
    top: -2px;
    width: 8px;
    height: 8px;
    border: 2px solid #6062aa;
    box-sizing: border-box;
  }
  ::v-deep .el-slider__bar {
    background-color: #6062aa;
    height: 4px;
  }
  ::v-deep .el-slider__button-wrapper {
    top: -16px;
  }
}
::v-deep .el-select {
  display: block;
  width: 288px;
  ::v-deep .el-select .el-input__inner:focus {
    border-color: #6062aa !important;
  }
}
::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #6062aa !important;
}
.input-icon {
  height: 100%;
  display: flex;
  align-items: center;
  .svg-icon {
    font-size: 24px;
    margin-right: 8px;
  }
}
::v-deep .el-input-group__append,
.el-input-group__prepend {
  background-color: #fafafa;
}
.notice {
  height: 50px;
  border-top: 1px solid #6062aa;
  border-bottom: 1px solid #6062aa;
  font-size: 14px;
  color: #757575;
  display: flex;
  align-items: center;
  .notice-box {
    width: 675px;
    margin: 0 auto;
    .spanl {
      color: #6062aa;
    }
    ::v-deep .el-form-item {
      margin: 0;
    }
  }
}
.btns {
  width: 675px;
  margin: 0 auto;
  margin-top: 32px;
  margin-bottom: 75px;
  display: flex;
}
::v-deep .el-input-group__prepend {
  background-color: #fafafa;
}
::v-deep .el-form-item__error {
  color: #ffa1a1;
}
.dialogLoading {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 350px;
  .imgs {
    height: 250px;
    width: 250px;
    margin: 0 auto;
    padding-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-height: 250px;
      max-width: 250px;
      object-fit: cover;
    }
  }
  .textbo {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 20px;
  }
}
.noworks {
  ::v-deep .el-form-item__error {
    display: none;
  }
}
.ywill {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.suspend {
  color: #ffa1a1;
  margin-right: 24px;
}
.price-box {
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border-radius: 0px !important;
  border-left: 0px;
  border-top: 0px;
  border-right: 0px;
  width: 100%;
  border-color: #6062aa;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  width: 50%;
  text-align: center;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  border-left-color: #6062aa;
}
::v-deep .el-tabs--card > .el-tabs__header {
  border-bottom-color: #6062aa;
}
::v-deep .el-tabs__item {
  color: #9e9e9e !important;
}
::v-deep .el-tabs__item:hover {
  color: #bbbaba !important;
}
::v-deep .el-tabs__item.is-active {
  color: #bbbaba !important;

  background: #282f41;
}
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__content {
  padding: 18px;
  height: 200px;
}
::v-deep .el-tab-pane {
  line-height: initial;
}
.pane-title {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #9e9e9e;
  margin-top: 0;
}
.pane-text {
  color: #9e9e9e;
  font-size: 12px;
  margin: 0;
  line-height: 50px;
  height: 32px;
  display: flex;
  align-items: center;
  width: 100%;

  span {
    margin-left: auto;
  }
  ::v-deep .el-form-item__content {
    display: flex;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  ::v-deep .el-form {
    width: 100%;
  }
}
.bomtext {
  height: 50px;
  font-size: 16px;
  color: #424242;
  ::v-deep .el-form-item {
    width: 100%;
  }
  ::v-deep .el-form-item__label {
    text-align: left;
  }
}
.pane-nom {
  margin-bottom: 0;
}
.text-decoration {
  text-decoration: line-through;
  color: #9e9e9e;
}
.text-ri {
  color: #ff9629;
  margin-right: 8px;
}
::v-deep .el-textarea .el-input__count {
  height: 16px;
  line-height: 16px;
  color: #909399;
  background: transparent;
  position: absolute;
  font-size: 12px;
  bottom: -20px;
  right: 0;
}
.fontsize {
  font-size: 20px;
}
.tabname {
  display: flex;
  align-items: center;
  justify-content: center;
}
.viewwork {
  display: flex;
  .workimg {
    width: 224px;
    height: 224px;
    border: 1px solid #6062aa;
    box-sizing: border-box;
    display: flex;
    img {
      width: 100%;
      object-fit: contain;
      transition: opacity 400ms ease 0s;
    }
  }
  .workdetail {
    width: 320px;
    margin-left: 24px;
    h3 {
      font-size: 16px;
      margin: 26px 0;
    }
    p {
      font-size: 12px;
      margin: 20px 0;
    }
  }
}
.workbtns {
  text-align: center;
  margin-top: 35px;
}
.btn_m3 {
  background: #745cd4;
  border-radius: 2px;
  border: 1px solid #745cd4;
  color: #fff;
  font-size: 14px;
  font-family: Inter4;
  width: 104px;
  height: 32px;
  margin-left: 184px;
  cursor: pointer;
}
.btn_m3:active {
  background-color: #533fa1;
}
.btn_mi3 {
  width: 104px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #745cd4;
  border-radius: 2px;
  color: #745cd4;
  font-size: 14px;
  font-family: Inter4;
  margin-left: 24px;
  cursor: pointer;
}
.btn_mi3:active {
  background: #d8d8d8;
}
::v-deep .el-tabs__header .el-tabs__item.is-active {
  border-color: #6062aa;
}
.unified-box {
  box-sizing: border-box;
  border: 1px solid #6062aa;
  border-radius: 2px;
  ::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
    width: 100% !important;
  }
}
.dialog-loading {
  .flexbox {
    height: 220px;
  }
}
.old-fee {
  text-decoration: line-through;
}
</style>
