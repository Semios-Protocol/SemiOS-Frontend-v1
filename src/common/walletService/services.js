import Vue from 'vue'
import store from '@/store/index.js'
import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'
const getProvider = () => {
  return new ethers.providers.Web3Provider(
    Vue.prototype.$wallets[0].provider,
    'any'
  )
}
const getBalance = async () => {
  const balance = await getProvider().getBalance(store.state.MetaMaskAddress)
  return ethers.utils.formatEther(balance)
}
const getCode = async (address) => {
  const isCode = await getProvider().getCode(address)
  const erc20_methods = [
    '06fdde03',
    '95d89b41',
    '313ce567',
    '18160ddd',
    '70a08231',
    'a9059cbb',
    '23b872dd',
    '095ea7b3',
    'dd62ed3e',
  ]
  const erc20_events = [
    'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  ]
  const proxy_prefix = '0x363d3d373d3d3d363d73'
  let isMet = null
  let isEve = null
  if (isCode.includes(proxy_prefix)) {
    if (isCode.length < proxy_prefix.length + 40) {
      return false
    } else {
      const contract_impl =
        '0x' + isCode.substring(proxy_prefix.length, proxy_prefix.length + 40)
      const isCodeTwo = await getProvider().getCode(contract_impl)
      isMet = erc20_methods.find((item) => !isCodeTwo.includes(item))
      isEve = erc20_events.find((item) => !isCodeTwo.includes(item))
      if (isMet || isEve) {
        return false
      } else {
        return true
      }
    }
  } else {
    isMet = erc20_methods.find((item) => !isCode.includes(item))
    isEve = erc20_events.find((item) => !isCode.includes(item))
    if (isMet || isEve) {
      return false
    } else {
      return true
    }
  }
}
//call()
const call = (contractAddress, abi) => {
  const contract = new ethers.Contract(contractAddress, abi, getProvider())
  return contract
}
//send
const send = (contractAddress, abi) => {
  const signer = getProvider().getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  return contract
}
const sig = () => {
  return getProvider().getSigner()
}

const lockTopUpNFT = async (data) => {
  console.log(data, 'datadata')
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.work_lock_abi)
  )
  console.log(contract, 'contract')
  const tx = await contract.lockTopUpNFT(data.nftIdentifier, data.duration)
  return tx
}
const mintNFT = async (data) => {
  console.log(data, 'data')
  BigNumber.config({ EXPONENTIAL_AT: 38 })
  const protocolAddress = store.state.ABI.protocol_contract
  const abi = JSON.parse(store.state.ABI.protocol_contract_abi)
  const overrides = {
    value: data.erc20PaymentMode || data.payCurrencyType !== 'ETH'
      ? ethers.utils.parseEther('0')
      : ethers.utils.parseEther(data.price + ''),
  }
  const contract = send(protocolAddress, abi)
  const CreateCanvasAndMintNFTParam = {
    daoId: data.daoId,
    canvasId: data.canvasId,
    canvasUri: data.canvasUri,
    canvasCreator: data.canvasCreator,
    tokenUri: data.tokenUri,
    nftSignature: data.signature ? data.signature : '0x',
    flatPrice: data.erc20PaymentMode || data.payCurrencyType !== 'ETH' ? new BigNumber(data.nftFlatPrice)
      .times(`1e${data.decimalsNum}`)
      .toString() : new BigNumber(data.nftFlatPrice)
        .times(1e18)
        .toString(),
    proof: data.proof,
    canvasProof: data.canvasProof,
    nftOwner: data.nftOwner,
    erc20Signature: '0x',
    deadline: 0,
    nftIdentifier: data.nftIdentifier,
  }
  console.log(CreateCanvasAndMintNFTParam, 'CreateCanvasAndMintNFTParam')
  const tx = await contract.mintNFT(CreateCanvasAndMintNFTParam, overrides)
  return tx
}

