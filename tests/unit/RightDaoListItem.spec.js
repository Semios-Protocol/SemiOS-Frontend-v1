import RightDaoListItem from "@/views/protoWeb/daoCollectionAnalytics/RightDaoListItem.vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { togetherDaoList } from "@/common/api";
import ElementUI from "element-ui";
const localVue = createLocalVue();
localVue.use(ElementUI);

const togetherDaoListMoke = [
  {
    basicInformationVo: {
      mintCap: 0,
      mintWindowCap: 0,
      mintWindowDuration: 60,
      remainingMintWindow: 60,
      subDaoAssetPoolDaoToken: "1000000",
      subDaoAssetPoolEth: "0",
      totalMintCap: 10000,
      totalMintWindowCap: 60,
    },
    daoDescription: "asd",
    daoId: 105,
    daoLogoUrl: "https://image-test.protodao.io/dao/dao_default_logo.png",
    daoManitesto: "asd",
    daoName: "20240109 Ft",
    daoNumber: 333,
    erc20Name: "20240109 Ft",
    mintWindowInfoVo: {
      blockRewardEth: "0",
      blockRewardToken: "16666.6667",
      internalRewardEth: "0",
      internalRewardToken: "0",
      mintFee: "0",
      mintedWorks: 0,
      minters: 0,
    },
    modeStatusVo: {
      daoToken: false,
      erc20PaymentMode: false,
      infiniteMode: false,
      lotteryDuration: 0,
      lotteryMode: false,
      speicialStrategy: false,
      topupMode: false,
      unifiedPrice: null,
      unifiedPriceMode: false,
    },
    projectId:
      "0x1c77b12b4f90d4160e7e34b8703cfae50e181e5887f5891767e5477eedca6adc",
    activeName: "currentMintWindowInformation",
  },
];
jest.mock("../../src/common/api", () => ({
  togetherDaoList: jest.fn().mockReturnValue(
    Promise.resolve({
      dataList: togetherDaoListMoke,
    })
  ),
}));
describe("RightDaoListItem.vue", () => {
  it("correctly sets RightDaoListItem in created hook", async () => {
    const wrapper = shallowMount(RightDaoListItem, {
      localVue,
      mocks: {
        $route: {
          query: { id: "103" }, // 模拟路由参数
        },
      },
    });
    wrapper.vm.$nextTick();
    await togetherDaoList();
    expect(wrapper.vm.objDataList).toEqual(togetherDaoListMoke);
    expect(wrapper.vm.isLoading).toBe(false);
  });
});
