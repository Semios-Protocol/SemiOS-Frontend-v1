import RightMember from '@/views/protoWeb/daoCollectionAnalytics/RightMember.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { togetherDaoInfo } from '@/common/api'

jest.mock('../../src/common/api')
import ElementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(ElementUI)
const togetherDaoInfoMock = {
  creatorAddress: '0xc537a223b7fe86483d31442248c5918177526bef',
  daoDescription: 'asd',
  daoId: 106,
  daoLogoUrl: 'https://image-test.protodao.io/dao/dao_default_logo.png',
  daoManitesto: 'asdasd',
  daoName: '0110 1147 asd',
  daoNumber: null,
  daoStatus: null,
  discordLink: '',
  erc20Address: '0x05836eb8e25a05e0b2c8271a83491baf45768cc5',
  erc721Address: '0x6c08b6b39f32f2dfa3889d613370555923b92538',
  feePool: '0xae6f86c2b48448de8fb6301c1f835ebd5f07d6f4',
  modifiable: true,
  openseaLink: 'asdasd',
  projectId: null,
  twitterLink: '',
  socialLinks: ['', '', ''],
}
jest.mock('../../src/common/api', () => ({
  togetherDaoInfo: jest.fn().mockReturnValue(
    Promise.resolve({
      data: togetherDaoInfoMock,
    })
  ),
}))
describe('RightMember.vue', () => {
  it('correctly sets RightMember in created hook', async () => {
    const wrapper = shallowMount(RightMember, {
      localVue,
      mocks: {
        $route: {
          query: { id: '103' }, // 模拟路由参数
        },
      },
    })
    wrapper.vm.$nextTick()
    await togetherDaoInfo()
    expect(wrapper.vm.objData).toEqual(togetherDaoInfoMock)
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
