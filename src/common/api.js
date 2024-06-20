import { service } from '../utils/Fetch'
import Vue from 'vue'
import { localName } from '@/config.js'

const isLogOut = async () => {
  const cookies = document.cookie.split('; ')
  let json = {}
  if (cookies && cookies.length > 0 && cookies[0] !== '') {
    for (let i = 0; i < cookies.length; i++) {
      let data = cookies[i].split('=')
      json[data[0]] = data[1]
    }
  }

  const ProtoDAOConnectedWallets = JSON.parse(
    window.localStorage.getItem(localName)
  )
  if (json.user && json.address) {
    const address =
      ProtoDAOConnectedWallets && ProtoDAOConnectedWallets.length > 0
        ? ProtoDAOConnectedWallets[0].address
        : ''
    if (
      json.address.toLowerCase() !== json.user.toLowerCase() ||
      address.toLowerCase() !== json.address.toLowerCase()
    ) {
      const [primaryWallet] = Vue.prototype.$onboard.state.get().wallets
      if (primaryWallet) {
        await Vue.prototype.$onboard.disconnectWallet({
          label: primaryWallet.label,
        })
      }
      window.localStorage.setItem(localName, JSON.stringify([]))
      logout()
      return false
    } else {
      return true
    }
  } else {
    return true
  }
  // return true
}
const loginAuth = (address) => {
  return service({
    url: `/api/user/login`,
    method: 'POST',
    data: { userAddress: address },
  })
}
const logout = () => {
  return service({
    url: `/api/user/logout`,
    method: 'POST',
    data: {},
  })
}
const contractAbi = async () => {
  await isLogOut()
  return service({
    url: `/api/contract/abi`,
    method: 'POST',
  })
}
const signature = async (data) => {
  await isLogOut()
  return service({
    url: `/api/user/signature`,
    method: 'POST',
    data: data,
  })
}

const cookieInfo = async () => {
  await isLogOut()
  return service({
    url: `/api/user/cookie/info`,
    method: 'POST',
    data: {},
  })
}
const basicDaoCerate = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/basic/create`,
    method: 'POST',
    data: data,
  })
}

const daoTransactionHash = async (data) => {
  return service({
    url: `/api/dao/transaction/hash`,
    method: 'POST',
    data: data,
  })
}
const daoListProtodao = async () => {
  return service({
    url: `/api/dao/list/protodao`,
    method: 'POST',
  })
}
const daoProtodaoMember = async () => {
  return service({
    url: `/api/dao/protodao/member`,
    method: 'POST',
  })
}
const daoDetail = async (data) => {
  return service({
    url: `/api/dao/detail `,
    method: 'POST',
    data: data,
  })
}
const daoUnmintedWorks = async (data) => {
  return service({
    url: `/api/dao/unmintedWorks `,
    method: 'POST',
    data: data,
  })
}
const daoDrbNfts = async (data) => {
  return service({
    url: `/api/dao/drbNfts `,
    method: 'POST',
    data: data,
  })
}
const daoNfts = async (data) => {
  return service({
    url: `/api/dao/nfts `,
    method: 'POST',
    data: data,
  })
}
const daoEditDetail = async (data) => {
  return service({
    url: `/api/dao/edit/detail`,
    method: 'POST',
    data: data,
  })
}
const distribute = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/benefits/distribute`,
    method: 'POST',
    data: data,
  })
}
const daoEdit = async (data) => {
  await isLogOut()
  let format = new FormData()
  if (Object.prototype.toString.call(data.daoLogo) === '[object File]') {
    format.append('daoLogo', data.daoLogo)
  }
  if (Object.prototype.toString.call(data.daoBgBanner) === '[object File]') {
    format.append('daoBgBanner', data.daoBgBanner)
  }
  format.append('daoId', data.daoId)
  format.append('daoName', data.daoName)
  format.append('daoManitesto', data.daoManitesto)
  format.append('daoDescription', data.daoDescription)
  if (data.openseaLink) {
    const discordLink = data.openseaLink.replace(
      new RegExp('https://opensea.io/'),
      ''
    )
    format.append('openseaLink', discordLink)
  } else {
    format.append('openseaLink', '')
  }
  if (data.discordLink) {
    const discordLink = data.discordLink.replace(
      new RegExp('https://t.me/'),
      ''
    )
    format.append('discordLink', discordLink)
  } else {
    format.append('discordLink', '')
  }
  if (data.twitterLink) {
    const twitterLink = data.twitterLink.replace(
      new RegExp('https://twitter.com/'),
      ''
    )
    format.append('twitterLink', twitterLink)
  } else {
    format.append('twitterLink', '')
  }
  format.append('socialLinks', data.socialLinks)
  console.log(format, 'formatformatformatformatformatformat')
  return service({
    url: `/api/dao/edit`,
    method: 'POST',
    data: format,
  })
}

