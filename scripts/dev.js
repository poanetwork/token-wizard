const Web3 = require('web3')
const fs = require('fs')
const shell = require('shelljs')
const { spawn } = require('child_process')
const deployContract = require('./helpers/deployContract')
const argv = require('yargs').argv

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const registryPath = 'public/contracts/Registry_flat'
const abi = JSON.parse(fs.readFileSync(`${registryPath}.abi`).toString())
const bin = fs.readFileSync(`${registryPath}.bin`).toString()

const fastStart = argv.fast

web3.eth.getAccounts()
  .then((accounts) => {
    const account = accounts[0]

    return deployContract(web3, abi, bin, account)
  })
  .then((registryInstance) => {
    shell.env['REACT_APP_REGISTRY_CONTRACT_ADDRESS'] = registryInstance.options.address

    if (fastStart) {
      spawn('node', ['scripts/start.js'], {
        stdio: 'inherit'
      })
    } else {
      spawn('npm', ['start'], {
        stdio: 'inherit'
      })
    }
  })

