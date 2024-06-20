import blocknativeLogo from '../../icons/blocknative-logo'
import blocknativeIcon from '../../icons/blocknative-icon'
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'

const dappId = '17292f6a-f7de-4ea0-8042-2db6915a118a'
const INFURA_ID = '9aa3d95b3bc440fa88ea12eaa4456161'
const injected = injectedModule()
// const walletConnect = walletConnectModule(INFURA_ID)
const wcV2InitOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: '5e889a9c4b11e81972ea19a6f8bc6faa',
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains:
    process.env.VUE_APP_VERSION === 'prod' ||
    process.env.VUE_APP_VERSION === 'mainnet'
      ? [1]
      : [11155111],
}
const walletConnect = walletConnectModule(wcV2InitOptions)
const initWeb3Onboard = Onboard({
  theme: 'dark',
  wallets: [injected, walletConnect],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label:
        process.env.VUE_APP_VERSION === 'mainnet' ? 'Mainnet Fork' : 'Ethereum',
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    },
    // {
    //   id: "0x3",
    //   token: "ETH",
    //   label: "Ropsten",
    //   rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    // },
    // {
    //   id: "0x4",
    //   token: "ETH",
    //   label: "Rinkeby",
    //   rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    // },
    {
      id: '0xaa36a7',
      token: 'ETH',
      label: 'Sepolia',
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/6vQXmMfxbylstrexr8hoppysVErvxiVb`,
    },
    // {
    //   id: '11155111',
    //   token: 'ETH',
    //   label: 'Sepolia',
    //   rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/6vQXmMfxbylstrexr8hoppysVErvxiVb`,
    // },
  ],
  apiKey: dappId, // get this for free at https://explorer.blocknative.com/?signup=true
  appMetadata: {
    name: 'Semios, an innovative Web3 Flexible Tokenomics LEGO',
    icon: blocknativeIcon,
    logo: blocknativeLogo,
    description: 'an innovative Web3 Flexible Tokenomics LEGO',
    explore: 'https://semios.io',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
  },
  accountCenter: {
    desktop: {
      position: 'bottomRight',
      enabled: false,
      minimal: false,
    },
    mobile: {
      position: 'bottomRight',
      enabled: false,
      minimal: false,
    },
  },
  notify: {
    enabled: false, // default: true
    transactionHandler: (transaction) => {
      if (transaction) {
        return {
          // autoDismiss set to zero will persist the notification until the user excuses it
          autoDismiss: 0,
        }
      }
    },
  },
  connect: { autoConnectLastWallet: true, removeWhereIsMyWalletWarning: true },
  disableFontDownload: true,
})
export { initWeb3Onboard }
