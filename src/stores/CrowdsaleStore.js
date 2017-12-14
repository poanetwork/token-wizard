import { observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales

  constructor (crowdsales = []) {
    this.crowdsales = crowdsales.concat([
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a566',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a567',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a568',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a569',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a570',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a571',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      },
      {
        contractAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a572',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
          isWhitelisted: true,
          tiers: [
            {
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-10-28T12:00',
              endTime: '2017-11-28T12:00',
              rate: 100,
              supply: 500000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 10000,
                  max: 1000000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 4000000
                }
              ]
            },
            {
              updatable: false,
              name: 'Tier 2',
              startTime: '2017-12-23T10:00',
              endTime: '2018-01-23T10:00',
              rate: 120,
              supply: 100000,
              whitelist: [
                {
                  addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
                  min: 6000,
                  max: 800000
                },
                {
                  addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
                  min: 8000,
                  max: 2000000
                }
              ]
            }
          ]
        }
      }
    ])
  }
}

const crowdsaleStore = new CrowdsaleStore()

export default crowdsaleStore
export { CrowdsaleStore }
