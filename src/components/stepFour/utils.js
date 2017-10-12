import { attachToContract, checkTxMined, sendTXToContract } from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'

function setLastCrowdsale(web3, abi, addr, lastCrowdsale, gasLimit, cb) {
  console.log("###setLastCrowdsale for Pricing Strategy:###");
  attachToContract(web3, abi, addr, function(err, pricingStrategyContract) {
    console.log("attach to pricingStrategy contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!pricingStrategyContract) return noContractAlert();

    sendTXToContract(web3, pricingStrategyContract.methods.setLastCrowdsale(lastCrowdsale).send({gasLimit: gasLimit, gasPrice: 21000000000}), cb);
  });
}

//for mintable token
function setMintAgent(web3, abi, addr, acc, gasLimit, cb) {
  console.log("###setMintAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    sendTXToContract(web3, tokenContract.methods.setMintAgent(acc, true).send({gasLimit: gasLimit, gasPrice: 21000000000}), cb);
  });
}

function addWhiteList(round, web3, crowdsale, token, abi, addr, cb) {
  console.log("###whitelist:###");
  let whitelist = [];
  for (let i = 0; i <= round; i++) {
    console.log(crowdsale[i]);
    console.log(crowdsale[i].whitelist);

    for (let j = 0; j < crowdsale[i].whitelist.length; j++) {
      let itemIsAdded = false;
      for (let k = 0; k < whitelist.length; k++) {
        if (whitelist[k].addr == crowdsale[i].whitelist[j].addr) {
          itemIsAdded = true;
          break;
        }
      }
      if (!itemIsAdded) {
        whitelist.push.apply(whitelist, crowdsale[i].whitelist);
      }
    }

    if (crowdsale[i].whiteListInput.addr && crowdsale[i].whiteListInput.min && crowdsale[i].whiteListInput.max) {
      let itemIsAdded = false;
      for (let k = 0; k < whitelist.length; k++) {
        if (whitelist[k].addr == crowdsale[i].whiteListInput.addr) {
          itemIsAdded = true;
          break;
        }
      }
      if (!itemIsAdded) {
        whitelist.push({
          "addr": crowdsale[i].whiteListInput.addr,
          "min": crowdsale[i].whiteListInput.min,
          "max": crowdsale[i].whiteListInput.max
        });
      }
    }
  }
  console.log("whitelist: ");
  console.log(whitelist);

  if (whitelist.length === 0) {
    return cb();
  }
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    let addrs = [];
    let statuses = [];
    let minCaps = [];
    let maxCaps = [];

    for (let i = 0; i < whitelist.length; i++) {
      if (!whitelist[i].deleted) {
        addrs.push(whitelist[i].addr);
        statuses.push(true);
        minCaps.push(whitelist[i].min*10**token.decimals?toFixed((whitelist[i].min*10**token.decimals).toString()):0);
        maxCaps.push(whitelist[i].max*10**token.decimals?toFixed((whitelist[i].max*10**token.decimals).toString()):0);
      }
    }

    console.log("addrs:");
    console.log(addrs);
    console.log("statuses:");
    console.log(statuses);
    console.log("minCaps:");
    console.log(minCaps);
    console.log("maxCaps:");
    console.log(maxCaps);

    sendTXToContract(web3, crowdsaleContract.methods.setEarlyParicipantsWhitelist(addrs, statuses, minCaps, maxCaps).send({gasPrice: 21000000000}), cb)
  });
}

function updateJoinedCrowdsales(web3, abi, addr, joinedCntrctAddrs, cb) {
  console.log("###updateJoinedCrowdsales:###");
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!crowdsaleContract) return noContractAlert();

    console.log("input: ");
    console.log(joinedCntrctAddrs);

    sendTXToContract(web3, crowdsaleContract.methods.updateJoinedCrowdsalesMultiple(joinedCntrctAddrs).send({gasPrice: 21000000000}), cb);
  });
}

