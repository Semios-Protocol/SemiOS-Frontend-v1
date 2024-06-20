<template>
  <div class="dao-box" :class="type <= 2 ? 'boxcenter' : ''">
    <div class="dao-title" v-if="type > 2 && type < 8">
      <div class="title-tap">
        <div v-if="!$route.query.id">
          <span class="name-icon" :class="type >= 3 ? 'activetype' : ''">
            <span v-if="type > 3"> <i class="el-icon-check" /></span>
            <span v-else>1</span> </span
          >{{ $t('setupNodes.tabNameList')[0] }}
        </div>
        <div class="parting" v-if="!$route.query.id"></div>
        <div>
          <span class="name-icon" :class="type >= 4 ? 'activetype' : ''">
            <span v-if="type > 4"> <i class="el-icon-check" /></span>
            <span v-else>{{ $route.query.id ? '1' : '2' }}</span> </span
          >{{ $t('setupNodes.tabNameList')[1] }}
        </div>
        <div class="parting"></div>
        <div>
          <span class="name-icon" :class="type >= 5 ? 'activetype' : ''">
            <span v-if="type > 5"> <i class="el-icon-check" /></span>
            <span v-else>{{ $route.query.id ? '2' : '3' }}</span> </span
          >{{ $t('setupNodes.tabNameList')[2] }}
        </div>
        <div class="parting"></div>
        <div>
          <span class="name-icon" :class="type >= 6 ? 'activetype' : ''">
            <span v-if="type > 6"> <i class="el-icon-check" /></span>
            <span v-else>{{ $route.query.id ? '3' : '4' }}</span></span
          >{{ $t('setupNodes.tabNameList')[3] }}
        </div>
        <div class="parting"></div>
        <div>
          <span class="name-icon" :class="type >= 7 ? 'activetype' : ''">
            <span v-if="type > 7"> <i class="el-icon-check" /></span>
            <span v-else>{{ $route.query.id ? '4' : '5' }}</span></span
          >{{ $t('setupNodes.tabNameList')[4] }}
        </div>
      </div>
      <div class="title-name">{{ $t('setupNodes.tabNameList')[type - 3] }}</div>
      <div class="title-text">
        {{ $t('setupNodes.titleText')[type - 3] }}
      </div>
    </div>
    <div v-if="type === 8" class="dao-title" style="width: 100%">
      <div class="title-name">{{ $t('setupNodes.titleName') }}</div>
    </div>
    <div v-if="type <= 2" class="box-type1">
      <div class="bar-type1">
        <svg-icon
          icon-class="SEMIOSlogoAll"
          style="margin: 0px; font-size: 240px"
        />
      </div>
      <p class="type-name">{{ $t('index.title') }}</p>
      <p class="type-text">{{ $t('index.description') }}</p>
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        :hide-required-asterisk="nohide"
        @submit.native.prevent
      >
        <el-form-item prop="daoName">
          <el-input v-model="formData.daoName" placeholder="Name"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="setType(1)">Submit</el-button>
    </div>
    <!-- //TODO  -->
    <div v-if="type === 3" style="width: 840px" class="box-type3">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <el-form-item prop="inputToken">
          <template slot="label">
            <span
              >{{ $t('setupNodes.inputTokenLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.inputTokenTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-select
            v-model="formData.inputToken"
            placeholder="Please"
            @change="changeInputToken"
          >
            <el-option
              v-for="item in inputTokenList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="inputTokenErc20ContractAddress"
          v-if="!formData.inputToken"
        >
          <template slot="label">
            <span
              >{{ $t('setupNodes.inputTokenErc20ContractAddressLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.inputTokenErc20ContractAddressTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.inputTokenErc20ContractAddress"
            :placeholder="
              $t('setupNodes.inputTokenErc20ContractAddressPlaceholder')
            "
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.thirdPartyLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.thirdPartyTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-radio-group
            v-model="formData.thirdParty"
            @change="thirdPartyChange"
          >
            <el-radio
              v-for="item in outputType"
              :key="item.label"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="erc20ContractAddress" v-if="formData.thirdParty">
          <template slot="label">
            <span
              >{{ $t('setupNodes.erc20ContractAddressLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.erc20ContractAddressTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.erc20ContractAddress"
            :placeholder="$t('setupNodes.erc20ContractAddressPlaceholder')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="new-btn">
        <el-button type="primary" class="el-dao-btnz" @click="setType(4)"
          >Next</el-button
        >
      </div>
    </div>
    <div v-if="type === 4" style="width: 840px" class="box-type3">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <el-form-item prop="daoStartDate">
          <template slot="label">
            <span
              >{{ $t('setupNodes.daoStartDateLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.daoStartDateTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-date-picker
            v-model="formData.daoStartDate"
            type="date"
            :disabled="!daoTime || !daoTime.currentTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="Nodes Block Window "
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="!formData.daoTokenMode">
          <template slot="label">
            <span
              >{{ $t('setupNodes.topUpModeLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.topUpModeTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-switch v-model="formData.topUpMode"></el-switch>
        </el-form-item>
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
        <el-form-item prop="daoMintWindow" v-if="!formData.infiniteMode">
          <template slot="label">
            <span
              >{{ $t('setupNodes.daoMintWindowLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.daoMintWindowTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.daoMintWindow"
            maxlength="9"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
            :placeholder="$t('setupNodes.daoMintWindowPlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="daoMintWindowDuration">
          <template slot="label">
            <span
              >{{ $t('setupNodes.daoMintWindowDurationLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.daoMintWindowDurationTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <el-input
            v-model="formData.daoMintWindowDuration"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
            maxlength="9"
            :placeholder="$t('setupNodes.daoMintWindowDurationPlaceholder')"
          >
            <span slot="suffix">Hours</span></el-input
          >
        </el-form-item>
        <el-form-item prop="totalNftCasting">
          <template slot="label">
            <span
              >{{ $t('setupNodes.totalNftCastingLabel') }}
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
            :placeholder="$t('setupNodes.dailyMintCapPlaceholder')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="new-btn">
        <el-button type="info" @click="goBack(3)">Back</el-button>
        <el-button type="primary" class="el-dao-btnz" @click="setType(5)"
          >Next</el-button
        >
      </div>
    </div>
    <div v-if="type === 5" style="width: 840px" class="box-type4">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.needMintableWorkLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.needMintableWorkTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-switch v-model="formData.needMintableWork"></el-switch>
        </el-form-item>
        <el-form-item prop="passesQuantity" v-if="formData.needMintableWork">
          <template slot="label">
            <span>{{ $t('setupNodes.passesQuantityLabel') }} : </span>
          </template>
          <el-input
            v-model="formData.passesQuantity"
            :placeholder="$t('setupNodes.passesQuantityPlaceholder')"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
            @change="changePassesQuantity"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!formData.topUpMode">
          <template slot="label">
            <span
              >{{ $t('setupNodes.daoTokenModeLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.daoTokenModeTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-switch
            v-model="formData.daoTokenMode"
            @change="changeDaoTokenMode"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.unifiedPriceModeLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.unifiedPriceModeTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-switch v-model="formData.unifiedPriceMode"></el-switch>
        </el-form-item>
        <el-form-item prop="unifiedPrice" v-if="formData.unifiedPriceMode">
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
          <span v-if="formData.unifiedPrice === '0'" class="unified-price">{{
            $t('setupNodes.unifiedPriceWarn')
          }}</span>
        </el-form-item>
        <el-form-item prop="daoFloorPrice" v-if="!formData.unifiedPriceMode">
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
              >{{ $t('setupNodes.fluctuationMethodLabel') }}
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
          v-if="formData.fluctuationMethod === 0 && !formData.unifiedPriceMode"
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
          v-if="formData.fluctuationMethod === 1 && !formData.unifiedPriceMode"
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
      </el-form>
      <div class="new-btn">
        <el-button type="info" @click="goBack(4)">Back</el-button>
        <el-button type="primary" class="el-dao-btnz" @click="setType(6)"
          >Next</el-button
        >
      </div>
    </div>
    <div v-if="type === 6" style="width: 880px" class="box-type5">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="290px"
        :rules="rules"
      >
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.lotteryModeLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.lotteryModeTip')"
                placement="top"
              >
                <span><i class="el-icon-info" /> </span></el-tooltip
              >:
            </span>
          </template>
          <el-switch v-model="formData.lotteryMode"></el-switch>
        </el-form-item>
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
              <div v-if="formData.thirdParty || initData.isThirdpartyToken">
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
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
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
                  <el-col :span="16">{{
                    $t('setupNodes.ethToOtherNodesLabel')
                  }}</el-col>
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
                <el-row v-for="(item, idx) in ethAllocation" :key="item.name">
                  <el-col :span="16">{{ item.name }}</el-col>
                  <el-col :span="5" :offset="1"
                    ><div :class="idx === 1 ? 'textColor' : ''">
                      <el-input
                        v-model="item.value"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
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
                  <el-col :span="16">{{
                    $t('setupNodes.ethToOtherNodesLabel')
                  }}</el-col>
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
                <el-col :span="16">{{
                  $t('setupNodes.erc20ToOtherNodesLabel')
                }}</el-col>
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
              <span>
                {{ $t('setupNodes.ethToOtherNodesLabel') }}
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
              <el-row v-for="(item, idx) in ethAllocationDaos" :key="item.name">
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
              <el-row v-for="(item, idx) in daoAllocationDaos" :key="item.name">
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
              <span>
                {{ $t('setupNodes.erc721MintFeeLabel') }}
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
                  <span class="token-name">{{
                    $t('setupNodes.builderFeeLabel')
                  }}</span>
                  <el-input
                    v-model="formData.daoPriceReserveRatio.builder"
                    oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                    size="mini"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <span class="token-name">{{
                    $t('setupNodes.subNodesFeeLabel')
                  }}</span>
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
                  v-if="
                    !formData.daoTokenMode &&
                    !formData.thirdParty &&
                    !initData.isThirdpartyToken
                  "
                >
                  <span class="token-name">{{
                    $t('setupNodes.seedNodesFeeLabel')
                  }}</span>
                  <el-input
                    v-model="formData.daoPriceReserveRatio.mainDAO"
                    oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                    size="mini"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <span class="token-name">{{
                    $t('setupNodes.semiosFeeLabel')
                  }}</span>
                  <el-input
                    v-model="formData.daoPriceReserveRatio.pDao"
                    size="mini"
                    disabled
                  >
                    <span slot="suffix">
                      <span class="old-fee">{{ oldFee[0] }}</span
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
                  <span class="token-name">{{
                    $t('setupNodes.builderFeeLabel')
                  }}</span>
                  <el-input
                    v-model="formData.fixedPriceReserveRatio.builder"
                    oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                    size="mini"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <span class="token-name">{{
                    $t('setupNodes.subNodesFeeLabel')
                  }}</span>
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
                  v-if="
                    !formData.daoTokenMode &&
                    !formData.thirdParty &&
                    !initData.isThirdpartyToken
                  "
                >
                  <span class="token-name">{{
                    $t('setupNodes.seedNodesFeeLabel')
                  }}</span>
                  <el-input
                    v-model="formData.fixedPriceReserveRatio.mainDAO"
                    oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                    size="mini"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <span class="token-name">{{
                    $t('setupNodes.semiosFeeLabel')
                  }}</span>
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
                  <span class="token-name">{{
                    $t('setupNodes.builderIncentivesLabel')
                  }}</span>
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
                  <span class="token-name">{{
                    $t('setupNodes.minterIncentivesLabel')
                  }}</span>
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
                  <span class="token-name">{{
                    $t('setupNodes.starterIncentivesLabel')
                  }}</span>
                  <el-input
                    v-model="formData.royalty.subDao"
                    size="mini"
                    disabled
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <span class="token-name">{{
                    $t('setupNodes.semiosIncentivesLabel')
                  }}</span>
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
                  <span class="token-name">{{
                    $t('setupNodes.builderIncentivesLabel')
                  }}</span>
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
                  <span class="token-name">{{
                    $t('setupNodes.minterIncentivesLabel')
                  }}</span>
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
                  <span class="token-name">{{
                    $t('setupNodes.starterIncentivesLabel')
                  }}</span>
                  <el-input v-model="formData.eth.subDao" size="mini" disabled>
                    <span slot="suffix">%</span>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <span class="token-name">{{
                    $t('setupNodes.semiosIncentivesLabel')
                  }}</span>
                  <el-input v-model="formData.eth.pDao" size="mini" disabled>
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
      </el-form>
      <div class="new-btn">
        <el-button type="info" @click="goBack(5)">Back</el-button>
        <el-button type="primary" class="el-dao-btnz" @click="setType(7)"
          >Next</el-button
        >
      </div>
    </div>
    <div v-if="type === 7" style="width: 880px" class="box-type5">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <div class="forminfo">{{ $t('setupNodes.builderLabel') }}</div>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.blacklistAddressLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.blacklistAddressTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <div>
            <el-row v-for="(item, idx) in workBlacklistAddress" :key="item">
              <el-col :span="22"
                ><div class="address-box">{{ item }}</div>
              </el-col>
              <el-col :span="2"
                ><span class="closeeth" @click="deleteWorkBlackAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setWorkBlack">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistAddressLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.whitelistAddressTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <div>
            <el-row v-for="(item, idx) in workWhitelistAddress" :key="item">
              <el-col :span="22"
                ><div class="address-box">{{ item }}</div>
              </el-col>
              <el-col :span="2"
                ><span class="closeeth" @click="deleteWorkWhiteAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setWorkWhite">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span>{{ $t('setupNodes.whitelistedNFTLabel') }} : </span>
          </template>
          <div>
            <el-row
              v-for="(item, idx) in workNftlistAddress"
              :key="'NFT' + item.address + item.tokenId"
            >
              <el-col :span="22">
                <div class="address-box">
                  <div>{{ item.address }}</div>
                  <div class="num-div">
                    {{ $t('setupNodes.tokenIdLabel') }} : {{ item.tokenId }}
                  </div>
                </div>
              </el-col>
              <el-col :span="2"
                ><span class="closeeth" @click="deleteWorkNftAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setWorkNft">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>

        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistErc721Label') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.whitelistErc721Tip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-info" />
                </span> </el-tooltip
              >:
            </span>
          </template>
          <div>
            <el-row v-for="(item, idx) in workErclistAddress" :key="item">
              <el-col :span="22"
                ><div class="address-box">{{ item }}</div>
              </el-col>
              <el-col :span="2"
                ><span class="closeeth" @click="deleteWorkErcAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setWorkErc">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <div class="forminfo">{{ $t('setupNodes.minterLabel') }}</div>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.blacklistAddressLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.blacklistAddressTip')"
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
              v-for="(item, idx) in mintingBlacklistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">{{ item }}</div>
              </el-col>
              <el-col :span="2"
                ><span class="closeeth" @click="deleteMintingBlackAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingBlack">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistAddressWithMaxMintingLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.whitelistAddressWithMaxMintingTip')"
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
              v-for="(item, idx) in mintingWithMaxlistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">
                  <div>{{ item.value }}</div>
                  <div class="num-div">Amount : {{ item.amount }}</div>
                </div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingWithMaxAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingWithMax">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistAddressWithUnlimitedMintingLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  $t('setupNodes.whitelistAddressWithUnlimitedMintingTip')
                "
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
              v-for="(item, idx) in mintingWithUnlimitedlistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">{{ item }}</div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingWithUnlimitedAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingWithUnlimited">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistedNFTWithMaxMintingLabel') }} :
            </span>
          </template>
          <div>
            <el-row
              v-for="(item, idx) in mintingNftWithMaxlistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">
                  <div>{{ item.address }}</div>
                  <div class="num-div">
                    {{ $t('setupNodes.tokenIdLabel') }} : {{ item.tokenId }}
                  </div>
                  <div class="num-div">Amount : {{ item.amount }}</div>
                </div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingNftWithMaxAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingNftWithMax">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistedNFTWithUnlimitedMintingLabel') }} :
            </span>
          </template>
          <div>
            <el-row
              v-for="(item, idx) in mintingNftWithUnlimitedlistAddress"
              :key="'MintingNft' + item.address"
            >
              <el-col :span="22"
                ><div class="address-box">
                  <div>{{ item.address }}</div>
                  <div class="num-div">
                    {{ $t('setupNodes.tokenIdLabel') }} : {{ item.tokenId }}
                  </div>
                </div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingNftWithUnlimitedAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingNftWithUnlimited">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistedERC721WithMaxMintingLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.whitelistedERC721WithMaxMintingTip')"
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
              v-for="(item, idx) in mintingErcWithMaxlistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">
                  <div>{{ item.value }}</div>
                  <div class="num-div">Amount : {{ item.amount }}</div>
                </div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingErcWithMaxAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingErcWithMax">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>

        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.whitelistERC721WithUnlimitedMintingLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  $t('setupNodes.whitelistERC721WithUnlimitedMintingTip')
                "
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
              v-for="(item, idx) in mintingErcWithUnlimitedlistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">{{ item }}</div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingErcWithUnlimitedAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingErcWithUnlimited">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span
              >{{ $t('setupNodes.unifiedMintingCapForNodeLabel') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('setupNodes.unifiedMintingCapForNodeTip')"
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
              v-for="(item, idx) in mintingCapForDaolistAddress"
              :key="'Minting' + item"
            >
              <el-col :span="22"
                ><div class="address-box">{{ item.value }}</div>
              </el-col>
              <el-col :span="2"
                ><span
                  class="closeeth"
                  @click="deleteMintingCapForDaoAddress(idx)"
                  ><i class="el-icon-circle-close"></i></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="btn-eth" @click="setMintingCapForDao">
                  <span><i class="el-icon-plus"></i></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <div class="new-btn">
        <el-button type="info" @click="goBack(6)">Back</el-button>
        <el-button type="primary" class="el-dao-btnz" @click="setType(8)"
          >Next</el-button
        >
      </div>
    </div>

    <div v-if="type === 8" style="width: 1024px" class="box-type7">
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="320px"
        :rules="rules"
      >
        <div
          class="type7-body"
          style="margin-top: 38px"
          v-if="!$route.query.id"
        >
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[0] }}</div>
          <div class="body-item">
            <el-form-item prop="inputToken">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.inputTokenLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.inputTokenTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-select
                v-model="formData.inputToken"
                placeholder="Please"
                @change="changeInputToken"
              >
                <el-option
                  v-for="item in inputTokenList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="inputTokenErc20ContractAddress"
              v-if="!formData.inputToken"
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.inputTokenErc20ContractAddressLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      $t('setupNodes.inputTokenErc20ContractAddressTip')
                    "
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.inputTokenErc20ContractAddress"
                :placeholder="
                  $t('setupNodes.inputTokenErc20ContractAddressPlaceholder')
                "
              ></el-input>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.thirdPartyLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.thirdPartyTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-radio-group
                v-model="formData.thirdParty"
                @change="thirdPartyChange"
              >
                <el-radio
                  v-for="item in outputType"
                  :key="item.label"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              prop="erc20ContractAddress"
              v-if="formData.thirdParty"
            >
              <template slot="label">
                <span
                  >{{ $t('setupNodes.erc20ContractAddressLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.erc20ContractAddressTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.erc20ContractAddress"
                :placeholder="$t('setupNodes.erc20ContractAddressPlaceholder')"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="type7-body">
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[1] }}</div>
          <div class="body-item">
            <el-form-item prop="daoStartDate">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.daoStartDateLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.daoStartDateTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-date-picker
                v-model="formData.daoStartDate"
                type="date"
                :disabled="!daoTime || !daoTime.currentTime"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="Nodes Block Window "
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="!formData.daoTokenMode">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.topUpModeLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.topUpModeTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-switch v-model="formData.topUpMode"></el-switch>
            </el-form-item>
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
            <el-form-item prop="daoMintWindow" v-if="!formData.infiniteMode">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.daoMintWindowLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.daoMintWindowTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.daoMintWindow"
                maxlength="9"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                :placeholder="$t('setupNodes.daoMintWindowPlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item prop="daoMintWindowDuration">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.daoMintWindowDurationLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.daoMintWindowDurationTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <el-input
                v-model="formData.daoMintWindowDuration"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                maxlength="9"
                :placeholder="$t('setupNodes.daoMintWindowDurationPlaceholder')"
              >
                <span slot="suffix">Hours</span></el-input
              >
            </el-form-item>
            <el-form-item prop="totalNftCasting">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.totalNftCastingLabel') }}
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
                :placeholder="$t('setupNodes.dailyMintCapPlaceholder')"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="type7-body">
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[2] }}</div>
          <div class="body-item">
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.needMintableWorkLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.needMintableWorkTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-switch v-model="formData.needMintableWork"></el-switch>
            </el-form-item>
            <el-form-item
              prop="passesQuantity"
              v-if="formData.needMintableWork"
            >
              <template slot="label">
                <span>{{ $t('setupNodes.passesQuantityLabel') }} : </span>
              </template>
              <el-input
                v-model="formData.passesQuantity"
                :placeholder="$t('setupNodes.passesQuantityPlaceholder')"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                @change="changePassesQuantity"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="!formData.topUpMode">
              <template slot="label">
                <span
                  >{{ $t('setupNodes.daoTokenModeLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.daoTokenModeTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-switch
                v-model="formData.daoTokenMode"
                @change="changeDaoTokenMode"
              ></el-switch>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.unifiedPriceModeLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.unifiedPriceModeTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-switch v-model="formData.unifiedPriceMode"></el-switch>
            </el-form-item>
            <el-form-item prop="unifiedPrice" v-if="formData.unifiedPriceMode">
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
              <span
                v-if="formData.unifiedPrice === '0'"
                class="unified-price"
                >{{ $t('setupNodes.unifiedPriceWarn') }}</span
              >
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
                  >{{ $t('setupNodes.fluctuationMethodLabel') }}
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
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.lotteryModeLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.lotteryModeTip')"
                    placement="top"
                  >
                    <span><i class="el-icon-info" /> </span></el-tooltip
                  >:
                </span>
              </template>
              <el-switch v-model="formData.lotteryMode"></el-switch>
            </el-form-item>
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
                  <div v-if="formData.thirdParty || initData.isThirdpartyToken">
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
                            oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
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
                      <el-col :span="16">{{
                        $t('setupNodes.ethToOtherNodesLabel')
                      }}</el-col>
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
                            oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
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
                      <el-col :span="16">{{
                        $t('setupNodes.ethToOtherNodesLabel')
                      }}</el-col>
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
                    <el-col :span="16">{{
                      $t('setupNodes.erc20ToOtherNodesLabel')
                    }}</el-col>
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
                      <span class="token-name">{{
                        $t('setupNodes.builderFeeLabel')
                      }}</span>
                      <el-input
                        v-model="formData.daoPriceReserveRatio.builder"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name">{{
                        $t('setupNodes.subNodesFeeLabel')
                      }}</span>
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
                      v-if="
                        !formData.daoTokenMode &&
                        !formData.thirdParty &&
                        !initData.isThirdpartyToken
                      "
                    >
                      <span class="token-name">{{
                        $t('setupNodes.seedNodesFeeLabel')
                      }}</span>
                      <el-input
                        v-model="formData.daoPriceReserveRatio.mainDAO"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name">{{
                        $t('setupNodes.semiosFeeLabel')
                      }}</span>
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
                    {{ $t('setupNodes.fixedMintPriceLabel') }}: :
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
                      <span class="token-name">{{
                        $t('setupNodes.builderFeeLabel')
                      }}</span>
                      <el-input
                        v-model="formData.fixedPriceReserveRatio.builder"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name">{{
                        $t('setupNodes.subNodesFeeLabel')
                      }}</span>
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
                      v-if="
                        !formData.daoTokenMode &&
                        !formData.thirdParty &&
                        !initData.isThirdpartyToken
                      "
                    >
                      <span class="token-name">{{
                        $t('setupNodes.seedNodesFeeLabel')
                      }}</span>
                      <el-input
                        v-model="formData.fixedPriceReserveRatio.mainDAO"
                        oninput="if(isNaN(value)||Number(value)<0) { value = 0 }if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}"
                        size="mini"
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name">{{
                        $t('setupNodes.semiosFeeLabel')
                      }}</span>
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
                      <span class="token-name">{{
                        $t('setupNodes.builderIncentivesLabel')
                      }}</span>
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
                      <span class="token-name">{{
                        $t('setupNodes.minterIncentivesLabel')
                      }}</span>
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
                      <span class="token-name">{{
                        $t('setupNodes.starterIncentivesLabel')
                      }}</span>
                      <el-input
                        v-model="formData.royalty.subDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name">{{
                        $t('setupNodes.semiosIncentivesLabel')
                      }}</span>
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
                      <span class="token-name">{{
                        $t('setupNodes.builderIncentivesLabel')
                      }}</span>
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
                      <span class="token-name">{{
                        $t('setupNodes.minterIncentivesLabel')
                      }}</span>
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
                      <span class="token-name">{{
                        $t('setupNodes.starterIncentivesLabel')
                      }}</span>
                      <el-input
                        v-model="formData.eth.subDao"
                        size="mini"
                        disabled
                      >
                        <span slot="suffix">%</span>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <span class="token-name">{{
                        $t('setupNodes.semiosIncentivesLabel')
                      }}</span>
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
          </div>
        </div>
        <div class="type7-body">
          <div class="type7-title">{{ $t('setupNodes.tabNameList')[4] }}</div>
          <div class="forminfo">{{ $t('setupNodes.builderLabel') }}</div>
          <div class="body-item">
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.blacklistAddressLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.blacklistAddressTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <div>
                <el-row v-for="(item, idx) in workBlacklistAddress" :key="item">
                  <el-col :span="22"
                    ><div class="address-box">{{ item }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span class="closeeth" @click="deleteWorkBlackAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setWorkBlack">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.whitelistAddressLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.whitelistAddressTip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <div>
                <el-row v-for="(item, idx) in workWhitelistAddress" :key="item">
                  <el-col :span="22"
                    ><div class="address-box">{{ item }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span class="closeeth" @click="deleteWorkWhiteAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setWorkWhite">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span>{{ $t('setupNodes.whitelistedNFTLabel') }} : </span>
              </template>
              <div>
                <el-row
                  v-for="(item, idx) in workNftlistAddress"
                  :key="'NFT' + item.address + item.tokenId"
                >
                  <el-col :span="22">
                    <div class="address-box">
                      <div>{{ item.address }}</div>
                      <div class="num-div">
                        {{ $t('setupNodes.tokenIdLabel') }} : {{ item.tokenId }}
                      </div>
                    </div>
                    <!-- <div class="address-box">{{ item }}</div> -->
                  </el-col>
                  <el-col :span="2"
                    ><span class="closeeth" @click="deleteWorkNftAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setWorkNft">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.whitelistErc721Label') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.whitelistErc721Tip')"
                    placement="top"
                  >
                    <span>
                      <i class="el-icon-info" />
                    </span> </el-tooltip
                  >:
                </span>
              </template>
              <div>
                <el-row v-for="(item, idx) in workErclistAddress" :key="item">
                  <el-col :span="22"
                    ><div class="address-box">{{ item }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span class="closeeth" @click="deleteWorkErcAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setWorkErc">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <div class="forminfo">{{ $t('setupNodes.minterLabel') }}</div>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.blacklistAddressLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.blacklistAddressTip')"
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
                  v-for="(item, idx) in mintingBlacklistAddress"
                  :key="'Minting' + item"
                >
                  <el-col :span="22"
                    ><div class="address-box">{{ item }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingBlackAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingBlack">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.whitelistAddressWithMaxMintingLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      $t('setupNodes.whitelistAddressWithMaxMintingTip')
                    "
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
                  v-for="(item, idx) in mintingWithMaxlistAddress"
                  :key="'Minting' + item"
                >
                  <el-col :span="22"
                    ><div class="address-box">
                      <div>{{ item.value }}</div>
                      <div class="num-div">Amount : {{ item.amount }}</div>
                    </div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingWithMaxAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingWithMax">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{
                    $t('setupNodes.whitelistAddressWithUnlimitedMintingLabel')
                  }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      $t('setupNodes.whitelistAddressWithUnlimitedMintingTip')
                    "
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
                  v-for="(item, idx) in mintingWithUnlimitedlistAddress"
                  :key="'Minting' + item"
                >
                  <el-col :span="22"
                    ><div class="address-box">{{ item }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingWithUnlimitedAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingWithUnlimited">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.whitelistedNFTWithMaxMintingLabel') }} :
                </span>
              </template>
              <div>
                <el-row
                  v-for="(item, idx) in mintingNftWithMaxlistAddress"
                  :key="'MintingNftMax' + item.address"
                >
                  <el-col :span="22"
                    ><div class="address-box">
                      <div>{{ item.address }}</div>
                      <div class="num-div">
                        {{ $t('setupNodes.tokenIdLabel') }} : {{ item.tokenId }}
                      </div>
                      <div class="num-div">Amount : {{ item.amount }}</div>
                    </div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingNftWithMaxAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingNftWithMax">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item>
              <template slot="label">
                <span
                  >{{
                    $t('setupNodes.whitelistedNFTWithUnlimitedMintingLabel')
                  }}
                  :
                </span>
              </template>
              <div>
                <el-row
                  v-for="(item, idx) in mintingNftWithUnlimitedlistAddress"
                  :key="'MintingNft' + item.address"
                >
                  <el-col :span="22"
                    ><div class="address-box">
                      <div>{{ item.address }}</div>
                      <div class="num-div">
                        {{ $t('setupNodes.tokenIdLabel') }} : {{ item.tokenId }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingNftWithUnlimitedAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingNftWithUnlimited">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.whitelistedERC721WithMaxMintingLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      $t('setupNodes.whitelistedERC721WithMaxMintingTip')
                    "
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
                  v-for="(item, idx) in mintingErcWithMaxlistAddress"
                  :key="'Minting' + item"
                >
                  <el-col :span="22"
                    ><div class="address-box">
                      <div>{{ item.value }}</div>
                      <div class="num-div">Amount : {{ item.amount }}</div>
                    </div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingErcWithMaxAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingErcWithMax">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item>
              <template slot="label">
                <span
                  >{{
                    $t('setupNodes.whitelistERC721WithUnlimitedMintingLabel')
                  }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      $t('setupNodes.whitelistERC721WithUnlimitedMintingTip')
                    "
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
                  v-for="(item, idx) in mintingErcWithUnlimitedlistAddress"
                  :key="'Minting' + item"
                >
                  <el-col :span="22"
                    ><div class="address-box">{{ item }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingErcWithUnlimitedAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingErcWithUnlimited">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <span
                  >{{ $t('setupNodes.unifiedMintingCapForNodeLabel') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setupNodes.unifiedMintingCapForNodeTip')"
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
                  v-for="(item, idx) in mintingCapForDaolistAddress"
                  :key="'Minting' + item"
                >
                  <el-col :span="22"
                    ><div class="address-box">{{ item.value }}</div>
                  </el-col>
                  <el-col :span="2"
                    ><span
                      class="closeeth"
                      @click="deleteMintingCapForDaoAddress(idx)"
                      ><i class="el-icon-circle-close"></i></span
                  ></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="btn-eth" @click="setMintingCapForDao">
                      <span><i class="el-icon-plus"></i></span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="new-btn">
        <el-button
          type="primary"
          class="el-dao-btnz"
          @click="setUpDao"
          v-preventReClick
          >Submit</el-button
        >
      </div>
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
          >{{ $t('setupNodes.allocatableRatioLabel') }}:
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
            v-preventReClick
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
          >{{ $t('setupNodes.allocatableRatioLabel') }}:
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
              <span>{{ $t('setupNodes.selectNodesLabel') }} : </span>
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
              <span>{{ $t('setupNodes.ratioLabel') }} : </span>
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
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="Mode Selection"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="426px"
      :before-close="handleClose"
    >
      <div class="dialog_box">
        <el-button @click="setType(2)" v-preventReClick>Basic Mode</el-button>
        <el-button @click="setType(3)" v-preventReClick
          >Instruction Mode</el-button
        >
        <el-button @click="setType(8)" v-preventReClick
          >Professional Mode</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.whitelistAddressLabel')"
      :visible.sync="isWorkWhite"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeWorkWhite"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addWorkWhiteFrom"
          :model="addWorkWhiteFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addWorkWhiteFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addWorkWhiteFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeWorkWhite">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addWorkWhiteAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.blacklistAddressLabel')"
      :visible.sync="isWorkBlack"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeWorkBlack"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addWorkBlackFrom"
          :model="addWorkBlackFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addWorkBlackFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addWorkBlackFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeWorkBlack">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addWorkBlackAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.whitelistedNFTLabel')"
      :visible.sync="isWorkNft"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeWorkNft"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addWorkNftFrom"
          :model="addWorkNftFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addWorkNftFromRules"
        >
          <el-form-item prop="address">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addWorkNftFrom.address"
            ></el-input>
          </el-form-item>
          <el-form-item prop="tokenId">
            <template slot="label">
              <span>{{ $t('setupNodes.tokenIdLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.tokenIdPlaceholder')"
              oninput="value=value.replace(/[^\d]|^0+(\d+)/g,'$1')"
              v-model="addWorkNftFrom.tokenId"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeWorkNft">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addWorkNftAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.whitelistErc721Label')"
      :visible.sync="isWorkErc"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeWorkErc"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addWorkErcFrom"
          :model="addWorkErcFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addWorkErcFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addWorkErcFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeWorkErc">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addWorkErcAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.blacklistAddressLabel')"
      :visible.sync="isMintingBlack"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeMintingBlack"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingBlackFrom"
          :model="addMintingBlackFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingBlackFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingBlackFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingBlack">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingBlackAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('setupNodes.whitelistAddressWithMaxMintingLabel')"
      :visible.sync="isMintingWithMax"
      width="426px"
      :close-on-click-modal="false"
      :before-close="closeMintingWithMax"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingWithMaxFrom"
          :model="addMintingWithMaxFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingWithMaxFromRules"
          :label-position="labelPosition"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingWithMaxFrom.value"
            ></el-input>
          </el-form-item>
          <el-form-item prop="amount">
            <template slot="label">
              <span>{{ $t('setupNodes.maxMintingAmountLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.maxMintingAmountPlaceholder')"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              v-model="addMintingWithMaxFrom.amount"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingWithMax">Cancel</el-button>
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingWithMaxAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.whitelistAddressWithUnlimitedMintingLabel')"
      :visible.sync="isMintingWithUnlimited"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeMintingWithUnlimited"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingWithUnlimitedFrom"
          :model="addMintingWithUnlimitedFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingWithUnlimitedFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingWithUnlimitedFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingWithUnlimited"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingWithUnlimitedAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.whitelistedNFTWithMaxMintingLabel')"
      :visible.sync="isMintingNftWithMax"
      width="426px"
      :close-on-click-modal="false"
      :before-close="closeMintingNftWithMax"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingNftWithMaxFrom"
          :model="addMintingNftWithMaxFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingNftWithMaxFromRules"
          :label-position="labelPosition"
        >
          <el-form-item prop="address">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingNftWithMaxFrom.address"
            ></el-input>
          </el-form-item>

          <el-form-item prop="tokenId">
            <template slot="label">
              <span>{{ $t('setupNodes.tokenIdLabel') }} : </span>
            </template>
            <el-input
              type="text"
              placeholder="Please"
              oninput="value=value.replace(/[^\d]|^0+(\d+)/g,'$1')"
              v-model="addMintingNftWithMaxFrom.tokenId"
            ></el-input>
          </el-form-item>
          <el-form-item prop="amount">
            <template slot="label">
              <span>{{ $t('setupNodes.maxMintingAmountLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.maxMintingAmountPlaceholder')"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              v-model="addMintingNftWithMaxFrom.amount"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingNftWithMax"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingNftWithMaxAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.whitelistedNFTWithUnlimitedMintingLabel')"
      :visible.sync="isMintingNftWithUnlimited"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeMintingNftWithUnlimited"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingNftWithUnlimitedFrom"
          :model="addMintingNftWithUnlimitedFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingNftWithUnlimitedFromRules"
        >
          <el-form-item prop="address">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingNftWithUnlimitedFrom.address"
            ></el-input>
          </el-form-item>
          <el-form-item prop="tokenId">
            <template slot="label">
              <span>{{ $t('setupNodes.tokenIdLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.tokenIdPlaceholder')"
              oninput="value=value.replace(/[^\d]|^0+(\d+)/g,'$1')"
              v-model="addMintingNftWithUnlimitedFrom.tokenId"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingNftWithUnlimited"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingNftWithUnlimitedAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('setupNodes.whitelistedERC721WithMaxMintingLabel')"
      :visible.sync="isMintingErcWithMax"
      width="426px"
      :close-on-click-modal="false"
      :before-close="closeMintingErcWithMax"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingErcWithMaxFrom"
          :model="addMintingErcWithMaxFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingErcWithMaxFromRules"
          :label-position="labelPosition"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingErcWithMaxFrom.value"
            ></el-input>
          </el-form-item>
          <el-form-item prop="amount">
            <template slot="label">
              <span>{{ $t('setupNodes.maxMintingAmountLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.maxMintingAmountPlaceholder')"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              v-model="addMintingErcWithMaxFrom.amount"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingErcWithMax"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingErcWithMaxAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('setupNodes.whitelistERC721WithUnlimitedMintingLabel')"
      :visible.sync="isMintingErcWithUnlimited"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeMintingErcWithUnlimited"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingErcWithUnlimitedFrom"
          :model="addMintingErcWithUnlimitedFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingErcWithUnlimitedFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.addressLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.addressPlaceholder')"
              v-model="addMintingErcWithUnlimitedFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingErcWithUnlimited"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingErcWithUnlimitedAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('setupNodes.unifiedMintingCapForNodeLabel')"
      :visible.sync="isMintingCapForDao"
      :close-on-click-modal="false"
      width="426px"
      :before-close="closeMintingCapForDao"
    >
      <div class="dialog_allocation">
        <el-form
          ref="addMintingCapForDaoFrom"
          :model="addMintingCapForDaoFrom"
          label-width="80px"
          :hide-required-asterisk="nohide"
          :rules="addMintingCapForDaoFromRules"
        >
          <el-form-item prop="value">
            <template slot="label">
              <span>{{ $t('setupNodes.amountLabel') }} : </span>
            </template>
            <el-input
              type="text"
              :placeholder="$t('setupNodes.amountPlaceholder')"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              v-model="addMintingCapForDaoFrom.value"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="allocation-btn" style="margin-top: 20px">
          <el-button type="info" @click="closeMintingCapForDao"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            class="el-dao-btnz"
            @click="addMintingCapForDaoAddress"
            v-preventReClick
            >Add</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('setupNodes.setupNodesLabel')"
      :visible.sync="dialogLoading"
      :center="true"
      width="412px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialogLoading">
        <div class="dialog-loading">
          <loading />
        </div>
        <p class="dialog-text">
          {{ $t('setupNodes.setupNodesText') }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  createDao,
  checkName,
  daoTimes,
  whitelistProof,
  maincreator,
  allcationList,
} from '@/common/api'
import { StandardMerkleTree } from '@/utils/openzeppelin/index.js'
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import {
  createDaoService,
  getCode,
  getIsErc721,
  decimals,
} from '@/common/walletService/services'
import { whitelistFiltre, arrConversion } from '@/utils'

import _ from 'lodash'
import dayjs from 'dayjs'
import Loading from '@/components/Loading.vue'

import { TokenList } from '@/config.js'
export default {
  components: { Loading },
  data() {
    return {
      oldFee: [2.5, 2],
      labelPosition: 'top',
      titleNames: [
        'Seed Nodes Asset Type',
        'Nodes Block Parameters',
        'Nodes Works Parameters',
        'Nodes Tokenomics Structure',
        'Nodes Strategies',
      ],
      titleText: [
        "These parameters determine the asset types of Seed Nodes. 'Input Token'  usually refers to the mint fee, while 'Output Token' is usually used for incentives. Please note that the Asset Types cannot be changed once Seed Nodes are set up successfully, all subsequent Subnodes will follow these two Asset Types. If 'Output Token' is 'Generate' mode, Semios will automatically create an ERC-20 contract and mint 1 billion ERC-20 tokens to the ‘Treasury’  You can view and choose how to allocate these ERC-20 tokens through the 'Treasury' in the 'Seed Nodes' . If 'Import'  mode is selected, the 'Treasury Deposit' function can be used to import ERC-20 tokens into the Treasury.",
        'These parameters primarily shape the life cycle, ERC-20 Token type, and ERC-20 supply of the Nodes. Block rewards are triggered only once per mint window, contingent on the occurrence of minting activities. The reward amount is determined by dividing the Asset Pool balance during minting by the remaining number of mint windows.',
        'These parameters mainly define the work price related parameters.',
        'These parameters are utilized to determine the allocation of the Block Reward. The distribution of rewards involves two levels. Initially, the block reward is allocated in Nodes Level. If Nodes Internal Incentives is specified, this portion of the assets will be allocated based on the respective contributions of Nodes members.',
        'Strategies are used to determine whether a user is eligible to add or mint  work under this Nodes. The order of strategies reflects their priority, with the uppermost strategy having a higher priority.',
      ],
      nohide: true,
      type: 1,
      formData: {
        inputToken: '0x0000000000000000000000000000000000000000',
        daoName: '',
        daoStartDate: '',
        lotteryMode: false,
        infiniteMode: false,
        thirdParty: false,
        erc20ContractAddress: '',
        tokenAllocation: 0,
        daoMintWindow: 60,
        daoMintWindowDuration: 24,
        totalNftCasting: 2,
        dailyMintCap: '10000',
        needMintableWork: false,
        passesQuantity: '1000',
        daoTokenMode: false,
        unifiedPriceMode: false,
        unifiedPrice: '0.01',
        daoFloorPrice: 0.0001,
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
        inputTokenErc20ContractAddress: '',
      },
      rules: {
        daoName: [
          {
            required: true,
            validator: async (rule, value, callback) => {
              if (!value) {
                return callback(new Error('This field is required'))
              }
              if (value.length > 45) {
                return callback(
                  new Error(
                    `Ensure this value has at most 45 characters ( it has ${value.length} ).`
                  )
                )
              }
              const data = {
                name: value,
                type: 0,
              }
              const res = await checkName(data)
              if (res.resultCode !== 100) {
                return callback(new Error(res.resultDesc))
              }
            },
            trigger: 'blur',
          },
        ],
        daoStartDate: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
          },
        ],
        erc20ContractAddress: [
          {
            required: true,
            message: 'Field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
              const isAddress = ethers.utils.isAddress(value)
              if (!strArr || !isAddress) {
                const str = 'Wrong address please modify and resubmit.'
                return callback(new Error(str))
              }
              const isCode = await getCode(value)
              if (!isCode) {
                return callback(new Error('Invalid ERC-20 Contract'))
              }

              const intoken =
                this.formData.inputToken.slice(0, 2) === '0x'
                  ? this.formData.inputToken.toLowerCase()
                  : '0x' + this.formData.inputToken.toLowerCase()
              const inAddress =
                intoken !== '0x'
                  ? intoken
                  : this.formData.inputTokenErc20ContractAddress.slice(0, 2) ===
                    '0x'
                  ? this.formData.inputTokenErc20ContractAddress.toLowerCase()
                  : '0x' +
                    this.formData.inputTokenErc20ContractAddress.toLowerCase()
              const outAddress =
                value.slice(0, 2) === '0x'
                  ? value.toLowerCase()
                  : '0x' + value.toLowerCase()
              if (
                outAddress === inAddress &&
                intoken !== '0x0000000000000000000000000000000000000000'
              ) {
                return callback(
                  new Error(
                    ' Input token and Output token cannot be the same ERC-20 contract address. '
                  )
                )
              }
              //  else {
              //   if (
              //     this.formData.inputToken !==
              //     '0x0000000000000000000000000000000000000000'
              //   ) {
              //     const inAddress =
              //       this.formData.inputToken.slice(0, 2) === '0x'
              //         ? this.formData.inputToken.toLowerCase()
              //         : '0x' + this.formData.inputToken.toLowerCase()
              //     const outAddress =
              //       value.slice(0, 2) === '0x'
              //         ? value.toLowerCase()
              //         : '0x' + value.toLowerCase()
              //     if (outAddress === inAddress) {
              //       return callback(
              //         new Error(
              //           ' Input token and Output token cannot be the same ERC-20 contract address. '
              //         )
              //       )
              //     }
              //   }
              // }
              return
            },
            trigger: ['change'],
          },
        ],
        inputTokenErc20ContractAddress: [
          {
            required: true,
            message: 'Field is required',
            trigger: 'change',
          },
          {
            validator: async (rule, value, callback) => {
              const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
              const isAddress = ethers.utils.isAddress(value)
              if (!strArr || !isAddress) {
                const str = 'Wrong address please modify and resubmit.'
                return callback(new Error(str))
              }
              const isCode = await getCode(value)
              if (!isCode) {
                return callback(new Error('Invalid ERC-20 Contract'))
              }
              return
            },
            trigger: ['change'],
          },
        ],
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
        daoMintWindowDuration: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'change',
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
              if (Number(value) > this.initData.remainingDaoToken) {
                return callback(
                  new Error(
                    `This field cannot exceed ${this.initData.remainingDaoToken}`
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
      },
      daoTime: { currentTime: 0, createProjectFee: -1 },
      dialogVisible: false,
      inputTokenList: [
        { label: 'ETH', value: '0x0000000000000000000000000000000000000000' },
        { label: 'USDC', value: '0x456' },
        { label: 'Custom ERC-20 Input Token', value: '' },
      ],
      outputType: [
        { label: 'Generate', value: false },
        { label: 'Import', value: true },
      ],
      castings: [
        { label: '1k', value: 0 },
        { label: '5k', value: 1 },
        { label: '10k', value: 2 },
        { label: '50k', value: 3 },
        { label: '100k', value: 4 },
      ],
      fluctuationMethods: [
        { label: 'Exponential Increase', value: 0 },
        { label: 'Linear Increase', value: 1 },
      ],
      ethAllocation: [
        {
          name: 'For Seed Nodes Redeem Pool',
          value: 0,
        },
        {
          name: 'This Nodes Internal Incentives',
          value: 0,
        },
        {
          name: 'This Nodes Reserves',
          value: 100,
        },
      ],
      ethAllocationDaos: [],
      daoAllocation: [
        {
          name: 'This Nodes Internal Incentives',
          value: 0,
        },
        {
          name: 'This Nodes Reserves',
          value: 100,
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
      workBlacklistAddress: [],
      isWorkBlack: false,
      addWorkBlackFrom: {
        value: '',
      },
      addWorkBlackFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            const addressList = this.workBlacklistAddress.map((item) => {
              return item.slice(0, 2) === '0x'
                ? item.toLowerCase()
                : '0x' + item.toLowerCase()
            })
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.workBlacklistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      workWhitelistAddress: [],
      isWorkWhite: false,
      addWorkWhiteFrom: {
        value: '',
      },
      addWorkWhiteFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            const addressList = this.workWhitelistAddress.map((item) => {
              return item.slice(0, 2) === '0x'
                ? item.toLowerCase()
                : '0x' + item.toLowerCase()
            })
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.workWhitelistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      workNftlistAddress: [],
      isWorkNft: false,
      addWorkNftFrom: {
        address: '',
        tokenId: '',
      },
      addWorkNftFromRules: {
        address: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            try {
              const isErc721 = await getIsErc721(value)
              if (!isErc721) {
                return callback(
                  new Error('Wrong address please modify and resubmit.')
                )
              }
            } catch (error) {
              return callback(
                new Error('Wrong address please modify and resubmit.')
              )
            }

            if (this.workNftlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['change'],
        },
        tokenId: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            if (this.workNftlistAddress.length > 0) {
              const listObj = this.workNftlistAddress.map((item) => {
                return {
                  address:
                    item.address.slice(0, 2) === '0x'
                      ? item.address.toLowerCase()
                      : '0x' + item.toLowerCase(),
                  tokenId: item.tokenId,
                }
              })
              const dataObj = {
                address:
                  this.addWorkNftFrom.address.slice(0, 2) === '0x'
                    ? this.addWorkNftFrom.address.toLowerCase()
                    : '0x' + this.addWorkNftFrom.address.toLowerCase(),
                tokenId: value,
              }
              console.log(listObj, 'listObj', dataObj)
              const exists = _.some(listObj, (obj) => _.isEqual(obj, dataObj))
              if (exists) {
                return callback(
                  new Error(`The tokenId “${value}” is already in the list.`)
                )
              }
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      workErclistAddress: [],
      isWorkErc: false,
      addWorkErcFrom: {
        value: '',
      },
      addWorkErcFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            try {
              const isErc721 = await getIsErc721(value)
              if (!isErc721) {
                return callback(
                  new Error('Wrong address please modify and resubmit.')
                )
              }
            } catch (error) {
              return callback(
                new Error('Wrong address please modify and resubmit.')
              )
            }
            const addressList = this.workErclistAddress.map((item) => {
              return item.slice(0, 2) === '0x'
                ? item.toLowerCase()
                : '0x' + item.toLowerCase()
            })
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.workErclistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['change'],
        },
      },

      mintingBlacklistAddress: [],
      isMintingBlack: false,
      addMintingBlackFrom: {
        value: '',
      },
      addMintingBlackFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            const addressList = this.mintingBlacklistAddress.map((item) => {
              return item.slice(0, 2) === '0x'
                ? item.toLowerCase()
                : '0x' + item.toLowerCase()
            })
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.mintingBlacklistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },

      mintingWithMaxlistAddress: [],
      isMintingWithMax: false,
      addMintingWithMaxFrom: {
        value: '',
        amount: '',
      },
      addMintingWithMaxFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            const addressList = this.mintingWithMaxlistAddress.map((item) => {
              return item.value.slice(0, 2) === '0x'
                ? item.value.toLowerCase()
                : '0x' + item.value.toLowerCase()
            })
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.mintingWithMaxlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['blur', 'change'],
        },
        amount: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      mintingWithUnlimitedlistAddress: [],
      isMintingWithUnlimited: false,
      addMintingWithUnlimitedFrom: {
        value: '',
      },
      addMintingWithUnlimitedFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            const addressList = this.mintingWithUnlimitedlistAddress.map(
              (item) => {
                return item.slice(0, 2) === '0x'
                  ? item.toLowerCase()
                  : '0x' + item.toLowerCase()
              }
            )
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.mintingWithUnlimitedlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      mintingNftWithMaxlistAddress: [],
      isMintingNftWithMax: false,
      addMintingNftWithMaxFrom: {
        address: '',
        amount: '',
        tokenId: '',
      },
      addMintingNftWithMaxFromRules: {
        address: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            try {
              const isErc721 = await getIsErc721(value)
              if (!isErc721) {
                return callback(
                  new Error('Wrong address please modify and resubmit.')
                )
              }
            } catch (error) {
              return callback(
                new Error('Wrong address please modify and resubmit.')
              )
            }

            if (this.mintingNftWithMaxlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['change'],
        },
        tokenId: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            if (this.mintingNftWithMaxlistAddress.length > 0) {
              const listObj = this.mintingNftWithMaxlistAddress.map((item) => {
                return {
                  address:
                    item.address.slice(0, 2) === '0x'
                      ? item.address.toLowerCase()
                      : '0x' + item.toLowerCase(),
                  tokenId: item.tokenId,
                }
              })
              const dataObj = {
                address:
                  this.addMintingNftWithMaxFrom.address.slice(0, 2) === '0x'
                    ? this.addMintingNftWithMaxFrom.address.toLowerCase()
                    : '0x' +
                      this.addMintingNftWithMaxFrom.address.toLowerCase(),
                tokenId: value,
              }
              const exists = _.some(listObj, (obj) => _.isEqual(obj, dataObj))
              if (exists) {
                return callback(
                  new Error(`The tokenId “${value}” is already in the list.`)
                )
              }
            }
            return
          },
          trigger: ['blur', 'change'],
        },
        amount: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      mintingNftWithUnlimitedlistAddress: [],
      isMintingNftWithUnlimited: false,
      addMintingNftWithUnlimitedFrom: {
        address: '',
        tokenId: '',
      },
      addMintingNftWithUnlimitedFromRules: {
        address: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            try {
              const isErc721 = await getIsErc721(value)
              if (!isErc721) {
                return callback(
                  new Error('Wrong address please modify and resubmit.')
                )
              }
            } catch (error) {
              return callback(
                new Error('Wrong address please modify and resubmit.')
              )
            }
            if (this.mintingNftWithUnlimitedlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['change'],
        },
        tokenId: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            if (this.mintingNftWithUnlimitedlistAddress.length > 0) {
              const listObj = this.mintingNftWithUnlimitedlistAddress.map(
                (item) => {
                  return {
                    address:
                      item.address.slice(0, 2) === '0x'
                        ? item.address.toLowerCase()
                        : '0x' + item.toLowerCase(),
                    tokenId: item.tokenId,
                  }
                }
              )
              const dataObj = {
                address:
                  this.addMintingNftWithUnlimitedFrom.address.slice(0, 2) ===
                  '0x'
                    ? this.addMintingNftWithUnlimitedFrom.address.toLowerCase()
                    : '0x' +
                      this.addMintingNftWithUnlimitedFrom.address.toLowerCase(),
                tokenId: value,
              }
              const exists = _.some(listObj, (obj) => _.isEqual(obj, dataObj))
              if (exists) {
                return callback(
                  new Error(`The tokenId “${value}” is already in the list.`)
                )
              }
            }

            return
          },
          trigger: ['blur', 'change'],
        },
      },
      mintingErcWithMaxlistAddress: [],
      isMintingErcWithMax: false,
      addMintingErcWithMaxFrom: {
        value: '',
        amount: '',
      },
      addMintingErcWithMaxFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            try {
              const isErc721 = await getIsErc721(value)
              if (!isErc721) {
                return callback(
                  new Error('Wrong address please modify and resubmit.')
                )
              }
            } catch (error) {
              return callback(
                new Error('Wrong address please modify and resubmit.')
              )
            }
            const addressList = this.mintingErcWithMaxlistAddress.map(
              (item) => {
                return item.value.slice(0, 2) === '0x'
                  ? item.value.toLowerCase()
                  : '0x' + item.value.toLowerCase()
              }
            )
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.mintingErcWithMaxlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['change'],
        },
        amount: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },

      mintingErcWithUnlimitedlistAddress: [],
      isMintingErcWithUnlimited: false,
      addMintingErcWithUnlimitedFrom: {
        value: '',
      },
      addMintingErcWithUnlimitedFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            const strArr = value.match(/^(0x)?[0-9a-fA-F]{40}$/)
            const isAddress = ethers.utils.isAddress(value)
            if (!strArr || !isAddress) {
              const str = 'Wrong address please modify and resubmit.'
              return callback(new Error(str))
            }
            try {
              const isErc721 = await getIsErc721(value)
              if (!isErc721) {
                return callback(
                  new Error('Wrong address please modify and resubmit.')
                )
              }
            } catch (error) {
              return callback(
                new Error('Wrong address please modify and resubmit.')
              )
            }
            const addressList = this.mintingErcWithUnlimitedlistAddress.map(
              (item) => {
                return item.slice(0, 2) === '0x'
                  ? item.toLowerCase()
                  : '0x' + item.toLowerCase()
              }
            )
            const address = value.slice(0, 2) === '0x' ? value : '0x' + value
            if (addressList.indexOf(address.toLowerCase()) > -1) {
              return callback(
                new Error(`The address “${value}” is already in the list.`)
              )
            }
            if (this.mintingErcWithUnlimitedlistAddress.length >= 100) {
              return callback(
                new Error(
                  `You've reached the address limit of 100. Please remove an address before adding a new one.`
                )
              )
            }
            return
          },
          trigger: ['change'],
        },
      },
      mintingCapForDaolistAddress: [],
      isMintingCapForDao: false,
      addMintingCapForDaoFrom: {
        value: '',
      },
      addMintingCapForDaoFromRules: {
        value: {
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('Field is required'))
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      initData: {
        remainingDaoToken: 1000000000,
        isThirdpartyToken: false,
        isCreator: false,
      },
      dialogLoading: false,
      eTHAllocationDaos: [],
      daoTokenAllocationDaos: [],
      daoAllocationDaosNum: 0,
      ethAllocationDaosNum: 0,
    }
  },
  watch: {
    // activeName(cur) {
    //   if(cur==='dex'){
    //     this.activeName
    //   }
    // },
    MetaMaskAddress(cur) {
      if (cur) {
        this.getDaoTime()
        if (this.$route.query.id) {
          this.getData()
          this.getDaoList()
        }
      }
    },
  },

  computed: {
    ...mapState(['MetaMaskAddress', 'User']),
    pickerOptions() {
      let _this = this
      const currentTime = (_this.daoTime.currentTime - 86400) * 1000
      return {
        disabledDate(time) {
          // return time.getTime() < Date.now();
          return time.getTime() < currentTime
        },
      }
    },
  },
  created() {
    this.inputTokenList = [...TokenList]
    console.log(this.inputTokenList, 'this.inputTokenList')
    this.getDaoTime()
    if (this.$route.query.id) {
      this.getData()
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDaoList()
    }
  },
  methods: {
    changeInputToken() {
      this.formData.inputTokenErc20ContractAddress = ''
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
      const res = await maincreator({ daoId: this.$route.query.id })
      this.initData = res.data
      this.formData.inputToken =
        this.initData.payCurrencyType === 'ETH'
          ? '0x0000000000000000000000000000000000000000'
          : this.initData.inputTokenAddress
      this.formData.inputTokenErc20ContractAddress =
        this.initData.inputTokenAddress
      this.thirdPartyChange(this.initData.isThirdpartyToken)
    },
    async getDaoList() {
      const res = await allcationList({ daoId: this.$route.query.id, type: 1 })
      this.eTHAllocationDaos = res.dataList.filter(
        (item) => item.topupMode !== true
      )
      this.daoTokenAllocationDaos = res.dataList
    },
    thirdPartyChange(val) {
      if (val) {
        this.ethAllocation = [
          {
            name: 'For Seed Nodes Redeem Pool',
            value: 0,
          },
          {
            name: 'This Nodes Internal Incentives',
            value: 0,
          },
          {
            name: 'This Nodes Reserves',
            value: 100,
          },
        ]
        this.formData.fixedPriceReserveRatio.mainDAO = 0
        this.formData.fixedPriceReserveRatio.subDAO = 100
        this.formData.daoPriceReserveRatio.mainDAO = 0
        this.formData.daoPriceReserveRatio.subDAO = 100
        this.formData.erc20ContractAddress = ''
      } else {
        this.ethAllocation = [
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
        ]
        this.formData.fixedPriceReserveRatio.mainDAO = 97.5
        this.formData.fixedPriceReserveRatio.subDAO = 2.5
        this.formData.daoPriceReserveRatio.mainDAO = 97.5
        this.formData.daoPriceReserveRatio.subDAO = 2.5
        this.formData.erc20ContractAddress = ''
      }
    },
    filterMerkle(val, arr = []) {
      const newVal = whitelistFiltre(val, arr)
      if (val.length > 0 || arr.length > 0) {
        const tree = StandardMerkleTree.of(arrConversion(newVal), ['address'])
        return {
          root: tree.root,
          // proof: JSON.stringify(proofArr),
          address: JSON.stringify(newVal),
        }
      } else {
        return {
          root: ethers.constants.HashZero,
          proof: '',
          address: '',
        }
      }
    },
    async setUpDao() {
      // console.log(
      //   this.formData.daoMintWindowDuration,
      //   "this.formData.daoMintWindowDuration",
      //   this.formData
      // );
      // console.log(
      //   new BigNumber(this.formData.daoMintWindowDuration)
      //     .times("239055188367481833171")
      //     .toString(),
      //   "123123123123123123"
      // );
      if (this.User.address) {
        if (this.$refs.ruleForm.validate) {
          this.$refs.ruleForm.validate(async (valid) => {
            if (valid) {
              const chain = await this.setChain()
              if (!chain) return
              this.dialogLoading = true
              try {
                const addStrategies = {
                  blacklist: { minterAccounts: [], canvasCreatorAccounts: [] },
                  whitelist: {
                    minterNFTHolderPasses: [],
                    minterMerkleRoot: '',
                    canvasCreatorNFTHolderPasses: [],
                    canvasCreatorMerkleRoot: '',
                  },
                  nftMinterCapInfo: [],
                  daoMintCapParam: [],
                }

                addStrategies.blacklist.minterAccounts =
                  this.mintingBlacklistAddress
                addStrategies.blacklist.canvasCreatorAccounts =
                  this.workBlacklistAddress

                addStrategies.whitelist.minterNFTHolderPasses =
                  this.mintingErcWithUnlimitedlistAddress
                const mintingWithMaxlistAddress =
                  this.type === 2
                    ? [
                        {
                          value: this.MetaMaskAddress,
                          amount: 5,
                        },
                      ]
                    : this.mintingWithMaxlistAddress
                const mintingRootObj = this.filterMerkle(
                  this.mintingWithUnlimitedlistAddress,
                  mintingWithMaxlistAddress.map((item) => item.value)
                )
                addStrategies.whitelist.minterMerkleRoot = mintingRootObj.root
                addStrategies.blacklist.canvasCreatorAccounts =
                  this.workBlacklistAddress
                addStrategies.whitelist.canvasCreatorNFTHolderPasses =
                  this.workErclistAddress

                const createCanvasRootObj = this.filterMerkle(
                  this.workWhitelistAddress
                )
                addStrategies.whitelist.canvasCreatorMerkleRoot =
                  createCanvasRootObj.root
                addStrategies.nftMinterCapInfo =
                  this.type === 2
                    ? [
                        {
                          nftAddress: ethers.constants.AddressZero,
                          nftMintCap: 5,
                        },
                      ]
                    : this.mintingErcWithMaxlistAddress.map((item) => {
                        return {
                          nftAddress: item.value,
                          nftMintCap: item.amount,
                        }
                      })

                addStrategies.daoMintCapParam =
                  this.type === 2
                    ? [
                        {
                          minter: this.MetaMaskAddress,
                          mintCap: 5,
                        },
                      ]
                    : this.mintingWithMaxlistAddress.map((item) => {
                        return {
                          minter: item.value,
                          mintCap: item.amount,
                        }
                      })
                const setProofData = {
                  canvasCreateOriginAddress: createCanvasRootObj.address,
                  canvasCreateMerkleRoot: createCanvasRootObj.root,
                  mintingOriginAddress: mintingRootObj.address,
                  mintingMerkleRoot: mintingRootObj.root,
                }
                await whitelistProof(setProofData)
                const data = await createDao({
                  ...this.formData,
                  duration: this.formData.daoMintWindowDuration,
                })
                console.log(data, 'datadatadatadata')
                BigNumber.config({ EXPONENTIAL_AT: 38 })
                // const token = new BigNumber(this.formData.tokenAllocation)
                //   .div(1e5)
                //   .dp(0)
                //   .toString()
                const childrenDaoId = this.fetchkeyArr(
                  this.ethAllocationDaos,
                  this.daoAllocationDaos
                )
                const childrenDaoRatiosERC20 = this.fetchvalArr(
                  childrenDaoId,
                  this.daoAllocationDaos
                )
                console.log(this.ethAllocationDaos, 'this.ethAllocationDaos')
                const childrenDaoRatiosETH = this.fetchvalArr(
                  childrenDaoId,
                  this.ethAllocationDaos
                )
                console.log(
                  childrenDaoRatiosETH,
                  'childrenDaoRatiosETHchildrenDaoRatiosETHchildrenDaoRatiosETHchildrenDaoRatiosETHchildrenDaoRatiosETH'
                )
                let tokenAddress = ''
                if (this.formData.thirdParty) {
                  tokenAddress =
                    this.formData.erc20ContractAddress.slice(0, 2) === '0x'
                      ? this.formData.erc20ContractAddress
                      : '0x' + this.formData.erc20ContractAddress
                } else {
                  tokenAddress = ethers.constants.AddressZero
                }
                let decimalsNum = 0
                if (this.formData.inputToken !== '') {
                  decimalsNum =
                    this.formData.inputToken ===
                    '0x0000000000000000000000000000000000000000'
                      ? 18
                      : await decimals(this.formData.inputToken)
                } else {
                  decimalsNum = await decimals(
                    this.formData.inputTokenErc20ContractAddress
                  )
                }
                if (this.formData.daoTokenMode) {
                  if (this.formData.thirdParty || this.$route.query.id) {
                    const erc20 = this.$route.query.id
                      ? this.initData.erc20Address
                      : this.formData.erc20ContractAddress
                    const decNum = await decimals(erc20)
                    decimalsNum = decNum
                  }
                }
                console.log(
                  decimalsNum,
                  ';decimalsNumdecimalsNumdecimalsNumdecimalsNumdecimalsNumdecimalsNum'
                )
                //1.7
                const canvasCreatorNFTIdHolderPasses =
                  this.workNftlistAddress.map((item) => {
                    return {
                      erc721Address: item.address,
                      tokenId: item.tokenId,
                    }
                  })
                const minterNFTIdHolderPasses =
                  this.mintingNftWithUnlimitedlistAddress.map((item) => {
                    return {
                      erc721Address: item.address,
                      tokenId: item.tokenId,
                    }
                  })

                const nftMinterCapIdInfo =
                  this.mintingNftWithMaxlistAddress.map((item) => {
                    return {
                      nftAddress: item.address,
                      tokenId: item.tokenId,
                      nftMintCap: item.amount,
                    }
                  })
                const req = {
                  createProjectFee: 0,
                  existDaoId: this.initData.existDaoId
                    ? this.initData.existDaoId
                    : ethers.constants.HashZero,
                  daoMetadataParam: {
                    startBlock: data.data.startBlock,
                    mintableRounds: this.formData.infiniteMode
                      ? 1
                      : this.formData.daoMintWindow,
                    duration: data.data.duration,
                    floorPrice: this.formData.unifiedPriceMode
                      ? new BigNumber(0.0001)
                          .times(`1e${decimalsNum}`)
                          .toString()
                      : new BigNumber(this.formData.daoFloorPrice)
                          .times(`1e${decimalsNum}`)
                          .toString(),
                    maxNftRank: data.data.maxNftRank,
                    royaltyFee: data.data.royaltyFee,
                    projectUri: data.data.projectUri,
                    projectIndex: 0,
                  },
                  //TODO 这里开始
                  whitelist: {
                    minterMerkleRoot: addStrategies.whitelist.minterMerkleRoot,
                    minterNFTHolderPasses:
                      addStrategies.whitelist.minterNFTHolderPasses,
                    minterNFTIdHolderPasses: minterNFTIdHolderPasses,
                    canvasCreatorMerkleRoot:
                      addStrategies.whitelist.canvasCreatorMerkleRoot,
                    canvasCreatorNFTHolderPasses:
                      addStrategies.whitelist.canvasCreatorNFTHolderPasses,
                    canvasCreatorNFTIdHolderPasses:
                      canvasCreatorNFTIdHolderPasses,
                  },
                  blacklist: {
                    minterAccounts: addStrategies.blacklist.minterAccounts,
                    canvasCreatorAccounts:
                      addStrategies.blacklist.canvasCreatorAccounts,
                  },
                  daoMintCapParam: {
                    daoMintCap:
                      this.mintingCapForDaolistAddress.length > 0
                        ? this.mintingCapForDaolistAddress[0].value
                        : 0,
                    userMintCapParams: addStrategies.daoMintCapParam,
                  },
                  nftMinterCapInfo: addStrategies.nftMinterCapInfo,
                  nftMinterCapIdInfo: nftMinterCapIdInfo,
                  templateParam: {
                    priceTemplateType: this.formData.fluctuationMethod,
                    priceFactor:
                      this.formData.fluctuationMethod === 0
                        ? new BigNumber(this.formData.doublingFactor)
                            .times(10000)
                            .toString()
                        : ethers.BigNumber.from(
                            new BigNumber(this.formData.growthFactor)
                              .times(`1e${decimalsNum}`)
                              .toString()
                          ),
                    rewardTemplateType: 0,
                    rewardDecayFactor: 0,
                    isProgressiveJackpot: this.formData.lotteryMode,
                  },
                  basicDaoParam: {
                    // initTokenSupplyRatio: token, //daoTokenAllocation
                    canvasId: data.data.canvasId,
                    canvasUri: data.data.canvasUri,
                    daoName: data.data.daoName,
                  },
                  continuousDaoParam: {
                    reserveNftNumber: this.formData.needMintableWork
                      ? this.formData.passesQuantity
                      : 0,
                    unifiedPriceModeOff: !this.formData.unifiedPriceMode,
                    unifiedPrice: new BigNumber(this.formData.unifiedPrice)
                      .times(`1e${decimalsNum}`)
                      .toString(),
                    needMintableWork: this.formData.needMintableWork,
                    dailyMintCap: this.formData.dailyMintCap,
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
                    isAncestorDao: this.initData.existDaoId ? false : true,
                    daoToken: tokenAddress,
                    topUpMode: this.formData.topUpMode,
                    infiniteMode: this.formData.infiniteMode,
                    outputPaymentMode: this.formData.daoTokenMode,
                    ownershipUri: 'test-ownership-uri',
                    inputToken:
                      this.formData.inputToken !== ''
                        ? this.formData.inputToken
                        : this.formData.inputTokenErc20ContractAddress,
                  },
                  allRatioParam: {
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
                  actionType: 20,
                }
                console.log(req, 'req')
                const tx = await createDaoService(req)
                const res = await tx.wait()
                this.senMsg(res, 'dao')
              } catch (error) {
                console.log(error, 'error')
                this.dialogLoading = false
                const err = JSON.stringify(error)
                console.log(err, ' this.errMsgText')
                this.errMsg(err)
              }
            }
          })
        }
      } else {
        this.loginWallet()
      }
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
    changePassesQuantity() {
      if (!this.formData.passesQuantity || this.formData.passesQuantity < 1) {
        this.formData.passesQuantity = 1
        return
      }
      if (this.formData.passesQuantity > 5000) {
        this.formData.passesQuantity = 5000
        return
      }
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
      const letNum = new BigNumber(100).minus(num).toNumber()
      // if(this.daoAllocationDaos)
      if (val > letNum) {
        this.daoAllocation[idx].value = letNum
        this.daoAllocation[1].value = 0
      } else {
        this.daoAllocation[1].value = new BigNumber(letNum)
          .minus(val)
          .toNumber()
      }
    },
    setETHAllocationChange(val, idx) {
      console.log(val, ';val', idx)
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
        console.log(letNum, 'letNum')
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
          (item) => (strNum = new BigNumber(strNum).plus(item.value).toNumber())
        )
        const letNum = new BigNumber(100)
          .minus(strNum)
          .minus(this.ethAllocation[0].value)
          .toNumber()
        console.log(letNum, 'letNum')
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
    deleteMintingCapForDaoAddress(idx) {
      this.mintingCapForDaolistAddress.splice(idx, 1)
    },
    addMintingCapForDaoAddress() {
      this.$refs.addMintingCapForDaoFrom.validate((valid) => {
        if (valid) {
          this.mintingCapForDaolistAddress = [
            {
              ...this.addMintingCapForDaoFrom,
            },
          ]
          this.isMintingCapForDao = false
          this.addMintingCapForDaoFrom.value = ''
        }
      })
    },
    closeMintingCapForDao() {
      this.isMintingCapForDao = false
      this.addMintingCapForDaoFrom.value = ''
    },
    setMintingCapForDao() {
      this.isMintingCapForDao = true
      if (this.$refs.addMintingCapForDaoFrom) {
        this.$refs.addMintingCapForDaoFrom.resetFields()
      }
    },

    deleteMintingErcWithUnlimitedAddress(idx) {
      this.mintingErcWithUnlimitedlistAddress.splice(idx, 1)
    },
    addMintingErcWithUnlimitedAddress() {
      this.$refs.addMintingErcWithUnlimitedFrom.validate((valid) => {
        if (valid) {
          this.mintingErcWithUnlimitedlistAddress.push(
            this.addMintingErcWithUnlimitedFrom.value
          )
          this.isMintingErcWithUnlimited = false
          this.addMintingErcWithUnlimitedFrom.value = ''
        }
      })
    },
    closeMintingErcWithUnlimited() {
      this.isMintingErcWithUnlimited = false
      this.addMintingErcWithUnlimitedFrom.value = ''
    },
    setMintingErcWithUnlimited() {
      this.isMintingErcWithUnlimited = true
      if (this.$refs.addMintingErcWithUnlimitedFrom) {
        this.$refs.addMintingErcWithUnlimitedFrom.resetFields()
      }
    },

    deleteMintingNftWithMaxAddress(idx) {
      this.mintingNftWithMaxlistAddress.splice(idx, 1)
    },
    addMintingNftWithMaxAddress() {
      this.$refs.addMintingNftWithMaxFrom.validate((valid) => {
        if (valid) {
          this.mintingNftWithMaxlistAddress.push({
            ...this.addMintingNftWithMaxFrom,
          })
          this.isMintingNftWithMax = false
          this.addMintingNftWithMaxFrom.address = ''
          this.addMintingNftWithMaxFrom.amount = ''
          this.addMintingNftWithMaxFrom.tokenId = ''
        }
      })
    },
    closeMintingNftWithMax() {
      this.isMintingNftWithMax = false
      this.addMintingNftWithMaxFrom.address = ''
      this.addMintingNftWithMaxFrom.amount = ''
      this.addMintingNftWithMaxFrom.tokenId = ''
    },
    setMintingNftWithMax() {
      this.isMintingNftWithMax = true
      if (this.$refs.addMintingNftWithMaxFrom) {
        this.$refs.addMintingNftWithMaxFrom.resetFields()
      }
    },

    deleteMintingNftWithUnlimitedAddress(idx) {
      this.mintingNftWithUnlimitedlistAddress.splice(idx, 1)
    },
    addMintingNftWithUnlimitedAddress() {
      this.$refs.addMintingNftWithUnlimitedFrom.validate((valid) => {
        if (valid) {
          this.mintingNftWithUnlimitedlistAddress.push({
            ...this.addMintingNftWithUnlimitedFrom,
          })
          this.isMintingNftWithUnlimited = false
          this.addMintingNftWithUnlimitedFrom.address = ''
          this.addMintingNftWithUnlimitedFrom.tokenId = ''
        }
      })
    },
    closeMintingNftWithUnlimited() {
      this.isMintingNftWithUnlimited = false
      this.addMintingNftWithUnlimitedFrom.address = ''
      this.addMintingNftWithUnlimitedFrom.tokenId = ''
    },
    setMintingNftWithUnlimited() {
      this.isMintingNftWithUnlimited = true
      if (this.$refs.addMintingNftWithUnlimitedFrom) {
        this.$refs.addMintingNftWithUnlimitedFrom.resetFields()
      }
    },

    deleteMintingErcWithMaxAddress(idx) {
      this.mintingErcWithMaxlistAddress.splice(idx, 1)
    },
    addMintingErcWithMaxAddress() {
      this.$refs.addMintingErcWithMaxFrom.validate((valid) => {
        if (valid) {
          this.mintingErcWithMaxlistAddress.push({
            ...this.addMintingErcWithMaxFrom,
          })
          this.isMintingErcWithMax = false
          this.addMintingErcWithMaxFrom.value = ''
          this.addMintingErcWithMaxFrom.amount = ''
        }
      })
    },
    closeMintingErcWithMax() {
      this.isMintingErcWithMax = false
      this.addMintingErcWithMaxFrom.value = ''
      this.addMintingErcWithMaxFrom.amount = ''
    },
    setMintingErcWithMax() {
      this.isMintingErcWithMax = true
      if (this.$refs.addMintingErcWithMaxFrom) {
        this.$refs.addMintingErcWithMaxFrom.resetFields()
      }
    },
    deleteMintingWithUnlimitedAddress(idx) {
      this.mintingWithUnlimitedlistAddress.splice(idx, 1)
    },
    addMintingWithUnlimitedAddress() {
      this.$refs.addMintingWithUnlimitedFrom.validate((valid) => {
        if (valid) {
          this.mintingWithUnlimitedlistAddress.push(
            this.addMintingWithUnlimitedFrom.value
          )
          this.isMintingWithUnlimited = false
          this.addMintingWithUnlimitedFrom.value = ''
        }
      })
    },
    closeMintingWithUnlimited() {
      this.isMintingWithUnlimited = false
      this.addMintingWithUnlimitedFrom.value = ''
    },
    setMintingWithUnlimited() {
      this.isMintingWithUnlimited = true
      if (this.$refs.addMintingWithUnlimitedFrom) {
        this.$refs.addMintingWithUnlimitedFrom.resetFields()
      }
    },
    deleteMintingWithMaxAddress(idx) {
      this.mintingWithMaxlistAddress.splice(idx, 1)
    },
    addMintingWithMaxAddress() {
      this.$refs.addMintingWithMaxFrom.validate((valid) => {
        if (valid) {
          this.mintingWithMaxlistAddress.push({
            ...this.addMintingWithMaxFrom,
          })
          this.isMintingWithMax = false
          this.addMintingWithMaxFrom.value = ''
          this.addMintingWithMaxFrom.amount = ''
        }
      })
    },
    closeMintingWithMax() {
      this.isMintingWithMax = false
      this.addMintingWithMaxFrom.value = ''
      this.addMintingWithMaxFrom.amount = ''
    },
    setMintingWithMax() {
      this.isMintingWithMax = true
      if (this.$refs.addMintingWithMaxFrom) {
        this.$refs.addMintingWithMaxFrom.resetFields()
      }
    },
    deleteMintingBlackAddress(idx) {
      this.mintingBlacklistAddress.splice(idx, 1)
    },
    addMintingBlackAddress() {
      this.$refs.addMintingBlackFrom.validate((valid) => {
        if (valid) {
          this.mintingBlacklistAddress.push(this.addMintingBlackFrom.value)
          this.isMintingBlack = false
          this.addMintingBlackFrom.value = ''
        }
      })
    },
    closeMintingBlack() {
      this.isMintingBlack = false
      this.addMintingBlackFrom.value = ''
    },
    setMintingBlack() {
      this.isMintingBlack = true
      if (this.$refs.addMintingBlackFrom) {
        this.$refs.addMintingBlackFrom.resetFields()
      }
    },

    deleteWorkNftAddress(idx) {
      this.workNftlistAddress.splice(idx, 1)
    },
    addWorkNftAddress() {
      this.$refs.addWorkNftFrom.validate((valid) => {
        if (valid) {
          this.workNftlistAddress.push({ ...this.addWorkNftFrom })
          this.isWorkNft = false
          this.addWorkNftFrom.address = ''
          this.addWorkNftFrom.amount = ''
        }
      })
    },
    closeWorkNft() {
      this.isWorkNft = false
      this.addWorkNftFrom.address = ''
      this.addWorkNftFrom.tokenId = ''
    },
    setWorkNft() {
      this.isWorkNft = true
      if (this.$refs.addWorkNftFrom) {
        this.$refs.addWorkNftFrom.resetFields()
      }
    },

    deleteWorkErcAddress(idx) {
      this.workErclistAddress.splice(idx, 1)
    },
    addWorkErcAddress() {
      this.$refs.addWorkErcFrom.validate((valid) => {
        if (valid) {
          this.workErclistAddress.push(this.addWorkErcFrom.value)
          this.isWorkErc = false
          this.addWorkErcFrom.value = ''
        }
      })
    },
    closeWorkErc() {
      this.isWorkErc = false
      this.addWorkErcFrom.value = ''
    },
    setWorkErc() {
      this.isWorkErc = true
      if (this.$refs.addWorkErcFrom) {
        this.$refs.addWorkErcFrom.resetFields()
      }
    },

    deleteWorkWhiteAddress(idx) {
      this.workWhitelistAddress.splice(idx, 1)
    },
    addWorkWhiteAddress() {
      this.$refs.addWorkWhiteFrom.validate((valid) => {
        if (valid) {
          this.workWhitelistAddress.push(this.addWorkWhiteFrom.value)
          this.isWorkWhite = false
          this.addWorkWhiteFrom.value = ''
        }
      })
    },
    closeWorkWhite() {
      this.isWorkWhite = false
      this.addWorkWhiteFrom.value = ''
    },
    setWorkWhite() {
      this.isWorkWhite = true
      if (this.$refs.addWorkWhiteFrom) {
        this.$refs.addWorkWhiteFrom.resetFields()
      }
    },
    deleteWorkBlackAddress(idx) {
      this.workBlacklistAddress.splice(idx, 1)
    },
    addWorkBlackAddress() {
      this.$refs.addWorkBlackFrom.validate((valid) => {
        if (valid) {
          this.workBlacklistAddress.push(this.addWorkBlackFrom.value)
          this.isWorkBlack = false
          this.addWorkBlackFrom.value = ''
        }
      })
    },
    closeWorkBlack() {
      this.isWorkBlack = false
      this.addWorkBlackFrom.value = ''
    },
    setWorkBlack() {
      this.isWorkBlack = true
      if (this.$refs.addWorkBlackFrom) {
        this.$refs.addWorkBlackFrom.resetFields()
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
    deleteEthAllocations(idx) {
      this.ethAllocation[2].value = new BigNumber(this.ethAllocation[2].value)
        .plus(this.ethAllocationDaos[idx].value)
        .toNumber()
      this.ethAllocationDaosNum = new BigNumber(this.ethAllocationDaosNum)
        .minus(this.ethAllocationDaos[idx].value)
        .toNumber()
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
    fluctuationMethodChange(val) {
      if (val === 0) {
        this.formData.doublingFactor = 2
      } else {
        this.formData.growthFactor = 0.1
      }
    },
    setDoublingFactorChange(val) {
      if (isNaN(parseFloat(val)) || val < 1) {
        this.formData.doublingFactor = 1
      } else {
        this.formData.doublingFactor = val
      }
    },
    setGrowthFactorChange(val) {
      if (isNaN(parseFloat(val)) || val < 0) {
        this.formData.growthFactor = 0
      } else {
        this.formData.growthFactor = val
      }
    },
    daoFloorPriceChange(val) {
      if (val === 9999) {
        this.formData.fluctuationMethod = 0
        this.formData.doublingFactor = 2
        this.formData.growthFactor = 0.1
      }
    },
    timeTight(val) {
      const a = dayjs(val).unix()
      return a <= this.daoTime.currentTime
    },
    async getDaoTime() {
      try {
        const time = await daoTimes()
        this.daoTime = time.data
        this.formData.daoStartDate = dayjs(
          this.daoTime.currentTime * 1000
        ).format('YYYY-MM-DD')
      } catch (error) {
        console.log(error)
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    goBack(val) {
      this.type = val
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
        this.formData.daoPriceReserveRatio.builder = 0
        this.formData.daoPriceReserveRatio.mainDAO =
          100 -
          Number(this.formData.daoPriceReserveRatio.pDao) -
          Number(this.formData.daoPriceReserveRatio.subDAO)
        this.formData.fixedPriceReserveRatio.builder = 0
        this.formData.fixedPriceReserveRatio.mainDAO =
          100 -
          Number(this.formData.fixedPriceReserveRatio.pDao) -
          Number(this.formData.fixedPriceReserveRatio.subDAO)
      }
    },
    createMinDao() {},
    setType(val) {
      if (this.User.address) {
        if (this.$refs.ruleForm.validate) {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.type = val
              // this.$refs.ruleForm.resetFields();
              if (val === 1) {
                this.dialogVisible = true
                return
              }
              if (val === 2) {
                this.ethAllocation = [
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
                ]
                this.daoAllocation = [
                  {
                    name: 'This Nodes Internal Incentives',
                    value: 100,
                  },
                  {
                    name: 'This Nodes Reserves',
                    value: 0,
                  },
                ]
                this.formData = {
                  inputToken: '0x0000000000000000000000000000000000000000',
                  daoName: this.formData.daoName,
                  daoStartDate: this.formData.daoStartDate,
                  lotteryMode: true,
                  infiniteMode: false,
                  thirdParty: false,
                  erc20ContractAddress: '',
                  // tokenAllocation:
                  //   this.$route.id && !this.initData.isCreator ? 0 : 50000000,
                  tokenAllocation: 0,
                  daoMintWindow: 60,
                  daoMintWindowDuration: 24,
                  totalNftCasting: 2,
                  dailyMintCap: '10000',
                  needMintableWork: true,
                  passesQuantity: '1000',
                  daoTokenMode: false,
                  unifiedPriceMode: true,
                  unifiedPrice: '0.01',
                  daoFloorPrice: 0.0001,
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
                }
                this.setUpDao()
                this.dialogVisible = false
              }
              if (val === 3) {
                this.type = this.$route.query.id ? 4 : 3

                this.dialogVisible = false
              } else {
                this.dialogVisible = false
              }
            } else {
              return false
            }
          })
        } else {
          this.type = val
        }
      } else {
        this.loginWallet()
      }
    },
  },
}
</script>
<style scoped lang="scss">
.dao-title {
  margin-top: 24px;
  margin-bottom: 40px;
  .title-tap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    color: #9e9e9e;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    div {
      display: flex;
    }
    .name-icon {
      width: 24px;
      height: 24px;
      background-color: #282f41;
      border-radius: 24px;
      margin-right: 6px;
      text-align: center;
      display: block;
      line-height: 24px;
    }
    .parting {
      width: 60px;
      height: 1px;
      background: #3f4964;
      margin: 0 12px;
    }
    .activetype {
      background-color: #745cd4;
      color: #fff;
    }
  }
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
  .title-text {
    color: #9e9e9e;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    width: 80%;
    margin: 0 auto;
  }
}
.boxcenter {
  justify-content: center;
}
.dao-box {
  align-items: center;
  // width: 500px;
  flex: 1;
  display: flex;
  // align-items: center;
  flex-direction: column;
}
.box-type3,
.box-type4,
.box-type5,
.box-type7 {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
.box-type1 {
  display: flex;
  // align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  ::v-deep .el-input {
    font-size: 50px;
  }
  ::v-deep .el-button {
    height: 44px;
    width: 100%;
    justify-content: center;
    border-radius: 2px;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    display: flex;
    align-items: center;
  }
  ::v-deep .el-form-item {
    margin-bottom: 60px;
  }
  ::v-deep .el-input__inner {
    background-color: transparent;
    height: 64px;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #bfbfbf;
    color: #f3f3f3;
  }
  .type-name {
    color: #f3f3f3;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto;
    font-size: 40px;
    font-style: normal;
    font-weight: 500;
    margin-top: 32px;
    margin-bottom: 16px;
  }
  .type-text {
    color: #9e9e9e;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    margin: 0;
    margin-bottom: 40px;
  }
  .bar-type1 {
    // width: 182px;
    height: 52px;
    display: flex;
    align-items: center;
    img {
      height: 34px;
      margin-right: 8px;
    }
    span {
      color: #8c91ff;
      font-feature-settings: 'clig' off, 'liga' off;
      font-family: Inter;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
    }
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
.noTime {
  font-size: 12px;
  padding-top: 4px;
  position: absolute;
  line-height: 12px;
  color: rgba(0, 0, 0, 0.45);
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
.address-box {
  border-radius: 2px;
  border: 1px solid #605c61;
  background: rgba(96, 92, 97, 0.15);
  padding: 0 12px;
}
.num-div {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  margin-bottom: 10px;
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
.dialog-loading {
  .flexbox {
    height: 120px;
  }
}
.noMg {
  margin: 0;
}
.unified-price {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  display: block;
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
.old-fee {
  text-decoration: line-through;
}
</style>