const walletReceived = async () => {
  return service({
    url: `/api/user/income/wallet/received`,
    method: 'POST',
    data: {},
  })
}

const walletUnclaimed = async () => {
  return service({
    url: `/api/user/income/wallet/unclaimed`,
    method: 'POST',
    data: {},
  })
}
const createWorkInfo = async (data) => {
  return service({
    url: `/api/dao/createWork/info`,
    method: 'POST',
    data: data,
  })
}

const workCreate = async (data) => {
  await isLogOut()
  let format = new FormData()
  if (Object.prototype.toString.call(data.image) === '[object File]') {
    format.append('image', data.image)
  }
  format.append('daoId', data.daoId)
  format.append('canvasId', data.canvasId)
  format.append('createSignHash', data.createSignHash)
  format.append('workDescription', data.workDescription)
  format.append('workUriRandom', data.workUriRandom)
  format.append('priceType', data.priceType)
  format.append('fixedPrice', data.fixedPrice)

  return service({
    url: `/api/work/protoDao/create`,
    method: 'POST',
    data: format,
  })
}

const workDetail = async (id) => {
  return service({
    url: `/api/work/detail`,
    method: 'POST',
    data: { workId: id },
  })
}

const canvasExists = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/canvas/exists`,
    method: 'POST',
    data: data,
  })
}
const userAuthority = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/protodao/authority`,
    method: 'POST',
    data: data,
  })
}

const workHold = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/hold`,
    method: 'POST',
    data: data,
  })
}
const workAuthority = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/user/authority`,
    method: 'POST',
    data: data,
  })
}
const daoMerkle = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/blackandwhite/merkle`,
    method: 'POST',
    data: data,
  })
}

const workCreator = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/creator`,
    method: 'POST',
    data: data,
  })
}
const workEditDetail = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/edit/detail `,
    method: 'POST',
    data: data,
  })
}
const workEdit = async (data) => {
  const req = { ...data }
  await isLogOut()
  if (data.openseaLink) {
    const openseaLink = data.openseaLink.replace(
      new RegExp('https://opensea.io/'),
      ''
    )
    req.openseaLink = openseaLink
  } else {
    req.openseaLink = ''
  }
  if (data.discordLink) {
    const discordLink = data.discordLink.replace(
      new RegExp('https://t.me/'),
      ''
    )
    req.discordLink = discordLink
  } else {
    req.discordLink = ''
  }
  if (data.twitterLink) {
    const twitterLink = data.twitterLink.replace(
      new RegExp('https://twitter.com/'),
      ''
    )
    req.twitterLink = twitterLink
  } else {
    req.twitterLink = ''
  }
  return service({
    url: `/api/work/edit `,
    method: 'POST',
    data: req,
  })
}
const myDaoList = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/mydao`,
    method: 'POST',
    data: data,
  })
}

const whitelistProof = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/whitelist/proof`,
    method: 'POST',
    data: data,
  })
}

const blackandwhiteList = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/blackandwhite/list`,
    method: 'POST',
    data: data,
  })
}
const protodAoupgrade = async () => {
  await isLogOut()
  return service({
    url: `/api/protodao/upgrade`,
    method: 'POST',
    data: {},
  })
}
const upgradeFlow = async (data) => {
  await isLogOut()
  return service({
    url: `/api/protodao/upgrade/flow`,
    method: 'POST',
    data: data,
  })
}
const protodaoRelated = async (data) => {
  await isLogOut()
  return service({
    url: `/api/protodao/related`,
    method: 'POST',
    data: data,
  })
}

const daoActivity = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/activity`,
    method: 'POST',
    data: data,
  })
}
const analyticsStatistics = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/statistics`,
    method: 'POST',
    data: data,
  })
}

