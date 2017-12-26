import { observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable supply
  @observable selected

  constructor (crowdsales = []) {
    this.crowdsales = crowdsales.concat([
      '0x4bf749ec68270027C5910220CEAB30Cc284c7BA2',
      '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a567',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a568',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a569',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a570',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a571',
      '0x005364854d51a0a12cb3cb9a402ef8b30702a572'
    ])
    this.selected = {
      updatable: true
    }
  }

  @action setProperty = (property, value) => {
    this[property] = value
  }

  @action setSelectedProperty = (property, value) => {
    let currentCrowdsale = Object.assign({}, this.selected)
    currentCrowdsale[property] = value
    this.selected = currentCrowdsale
  }
}

const crowdsaleStore = new CrowdsaleStore()

export default crowdsaleStore
export { CrowdsaleStore }
