<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="box-body" v-else>
    <div class="body-title">{{ $t('nodeDetail.editTabNames')[0] }}</div>
    <div class="body-box">
      <div class="divider">
        <div class="divider-text">
          {{ $t('nodeDetail.basicParameterLabel') }}
        </div>
        <div class="divider-lint"></div>
      </div>
      <!-- <p class="titee-text">
        Once the basic property is submitted, you will not be able to make any
        changes in the current version of D4A.Please do a preview.
      </p> -->
      <div class="box-form">
        <el-form
          ref="ruleForm"
          :model="formData"
          :rules="rules"
          label-position="right"
          label-width="184px"
        >
          <el-form-item :label="$t('nodeDetail.nodeNameLabel')" prop="daoName">
            <el-input
              v-model="formData.daoName"
              :placeholder="$t('nodeDetail.nodeNamePlaceholder')"
              :disabled="!objData.isTogetherDao"
              class="no-icon-input"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('nodeDetail.nodesManifestoLabel')">
            <el-input
              type="textarea"
              :rows="3"
              maxlength="1500"
              v-model="formData.daoManitesto"
              :placeholder="$t('nodeDetail.nodesManifestoPlaceholder')"
            ></el-input>
            <div class="zdy-word-limit">{{ daoManitestoLength }}/1500</div>
          </el-form-item>
          <el-form-item :label="$t('nodeDetail.nodesDescriptionLabel')">
            <el-input
              type="textarea"
              :rows="3"
              maxlength="5000"
              v-model="formData.daoDescription"
              :placeholder="$t('nodeDetail.nodesDescriptionPlaceholder')"
            ></el-input>
            <div class="zdy-word-limit">{{ daoDescriptionLength }}/5000</div>
          </el-form-item>
          <el-form-item :label="$t('nodeDetail.nodeLogoLabel')">
            <div class="upload-div">
              <div class="logotext">
                {{ $t('nodeDetail.nodeLogoText') }}
              </div>
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
                    <p>Upload</p>
                  </div>
                </el-upload>
              </div>
            </div>
            <div class="upload-err" v-show="logoErr">
              {{ logoErr }}
            </div>
          </el-form-item>

          <!-- <el-form-item label="Nodes Background Banner :">
            <div class="upload-div">
              <div class="logotext">
                Recommended resolution is 1920*600 with file size less than
                20MB, keep visual elements centered (JPG, JPEG, PNG).
              </div>
              <div class="img-banner">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="bannerBeforeAvatarUpload"
                >
                  <img
                    v-if="formData.bannerUrl"
                    :src="formData.bannerUrl"
                    class="avatar"
                  />
                  <div v-else class="upload-no">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    <p>Upload</p>
                  </div>
                </el-upload>
              </div>
            </div>
            <div class="upload-err" v-show="bannerErr">
              {{ bannerErr }}
            </div>
          </el-form-item> -->
          <div class="divider">
            <div class="divider-text">
              {{ $t('nodeDetail.communityParameterLabel') }}
            </div>
            <div class="divider-lint"></div>
          </div>
        </el-form>
      </div>
      <div class="box-form">
        <el-form :model="formData" label-position="right" label-width="186px">
          <el-form-item :label="$t('nodeDetail.socialConnectionsLabel')">
            <el-input
              :placeholder="$t('nodeDetail.socialConnectionsPriceLabel')"
              v-model="formData.openseaLink"
            >
              <template slot="prepend">
                <div class="input-icon">
                  <svg-icon icon-class="openseaio" class="big-icon" />
                  https://opensea.io/
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="abcdef" v-model="formData.discordLink">
              <template slot="prepend">
                <div class="input-icon">
                  <svg-icon icon-class="telegramzi" class="big-icon" />
                  https://t.me/
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="abcdef" v-model="formData.twitterLink">
              <template slot="prepend">
                <div class="input-icon">
                  <svg-icon icon-class="twitterio" class="big-icon" />
                  https://twitter.com/
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-for="item in connectionsList.length"
            :key="item + 'a'"
            class="leftinput"
          >
            <el-input
              placeholder="yoursite.io"
              v-model="connectionsList[item - 1]"
            >
              <template slot="prefix">
                <div class="input-icon iconconne">
                  <svg-icon icon-class="yoursite" class="big-icon" />
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btns">
      <button class="elbtns-b" style="margin-left: 186px" @click="goBack">
        Back
      </button>
      <button
        class="elbtns-l"
        style="margin-left: 20px"
        v-preventReClick
        @click="create"
      >
        Submit
      </button>
    </div>
    <el-dialog
      :title="$t('nodeDetail.editTabNames')[0]"
      :visible.sync="dialogLoading"
      :center="true"
      width="412px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div class="dialogLoading">
        <div class="dialog-loading">
          <loading />
        </div>
        <p class="dialog-text">
          {{ $t('nodeDetail.editInformationDialogText') }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import { checkName, daoEditDetail, daoEdit } from '@/common/api'
export default {
  components: { Loading },
  data() {
    return {
      dialogLoading: false,
      isLoading: true,
      formData: {
        daoName: '',
        daoManitesto: '',
        daoDescription: '',
        daoLogo: '',
        daoBgBanner: '',
        openseaLink: '',
        twitterLink: '',
        discordLink: '',
        logoUrl: '',
        bannerUrl: '',
      },
      rules: {
        daoName: [
          {
            required: true,
            validator: async (rule, value, callback) => {
              if (!value) {
                return callback(new Error('This field is required'))
              }
              if (value.length > 45) {
                return callback(
                  new Error(
                    `Ensure this value has at most 45 characters ( it has ${value.length} ).`
                  )
                )
              }
              if (value.toLowerCase() === this.initName.toLowerCase()) return
              const data = {
                name: value,
                type: 0,
              }
              const res = await checkName(data)
              if (res.resultCode !== 100) {
                return callback(new Error(res.resultDesc))
              }
            },
            trigger: 'blur',
          },
        ],
      },
      logoErr: null,
      bannerErr: null,
      connectionsList: ['', '', ''],
      objData: {},
      initName: '',
    }
  },
  computed: {
    daoDescriptionLength() {
      return this.formData.daoDescription.replace(/\r\n/g, '-').length
    },
    daoManitestoLength() {
      return this.formData.daoManitesto.replace(/\r\n/g, '-').length
    },
  },
  // watch: {
  //   "formData.daoDescription"(cur, old) {},
  // },
  mounted() {
    this.getData()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    async getData() {
      const data = await daoEditDetail({ daoId: this.$route.query.id })
      this.objData = data.data
      this.formData = {
        ...this.objData,
        logoUrl: this.objData.daoLogoUrl,
        bannerUrl: this.objData.daoBgBanner,
      }
      this.initName = this.objData.daoName
      this.connectionsList = this.objData.socialLinks
        ? this.objData.socialLinks
        : ['', '', '']
      this.isLoading = false
    },
    async create() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogLoading = true
          const sig = await this.getSig()
          if (sig) {
            this.formData.socialLinks = this.connectionsList
              .filter((item) => item !== '')
              .join(',')
            const res = await daoEdit(this.formData)

            if (res.resultCode !== 500) {
              this.dialogLoading = false
              this.successNotif('Updated!')
            } else {
              this.dialogLoading = false
              this.errNotif('Updated failed, please retry later')
            }
          } else {
            this.dialogLoading = false
          }
        }
      })
    },

    bannerBeforeAvatarUpload(file) {
      const typs = ['image/png', 'image/jpeg', 'image/jpg']
      const isJPG = typs.indexOf(file.raw.type) > -1
      if (!isJPG) {
        this.bannerErr = 'Invalid file type'
        return false
      }
      const isLt = file.raw.size / 1024 / 1024 < 20
      if (!isLt) {
        this.bannerErr = 'File size exceeds limit'
        return false
      }
      this.bannerErr = null

      var URL = window.URL || window.webkitURL
      this.formData.bannerUrl = URL.createObjectURL(new Blob([file.raw]))
      this.formData.daoBgBanner = file.raw
      this.$refs.ruleForm.clearValidate('bannerUrl')
    },
    logoBeforeAvatarUpload(file) {
      const typs = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg']
      const isJPG = typs.indexOf(file.raw.type) > -1
      if (!isJPG) {
        this.logoErr = 'Invalid file type'
        return false
      }
      const isLt = file.raw.size / 1024 / 1024 < 5
      if (!isLt) {
        this.logoErr = 'File size exceeds limit'
        return false
      }
      this.logoErr = null

      var URL = window.URL || window.webkitURL
      this.formData.logoUrl = URL.createObjectURL(new Blob([file.raw]))
      this.formData.daoLogo = file.raw

      this.$refs.ruleForm.clearValidate('logoUrl')
      // return isJPG && isLt2M;
    },
  },
}
</script>
<style scoped lang="scss">
.isDisabled {
  background: #a8dfe7 !important;
  border-color: #a8dfe7 !important;
  // cursor: no-drop !important;
}