const createDaoService = async (data) => {

  const createSemiDaoParam = {
    existDaoId: data.existDaoId,
    daoMetadataParam: data.daoMetadataParam,
    whitelist: data.whitelist,
    blacklist: data.blacklist,
    daoMintCapParam: data.daoMintCapParam,
    nftMinterCapInfo: data.nftMinterCapInfo,
    nftMinterCapIdInfo: data.nftMinterCapIdInfo,
    templateParam: data.templateParam,
    basicDaoParam: data.basicDaoParam,
    continuousDaoParam: data.continuousDaoParam,
    allRatioParam: data.allRatioParam,
    actionType: data.actionType,

  }
  console.log(
    createSemiDaoParam,
    '我是所有参数',
    data
  )
  const overrides = {
    value: ethers.utils.parseEther(data.createProjectFee + ''),
  }
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.pd_create_abi)
  )
  console.log(contract, 'contract')
  const tx = await contract.createDao(createSemiDaoParam,
    overrides
  )

  return tx
}

const transferNFTs = async (data) => {
  const contract = call(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.protocol_readable_abi)
  )
  const nftAddress = await contract.getDaoNft(data.projectId)
  const nftContract = send(
    nftAddress,
    JSON.parse(store.state.ABI.erc721_contract_abi)
  )
  const tx = await nftContract.safeTransferFrom(
    data.address,
    data.to,
    data.tokenId
  )
  return tx
}
const claimMultiReward = async (struct) => {
  const contract = send(
    store.state.ABI.claimer_contract,
    JSON.parse(store.state.ABI.claimer_contract_abi)
  )
  const tx = await contract.claimMultiReward(struct[0])
  return tx
}
//dex
const exchangeOutputToInput = async (project_id, amount, address) => {
  const protocolAddress = store.state.ABI.protocol_contract
  const contract = send(
    protocolAddress,
    JSON.parse(store.state.ABI.protocol_contract_proxy_abi)
  )
  const tx = await contract.exchangeOutputToInput(project_id, amount, address)
  return tx
}

