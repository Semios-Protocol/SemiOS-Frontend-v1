<template>
  <div class="box-body">
    <div class="body-title">Profile</div>
    <div class="body-box">
      <div class="box-form">
        <el-form
          ref="ruleFormProfile"
          :model="formData"
          label-position="right"
          label-width="174px"
        >
          <el-form-item label="User Name :" prop="userName">
            <el-input
              v-model="formData.userName"
              placeholder="Please enter your username."
              type="text"
              maxlength="45"
              show-word-limit
              class="no-icon-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="User Bio :" prop="introduction">
            <el-input
              type="textarea"
              :rows="3"
              v-model="formData.introduction"
              placeholder="Please write some self introduciton."
              maxlength="1000"
              class="no-area"
            ></el-input>
            <div class="zdy-word-limit">{{ introductionLength }}/1000</div>
          </el-form-item>
          <el-form-item label="Avatar :" prop="avatarLink">
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
                    v-if="formData.avatarLink"
                    :src="formData.avatarLink"
                    class="avatar"
                  />
                  <div v-else class="upload-no">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    <p>Upload</p>
                  </div>
                </el-upload>
              </div>
              <div class="logotext">
                Recommended resolution is 200*200 with file size less than 2MB,
                keep visual elements centered (JPG, JPEG, PNG, GIF).
              </div>
            </div>
            <div class="upload-err" v-show="logoErr">
              {{ logoErr }}
            </div>
          </el-form-item>
          <el-form-item label="Social Link :">
            <el-input
              placeholder="collection/Collection Name"
              v-model="formData.openseaLink"
            >
              <template slot="prepend">
                <div class="input-icon">
                  <svg-icon icon-class="openseaio" class="big-icon" />
                  https://opensea.io/
                </div>
              </template>
              <div>123</div>
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
          <el-form-item class="btn">
            <el-button type="primary" @click="save" v-preventReClick
              >Save</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { userProfileInfo, userProfileSave, cookieInfo } from "@/common/api";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        userName: "",
        introduction: "",
        avatar: "",
        avatarLink: "",
        openseaLink: "",
        twitterLink: "",
        discordLink: "",
      },
      logoErr: null,
    };
  },
  computed: {
    introductionLength() {
      return this.formData.introduction.replace(/\r\n/g, "-").length;
    },
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapMutations(["setUser"]),
    async save() {
      const sig = await this.getSig();
      if (sig) {
        const data = await userProfileSave(this.formData);
        if (data.resultCode === 100) {
          this.openMessageTips("Updated!", "", "success", null);
          this.getData();
        } else {
          if (data.resultDesc) {
            this.openMessageTips(data.resultDesc, "", "error", null);
          }
        }
      }
    },
    async getData() {
      try {
        const data = await userProfileInfo();
        this.formData = data.data;
        const user = await cookieInfo();
        // const userNew = { ...user, name: this.formData.userName };
        this.setUser(user.data);
      } catch (error) {
        console.log(error);
      }
    },
    logoBeforeAvatarUpload(file) {
      const typs = ["image/png", "image/jpeg", "image/gif", "image/jpg"];
      const isJPG = typs.indexOf(file.raw.type) > -1;
      if (!isJPG) {
        this.logoErr = "Invalid file type";
        return false;
      }
      const isLt = file.raw.size / 1024 / 1024 < 2;
      if (!isLt) {
        this.logoErr = "File size exceeds limit";
        return false;
      }
      this.logoErr = null;

      var URL = window.URL || window.webkitURL;
      this.formData.avatarLink = URL.createObjectURL(new Blob([file.raw]));
      this.formData.avatar = file.raw;
      // return isJPG && isLt2M;
    },
  },
};
</script>
<style scoped lang="scss">
.body-box {
  width: 960px;
  margin: 0 auto;
  font-family: Roboto4;
  margin-top: 80px;
}

.body-title {
  height: 80px;
  border-bottom: 1px solid #6062aa;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  color: #bbbaba;

  .box-form {
    width: 675px;
    margin: 0 auto;
  }
}
::v-deep .no-icon-input {
  .el-input__inner {
    padding-left: 8px;

    padding-right: 46px;
  }
}
::v-deep .no-area {
  .el-textarea__inner {
    padding-bottom: 16px;
  }
}
::v-deep .el-form-item {
  margin-bottom: 35px;
}

::v-deep .el-form-item__label {
  color: #9e9e9e;
}

::v-deep
  .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  color: #6062aa;
}

::v-deep .el-input__inner {
  border-radius: 2px;
}

::v-deep .el-input__inner:focus {
  border-color: #6062aa;
  box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
}

.big-icon {
  margin: 6px;
}

::v-deep .el-form-item.is-error .el-input__inner,
::v-deep .el-form-item.is-error .el-input__inner:focus,
::v-deep .el-form-item.is-error .el-textarea__inner,
::v-deep .el-form-item.is-error .el-textarea__inner:focus,
::v-deep .el-message-box__input input.invalid,
::v-deep .el-message-box__input input.invalid:focus {
  border-color: #6062aa;
}

::v-deep .el-textarea__inner {
  font-family: Roboto4;
}

::v-deep .el-textarea__inner:focus {
  border-color: #6062aa;
  box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
}

.upload-div {
  display: flex;

  .img {
    width: 104px;
    height: 104px;
    background: #282f41;
    border: 1px dashed #6062aa;
    border-radius: 2px;
    cursor: pointer;

    .avatar-uploader {
      height: 104px;
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
  color: #757575;
  margin-left: 16px;
  max-width: 300px;
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

::v-deep .el-input,
::v-deep .el-textarea,
::v-deep .el-input-group {
  width: 476px;
}
::v-deep .el-form-item__content {
  text-align: left;
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

::v-deep .el-input.is-focus .el-input__inner {
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
::v-deep .el-input .el-input__count .el-input__count-inner {
  background-color: transparent;
}

.zdy-word-limit {
  height: 16px;
  line-height: 16px;
  color: #909399;
  background: transparent;
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 330px;
}

::v-deep .el-form-item__label {
  color: #9e9e9e;
}

::v-deep .el-input {
  outline: 1px solid #6062aa;
  border-radius: 2px;
}

::v-deep .el-textarea__inner {
  outline: 1px solid #6062aa;
  padding-left: 8px;
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
}

::v-deep .el-input__inner::placeholder {
  color: #757575;
}

::v-deep .el-input__inner {
  padding-left: 0px;
}

::v-deep .el-button--primary {
  padding: 8px;
  background: #745cd4;
  border-radius: 2px;
  border: 1px solid #745cd4;
  color: #fff;
  font-size: 14px;
  font-family: Inter4;
  width: 104px;
  height: 32px;
  cursor: pointer;
}

::v-deep .el-button--primary:active {
  background-color: #533fa1;
}

::v-deep .btn {
  .el-form-item__content {
    text-align: left;
  }
}
</style>
