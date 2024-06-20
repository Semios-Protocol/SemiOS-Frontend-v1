import DaoCollectionAnalytics from "@/views/protoWeb/daoCollectionAnalytics/DaoCollectionAnalytics.vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import {
  togetherDaoMember,
  togetherDaoAmount,
  togetherDaoToken,
  togetherDaoMaker,
} from "@/common/api";

jest.mock("../../src/common/api");
import ElementUI from "element-ui";
const localVue = createLocalVue();
localVue.use(ElementUI);

describe("DaoCollectionAnalytics.vue", () => {
  it("correctly sets DaoCollectionAnalytics in created hook", async () => {
    const togetherDaoMemberMoke = {
      starter: 1,
      builder: 1,
      mintter: 1,
      nftHolders: 1,
      erc20Holders: 1,
    };
    togetherDaoMember.mockReturnValueOnce(
      Promise.resolve({
        data: togetherDaoMemberMoke,
      })
    );

    const togetherDaoAmountMoke = {
      totalAmount: 2,
      runningDaoAmount: 2,
      endedDaoAmount: 2,
      notStartedDaoAmount: 2,
    };
    togetherDaoAmount.mockReturnValueOnce(
      Promise.resolve({
        data: togetherDaoAmountMoke,
      })
    );

    const togetherDaoTokenMoke = {
      totalSupply: 3,
      daoTokenBalance: 3,
      redeemAssetPoolEth: 3,
      redeemedErc20Amont: 3,
      erc20Address: "",
    };
    togetherDaoToken.mockReturnValueOnce(
      Promise.resolve({
        data: togetherDaoTokenMoke,
      })
    );

    const togetherDaoMakerMoke = {
      makerTotalAmount: 4,
      noSpendEthAmount: 4,
      noSpendTokenAmount: 4,
    };
    togetherDaoMaker.mockReturnValueOnce(
      Promise.resolve({
        data: togetherDaoMakerMoke,
      })
    );
    const wrapper = shallowMount(DaoCollectionAnalytics, {
      localVue,

      mocks: {
        $route: {
          query: { id: "103" }, // 模拟路由参数
        },
      },
    });
    wrapper.vm.$nextTick();
    await togetherDaoMember();
    await togetherDaoAmount();
    await togetherDaoToken();
    await togetherDaoMaker();
    expect(wrapper.vm.daoMember).toEqual(togetherDaoMemberMoke);
    expect(wrapper.vm.daoAmount).toEqual(togetherDaoAmountMoke);
    expect(wrapper.vm.daoToken).toEqual(togetherDaoTokenMoke);
    expect(wrapper.vm.daoMaker).toEqual(togetherDaoMakerMoke);
    expect(wrapper.vm.isLoading).toBe(true);
  });
});
