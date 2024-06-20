<template>
  <loading v-if="isLoading" />
  <div class="box" v-else>
    <div
      class="box-title"
      style="margin-bottom: -18px"
      v-if="dataObj.workStatus === 1 && topUpBalanceList.length > 0"
    >
      <h3>{{ $t('workDetail.topupBalancLabel') }}e</h3>
      <el-divider></el-divider>
      <top-up-balance :list="topUpBalanceList" />
    </div>
    <div class="box-title">
      <h3>{{ $t('workDetail.currentBlockWindowInformationLabel') }}</h3>
      <el-divider></el-divider>
      <div class="title-card">
        <el-row class="title-top">
          <el-col :span="8">{{ dataObj.minters }}</el-col>
          <el-col :span="8"
            >{{ dataObj.mintFee ? dataObj.mintFee : 0 }}
            <TokenIcon
              size="14px"
              :daoToken="dataObj.erc20PaymentMode"
              :daoSymbol="dataObj.daoSymbol"
              :daoErc20Address="dataObj.daoErc20Address"
              :payCurrencyType="dataObj.payCurrencyType"
              :inputTokenAddress="dataObj.inputTokenAddress"
            />
            <!-- <svg-icon
              :icon-class="dataObj.erc20PaymentMode ? 'token' : 'ethbl'"
              style="margin: 0px; font-size: 16px"
          /> -->
          </el-col>
          <el-col :span="8">{{ dataObj.mintedWorks }}</el-col>
        </el-row>
        <el-row class="title-bom">
          <el-col :span="8">{{ $t('nodeDetail.mintersLabel') }}</el-col>
          <el-col :span="8">{{ $t('nodeDetail.mintFeeLabel') }}</el-col>
          <el-col :span="8">{{ $t('nodeDetail.mintedWorksLabel') }}</el-col>
        </el-row>
        <el-row class="title-top">
          <el-col :span="8"
            >{{ dataObj.blockRewardToken | bigNumFormat(5, 0.00001) }}

            <TokenIcon
              size="14px"
              :daoToken="true"
              :daoSymbol="dataObj.daoSymbol"
              :daoErc20Address="dataObj.daoErc20Address" />
            <span v-if="!dataObj.topupMode">
              +
              {{ dataObj.blockRewardEth | bigNumFormat(5, 0.00001) }}

              <TokenIcon
                size="14px"
                :payCurrencyType="dataObj.payCurrencyType"
                :inputTokenAddress="dataObj.inputTokenAddress" /></span
          ></el-col>
          <el-col :span="8"
            >{{ dataObj.internalRewardToken | bigNumFormat(5, 0.00001) }}
            <TokenIcon
              size="14px"
              :daoToken="true"
              :daoSymbol="dataObj.daoSymbol"
              :daoErc20Address="dataObj.daoErc20Address" />
            <span v-if="!dataObj.topupMode">
              + {{ dataObj.internalRewardEth | bigNumFormat(5, 0.00001) }}
              <TokenIcon
                size="14px"
                :payCurrencyType="dataObj.payCurrencyType"
                :inputTokenAddress="dataObj.inputTokenAddress" /></span
          ></el-col>
          <el-col :span="8" v-if="dataObj.workStatus === 0"
            >{{ dataObj.mintersMaxRewardToken | bigNumFormat(5, 0.00001) }}
            <TokenIcon
              size="14px"
              :daoToken="true"
              :daoSymbol="dataObj.daoSymbol"
              :daoErc20Address="dataObj.daoErc20Address" />
            <span v-if="!dataObj.topupMode">
              + {{ dataObj.mintersMaxRewardEth | bigNumFormat(5, 0.00001) }}
              <TokenIcon
                size="14px"
                :payCurrencyType="dataObj.payCurrencyType"
                :inputTokenAddress="dataObj.inputTokenAddress" /></span
          ></el-col>
        </el-row>
        <el-row class="title-bom">
          <el-col :span="8">{{ $t('nodeDetail.blockRewardLabel') }}</el-col>
          <el-col :span="8">{{
            $t('nodeDetail.internalIncentivesLabel')
          }}</el-col>
          <el-col :span="8" v-if="dataObj.workStatus === 0">{{
            $t('nodeDetail.minterWorkLabel')
          }}</el-col>
        </el-row>
      </div>
    </div>
    <div class="box-card">
      <div class="card-top">
        <div class="top-img">
          <el-image
            class="img"
            :style="{ height: 244 + 'px' }"
            :src="dataObj.imageUrl"
            :preview-src-list="srcList"
            lazy
          >
          </el-image>
        </div>
        <div class="top-text">
          <div class="text-title">
            <div class="right-name" v-if="dataObj.workStatus === 1">
              <span class="daoname-col" @click="goDaoDetail">{{
                dataObj.daoName
              }}</span
              ><span style="color: #d9d9d9">.{{ dataObj.workNumber }}</span>
            </div>
            <div v-else>
              <div class="right-name" v-if="dataObj.generate === 1">
                <span class="daoname-col" @click="goDaoDetail">{{
                  dataObj.daoName
                }}</span
                ><span
                  class="daoname-col"
                  @click="goOpenAddress(dataObj.creatorAddress)"
                  ><span style="color: #fff">#</span
                  ><span style="color: #b3b5f2">Pass</span></span
                >/Unminted
              </div>
              <div class="right-name" v-else>
                <span class="daoname-col" @click="goDaoDetail">{{
                  dataObj.daoName
                }}</span
                ><span
                  class="daoname-col"
                  @click="goOpenAddress(dataObj.creatorAddress)"
                  ><span style="color: #fff">#</span
                  ><span style="color: #b3b5f2">{{
                    dataObj.creatorAddress | splitAddress
                  }}</span></span
                >/Unminted
              </div>
            </div>
            <div class="top-icons">
              <span class="top-shou" style="color: #9e9e9e">
                <span style="cursor: pointer" @click="setShou">
                  <svg-icon
                    :style="{
                      color: dataObj.favorited ? '#ffa2a2' : '',
                    }"
                    icon-class="shou"
                  />
                </span>
                {{ dataObj.favoritesAmount | numberFilter }}
              </span>
              <span
                class="top-edit"
                style="cursor: pointer"
                v-if="dataObj.modifiable && MetaMaskAddress"
                @click="goEdit"
              >
                <svg-icon icon-class="workedit" />
              </span>

              <!-- v-if="dataObj.workStatus === 1" -->
              <span
                class="top-edit"
                style="cursor: pointer"
                v-if="
                  dataObj.workStatus === 1 &&
                  MetaMaskAddress &&
                  dataObj.ownerAddress === MetaMaskAddress
                "
              >
                <span v-if="dataObj.workLockStatus === 1">
                  <svg-icon icon-class="lock"
                /></span>
                <span
                  v-if="dataObj.workLockStatus === 0"
                  @click="setLockDialog(true)"
                >
                  <svg-icon icon-class="unlocking"
                /></span>
              </span>
            </div>
          </div>
          <div class="text-det">
            <div class="det-mf">
              <el-row v-if="!dataObj.topupMode">
                <el-col :span="24">
                  <span class="mintitle f14"
                    >{{ $t('nodeDetail.mintFeeLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('nodeDetail.mintFeeTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:</span
                  ></el-col
                >
              </el-row>
              <el-row :gutter="24" v-if="!dataObj.topupMode">
                <el-col :span="24">
                  <div class="minbox">
                    <span class="mintitle">Builder Fee</span
                    ><span class="minnum"
                      >{{ dataObj.reserveRatio.canvasMintFee }}%</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row
                :gutter="24"
                v-if="
                  !dataObj.topupMode &&
                  !dataObj.erc20PaymentMode &&
                  !dataObj.isThirdpartyToken
                "
              >
                <el-col :span="24">
                  <div class="minbox">
                    <span class="mintitle">Seed Nodes Fee</span
                    ><span class="minnum"
                      >{{ dataObj.reserveRatio.redeemPoolMintFee }}%</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="!dataObj.topupMode">
                <el-col :span="24">
                  <div class="minbox">
                    <span class="mintitle">Sub Nodes Fee</span
                    ><span class="minnum"
                      >{{ dataObj.reserveRatio.daoMintFee }}%</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="!dataObj.topupMode">
                <el-col :span="24">
                  <div class="minbox">
                    <span class="mintitle">Semios Fee</span>
                    <span class="minnum"
                      ><span class="old-fee">2.5 </span
                      >{{ dataObj.reserveRatio.d4aMintFee }}%</span
                    >
                  </div>
                </el-col>
              </el-row>

              <el-row v-if="dataObj.workStatus === 0 && !dataObj.topupMode">
                <el-col :span="24">
                  <span class="mintitle f14"
                    >{{ $t('workDetail.topupUnlockProportionLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="
                        dataObj.erc20PaymentMode
                          ? $t('workDetail.erc20PaymentModeTrueText')
                          : $t('workDetail.erc20PaymentModeFalseText')
                      "
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:</span
                  ></el-col
                >
              </el-row>
              <el-row
                :gutter="24"
                v-if="dataObj.workStatus === 0 && !dataObj.topupMode"
              >
                <el-col :span="24">
                  <div class="minbox">
                    <span class="mintitle">Wallet</span
                    ><span class="minnum">{{ dataObj.walletRatio }}%</span>
                  </div>
                </el-col>
              </el-row>
              <el-row
                :gutter="24"
                v-if="dataObj.workStatus === 0 && !dataObj.topupMode"
              >
                <el-col :span="24">
                  <div class="minbox">
                    <span class="mintitle">{{
                      dataObj.erc20PaymentMode
                        ? 'Redeem Asset Pool'
                        : 'Treasury'
                    }}</span
                    ><span class="minnum"
                      >{{ dataObj.treasuryOrPoolRatio }}%</span
                    >
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="det-pri">
              <div
                class="lock-time"
                v-if="dataObj.workStatus === 1 && dataObj.workLockStatus === 1"
              >
                <div class="time-left">Countdown</div>
                <div class="time-right">
                  <span>{{ lockData.h }}</span> :
                  <span class="time-cen">{{ lockData.m }}</span> :
                  <span>{{ lockData.s }}</span>
                </div>
              </div>
              <el-row>
                <el-col :span="12">
                  <span class="nameprice">
                    {{
                      dataObj.unifiedPriceSet
                        ? 'Unified Price'
                        : dataObj.fixedPrice
                        ? 'Fixed Price'
                        : 'Price'
                    }}</span
                  ></el-col
                >
              </el-row>
              <el-row style="flex: 1">
                <el-col :span="24">
                  <span
                    class="newPrice"
                    v-if="
                      dataObj.royaltyTokenPrice !== null &&
                      dataObj.royaltyTokenPrice !== ''
                    "
                    >{{ dataObj.royaltyTokenPrice | bigNumFormat(5, 0.000001) }}
                  </span>
                  <span class="newPrice" v-else
                    >{{ dataObj.price | bigNumFormat(5, 0.000001) }}
                  </span>
                  <span
                    class="oldPrice"
                    v-if="
                      dataObj.royaltyTokenPrice !== null &&
                      dataObj.royaltyTokenPrice !== ''
                    "
                  >
                    {{ dataObj.price }}
                  </span>
                  <TokenIcon
                    size="32px"
                    :daoToken="dataObj.erc20PaymentMode"
                    :daoSymbol="dataObj.daoSymbol"
                    :daoErc20Address="dataObj.daoErc20Address"
                    :payCurrencyType="dataObj.payCurrencyType"
                    :inputTokenAddress="dataObj.inputTokenAddress"
                  />
                  <!-- <svg-icon
                    :icon-class="dataObj.erc20PaymentMode ? 'token' : 'ethbl'"
                    style="margin: 0px; font-size: 32px"
                /> -->
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <span class="nameprice" v-if="dataObj.unifiedPriceModeOff">
                    {{
                      $t(
                        'workDetail.matchMediaintedPassesByTotalMintablePassesLabel'
                      )
                    }}：</span
                  ></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="24" v-if="dataObj.unifiedPriceModeOff"
                  ><span class="newPriceTwo">
                    {{ dataObj.havePassesQuantity }}/{{
                      dataObj.passesTotalQuantity
                    }}
                  </span>
                </el-col>
              </el-row>
              <div
                class="new-btns-web"
                v-if="dataObj.nextDrbStartTime <= 0"
                style="display: flex; margin: 0px"
              >
                <el-button
                  v-if="dataObj.workStatus === 0"
                  type="primary"
                  class="btn-two"
                  style="width: 100%; margin-right: 18px; border-radius: 2px"
                  @click="setmintNftEmitIsDialog"
                  v-preventReClick
                  >{{
                    dataObj.erc20PaymentMode ? 'Approve & Mint' : 'Mint NFT'
                  }}
                </el-button>
                <el-button
                  v-if="dataObj.workStatus === 0"
                  type="primary"
                  style="width: 100%; border-radius: 2px"
                  v-preventReClick
                  @click="setMintTransferDio"
                  >Mint & Transfer
                </el-button>
                <el-button
                  v-if="dataObj.workStatus === 1"
                  type="primary"
                  class="btn-two"
                  style="width: 100%; margin-right: 18px; border-radius: 2px"
                  v-preventReClick
                  @click="goOpenUrl(dataObj.tradeNft)"
                  >Trade NFT
                </el-button>
                <el-button
                  v-if="
                    dataObj.workStatus === 1 &&
                    MetaMaskAddress &&
                    dataObj.ownerAddress === MetaMaskAddress
                  "
                  type="primary"
                  style="width: 100%; border-radius: 2px"
                  v-preventReClick
                  @click="transferNFTs"
                  >Transfer NFT
                </el-button>
              </div>
              <div class="new-btns-web" v-else>
                <el-button
                  type="primary"
                  style="width: 100%; margin-right: 18px; border-radius: 2px"
                  disabled
                  >{{ drbData.h }} Hours : {{ drbData.m }} Minutes :
                  {{ drbData.s }} Seconds
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="card-center">
        <div class="card-title">
          <span class="cen-det">
            <svg-icon icon-class="workdet" style="font-size: 16px" />
            Details</span
          >
        </div>
        <el-row>
          <el-col :span="6">
            <span class="p2-text">
              ꔷ Current price
              <span class="text-style">
                {{ dataObj.canvasCurrentPrice }}
                <TokenIcon
                  size="12px"
                  :daoToken="dataObj.erc20PaymentMode"
                  :daoSymbol="dataObj.daoSymbol"
                  :daoErc20Address="dataObj.daoErc20Address"
                  :payCurrencyType="dataObj.payCurrencyType"
                  :inputTokenAddress="dataObj.inputTokenAddress"
                />
                <!-- <svg-icon
                  :icon-class="dataObj.erc20PaymentMode ? 'token' : 'eth'"
                /> -->
              </span>
            </span></el-col
          >
          <el-col :span="6">
            <span class="p2-text">
              ꔷ DAO floor price
              <span class="text-style">
                {{ dataObj.daoFloorPrice | bigNumFormat(5, 0.000001) }}
                <TokenIcon
                  size="12px"
                  :daoToken="dataObj.erc20PaymentMode"
                  :daoSymbol="dataObj.daoSymbol"
                  :daoErc20Address="dataObj.daoErc20Address"
                  :payCurrencyType="dataObj.payCurrencyType"
                  :inputTokenAddress="dataObj.inputTokenAddress"
                />
                <!-- <svg-icon
                  :icon-class="dataObj.erc20PaymentMode ? 'token' : 'eth'"
                /> -->
              </span>
            </span></el-col
          >
          <el-col :span="6">
            <span class="p2-text">
              ꔷ Hash
              <span class="text-style2">
                {{ dataObj.workHash | hasHellipsis(7) }}
              </span>

              <span @click="copy(dataObj.workHash)">
                <svg-icon icon-class="copyhash1" />
              </span> </span
          ></el-col>
          <el-col :span="6">
            <span class="p2-text">
              ꔷ Create by
              <span
                class="text-style2"
                @click="openHash(dataObj.creatorAddress, 'address')"
                v-if="dataObj.creatorAddress"
              >
                <span v-if="dataObj.creatorName">{{
                  dataObj.creatorName | hasHellipsis(7)
                }}</span>
                <span v-else>{{ dataObj.creatorAddress | ellipsis }}</span>
              </span>
              <span class="text-style3" v-else>Unminted</span>
            </span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="6">
            <span class="p2-text">
              ꔷ Minted by
              <span
                class="text-style2"
                @click="openHash(dataObj.mintedBy, 'address')"
                v-if="dataObj.mintedBy"
              >
                <span v-if="dataObj.mintedName">{{
                  dataObj.mintedName | hasHellipsis(7)
                }}</span>
                <span v-else>{{ dataObj.mintedBy | ellipsis }}</span>
              </span>
              <span class="text-style3" v-else>Unminted</span>
            </span></el-col
          >
          <el-col :span="6">
            <span class="p2-text">
              ꔷ Owned by
              <span
                class="text-style2"
                @click="openHash(dataObj.ownerAddress, 'address')"
                v-if="dataObj.ownerAddress"
              >
                <span v-if="dataObj.ownerName">{{
                  dataObj.ownerName | hasHellipsis(7)
                }}</span>
                <span v-else>{{ dataObj.ownerAddress | ellipsis }}</span>
              </span>
              <span class="text-style3 noCursor" v-else>Unminted</span>
            </span></el-col
          >

          <el-col :span="6">
            <span class="p2-text">
              <svg-icon icon-class="xuan1" />
              <span
                class="text-style3"
                v-if="dataObj.mintedBlock"
                @click="openHash(dataObj.mintedBlock, 'block')"
              >
                {{ dataObj.mintedBlock }}
              </span>
              <span class="text-style3" v-else> Unminted </span>
            </span></el-col
          >
          <el-col :span="6">
            <span class="p2-text">
              <svg-icon icon-class="time1" />
              <span class="text-style3" v-if="dataObj.mintedDate">
                {{ dataObj.mintedDate | dateFormat }}
              </span>
              <span class="text-style3" v-else> Unminted </span>
            </span></el-col
          >
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="card-link">
        <el-row
          :gutter="20"
          :class="
            dataObj.socialLinks && dataObj.socialLinks.length > 0
              ? 'mgbt20'
              : 'mg0'
          "
        >
          <el-col :span="8">
            <div
              class="url-item"
              @click="goOpenUrl(dataObj.openseaLink, 'https://opensea.io/')"
            >
              <svg-icon
                :icon-class="dataObj.openseaLink ? 'openseazi' : 'disOpensea'"
              />
              Opensea
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="url-item"
              @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
            >
              <svg-icon
                :icon-class="dataObj.discordLink ? 'telegramzi' : 'telegramDis'"
              />
              Telegram
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="url-item"
              @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
            >
              <svg-icon
                :icon-class="dataObj.twitterLink ? 'Twitterzi' : 'disTwitter'"
              />
              Twitter
            </div>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          v-if="dataObj.socialLinks && dataObj.socialLinks.length > 0"
        >
          <el-col
            :span="8"
            v-for="(item, idx) in dataObj.socialLinks"
            :key="item + idx"
          >
            <div class="url-item" @click="goOpenUrl(item.link)">
              <svg-icon
                :icon-class="item.link === '' ? 'disOpenlink' : 'openlink'"
              />
              {{ item.name }}
            </div>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="card-det">
        <markdown-it-vue class="md-body" :content="dataObj.workDescription" />
      </div>
    </div>
    <el-dialog
      :title="$t('workDetail.congratulationDialogLabe')"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      width="426px"
      :before-close="close"
    >
      <div class="dialog-title">
        <div>
          <svg-icon icon-class="smiley" style="font-size: 104px" />
        </div>
      </div>
      <p class="dialog-text" v-if="dataObj.basicDao === 2">
        {{ $t('workDetail.basicDaoTwoText') }}
      </p>
      <p class="dialog-text" v-else>
        {{ $t('workDetail.transferringAddressText') }}
      </p>
      <div class="text-dialog-box">
        <el-input
          type="text"
          placeholder="Please input wallet address"
          v-model="mainnetAddress"
        ></el-input>
      </div>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          style="width: 100%"
          v-preventReClick
          :disabled="mainnetAddress && mainnetAddress !== '' ? false : true"
          @click="setMintTransfer"
          >Mint & Transfer
        </el-button>
      </div>

      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.discordLink"
            @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.twitterLink"
            @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('workDetail.congratulationDialogLabe')"
      :visible.sync="dialogSucc"
      :close-on-click-modal="false"
      width="426px"
      :before-close="close"
    >
      <div class="dialog-title">
        <div>
          <svg-icon
            :icon-class="isTransferNFTs ? 'smiley' : 'rect'"
            style="font-size: 104px"
          />
        </div>
      </div>
      <p class="dialog-text">
        {{
          !isTransferNFTs
            ? $t('workDetail.transferringSuccessfullyAddressText')
            : dataObj.basicDao === 2
            ? $t('workDetail.basicDaoTwoText')
            : $t('workDetail.transferringAddressText')
        }}
      </p>
      <div class="text-dialog-box" v-if="isTransferNFTs">
        <el-input
          type="text"
          placeholder="Please input wallet address "
          v-model="mainnetAddress"
        ></el-input>
      </div>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="transferNFTs"
          v-if="!isTransferNFTs"
          v-preventReClick
          style="width: 100%; margin: 0"
          >Transfer NFT</el-button
        >
        <el-button
          type="primary"
          class="el-dao-btnz"
          style="width: 100%"
          :disabled="mainnetAddress && mainnetAddress !== '' ? false : true"
          @click="setTransferNFTs"
          v-else
          v-preventReClick
          >Transfer NFT</el-button
        >
      </div>

      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.discordLink"
            @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.twitterLink"
            @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="Warning!"
      :visible.sync="dialogMinting"
      :before-close="close"
      :close-on-click-modal="false"
      width="426px"
    >
      <p class="dialog-text">
        {{ $t('workDetail.tradeNFTText') }}
      </p>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="goOpenUrl(dataObj.tradeNft)"
          style="width: 100%; margin: 0"
          >Trade NFT</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="Warning!"
      :visible.sync="dialogRestrict"
      :before-close="close"
      :close-on-click-modal="false"
      width="426px"
    >
      <p class="dialog-text">
        {{ $t('workDetail.dialogRestrictText') }}
      </p>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="dialogRestrict = false"
          style="width: 100%; margin: 0"
          >OK</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="Success!"
      :visible.sync="dialogTransfer"
      :before-close="close"
      :close-on-click-modal="false"
      width="426px"
    >
      <p class="dialog-text">{{ $t('workDetail.dialogTransferText') }}</p>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="dialogTransfer = false"
          style="width: 100%; margin: 0"
          >OK</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="Loading!"
      :visible.sync="dialogLoading"
      :close-on-click-modal="false"
      :show-close="false"
      width="426px"
    >
      <div class="dialog-loading">
        <loading />
      </div>
      <p class="dialog-text">
        {{ loadingText }}
      </p>
    </el-dialog>

    <el-dialog
      :title="$t('workDetail.congratulationDialogLabe')"
      :visible.sync="dialogSuccTwo"
      :close-on-click-modal="false"
      width="426px"
      :before-close="close"
    >
      <div class="dialog-title">
        <div><svg-icon icon-class="smiley" style="font-size: 104px" /></div>
      </div>
      <p class="dialog-text">Your work has been successfully transferred!</p>

      <div class="link-icons">
        <div class="icon-div">
          <span @click="copyLink">
            <svg-icon icon-class="link" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.discordLink"
            @click="goOpenUrl(dataObj.discordLink, 'https://t.me/')"
          >
            <svg-icon icon-class="telegram" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="telegramDis" class="icon-font"
          /></span>
        </div>
        <div class="icon-div">
          <span
            v-if="dataObj.twitterLink"
            @click="goOpenUrl(dataObj.twitterLink, 'https://twitter.com/')"
          >
            <svg-icon icon-class="Twitter" class="icon-font"
          /></span>
          <span v-else>
            <svg-icon icon-class="disTwitter" class="icon-font"
          /></span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="Warning!"
      :visible.sync="dialogTime"
      :before-close="close"
      :close-on-click-modal="false"
      width="426px"
    >
      <p class="dialog-text">
        {{ $t('workDetail.dialogTimeText') }}
      </p>
      <div class="dbtns" style="margin-top: 20px">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="dialogTime = false"
          style="width: 100%; margin: 0"
          >OK</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="Favorited by"
      :visible.sync="dialogVisible"
      :center="true"
      :destroy-on-close="true"
      width="412px"
      @close="closeDialogVisible"
    >
      <div class="dialog-loading" v-if="loading">
        <loading />
      </div>
      <ul
        v-else
        class="list dialog-ul"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <li
          v-for="item in userWorkList"
          :key="item.userAddress"
          class="table-item"
          @click="openHash(item.userAddress, 'address')"
        >
          <div class="img-item">
            <img :src="item.userImage" alt="" />
          </div>
          <div class="text-item">
            <p class="p1">{{ item.userName ? item.userName : 'Unnamed' }}</p>
            <p class="p2">{{ item.userAddress | ellipsis }}</p>
          </div>
        </li>
      </ul>
      <!-- <p v-if="loading">loading...</p>
      <p v-if="noMore">no data</p> -->
    </el-dialog>
    <div v-if="isBind">
      <component
        :is="isBindName"
        :isDialog="isBind"
        :dataObj="dataObj"
        @setEmitIsDialog="setEmitIsDialog"
        :unTopUpMintList="unTopUpMintList"
        :topUpMintList="topUpMintList"
      />
    </div>
    <div v-if="isLockDialog">
      <lock-dialog
        :isLockDialog="isLockDialog"
        @setLockDialogObj="setLockDialogObj"
        @setLockDialog="setLockDialog"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import {
  workDetail,
  canvasExists,
  userAuthority,
  workAuthority,
  daoMerkle,
  favoriteCancel,
  favoriteActions,
  favoriteWorkUser,
  merkleWork,
  workDetailNft,
  workMintTopUp,
  workMintUnTopUp,
} from '@/common/api'
import {
  mintNFT,
  transferNFTs,
  decimals,
  approveWork,
  getWorkAllowance,
  updateTopUpAccount,
  lockTopUpNFT,
} from '@/common/walletService/services'
import Loading from '@/components/Loading.vue'
import TopUpBalance from '@/components/TopUpBalance.vue'
import BindingBalance from './BindingBalanceTab.vue'
import SelectBalance from './SelectBalanceTab.vue'
import LockDialog from './LockDialog.vue'
import { copys, copysPro, countdown } from '@/utils'
import { ethers } from 'ethers'
import { Network } from '@/config.js'
import { BigNumber } from 'bignumber.js'
import { OPEN_URL } from '@/config.js'
import TokenIcon from '@/components/TokenIcon.vue'
export default {
  components: {
    MarkdownItVue,
    Loading,
    TopUpBalance,
    BindingBalance,
    SelectBalance,
    LockDialog,
    TokenIcon,
  },
  data() {
    return {
      srcList: [],
      dataObj: {
        workDescription: '',
        socialLink: [],
        topupMode: false,
        lockTime: 0,
        canvasUri: '',
      },
      loading: false,
      isLoading: true,
      dialogLoading: false,
      beforeUrl: '',
      networkId: '',
      editForm: { workId: '', description: '' },
      dialogSucc: false,
      isTransferNFTs: false,
      mainnetAddress: '',
      dialogShow: false,
      dialogMinting: false,
      dialogRestrict: false,
      dialogSuccTwo: false,
      dialogTransfer: false,
      loadingText: '',
      shareActionsPopover: false,
      myTimeDisplay: null,
      drbData: {
        h: 0,
        m: 0,
        s: 0,
      },
      dialogTime: false,
      count: 0,
      userWorkList: [],
      pageNo: 1,
      pageSize: 6,
      isIcon: false,
      topUpBalanceList: [],
      isBind: false,
      isLockDialog: false,
      nftIdentifier: null,
      isSccName: '',
      topUpMintList: [],
      unTopUpMintList: [],
      lockData: {
        h: 0,
        m: 0,
        s: 0,
      },
      myLockTimeDisplay: null,
    }
  },
  computed: {
    ...mapState(['MetaMaskAddress', 'User', 'NetworkId']),

    descriptionLength() {
      return this.editForm.description.replace(/\r\n/g, '-').length
    },
    isBindName() {
      console.log(this.dataObj, 'this.activeName', this.dataObj)
      return this.dataObj.topupMode ? 'BindingBalance' : 'SelectBalance'
    },
  },
  watch: {
    MetaMaskAddress(cur, old) {
      if (cur && old) {
        this.getData()
      }
    },
  },
  created() {
    this.networkId = Network
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.beforeUrl = from.fullPath
    })
  },

  mounted() {
    this.getData()
  },
  methods: {
    goOpenAddress(value) {
      const url = `${OPEN_URL}/address/${value}`
      this.goOpenUrl(url)
    },
    async whetherItTraded() {
      if (this.User.address) {
        const chain = await this.setChain()
        if (!chain) return false
        const isWork = await workAuthority({ daoId: this.dataObj.daoId })
        if (!isWork.data.mintWork) {
          this.errNotif('You are ineligible to mint work.')
          return false
        }
        const isAuthority = await userAuthority({
          daoId: this.dataObj.daoId,
        })

        if (isAuthority.data === 0) {
          this.dialogMinting = true
          return false
        }
        if (0 < isAuthority.data && isAuthority.data < 5) {
          return true
        }
        if (isAuthority.data >= 5) {
          this.dialogRestrict = true
          return false
        }
      } else {
        this.loginWallet()
        return false
      }
    },
    async setmintNftEmitIsDialog() {
      const isTraded = await this.whetherItTraded()
      if (isTraded) {
        this.loadingText =
          'Your transcation is being processed, it should be confirmed on the blockchain shortly.'
        this.isSccName = 'dialogSucc'
        if (this.dataObj.topupMode) {
          const mintTopList = await workMintTopUp({
            pageSize: -1,
            daoId: this.dataObj.daoId,
          })
          this.topUpMintList = mintTopList.dataList
          this.isBind = true
        } else {
          const mintTopList = await workMintUnTopUp({
            daoId: this.dataObj.daoId,
            pageSize: -1,
          })
          this.unTopUpMintList = mintTopList.dataList
          if (this.unTopUpMintList.length > 0) {
            this.isBind = true
          } else {
            this.nftIdentifier = {
              erc721Address: ethers.constants.AddressZero,
              tokenId: 0,
            }
            this.mintNft()
          }
        }
      }
    },
    setEmitIsDialog(val) {
      if (val) {
        this.nftIdentifier = val
        this.mintNft()
      } else {
        this.mainnetAddress = ''
        this.isBind = false
      }
    },
    async lockNft(val) {
      try {
        const data = {
          nftIdentifier: {
            erc721Address: this.dataObj.erc721Address,
            tokenId: this.dataObj.workNumber,
          },
          duration: val,
        }
        const tx = await lockTopUpNFT(data)
        await tx.wait()
        this.dialogLoading = false
        this.openMessageTips(
          'Your NFT has been successfully locked.',
          '',
          'success',
          null
        )
      } catch (error) {
        const err = JSON.stringify(error)
        this.errMsg(err)
        this.dialogLoading = false
        console.log(error, 'errorerrorerror')
      }
    },
    setLockDialog(val) {
      this.isLockDialog = val
    },
    setLockDialogObj(val) {
      if (val) {
        this.loadingText =
          'Your operation is being processed. It should be confirmed on the blockchain shortly.'
        this.dialogLoading = true
        this.lockNft(val)
      }
      this.isLockDialog = false
    },
    async setShou() {
      if (!this.User.address) {
        this.loginWallet()
        return
      }
      const sig = await this.getSig()
      if (sig) {
        const query = {
          type: 2,
          favoriteId: this.dataObj.workId,
        }
        const res = this.dataObj.favorited
          ? await favoriteCancel(query)
          : await favoriteActions(query)
        if (res) {
          this.dataObj.favoritesAmount += this.dataObj.favorited ? -1 : 1
          this.dataObj.favorited = !this.dataObj.favorited
        }
      }
    },
    goDaoDetail() {
      this.$router.push({
        path: '/dao',
        query: {
          id: this.dataObj.daoId,
        },
      })
    },
    goOpenUrl(url, http = null) {
      if (url) {
        if (http) {
          window.open(http + url, '_blank')
        } else {
          const newUrl = url.slice(0, 4) === 'http' ? url : 'https://' + url
          window.open(newUrl, '_blank')
        }
      }
    },
    async setMintTransfer() {
      const strArr = this.mainnetAddress.match(/^(0x)?[0-9a-fA-F]{40}$/)
      const isAddress = ethers.utils.isAddress(this.mainnetAddress)
      if (!strArr || !isAddress) {
        this.errNotif('The address is wrong, please correct it')
        return
      } else {
        this.dialogShow = false
        const isTraded = await this.whetherItTraded()
        if (isTraded) {
          this.loadingText =
            'Your transcation is being processed, it should be confirmed on the blockchain shortly.'
          this.isSccName = 'dialogSuccTwo'
          if (this.dataObj.topupMode) {
            const mintTopList = await workMintTopUp({
              pageSize: -1,
              daoId: this.dataObj.daoId,
            })
            this.topUpMintList = mintTopList.dataList
            this.isBind = true
          } else {
            const mintTopList = await workMintUnTopUp({
              daoId: this.dataObj.daoId,
              pageSize: -1,
            })
            this.unTopUpMintList = mintTopList.dataList
            if (this.unTopUpMintList.length > 0) {
              this.isBind = true
            } else {
              this.nftIdentifier = {
                erc721Address: ethers.constants.AddressZero,
                tokenId: 0,
              }
              this.mintNft()
            }
          }
        }
        // this.isBind = true
      }
    },
    async setMintTransferDio() {
      const isTraded = await this.whetherItTraded()
      console.log(isTraded, 'isTraded')
      if (isTraded) {
        this.loadingText =
          'Your transfer is being processed. It should be confirmed on the blockchain shortly.'
        this.dialogShow = true
      }
    },
    goEdit() {
      this.$router.push({
        path: '/editWorkInformation',
        query: {
          id: this.dataObj.workId,
        },
      })
    },
    copyLink() {
      const url = location.origin + '/WorkDetails?id=' + this.dataObj.workId
      copysPro(url)
      this.successNotif('Copied!')
    },
    async setTransferNFTs() {
      if (this.User.address) {
        const chain = await this.setChain()
        if (!chain) return
        this.loadingText =
          'Your transfer is being processed. It should be confirmed on the blockchain shortly.'
        const strArr = this.mainnetAddress.match(/^(0x)?[0-9a-fA-F]{40}$/)
        const isAddress = ethers.utils.isAddress(this.mainnetAddress)
        if (!strArr || !isAddress) {
          this.errNotif('The address is wrong, please correct it')
          return
        } else {
          this.dialogLoading = true
          try {
            const reqData = {
              projectId: this.dataObj.projectId,
              address: this.MetaMaskAddress,
              to: this.mainnetAddress,
              tokenId: this.dataObj.workNumber,
            }
            const tx = await transferNFTs(reqData)
            await tx.wait()
            this.dialogSucc = false
            this.dialogLoading = false
            this.dialogSuccTwo = true
          } catch (error) {
            const err = JSON.stringify(error)
            this.errMsg(err)
            this.dialogLoading = false
            console.log(error, 'errorerrorerror')
          }
        }
      } else {
        this.loginWallet()
      }
    },
    close() {
      this.dialogShow = false
      this.dialogSucc = false
      this.dialogMinting = false
      this.dialogRestrict = false
      this.dialogSuccTwo = false
      this.isTransferNFTs = false
      this.mainnetAddress = ''
      this.dialogTransfer = false
      this.dialogTime = false
    },
    transferNFTs() {
      if (this.User.address) {
        this.dialogSucc = true
        this.isTransferNFTs = true
      } else {
        this.loginWallet()
      }
    },
    goDetail(path) {
      return `${path}?type=nfts&id=${
        path === '/dao' ? this.dataObj.daoId : this.dataObj.canvasId
      }`
    },
    async setApprove(erc20Address, amount) {
      try {
        const app = await approveWork(erc20Address, amount)
        await app.wait()
        this.successNotif('Successful transaction')
        this.dialogLoading = false
      } catch (error) {
        this.errMsg(JSON.stringify(error))
        this.dialogLoading = false
      }
    },
    async mintNft() {
      BigNumber.config({ EXPONENTIAL_AT: 38 })
      this.dialogLoading = true
      try {
        const merkle = await daoMerkle({
          daoId: this.dataObj.daoId,
          type: 2,
        })

        let workPrice = Number(this.dataObj.mintedPrice)
        // payCurrencyType==='eth'
        const decimalsNum = this.dataObj.erc20PaymentMode
          ? await decimals(this.dataObj.daoErc20Address)
          : this.dataObj.inputTokenDecimals
        if (!this.dataObj.topupMode) {
          const balance = await updateTopUpAccount({
            projectId: this.dataObj.projectId,
            NftIdentifier: this.nftIdentifier,
          })
          const nameBalance = this.dataObj.erc20PaymentMode
            ? new BigNumber(balance[0].toString())
                .div(`1e${decimalsNum}`)
                .toString()
            : new BigNumber(balance[1].toString())
                .div(`1e${decimalsNum}`)
                .toString()
          const isLte = new BigNumber(nameBalance).lt(workPrice)
          if (isLte) {
            workPrice = new BigNumber(workPrice).minus(nameBalance).toString()
          } else {
            workPrice = 0
          }
        }
        console.log(workPrice, 'workPrice')
        if (Number(workPrice) > 0) {
          if (
            this.dataObj.erc20PaymentMode ||
            this.dataObj.payCurrencyType !== 'ETH'
          ) {
            const erc20Address = this.dataObj.erc20PaymentMode
              ? this.dataObj.daoErc20Address
              : this.dataObj.inputTokenAddress
            const num = new BigNumber(workPrice)
              .times(`1e${decimalsNum}`)
              .toString()
            const allowance = await getWorkAllowance(
              erc20Address,
              this.MetaMaskAddress
            )
            console.log(allowance, 'allowanceallowance')
            const appNum = new BigNumber(num).minus(allowance).toNumber()
            if (appNum > 0) {
              this.setApprove(erc20Address, num)
              return
            }
          }
        }

        const res = await canvasExists({
          daoId: this.dataObj.daoId,
          workId: this.dataObj.workId,
        })
        let merkleWorkData = null
        let canvasCreator = ethers.constants.AddressZero
        if (!res.data) {
          merkleWorkData = await merkleWork({
            workId: this.dataObj.workId,
          })
          canvasCreator = this.dataObj.creatorAddress
        }
        const reqData = {
          payCurrencyType: this.dataObj.payCurrencyType,
          daoId: this.dataObj.projectId,
          canvasId: this.dataObj.canvasId,
          tokenUri: this.dataObj.workUri,
          canvasUri: res.data ? '' : this.dataObj.canvasUri,
          proof: merkle.data.proof,
          nftFlatPrice:
            this.dataObj.fixedPrice || this.dataObj.unifiedPriceSet
              ? this.dataObj.mintedPrice
              : '0',
          signature: this.dataObj.createSignHash,
          price: workPrice,
          nftIdentifier: this.nftIdentifier,
          canvasProof: merkleWorkData ? merkleWorkData.data.proof : [],
          canvasCreator: canvasCreator,
          decimalsNum: decimalsNum,
          erc20PaymentMode: this.dataObj.erc20PaymentMode,
          nftOwner:
            this.mainnetAddress !== ''
              ? this.mainnetAddress
              : this.MetaMaskAddress,
        }
        console.log(reqData, 'reqData')
        const tx = await mintNFT(reqData)
        await tx.wait()
        this.dialogLoading = false
        this.isBind = false
        this[this.isSccName] = true
        this.isSccName = ''
        this.mainnetAddress = ''
        this.getData()
      } catch (error) {
        console.log(error, 'error')
        const err = JSON.stringify(error)
        this.errMsg(err)
        this.dialogLoading = false
        this.isBind = false
        this.isSccName = ''
        this.mainnetAddress = ''
      }
    },
    copy(hash) {
      copys(hash, this, 'Hash copied!')
    },
    async getData() {
      const data = await workDetail(this.$route.query.id)
      this.dataObj = {
        ...data.data,
        imgHeight: Math.floor((420 / 260) * data.data.height),
      }
      if (this.dataObj.workStatus === 1) {
        const listData = await workDetailNft({
          workId: this.dataObj.workId,
          pageSize: -1,
        })
        this.topUpBalanceList = listData.dataList
      }
      if (this.dataObj.workStatus === 1 && this.dataObj.workLockStatus === 1) {
        this.lockData = countdown(this.dataObj.lockTime)
        this.setLockTimeNum()
      }
      this.srcList = [this.dataObj.originalImageUrl]
      if (this.dataObj.workStatus === 0 && this.dataObj.nextDrbStartTime > 0) {
        this.dialogTime = true
        this.drbData = countdown(this.dataObj.nextDrbStartTime)
        this.setTimeNum()
      }
      this.isLoading = false
    },
    setLockTimeNum() {
      clearInterval(this.myLockTimeDisplay)
      this.myLockTimeDisplay = null
      this.myLockTimeDisplay = setInterval(() => {
        this.dataObj.lockTime -= 1
        if (this.dataObj.lockTime > 0) {
          this.lockData = countdown(this.dataObj.lockTime)
        } else {
          this.getData()
        }
      }, 1000)
    },
    setTimeNum() {
      clearInterval(this.myTimeDisplay)
      this.myTimeDisplay = null
      this.myTimeDisplay = setInterval(() => {
        this.dataObj.nextDrbStartTime -= 1
        if (this.dataObj.nextDrbStartTime > 0) {
          this.drbData = countdown(this.dataObj.nextDrbStartTime)
        } else {
          this.dialogTime = false
          this.getData()
        }
      }, 1000)
    },
    getShou() {
      if (this.dataObj.favoritesAmount === 0) return
      this.dialogVisible = true
      this.load()
    },
    closeDialogVisible() {
      this.userWorkList = []
      this.count = 0
      this.pageNo = 1
      this.dialogVisible = false
    },

    async load() {
      this.loading = true
      const query = {
        workId: this.dataObj.workId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      const data = await favoriteWorkUser(query)
      this.userWorkList = this.userWorkList.concat(data.dataList)
      this.count = data.page.count
      this.pageNo += 1
      this.loading = false
    },
  },
  beforeDestroy() {
    clearInterval(this.myTimeDisplay)
    clearInterval(this.myLockTimeDisplay)
    this.myTimeDisplay = null
    this.myLockTimeDisplay = null
  },
}
</script>
<style scoped lang="scss">
.box-card {
  width: 980px;
  margin: 0 auto;
  margin-top: 18px;
  margin-bottom: 66px;
  display: flex;
  background: #252b3a;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #6062aa;
  ::v-deep .el-divider {
    background-color: #6062aa !important;
  }
  .top-icons {
    .svg-icon {
      margin-left: 16px;
    }
  }
}

.card-center {
  margin-bottom: 24px;

  ::v-deep .el-row {
    margin-bottom: 8px;
  }

  .cen-det {
    color: #fff;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
  }

  .card-title {
    margin-bottom: 12px;
  }

  .p2-text {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }

  .text-style {
    color: #fff;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }

  .text-style2 {
    color: #b3b5f2;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    cursor: pointer;
  }

  .text-style3 {
    color: #c5dadd;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }
}

.card-link {
  .el-row {
    margin-bottom: 20px;
  }
}

.card-det {
}

.cursor {
  cursor: pointer;
  color: #b3b5f2;
}

.nocursor {
  cursor: default;
}

.md-body {
  min-height: 250px;
  overflow-y: auto;
  padding-left: 10px;
}

::v-deep .anchor {
  display: none;
}

::v-deep .markdown-body h1,
.markdown-body h2 {
  border: none;
}

.divdia {
  .el-dialog {
    max-height: 434px;
    overflow: auto;
    height: auto;
  }
}

// ::v-deep .el-dialog {
//   height: 434px;
//   overflow: auto;
// }
// .diadiv {
//   ::v-deep .el-dialog {
//     height: 444px;
//     overflow: auto;
//   }
// }
::v-deep .markdown-body {
  color: #9e9e9e;
}

::v-deep .el-image {
  display: block;
}

.dialog-ul {
  margin: 0;
  padding: 0;

  // height: 412px;
  // overflow: auto;
  li {
    list-style-type: none;
  }
}

.noCursor {
  cursor: initial !important;
}

.dialogLoading {
  height: 150px;

  p {
    font-size: 16px;
    color: #757575;
    text-align: center;
    margin: 0;
    padding: 30px 0 40px 0;
  }

  .dbtn {
    height: 32px;
    width: 206px;
    background: #b3b5f2;
    display: block;
    margin: 0 auto;
    /* drop-shadow/button-primary */
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
    border-radius: 2px;
    border: 1px solid #b3b5f2;
    color: #fff;
    font-size: 18px;
    font-family: Inter4;
  }
}

.halt {
  height: 44px;
  background-color: #6bd8e4;
  font-size: 44px;
  font-weight: 500;
  text-align: center;
  font-size: 14px;
  line-height: 44px;
}

.collect_btns {
  display: flex;
  justify-content: center;
  margin-top: 32px;

  .dbtnl {
    width: 135px;
    height: 34px;
    color: #b3b5f2;
    background-color: #fff;
    border: 1px solid #b3b5f2;
    font-size: 14px;
    margin-right: 20px;
    border-radius: 3px;
  }

  .dbtnr {
    width: 135px;
    height: 34px;
    border: 1px solid #b3b5f2;
    background-color: #b3b5f2;
    color: #ffffff;
    font-size: 14px;
    margin-left: 20px;
    border-radius: 3px;
  }
}

.dialogList {
  padding: 18px;
  box-sizing: border-box;

  ::v-deep .el-form-item__content {
    display: flex;
  }
}

::v-deep
  .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  color: #b3b5f2;
}

::v-deep .el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
  border-color: #b3b5f2;
}

::v-deep .el-textarea__inner:focus {
  border-color: #b3b5f2;
  box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
}

::v-deep .el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
  border-color: #b3b5f2;
}

::v-deep .el-form-item.is-error .el-textarea__inner {
  border-color: #b3b5f2;
}

.input-title {
  font-size: 14px;
  color: #757575;
}

::v-deep .el-textarea__inner {
  font-family: Roboto4;
  border-color: #6062aa;
  max-height: 300px;
}

::v-deep .el-textarea .el-input__count {
  height: 16px;
  line-height: 16px;
  color: #909399;
  background: transparent;
  position: absolute;
  font-size: 12px;
  bottom: -20px;
  right: 0;
}

.zdy-word-limit {
  height: 16px;
  line-height: 16px;
  color: #909399;
  background: transparent;
  position: absolute;
  font-size: 12px;
  bottom: -20px;
  right: 0;
}

.text-dialog-box {
  margin-bottom: 32px;
}

.daoname-col {
  color: #8c91ff;
  cursor: pointer;
}

.line-box {
  width: 396px;
  margin: 16px auto;
  box-sizing: border-box;
  font-size: 16px;
  color: #9e9e9e;
  display: flex;
  flex-direction: column;

  .line-title {
    margin-bottom: 12px;
  }

  .line-item {
    margin-bottom: 8px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dialog-loading .flexbox {
  height: 220px;
}

.icon-font {
  cursor: pointer;
}

.box-title {
  width: 980px;
  margin: 0 auto;
  padding: 32px;
  box-sizing: border-box;
  border-radius: 2px;
  background: #252b3a;
  margin-top: 18px !important;
  border: 1px solid #6062aa;
  ::v-deep .el-divider {
    background-color: #6062aa !important;
  }
  h3 {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  .title-top {
    color: #fff;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 8px;
    margin-top: 18px;
  }

  .title-bom {
    color: #9e9e9e;

    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}

.minbox {
  display: flex;
}

.mintitle {
  color: #9e9e9e;
  text-align: right;
  /* Body/regular */
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}

.minnum {
  color: #9e9e9e;
  text-align: center;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  margin-left: auto;
}

.workdet {
  width: 396px;
  margin: 0 auto;
  border-bottom: 1px solid #6062aa;
  box-sizing: border-box;
}

.dettitle {
  display: flex;
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 34px;
}

.detbody {
  border-radius: 2px;
  background: #252b3a;
  margin-bottom: 12px;
  padding: 2px 14px 14px 14px;
}

.deticon {
  margin-left: auto;
  margin-right: 12px;
  cursor: pointer;
}

.p2 {
  font-size: 12px;
  color: #9e9e9e;
  margin: 0;
  margin-top: 12px;

  .p2-text {
    margin-right: 24px;

    span {
      cursor: pointer;
    }
  }
}

.url-item {
  width: 100%;
  height: 68px;
  border-radius: 2px;
  background: #252b3a;
  color: #fff;

  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 2px;
  background: #2a2f41;

  .svg-icon {
    font-size: 32px;
    margin-right: 12px;
  }
}

.cen-item {
  margin: 16px 0;
}

.card-top {
  width: 100%;
  display: flex;

  .top-img {
    width: 244px;
    height: 244px;
    margin-right: 16px;
  }

  .top-text {
    flex: 1;
  }

  .text-det {
    display: flex;

    .det-mf {
      width: 50%;
      margin-right: 64px;

      ::v-deep .el-row {
        margin-bottom: 6px;
      }
    }

    .det-pri {
      width: 50%;
      margin-left: 64px;
      display: flex;
      flex-direction: column;

      ::v-deep .el-row {
        margin-bottom: 6px;
      }
    }

    .newPrice {
      color: #fff;
      text-align: center;
      font-family: Inter;
      font-size: 32px;
      font-style: normal;
      font-weight: 600;
    }

    .oldPrice {
      font-size: 12px;
      color: #757575;
      text-decoration: line-through;
    }

    .newPriceTwo {
      color: #fff;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }
  }

  .text-title {
    display: flex;
    margin-bottom: 18px;

    .top-icons {
      margin-left: auto;
    }
  }
}

.nameprice {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #9e9e9e;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
}

.new-btns-web {
  margin-bottom: 12px;
}

.f14 {
  font-size: 14px;
}

.right-name {
  color: #9e9e9e;
}

.lock-time {
  height: 48px;
  background: #7059cb;
  margin-bottom: 4px;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .time-left {
    color: #fff;
    text-align: right;
    font-family: Roboto;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
  }

  .time-right {
    display: flex;
    align-items: center;
    margin-left: auto;
    color: #fff;

    span {
      display: block;
      border-radius: 2px;
      background: #2a2f41;
      width: 32px;
      height: 32px;
      color: #fff;
      text-align: center;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      text-align: center;
      line-height: 32px;
      margin: 0 4px;
    }
  }
}
.mg0 {
  margin-bottom: 0 !important;
}
.mgbt20 {
  margin-bottom: 20px;
}
.old-fee {
  text-decoration: line-through;
}
</style>
