let Network = '0x1'
let API_URL = ''
let OPEN_URL = ''
const SlipName = 'SemiosSlip'

const tokenTest = [
  { label: 'ETH', value: '0x0000000000000000000000000000000000000000' },
  { label: 'USDT', value: '0x8DcB348b9BB00De40D73aAe3188b39B6bf27d8f8' },
  { label: 'USDC', value: '0x9fcfceb7c2f7f6748c082a95bdd925f1702a8c3a' },
  { label: 'YT', value: '0x24e35945aDc8465fbF44A725D32C1Ad09678Efd4' },
  { label: 'Custom ERC-20 Input Token', value: '' },
]
const tokenMain = [
  { label: 'ETH', value: '0x0000000000000000000000000000000000000000' },
  { label: 'wstETH', value: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0' },
  { label: 'USDT', value: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  { label: 'USDC', value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { label: 'WBTC', value: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
  { label: 'BNB', value: '0xb8c77482e45f1f44de1745f52c74426c631bdd52' },
  { label: 'SHIB', value: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce' },
  { label: 'MATIC', value: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' },
  { label: 'PEPE', value: '0x6982508145454ce325ddbe47a25d4ec3d2311933' },
  { label: 'DAI', value: '0x6b175474e89094c44da98b954eedeac495271d0f' },
  { label: 'Custom ERC-20 Input Token', value: '' },
]
let TokenList = []
console.log(location.origin.indexOf('80'), 'location.origin location.origin ')
// if(location.origin.indexOf('semios'))
const indexNum = location.origin.indexOf('protodao')

const localName = 'SemiosConnectedWallets'
switch (process.env.VUE_APP_VERSION) {
  case 'mainnet':
    OPEN_URL = 'https://etherscan.io'
    Network = '0x1'
    API_URL =
      indexNum > -1
        ? 'https://test-api.protodao.io'
        : 'https://test-api.semios.io'
    TokenList = [...tokenMain]
    break
  case 'test':
    OPEN_URL = 'https://sepolia.etherscan.io'
    Network = '0xaa36a7'
    API_URL =
      indexNum > -1
        ? 'https://test-api.protodao.io'
        : 'https://test-api.semios.io'
    TokenList = [...tokenTest]
    break

  case 'dev':
    OPEN_URL = 'https://sepolia.etherscan.io'
    Network = '0xaa36a7'
    API_URL =
      indexNum > -1
        ? 'http://test-api.protodao.io'
        : 'http://test-api.semios.io'
    TokenList = [...tokenTest]
    break

  case 'demo':
    OPEN_URL = 'https://sepolia.etherscan.io'
    Network = '0xaa36a7'
    API_URL =
      indexNum > -1
        ? 'https://demo-api.protodao.io'
        : 'https://demo-api.semios.io'
    TokenList = [...tokenTest]
    break

  case 'prod':
    OPEN_URL = 'https://etherscan.io'
    Network = '0x1'
    API_URL =
      indexNum > -1 ? 'https://api.protodao.io' : 'https://api.semios.io'
    TokenList = [...tokenMain]
    break
}
export { API_URL, OPEN_URL, Network, localName, SlipName, TokenList }
