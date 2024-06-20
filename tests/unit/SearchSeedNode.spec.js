import { mount, createRouter, } from '@vue/test-utils';
import SearchSeedNode from '@/views/protoWeb/search/SearchSeedNode.vue'
import { createMemoryHistory } from 'vue-router';

describe('SearchSeedNode', () => {
  let wrapper;

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', query: { query: 'searchQuery' } }],
  });

  beforeEach(async () => {
    wrapper = mount(SearchSeedNode, {
      propsData: {
        amountObj: { daoAmount: 5 }, // Sample props data
      },
      global: {
        plugins: [router],
      },
    });

    await router.isReady();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders the component correctly when amountObj.daoAmount > 0', () => {
    expect(wrapper.find('.nei-box').exists()).toBe(true);
    expect(wrapper.find('.nodata').exists()).toBe(false);
  });

  it('renders the component correctly when amountObj.daoAmount = 0', async () => {
    await wrapper.setProps({ amountObj: { daoAmount: 0 } });
    expect(wrapper.find('.nei-box').exists()).toBe(false);
    expect(wrapper.find('.nodata').exists()).toBe(true);
  });

  it('calls back method when button is clicked', async () => {
    const backMethodSpy = jest.spyOn(wrapper.vm, 'back');
    await wrapper.setProps({ amountObj: { daoAmount: 0 } });
    const backButton = wrapper.find('.btnle');
    await backButton.trigger('click');
    expect(backMethodSpy).toHaveBeenCalled();
  });

  // Add more tests as needed
});