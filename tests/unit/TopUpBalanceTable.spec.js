import TopUpBalanceTable from '@/components/TopUpBalance.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(ElementUI)
const mokeList = [
  {
    daoId: 217,
    daoName: '0201 FT TOPUp',
    ethBalance: 0.0012,
    togetherDaoId: 215,
    tokenBalance: 133333.33333333334,
    workId: 485,
    workLockStatus: 0,
    workNumber: 6,
  },
]
describe('TopUpBalanceTable.vue', () => {
  it('correctly sets TopUpBalanceTable in created hook', async () => {
    const wrapper = shallowMount(TopUpBalanceTable, {
      localVue,
      propsData: {
        list: mokeList,
        isTop: false,
      },
    })
    await wrapper.vm.$nextTick()
    console.log(wrapper.classes())
    expect(wrapper.vm.list).toEqual(mokeList)
  })
})
