<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div class="dao-box" v-else>
    <div class="dao-title">
      <div class="title-name">{{ $t('setupNodes.tabNameList')[4] }}</div>
    </div>
    <div style="width: 1024px" class="box-type7">
      <el-form ref="ruleForm" :model="formData" label-width="320px">
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
                  :key="'NFT' + item.address"
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
            <div class="forminfo">Minter</div>
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
                      <div>{{ item.address }}</div>
                      <div class="num-div">
                        {{ $t('setupNodes.amountLabel') }} : {{ item.amount }}
                      </div>
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
                      <div class="num-div">
                        {{ $t('setupNodes.amountLabel') }} : {{ item.amount }}
                      </div>
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
                      <div class="num-div">
                        {{ $t('setupNodes.amountLabel') }} : {{ item.amount }}
                      </div>
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
                  v-show="
                    unifiedMintingCapForDao && unifiedMintingCapForDao > 0
                  "
                >
                  <el-col :span="22"
                    ><div class="address-box">
                      {{ unifiedMintingCapForDao }}
                    </div>
                  </el-col>
                  <el-col :span="2"
                    ><span class="closeeth" @click="deleteMintingCapForDao"
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
    </div>

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
              placeholder="Please"
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
              v-model="addMintingWithMaxFrom.address"
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
              :placeholder="$t('setupNodes.tokenIdPlaceholder')"
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
      title="Setup"
      :visible.sync="dialogLoading"
      :center="true"
      width="412px"
      top="20vh"
      :destroy-on-close="true"
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
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import { blackandwhiteList, whitelistProof } from '@/common/api'
import { whitelistFiltre, arrConversion, isErcEq } from '@/utils'
import { StandardMerkleTree } from '@/utils/openzeppelin/index.js'
import _ from 'lodash'
import {
  getIsErc721,
  setMintCapAndPermission,
} from '@/common/walletService/services'
export default {
  components: { Loading },
  data() {
    return {
      isLoading: true,
      labelPosition: 'top',
      nohide: true,
      formData: {},

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
          trigger: ['blur', 'change'],
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
        address: '',
        amount: '',
      },
      addMintingWithMaxFromRules: {
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
          trigger: ['blur', 'change'],
        },
      },
      unifiedMintingCapForDao: null,
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
            if (Number(value) < 1 || Number(value) > 10000) {
              return callback(
                new Error(
                  'Max Minting Amount should not be less than 1 and should not exceed 10,000.'
                )
              )
            }
            return
          },
          trigger: ['blur', 'change'],
        },
      },
      isPro: false,
      initData: {},
      isHint: 0,
      dialogLoading: false,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    filterBlacklist(val, initData) {
      const accounts = whitelistFiltre(val)
      //Whether the blacklist array exists
      if (initData.length > 0) {
        //Whether two arrays are equal
        const isArr = isErcEq(accounts, initData)
        if (isArr) {
          this.isHint++
          return {
            deleteArr: [],
            addArr: [],
          }
        } else {
          //It's in the old array, it's not in the new array
          const deleteArr = _.difference(initData, accounts)
          //It didn't exist in the old array, but it exists in the new array
          const addArr = _.difference(accounts, initData)
          return {
            deleteArr: deleteArr,
            addArr: addArr,
          }
        }
      } else {
        if (accounts.length > 0) {
          const addArr = _.difference(accounts, [])
          // this.editData.blacklist.minterAccounts = addArr;
          return {
            deleteArr: [],
            addArr: addArr,
          }
        } else {
          this.isHint++
          return {
            deleteArr: [],
            addArr: [],
          }
        }
      }
    },

    minterMaxAddressAmounEq(val) {
      if (val.length > 0) {
        this.isHint++
        return val.map((item) => {
          return {
            account: item.value ? item.value : item.address,
            cap: item.amount,
          }
        })
      } else {
        return []
      }
    },
    filterERC21Adderss(val, initData) {
      if (isErcEq(val, initData)) {
        this.isHint++
        return val
      } else {
        return val
      }
    },
    filterMerkle(val, initData, arr = []) {
      const newVal = whitelistFiltre(val, arr)
      if (val.length > 0 || arr.length > 0) {
        const tree = StandardMerkleTree.of(arrConversion(newVal), ['address'])
        if (initData && tree.root === initData.rootHash) {
          this.isHint++
        }

        return {
          root: tree.root,
          // proof: JSON.stringify(proofArr),
          address: JSON.stringify(newVal),
        }
      } else {
        if (!initData) {
          this.isHint++
        }
        return {
          root: ethers.constants.HashZero,
          proof: '',
          address: '',
        }
      }
    },
    async onSubmit() {
      // console.log(this.workBlacklistAddress, "this.workBlacklistAddress ");
      // console.log(this.workWhitelistAddress, "this.workWhitelistAddress");
      // console.log(this.workErclistAddress, " this.workErclistAddress");
      // console.log(
      //   this.mintingBlacklistAddress,
      //   "this.mintingBlacklistAddress "
      // );
      // console.log(
      //   this.mintingWithMaxlistAddress,
      //   " this.mintingWithMaxlistAddress"
      // );
      // console.log(
      //   this.mintingWithUnlimitedlistAddress,
      //   " this.mintingWithUnlimitedlistAddress "
      // );
      // console.log(
      //   this.mintingErcWithMaxlistAddress,
      //   " this.mintingErcWithMaxlistAddress "
      // );
      // console.log(
      //   this.mintingErcWithUnlimitedlistAddress,
      //   "this.mintingErcWithUnlimitedlistAddress "
      // );
      // console.log(
      //   this.unifiedMintingCapForDao,
      //   "this.unifiedMintingCapForDao "
      // );
      this.isHint = 0
      const chain = await this.setChain()
      if (!chain) return
      try {
        const editData = {
          unblacklist: { minterAccounts: [], canvasCreatorAccounts: [] },
          blacklist: { minterAccounts: [], canvasCreatorAccounts: [] },
          designatedMintCaps: [],
          whitelist: {
            minterNFTHolderPasses: [],
            minterMerkleRoot: '',
            canvasCreatorNFTHolderPasses: [],
            canvasCreatorMerkleRoot: '',
            minterNFTIdHolderPasses: [],
            canvasCreatorNFTIdHolderPasses: [],
          },
          nftMinterCapInfo: [],
          nftMinterCapIdInfo: [],
          mintCap: 0,
        }
        //1.7
        editData.whitelist.canvasCreatorNFTIdHolderPasses =
          this.workNftlistAddress.map((item) => {
            return {
              erc721Address: item.address,
              tokenId: item.tokenId,
            }
          })
        editData.whitelist.minterNFTIdHolderPasses =
          this.mintingNftWithUnlimitedlistAddress.map((item) => {
            return {
              erc721Address: item.address,
              tokenId: item.tokenId,
            }
          })

        editData.nftMinterCapIdInfo = this.mintingNftWithMaxlistAddress.map(
          (item) => {
            return {
              nftAddress: item.address,
              tokenId: item.tokenId,
              nftMintCap: item.amount,
            }
          }
        )
        const mintingBlackList =
          this.initData.minting && this.initData.minting.blackList
            ? this.initData.minting.blackList
            : []

        const newMintingBlackList = this.filterBlacklist(
          this.mintingBlacklistAddress,
          mintingBlackList
        )
        editData.unblacklist.minterAccounts = newMintingBlackList.deleteArr
        editData.blacklist.minterAccounts = newMintingBlackList.addArr

        const minterMaxAddressAmouns =
          this.initData.minting && this.initData.minting.designatedMintCaps
            ? this.initData.minting.designatedMintCaps
            : []

        editData.designatedMintCaps = this.minterMaxAddressAmounEq(
          this.mintingWithMaxlistAddress,
          minterMaxAddressAmouns
        )
        const mintingERC721MaxList =
          this.initData.minting && this.initData.minting.erc721MintCaps
            ? this.initData.minting.erc721MintCaps
            : []

        editData.nftMinterCapInfo = this.minterMaxAddressAmounEq(
          this.mintingErcWithMaxlistAddress,
          mintingERC721MaxList
        )
        const mintingWhiteListedERC721 =
          this.initData.minting && this.initData.minting.whiteListedERC721
            ? this.initData.minting.whiteListedERC721
            : []

        editData.whitelist.minterNFTHolderPasses = this.filterERC21Adderss(
          this.mintingErcWithUnlimitedlistAddress,
          mintingWhiteListedERC721
        )

        const mintingWhiteList =
          this.initData.minting && this.initData.minting.whiteList
            ? this.initData.minting.whiteList
            : ''

        const mintingRootObj = this.filterMerkle(
          this.mintingWithUnlimitedlistAddress,
          mintingWhiteList,
          this.mintingWithMaxlistAddress.map((item) => item.address)
        )
        editData.whitelist.minterMerkleRoot = mintingRootObj.root
        const canvasBlackList =
          this.initData.createCanvas && this.initData.createCanvas.blackList
            ? this.initData.createCanvas.blackList
            : []

        const createCanvasBlackList = this.filterBlacklist(
          this.workBlacklistAddress,
          canvasBlackList
        )
        editData.unblacklist.canvasCreatorAccounts =
          createCanvasBlackList.deleteArr
        editData.blacklist.canvasCreatorAccounts = createCanvasBlackList.addArr

        const createCanvasWhiteListedERC721 =
          this.initData.createCanvas &&
          this.initData.createCanvas.whiteListedERC721
            ? this.initData.createCanvas.whiteListedERC721
            : []

        editData.whitelist.canvasCreatorNFTHolderPasses =
          this.filterERC21Adderss(
            this.workErclistAddress,
            createCanvasWhiteListedERC721
          )
        const createCanvasWhiteList =
          this.initData.createCanvas && this.initData.createCanvas.whiteList
            ? this.initData.createCanvas.whiteList
            : ''

        const createCanvasRootObj = this.filterMerkle(
          this.workWhitelistAddress,
          createCanvasWhiteList
        )
        editData.whitelist.canvasCreatorMerkleRoot = createCanvasRootObj.root

        editData.mintCap = this.unifiedMintingCapForDao
          ? this.unifiedMintingCapForDao
          : '0'
        const setProofData = {
          canvasCreateOriginAddress: createCanvasRootObj.address,
          canvasCreateMerkleRoot: createCanvasRootObj.root,
          mintingOriginAddress: mintingRootObj.address,
          mintingMerkleRoot: mintingRootObj.root,
        }
        console.log(editData, 'editData')
        this.sendModifyPermission(editData, setProofData)
      } catch (error) {
        console.log(error, 'error')
        this.dialogLoading = false
        const err = JSON.stringify(error)
        this.errMsg(err)
      }
    },
    async sendModifyPermission(editData, setProofData) {
      try {
        this.dialogLoading = true
        this.isHint = 0
        await whitelistProof(setProofData)
        const tx = await setMintCapAndPermission({
          daoId: this.initData.projectId,
          ...editData,
        })
        const res = await tx.wait()
        this.dialogSucc = true
        this.dialogLoading = false
        this.senMsg(res)
        this.isHint = 0
      } catch (error) {
        console.log(error)
        this.dialogLoading = false
        const err = JSON.stringify(error)
        this.errMsg(err)
      }
    },
    async getData() {
      try {
        let data = await blackandwhiteList({ daoId: this.$route.query.id })
        this.initData = data.data
        const resData = { ...data.data }
        console.log(this.initData, 'this.initData this.initData this.initData ')
        const designatedMintCaps =
          resData.minting && resData.minting.designatedMintCaps.length > 0
            ? resData.minting.designatedMintCaps.map((item) => {
                return {
                  address: item.account,
                  amount: item.cap,
                }
              })
            : []
        const maxAddrList =
          designatedMintCaps.length > 0
            ? designatedMintCaps.map((item) => item.address)
            : []
        const minterWhites =
          resData.minting && resData.minting.whiteList
            ? [...resData.minting.whiteList.whiteListAddress]
            : []

        const minterWhiteDelMaxAddrList = minterWhites.filter(
          (v) => maxAddrList.findIndex((el) => el === v) === -1
        )
        this.workBlacklistAddress =
          resData.createCanvas && resData.createCanvas.blackList
            ? [...resData.createCanvas.blackList]
            : []
        this.workWhitelistAddress =
          resData.createCanvas && resData.createCanvas.blackList
            ? [...resData.createCanvas.blackList]
            : []
        this.workWhitelistAddress =
          resData.createCanvas && resData.createCanvas.whiteList
            ? [...resData.createCanvas.whiteList.whiteListAddress]
            : []
        this.workErclistAddress =
          resData.createCanvas && resData.createCanvas.whiteListedERC721
            ? [...resData.createCanvas.whiteListedERC721]
            : []
        this.mintingBlacklistAddress =
          resData.minting && resData.minting.blackList
            ? [...resData.minting.blackList]
            : []
        this.mintingWithMaxlistAddress = designatedMintCaps

        this.mintingWithUnlimitedlistAddress = minterWhiteDelMaxAddrList

        this.mintingErcWithMaxlistAddress =
          resData.minting && resData.minting.erc721MintCaps
            ? resData.minting.erc721MintCaps.map((item) => {
                return {
                  value: item.account,
                  amount: item.cap,
                }
              })
            : []
        this.mintingErcWithUnlimitedlistAddress =
          resData.minting && resData.minting.whiteListedERC721
            ? [...resData.minting.whiteListedERC721]
            : []
        this.unifiedMintingCapForDao =
          resData.minting && resData.minting.maxMintingAmount
        //1.7
        this.mintingNftWithMaxlistAddress =
          resData.minting && resData.minting.erc721MintIdCaps
            ? resData.minting.erc721MintIdCaps.map((item) => {
                return {
                  address: item.nftAddress,
                  amount: item.nftMintCap,
                  tokenId: item.tokenId,
                }
              })
            : []
        this.workNftlistAddress =
          resData.createCanvas && resData.createCanvas.whiteListedERC721Id
            ? resData.createCanvas.whiteListedERC721Id.map((item) => {
                return {
                  address: item.erc721Address,
                  tokenId: item.tokenId,
                }
              })
            : []
        this.mintingNftWithUnlimitedlistAddress =
          resData.minting && resData.minting.whiteListedERC721Id
            ? resData.minting.whiteListedERC721Id.map((item) => {
                return {
                  address: item.erc721Address,
                  tokenId: item.tokenId,
                }
              })
            : []
        this.isPro = resData.basicDao === 2
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
      this.isLoading = false
    },
    deleteMintingCapForDao() {
      this.unifiedMintingCapForDao = null
    },
    addMintingCapForDaoAddress() {
      this.$refs.addMintingCapForDaoFrom.validate((valid) => {
        if (valid) {
          this.unifiedMintingCapForDao = this.addMintingCapForDaoFrom.value
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
          this.addMintingWithMaxFrom.address = ''
          this.addMintingWithMaxFrom.amount = ''
        }
      })
    },
    closeMintingWithMax() {
      this.isMintingWithMax = false
      this.addMintingWithMaxFrom.address = ''
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
      if (this.formData.royalty.minter >= 98) {
        this.formData.royalty.subDao = 0
        this.formData.royalty.builder = 0
      } else {
        const addTop = new BigNumber(this.formData.royalty.builder)
          .plus(this.formData.royalty.minter)
          .toNumber()
        if (addTop >= 98) {
          this.formData.royalty.builder = new BigNumber(98)
            .minus(this.formData.royalty.minter)
            .toNumber()
          this.formData.royalty.subDao = 0
        } else {
          this.formData.royalty.subDao = new BigNumber(98)
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
      if (this.formData.royalty.builder >= 98) {
        this.formData.royalty.subDao = 0
        this.formData.royalty.minter = 0
      } else {
        const addTop = new BigNumber(this.formData.royalty.builder)
          .plus(this.formData.royalty.minter)
          .toNumber()
        if (addTop >= 98) {
          this.formData.royalty.minter = new BigNumber(98)
            .minus(this.formData.royalty.builder)
            .toNumber()
          this.formData.royalty.subDao = 0
        } else {
          this.formData.royalty.subDao = new BigNumber(98)
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
      if (this.formData.eth.minter >= 98) {
        this.formData.eth.subDao = 0
        this.formData.eth.builder = 0
      } else {
        const addTop = new BigNumber(this.formData.eth.builder)
          .plus(this.formData.eth.minter)
          .toNumber()
        if (addTop >= 98) {
          this.formData.eth.builder = new BigNumber(98)
            .minus(this.formData.eth.minter)
            .toNumber()
          this.formData.eth.subDao = 0
        } else {
          this.formData.eth.subDao = new BigNumber(98)
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
      if (this.formData.eth.builder >= 98) {
        this.formData.eth.builder = 98
        this.formData.eth.subDao = 0
        this.formData.eth.minter = 0
      } else {
        const addTop = new BigNumber(this.formData.eth.builder)
          .plus(this.formData.eth.minter)
          .toNumber()
        if (addTop >= 98) {
          this.formData.eth.minter = new BigNumber(98)
            .minus(this.formData.eth.builder)
            .toNumber()
          this.formData.eth.subDao = 0
        } else {
          this.formData.eth.subDao = new BigNumber(98)
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
.address-box {
  border-radius: 2px;
  border: 1px solid #605c61;
  background: rgba(96, 92, 97, 0.15);
  padding: 0 12px;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}
</style>
