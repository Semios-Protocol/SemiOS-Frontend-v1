import Vue from 'vue'
import dayjs from 'dayjs'
import { BigNumber } from 'bignumber.js'
Vue.filter('ellipsis', function ellipsis(val, sta = 2, end = 4) {
  if (!val) return ''
  if (val.length > sta + end) {
    return val.slice(0, sta) + '...' + val.slice(val.length - end, val.length)
  }
  return val
})
Vue.filter('hasHellipsis', function hasHellipsis(val, length) {
  if (!val) return ''
  let name = val.replace(new RegExp('_', 'g'), ' ')
  if (name.length > length) {
    return name.slice(0, length) + '...'
  } else {
    return name
  }
})

Vue.filter('timeFormatting', function timeFormatting(time, type = 0, ms = 0) {
  if (!time) return ''
  let utc = require('dayjs/plugin/utc')
  var timezone = require('dayjs/plugin/timezone')
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.guess()
  const MyString = new Date().toTimeString()
  const MyOffset = MyString.slice(9, 17)
  if (ms === 0) {
    if (type === 1) {
      return (
        dayjs(Number(time) * 1000).format('DD/MM/YYYY HH:mm:ss ') + MyOffset
      )
    } else {
      return dayjs(Number(time) * 1000).format('DD/MM/YYYY HH:mm:ss ')
    }
  } else {
    if (type === 1) {
      return dayjs(Number(time)).format('DD/MM/YYYY HH:mm:ss ') + MyOffset
    } else {
      return dayjs(Number(time)).format('DD/MM/YYYY HH:mm:ss ')
    }
  }
})
Vue.filter('dateFormat', function dateFormat(time, num = 1000) {
  if (!time) return ''
  let utc = require('dayjs/plugin/utc')
  var timezone = require('dayjs/plugin/timezone')
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.guess()
  return dayjs(Number(time) * num).format('DD/MM/YYYY')
})

Vue.filter('numFilter', function numFilter(num) {
  if (!Number(num) || Number(num) === 0) return 0

  const intPart = Math.trunc(num)
  const intPartFormat = intPart
    .toString()
    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  let floatPart = ''
  const valueArray = num.toString().split('.')
  if (valueArray.length === 2) {
    floatPart = valueArray[1]
    if (Number(floatPart) > 0) {
      return intPartFormat + '.' + floatPart
    } else {
      return intPartFormat
    }
  }
  return intPartFormat + floatPart
})

Vue.filter('numberFilter', function numberFilter(num) {
  if (!Number(num) || Number(num) === 0) return 0
  if (Number(num) >= 1000) {
    const a = Math.floor((Number(num) / 1000) * 10) / 10
    return a + 'k'
  } else {
    return num
  }
})
Vue.filter('royaltyFeeFilter', function numberFilter(num) {
  if (!Number(num) || Number(num) === 0) return 0
  return Number(num) * 100
})
Vue.filter('balanceFilter', function balanceFilter(val, num) {
  if (!Number(val) || Number(val) === 0) return 0
  const x = String(val).indexOf('.')
  if (x > 0) {
    const y = String(val).length - x - 1
    const a = new BigNumber(val).toFixed(num, 1)
    if (y >= num) {
      return Number(a).toLocaleString('en', { minimumFractionDigits: num })
    } else {
      return Number(a).toLocaleString()
    }
  } else {
    return Number(val).toLocaleString()
  }
})

Vue.filter('ethFilter', function ethFilter(val, num) {
  if (new BigNumber(val).lt(0.0001)) {
    return `0`
  } else {
    const x = String(val).indexOf('.')
    if (x > 0) {
      const y = String(val).length - x - 1
      const a = new BigNumber(val).toFixed(num)
      if (y >= num) {
        return Number(a).toLocaleString('en', { minimumFractionDigits: num })
      } else {
        return Number(a).toLocaleString()
      }
    } else {
      return Number(val).toLocaleString()
    }
  }
})

Vue.filter('ethFilter2', function ethFilter(val, num) {
  if (new BigNumber(val).lt(0.0001)) {
    return `--`
  } else {
    const x = String(val).indexOf('.')
    if (x > 0) {
      const y = String(val).length - x - 1
      const a = new BigNumber(val).toFixed(num)
      if (y >= num) {
        return Number(a).toLocaleString('en', { minimumFractionDigits: num })
      } else {
        return Number(a).toLocaleString()
      }
    } else {
      return Number(val).toLocaleString()
    }
  }
})
Vue.filter('claimTime', function claimTime(time, type = 1) {

  if (time > 0) {
    const timeNum = type === 1 ? time : Math.floor(time / 1000)
    const h = parseInt(timeNum / 60 / 60)
    const m = parseInt(timeNum / 60 - h * 60)
    const s = parseInt(timeNum - h * 60 * 60 - m * 60)
    return type === 1 ? h + ' hours:' + m + ' minutes:' + s + ' seconds' : h + ' Hours ' + m + ' Minutes'
  }
})
Vue.filter('numberToCurrencyNo', function numberToCurrencyNo(value) {
  if (!value) return '--'
  const intPart = Math.trunc(value)
  const intPartFormat = intPart
    .toString()
    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  let floatPart = ''
  const valueArray = value.toString().split('.')
  if (valueArray.length === 2) {
    floatPart = valueArray[1].toString()
    return intPartFormat + '.' + floatPart
  }
  return intPartFormat + floatPart
})

Vue.filter('formatThousand', function formatThousand(money) {
  if (money && Number(money) > 0) {
    let res = money.toString().replace(/\d+/, function (num) {
      return num.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
        return $1 + ','
      })
    })
    return res
  } else {
    return 0
  }
})

Vue.filter('bigNumFormat', function formatThousand(num, fix = 2, min = 0) {
  if (Number(num) === 0) {
    return 0
  }
  if (num && Number(num) > 0) {
    const fmt = {
      prefix: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    }
    if (new BigNumber(num).lt(min)) {
      return '< ' + min
    } else {
      return new BigNumber(new BigNumber(num).dp(fix)).toFormat(fmt)
    }
  } else {
    return ''
  }
})
Vue.filter('nameFilter', function nameFilter(val) {
  if (!val) return ''
  if (val.length > 25) {
    return val.slice(0, 25) + '...'
  }
  return val
})

Vue.filter('splitAddress', function splitAddress(val) {
  if (!val) return ''
  return val.slice(val.length - 4, val.length)
})
