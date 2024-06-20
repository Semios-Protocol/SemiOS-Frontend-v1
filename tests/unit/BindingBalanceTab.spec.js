import BindingBalance from '@/views/protoWeb/works/BindingBalanceTab.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

import ElementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(ElementUI)
describe('BindingBalance.vue', () => {
  it('correctly sets BindingBalance in created hook', async () => {
    const wrapper = shallowMount(BindingBalance, {
      localVue,
      propsData: {
        isDialog: true,
        topUpMintList: [
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
        dataObj: {
          basicDao: 1,
          bgColor: '#221D1D',
          blockRewardEth: '0',
          blockRewardToken: '166666.6667',
          canId: null,
          canvasCurrentPrice: '0.0002',
          canvasId:
            '0x686f89e9dce4a088f89a95af2ec4dcabbefd231463ff57fbdb8fa0a8a981ed92',
          canvasName: null,
          canvasNumber: 1,
          canvasUri:
            'https://test-protodao.s3.ap-southeast-1.amazonaws.com/meta/canvas/686f89e9dce4a088f89a95af2ec4dcabbefd231463ff57fbdb8fa0a8a981ed92.json',
          createSignHash:
            '0x7d3e98c6d17a7c4d08e34e64c65fdb8f7f459cff8e0df2fcbf3a97d94b2fc0e47f7a40956d53d44eb801b73f4337eed2f70059696112b7c8c33ac3bef521cd011c',
          creatorAddress: '0xc537a223b7fe86483d31442248c5918177526bef',
          creatorName: null,
          daoErc20Address: '0xd39da0834f9ac972a729e658bd2f5098d7e09dbe',
          daoFloorPrice: '0.0001',
          daoId: 217,
          daoName: '0201 FT TOPUp',
          daoNumber: 115,
          daoStatus: 2,
          daoSymbol: 'SEMI.T113',
          daoVersion: 3,
          discordLink: null,
          erc20PaymentMode: false,
          erc721Address: '0x612ae450525eaceacaffb5b493cb2ac23b2fd44d',
          favorited: false,
          favoritesAmount: 0,
          fixedPrice: false,
          generate: 2,
          havePassesQuantity: null,
          height: 240,
          imageUrl:
            'https://test-protodao.s3.ap-southeast-1.amazonaws.com/work/W17067762561581133.png',
          internalRewardEth: '0',
          internalRewardToken: '166666.6667',
          isThirdpartyToken: false,
          lockTime: null,
          maximumProfit: 0,
          mintFee: '0',
          mintedBlock: '5201602',
          mintedBy: '0xc537a223b7fe86483d31442248c5918177526bef',
          mintedDate: '1706844600',
          mintedName: null,
          mintedPrice: '0.0004',
          mintedWorks: 0,
          minters: 0,
          mintersMaxRewardEth: null,
          mintersMaxRewardToken: null,
          modifiable: true,
          nextDrbStartTime: 0,
          openseaLink: null,
          originalImageUrl:
            'https://test-protodao.s3.ap-southeast-1.amazonaws.com/work/W17067762561581133.png',
          ownerAddress: '0xc537a223b7fe86483d31442248c5918177526bef',
          ownerName: null,
          passesTotalQuantity: null,
          price: '0.0004',
          projectId:
            '0xcfa5968e83cf77454f78e342e0518cf829b9451e064589fc48b10d1fa37bfcbe',
          reserveRatio: {
            d4aMintFee: 100,
            daoMintFee: 0,
            redeemPoolMintFee: 0,
            canvasMintFee: 0,
          },
          royaltyTokenPrice: null,
          socialLinks: null,
          spenderAddress: '0x82b305a1F65418b337017e6B314aFad72EF2391A',
          topupMode: true,
          tradeNft:
            'https://testnets.opensea.io/collection/protodao-0201-ft-topup',
          twitterLink: null,
          unifiedPriceModeOff: false,
          unifiedPriceSet: false,
          workDescription: '',
          workHash: '53177b47e52a1d7683efad6c05232082',
          workId: 485,
          workLockStatus: 0,
          workNumber: 6,
          workStatus: 1,
        },
      },
      mocks: {
        activeName: 'selectNft',
        activeWork: { workId: null },
        formData: {},
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDialog).toBe(true)
  })
})
