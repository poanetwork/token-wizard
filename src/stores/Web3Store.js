import { observable } from 'mobx';
import { getWeb3 } from '../utils/blockchainHelpers'

class Web3Store {

	@observable web3;
	@observable curAddress
	@observable accounts 

	constructor(strategies) {
		getWeb3((web3) => {
			this.web3 = web3
			web3.eth.getAccounts().then((accounts) => {
				this.accounts = accounts
        this.curAddress = accounts[0]
  		})
		})
	}
}

const web3Store = new Web3Store();

export default web3Store;
export { Web3Store };