const analyticsMintScatterPlot = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/mintScatterPlot`,
    method: 'POST',
    data: data,
  })
}
const analyticsNftOwnersQuantity = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/nftOwnersQuantity`,
    method: 'POST',
    data: data,
  })
}
const analyticsAveragePrice = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/volume/averagePrice`,
    method: 'POST',
    data: data,
  })
}
const analyticsNftTopOwners = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/nftTopOwners`,
    method: 'POST',
    data: data,
  })
}
const analyticsPriceRange = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/priceRange`,
    method: 'POST',
    data: data,
  })
}
const analyticsOwnerDistribution = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/analytics/ownerDistribution`,
    method: 'POST',
    data: data,
  })
}

const daoRankings = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/rankings`,
    method: 'POST',
    data: data,
  })
}
const nftsRankings = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/rankings/nfts`,
    method: 'POST',
    data: data,
  })
}
const drbInfo = async () => {
  await isLogOut()
  return service({
    url: `/api/common/drb/info`,
    method: 'POST',
  })
}
const searchAmount = async (query) => {
  return service({
    url: `/api/search/amount`,
    method: 'POST',
    data: { searchWord: query },
  })
}
const searchWorks = async (query, num = null) => {
  return service({
    url: `/api/search/works`,
    method: 'POST',
    data: { searchWord: query, number: num },
  })
}
const searchDaos = async (query, num = null) => {
  return service({
    url: `/api/search/daos`,
    method: 'POST',
    data: { searchWord: query, number: num },
  })
}

const searchSeedNodes = async (query, num = null) => {
  return service({
    url: `/api/search/seedNodes`,
    method: 'POST',
    data: { searchWord: query, number: num },
  })
}
const favoriteActions = async (data) => {
  await isLogOut()
  return service({
    url: `/api/favorite/actions`,
    method: 'POST',
    data: data,
  })
}
const favoriteCancel = async (data) => {
  await isLogOut()
  return service({
    url: `/api/favorite/cancel`,
    method: 'POST',
    data: data,
  })
}

const daoCollections = async (data) => {
  return service({
    url: `/api/dao/collections`,
    method: 'POST',
    data: data,
  })
}