.body-box {
  width: 960px;
  margin: 0 auto;
  font-family: Roboto4;
}

.body-title {
  height: 80px;
  border-bottom: 1px solid #6062aa;
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
  margin-top: 42px;
  margin-bottom: 42px;
}

::v-deep .el-divider {
  background-color: #c5dadd;
}

.divider {
  display: flex;
  justify-content: space-between;
  align-self: center;
  margin: 24px 0;
  width: 960px;

  .divider-text {
    background-color: transparent;
    color: #9e9e9e;
    width: 200px;
    text-align: center;
  }

  .divider-lint {
    background-color: #6062aa;
    height: 1px;
    flex: 1;
    margin: auto;
  }
}

.titee-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  font-family: Roboto4;
  margin-bottom: 40px;
}

.box-form {
  width: 100%;
  margin: 0 auto;

  ::v-deep .el-form-item {
    width: 720px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
}

::v-deep .el-form-item__label {
  color: #9e9e9e;
}

::v-deep .el-input {
  outline: 1px solid #6062aa;
  border-radius: 2px;
}

::v-deep .el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border: none;
  color: #757575;
}

::v-deep .el-input.is-disabled .el-input__inner::placeholder {
  color: #757575;
}

::v-deep .no-icon-input {
  .el-input__inner {
    padding-left: 16px;
  }
}

