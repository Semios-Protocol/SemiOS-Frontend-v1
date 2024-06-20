import Vue from "vue";
import VueRouter from "vue-router";
import Page from "@/views/Index.vue";
Vue.use(VueRouter);
let routes = null;

if (
  window.navigator.userAgent.toLowerCase().indexOf("android") > -1 ||
  window.navigator.userAgent.toLowerCase().indexOf("ios") > -1 ||
  window.navigator.userAgent.toLowerCase().indexOf("ipad") > -1 ||
  window.navigator.userAgent.toLowerCase().indexOf("iphone") > -1
) {
  routes = [
    {
      path: "/",
      component: Page,
      children: [
        {
          path: "/",
          name: "index",
          component: () =>
            import(
              /* webpackChunkName: 'needful' */ "../views/protoH5/Index.vue"
            ),
        },

        {
          path: "/addWork",
          name: "addWork",
          component: () => import("../views/protoH5/AddWork.vue"),
        },
        {
          path: "/dao",
          name: "dao",
          component: () => import("../views/protoH5/member/DaoMember.vue"),
        },
        {
          path: "/editInformation",
          name: "editInformation",
          component: () => import("../views/protoH5/EditInformation.vue"),
        },
        {
          path: "/workDetails",
          name: "workDetails",
          component: () => import("../views/protoH5/WorkDetails.vue"),
        },
        {
          path: "/wallet",
          name: "wallet",
          component: () => import("../views/protoH5/Wallet.vue"),
        },
        {
          path: "/personal",
          name: "personal",
          component: () => import("../views/protoH5/personal/Index.vue"),
        },
        {
          path: "/dex",
          name: "dex",
          component: () => import("../views/protoH5/dex/Index.vue"),
        },
        // {
        //   path: "/editParameters",
        //   name: "editParameters",
        //   component: () => import("../views/protoH5/EditParameters.vue"),
        // },
        {
          path: "/editStrategies",
          name: "editStrategies",
          component: () => import("../views/protoH5/EditStrategies.vue"),
        },
        {
          path: "/editWorkInformation",
          name: "editWorkInformation",
          component: () => import("../views/protoH5/EditWorkInformation.vue"),
        },
      ],
    },
  ];
} else {
  routes = [
    {
      path: "/",
      component: Page,
      children: [
        {
          path: "/",
          name: "index",
          component: () =>
            import(
              /* webpackChunkName: 'needful' */ "../views/protoWeb/SetupDao.vue"
            ),
        },

        {
          path: "/addWork",
          name: "addWork",
          component: () => import("../views/protoWeb/AddWork.vue"),
        },
        {
          path: "/dao",
          name: "dao",
          component: () => import("../views/protoWeb/member/DaoMember.vue"),
        },
        {
          path: "/daoCollectionAnalytics",
          name: "daoCollectionAnalytics",
          component: () =>
            import(
              "../views/protoWeb/daoCollectionAnalytics/DaoCollectionAnalytics.vue"
            ),
        },
        {
          path: "/editInformation",
          name: "editInformation",
          component: () => import("../views/protoWeb/EditInformation.vue"),
        },
        {
          path: "/workDetails",
          name: "workDetails",
          component: () => import("../views/protoWeb/works/WorkDetailsV2.vue"),
        },
        {
          path: "/personal",
          name: "personal",
          component: () => import("../views/protoWeb/personal/Index.vue"),
        },
        {
          path: "/dex",
          name: "dex",
          component: () => import("../views/protoWeb/dex/Index.vue"),
        },
        {
          path: "/setupDao",
          name: "setupDao",
          component: () => import("../views/protoWeb/SetupDao.vue"),
        },
        {
          path: "/setupPlan",
          name: "setupPlan",
          component: () => import("../views/protoWeb/SetupPlan.vue"),
        },
        {
          path: "/editParameters",
          name: "editParameters",
          component: () => import("../views/protoWeb/EditParameters.vue"),
        },
        {
          path: "/editStrategies",
          name: "editStrategies",
          component: () => import("../views/protoWeb/EditStrategies.vue"),
        },
        {
          path: "/editWorkInformation",
          name: "editWorkInformation",
          component: () => import("../views/protoWeb/works/EditWorkInformation.vue"),
        },
        // {
        //   path: "/rankings",
        //   name: "rankings",
        //   component: () => import("../views/protoWeb/rankings/Index.vue"),
        // },
        {
          path: "/search",
          name: "search",
          component: () => import("../views/protoWeb/search/Index.vue"),
        },
        // {
        //   path: "/searchData",
        //   name: "searchData",
        //   component: () => import("../views/protoWeb/search/SearchData.vue"),
        // },
        {
          path: "/collections",
          name: "collections",
          component: () => import("../views/protoWeb/collections/Index.vue"),
        },
      ],
    },
  ];
}
const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.auth) {
    // next();
    // return;
    if (
      document.cookie.indexOf("user=") > -1 &&
      document.cookie.indexOf("address=") > -1
    ) {
      next();
    } else {
      const [primaryWallet] = Vue.prototype.$onboard.state.get().wallets;
      if (primaryWallet) {
        await Vue.prototype.$onboard.disconnectWallet({
          label: primaryWallet.label,
        });
        window.localStorage.setItem(
          "ProtoDAOConnectedWallets",
          JSON.stringify([])
        );
      }
      next({
        path: "/",
      });
    }
  } else {
    next();
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
