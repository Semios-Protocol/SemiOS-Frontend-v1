import { mount } from '@vue/test-utils'
import TopUpReward from '@/views/protoWeb/personal/TopUpReward.vue'
import TopUpRewardItemCard from '@/components/TopUpRewardItemCard.vue'

describe('TopUpReward', () => {
  it('renders TopUpRewardItemCard component', () => {
    const wrapper = mount(TopUpReward)

    // 检查是否正确渲染了TopUpRewardItemCard组件
    expect(wrapper.findComponent(TopUpRewardItemCard).exists()).toBe(true)
  })
})
