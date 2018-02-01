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

    it('should work for sokol', () => {
      expect(getNetWorkNameById(77)).toEqual('Sokol');
    });

    it('should work for core POA', () => {
      expect(getNetWorkNameById(99)).toEqual('Core_POA');
    });

    it('should return null for unknown network ids', () => {
      expect(getNetWorkNameById(5)).toEqual(null);
      expect(getNetWorkNameById(43)).toEqual(null);
      expect(getNetWorkNameById(1000)).toEqual(null);
    })
  })
})
