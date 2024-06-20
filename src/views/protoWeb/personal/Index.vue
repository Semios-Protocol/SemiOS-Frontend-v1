<template>
  <div class="box-per">
    <div class="box-left">
      <div class="user">
        <div>
          <img :src="User.avatar" alt="" />
        </div>
        <span v-if="User.name">{{ User.name | hasHellipsis(15) }}</span>
        <span v-else> Unnamed </span>
      </div>
      <el-menu
        :default-active="activeName"
        class="el-menu-vertical-demo"
        :default-openeds="defaultOpeneds"
      >
        <el-menu-item
          index="profile"
          @click="setMenu('profile')"
          :style="{
            color: activeName === 'profile' ? '#B3B5F2' : '',
            'background-color': activeName === 'profile' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="G1" />
          <span slot="title" class="left">Profile</span>
        </el-menu-item>
        <el-menu-item
          index="wallet"
          @click="setMenu('wallet')"
          :style="{
            color: activeName === 'wallet' ? '#B3B5F2' : '',
            'background-color': activeName === 'wallet' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="G2" /><span slot="title" class="left"
            >Wallet</span
          >
        </el-menu-item>
        <el-menu-item
          index="wallet"
          @click="setMenu('topUpBalance')"
          :style="{
            color: activeName === 'topUpBalance' ? '#B3B5F2' : '',
            'background-color': activeName === 'topUpBalance' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="topupb" /><span slot="title" class="left"
            >Top-up Balance</span
          >
        </el-menu-item>
        <el-menu-item
          index="wallet"
          @click="setMenu('topUpReward')"
          :style="{
            color: activeName === 'topUpReward' ? '#B3B5F2' : '',
            'background-color': activeName === 'topUpReward' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="topupb" /><span slot="title" class="left"
            >Top-up Reward</span
          >
        </el-menu-item>

        <el-menu-item
          index="myDaos"
          @click="setMenu('myDaos')"
          :style="{
            color: activeName === 'myDaos' ? '#B3B5F2' : '',
            'background-color': activeName === 'myDaos' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="Hd" />
          <span slot="title" class="left">My Nodes</span>
        </el-menu-item>

        <el-menu-item
          index="minted"
          @click="setMenu('myWorks')"
          :style="{
            color: activeName === 'myWorks' ? '#B3B5F2' : '',
            'background-color': activeName === 'myWorks' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="Hw" />
          <span slot="title" class="left">My Works</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <svg-icon
              icon-class="G3"
              :style="{
                color:
                  ($route.name === 'personal' &&
                    $route.query.type === 'daos') ||
                  ($route.name === 'personal' && $route.query.type === 'works')
                    ? '#B3B5F2'
                    : '',
              }"
            />
            <span
              :style="{
                color:
                  ($route.name === 'personal' &&
                    $route.query.type === 'daos') ||
                  ($route.name === 'personal' && $route.query.type === 'works')
                    ? '#B3B5F2'
                    : '',
              }"
              class="left"
            >
              Favorites</span
            >
          </template>
          <el-menu-item
            index="daos"
            @click="setMenu('daos')"
            :style="tabStyle('daos')"
          >
            <span class="left">Nodes</span>
          </el-menu-item>
          <el-menu-item
            index="works"
            @click="setMenu('works')"
            :style="tabStyle('works')"
          >
            <span class="left">Works</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          index="holds"
          @click="setMenu('holds')"
          :style="{
            color: activeName === 'holds' ? '#B3B5F2' : '',
            'background-color': activeName === 'holds' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="G4" />
          <span slot="title" class="left">NFT Holds</span>
        </el-menu-item>

        <el-menu-item
          index="minted"
          @click="setMenu('minted')"
          :style="{
            color: activeName === 'minted' ? '#B3B5F2' : '',
            'background-color': activeName === 'minted' ? '#282f41' : '',
          }"
        >
          <svg-icon icon-class="G5" />
          <span slot="title" class="left">NFT Minted</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="box-right">
      <!-- <div class="halt">
        <i class="el-icon-warning"></i> For security reasons, some functions
        under the platform are temporarily suspended. All your assets on the
        platform are safe, please wait patiently for recovery.
      </div> -->
      <component :is="activeName" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import profile from './Profile.vue'
import wallet from './Wallet.vue'
import holds from './Holds.vue'
import topUpBalance from './TopUpBalance.vue'
import topUpReward from './TopUpReward.vue'
import minted from './Minted.vue'
import works from './FavoriteWorks.vue'
import daos from './FavoriteDaos.vue'
import myWorks from './MyWorks.vue'
import myDaos from './MyDaos.vue'
export default {
  components: {
    profile,
    wallet,
    holds,
    topUpBalance,
    topUpReward,
    minted,
    works,
    daos,
    myWorks,
    myDaos,
  },
  data() {
    return {
      defaultOpeneds: [],
      activeName: 'profile',
      editList: ['editDao', 'strategie', 'editParameter'],
    }
  },
  computed: {
    ...mapState(['User']),
  },
  // watch: {
  //   $route: {
  //     handler(cur) {
  //       this.activeName = cur.query.type;
  //     },
  //     deep: true,
  //   },
  // },

  watch: {
    $route: {
      handler(cur) {
        if (
          this.$route.query.active &&
          this.editList.indexOf(this.$route.query.active) > -1
        ) {
          this.activeName = this.$route.query.active
        } else {
          this.activeName = cur.query.type
        }
      },
      deep: true,
    },
  },
  created() {
    this.activeName = this.$route.query.type
  },
  mounted() {},
  methods: {
    tabStyle(tab) {
      if (this.$route.query.type === tab) {
        return {
          color: '#B3B5F2',
          'background-color': '#282f41',
        }
      }
    },
    itemStyle(id, tab) {
      let color =
        this.$route.query.type === tab && this.$route.query.id === id + ''
          ? '#B3B5F2'
          : '#757575'
      let bgcolor =
        this.$route.query.type === tab && this.$route.query.id === id + ''
          ? '#282f41'
          : '#fff'
      return {
        color: color,
        'background-color': bgcolor,
      }
    },
    setMenu(type) {
      this.$router.push({
        path: '/personal',
        query: {
          type: type,
        },
      })
      this.activeName = type
    },
  },
}
</script>
<style scoped lang="scss">
.svg-icon {
  font-size: 14px;
}
.user {
  height: 85px;
  width: 100%;
  font-size: 14px;
  color: #9e9e9e;
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin: 0 20px;
  }
}
.box-per {
  min-width: 1240px;
  width: 100%;
  display: flex;
  flex: 1;
  .box-left {
    width: 296px;
    border-right: 1px solid #6062aa;
    // height: 100%;
    // height: calc(100% - 60px);
    // position: fixed;
    // z-index: 500;
    // background-color: #fff;
    // overflow-y: auto;
    // overflow-x: hidden;
  }
  .box-right {
    flex: 1;
    // margin-left: 296px;
  }
}
::v-deep .el-menu {
  background-color: transparent;
  border: none;
  width: 296px;
}
::v-deep .el-menu-item:focus,
.el-menu-item:hover {
  background-color: #282f41 !important;
}
// ::v-deep .el-menu-item.is-active {
//   color: #B3B5F2;
//   background-color: #282f41;
// }
::v-deep .el-submenu__title:hover {
  background-color: #282f41;
}
::v-deep .el-submenu__title {
  color: #bbbaba;
  display: flex;
  align-items: center;
}
::v-deep .el-menu-item {
  color: #bbbaba;
  display: flex;
  align-items: center;
}
.left {
  margin-left: 14px;
}
</style>