function setFinalizeAgent(web3, abi, addr, finalizeAgentAddr, gasLimit, cb) {
  console.log("###setFinalizeAgent:###");
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!crowdsaleContract) return noContractAlert();

    sendTXToContract(web3, crowdsaleContract.methods.setFinalizeAgent(finalizeAgentAddr).send({gasLimit: gasLimit, gasPrice: 21000000000}), cb);
  });
}

function setReleaseAgent(web3, abi, addr, finalizeAgentAddr, gasLimit, cb) {
  console.log("###setReleaseAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    sendTXToContract(web3, tokenContract.methods.setReleaseAgent(finalizeAgentAddr).send({gasLimit: gasLimit, gasPrice: 21000000000}), cb);
  });
}

export function setReservedTokensListMultiple(web3, abi, addr, token, cb) {
  console.log("###setReservedTokensListMultiple:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    let map = {};

    let addrs = [];
    let inTokens = [];
    let inPercentage = [];

    if (token.reservedTokensInput.addr && token.reservedTokensInput.dim && token.reservedTokensInput.val) {
      token.reservedTokens.push({
          "addr": token.reservedTokensInput.addr,
          "dim": token.reservedTokensInput.dim,
          "val": token.reservedTokensInput.val
      });
    }

    console.log("token.reservedTokens: ");
    console.log(token.reservedTokens);

    for (let i = 0; i < token.reservedTokens.length; i++) {
      if (!token.reservedTokens[i].deleted) {
        let val = token.reservedTokens[i].val;
        let addr = token.reservedTokens[i].addr;
        let obj = map[addr]?map[addr]:{};
        if (token.reservedTokens[i].dim === "tokens") obj.inTokens = val*10**token.decimals
        else obj.inPercentage = val;
        map[addr] = obj;
        //addrs.push(token.reservedTokens[i].addr);
        //dims.push(token.reservedTokens[i].dim == "tokens"?true:false);
        //vals.push(token.reservedTokens[i].dim == "tokens"?token.reservedTokens[i].val*10**token.decimals:token.reservedTokens[i].val);
      }
    }

    let keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
      addrs.push(keys[i]);
      inTokens.push(map[keys[i]].inTokens?toFixed(map[keys[i]].inTokens.toString()):0);
      inPercentage.push(map[keys[i]].inPercentage?map[keys[i]].inPercentage:0);
    }

    if (addrs.length === 0 && inTokens.length === 0 && inPercentage.length === 0) return cb();

    console.log("input: ");
    console.log("addrs: " + addrs);
    console.log("inTokens: " + inTokens);
    console.log("inPercentage: " + inPercentage);

    sendTXToContract(web3, tokenContract.methods.setReservedTokensListMultiple(addrs, inTokens, inPercentage).send({gasPrice: 21000000000}), cb);
  });
}

export function transferOwnership(web3, abi, addr, finalizeAgentAddr, gasLimit, cb) {
  console.log("###transferOwnership:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    sendTXToContract(web3, tokenContract.methods.transferOwnership(finalizeAgentAddr).send({gasLimit: gasLimit, gasPrice: 21000000000}), cb);
  });
}