//dex
const getErc20Balance = async (address, metamask) => {
  const contract = call(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const bla = await contract.balanceOf(metamask)
  return bla.toString()
}
//dex
const getAllowance = async (address, metamask) => {
  const contract = call(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const bla = await contract.allowance(
    metamask,
    store.state.ABI.router_contract
  )
  return bla.toString()
}

const approve = async (address) => {
  const contract = send(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const tx = await contract.approve(
    store.state.ABI.router_contract,
    ethers.constants.MaxUint256
  )
  return tx
}
const addLiquidityETH = async (data) => {
  const overrides = {
    value: ethers.utils.parseEther(data.eth + ''),
  }
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.addLiquidityETH(
    data.address,
    data.erc20,
    data.erc20min,
    data.ethmin,
    data.metamask,
    data.deadline,
    overrides
  )
  return tx
}

const addLiquidityETHCallStatic = async (data) => {
  const overrides = {
    value: ethers.utils.parseEther(data.eth + ''),
  }
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.callStatic.addLiquidityETH(
    data.address,
    data.erc20,
    data.erc20min,
    data.ethmin,
    data.metamask,
    data.deadline,
    overrides
  )
  return tx
}

const getPairBalanceOf = async (address, metamask) => {
  const contract = call(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const bla = await contract.balanceOf(metamask)
  return bla.toString()
}
const getTotalSupply = async (address) => {
  const contract = call(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const bla = await contract.totalSupply()
  return bla.toString()
}
const getNonce = async (address, metamask) => {
  const contract = call(
    address,
    JSON.parse(store.state.ABI.uniswap_v2_pair_abi)
  )
  const bla = await contract.nonces(metamask)
  return bla
}

const removeLiquidityETHWithPermit = async (data) => {
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.removeLiquidityETHWithPermit(
    data.erc20Address,
    data.input,
    data.amountTokenMin,
    data.amountETHMin,
    data.to,
    data.deadline,
    data.approveMax,
    data.v,
    data.r,
    data.s
  )
  return tx
}

const swapExactETHForTokens = async (data) => {
  const overrides = {
    value: ethers.utils.parseEther(data.inputEth + ''),
  }
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.swapExactETHForTokens(
    data.amountOutMin,
    data.path,
    data.to,
    data.deadline,
    overrides
  )
  return tx
}

const swapETHForExactTokens = async (data) => {
  const overrides = {
    value: ethers.utils.parseEther(data.inputEth + ''),
  }
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.swapETHForExactTokens(
    data.amountOut,
    data.path,
    data.to,
    data.deadline,
    overrides
  )
  return tx
}

const swapExactTokensForETH = async (data) => {
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.swapExactTokensForETH(
    data.amountIn,
    data.amountOutMin,
    data.path,
    data.to,
    data.deadline
  )
  return tx
}
const swapTokensForExactETH = async (data) => {
  const contract = send(
    store.state.ABI.router_contract,
    JSON.parse(store.state.ABI.router_contract_abi)
  )
  const tx = await contract.swapTokensForExactETH(
    data.amountOut,
    data.amountInMax,
    data.path,
    data.to,
    data.deadline
  )
  return tx
}

const getIsErc721 = async (address) => {
  const isCode = await getProvider().getCode(address)
  if (isCode === '0x') {
    return false
  } else {
    const contract = call(
      address,
      JSON.parse(store.state.ABI.erc721_contract_abi)
    )
    const isErc721 = contract.supportsInterface('0x80ac58cd')
    return isErc721
  }
}
const sendTransactionPro = async (data) => {
  const signer = getProvider().getSigner()
  const tx = await signer.sendTransaction({
    to: data.feePool,
    value: ethers.utils.parseUnits(data.daoFlow + '', 'ether'),
  })
  return tx
}

const setTopUpInputSplitRatio = async (data) => {
  // const req = {
  //   daoId: data.daoId,
  //   defaultEthRatio: data.defaultEthRatio,
  //   subDaoIds: data.subDaoIds,
  //   ethRatios: data.ethRatios,
  // }
  const protocolAddress = store.state.ABI.protocol_contract
  const abi = JSON.parse(store.state.ABI.protocol_setter_abi)
  const contract = send(protocolAddress, abi)
  const tx = await contract.setTopUpInputSplitRatio(
    data.daoId,
    data.defaultInputRatio,
    data.subDaoIds,
    data.inputRatios
  )
  return tx
}

const setTopUpOutputSplitRatio = async (data) => {
  // const req = {
  //   daoId: data.daoId,
  //   defaultErc20Ratio: data.defaultErc20Ratio,
  //   subDaoIds: data.subDaoIds,
  //   erc20Ratios: data.erc20Ratios,
  // }
  const protocolAddress = store.state.ABI.protocol_contract
  const abi = JSON.parse(store.state.ABI.protocol_setter_abi)
  const contract = send(protocolAddress, abi)
  const tx = await contract.setTopUpOutputSplitRatio(
    data.daoId,
    data.defaultOutputRatio,
    data.subDaoIds,
    data.outputRatios
  )
  return tx
}
const setDaoParamsServicr = async (data) => {
  const req = {
    daoId: data.daoId,
    nftMaxSupplyRank: data.nftMaxSupplyRank,
    remainingRound: data.remainingRound,
    daoFloorPrice: data.daoFloorPrice,
    priceTemplateType: data.priceTemplateType,
    nftPriceFactor: data.nftPriceFactor,
    dailyMintCap: data.dailyMintCap,
    // initialTokenSupply: data.initialTokenSupply,
    unifiedPrice: data.unifiedPrice,
    changeInfiniteMode: data.changeInfiniteMode,
    setChildrenParam: data.setChildrenParam,
    allRatioParam: data.allRatioForFundingParam,
  }
  const protocolAddress = store.state.ABI.protocol_contract
  const abi = JSON.parse(store.state.ABI.protocol_setter_abi)
  const contract = send(protocolAddress, abi)
  const tx = await contract.setDaoParams(req)
  return tx
}

const setMintCapAndPermission = async (data) => {
  const protocolAddress = store.state.ABI.protocol_contract
  //  store.state.ABI.protocol_contract

  const abi = JSON.parse(store.state.ABI.protocol_setter_abi)
  const contract = send(protocolAddress, abi)
  const UserMintCapParam =
    data.designatedMintCaps.length > 0
      ? data.designatedMintCaps.map((item) => {
        return {
          minter: item.account,
          mintCap: item.cap,
        }
      })
      : []
  const nftMinterCapInfo =
    data.nftMinterCapInfo.length > 0
      ? data.nftMinterCapInfo.map((item) => {
        return {
          nftAddress: item.account,
          nftMintCap: item.cap,
        }
      })
      : []
  console.log(
    {
      daoId: data.daoId,
      mintCap: data.mintCap,
      UserMintCapParam: UserMintCapParam,
      nftMinterCapInfo: nftMinterCapInfo,
      nftMinterCapIdInfo: data.nftMinterCapIdInfo,
      whitelist: data.whitelist,
      blacklist: data.blacklist,
      unblacklist: data.unblacklist
    })
  const tx = await contract.setMintCapAndPermission(
    data.daoId,
    data.mintCap,
    UserMintCapParam,
    nftMinterCapInfo,
    data.nftMinterCapIdInfo,
    data.whitelist,
    data.blacklist,
    data.unblacklist
  )
  return tx
}
const transferPay = async (data) => {
  console.log(data, 'datadatadata')
  const contract = send(
    data.contract,
    JSON.parse(store.state.ABI.erc20_contract_abi)
  )
  const tx = await contract.transfer(data.to, data.amount)
  return tx
}

const approveWork = async (daoErc20Address, amount) => {
  console.log(daoErc20Address, 'daoErc20Address', amount)
  const contract = send(
    daoErc20Address,
    JSON.parse(store.state.ABI.d4a_erc20_abi)
  )
  const tx = await contract.approve(store.state.ABI.protocol_contract, amount)
  return tx
}
const decimals = async (address) => {
  const contract = call(address, JSON.parse(store.state.ABI.d4a_erc20_abi))
  console.log(contract, 'contractcontractcontract')
  const bla = await contract.decimals()
  console.log(bla, 'bla')
  return bla.toString()
}
const updateTopUpAccount = async (data) => {
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.pd_plan_abi)
  )
  console.log(data, ' projectIdNftIdentifier')
  const bla = await contract.callStatic.updateTopUpAccount(
    data.projectId,
    data.NftIdentifier
  )
  return bla
}
const getWorkAllowance = async (address, metamask) => {
  const contract = call(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const bla = await contract.allowance(
    metamask,
    store.state.ABI.protocol_contract
  )
  return bla.toString()
}

const transactionEth = async (address, amount) => {
  console.log(address, amount, 'address, amount', getProvider())
  const signer = getProvider().getSigner()
  console.log(signer, 'signer')
  const tx = await signer.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(amount + '', 'ether'),
  })
  return tx
}
const transactionERC20 = async (inputToken, address, amount) => {
  const contract = send(inputToken, JSON.parse(store.state.ABI.erc20_contract_abi))
  const tx = await contract.transfer(
    address,
    amount
  )
  return tx
}
const grantTreasury = async (data) => {
  // const req = {
  //   daoId: data.daoId,
  //   amount: data.amount,
  //   tokenUri: data.tokenUri,
  // }
  const protocolAddress = store.state.ABI.protocol_contract
  const contract = send(
    protocolAddress,
    JSON.parse(store.state.ABI.pd_grant_abi)
  )
  console.log(contract, 'contract', data)
  const tx = await contract.grantTreasury(
    data.daoId,
    data.amount,
    data.tokenUri,
    data.address
  )
  return tx
}
const grantDaoAssetPool = async (data) => {
  // const req = {
  //   daoId: data.daoId,
  //   amount: data.amount,
  //   useTreasury: data.useTreasury,
  //   tokenUri: data.tokenUri,
  // }
  const protocolAddress = store.state.ABI.protocol_contract
  const contract = send(
    protocolAddress,
    JSON.parse(store.state.ABI.pd_grant_abi)
  )
  console.log(data, 'data')
  const tx = await contract.grantDaoAssetPool(
    data.daoId,
    data.amount,
    data.useTreasury,
    data.tokenUri,
    data.address
  )
  return tx
}
const getAllowanceTreasury = async (address, metamask) => {
  const contract = call(address, JSON.parse(store.state.ABI.erc20_contract_abi))
  const bla = await contract.allowance(
    metamask,
    store.state.ABI.protocol_contract
  )
  return bla.toString()
}



const createPlan = async (data) => {
  BigNumber.config({ EXPONENTIAL_AT: 38 })
  const overrides = {
    value: ethers.utils.parseEther(data.totalReward + ''),
  }
  const createPlanParam = {
    daoId: data.projectId,
    startBlock: data.startBlock,
    duration: data.durationBlock,
    totalRounds: data.totalRounds,
    totalReward: new BigNumber(data.totalReward)
      .times(`1e${data.decimalsNum}`)
      .toString(),
    rewardToken: data.rewardToken === "" ? ethers.constants.AddressZero : data.rewardToken,
    useTreasury: data.useTreasury,
    io: data.io,
    uri: data.planUri,
    planTemplateType: 0,

  }
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.pd_plan_abi)
  )
  console.log(createPlanParam, 'createPlanParam')
  const tx = data.rewardToken === "" ? await contract.createPlan(createPlanParam, overrides) : await contract.createPlan(createPlanParam)
  return tx
}

