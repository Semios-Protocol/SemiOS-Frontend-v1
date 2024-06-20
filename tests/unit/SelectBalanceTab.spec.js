import SelectBalance from '@/views/protoWeb/works/SelectBalanceTab.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

import ElementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(ElementUI)

describe('SelectBalance.vue', () => {
  it('correctly sets SelectBalance in created hook', async () => {
    const wrapper = shallowMount(SelectBalance, {
      localVue,
      propsData: {
        isDialog: true,
        unTopUpMintList: [
          {
            bgColor: '#221D1D',
            canvasNumber: 1,
            daoId: 217,
            daoName: '0201 FT TOPUp',
            daoNumber: 115,
            erc20Amount: 133333.33333333334,
            erc721TokenAddress: '0x612ae450525eaceacaffb5b493cb2ac23b2fd44d',
            ethAmount: 0.0012,
            height: 240,
            imgUrl:
              'https://test-protodao.s3.ap-southeast-1.amazonaws.com/work/W17067762561581133.png',
            togetherDaoId: 215,
            togetherDaoName: 'Ft 0201 Main noSub',
            workId: 485,
            workLockStatus: 0,
            workNumber: 6,
          },
        ],
      },
      mocks: {
        activeName: 'topBalance',
        activeWork: { workId: null },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDialog).toBe(true)
  })
})
