<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="dao-box" v-else>
    <div class="dao-title">
      <div class="title-name">{{ $t('setupNodes.editParameters') }}</div>
    </div>
    <div style="width: 1024px" class="box-type7">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <div class="type7-body">
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[1] }}</div>
          <div class="body-item">
            <!-- <el-form-item
              prop="tokenAllocation"
              v-if="!formData.thirdParty && !initData.isThirdpartyToken"
            >
              <template slot="label">
                <span
                  >The Allocation of ERC-20 Tokens
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      This parameter determines how many ERC-20 Tokenss are
                      allocated to this Nodes.<br />Keep in mind:<br />Remaining
                      ERC-20 Tokens (up to 1 billion): Tokens available for
                      allocation to each Nodes.<br />Note that Nodes Token
                      allocation is cumulative. For example, if you initially
                      allocate 5000 and later add 7000, the total will be
                      12,000, not a replacement of 5000 with 7000.
                    </div>
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.tokenAllocation"
                oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                placeholder="When editing, this value is not required."
                :disabled="!initData.isMainDaoCreator"
              ></el-input>
              <div style="color: #9e9e9e">
                All Token Reserves
                {{ initData.daoTokenAllocation }}
              </div>
            </el-form-item> -->
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.infiniteModeLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.infiniteModeTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-switch v-model="formData.infiniteMode"></el-switch>
            </el-form-item>
            <el-form-item
              prop="modifyRemainingMintWindow"
              v-if="!formData.infiniteMode"
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.modifyRemainingMintWindowLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.modifyRemainingMintWindowTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <div class="daoradio">
                <el-checkbox v-model="radioModify"
                  >Need to adjust parameters</el-checkbox
                >
              </div>
              <el-input
                v-model="formData.modifyRemainingMintWindow"
                maxlength="9"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                :placeholder="
                  $t('setupNodes.modifyRemainingMintWindowPlaceholder')
                "
                :disabled="!radioModify"
              ></el-input>
              <div style="color: #9e9e9e">
                {{ $t('setupNodes.remainingMintWindowsLabel') }} :
                {{ initData.remainingMintWindow }}
              </div>
            </el-form-item>
            <el-form-item prop="totalNftCasting">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.totalERC721MintCapLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.totalNftCastingTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <el-radio-group v-model="formData.totalNftCasting">
                <el-radio
                  :disabled="item.num <= initData.nftNumber"
                  v-for="item in castings"
                  :key="item.label"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>

            <el-form-item prop="dailyMintCap">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.dailyMintCapLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.dailyMintCapTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.dailyMintCap"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                :placeholder="$t('setupNetwork.dailyMintCapPlaceholder')"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="type7-body">
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[2] }}</div>
          <div class="body-item">
            <el-form-item
              prop="unifiedPrice"
              v-if="formData.unifiedPriceMode && initData.unifiedPrice !== 0"
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.unifiedPriceLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.unifiedPriceTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.unifiedPrice"
                oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                :placeholder="$t('setupNodes.unifiedPricePlaceholder')"
                @change="changeUnifiedPrice"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="daoFloorPrice"
              v-if="!formData.unifiedPriceMode"
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.daoFloorPriceLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.daoFloorPriceTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.daoFloorPrice"
                oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                :placeholder="$t('setupNodes.daoFloorPricePlaceholder')"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="fluctuationMethod"
              v-if="!formData.unifiedPriceMode"
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.fluctuationMethodLabel') }} :
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.fluctuationMethodTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <el-select
                v-model="formData.fluctuationMethod"
                placeholder="Please"
                @change="fluctuationMethodChange"
              >
                <el-option
                  v-for="item in fluctuationMethods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="doublingFactor"
              v-if="
                formData.fluctuationMethod === 0 && !formData.unifiedPriceMode
              "
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.doublingFactorLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.doublingFactorTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.doublingFactor"
                oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                :placeholder="$t('setupNodes.doublingFactorPlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="growthFactor"
              v-if="
                formData.fluctuationMethod === 1 && !formData.unifiedPriceMode
              "
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.growthFactorLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.growthFactorTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.growthFactor"
                oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                :placeholder="$t('setupNodes.growthFactorPlaceholder')"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="type7-body">
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[3] }}</div>
          <div class="body-item">
            <div v-if="!formData.topUpMode">
              <div class="forminfo">
                {{ $t('setupNodes.nodeLevelLabel') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('setupNodes.nodeLevelTip')"
                  placement="top"
                >
                  <span><i class="el-icon-info" /> </span
                ></el-tooltip>
              </div>
              <el-form-item>
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.ethAllocationLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.ethAllocationTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:
                  </span>
                </template>
                <div>
                  <div v-if="formData.thirdParty">
                    <el-row
                      v-for="(item, idx) in ethAllocation"
                      :key="item.name"
                      :class="idx === 0 ? 'noMg' : ''"
                    >
                      <el-col :span="16" v-if="idx > 0">{{ item.name }}</el-col>
                      <el-col :span="5" :offset="1" v-if="idx > 0"
                        ><div :class="idx === 1 ? 'textColor' : ''">
                          <el-input
                            v-model="item.value"
                            oninput="if(isNaN(value)||Number(value)<0) { value = 0 } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                            size="mini"
                            :disabled="idx === 2"
                            @change="setETHAllocationChange(item.value, idx)"
                          >
                            <span slot="suffix">%</span>
                          </el-input>
                          <!-- {{ item.value }} <span class="percent">%</span> -->
                        </div></el-col
                      >
                    </el-row>
                    <el-row>
                      <el-col :span="16"
                        >{{ $t('setupNodes.ethToOtherNodesLabel') }}
                      </el-col>
                      <el-col :span="5" :offset="1"
                        ><div class="otherColor">
                          <el-input
                            v-model="ethAllocationDaosNum"
                            size="mini"
                            disabled
                          >
                            <span slot="suffix">%</span>
                          </el-input>
                        </div></el-col
                      >
                    </el-row>
                  </div>
                  <div v-else>
                    <el-row
                      v-for="(item, idx) in ethAllocation"
                      :key="item.name"
                    >
                      <el-col :span="16">{{ item.name }}</el-col>
                      <el-col :span="5" :offset="1"
                        ><div :class="idx === 1 ? 'textColor' : ''">
                          <el-input
                            v-model="item.value"
                            oninput="if(isNaN(value)||Number(value)<0) { value = 0 } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                            size="mini"
                            :disabled="idx === 2"
                            @change="setETHAllocationChange(item.value, idx)"
                          >
                            <span slot="suffix">%</span>
                          </el-input>
                          <!-- {{ item.value }} <span class="percent">%</span> -->
                        </div></el-col
                      >
                    </el-row>
                    <el-row>
                      <el-col :span="16"
                        >{{ $t('setupNodes.ethToOtherNodesLabel') }}
                      </el-col>
                      <el-col :span="5" :offset="1"
                        ><div class="otherColor">
                          <el-input
                            v-model="ethAllocationDaosNum"
                            size="mini"
                            disabled
                          >
                            <span slot="suffix">%</span>
                          </el-input>
                        </div></el-col
                      >
                    </el-row>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.erc20AllocationLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.erc20AllocationTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:
                  </span>
                </template>
                <div>
                  <el-row v-for="(item, idx) in daoAllocation" :key="item.name">
                    <el-col :span="16">{{ item.name }}</el-col>
                    <el-col :span="5" :offset="1"
                      ><div :class="idx === 0 ? 'textErcColor' : ''">
                        <el-input
                          v-model="item.value"
                          oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                          size="mini"
                          :disabled="idx === 1"
                          @change="setDaoAllocationChange(item.value, idx)"
                        >
                          <span slot="suffix">%</span>
                        </el-input>
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                      >{{ $t('setupNodes.erc20ToOtherNodesLabel') }}
                    </el-col>
                    <el-col :span="5" :offset="1"
                      ><div class="ercotherColor">
                        <el-input
                          v-model="daoAllocationDaosNum"
                          size="mini"
                          disabled
                        >
                          <span slot="suffix">%</span>
                        </el-input>
                      </div></el-col
                    >
                  </el-row>
                </div>
              </el-form-item>
              <div class="forminfo">
                {{ $t('setupNodes.assetsInteractswithOtherNodesLabel') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('setupNodes.assetsInteractswithOtherNodesTip')"
                  placement="top"
                >
                  <span><i class="el-icon-info" /> </span
                ></el-tooltip>
              </div>

              <el-form-item>
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.ethToOtherNodesLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.ethToOtherNodesTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:
                  </span>
                </template>
                <div>
                  <el-row
                    v-for="(item, idx) in ethAllocationDaos"
                    :key="item.name"
                  >
                    <el-col :span="16">{{ item.daoName }}</el-col>
                    <el-col :span="5" :offset="1"
                      ><div>
                        <span class="percent"> {{ item.value }}%</span>
                      </div></el-col
                    >
                    <el-col :span="2"
                      ><span class="closeeth" @click="deleteEthAllocations(idx)"
                        ><i class="el-icon-circle-close"></i></span
                    ></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="btn-eth" @click="setEthAllocation">
                        <span><i class="el-icon-plus"></i> Add More Nodes</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.erc20ToOtherNodesLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.erc20ToOtherNodesTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:
                  </span>
                </template>
                <div>
                  <el-row
                    v-for="(item, idx) in daoAllocationDaos"
                    :key="item.name"
                  >
                    <el-col :span="16">{{ item.daoName }}</el-col>
                    <el-col :span="5" :offset="1"
                      ><div>
                        <span class="daopercent"> {{ item.value }}%</span>
                      </div></el-col
                    >
                    <el-col :span="2"
                      ><span class="closeeth" @click="deleteDaoAllocations(idx)"
                        ><i class="el-icon-circle-close"></i></span
                    ></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="btn-eth" @click="setDaoAllocation">
                        <span><i class="el-icon-plus"></i> Add More Nodes</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <div class="forminfo">
                {{ $t('setupNodes.thisNodesInternalIncentivesLaabel') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('setupNodes.thisNodesInternalIncentivesTip')"
                  placement="top"
                >
                  <span><i class="el-icon-info" /> </span
                ></el-tooltip>
              </div>
              <el-form-item
                prop="daoPriceReserveRatio"
                v-if="!formData.unifiedPriceMode"
              >
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.erc721MintFeeLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.erc721MintFeeTip')"
                      placement="top"
                    >
                      <span><i class="el-icon-info" /> </span></el-tooltip
                    >:
                  </span>
                </template>
                <div class="token-box">
                  <div class="token-title">
                    {{ $t('setupNodes.floatingMintPriceLabel') }} :
                  </div>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.builderFeeLabel') }}
                      </span>
                      <el-input
                        v-model="formData.daoPriceReserveRatio.builder"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.subNodesFeeLabel') }}
                      </span>
                      <el-input
                        v-model="formData.daoPriceReserveRatio.subDAO"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col
                      :span="12"
                      v-if="!formData.daoTokenMode && !formData.thirdParty"
                    >
                      <span class="token-name">Seed Nodes Fee</span>
                      <el-input
                        v-model="formData.daoPriceReserveRatio.mainDAO"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.semiosFeeLabel') }}
                      </span>
                      <el-input
                        v-model="formData.daoPriceReserveRatio.pDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix"
                          ><span class="old-fee">{{ oldFee[0] }}</span
                          >%</span
                        >
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <el-form-item prop="fixedPriceReserveRatio">
                <template slot="label" v-if="formData.unifiedPriceMode">
                  <span
                    >{{ $t('setupNodes.erc721MintFeeLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.erc721MintFeeTip')"
                      placement="top"
                    >
                      <span><i class="el-icon-info" /> </span></el-tooltip
                    >:
                  </span>
                </template>
                <div class="token-box">
                  <div class="token-title">
                    {{ $t('setupNodes.fixedMintPriceLabel') }} :
                  </div>
                  <!-- <div class="token-info">
              The reserve ratio for the fixed price will vary based on the
              reserve ratio for the canvas minting fee, ensuring that the DAO
              mint fee proportion for the fixed price is 5% higher than the DAO
              mint fee proportion for the canvas minting fee, while still
              remaining within 97.5%.
            </div> -->
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.builderFeeLabel') }}
                      </span>
                      <el-input
                        v-model="formData.fixedPriceReserveRatio.builder"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.subNodesFeeLabel') }}
                      </span>
                      <el-input
                        v-model="formData.fixedPriceReserveRatio.subDAO"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col
                      :span="12"
                      v-if="!formData.daoTokenMode && !formData.thirdParty"
                    >
                      <span class="token-name">Seed Nodes Fee</span>
                      <el-input
                        v-model="formData.fixedPriceReserveRatio.mainDAO"
                        oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.semiosFeeLabel') }}
                      </span>
                      <el-input
                        v-model="formData.fixedPriceReserveRatio.pDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix"
                          ><span class="old-fee">{{ oldFee[0] }}</span
                          >%</span
                        >
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.erc20IncentivesLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.erc20IncentivesTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:
                  </span>
                </template>
                <div class="token-box ERC20Incentives">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.builderIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.royalty.builder"
                        size="mini"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        @change="setRoyaltyBuilderChange"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.minterIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.royalty.minter"
                        size="mini"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        @change="setRoyaltyMinterChange"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.starterIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.royalty.subDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.semiosIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.royalty.pDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix"
                          ><span class="old-fee" style="color: #ece76d">{{
                            oldFee[1]
                          }}</span
                          >%</span
                        >
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>

              <el-form-item>
                <template slot="label">
                  <span
                    >{{ $t('setupNodes.ethIncentivesLabel') }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('setupNodes.ethIncentivesTip')"
                      placement="top"
                    >
                      <span>
                        <i class="el-icon-info" />
                      </span> </el-tooltip
                    >:
                  </span>
                </template>
                <div class="token-box ETHIncentives">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.builderIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.eth.builder"
                        size="mini"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(Number(value)>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        @change="setETHBuilderChange"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.minterIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.eth.minter"
                        size="mini"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(Number(value)>100) { value = 100 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        @change="setETHMinterChange"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.starterIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.eth.subDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name"
                        >{{ $t('setupNodes.semiosIncentivesLabel') }}
                      </span>
                      <el-input
                        v-model="formData.eth.pDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix"
                          ><span class="old-fee" style="color: #a8e21e">{{
                            oldFee[1]
                          }}</span
                          >%</span
                        >
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </div>
            <div v-else class="topupclass">
              Since top-up mode is enabled, you do not need to edit any asset
              allocation parameters.
            </div>
          </div>
        </div>
      </el-form>
      <div class="btns">
        <button class="elbtns-b" @click="goBack">Back</button>
        <button
          class="elbtns-l"
          style="margin-left: 20px"
          v-preventReClick
          @click="onSubmit"
        >
          Submit
        </button>
      </div>
      <!-- <div class="new-btn">
        <button class="elbtns-b" style="margin-left: 155px" @click="goBack">
          Back
        </button>
        <el-button type="primary" class="el-dao-btnz" @click="onSubmit"
          >Submit</el-button
        >
      </div> -->
    </div>

    <el-dialog
      title="Title"
      :visible.sync="isSetEthAllocation"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeSetAllocation"
    >
      <div class="dialog_allocation">
        <span class="allocatableClass"
          >{{ $t('setupNodes.allocatableRatioLabel') }} :
          {{ ethAllocation[2].value }}%</span
        >
        <el-form
          ref="allocationEthForm"
          :model="allocationForm"
          label-width="140px"
          :hide-required-asterisk="nohide"
          :rules="allocationFormEthRules"
        >
          <el-form-item prop="name">
            <template slot="label">
              <span>{{ $t('setupNodes.selectNodesLabel') }} : </span>
            </template>
            <el-select v-model="allocationForm.name" placeholder="Please">
              <el-option
                v-for="item in eTHAllocationDaos"
                :key="item.projectId"
                :label="item.daoName"
                :value="item.projectId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.ratioLabel') }} : </span>
            </template>
            <el-input
              type="text"
              oninput="if(isNaN(value)||Number(value)<0) { value =0}if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              placeholder="Please"
              v-model="allocationForm.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn">
          <el-button type="info" @click="closeSetAllocation">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="setEthAllocations"
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="Title"
      :visible.sync="isSetDaoAllocation"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeSetAllocation"
    >
      <div class="dialog_allocation">
        <span class="allocatableClass"
          >{{ $t('setupNodes.allocatableRatioLabel') }} :
          {{ daoAllocation[1].value }}%</span
        >

        <el-form
          ref="allocationDaoForm"
          :model="allocationForm"
          label-width="140px"
          :hide-required-asterisk="nohide"
          :rules="allocationFormDaoRules"
        >
          <el-form-item prop="name">
            <template slot="label">
              <span
                >{{ $t('setupNodes.setupNodesLabel') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Please select a floor price"
                  placement="top"
                >
                  <span>
                    <i class="el-icon-info" />
                  </span> </el-tooltip
                >:
              </span>
            </template>
            <el-select v-model="allocationForm.name" placeholder="Please">
              <el-option
                v-for="item in daoTokenAllocationDaos"
                :key="item.projectId"
                :label="item.daoName"
                :value="item.projectId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="value">
            <template slot="label">
              <span
                >{{ $t('setupNodes.ratioLabel') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="The price increases exponentially,  the price calculation formula is: current price * doubling factor."
                  placement="top"
                >
                  <span><i class="el-icon-info" /> </span></el-tooltip
                >:
              </span>
            </template>
            <el-input
              type="text"
              oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
              placeholder="Please"
              v-model="allocationForm.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn">
          <el-button type="info" @click="closeSetAllocation">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="setDaoAllocations"
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="Edit"
      :visible.sync="dialogLoading"
      :center="true"
      width="412px"
      top="20vh"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialogLoading">
        <div class="dialog-loading">
          <loading />
        </div>
        <p class="dialog-text">Please continue in the wallet...</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import { distribute, allcationList } from '@/common/api'
import { BigNumber } from 'bignumber.js'
import _ from 'lodash'
import { setDaoParamsServicr } from '@/common/walletService/services'
export default {
  components: { Loading },
  data() {
    return {
      oldFee: [2.5, 2],
      isLoading: true,
      dialogLoading: false,
      nohide: true,
      radioModify: false,
      formData: {
        daoName: '',
        daoStartDate: '',
        lotteryMode: true,
        thirdParty: false,
        erc20ContractAddress: '',
        tokenAllocation: 0,
        infiniteMode: false,
        daoMintWindow: 1,
        modifyRemainingMintWindow: null,
        totalNftCasting: 2,
        dailyMintCap: '10000',
        needMintableWork: true,
        passesQuantity: '1000',
        daoTokenMode: false,
        unifiedPriceMode: true,
        unifiedPrice: '0.01',
        daoFloorPrice: 0,
        fluctuationMethod: 0,
        doublingFactor: 2,
        growthFactor: 0.1,
        topUpMode: false,
        daoPriceReserveRatio: {
          builder: 0,
          mainDAO: 97.5,
          pDao: 0,
          subDAO: 2.5,
        },
        fixedPriceReserveRatio: {
          builder: 0,
          mainDAO: 97.5,
          pDao: 0,
          subDAO: 2.5,
        },
        royalty: {
          pDao: 0,
          subDao: 50,
          builder: 25,
          minter: 25,
        },
        eth: { pDao: 0, subDao: 50, builder: 25, minter: 25 },
      },
      rules: {
        daoStartDate: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        // erc20ContractAddress: [
        //   {
        //     required: true,
        //     message: "Field is required",
        //     trigger: "change",
        //   },
        //   {
        //     validator: async (rule, value, callback) => {
        //       const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/);
        //       const isAddress = ethers.utils.isAddress(value);
        //       if (!strArr || !isAddress) {
        //         const str = "Wrong address please modify and resubmit.";
        //         return callback(new Error(str));
        //       }
        //       return;
        //     },
        //     trigger: ["change"],
        //   },
        // ],
        fluctuationMethod: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        growthFactor: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        doublingFactor: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              if (Number(value) < 1) {
                return callback(new Error('This field cannot less than 1'))
              }
              return
            },
            trigger: ['change'],
          },
        ],
        daoMintWindow: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        modifyRemainingMintWindow: [
          // {
          //   required: true,
          //   message: "This field is required",
          //   trigger: "change",
          // },
          {
            validator: async (rule, value, callback) => {
              if (this.radioModify) {
                if (!value) {
                  return callback(new Error('This field is required'))
                }
              } else {
                return
              }
            },
            trigger: ['change'],
          },
        ],
        totalNftCasting: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        tokenAllocation: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              if (Number(value) < 0) {
                return callback(new Error('This field cannot less than 0'))
              }
              if (Number(value) > this.initData.daoTokenAllocation) {
                return callback(
                  new Error(
                    `This field cannot exceed ${this.initData.daoTokenAllocation}`
                  )
                )
              }
              return
            },
            trigger: ['change'],
          },
        ],
        dailyMintCap: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              if (Number(value) > 10000) {
                return callback(new Error('This field cannot exceed 10000'))
              }
              if (Number(value) < 1) {
                return callback(new Error('This field cannot less than 1'))
              }
              return
            },
            trigger: ['change'],
          },
        ],
        daoFloorPrice: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              if (Number(value) < 0.0001) {
                return callback(new Error('This field cannot less than 0.0001'))
              }
              return
            },
            trigger: ['change'],
          },
        ],
        unifiedPrice: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              if (Number(value) < 0.0001) {
                return callback(new Error('This field cannot less than 0.0001'))
              }
              return
            },
            trigger: ['change'],
          },
        ],
        daoPriceReserveRatio: [
          {
            validator: async (rule, value, callback) => {
              if (
                value.builder >= 0 &&
                value.mainDAO >= 0 &&
                value.pDao >= 0 &&
                value.subDAO >= 0.1
              ) {
                const num = new BigNumber(value.builder)
                  .plus(value.mainDAO)
                  .plus(value.pDao)
                  .plus(value.subDAO)
                  .toNumber()
                if (num !== 100) {
                  return callback(new Error('The sum must equal 100%'))
                } else {
                  return
                }
              } else {
                if (value.subDAO < 0.1) {
                  return callback(new Error('subnodes mint fee >0.1'))
                } else {
                  return callback(new Error('Field is required'))
                }
              }
            },
            trigger: ['blur', 'change'],
          },
        ],
        fixedPriceReserveRatio: [
          {
            validator: async (rule, value, callback) => {
              if (
                value.builder >= 0 &&
                value.mainDAO >= 0 &&
                value.pDao >= 0 &&
                value.subDAO >= 0.1
              ) {
                const num = new BigNumber(value.builder)
                  .plus(value.mainDAO)
                  .plus(value.pDao)
                  .plus(value.subDAO)
                  .toNumber()
                if (num !== 100) {
                  return callback(new Error('The sum must equal 100%'))
                } else {
                  return
                }
              } else {
                if (value.subDAO < 2.5) {
                  return callback(new Error('subnodes mint fee >0.1'))
                } else {
                  return callback(new Error('Field is required'))
                }
              }
            },
            trigger: ['blur', 'change'],
          },
        ],
      },
      castings: [
        { label: '1k', value: 0, num: 1000 },
        { label: '5k', value: 1, num: 5000 },
        { label: '10k', value: 2, num: 10000 },
        { label: '50k', value: 3, num: 50000 },
        { label: '100k', value: 4, num: 100000 },
      ],
      fluctuationMethods: [
        { label: 'Exponential Increase', value: 0 },
        { label: 'Linear Increase', value: 1 },
      ],
      ethAllocation: [
        {
          name: 'For Seed Nodes Redeem Pool',
          value: 100,
        },
        {
          name: 'This Nodes Internal Incentives',
          value: 0,
        },
        {
          name: 'This Nodes Reserves',
          value: 0,
        },
      ],
      ethAllocationDaos: [],
      daoAllocation: [
        {
          name: 'This Nodes Internal Incentives',
          value: 100,
        },
        {
          name: 'This Nodes Reserves',
          value: 0,
        },
      ],
      daoAllocationDaos: [],
      isSetEthAllocation: false,
      isSetDaoAllocation: false,
      allocationForm: {
        name: '',
        value: '',
      },

      allocationFormEthRules: {
        name: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const list = this.ethAllocationDaos.map((item) => item.name)
            if (list.indexOf(value) > -1) {
              return callback(new Error('This DAO is already in the list'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const aNum = this.ethAllocation[2].value

            if (value > aNum) {
              return callback(new Error('The sum cannot exceed 100%'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      allocationFormDaoRules: {
        name: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const list = this.daoAllocationDaos.map((item) => item.name)
            if (list.indexOf(value) > -1) {
              return callback(new Error('This DAO is already in the list'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const aNum = this.daoAllocation[1].value

            if (value > aNum) {
              return callback(new Error('The sum cannot exceed 100%'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      eTHAllocationDaos: [],
      daoTokenAllocationDaos: [],
      decimalsNum: '1e18',
      daoAllocationDaosNum: 0,
      ethAllocationDaosNum: 0,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    changeDaoTokenMode(val) {
      if (val) {
        this.formData.daoPriceReserveRatio.mainDAO = 0
        this.formData.daoPriceReserveRatio.builder =
          100 -
          Number(this.formData.daoPriceReserveRatio.pDao) -
          Number(this.formData.daoPriceReserveRatio.subDAO)

        this.formData.fixedPriceReserveRatio.mainDAO = 0
        this.formData.fixedPriceReserveRatio.builder =
          100 -
          Number(this.formData.fixedPriceReserveRatio.pDao) -
          Number(this.formData.fixedPriceReserveRatio.subDAO)
      } else {
        this.formData.daoPriceReserveRatio.builder =
          this.initData.unFixedReserveRatio.canvasMintFee
        this.formData.daoPriceReserveRatio.mainDAO =
          this.initData.unFixedReserveRatio.redeemPoolMintFee
        this.formData.fixedPriceReserveRatio.builder =
          this.initData.fixedReserveRatio.canvasMintFee
        this.formData.fixedPriceReserveRatio.mainDAO =
          this.initData.fixedReserveRatio.redeemPoolMintFee
      }
    },
    fetchkeyArr(a, b, key = 'name') {
      const arrA = a.map((item) => item[key])
      const arrB = b.map((item) => item[key])
      return _.uniq([...arrA, ...arrB])
    },
    fetchvalArr(a, b) {
      return a.map((item) => {
        const obj = _.find(b, ['name', item])
        return obj ? new BigNumber(obj.value).times(100).toString() : '0'
      })
    },
    async getData() {
      const res = await distribute({
        daoId: this.$route.query.id,
      })
      this.initData = { ...res.data }
      console.log(this.initData, ' this.initData')
      // daoMintWindow
      this.decimalsNum = this.initData.daoTokenMode
        ? `1e${this.initData.erc20TokenDecimals}`
        : `1e${this.initData.inputTokenDecimals}`
      console.log(this.decimalsNum, ' this.decimalsNum')
      this.formData = {
        ...this.formData,
        ...res.data,
        lotteryMode: res.data.royaltyTokenLotteryMode,
        thirdParty: res.data.isThirdpartyToken,
        // tokenAllocation: res.data.daoTokenAllocation,
        daoMintWindow: res.data.daoMintWindow,
        totalNftCasting: res.data.totalNftMintCap,
        dailyMintCap: res.data.dailyMintCap,
        // needMintableWork: true,
        // passesQuantity: "1000",
        unifiedPriceMode: res.data.unifiedPriceSet,
        unifiedPrice: res.data.unifiedPrice,
        daoFloorPrice: res.data.daoFloorPrice,
        topUpMode: res.data.topupMode,
        daoPriceReserveRatio: {
          builder: res.data.unFixedReserveRatio.canvasMintFee,
          mainDAO: res.data.unFixedReserveRatio.redeemPoolMintFee,
          pDao: res.data.unFixedReserveRatio.d4aMintFee,
          subDAO: res.data.unFixedReserveRatio.daoMintFee,
        },
        fixedPriceReserveRatio: {
          builder: res.data.fixedReserveRatio.canvasMintFee,
          mainDAO: res.data.fixedReserveRatio.redeemPoolMintFee,
          pDao: res.data.fixedReserveRatio.d4aMintFee,
          subDAO: res.data.fixedReserveRatio.daoMintFee,
        },
        royalty: {
          pDao: res.data.daoRoyaltyToken.d4aReward,
          subDao: res.data.daoRoyaltyToken.daoReward,
          builder: res.data.daoRoyaltyToken.canvasReward,
          minter: res.data.daoRoyaltyToken.minterReward,
        },
        eth: {
          pDao: res.data.daoEthRoyaltyToken.d4aReward,
          subDao: res.data.daoEthRoyaltyToken.daoCreatorETHReward,
          builder: res.data.daoEthRoyaltyToken.canvasCreatorETHReward,
          minter: res.data.daoEthRoyaltyToken.minterETHReward,
        },
        fluctuationMethod: res.data.canvasPriceFluctuationMethod,
        doublingFactor:
          res.data.canvasPriceFluctuationMethod === 0
            ? new BigNumber(res.data.fluctuationMethodFactor)
                .div(10000)
                .toString()
            : 2,
        growthFactor:
          res.data.canvasPriceFluctuationMethod === 1
            ? new BigNumber(res.data.fluctuationMethodFactor)
                .div(this.decimalsNum)
                .toString()
            : 0.1,
      }
      console.log(this.formData, ' this.formData')
      this.ethAllocation = [
        {
          name: 'For Seed Nodes Redeem Pool',
          value: res.data.ethAllocation[0],
        },
        {
          name: 'This Nodes Internal Incentives',
          value: res.data.ethAllocation[1],
        },
        {
          name: 'This Nodes Reserves',
          value: res.data.ethAllocation[2],
        },
      ]
      this.ethAllocationDaos = res.data.daoEthAllocationVos.map((item) => {
        this.ethAllocationDaosNum = new BigNumber(this.ethAllocationDaosNum)
          .plus(item.royaltyProportion)
          .toNumber()
        return {
          name: item.projectId,
          value: item.royaltyProportion,
          daoName: item.daoName,
        }
      })
      // daoAllocationDaosNum: 0,
      // ethAllocationDaosNum: 0,
      this.daoAllocation = [
        {
          name: 'This Nodes Internal Incentives',
          value: res.data.daoAllocation[0],
        },
        {
          name: 'This Nodes Reserves',
          value: res.data.daoAllocation[1],
        },
      ]
      this.daoAllocationDaos = res.data.daoTokenAllocationVos.map((item) => {
        this.daoAllocationDaosNum = new BigNumber(this.daoAllocationDaosNum)
          .plus(item.royaltyProportion)
          .toNumber()
        return {
          name: item.projectId,
          value: item.royaltyProportion,
          daoName: item.daoName,
        }
      })
      const resList = await allcationList({ daoId: this.$route.query.id })
      this.eTHAllocationDaos = resList.dataList.filter(
        (item) => item.topupMode !== true
      )
      this.daoTokenAllocationDaos = resList.dataList
      this.isLoading = false
    },
    deleteEthAllocations(idx) {
      this.ethAllocation[2].value = new BigNumber(this.ethAllocation[2].value)
        .plus(this.ethAllocationDaos[idx].value)
        .toNumber()
      this.ethAllocationDaosNum = new BigNumber(
        this.ethAllocationDaosNum
      ).minus(this.ethAllocationDaos[idx].value)
      this.ethAllocationDaos.splice(idx, 1)
    },
    deleteDaoAllocations(idx) {
      this.daoAllocation[1].value = new BigNumber(this.daoAllocation[1].value)
        .plus(this.daoAllocationDaos[idx].value)
        .toNumber()
      this.daoAllocationDaosNum = new BigNumber(this.daoAllocationDaosNum)
        .minus(this.daoAllocationDaos[idx].value)
        .toNumber()
      this.daoAllocationDaos.splice(idx, 1)
    },
    setEthAllocations() {
      this.$refs.allocationEthForm.validate((valid) => {
        if (valid) {
          this.ethAllocation[2].value = new BigNumber(
            this.ethAllocation[2].value
          )
            .minus(this.allocationForm.value)
            .toNumber()
          const key = this.eTHAllocationDaos.find(
            (item) => item.projectId === this.allocationForm.name
          )
          console.log(key, 'key')
          this.ethAllocationDaos.push({
            ...this.allocationForm,
            daoName: key.daoName,
          })
          this.ethAllocationDaosNum =
            this.ethAllocationDaosNum + Number(this.allocationForm.value)
          this.$refs.allocationEthForm.resetFields()
          this.isSetEthAllocation = false
          this.allocationForm = {
            name: '',
            value: '',
          }
        }
      })
    },
    changeUnifiedPrice() {
      if (!this.formData.unifiedPrice) {
        this.formData.unifiedPrice = 0
        return
      }
      if (this.formData.unifiedPrice > 1000000000) {
        this.formData.unifiedPrice = 1000000000
        return
      }
    },
    setDaoAllocations() {
      this.$refs.allocationDaoForm.validate((valid) => {
        if (valid) {
          this.daoAllocation[1].value = new BigNumber(
            this.daoAllocation[1].value
          )
            .minus(this.allocationForm.value)
            .toNumber()
          const key = this.daoTokenAllocationDaos.find(
            (item) => item.projectId === this.allocationForm.name
          )
          console.log(key, 'key')
          this.daoAllocationDaos.push({
            ...this.allocationForm,
            daoName: key.daoName,
          })

          this.daoAllocationDaosNum =
            this.daoAllocationDaosNum + Number(this.allocationForm.value)
          this.$refs.allocationDaoForm.resetFields()
          this.isSetDaoAllocation = false
          this.allocationForm = {
            name: '',
            value: '',
          }
        }
      })
    },
    closeSetAllocation() {
      if (this.$refs.allocationEthForm) {
        this.$refs.allocationEthForm.resetFields()
      }
      if (this.$refs.allocationDaoForm) {
        this.$refs.allocationDaoForm.resetFields()
      }
      this.isSetEthAllocation = false
      this.isSetDaoAllocation = false
    },
    setEthAllocation() {
      this.isSetEthAllocation = true
    },
    setDaoAllocation() {
      this.isSetDaoAllocation = true
    },

    setDaoAllocationChange(val, idx) {
      if (isNaN(val) || val === '' || Number(val) < 0) {
        val = 0
        this.daoAllocation[idx].value = 0
      }
      let num = 0
      this.daoAllocationDaos.map(
        (item) => (num = new BigNumber(num).plus(item.value).toNumber())
      )
      const letNum = 100 - num
      // if(this.daoAllocationDaos)
      if (val > letNum) {
        this.daoAllocation[idx].value = letNum
        this.daoAllocation[1].value = 0
      } else {
        this.daoAllocation[1].value = letNum - Number(val)
      }
    },
    setETHAllocationChange(val, idx) {
      if (isNaN(val) || val === '' || Number(val) < 0) {
        val = 0
        this.ethAllocation[idx].value = 0
      }
      if (idx === 0) {
        let strNum = 0
        this.ethAllocationDaos.map(
          (item) => (strNum = new BigNumber(strNum).plus(item.value))
        )
        const letNum = new BigNumber(100)
          .minus(strNum)
          .minus(this.ethAllocation[1].value)
          .toNumber()
        if (val > letNum) {
          this.ethAllocation[0].value = letNum
          this.ethAllocation[2].value = 0
        } else {
          this.ethAllocation[2].value = new BigNumber(letNum)
            .minus(val)
            .toNumber()
        }
      }
      if (idx === 1) {
        let strNum = 0
        this.ethAllocationDaos.map(
          (item) => (strNum = new BigNumber(strNum).plus(item.value))
        )
        const letNum = 100 - strNum - Number(this.ethAllocation[0].value)
        if (val > letNum) {
          this.ethAllocation[1].value = letNum
          this.ethAllocation[2].value = 0
        } else {
          this.ethAllocation[2].value = new BigNumber(letNum)
            .minus(val)
            .toNumber()
        }
      }
    },
    fluctuationMethodChange(val) {
      if (val === 0) {
        this.formData.doublingFactor = 2
      } else {
        this.formData.growthFactor = 0.1
      }
    },
    onSubmit() {
      if (this.$refs.ruleForm.validate) {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            BigNumber.config({ EXPONENTIAL_AT: 38 })
            this.dialogLoading = true
            try {
              const childrenDaoId = this.fetchkeyArr(
                this.ethAllocationDaos,
                this.daoAllocationDaos
              )
              const childrenDaoRatiosERC20 = this.fetchvalArr(
                childrenDaoId,
                this.daoAllocationDaos
              )
              const childrenDaoRatiosETH = this.fetchvalArr(
                childrenDaoId,
                this.ethAllocationDaos
              )

              console.log(this.initData, 'this.initData')
              console.log(
                this.formData,
                'this.formDatathis.formDatathis.formData'
              )
              const changeInfiniteMode =
                this.initData.infiniteMode === this.formData.infiniteMode
                  ? false
                  : true

              let remainingRound = null
              console.log(changeInfiniteMode, 'changeInfiniteMode')
              if (changeInfiniteMode) {
                remainingRound = this.formData.infiniteMode
                  ? 0
                  : this.radioModify
                  ? this.formData.modifyRemainingMintWindow
                  : 1
                // if (this.formData.infiniteMode) {
                //   remainingRound =0
                // } else {
                //   remainingRound =this.formData.modifyRemainingMintWindow
                // }
              } else {
                console.log(this.radioModify, 'this.radioModify')
                remainingRound = this.formData.infiniteMode
                  ? 0
                  : this.radioModify
                  ? this.formData.modifyRemainingMintWindow
                  : 0
              }
              console.log(remainingRound, 'remainingRound')
              const req = {
                daoId: this.initData.projectId,
                nftMaxSupplyRank: this.formData.totalNftCasting,
                remainingRound: remainingRound,
                daoFloorPrice: this.formData.unifiedPriceMode
                  ? new BigNumber(0.001).times(this.decimalsNum).toString()
                  : new BigNumber(this.formData.daoFloorPrice)
                      .times(this.decimalsNum)
                      .toString(),
                priceTemplateType: this.formData.fluctuationMethod,
                nftPriceFactor:
                  this.formData.fluctuationMethod === 0
                    ? new BigNumber(this.formData.doublingFactor)
                        .times(10000)
                        .toString()
                    : new BigNumber(this.formData.growthFactor)
                        .times(this.decimalsNum)
                        .toString(),
                dailyMintCap: this.formData.dailyMintCap,
                // initialTokenSupply: this.formData.tokenAllocation
                //   ? new BigNumber(this.formData.tokenAllocation)
                //       .times(decimalsNum)
                //       .toString()
                //   : '0',
                unifiedPrice: this.formData.unifiedPrice
                  ? new BigNumber(this.formData.unifiedPrice)
                      .times(this.decimalsNum)
                      .toString()
                  : '0',
                changeInfiniteMode: changeInfiniteMode,
                setChildrenParam: {
                  childrenDaoId: childrenDaoId,
                  childrenDaoOutputRatios: childrenDaoRatiosERC20,
                  childrenDaoInputRatios: childrenDaoRatiosETH,
                  redeemPoolInputRatio: new BigNumber(
                    this.ethAllocation[0].value
                  )
                    .times(100)
                    .toString(),
                  treasuryOutputRatio: 0,
                  treasuryInputRatio: 0,
                  selfRewardOutputRatio: new BigNumber(
                    this.daoAllocation[0].value
                  )
                    .times(100)
                    .toString(),
                  selfRewardInputRatio: new BigNumber(
                    this.ethAllocation[1].value
                  )
                    .times(100)
                    .toString(),
                },
                allRatioForFundingParam: {
                  canvasCreatorMintFeeRatio: new BigNumber(
                    this.formData.daoPriceReserveRatio.builder
                  )
                    .times(100)
                    .toString(),
                  assetPoolMintFeeRatio: new BigNumber(
                    this.formData.daoPriceReserveRatio.subDAO
                  )
                    .times(100)
                    .toString(),
                  redeemPoolMintFeeRatio: new BigNumber(
                    this.formData.daoPriceReserveRatio.mainDAO
                  )
                    .times(100)
                    .toString(),
                  treasuryMintFeeRatio: 0,
                  canvasCreatorMintFeeRatioFiatPrice: new BigNumber(
                    this.formData.fixedPriceReserveRatio.builder
                  )
                    .times(100)
                    .toString(),
                  assetPoolMintFeeRatioFiatPrice: new BigNumber(
                    this.formData.fixedPriceReserveRatio.subDAO
                  )
                    .times(100)
                    .toString(),
                  redeemPoolMintFeeRatioFiatPrice: new BigNumber(
                    this.formData.fixedPriceReserveRatio.mainDAO
                  )
                    .times(100)
                    .toString(),
                  treasuryMintFeeRatioFiatPrice: 0,
                  minterOutputRewardRatio: new BigNumber(
                    this.formData.royalty.minter
                  )
                    .times(100)
                    .toString(),
                  canvasCreatorOutputRewardRatio: new BigNumber(
                    this.formData.royalty.builder
                  )
                    .times(100)
                    .toString(),
                  daoCreatorOutputRewardRatio: new BigNumber(
                    this.formData.royalty.subDao
                  )
                    .times(100)
                    .toString(),
                  minterInputRewardRatio: new BigNumber(
                    this.formData.eth.minter
                  )
                    .times(100)
                    .toString(),
                  canvasCreatorInputRewardRatio: new BigNumber(
                    this.formData.eth.builder
                  )
                    .times(100)
                    .toString(),
                  daoCreatorInputRewardRatio: new BigNumber(
                    this.formData.eth.subDao
                  )
                    .times(100)
                    .toString(),
                },
              }
              console.log(req, 'reqreqreqreqreqreqreqreqreq')
              const tx = await setDaoParamsServicr(req)
              await tx.wait()
              this.successNotif('Updated!')
              this.dialogLoading = false
            } catch (error) {
              console.log(error, 'error')
              this.dialogLoading = false
              const err = error.toString()
              this.errMsg(err)
            }
          }
        })
      }
    },
    daoFloorPriceChange(val) {
      if (val === 9999) {
        this.formData.fluctuationMethod = 0
        this.formData.doublingFactor = 2
        this.formData.growthFactor = 0.1
      }
    },
    setRoyaltyMinterChange(val) {
      if (val === '') {
        this.formData.royalty.minter = 0
      } else {
        this.formData.royalty.minter = val
      }
      if (this.formData.royalty.minter >= 100) {
        this.formData.royalty.subDao = 0
        this.formData.royalty.builder = 0
      } else {
        const addTop = new BigNumber(this.formData.royalty.builder)
          .plus(this.formData.royalty.minter)
          .toNumber()
        if (addTop >= 100) {
          this.formData.royalty.builder = new BigNumber(100)
            .minus(this.formData.royalty.minter)
            .toNumber()
          this.formData.royalty.subDao = 0
        } else {
          this.formData.royalty.subDao = new BigNumber(100)
            .minus(this.formData.royalty.builder)
            .minus(this.formData.royalty.minter)
            .toNumber()
        }
      }
    },
    setRoyaltyBuilderChange(val) {
      if (val === '') {
        this.formData.royalty.builder = 0
      } else {
        this.formData.royalty.builder = val
      }
      if (this.formData.royalty.builder >= 100) {
        this.formData.royalty.subDao = 0
        this.formData.royalty.minter = 0
      } else {
        const addTop = new BigNumber(this.formData.royalty.builder)
          .plus(this.formData.royalty.minter)
          .toNumber()
        if (addTop >= 100) {
          this.formData.royalty.minter = new BigNumber(100)
            .minus(this.formData.royalty.builder)
            .toNumber()
          this.formData.royalty.subDao = 0
        } else {
          this.formData.royalty.subDao = new BigNumber(100)
            .minus(this.formData.royalty.builder)
            .minus(this.formData.royalty.minter)
            .toNumber()
        }
      }
    },
    setETHMinterChange(val) {
      if (val === '') {
        this.formData.eth.minter = 0
      } else {
        this.formData.eth.minter = val
      }
      if (this.formData.eth.minter >= 100) {
        this.formData.eth.subDao = 0
        this.formData.eth.builder = 0
      } else {
        const addTop = new BigNumber(this.formData.eth.builder)
          .plus(this.formData.eth.minter)
          .toNumber()
        if (addTop >= 100) {
          this.formData.eth.builder = new BigNumber(100)
            .minus(this.formData.eth.minter)
            .toNumber()
          this.formData.eth.subDao = 0
        } else {
          this.formData.eth.subDao = new BigNumber(100)
            .minus(this.formData.eth.builder)
            .minus(this.formData.eth.minter)
            .toNumber()
        }
      }
    },
    setETHBuilderChange(val) {
      if (val === '') {
        this.formData.eth.builder = 0
      } else {
        this.formData.eth.builder = val
      }
      if (this.formData.eth.builder >= 100) {
        this.formData.eth.builder = 100
        this.formData.eth.subDao = 0
        this.formData.eth.minter = 0
      } else {
        const addTop = new BigNumber(this.formData.eth.builder)
          .plus(this.formData.eth.minter)
          .toNumber()
        if (addTop >= 100) {
          this.formData.eth.minter = new BigNumber(100)
            .minus(this.formData.eth.builder)
            .toNumber()
          this.formData.eth.subDao = 0
        } else {
          this.formData.eth.subDao = new BigNumber(100)
            .minus(this.formData.eth.builder)
            .minus(this.formData.eth.minter)
            .toNumber()
        }
      }
    },
  },
}
</script>
<style scoped lang="scss">
.dao-box {
  align-items: center;
  // width: 500px;
  flex: 1;
  display: flex;
  // align-items: center;
  flex-direction: column;
}
.dao-title {
  // margin-top: 24px;
  margin-bottom: 40px;
  width: 100%;
  .title-name {
    color: #f3f3f3;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    height: 84px;
    line-height: 84px;
    text-align: center;
    border-bottom: 0.5px solid #6062aa;
    margin-bottom: 16px;
  }
}
.box-type7 {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
.type7-body {
  border: 1px solid #6062aa;
  margin-bottom: 32px;
}
.body-item {
  width: 90%;
  margin: 0 auto;
}
.type7-title {
  color: #bbbaba;

  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  height: 58px;
  border-bottom: 1px solid #6062aa;
  padding: 0 30px;
  box-sizing: border-box;
  margin-bottom: 14px;
  line-height: 58px;
}
.new-btn {
  text-align: center;
  margin: 60px 0;
}
.allocation-btn {
  text-align: center;
}
.forminfo {
  color: #fff;
  text-align: right;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  text-align: center;
  margin-bottom: 22px;
}
.percent {
  float: right;
  color: #ef8c44;
}
.daopercent {
  float: right;
  color: #f282be;
}
.el-row {
  color: #9e9e9e;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.el-col-16 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.closeeth {
  float: right;
  cursor: pointer;
}
.closeeth:hover {
  color: #745cd4;
}
.closeeth:active {
  color: #745cd4;
}
.btn-eth {
  border-radius: 2px;
  border: 1px dashed #745cd4;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  box-sizing: border-box;
}
.btn-eth:hover {
  color: #745cd4;
}
.btn-eth:active {
  color: #745cd4;
}
.token-box {
  color: #9e9e9e;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #9e9e9e;

  /* Body/regular */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  ::v-deep .el-input--suffix .el-input__inner {
    padding: 0 15px;
  }
  .el-color-picker__icon,
  .el-input,
  .el-textarea {
    width: 50%;
  }
  ::v-deep .el-col-12 {
    display: flex;
    padding-right: 50px !important;
  }
  ::v-deep .el-form-item__label {
    width: 140px !important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 140px !important;
  }
  .token-name {
    width: 290px;
    margin-right: 10px;
    color: #9e9e9e;
  }
  .token-title {
    color: #9e9e9e;
  }
  .token-info {
    color: rgba(0, 0, 0, 0.45);
    line-height: 24px;
    margin-bottom: 12px;
  }
}
.dialog_box {
  display: flex;
  flex-direction: column;
  .el-select {
    width: 100%;
  }
  ::v-deep .el-button {
    margin: 0;
    margin-bottom: 12px;
    border-radius: 2px;
    background: #fff;
    color: #745cd4;
    border: none;
    text-align: center;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    height: 44px !important;
  }
  .el-button:active {
    color: #745cd4;
  }
  .el-button:hover {
    color: #745cd4;
  }
}

.dialog_allocation {
  display: flex;
  flex-direction: column;
  .el-select {
    width: 100%;
  }
}
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.topupclass {
  color: #9e9e9e;

  text-align: right;
  /* Body/regular */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
  height: 60px;
  line-height: 60px;
}
.daoradio {
  text-align: end;
}
.textColor {
  ::v-deep .el-input__inner {
    color: #a8e21e;
  }
}
.otherColor {
  ::v-deep .el-input__inner {
    color: #ef8c44;
  }
}
.ercotherColor {
  ::v-deep .el-input__inner {
    color: #f282be;
  }
}
.textErcColor {
  ::v-deep .el-input__inner {
    color: #ece76d;
  }
}
.ERC20Incentives {
  ::v-deep .el-input__inner {
    color: #ece76d;
  }
}
.ETHIncentives {
  ::v-deep .el-input__inner {
    color: #a8e21e;
  }
}
.allocatableClass {
  text-align: center;
  color: #fff;
  font-size: 18px;
  margin-bottom: 14px;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.old-fee {
  text-decoration: line-through;
}
</style>
