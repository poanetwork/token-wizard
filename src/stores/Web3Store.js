import { observable } from 'mobx';
import { getWeb3 } from '../utils/blockchainHelpers'

class Web3Store {

	@observable web3;
	
	constructor(strategies) {
    getWeb3((web3) => this.web3 = web3)
  }

}

const web3Store = new Web3Store();

export default web3Store;
export { Web3Store };
