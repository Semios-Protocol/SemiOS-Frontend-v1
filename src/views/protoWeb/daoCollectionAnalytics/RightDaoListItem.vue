<template>
  <loading v-if="isLoading" />
  <div class="list-box" v-else>
    <!-- <div class="add-title" @click="setupDao">
      <p><i class="el-icon-plus" /></p>
      <span
        >Click here to Launch Sub Nodes for this series of Nodes, Only Seed
        Nodes Starter can set ERC-20 Tokens Allocation.
      </span>
    </div> -->
    <div class="box-bom">
      <daos-item-card :list="objDataList" />
    </div>

    <!-- <div v-if="total === 0 && !isLoading" class="noList">
      No items to display
    </div> -->
    <!-- <div
      class="list-item-box"
      v-for="(item, idx) in objDataList"
      :key="item.daoName + idx"
    >
      <div class="item-title">
        <div class="title-left"><img :src="item.daoLogoUrl" alt="" /></div>
        <div class="title-cen">
          <h4>
            {{ item.daoName }} <span>{{ item.erc20Name }}</span>
          </h4>
          <p>
            {{ item.daoDescription }}
          </p>
        </div>
        <div class="title-right">
          <a :href="aPush(item)" style="text-decoration: none">
            <el-button class="view-btn" type="text"
              >View <i class="el-icon-arrow-right"
            /></el-button>
          </a>
        </div>
      </div>
      <div class="item-tab">
        <el-tabs v-model="item.activeName">
          <el-tab-pane
            label="ꔷ Current Block Window Information"
            name="currentMintWindowInformation"
          >
            <div class="infor-tab">
              <el-row>
                <el-col :span="9"
                  ><div class="card-num">
                    {{
                      item.mintWindowInfoVo.minters | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.mintWindowInfoVo.mintFee | bigNumFormat(5, 0.000001)
                    }}
                    <svg-icon
                      :icon-class="
                        item.modeStatusVo.daoToken ? 'token' : 'ethbl'
                      "
                    /></div
                ></el-col>
                <el-col :span="7"
                  ><div class="card-num">
                    {{
                      item.mintWindowInfoVo.mintedWorks
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
              </el-row>
              <el-row class="row-item">
                <el-col :span="9"><div class="card-name">Minters</div></el-col>
                <el-col :span="8"><div class="card-name">Mint Fee</div></el-col>
                <el-col :span="7"
                  ><div class="card-name">Minted Works</div></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="9"
                  ><div class="card-num">
                    {{
                      item.mintWindowInfoVo.blockRewardToken
                        | bigNumFormat(5, 0.000001)
                    }}
                    DAO
                    <span v-if="!item.modeStatusVo.topupMode">
                      + {{ item.mintWindowInfoVo.blockRewardEth }} ETH</span
                    >
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.mintWindowInfoVo.internalRewardToken
                        | bigNumFormat(5, 0.000001)
                    }}
                    DAO
                    <span v-if="!item.modeStatusVo.topupMode">
                      + {{ item.mintWindowInfoVo.internalRewardEth }} ETH</span
                    >
                  </div></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="9"
                  ><div class="card-name">Block Reward</div></el-col
                >
                <el-col :span="8"
                  ><div class="card-name">Internal Incentives</div></el-col
                >
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="ꔷ Basic Information" name="basicInformation">
            <div class="infor-tab">
              <el-row>
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.basicInformationVo.mintCap
                        | bigNumFormat(5, 0.000001)
                    }}
                    /
                    {{
                      item.basicInformationVo.totalMintCap
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.basicInformationVo.mintWindowCap
                        | bigNumFormat(5, 0.000001)
                    }}
                    /
                    {{
                      item.basicInformationVo.totalMintWindowCap
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.basicInformationVo.subDaoAssetPoolEth
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
              </el-row>
              <el-row class="row-item">
                <el-col :span="8"><div class="card-name">Total ERC-721 Mint Cap</div></el-col>
                <el-col :span="8"
                  ><div class="card-name">Block Minted Work /Block Mint cap</div></el-col
                >
                <el-col :span="8"
                  ><div class="card-name">SubNodes Asset Pool ETH</div></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.basicInformationVo.mintWindowDuration
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.basicInformationVo.remainingMintWindow
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-num">
                    {{
                      item.basicInformationVo.subDaoAssetPoolDaoToken
                        | bigNumFormat(5, 0.000001)
                    }}
                  </div></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="8"
                  ><div class="card-name">Block Window Duration</div></el-col
                >
                <el-col :span="8"
                  ><div class="card-name">Remaining Block Windows</div></el-col
                >
                <el-col :span="8"
                  ><div class="card-name">
                    SubNodes Asset Pool ERC-20 Tokens
                  </div></el-col
                >
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="ꔷ Mode Status" name="modeStatus">
            <div class="item-tab">
              <el-row class="row-item2">
                <el-col :span="9"
                  ><div class="card-name card-item">
                    <p>
                      <svg-icon
                        :icon-class="
                          item.modeStatusVo.lotteryMode ? 'suc' : 'err'
                        "
                      />
                    </p>
                    <span>Lottery Mode</span>
                    <span v-if="item.modeStatusVo.lotteryMode">{{
                      item.modeStatusVo.lotteryDuration
                    }}</span>
                  </div></el-col
                >
                <el-col :span="8"
                  ><div class="card-name card-item">
                    <p>
                      <svg-icon
                        :icon-class="item.modeStatusVo.daoToken ? 'suc' : 'err'"
                      />
                    </p>
                    <span>ERC-20 token Mode</span>
                  </div></el-col
                >
                <el-col :span="7"
                  ><div class="card-name card-item">
                    <p>
                      <svg-icon
                        :icon-class="
                          item.modeStatusVo.topupMode ? 'suc' : 'err'
                        "
                      />
                    </p>
                    <span>Top-up Mode</span>
                  </div></el-col
                >
              </el-row>

              <el-row>
                <el-col :span="9"
                  ><div class="card-name card-item">
                    <p>
                      <svg-icon
                        :icon-class="
                          item.modeStatusVo.unifiedPriceMode ? 'suc' : 'err'
                        "
                      />
                    </p>
                    <span>Unified Price Mode</span>
                    <span v-if="item.modeStatusVo.unifiedPriceMode"
                      >{{ item.modeStatusVo.unifiedPrice }}
                      <svg-icon
                        :icon-class="
                          item.modeStatusVo.daoToken ? 'token' : 'ethbl'
                        "
                    /></span></div
                ></el-col>
                <el-col :span="8"
                  ><div class="card-name card-item">
                    <p>
                      <svg-icon
                        :icon-class="
                          item.modeStatusVo.speicialStrategy ? 'suc' : 'err'
                        "
                      />
                    </p>
                    <span>Special Startegy</span>
                  </div></el-col
                >
                <el-col :span="7"
                  ><div class="card-name card-item">
                    <p>
                      <svg-icon
                        :icon-class="
                          item.modeStatusVo.infiniteMode ? 'suc' : 'err'
                        "
                      />
                    </p>
                    <span>Infinite Mode</span>
                  </div></el-col
                >
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="ꔷ ETH" name="ethTab">
            <div class="infor-tab" v-if="item.activeName === 'ethTab'">
              <eth-info :daoId="item.daoId" :tabName="tabName" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="ꔷ DAO Token" name="daoToken"
            ><div class="infor-tab" v-if="item.activeName === 'daoToken'">
              <dao-info :daoId="item.daoId" :tabName="tabName" /></div
          ></el-tab-pane>
        </el-tabs>
      </div>
    </div> -->
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import { togetherDaoList } from '@/common/api'
import DaosItemCard from '@/components/DaosItemCard.vue'

export default {
  name: 'RightDaoListItem',
  components: { Loading, DaosItemCard },
  data() {
    return {
      isLoading: true,
      objDataList: [],
      tabName: 'collection',
      currentPage: 1,
      total: 0,
      pageSize: 10,
    }
  },
  props: {
    mainDaoId: {
      typeof: Number,
    },
  },
  created() {
    this.getData()
  },
  methods: {
    aPush(item) {
      return `/dao?type=nfts&id=${item.daoId}`
    },
    setupDao() {
      this.$router.push({
        path: '/setupdao',
        query: {
          id: this.mainDaoId,
        },
      })
    },
    async getData() {
      try {
        const res = await togetherDaoList({ daoId: this.$route.query.id })
        this.objDataList = res.dataList.map((item) => {
          return {
            ...item,
            activeName: 'currentMintWindowInformation',
          }
        })
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
  },
}
</script>
<style scoped lang="scss">
.list-box {
  width: 920px;
  margin: 0 auto;
  font-family: Inter;
}
.add-title {
  height: 90px;
  width: 920px;
  border-radius: 2px;
  border: 1px dashed #6062aa;
  background: #252b3a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  P {
    margin: 0;
    font-size: 24px;
    color: #fff;
  }
  span {
    color: #9e9e9e;
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