const seedNodesCollections = async (data) => {
  return service({
    url: `/api/dao/seedNodes`,
    method: 'POST',
    data: data,
  })
}
const workExploreUnmitedWorks = async (data) => {
  return service({
    url: `/api/work/explore/unmintedWorks`,
    method: 'POST',
    data: data,
  })
}
const workExploreNfts = async (data) => {
  return service({
    url: `/api/work/explore/nfts`,
    method: 'POST',
    data: data,
  })
}
const workDaoList = async () => {
  await isLogOut()
  return service({
    url: `/api/dao/list/createWork`,
    method: 'POST',
    data: {},
  })
}
const workCanvasInfo = async (id) => {
  await isLogOut()
  return service({
    url: `/api/canvas/createWork/info`,
    method: 'POST',
    data: { canId: id },
  })
}
const workMinted = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/minted`,
    method: 'POST',
    data: data,
  })
}
const favoriteWork = async (data) => {
  await isLogOut()
  return service({
    url: `/api/favorite/work`,
    method: 'POST',
    data: data,
  })
}
const favoriteDao = async (data) => {
  await isLogOut()
  return service({
    url: `/api/favorite/dao`,
    method: 'POST',
    data: data,
  })
}

const userProfileSave = async (data) => {
  await isLogOut()
  let format = new FormData()
  format.append('userName', data.userName)
  format.append('introduction', data.introduction)
  format.append('avatar', data.avatar)
  if (data.openseaLink) {
    const openseaLink = data.openseaLink.replace(
      new RegExp('https://opensea.io/'),
      ''
    )
    format.append('openseaLink', openseaLink)
  } else {
    format.append('openseaLink', '')
  }
  if (data.discordLink) {
    const discordLink = data.discordLink.replace(
      new RegExp('https://t.me/'),
      ''
    )
    format.append('discordLink', discordLink)
  } else {
    format.append('discordLink', '')
  }
  if (data.twitterLink) {
    const twitterLink = data.twitterLink.replace(
      new RegExp('https://twitter.com/'),
      ''
    )
    format.append('twitterLink', twitterLink)
  } else {
    format.append('twitterLink', '')
  }

  return service({
    url: `/api/user/profile/save`,
    method: 'POST',
    data: format,
  })
}
const userProfileInfo = async () => {
  await isLogOut()
  return service({
    url: `/api/user/profile/info`,
    method: 'POST',
    data: {},
  })
}

const walletDao = async () => {
  await isLogOut()
  return service({
    url: `/api/user/income/wallet/dao`,
    method: 'POST',
    data: {},
  })
}
const checkName = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/name/check`,
    method: 'POST',
    data: data,
  })
}
const deleteWorks = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/delete`,
    method: 'POST',
    data: data,
  })
}
const favoriteWorkUser = async (data) => {
  await isLogOut()
  return service({
    url: `/api/work/favorite/user`,
    method: 'POST',
    data: data,
  })
}
const daoTimes = async () => {
  return service({
    url: `/api/dao/times`,
    method: 'POST',
  })
}

const createDao = async (data) => {
  await isLogOut()
  return service({
    url: `/api/dao/basic/create`,
    method: 'POST',
    data: data,
  })
}

const maincreator = async (data) => {
  return service({
    url: `/api/dao/maincreator`,
    method: 'POST',
    data: data,
  })
}
const allcationList = async (data) => {
  return service({
    url: `/api/dao/allcation/list`,
    method: 'POST',
    data: data,
  })
}

const userTopupBalance = async () => {
  await isLogOut()
  return service({
    url: `/api/user/topup/balance`,
    method: 'POST',
    data: {},
  })
}
const topupEthbalance = async (data) => {
  return service({
    url: `/api/dao/topup/ethbalance`,
    method: 'POST',
    data: data,
  })
}
const daoAllocation = async (data) => {
  return service({
    url: `/api/dao/allocation`,
    method: 'POST',
    data: data,
  })
}
const allocationInfo = async (data) => {
  return service({
    url: `/api/dao/analytics/allocation/info`,
    method: 'POST',
    data: data,
  })
}

const merkleWork = async (data) => {
  return service({
    url: `/api/dao/blackandwhite/merkle/work`,
    method: 'POST',
    data: data,
  })
}

const analyticsAssetPoolEth = async (data) => {
  return service({
    url: `/api/dao/analytics/assetpool/eth`,
    method: 'POST',
    data: data,
  })
}
const analyticsAssetPoolToken = async (data) => {
  return service({
    url: `/api/dao/analytics/assetpool/token`,
    method: 'POST',
    data: data,
  })
}
const analyticsDetail = async (data) => {
  return service({
    url: `/api/dao/analytics/detail/v2`,
    method: 'POST',
    data: data,
  })
}

const togetherDaoMember = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/member`,
    method: 'POST',
    data: data,
  })
}

const togetherDaoAmount = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/amount`,
    method: 'POST',
    data: data,
  })
}

const togetherDaoToken = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/token`,
    method: 'POST',
    data: data,
  })
}
const togetherDaoMaker = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/maker`,
    method: 'POST',
    data: data,
  })
}

const togetherDaoInfo = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/info`,
    method: 'POST',
    data: data,
  })
}
const togetherDaoList = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/list`,
    method: 'POST',
    data: data,
  })
}
const togetherPlanList = async (data) => {
  return service({
    url: `/api/plan/together/list`,
    method: 'POST',
    data: data,
  })
}
const togetherPlanBasicInfo = async (data) => {
  return service({
    url: `/api/plan/basic/info`,
    method: 'POST',
    data: data,
  })
}

const togetherTreasury = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/treasury`,
    method: 'POST',
    data: data,
  })
}
const togetherPlan = async (data) => {
  return service({
    url: `/api/plan/together/tap`,
    method: 'POST',
    data: data,
  })
}

const workDetailNft = async (data) => {
  return service({
    url: `/api/work/detail/nft`,
    method: 'POST',
    data: data,
  })
}
const workLockDuration = async (data) => {
  return service({
    url: `/api/work/lock/duration`,
    method: 'POST',
    data: data,
  })
}
const workMintTopUp = async (data) => {
  return service({
    url: `/api/work/mint/topup`,
    method: 'POST',
    data: data,
  })
}
const workMintUnTopUp = async (data) => {
  return service({
    url: `/api/work/mint/unTopup`,
    method: 'POST',
    data: data,
  })
}

