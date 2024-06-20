<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="info-box" v-else>
    <van-nav-bar
      title="Edit Information"
      left-arrow
      @click-left="onClickLeft"
    />
    <p class="field-lable">DAO Name</p>
    <div class="disabled-name">
      <van-field v-model="formData.daoName" disabled placeholder="DAO name" />
    </div>
    <p class="field-lable">DAO’s Manifesto</p>
    <van-field
      v-model="formData.daoManitesto"
      rows="2"
      autosize
      type="textarea"
      maxlength="1500"
      placeholder="Please enter your DAO‘s manifesto, Markdown syntax is supported."
      show-word-limit
      @focus="isSumbit = false"
      @blur="isSumbit = true"
    />
    <p class="field-lable">DAO’s Description</p>
    <van-field
      v-model="formData.daoDescription"
      rows="2"
      autosize
      type="textarea"
      maxlength="5000"
      placeholder="Please enter your DAO‘s description, Markdown syntax is supported."
      show-word-limit
      @focus="isSumbit = false"
      @blur="isSumbit = true"
    />
    <p class="field-lable">Dao Logo</p>
    <div class="no-body">
      <van-field type="textarea" autosize readonly clickable>
        <div slot="label" class="no-title">
          Recommended resolution is 200*200 with file size less than 10MB, keep
          visual elements centered (JPG, JPEG, PNG, GIF)
        </div>
        <van-uploader
          slot="input"
          v-model="fileList"
          :before-read="beforeRead"
          :after-read="afterRead"
          @delete="logoDelete"
        />
      </van-field>
    </div>

    <p class="field-lable">Social Connections</p>
    <van-field v-model="formData.openseaLink" placeholder="https://opensea.io/"
      ><span slot="left-icon">
        <svg-icon icon-class="opensea" class="icon-font" />
      </span>
    </van-field>
    <div class="line-body">
      <van-field
        v-model="formData.discordLink"
        placeholder="https://t.me/abcdef"
      >
        <span slot="left-icon">
          <svg-icon icon-class="telegram" class="icon-font" />
        </span>
      </van-field>
    </div>
    <div class="line-body">
      <van-field
        v-model="formData.twitterLink"
        placeholder="https://twitter.com/abcdef"
        ><span slot="left-icon">
          <svg-icon icon-class="Twitter" class="icon-font" />
        </span>
      </van-field>
    </div>

    <div
      class="line-body"
      v-for="item in connectionsList.length"
      :key="item + 'a'"
    >
      <van-field
        v-model="connectionsList[item - 1]"
        placeholder="You can add any external link you want."
        ><span slot="left-icon">
          <svg-icon icon-class="lianj" class="icon-font" />
        </span>
      </van-field>
    </div>

    <div class="no-box"></div>
    <div class="new-btns" v-show="isSumbit">
      <van-button
        color="#745CD4"
        @click="setDao"
        style="width: 100%"
        safe-area-inset-bottom
        :disabled="!formData.daoName || formData.daoName === ''"
        v-preventReClick
        >Submit
      </van-button>
    </div>
    <van-dialog v-model="dialogSuccsess" :show-confirm-button="false">
      <div slot="title" class="dialog-title">
        <span class="dialog-icon" @click="close"
          ><van-icon name="cross"
        /></span>
      </div>
      <p class="dialog-text">
        Information successfully edited! Your changes have been saved.
      </p>
    </van-dialog>
    <van-dialog v-model="dialogLoading" :show-confirm-button="false">
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">
        Your change is being processed, it should be finished immedately.
      </p>
    </van-dialog>
  </div>
</template>

