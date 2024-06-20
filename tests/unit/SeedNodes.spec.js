import { mount } from '@vue/test-utils';
import SeedNodes from '@/views/protoWeb/collections/SeedNodes.vue'

describe('SeedNodes.spec', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SeedNodes.spec, {
      data() {
        return {
          list: [
            { daoId: 1, favorited: false, favoriteAmount: 0 },
            { daoId: 2, favorited: true, favoriteAmount: 5 },
          ],
          loading: false,
          isAll: false,
          qvalue: '0',
        };
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('updates list when qvalue changes', async () => {
    wrapper.setData({ qvalue: '1' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.list).toEqual([]);
  });

  it('calls getData method when qvalue changes', async () => {
    const getDataSpy = jest.spyOn(wrapper.vm, 'getData');
    wrapper.setData({ qvalue: '1' });
    await wrapper.vm.$nextTick();
    expect(getDataSpy).toHaveBeenCalled();
  });

  it('calls setAmount method when setAmount is called', async () => {
    const setAmountSpy = jest.spyOn(wrapper.vm, 'setAmount');
    await wrapper.vm.setAmount({ daoId: 1, favorited: false, favoriteAmount: 0 }, 0);
    expect(setAmountSpy).toHaveBeenCalled();
  });

  // Add more tests as needed
});
