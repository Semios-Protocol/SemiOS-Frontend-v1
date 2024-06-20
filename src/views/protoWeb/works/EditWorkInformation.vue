<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="box-edit" v-else>
    <div class="body-title">{{ $t('workDetail.editNameLabel') }}</div>
    <div class="divider">
      <div class="divider-text">{{ $t('workDetail.basicParameterLabel') }}</div>
      <div class="divider-lint"></div>
    </div>
    <div class="body-box">
      <div class="box-form">
        <el-form ref="form" :model="formData">
          <el-form-item
            label="Work Description :"
            v-if="formData.workStatus === 0"
          >
            <el-input
              type="textarea"
              v-model="formData.workDescription"
              :rows="3"
              maxlength="5000"
              placeholder="Please enter your work description，Markdown syntax is supported."
            ></el-input>
          </el-form-item>
          <el-form-item label="Social Connections :"> </el-form-item>
          <div class="nametitle" style="width: 146px">name</div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="names">Opensea</div>
            </el-col>
            <el-col :span="18">
              <div>
                <el-form-item>
                  <el-input
                    v-model="formData.openseaLink"
                    placeholder="category/collectibles"
                  >
                    <template slot="prepend">
                      <div class="prepend">
                        <svg-icon icon-class="openseaio" class="big-icon" />
                        <div class="input-prefix">https://opensea.io/</div>
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="names">Telegram</div>
            </el-col>
            <el-col :span="18">
              <div>
                <el-form-item>
                  <el-input v-model="formData.discordLink" placeholder="abcdef">
                    <template slot="prepend">
                      <div class="prepend">
                        <svg-icon icon-class="telegramzi" class="big-icon" />
                        <div class="input-prefix">https://t.me/</div>
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="names">Twitter</div>
            </el-col>
            <el-col :span="18">
              <div>
                <el-form-item>
                  <el-input v-model="formData.twitterLink" placeholder="abcdef">
                    <template slot="prepend">
                      <div class="prepend">
                        <svg-icon icon-class="twitterio" class="big-icon" />
                        <div class="input-prefix">https://twitter.com/</div>
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row
            :gutter="20"
            v-for="(item, idx) in connectionsList"
            :key="'a' + idx"
          >
            <el-col :span="6">
              <div class="names">
                <el-form-item>
                  <el-input
                    v-model="item.name"
                    placeholder="Link"
                    maxlength="8"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="18">
              <div>
                <el-form-item>
                  <el-input v-model="item.link" placeholder="abcdef">
                    <template slot="prepend">
                      <div class="prepend">
                        <svg-icon icon-class="openlink" class="big-icon" />
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="btns">
          <button class="elbtns-b" style="margin-left: 155px" @click="goBack">
            Back
          </button>
          <button
            class="elbtns-l"
            style="margin-left: 20px"
            v-preventReClick
            @click="setWork"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workEditDetail, workEdit } from '@/common/api'
import { mapState } from 'vuex'
import Loading from '@/components/Loading.vue'
export default {
  components: { Loading },
  data() {
    return {
      formData: {
        workDescription: '',
        twitterLink: '',
        discordLink: '',
        openseaLink: '',
      },
      dialogSuccsess: false,
      isSumbit: true,
      connectionsList: [
        { name: '', link: '' },
        { name: '', link: '' },
        { name: '', link: '' },
      ],
      isLoading: true,
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
    goBack() {
      this.$router.back(-1)
    },
    close() {
      this.dialogSuccsess = false
    },
    async setWork() {
      const sig = await this.getSig()
      if (sig) {
        console.log(this.connectionsList, 'this.connectionsList')
        this.formData.socialLinks = this.connectionsList.map((item) => {
          if (item.name === '') {
            return {
              name: 'Link',
              link: item.link,
            }
          } else {
            return {
              ...item,
            }
          }
        })
        console.log(this.formData.socialLinks, ' this.formData.socialLinks')
        const res = await workEdit(this.formData)
        if (res) {
          this.getData()
          this.successNotif('Updated')
        }
      }
    },
    async getData() {
      const data = await workEditDetail({ workId: this.$route.query.id })
      this.formData = data.data
      if (
        this.formData.ownerAddress &&
        this.formData.ownerAddress === this.MetaMaskAddress
      ) {
        this.connectionsList = this.formData.socialLinks
        this.isLoading = false
      } else {
        this.$router.push({
          path: '/',
        })
      }
    },
  },
}
</script>
<style scoped lang="scss">
.box-edit {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.body-box {
  padding: 24px;
  max-width: 1024px;
  box-sizing: border-box;
  margin: 0 auto;
  font-family: Roboto4;
  height: 100%;

  .box-form {
    width: 645px;
    margin: auto;
  }
}

.body-title {
  height: 80px;
  border-bottom: 1px solid #6062aa;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
  color: #bbbaba;
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
    width: 155px;
    text-align: center;
  }

  .divider-lint {
    background-color: #6062aa;
    height: 1px;
    flex: 1;
    margin: auto;
  }
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

::v-deep .el-input__inner::placeholder {
  color: #757575;
}

::v-deep .el-input__inner {
  padding-left: 0px;
}

.prepend {
  display: flex;
  align-items: center;
}

.input-prefix {
  display: inline;
  vertical-align: middle;
}
.big-icon {
  width: 28px;
  height: 28px;
  margin: 6px;
}
.btns {
  display: flex;
}
.names {
  height: 40px;
  width: 100%;
  outline: 1px solid #6062aa;
  border-radius: 2px;
  text-align: center;
  line-height: 40px;
  color: #909399;
  ::v-deep .el-input__inner {
    text-align: center;
  }
}
.nametitle {
  width: 146px;
  color: #9e9e9e;
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
  margin-top: -24px;
}
</style>
ww
