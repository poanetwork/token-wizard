import { action, observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable supply

  constructor (crowdsales = []) {
    this.crowdsales = crowdsales.concat([
      '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
      '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a567',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a568',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a569',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a570',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a571',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a572'
    ])
  }

  @action setProperty = (property, value) => {
    this[property] = value
  }
}

const crowdsaleStore = new CrowdsaleStore()

export default crowdsaleStore
export { CrowdsaleStore }
