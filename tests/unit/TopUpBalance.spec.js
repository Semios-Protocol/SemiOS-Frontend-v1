import TopUpBalance from '@/views/protoWeb/personal/TopUpBalance.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { userTopupBalance } from '@/common/api'
import TopUpBalanceDailog from '@/components/TopUpBalance.vue'

jest.mock('../../src/common/api')
import ElementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(ElementUI)
//  isMore: false,
//             topUpBalanceList: [],
const userTopupBalanceMock = [
  {
    canvasAmount: 1,
    daoDescription: '',
    daoId: 214,
    daoLogoUrl: 'https://image-test.protodao.io/dao/dao_default_logo.png',
    daoName: 'Ft 0201 Main noSub',
    daoNumber: '113',
    daoStatus: 2,
    ethBalance: 0.00215,
    favoriteAmount: 0,
    favorited: false,
    price: '0.00005',
    tokenBalance: 466666.6666666667,
    topupMode: false,
    whiteList: false,
    workAmount: 3,
    topUpBalanceList: [],
    isMore: false,
  },
]
jest.mock('../../src/common/api', () => ({
  userTopupBalance: jest.fn().mockReturnValue(
    Promise.resolve({
      dataList: userTopupBalanceMock,
    })
  ),
}))
describe('TopUpBalance.vue', () => {
  it('correctly sets TopUpBalance in created hook', async () => {
    const wrapper = shallowMount(TopUpBalance, {
      localVue,
      // slots: {
      //   default: [TopUpBalanceDailog],
      // },
      stubs: {
        // 用来注册自定义组件
        'top-up-balance-dailog': TopUpBalanceDailog,
      },
    })
    wrapper.vm.$nextTick()
    console.log(wrapper.classes())
    await userTopupBalance()
    expect(wrapper.vm.list).toEqual(userTopupBalanceMock)
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.list.length).toBe(1)
  })
})
