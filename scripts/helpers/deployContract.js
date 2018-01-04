module.exports = deployContract

function deployContract(web3, abi, bin, from, gas = 1500000, gasPrice = '5000000000') {
  const Contract = new web3.eth.Contract(abi, { from })

  return Contract
    .deploy({
      data: bin
    })
    .send({
      from,
      gas,
      gasPrice
    })
}
