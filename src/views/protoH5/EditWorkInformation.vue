<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="info-box" v-else>
    <van-nav-bar
      title="Edit Work Information"
      left-arrow
      @click-left="onClickLeft"
    />
    <p class="field-lable" v-if="formData.workStatus === 0">Work description</p>
    <van-field
      v-if="formData.workStatus === 0"
      v-model="formData.workDescription"
      rows="3"
      autosize
      type="textarea"
      maxlength="5000"
      placeholder="To upload work in other formats like text, audio or video, simply add a link of your work in the description. (Markdown syntax is supported)"
      show-word-limit
      @focus="isSumbit = false"
      @blur="isSumbit = true"
    />
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
        @click="setWork"
        style="width: 100%"
        safe-area-inset-bottom
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
        Information successfully edited! Your changes have been saved
      </p>
      <!-- <div class="flex-btn">
        <van-button color="#745CD4" style="width: 100%" @click="close"
          >OK</van-button
        >
      </div> -->
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
import { workEditDetail, workEdit } from "@/common/api";
import { mapState } from "vuex";
import Loading from "@/components/Loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      formData: {
        workDescription: "",
        twitterLink: "",
        discordLink: "",
        openseaLink: "",
      },
      dialogSuccsess: false,
      isSumbit: true,
      dialogLoading: false,
      connectionsList: ["", "", ""],
      isLoading: true,
    };
  },
  computed: {
    ...mapState(["MetaMaskAddress", "User"]),
  },
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    close() {
      this.dialogSuccsess = false;
    },
    async setWork() {
      this.dialogLoading = true;
      const sig = await this.getSig(1);
      if (sig) {
        this.formData.socialLinks = this.connectionsList
          .filter((item) => item !== "")
          .join(",");
        const res = await workEdit(this.formData);
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
      const data = await workEditDetail({ workId: this.$route.query.id });
      this.formData = data.data;
      if (
        this.formData.ownerAddress &&
        this.formData.ownerAddress === this.MetaMaskAddress
      ) {
        this.connectionsList = this.formData.socialLinks;
        this.isLoading = false;
      } else {
        this.$router.push({
          path: "/",
        });
      }
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
.line-body {
  margin: 20px 0;
}
::v-deep .van-field__control:disabled {
  color: #f3f3f3;
  caret-color: #f3f3f3;
  background-color: transparent;
  opacity: 1;
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
