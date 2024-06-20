import { mount } from '@vue/test-utils'

import TopUpRewardItemTable from '@/views/protoWeb/personal/TopUpRewardItemTable.vue'
import TokenIcon from '@/components/TokenIcon.vue'
describe('TopUpRewardItemTable', () => {
  it('renders correct number of elements based on the list prop', () => {
    const list = [
      {
        daoName: 'Dao 1',
        payCurrencyType: 'ETH',
        inputTokenAddress: 'address1'
      },
      {
        daoName: 'Dao 2',
        payCurrencyType: 'BTC',
        inputTokenAddress: 'address2'
      }
    ]

    const wrapper = mount(TopUpRewardItemTable, {
      propsData: {
        list: list
      }
    })

    const rows = wrapper.findAll('.table-box > .el-row')
    expect(rows.length).toBe(list.length)

    rows.forEach((row, index) => {
      const tokens = row.findAllComponents(TokenIcon)
      expect(tokens.length).toBe(2)
      expect(tokens.at(0).props('payCurrencyType')).toBe(list[index].payCurrencyType)
      expect(tokens.at(0).props('inputTokenAddress')).toBe(list[index].inputTokenAddress)
      expect(tokens.at(1).props('payCurrencyType')).toBe(list[index].payCurrencyType)
      expect(tokens.at(1).props('inputTokenAddress')).toBe(list[index].inputTokenAddress)
    })
  })
})
