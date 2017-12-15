const Web3 = require('web3')
const fs = require('fs')
const deployContract = require('./helpers/deployContract')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const registryPath = 'public/contracts/Registry_flat'

const registryAbi = JSON.parse(fs.readFileSync(`${registryPath}.abi`).toString())
const registryBin = fs.readFileSync(`${registryPath}.bin`).toString()

web3.eth.getAccounts()
  .then((accounts) => deployContract(web3, registryAbi, registryBin, accounts[0]))
