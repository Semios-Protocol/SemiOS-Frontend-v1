<template>
  <div class="bing-box">
    <el-dialog
      title="Lock"
      :visible.sync="isLockDialog"
      :before-close="close"
      :close-on-click-modal="false"
      width="486px"
    >
      <div class="dialog-box">
        <el-form
          label-position="right"
          label-width="120px"
          ref="formDataRef"
          :rules="formDataRules"
          :model="formData"
          @submit.native.prevent
        >
          <el-form-item label="Lock Duration :" prop="time">
            <el-input
              v-model="formData.time"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              placeholder="Please input your lock duration"
            >
              <span slot="suffix">Hours</span>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="setDialog"
          style="width: 100%; margin: 0"
          >Add</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { workLockDuration } from '@/common/api'

export default {
  data() {
    return {
      formData: { time: null },
      formDataRules: {
        time: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            if (!value) {
              return callback(new Error('This field is required'))
            }
            if (Number(value) > 720) {
              return callback(new Error(`The maximum input time is 720 hours.`))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
    }
  },
  props: {
    isLockDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('setLockDialog', false)
    },
    setDialog() {
      console.log(this.$refs.formDataRef, 'console.log(this.$refs.formData)')
      this.$refs.formDataRef.validate(async (valid) => {
        if (valid) {
          const timeData = await workLockDuration({
            hours: this.formData.time,
          })
          console.log(timeData, 'timeData')
          this.$emit('setLockDialogObj', timeData.data.durationBlock)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
