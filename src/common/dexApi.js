import { service } from "../utils/Fetch";

const erc20 = async () => {
  return service({
    url: `/dex-api/liquidity/erc20`,
    method: "POST",
    data: { searchWord: 121 },
  });
};

const priceFoldLine = async (data) => {
  return service({
    url: `/dex-api/liquidity/price/price_fold_line`,
    method: "POST",
    data: data,
  });
};
const getApy = async (data) => {
  return service({
    url: `/dex-api/liquidity/price/apy`,
    method: "POST",
    data: data,
  });
};
const statistics = async (data) => {
  return service({
    url: `/dex-api/liquidity/price/statistics`,
    method: "POST",
    data: data,
  });
};
const liquidityPrice = async (data) => {
  return service({
    url: `/dex-api/liquidity/price`,
    method: "POST",
    data: data,
  });
};
const erc20Owners = async (data) => {
  return service({
    url: `/dex-api/royalty/erc20/owners`,
    method: "POST",
    data: data,
  });
};
const assetPool = async (data) => {
  return service({
    url: `/dex-api/royalty/price/asset_pool`,
    method: "POST",
    data: data,
  });
};
const assetPoolEth = async (data) => {
  return service({
    url: `/dex-api/burn/asset_pool/eth`,
    method: "POST",
    data: data,
  });
};
const transaction = async (data) => {
  return service({
    url: `/dex-api/liquidity/transaction`,
    method: "POST",
    data: data,
  });
};
const liquidityDefault = async () => {
  return service({
    url: `/dex-api/liquidity/default`,
    method: "POST",
  });
};

const liquidityErc20Token = async (data) => {
  return service({
    url: `/dex-api/liquidity/erc20_token`,
    method: "POST",
    data: data,
  });
};

const priceTrending = async (data) => {
  return service({
    url: `/dex-api/liquidity/price/trending`,
    method: "POST",
    data: data,
  });
};
const assetPoolInfo = async (data) => {
  return service({
    url: `/dex-api/burn/asset_pool/info`,
    method: "POST",
    data: data,
  });
};
const assetPoolPrice = async (data) => {
  return service({
    url: `/dex-api/burn/asset_pool/price`,
    method: "POST",
    data: data,
  });
};

const dexLiquidityTime = async () => {
  return service({
    url: `/dex-api/liquidity/times`,
    method: "POST",
  });
};

const liquidityErc20 = async (data) => {
  return service({
    url: `/dex-api/liquidity/erc20`,
    method: "POST",
    data: data,
  });
};

export {
  erc20,
  priceFoldLine,
  getApy,
  statistics,
  liquidityPrice,
  erc20Owners,
  assetPool,
  assetPoolEth,
  transaction,
  liquidityDefault,
  liquidityErc20Token,
  priceTrending,
  assetPoolInfo,
  assetPoolPrice,
  dexLiquidityTime,
  liquidityErc20,
};
