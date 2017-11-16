import { getNetWorkNameById } from './blockchainHelpers';

describe('blockchainHelpers', () => {
  describe('getNetWorkNameById', () => {
    it('should work for the mainnet', () => {
      expect(getNetWorkNameById(1)).toEqual('Mainnet');
    });

    it('should work for morden', () => {
      expect(getNetWorkNameById(2)).toEqual('Morden');
    });

    it('should work for ropsten', () => {
      expect(getNetWorkNameById(3)).toEqual('Ropsten');
    });

    it('should work for rinkeby', () => {
      expect(getNetWorkNameById(4)).toEqual('Rinkeby');
    });

    it('should work for kovan', () => {
      expect(getNetWorkNameById(42)).toEqual('Kovan');
    });

    it('should work for oracles dev test network', () => {
      expect(getNetWorkNameById(12648430)).toEqual('Oracles dev test');
    });

    it('should return Unknown for unknown network ids', () => {
      expect(getNetWorkNameById(5)).toEqual('Unknown');
      expect(getNetWorkNameById(43)).toEqual('Unknown');
      expect(getNetWorkNameById(1000)).toEqual('Unknown');
    })
  })
})