.big-icon {
  width: 28px;
  height: 28px;
  margin: 6px;
}

::v-deep .el-textarea__inner {
  outline: 1px solid #6062aa;
}

::v-deep .el-textarea__inner,
::v-deep .el-input__inner {
  background-color: transparent;
  border: none;
  color: #9e9e9e;
}

::v-deep .el-input-group__prepend {
  background-color: transparent;
  border: none;
  padding: 0px 0px 0px 6px;
}

::v-deep .el-textarea__inner::placeholder {
  color: #757575;
  font-size: 12px;
}

::v-deep .el-textarea__inner:focus {
  border-color: #6062aa;
  box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
}

::v-deep .el-input__inner::placeholder {
  color: #757575;
}

::v-deep .el-input__inner {
  padding-left: 0px;
}

::v-deep .el-form-item {
  margin-bottom: 30px;
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

.upload-div {
  // display: flex;
  .img,
  .img-banner {
    width: 100px;
    height: 100px;
    box-sizing: border-box;
    background: #282f41;
    border: 1px dashed #6062aa;
    border-radius: 2px;
    cursor: pointer;

    .avatar-uploader {
      height: 100%;
      width: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 400ms ease 0s;
    }
  }

  .img-banner {
    width: 320px;
    height: 100px;
  }
}

.logotext {
  flex: 1;
  font-size: 14px;
  line-height: 22px;
  color: #757575;
  margin-bottom: 14px;
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
  color: #ffa1a1;
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
    color: #757575;
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
    z-index: 1;
  }
}