const addPlanTotalReward = async (data) => {
  BigNumber.config({ EXPONENTIAL_AT: 38 })
  const overrides = {
    value: ethers.utils.parseEther(data.totalReward + ''),
  }
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.pd_plan_abi)
  )
  console.log(contract, 'contract', data)
  const tx = data.rewardTokenSymbol === 'ETH' ? await contract.addPlanTotalReward(data.planId, data.amount, data.useTreasury, overrides) : await contract.addPlanTotalReward(data.planId, data.amount, data.useTreasury)
  return tx
}

const updateMultiTopUpAccount = async (data) => {
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.pd_plan_abi)
  )
  const tx = await contract.updateMultiTopUpAccount(data.projectId, data.nfts)
  return tx
}
const claimDaoPlanRewardForMultiNft = async (data) => {
  const contract = send(
    store.state.ABI.protocol_contract,
    JSON.parse(store.state.ABI.pd_plan_abi)
  )
  const tx = await contract.claimDaoPlanRewardForMultiNft(data.projectId, data.nfts)
  return tx
}

export {
  call,
  send,
  sig,
  getCode,
  getBalance,
  mintNFT,
  claimMultiReward,
  exchangeOutputToInput,
  getErc20Balance,
  getAllowance,
  approve,
  addLiquidityETH,
  addLiquidityETHCallStatic,
  getPairBalanceOf,
  getTotalSupply,
  getNonce,
  removeLiquidityETHWithPermit,
  swapExactETHForTokens,
  swapETHForExactTokens,
  swapExactTokensForETH,
  swapTokensForExactETH,
  transferNFTs,
  getIsErc721,
  createDaoService,
  sendTransactionPro,
  setDaoParamsServicr,
  setMintCapAndPermission,
  transferPay,
  approveWork,
  decimals,
  updateTopUpAccount,
  getWorkAllowance,
  transactionEth,
  lockTopUpNFT,
  setTopUpOutputSplitRatio,
  setTopUpInputSplitRatio,
  grantTreasury,
  grantDaoAssetPool,
  getAllowanceTreasury,
  transactionERC20,
  createPlan,
  addPlanTotalReward,
  updateMultiTopUpAccount,
  claimDaoPlanRewardForMultiNft
}
