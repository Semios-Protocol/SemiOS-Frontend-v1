import { mount } from '@vue/test-utils'
import TopUpRewardItemCard from '@/views/protoWeb/personal/TopUpRewardItemCard.vue'
import Loading from '@/components/Loading.vue'
import TopUpRewardItemTable from '@/views/protoWeb/personal/TopUpRewardItemTable.vue'

jest.mock('@/common/api', () => ({
  userTopupBalance: jest.fn(() => Promise.resolve({
    dataList: [
      {
        daoId: 1,
        daoLogoUrl: 'logo-url',
        daoName: 'Dao Name',
        daoDescription: 'Dao Description',
        ethBalance: 1000,
        tokenBalance: 2000,
        payCurrencyType: 'ETH',
        inputTokenAddress: 'input-token-address',
        daoSymbol: 'DAO',
        daoErc20Address: 'dao-erc20-address',
        topUpBalanceList: []
      }
    ]
  }))
}))

describe('TopUpRewardItemCard', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(TopUpRewardItemCard)
    await wrapper.vm.getData()
  })

  it('renders loading component when isLoading is true', async () => {
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
  })

  it('renders correct content when isLoading is false', async () => {
    wrapper.setData({ isLoading: false })

    expect(wrapper.findComponent(Loading).exists()).toBe(false)

    expect(wrapper.find('.top-card').exists()).toBe(true)
    expect(wrapper.find('.noData').exists()).toBe(false)
  })

  it('renders correct data in the list', async () => {
    wrapper.setData({ isLoading: false })

    const listItem = wrapper.find('.card-item')

    expect(listItem.find('.item-title h4').text()).toBe('Dao Name')
    expect(listItem.find('.centext p').text()).toBe('1000')
  })

  it('renders TopUpRewardItemTable component with correct props', async () => {
    wrapper.setData({ isLoading: false })

    expect(wrapper.findComponent(TopUpRewardItemTable).exists()).toBe(true)


  })

})