::v-deep .el-select {
  width: 288px;

  ::v-deep .el-select .el-input__inner:focus {
    border-color: #745cd4 !important;
  }
}

::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #745cd4 !important;
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

.leftinput {
  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: 49px;
  }
}

// .notice {
//   height: 50px;
//   border-top: 1px solid #c5dadd;
//   border-bottom: 1px solid #c5dadd;
//   font-size: 14px;
//   color: #757575;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   .spanl {
//     color: #6062AA;
//     margin-left: 12px;
//   }
// }
.spanl {
  color: #6062aa;
}

.btns {
  width: 720px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 75px;
  display: flex;

  .btn_m3 {
    margin-left: 185px;
    height: 32px;
    width: 104px;
    border: none;
    background-color: #745cd4;
    color: #ffffff;
  }
}

::v-deep .el-radio {
  color: #757575;
}

::v-deep .slider-box {
  margin-bottom: 20px;
}

::v-deep .el-form-item__error {
  color: #ffa1a1;
}

.dialogLoading {
  height: 260px;
  text-align: center;
  padding: 0px 20px;

  p {
    font-size: 16px;
    color: #bfbfbf;
    text-align: center;
    margin: 0;
    padding: 30px 0 40px 0;
  }
}

.noTime {
  font-size: 12px;
  padding-top: 4px;
  position: absolute;
  line-height: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.addbtn {
  color: #6062aa;
  cursor: pointer;
}

.connections-input {
  width: 90%;
}

.strategieList {
  box-sizing: border-box;
}

.dialogList {
  padding: 18px;
  box-sizing: border-box;
  max-height: 400px;
  overflow-y: scroll;
}

.list-text {
  font-size: 14px;
  color: #9e9e9e;
  word-break: keep-all;
}

.list-btns {
  box-sizing: border-box;
  min-height: 72px;
  border: 1px solid #bababa;
  border-radius: 2px;
  margin-top: 18px;

  .btns-top {
    height: 70px;
    width: 90%;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #424242;
    margin: 0 auto;
    cursor: pointer;

    .btns-icon {
      margin-left: auto;
    }
  }

  .btns-bom {
    .bom-btn {
      height: 66px;
      border: 1px solid #bababa;
      border-radius: 2px;
      width: 90%;
      margin: 0 auto;
      margin-bottom: 18px;
      cursor: pointer;
      text-align: center;
      line-height: 66px;
      font-size: 16px;
      color: #424242;
    }
  }
}

.strategy-box {
  margin-top: 16px;
}

.strategy-erc {
  // margin-top: 12px;
  margin-top: -20px;
  display: flex;
  box-sizing: border-box;
  height: 56px;
  border: 1px solid #c5dadd;
  border-radius: 2px;
  align-items: center;

  .erc-l {
    margin-left: 18px;
  }

  .erc-c {
    margin-left: 30px;

    p {
      margin: 0;
    }
  }

  .erc-r {
    margin-left: auto;
    margin-right: 18px;
  }
}

.collect_btns {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.scroll-no {
  overflow-y: auto;
}

.disabled-btn {
  background: #e5e5e5 !important;
  cursor: no-drop !important;
  border-color: #d9d9d9 !important;
  color: #9e9e9e !important;
}

.bom-btn-web {
  text-align: start !important;

  .webright {
    float: right;
    margin-right: 18px;
  }

  .webleft {
    margin-left: 18px;
  }
}

.zdy-word-limit {
  height: 16px;
  line-height: 16px;
  color: #909399;
  background: transparent;
  position: absolute;
  font-size: 12px;
  bottom: 0px;
  right: 15px;
}

.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
</style>