export function setLastCrowdsaleRecursive (i, web3, abi, pricingStrategyAddrs, lastCrowdsale, gasLimit, cb) {
  setLastCrowdsale(web3, abi, pricingStrategyAddrs[i], lastCrowdsale, gasLimit, (err) => {
    i++;
    if (i < pricingStrategyAddrs.length) {
      setLastCrowdsaleRecursive(i, web3, abi, pricingStrategyAddrs, lastCrowdsale, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export function  setMintAgentRecursive (i, web3, abi, addr, crowdsaleAddrs, gasLimit, cb) {
  setMintAgent(web3, abi, addr, crowdsaleAddrs[i], gasLimit, (err) => {
    i++;
    if (i < crowdsaleAddrs.length) {
      setMintAgentRecursive(i, web3, abi, addr, crowdsaleAddrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export function updateJoinedCrowdsalesRecursive (i, web3, abi, addrs, cb) {
  if (addrs.length === 0) return cb();
  updateJoinedCrowdsales(web3, abi, addrs[i], addrs, (err) => {
    i++;
    if (i < addrs.length) {
      updateJoinedCrowdsalesRecursive(i, web3, abi, addrs, cb);
    } else {
      cb(err);
    }
  })
}

export function addWhiteListRecursive (i, web3, crowdsale, token, abi, crowdsaleAddrs, cb) {
  addWhiteList(i, web3, crowdsale, token, abi, crowdsaleAddrs[i], (err) => {
    i++;
    if (i < crowdsaleAddrs.length) {
      addWhiteListRecursive(i, web3, crowdsale, token, abi, crowdsaleAddrs, cb);
    } else {
      cb(err);
    }
  })
}

export function setFinalizeAgentRecursive (i, web3, abi, addrs, finalizeAgentAddrs, gasLimit, cb) {
  setFinalizeAgent(web3, abi, addrs[i], finalizeAgentAddrs[i], gasLimit, (err) => {
    i++;
    if (i < finalizeAgentAddrs.length) {
      setFinalizeAgentRecursive(i, web3, abi, addrs, finalizeAgentAddrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}
           
export function setReleaseAgentRecursive (i, web3, abi, addr, finalizeAgentAddrs, gasLimit, cb) {
  setReleaseAgent(web3, abi, addr, finalizeAgentAddrs[i], gasLimit, (err) => {
    i++;
    if (i < finalizeAgentAddrs.length) {
      setReleaseAgentRecursive(i, web3, abi, addr, finalizeAgentAddrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export const handleTokenForFile = (content, docData, state) => {
    const title = content.value
    const fileContent = title + state.token[content.field]
    docData.data += fileContent + '\n\n' 
}

export const handleCrowdsaleForFile = (content, docData, state) => {
    const title = content.value
    const fileContent = title + state.crowdsale[0][content.field]
    docData.data += fileContent + '\n\n'
}

export const handlePricingStrategyForFile = (content, docData, state) => {
    const title = content.value
    const fileContent = title + state.pricingStrategy[0][content.field]
    docData.data += fileContent + '\n\n'
}

export const handleFinalizeAgentForFile = (content, docData, state) => {
    const title = content.value
    const fileContent = title + state.finalizeAgent[0][content.field]
    docData.data += fileContent + '\n\n'
}

export const handleContractsForFile = (content, docData, state) => {
    const title = content.value
    if(content.field !== 'src' && content.field !== 'abi' && content.field !== 'addr') {
        let fileBody
        if ( Object.prototype.toString.call( state.contracts[content.child][content.field] ) === '[object Array]' ) {
          for (let i = 0; i < state.contracts[content.child][content.field].length; i++) {
            fileBody = state.contracts[content.child][content.field][i]

            if (!fileBody) return
            let fileContent = title + " for " + state.crowdsale[i].tier + ":**** \n \n" + fileBody
            docData.data += fileContent + '\n\n'
          }
        } else {
          fileBody = state.contracts[content.child][content.field]
          if (!fileBody) return
          let fileContent = title + ":**** \n \n" + fileBody
          docData.data += fileContent + '\n\n'
        }
    } else {
        addSrcToFile(content, docData, state)
    }
}

export const handleConstantForFile = (content, docData) => {
    const title = content.value
    const fileContent = title + content.fileValue
    docData.data += fileContent + '\n\n'
}

const addSrcToFile = (content, docData, state) => {
    const title = content.value

    if ( Object.prototype.toString.call( state.contracts[content.child][content.field] ) === '[object Array]'  && content.field !== 'abi') {
      for (let i = 0; i < state.contracts[content.child][content.field].length; i++) {
        const body = state.contracts[content.child][content.field][i]
        const text = title + " for " + state.crowdsale[i].tier + ": " + body
        docData.data += text + '\n\n'
      }
    } else {
      const body = content.field === 'abi' ? JSON.stringify(state.contracts[content.child][content.field]) : state.contracts[content.child][content.field]
      const text = title + body
      docData.data += text + '\n\n'
    }
}

export const download = (data, filename, type) => {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export function scrollToBottom() {
  window.scrollTo(0,document.body.scrollHeight);
}