const userTopupBalanceDetails = async (data) => {
  return service({
    url: `/api/user/topup/balance/details`,
    method: 'POST',
    data: data,
  })
}

const togetherDaoMakerList = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/maker/list`,
    method: 'POST',
    data: data,
  })
}
const treasuryInfo = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/treasury/info`,
    method: 'POST',
    data: data,
  })
}
const treasuryTransaction = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/treasury/transaction`,
    method: 'POST',
    data: data,
  })
}
const treasuryList = async (data) => {
  return service({
    url: `/api/dao/analytics/togetherDao/treasury/list`,
    method: 'POST',
    data: data,
  })
}
const createPlanParam = async (data) => {
  return service({
    url: `/api/plan/create/param`,
    method: 'POST',
    data: data,
  })
}

const topupBalancePending = async () => {
  return service({
    url: `/api/user/topup/balance/pending`,
    method: 'POST',
    data: {},
  })
}
const topupBalancePendingDetail = async (data) => {
  return service({
    url: `/api/user/topup/balance/pending/detail`,
    method: 'POST',
    data: data,
  })
}

const topupNft = async (data) => {
  return service({
    url: `/api/user/topup/nft`,
    method: 'POST',
    data: data,
  })
}
const topupBalanceReward = async () => {
  return service({
    url: `/api/user/topup/balance/reward`,
    method: 'POST',
    data: {},
  })
}
const topupBalanceRewardDetail = async (data) => {
  return service({
    url: `/api/user/topup/balance/reward/detail`,
    method: 'POST',
    data: data,
  })
}
export {
  loginAuth,
  logout,
  signature,
  contractAbi,
  basicDaoCerate,
  cookieInfo,
  daoTransactionHash,
  daoListProtodao,
  daoProtodaoMember,
  daoDetail,
  daoUnmintedWorks,
  daoDrbNfts,
  daoNfts,
  daoEditDetail,
  daoEdit,
  walletReceived,
  walletUnclaimed,
  createWorkInfo,
  workCreate,
  workDetail,
  canvasExists,
  userAuthority,
  workHold,
  workCreator,
  myDaoList,
  workEditDetail,
  workEdit,
  blackandwhiteList,
  whitelistProof,
  distribute,
  protodAoupgrade,
  upgradeFlow,
  protodaoRelated,
  workAuthority,
  daoMerkle,
  daoActivity,
  analyticsStatistics,
  analyticsMintScatterPlot,
  analyticsNftOwnersQuantity,
  analyticsAveragePrice,
  analyticsNftTopOwners,
  analyticsPriceRange,
  analyticsOwnerDistribution,
  daoRankings,
  nftsRankings,
  drbInfo,
  searchAmount,
  favoriteActions,
  favoriteCancel,
  searchWorks,
  searchDaos,
  daoCollections,
  workExploreUnmitedWorks,
  workExploreNfts,
  workDaoList,
  workCanvasInfo,
  workMinted,
  favoriteWork,
  favoriteDao,
  userProfileSave,
  userProfileInfo,
  walletDao,
  checkName,
  deleteWorks,
  favoriteWorkUser,
  daoTimes,
  createDao,
  maincreator,
  allcationList,
  userTopupBalance,
  topupEthbalance,
  daoAllocation,
  merkleWork,
  allocationInfo,
  analyticsAssetPoolEth,
  analyticsAssetPoolToken,
  analyticsDetail,
  togetherDaoMember,
  togetherDaoAmount,
  togetherDaoToken,
  togetherDaoMaker,
  togetherDaoInfo,
  togetherDaoList,
  togetherTreasury,
  togetherPlan,
  workDetailNft,
  workLockDuration,
  workMintTopUp,
  workMintUnTopUp,
  userTopupBalanceDetails,
  togetherDaoMakerList,
  treasuryInfo,
  treasuryTransaction,
  treasuryList,
  seedNodesCollections,
  searchSeedNodes,
  createPlanParam,
  togetherPlanList,
  togetherPlanBasicInfo,
  topupBalancePending,
  topupBalancePendingDetail,
  topupNft,
  topupBalanceReward,
  topupBalanceRewardDetail
}