<script>
import { daoEditDetail, daoEdit } from "@/common/api";
import { Notify } from "vant";
import Loading from "@/components/Loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      networkId: "",
      value: "DAO nameasd",
      fileList: [],
      formData: {
        daoName: "",
        daoDescription: "",
        daoManitesto: "",
        twitterLink: "",
        discordLink: "",
        openseaLink: "",
        daoLogoUrl: "",
      },
      dialogSuccsess: false,
      isSumbit: true,
      dialogLoading: false,
      connectionsList: ["", "", ""],
      isLoading: true,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    close() {
      this.dialogSuccsess = false;
    },
    async setDao() {
      this.dialogLoading = true;
      const sig = await this.getSig(1);
      if (sig) {
        this.formData.socialLinks = this.connectionsList
          .filter((item) => item !== "")
          .join(",");
        const res = await daoEdit(this.formData);
        if (res.resultCode === 100) {
          this.dialogLoading = false;
          this.dialogSuccsess = true;
        } else {
          if (res.resultCode === 402) {
            this.dialogLoading = false;
            this.loginWallet();
          }
          this.dialogLoading = false;
        }
      } else {
        this.dialogLoading = false;
      }
    },
    async getData() {
      const data = await daoEditDetail({ daoId: this.$route.query.id });
      this.formData = data.data;
      this.fileList[0] = {
        url: this.formData.daoLogoUrl,
      };
      this.connectionsList = this.formData.socialLinks;
      this.isLoading = false;
      // this.connectionsList = this.formData.socialLinks;
    },
    beforeRead(file) {
      const typs = ["image/png", "image/jpeg", "image/gif", "image/jpg"];
      const isJPG = typs.indexOf(file.type) > -1;
      if (!isJPG) {
        Notify({
          message: "Invalid file type",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return false;
      }

      const isLt = file.size / 1024 / 1024 < 10;
      if (!isLt) {
        Notify({
          message: "File size exceeds limit",
          color: "#F0F0F0",
          background: "#745CD4",
          duration: 3000,
        });
        return false;
      }
      return true;
    },
    afterRead(files) {
      const URL = window.URL || window.webkitURL;
      this.formData.logoUrl = URL.createObjectURL(new Blob([files.file]));
      this.formData.daoLogo = files.file;
    },
    logoDelete() {
      this.formData.logoUrl = "";
      this.formData.daoLogo = null;
    },
    onClickLeft() {
      this.$router.back(-1);
    },
  },
};
</script>
<style scoped lang="scss">
.info-box {
  padding: 0 20px;
}
::v-deep .van-cell {
  background-color: transparent;
}
::v-deep .van-cell-group {
  background-color: transparent;
}
.no-body {
  margin-bottom: 12px;
  ::v-deep .van-field__textarea-wrap .van-field {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    padding: 0;
    border: none;
  }
  .no-title {
    color: #757575;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 8px;
    p {
      height: 46px;
      line-height: 46px;
      color: #999;
      font-feature-settings: "clig" off, "liga" off;
      font-family: Roboto;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }
  }
  ::v-deep .van-field {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .van-field__label {
    width: 100%;
  }
  ::v-deep .van-field__textarea-wrap .van-field .van-field__label {
    display: block !important;
    width: 100%;
  }
  ::v-deep .van-field__textarea-wrap .van-field {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .van-field__label {
    max-width: 100% !important;
  }
  ::v-deep .van-uploader__wrapper {
    margin: 0;
  }
  ::v-deep .van-uploader__wrapper {
    width: 104px;
    height: 104px;
  }
  ::v-deep .van-uploader__upload {
    width: 104px;
    height: 104px;
    background-color: transparent;
    margin: 0;
    border: 1px dashed #6062aa;
    border-radius: 5px;
  }
  ::v-deep .van-uploader__input {
    width: 104px;
    height: 104px;
  }
  ::v-deep .van-uploader__preview {
    height: 100%;
    width: 100%;
    margin: 0;
    margin-bottom: 80px;
  }
  ::v-deep .van-uploader__preview-image {
    height: 100%;
    width: 100%;
  }
  ::v-deep .van-uploader__preview-delete {
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 0 14px;
  }
  ::v-deep .van-image__img {
    border-radius: 2px;
  }
  ::v-deep .van-uploader__file {
    width: 104px;
    height: 104px;
    border-radius: 2px;
    background-color: transparent;
    border: 1px dashed #353245;
  }
  ::v-deep .van-uploader__file-status {
    width: 104px;
    height: 104px;
    border-radius: 2px;
    background-color: transparent;
  }
}
.line-body {
  margin: 20px 0;
}
.disabled-name {
  .van-cell {
    border: 1px solid #6062aa;
    border-radius: 5px !important;
    background: #0a0a0a;
    color: #404040 !important;
    font-family: Roboto;

    font-style: normal;
    font-weight: 400;
  }
}
::v-deep .van-field__control:disabled {
  color: #f3f3f3;
  caret-color: #f3f3f3;
  background-color: transparent;
  opacity: 1;
}
.daoname {
  ::v-deep .van-cell {
    background: #232325;
  }
}
.no-box {
  height: 200px;
}
.icon-font {
  font-size: 18px;
}

.field-lable {
  color: #fff;
  margin: 0;
  color: #999;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 6px !important;
  margin-top: 20px !important;
}

.van-cell {
  border: 1px solid #6062aa;
  border-radius: 5px !important;
}
.van-cell::after {
  display: none;
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
</style>
