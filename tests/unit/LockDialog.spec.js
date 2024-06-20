import LockDialog from '@/views/protoWeb/works/LockDialog.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

import ElementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(ElementUI)

describe('LockDialog.vue', () => {
  it('correctly sets LockDialog in created hook', async () => {
    const wrapper = shallowMount(LockDialog, {
      localVue,
      propsData: {
        isLockDialog: true,
      },
      mocks: {
        formData: { time: null },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isLockDialog).toBe(true)
    expect(wrapper.vm.formData.time).toBe(null)
    await wrapper.setData({ formData: { time: 123 } })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.formData.time).toBe(123)
  })
})
