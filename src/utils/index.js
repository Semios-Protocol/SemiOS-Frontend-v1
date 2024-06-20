import _ from 'lodash'
import { BigNumber } from 'bignumber.js'

const copys = (hash, thit, message = 'Link copied!') => {
  const oInput = document.createElement('input')
  oInput.value = hash
  document.body.appendChild(oInput)
  oInput.select()
  document.execCommand('Copy')
  oInput.className = 'oInput'
  oInput.style.display = 'none'
  document.body.removeChild(oInput)
  thit.$notify({
    position: 'bottom-right',
    dangerouslyUseHTMLString: true,
    title: message,
    type: 'success',
    offset: 10,
    duration: 5000,
    customClass: 'successcolor',
    message: '',
  })
}
const copysPro = (hash) => {
  const oInput = document.createElement('input')
  oInput.value = hash
  document.body.appendChild(oInput)
  oInput.select()
  document.execCommand('Copy')
  oInput.className = 'oInput'
  oInput.style.display = 'none'
  document.body.removeChild(oInput)
}
const downloadJson = function (name, json) {
  const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(json)
  const a = document.createElement('a')
  const event = new MouseEvent('click')
  a.download = name
  a.href = uri
  a.dispatchEvent(event)
}
const randomCoding = function (num) {
  var arr = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
  ]
  var idvalue = ''
  for (var i = 0; i < num; i++) {
    idvalue += arr[Math.floor(Math.random() * 36)]
  }
  return idvalue
}
//转二维
const arrConversion = (val) => {
  return val ? val.map(item => [item]) : [];
}
//替换字符串
const replaceAllStr = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace)
}
const whitelistFiltre = (value, arr = []) => {
  const normalizedValue = value.join(',').replace(/[(\r\n)\r\n，\s]+/g, ',');
  const maxArr = arr.map(item => item.slice(0, 2) === '0x' ? _.toLower(item) : '0x' + _.toLower(item));
  const arrList = normalizedValue.split(',').filter(item => item !== '').map(ele => ele.slice(0, 2) === '0x' ? ele : '0x' + ele);
  const dataList = [...arrList, ...maxArr];
  return _.orderBy(_.uniq(dataList));
}
// const whitelistFiltre = (value, arr = []) => {
//   const valstr = value.join()
//   const str = replaceAllStr(
//     replaceAllStr(replaceAllStr(valstr, /[(\r\n)\r\n]+/, ','), '，', ','),
//     ' ',
//     ','
//   )
//   const maxArr = arr.map((item) => {
//     return item.slice(0, 2) === '0x' ? _.toLower(item) : '0x' + _.toLower(item)
//   })
//   const arrList = _.toLower(str)
//     .split(',')
//     .filter((item) => item !== '')
//     .map((ele) => {
//       return ele.slice(0, 2) === '0x' ? ele : '0x' + ele
//     })
//   const dataList = [...arrList, ...maxArr]
//   return _.orderBy(_.uniq(dataList))
//   // return _.uniq(arrList);
// }
const isArrEqual = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele))
}
const isErcEq = (arr1, arr2) => {
  const arr1toLower = arr1.map((item) =>
    _.toLower(item).slice(0, 2) === '0x'
      ? _.toLower(item)
      : '0x' + _.toLower(item)
  )
  const arr2toLower = arr2.map((item) =>
    _.toLower(item).slice(0, 2) === '0x'
      ? _.toLower(item)
      : '0x' + _.toLower(item)
  )
  return _.isEqual(_.sortBy(arr1toLower), _.sortBy(arr2toLower))
}

const numToFormat = (val) => {
  const num = parseInt(val)
  const numLength = num.toString().length
  if (numLength > 1) {
    const a = num.toString().slice(0, 1)
    const b = Number(a) + 1
    const c = b * `1e${numLength - 1}`
    return c
  } else {
    return Number(num) + 1
  }
}
const numToFilter = (val) => {
  if (val && Number(val) > 0) {
    if (Number(val) >= 1) {
      const num = numToFormat(val)
      return num
    } else {
      const nums = val.toString().split('.')
      const numLength = nums[1].length
      const num = numToFormat(nums[1])
      const c = num / `1e${numLength}`
      return c
    }
  } else {
    return
  }
}
const numRounding = (val) => {
  const math = Math.abs(val)
  const num = numToFormat(math)
  if (num < 10) {
    return 10
  } else {
    return num
  }
}

const formatThousand = (money) => {
  let res = money.toString().replace(/\d+/, function (num) {
    return num.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ','
    })
  })
  return res
}
const bigNumFormat = (num, fix = 2, min = 0) => {
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
    // return "";
    const fmt = {
      prefix: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    }
    return new BigNumber(new BigNumber(num).dp(fix)).toFormat(fmt)
  }
}

const itemCompare = (item, type = 0, num = 0) => {
  if (type === 0) {
    return item > num
  }
  if (type === 1) {
    return item >= num
  }

  if (type === 2) {
    return item < num
  }
  if (type === 3) {
    return item <= num
  }
  if (type === 4) {
    return item === num
  }
}
const countdown = (time) => {
  const timeObj = {
    h: 0,
    s: 0,
    m: 0,
  }
  const minutes = Math.floor(time / 60) //分钟
  timeObj.s = time % 60 //秒
  timeObj.h = minutes > 60 ? Math.floor(minutes / 60) : 0
  timeObj.m = minutes > 60 ? minutes % 60 : minutes
  return timeObj
}

const truncateString = (str) => {
  if (str.length > 5) {
    return str.substring(0, 2) + "..." + str.substring(str.length - 3);
  } else {
    return str;
  }
}
export {
  copys,
  downloadJson,
  randomCoding,
  arrConversion,
  replaceAllStr,
  whitelistFiltre,
  isArrEqual,
  isErcEq,
  numToFormat,
  numToFilter,
  numRounding,
  formatThousand,
  bigNumFormat,
  copysPro,
  itemCompare,
  countdown,
  truncateString
}
