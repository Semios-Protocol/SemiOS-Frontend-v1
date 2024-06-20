import axios from 'axios'
import { API_URL } from '../config.js'
import { Notify } from 'vant'
import { Notification } from 'element-ui'
import router from '@/router/index'
import Vue from 'vue'
const service = axios.create({
  withCredentials: true, //
  // baseURL: '/api',
  baseURL: process.env.NODE_ENV === 'development' ? '' : API_URL,
  // headers: {
  // 	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  // },
  timeout: 600000,
})
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  async (response) => {
    if (response.data.resultCode === 300) {
      if (
        window.navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        window.navigator.userAgent.toLowerCase().indexOf('ios') > -1 ||
        window.navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        window.navigator.userAgent.toLowerCase().indexOf('iphone') > -1
      ) {
        Notify({
          message: response.data.resultDesc,
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 5000,
        })
      } else {
        Notification.error({
          position: 'bottom-right',
          dangerouslyUseHTMLString: true,
          title: response.data.resultDesc,
          offset: 10,
          duration: 5000,
          message: '',
        })
      }

      return false
    }
    if (response.data.resultCode === 404) {
      if (
        window.navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        window.navigator.userAgent.toLowerCase().indexOf('ios') > -1 ||
        window.navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        window.navigator.userAgent.toLowerCase().indexOf('iphone') > -1
      ) {
        Notify({
          message: response.data.resultDesc,
          color: '#F0F0F0',
          background: '#745CD4',
          duration: 5000,
        })
      } else {
        Notification.error({
          position: 'bottom-right',
          dangerouslyUseHTMLString: true,
          title: response.data.resultDesc,
          offset: 10,
          duration: 5000,
          message: '',
        })
      }

      router.push({ path: '/' })
      return false
    }
    if (response.data.resultCode === 402) {
      const [primaryWallet] = Vue.prototype.$onboard.state.get().wallets
      if (primaryWallet) {
        await Vue.prototype.$onboard.disconnectWallet({
          label: primaryWallet.label,
        })
      }
      router.push({ path: '/' })
      return false
    }
    return response.data
  },
  (error) => {
    console.log(error)
    if (
      window.navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
      window.navigator.userAgent.toLowerCase().indexOf('ios') > -1 ||
      window.navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
      window.navigator.userAgent.toLowerCase().indexOf('iphone') > -1
    ) {
      Notify({
        message: 'Network connection failed, please try again later.',
        color: '#F0F0F0',
        background: '#745CD4',
        duration: 5000,
      })
    } else {
      Notification.error({
        position: 'bottom-right',
        dangerouslyUseHTMLString: true,
        title: 'Network connection failed, please try again later.',
        offset: 10,
        duration: 5000,
        message: '',
      })
    }

    return false
  }
)
export { service }
