import { observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales

  constructor (crowdsales = []) {
    this.crowdsales = crowdsales.concat([
      {
        contractAddress: '0xFfec8Cd7CDBfeD2A94Ee2CA84698F6cd3CaB8391',
        extraData: {
          creationDate: '2017-09-28T17:05',
          tokenName: 'MyToken',
          ticker: 'MTK',
          walletAddress: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
          tiers: [
            {
              address: '0xb09bCc172050fBd4562da8b229Cf3E45Dc3045A6',
              updatable: true,
              name: 'Tier 1',
              startTime: '2017-12-18T13:08',
              endTime: '2017-12-18T13:10',
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
              address: '0xFC628dd79137395F3C9744e33b1c5DE554D94882',
              updatable: true,
              name: 'Tier 2',
              startTime: '2017-12-18T13:10',
              endTime: '2017-12-18T13:12',
              rate: 20,
              supply: 22,
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
        contractAddress: '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
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
