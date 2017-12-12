import { action, observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales

  constructor (crowdsales = []) {
    // const crowdsales = [
    //   {
    //     "startTime": "2017-09-28T17:05",
    //     "endTime": "2017-10-03T00:05:00",
    //     "walletAddress": "0x005364854d51a0a12cb3cb9a402ef8b30702a565",
    //     "supply": "1000",
    //     "whitelist": [
    //       {
    //         "addr": "0x005364854d51A0A12cb3cb9A402ef8b30702a565",
    //         "min": "1",
    //         "max": "10"
    //       }
    //     ],
    //     "whiteListElements": [
    //       {
    //         "key": "0",
    //         "ref": null,
    //         "props": {
    //           "crowdsaleNum": 0,
    //           "whiteListNum": 0,
    //           "addr": "0x005364854d51A0A12cb3cb9A402ef8b30702a565",
    //           "min": "1",
    //           "max": "10"
    //         },
    //         "_owner": null,
    //         "_store": {}
    //       }
    //     ],
    //     "whiteListInput": {
    //       "addr": "",
    //       "min": "",
    //       "max": ""
    //     },
    //     "tier": "Tier 1",
    //     "updatable": "on",
    //     "whitelistdisabled": "no"
    //   },
    //   {
    //     "tier": "Tier 2",
    //     "supply": "1000",
    //     "updatable": "on",
    //     "whitelist": [],
    //     "whiteListElements": [],
    //     "whiteListInput": {},
    //     "startTime": "2017-10-03T00:05:00",
    //     "endTime": "2017-10-07T00:05:00"
    //   }
    // ]
    //
    // const token = {
    //   'name': 'MyToken',
    //   'ticker': 'MTK',
    //   'supply': 0,
    //   'decimals': '18',
    //   'reservedTokens': [
    //     {
    //       'addr': '0x005364854d51A0A12cb3cb9A402ef8b30702a565',
    //       'dim': 'tokens',
    //       'val': '10'
    //     }
    //   ],
    //   'reservedTokensElements': [
    //     {
    //       'key': '0',
    //       'ref': null,
    //       'props': {
    //         'num': 0,
    //         'addr': '0x005364854d51A0A12cb3cb9A402ef8b30702a565',
    //         'dim': 'tokens',
    //         'val': '10'
    //       },
    //       '_owner': null,
    //       '_store': {}
    //     }
    //   ],
    //   'reservedTokensInput': {
    //     'dim': 'tokens',
    //     'addr': '',
    //     'val': ''
    //   }
    // }

    this.crowdsales = crowdsales.concat([
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      },
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      },
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      },
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      },
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      },
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      },
      {
        'contractAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'contractId': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        'extraData': {
          'startTime': '2017-09-28T17:05',
          'tokenName': 'MyToken',
          'ticker': 'MTK',
          'endTime': '2017-10-03T00:05:00',
          'walletAddress': '0x005364854d51a0a12cb3cb9a402ef8b30702a565',
        }
      }
    ])
  }

  @action setCrowdsale = crowdsale => {
    this.crowdsales.push(crowdsale)
  }
}

const crowdsaleStore = new CrowdsaleStore();

export default crowdsaleStore;
export { CrowdsaleStore };
