import React from 'react'
import '../assets/stylesheets/application.css';
import { deployContract, getWeb3, getNetworkVersion, addWhiteList, setFinalizeAgent, approve, setTransferAgent, setMintAgent, setReleaseAgent, updateJoinedCrowdsales, transferOwnership, setReservedTokensListMultiple, setLastCrowdsale } from '../utils/web3'
import { noMetaMaskAlert } from '../utils/alerts'
import { defaultState, PDF_CONTENTS } from '../utils/constants'
import { getOldState, handleContractsForPDF, handleTokenForPDF, handleCrowdsaleForPDF, handlePricingStrategyForPDF, handleConstantForPDF, toFixed } from '../utils/utils'
import { getEncodedABIClientSide } from '../utils/microservices'
import { stepTwo } from './stepTwo'
import { StepNavigation } from './Common/StepNavigation'
import { DisplayField } from './Common/DisplayField'
import { Loader } from './Common/Loader'
import { NAVIGATION_STEPS } from '../utils/constants'
import jsPDF from 'jspdf'
const { PUBLISH } = NAVIGATION_STEPS

export class stepFour extends stepTwo {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
    console.log('oldState oldState oldState', oldState)
  }

  componentDidMount() {
    switch (this.state.contractType) {
      case this.state.contractTypes.standard: {
        let $this = this;
        let abiCrowdsale = this.state.contracts && this.state.contracts.crowdsale && this.state.contracts.crowdsale.abi || []

        let state = { ...this.state }
        setTimeout(function() {
           getWeb3((web3) => {
            state.web3 = web3;
            $this.setState(state);
            getEncodedABIClientSide(web3, abiCrowdsale, $this.state, [], 0, (ABIencoded) => {
              let cntrct = "crowdsale";
              let state = { ...$this.state }
              state.contracts[cntrct].abiConstructor.push(ABIencoded);
              console.log(cntrct + " ABI encoded params constructor:");
              console.log(ABIencoded);
              $this.setState(state);
            });
          });
        });
      } break;
      case this.state.contractTypes.whitelistwithcap: {
        let state = { ...this.state }
        state.loading = true;
        this.setState(state);
        let abiToken = this.state.contracts && this.state.contracts.token && this.state.contracts.token.abi || []
        let addrToken = this.state.contracts && this.state.contracts.token && this.state.contracts.token.addr || null
        
        let abiPricingStrategy = this.state.contracts && this.state.contracts.pricingStrategy && this.state.contracts.pricingStrategy.abi || []
        
        let $this = this;
        setTimeout(function() {
           getWeb3((web3) => {
            state.web3 = web3;
            $this.setState(state);
            if (!addrToken) {
              getEncodedABIClientSide(web3, abiToken, state, [], 0, (ABIencoded) => {
                let cntrct = "token";
                let state = { ...$this.state }
                state.contracts[cntrct].abiConstructor = ABIencoded;
                console.log(cntrct + " ABI encoded params constructor:");
                console.log(ABIencoded);
                $this.setState(state);
              });
            }
            for (let i = 0; i < $this.state.pricingStrategy.length; i++) {
              getEncodedABIClientSide(web3, abiPricingStrategy, state, [], i, (ABIencoded) => {
                let cntrct = "pricingStrategy";
                let state = { ...$this.state }
                state.contracts[cntrct].abiConstructor.push(ABIencoded);
                console.log(cntrct + " ABI encoded params constructor:");
                console.log(ABIencoded);
                $this.setState(state);
              });
            }

            console.log($this.state.contracts.crowdsale.addr.length);
            if ($this.state.contracts.crowdsale.addr.length == 0) {
              $this.deployTokenTransferProxy();
            } else {
              $this.deployPricingStrategy();
            }
          });
        });
      } break;
      default:
        break;
    }
  }

  handleContentByParent(content, doc) {
    switch(content.parent) {
      case 'token':
        return handleTokenForPDF(content, doc, this.state)
      case 'crowdsale':
        return handleCrowdsaleForPDF(content, doc, this.state)
      case 'contracts':
        return handleContractsForPDF(content, doc, this.state)
      case 'pricingStrategy':
        return handlePricingStrategyForPDF(content, doc, this.state)
      case 'none':
        return handleConstantForPDF(content, doc)
    }
  }

  downloadCrowdsaleInfo() {
    var doc = new jsPDF('p', 'mm', 'a4')
    doc.setLineWidth(50)
    PDF_CONTENTS.forEach(content => {
      this.handleContentByParent(content, doc)
    })
    doc.save('crowdsale.pdf')
  }

  deployTokenTransferProxy = () => {
    console.log("***Deploy tokenTransferProxy contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      var contracts = this.state.contracts;
      var binTokenTransferProxy = contracts && contracts.tokenTransferProxy && contracts.tokenTransferProxy.bin || ''
      var abiTokenTransferProxy = contracts && contracts.tokenTransferProxy && contracts.tokenTransferProxy.abi || []
      deployContract(0, this.state.web3, abiTokenTransferProxy, binTokenTransferProxy, [], this.state, this.handleDeployedTokenTransferProxy)
     });
  }

  handleDeployedTokenTransferProxy = (err, tokenTransferProxyAddr) => {
    let newState = { ...this.state }
    if (err) {
      newState.loading = false;
      this.setState(newState);
      return console.log(err);
    }
    newState.contracts.tokenTransferProxy.addr = tokenTransferProxyAddr;
    this.deployMultisig();
  }

  deployMultisig = () => {
    console.log("***Deploy multisig contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      var contracts = this.state.contracts;
      var binMultisig = contracts && contracts.multisig && contracts.multisig.bin || ''
      var abiMultisig = contracts && contracts.multisig && contracts.multisig.abi || []
      var paramsMultisig = this.getMultisigParams(this.state.web3)
      console.log(paramsMultisig);
      deployContract(0, this.state.web3, abiMultisig, binMultisig, paramsMultisig, this.state, this.handleDeployedMultisig)
     });
  }

  getMultisigParams = (web3) => {
    return [
      [web3.eth.accounts[0]],
      1,
      60,
      this.state.contracts.tokenTransferProxy.addr
    ]
  }

  handleDeployedMultisig = (err, multisigAddr) => {
    let newState = { ...this.state }
    if (err) {
      newState.loading = false;
      this.setState(newState);
      return console.log(err);
    }
    newState.contracts.multisig.addr = multisigAddr;
    this.deployToken();
  }

  deployToken = () => {
    console.log("***Deploy token contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      var contracts = this.state.contracts;
      var binToken = contracts && contracts.token && contracts.token.bin || ''
      var abiToken = contracts && contracts.token && contracts.token.abi || []
      var token = this.state.token;
      var paramsToken = this.getTokenParams(this.state.web3, token)
      console.log(paramsToken);
      deployContract(0, this.state.web3, abiToken, binToken, paramsToken, this.state, this.handleDeployedToken)
     });
  }

  getTokenParams = (web3, token) => {
    console.log(token);
    return [
      token.name,
      token.ticker,
      parseInt(token.supply, 10),
      parseInt(token.decimals, 10),
      true
    ]
  }

  handleDeployedToken = (err, tokenAddr) => {
    let newState = { ...this.state }
    if (err) {
      newState.loading = false;
      this.setState(newState);
      return console.log(err);
    }
    newState.contracts.token.addr = tokenAddr;
    this.deployPricingStrategy();
  }

  deployPricingStrategy = () => {
    console.log("***Deploy pricing strategy contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      let contracts = this.state.contracts;
      let binPricingStrategy = contracts && contracts.pricingStrategy && contracts.pricingStrategy.bin || ''
      let abiPricingStrategy = contracts && contracts.pricingStrategy && contracts.pricingStrategy.abi || []
      let pricingStrategies = this.state.pricingStrategy;
      this.deployPricingStrategyRecursive(0, pricingStrategies, binPricingStrategy, abiPricingStrategy)
     });
  }

  deployPricingStrategyRecursive = (i, pricingStrategies, binPricingStrategy, abiPricingStrategy) => {
    var paramsPricingStrategy = this.getPricingStrategyParams(this.state.web3, pricingStrategies[i], i, this.state.token)
    console.log("getPricingStrategyParams:");
    console.log(paramsPricingStrategy);
    if (i < pricingStrategies.length - 1) {
      deployContract(i, this.state.web3, abiPricingStrategy, binPricingStrategy, paramsPricingStrategy, this.state, (err, pricingStrategyAddr) => {
        i++;
        let newState = { ...this.state }
        if (err) {
          newState.loading = false;
          this.setState(newState);
          return console.log(err);
        }
        newState.contracts.pricingStrategy.addr.push(pricingStrategyAddr);
        this.setState(newState);
        this.deployPricingStrategyRecursive(i, pricingStrategies, binPricingStrategy, abiPricingStrategy);
      })
    } else {
      deployContract(i, this.state.web3, abiPricingStrategy, binPricingStrategy, paramsPricingStrategy, this.state, this.handleDeployedPricingStrategy)
    }
  }

  //FlatPricing
  getPricingStrategyParams = (web3, pricingStrategy, i, token) => {
    console.log(pricingStrategy);
    return [
      //web3.toWei(1/pricingStrategy.rate, "ether")
      //pricingStrategy.rate
      //web3.toWei(1/pricingStrategy.rate/10**token.decimals, "ether")
      web3.toWei(1/pricingStrategy.rate, "ether"),
      this.state.crowdsale[i].updatable?this.state.crowdsale[i].updatable=="on"?true:false:false
    ]
  }

  //EthTranchePricing
  /*getPricingStrategyParams = (web3, pricingStrategy) => {
    console.log(pricingStrategy);
    return [
      pricingStrategy.tranches
    ]
  }*/

  //MilestonePricing
  /*getPricingStrategyParams = (web3, crowdsale, pricingStrategy) => {
    console.log(crowdsale);
    let pricing = [];
    for (let i = 0; i < crowdsale.length; i++) {
      let crowdsaleItem = crowdsale[i];
      let pricingStrategyItem = pricingStrategy[i];
      let endDate = new Date(crowdsaleItem.endDate).getTime()/1000;
      console.log("Milestone end date: " + endDate);
      let oneTokenInWei = web3.toWei(1/pricingStrategyItem.rate, "ether")
      console.log("oneTokenInWei: " + oneTokenInWei);
      pricing.push(endDate);
      pricing.push(oneTokenInWei);
    }
    console.log("Pricing strategy params:");
    console.log(pricing);
    return [
      pricing
    ]
  }*/

  //TokenTranchePricing
  /*getPricingStrategyParams = (web3, crowdsale, pricingStrategy) => {
    console.log(crowdsale);
    let pricing = [];
    for (let i = 0; i < crowdsale.length; i++) {
      let crowdsaleItem = crowdsale[i];
      let pricingStrategyItem = pricingStrategy[i];
      let supply = crowdsaleItem.supply;
      pricing.push(supply);
      pricing.push(oneTokenInWei);
    }
    console.log("Pricing strategy params:");
    console.log(pricing);
    return [
      pricing
    ]
  }*/

  handleDeployedPricingStrategy = (err, pricingStrategyAddr) => {
    let newState = { ...this.state }
    if (err) {
      newState.loading = false;
      this.setState(newState);
      return console.log(err);
    }
    newState.contracts.pricingStrategy.addr.push(pricingStrategyAddr);
    newState.loading = false;
    this.setState(newState);
    let $this = this;
    let abiCrowdsale = this.state.contracts && this.state.contracts.crowdsale && this.state.contracts.crowdsale.abi || []
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      getEncodedABIClientSide(this.state.web3, abiCrowdsale, newState, [], i, (ABIencoded) => {
        let cntrct = "crowdsale";
        let state = { ...$this.state }
        state.contracts[cntrct].abiConstructor.push(ABIencoded);
        console.log(cntrct + " ABI encoded params constructor:");
        console.log(ABIencoded);
        $this.setState(state);
      });
    }
  }

  goToCrowdsalePage = () => {
    let crowdsalePage = "/crowdsale";
    const {contracts} = this.state
    const isValidContract = contracts && contracts.crowdsale && contracts.crowdsale.addr
    let url;
    url = crowdsalePage + `?addr=` + contracts.crowdsale.addr[0]
    //crowdsale contracts relations are in the blockchain
    /*for (let i = 1; i < contracts.crowdsale.addr.length; i++) {
      url += `&addr=` + contracts.crowdsale.addr[i]
    }*/
    url += `&networkID=` + contracts.crowdsale.networkID + `&contractType=` + this.state.contractType
    let newHistory = isValidContract ? url : crowdsalePage
    this.props.history.push(newHistory);
  }

  deployCrowdsale = () => {
    console.log("***Deploy crowdsale contract***");
    getWeb3((web3) => {
      getNetworkVersion(web3, (_networkID) => {
        console.log('web3', web3)

        if (web3.eth.accounts.length === 0) {
          return noMetaMaskAlert();
        }
        let newState = { ...this.state }
        newState.contracts.crowdsale.networkID = _networkID;
        newState.web3 = web3
        newState.loading = true;
        this.setState(newState);
        let contracts = this.state.contracts;
        let binCrowdsale = contracts && contracts.crowdsale && contracts.crowdsale.bin || ''
        let abiCrowdsale = contracts && contracts.crowdsale && contracts.crowdsale.abi || []
        let crowdsales = this.state.crowdsale;
        
        this.deployCrowdsaleRecursive(0, crowdsales, binCrowdsale, abiCrowdsale)
       });
    });
  }

  deployCrowdsaleRecursive = (i, crowdsales, binCrowdsale, abiCrowdsale) => {
    let paramsCrowdsale;
    switch (this.state.contractType) {
      case this.state.contractTypes.standard: {
        paramsCrowdsale = this.getStandardCrowdSaleParams(this.state.web3)
      } break;
      case this.state.contractTypes.whitelistwithcap: {
        paramsCrowdsale = this.getCrowdSaleParams(this.state.web3, i)
      } break;
      default:
        break;
    }
    console.log(paramsCrowdsale);
    if (i < crowdsales.length - 1) {
      deployContract(i, this.state.web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, this.state, (err, crowdsaleAddr) => {
        i++;
        let newState = { ...this.state }
        if (err) {
          newState.loading = false;
          this.setState(newState);
          return console.log(err);
        }
        newState.contracts.crowdsale.addr.push(crowdsaleAddr);
        this.setState(newState);
        this.deployCrowdsaleRecursive(i, crowdsales, binCrowdsale, abiCrowdsale);
      })
    } else {
      deployContract(i, this.state.web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, this.state, this.handleDeployedContract)
    }
  }

  getStandardCrowdSaleParams = (web3) => {
    return [
      parseInt(this.state.crowdsale[0].startBlock, 10), 
      parseInt(this.state.crowdsale[0].endBlock, 10), 
      web3.toWei(this.state.pricingStrategy[0].rate, "ether"), 
      this.state.crowdsale[0].walletAddress,
      parseInt(this.state.crowdsale[0].supply, 10),
      this.state.token.name,
      this.state.token.ticker,
      parseInt(this.state.token.decimals, 10),
      parseInt(this.state.token.supply, 10)
    ]
  }

  //AllocatedCrowdsale
  /*getCrowdSaleParams = (web3) => {
    return [
      this.state.contracts.token.addr,
      this.state.contracts.pricingStrategy.addr,
      this.state.contracts.multisig.addr,
      parseInt(Date.parse(this.state.crowdsale[0].startTime)/1000, 10), 
      parseInt(Date.parse(this.state.crowdsale[0].endTime)/1000, 10), 
      parseInt(this.state.token.supply, 10),
      this.state.crowdsale[0].walletAddress
    ]
  }*/

  //MintedTokenCappedCrowdsale
  getCrowdSaleParams = (web3, i) => {
    return [
      this.state.contracts.token.addr,
      this.state.contracts.pricingStrategy.addr[i],
      this.state.contracts.multisig.addr,
      parseInt(Date.parse(this.state.crowdsale[i].startTime)/1000, 10), 
      parseInt(Date.parse(this.state.crowdsale[i].endTime)/1000, 10), 
      0,
      toFixed(parseInt(this.state.crowdsale[i].supply, 10)*10**parseInt(this.state.token.decimals, 10)).toString(),
      this.state.crowdsale[i].updatable?this.state.crowdsale[i].updatable=="on"?true:false:false
    ]
  }

  handleDeployedContract = (err, crowdsaleAddr) => {
    let newState = { ...this.state }
    if (err) {
      newState.loading = false;
      this.setState(newState);
      return console.log(err);
    }
    newState.contracts.crowdsale.addr.push(crowdsaleAddr);
    this.setState(newState);

    if (this.state.contractType == this.state.contractTypes.whitelistwithcap) {
      this.deployFinalizeAgent();
    } else {
      newState.loading = false;
      this.setState(newState);
      this.goToCrowdsalePage();
    }
  }

  deployFinalizeAgent = () => {
    console.log("***Deploy finalize agent contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      let contracts = this.state.contracts;
      let binNullFinalizeAgent = contracts && contracts.nullFinalizeAgent && contracts.nullFinalizeAgent.bin || ''
      let abiNullFinalizeAgent = contracts && contracts.nullFinalizeAgent && contracts.nullFinalizeAgent.abi || []

      let binFinalizeAgent = contracts && contracts.finalizeAgent && contracts.finalizeAgent.bin || ''
      let abiFinalizeAgent = contracts && contracts.finalizeAgent && contracts.finalizeAgent.abi || []
      
      let crowdsales;
      if (this.state.tokenIsAlreadyCreated) {
        let curTierAddr = [ contracts.crowdsale.addr.slice(-1)[0] ];
        let prevTierAddr = [ contracts.crowdsale.addr.slice(-2)[0] ];
        crowdsales = [prevTierAddr, curTierAddr];
      }
      else
        crowdsales = this.state.contracts.crowdsale.addr;
      this.deployFinalizeAgentRecursive(0, crowdsales, this.state.web3, abiNullFinalizeAgent, binNullFinalizeAgent, abiFinalizeAgent, binFinalizeAgent, this.state) 
     });
  }

  deployFinalizeAgentRecursive = (i, crowdsales, web3, abiNull, binNull, abiLast, binLast, state) => {
    let abi, bin, paramsFinalizeAgent;

    if (i < crowdsales.length - 1) {
      abi = abiNull;
      bin = binNull;
      paramsFinalizeAgent = this.getNullFinalizeAgentParams(this.state.web3, i)

      console.log(paramsFinalizeAgent);
      deployContract(i, web3, abi, bin, paramsFinalizeAgent, state, (err, finalizeAgentAddr) => {
        i++;
        let newState = { ...this.state }
        if (err) {
          newState.loading = false;
          this.setState(newState);
          return console.log(err);
        }
        newState.contracts.finalizeAgent.addr.push(finalizeAgentAddr);
        this.setState(newState);
        this.deployFinalizeAgentRecursive(i, crowdsales, web3, abiNull, binNull, abiLast, binLast, state)
      })
    } else {
      abi = abiLast;
      bin = binLast;
      paramsFinalizeAgent = this.getFinalizeAgentParams(this.state.web3, i)
      console.log(paramsFinalizeAgent);
      deployContract(i, web3, abi, bin, paramsFinalizeAgent, state, this.handleDeployedFinalizeAgent)
    }
  }

  getNullFinalizeAgentParams = (web3, i) => {
    return [
      this.state.contracts.crowdsale.addr[i]
    ]
  }

  getFinalizeAgentParams = (web3, i) => {
    return [
      this.state.contracts.token.addr,
      this.state.contracts.crowdsale.addr[i]
    ]
  }

  handleDeployedFinalizeAgent = (err, finalizeAgentAddr) => {
    let newState = { ...this.state }
    if (err) {
      newState.loading = false;
      this.setState(newState);
      return console.log(err);
    }
    newState.contracts.finalizeAgent.addr.push(finalizeAgentAddr);
    this.setState(newState, () => {
      if (this.state.contractType == this.state.contractTypes.whitelistwithcap) {
        let web3 = this.state.web3;
        let contracts = this.state.contracts;
        console.log(contracts);
        //post actions for mintablecappedcrowdsale
        //if (!this.state.tokenIsAlreadyCreated) {
          console.log("###we create crowdsale firstly###");
          
          this.setLastCrowdsaleRecursive(0, web3, contracts.pricingStrategy.abi, contracts.pricingStrategy.addr, contracts.crowdsale.addr.slice(-1)[0], () => {
            setReservedTokensListMultiple(web3, contracts.token.abi, contracts.token.addr, this.state.token, () => {
              this.updateJoinedCrowdsalesRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, () => {
                this.setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.crowdsale.addr, () => {
                  this.setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, () => {
                    this.addWhiteListRecursive(0, web3, this.state.crowdsale, this.state.token, contracts.crowdsale.abi, contracts.crowdsale.addr, () => {
                      this.setFinalizeAgentRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, contracts.finalizeAgent.addr, () => {
                        this.setReleaseAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, () => {
                          transferOwnership(web3, this.state.contracts.token.abi, contracts.token.addr, contracts.multisig.addr, () => {
                            newState.loading = false;
                            this.setState(newState);
                            this.goToCrowdsalePage();
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        /*} else { // creation of additional tier after crowdsale was set up before
          console.log("###we add tier after crowdsale is created###");
          let curTierAddr = [ contracts.crowdsale.addr.slice(-1)[0] ];
          let prevTierAddr = [ contracts.crowdsale.addr.slice(-2)[0] ];
          let finalizeSet = [prevTierAddr, curTierAddr];
          this.updateJoinedCrowdsalesRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, () => {
            this.setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, curTierAddr, () => {
              this.setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, () => {
                this.addWhiteListRecursive(0, web3, this.state.crowdsale, this.state.token, contracts.crowdsale.abi, curTierAddr, () => {
                  this.setFinalizeAgentRecursive(0, web3, contracts.crowdsale.abi, finalizeSet, contracts.finalizeAgent.addr, () => {
                    this.setReleaseAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, () => {
                      newState.loading = false;
                      this.setState(newState);
                      this.goToCrowdsalePage();
                    });
                  });
                });
              });
            });
          });
        }*/
      } else {
        this.goToCrowdsalePage();
      }
    });
  }

  setLastCrowdsaleRecursive = (i, web3, abi, pricingStrategyAddrs, lastCrowdsale, cb) => {
    setLastCrowdsale(web3, abi, pricingStrategyAddrs[i], lastCrowdsale, () => {
      i++;
      if (i < pricingStrategyAddrs.length) {
        this.setLastCrowdsaleRecursive(i, web3, abi, pricingStrategyAddrs, lastCrowdsale, cb);
      } else {
        cb();
      }
    })
  }

  setMintAgentRecursive = (i, web3, abi, addr, crowdsaleAddrs, cb) => {
    setMintAgent(web3, abi, addr, crowdsaleAddrs[i], () => {
      i++;
      if (i < crowdsaleAddrs.length) {
        this.setMintAgentRecursive(i, web3, abi, addr, crowdsaleAddrs, cb);
      } else {
        cb();
      }
    })
  }

  updateJoinedCrowdsalesRecursive = (i, web3, abi, addrs, cb) => {
    if (addrs.length == 0) return cb();
    updateJoinedCrowdsales(web3, abi, addrs[i], addrs, () => {
      i++;
      if (i < addrs.length) {
        this.updateJoinedCrowdsalesRecursive(i, web3, abi, addrs, cb);
      } else {
        cb();
      }
    })
  }

  addWhiteListRecursive = (i, web3, crowdsale, token, abi, crowdsaleAddrs, cb) => {
    addWhiteList(i, web3, crowdsale, token, abi, crowdsaleAddrs[i], () => {
      i++;
      if (i < crowdsaleAddrs.length) {
        this.addWhiteListRecursive(i, web3, crowdsale, token, abi, crowdsaleAddrs, cb);
      } else {
        cb();
      }
    })
  }

  setFinalizeAgentRecursive = (i, web3, abi, addrs, finalizeAgentAddrs, cb) => {
    setFinalizeAgent(web3, abi, addrs[i], finalizeAgentAddrs[i], () => {
      i++;
      if (i < finalizeAgentAddrs.length) {
        this.setFinalizeAgentRecursive(i, web3, abi, addrs, finalizeAgentAddrs, cb);
      } else {
        cb();
      }
    })
  }
             
  setReleaseAgentRecursive = (i, web3, abi, addr, finalizeAgentAddrs, cb) => {
    setReleaseAgent(web3, abi, addr, finalizeAgentAddrs[i], () => {
      i++;
      if (i < finalizeAgentAddrs.length) {
        this.setReleaseAgentRecursive(i, web3, abi, addr, finalizeAgentAddrs, cb);
      } else {
        cb();
      }
    })
  }


  render() {
    let crowdsaleSetups = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      let capBlock = <DisplayField side='left' title={'Max cap'} value={this.state.crowdsale[i].supply?this.state.crowdsale[i].supply:""}/>
      let updatableBlock = <DisplayField side='right' title={'Allow modifying'} value={this.state.crowdsale[i].updatable?this.state.crowdsale[i].updatable:"off"}/>
          
      crowdsaleSetups.push(<div key={i.toString()}><div className="publish-title-container">
          <p className="publish-title" data-step={3+i}>Crowdsale Setup {this.state.crowdsale[i].tier}</p>
        </div>
        <div className="hidden">
          <DisplayField side='left' title={'Start time'} value={this.state.crowdsale[i].startTime?this.state.crowdsale[i].startTime.split("T").join(" "):""}/>
          <DisplayField side='right' title={'End time'} value={this.state.crowdsale[i].endTime?this.state.crowdsale[i].endTime.split("T").join(" "):""}/>
          <DisplayField side='left' title={'Wallet address'} value={this.state.crowdsale[i].walletAddress?this.state.crowdsale[i].walletAddress:"0xc1253365dADE090649147Db89EE781d10f2b972f"}/>
          <DisplayField side='right' title={'RATE'} value={this.state.pricingStrategy[i].rate?this.state.pricingStrategy[i].rate:1 + " ETH"}/>
          {this.state.contractType==this.state.contractTypes.whitelistwithcap?capBlock:""}
          {this.state.contractType==this.state.contractTypes.whitelistwithcap?updatableBlock:""}
        </div></div>);
    }
    let ABIEncodedOutputsCrowdsale = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      ABIEncodedOutputsCrowdsale.push(<div key={i.toString()} className="item">
          <p className="label">Constructor Arguments for {this.state.crowdsale[i].tier?this.state.crowdsale[i].tier : "contract"} (ABI-encoded and appended to the ByteCode above)</p>
          <pre>
            {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.abiConstructor?this.state.contracts.crowdsale.abiConstructor[i]:"":"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>);
    }
    let ABIEncodedOutputsPricingStrategy = [];
    for (let i = 0; i < this.state.pricingStrategy.length; i++) {
      ABIEncodedOutputsPricingStrategy.push(<div key={i.toString()} className="item">
          <p className="label">Constructor Arguments for {this.state.crowdsale[i].tier?this.state.crowdsale[i].tier : ""} Pricing Strategy Contract (ABI-encoded and appended to the ByteCode above)</p>
          <pre>
            {this.state.contracts?this.state.contracts.pricingStrategy?this.state.contracts.pricingStrategy.abiConstructor?this.state.contracts.pricingStrategy.abiConstructor[i]:"":"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>);
    }
    let tokenBlock = <div><div className="item">
          <p className="label">Token Contract Source Code</p>
          <pre>
            {this.state.contracts?this.state.contracts.token?this.state.contracts.token.src:"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="item">
          <p className="label">Token Contract ABI</p>
          <pre>
            {this.state.contracts?this.state.contracts.token?JSON.stringify(this.state.contracts.token.abi):"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="item">
          <p className="label">Token Constructor Arguments (ABI-encoded and appended to the ByteCode above)</p>
          <pre>
            {this.state.contracts?this.state.contracts.token?this.state.contracts.token.abiConstructor?this.state.contracts.token.abiConstructor:"":"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div></div>;
    let pricingStrategyBlock = <div><div className="item">
          <p className="label">Pricing Strategy Contract Source Code</p>
          <pre>
            {this.state.contracts?this.state.contracts.pricingStrategy?this.state.contracts.pricingStrategy.src:"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="item">
          <p className="label">Pricing Strategy Contract ABI</p>
          <pre>
            {this.state.contracts?this.state.contracts.pricingStrategy?JSON.stringify(this.state.contracts.pricingStrategy.abi):"":""}
          </pre>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        </div>;
    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish"></div>
            <p className="title">Publish</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">Crowdsale Contract</p>
              </div>
              <p className="label">{this.state.contractType==this.state.contractTypes.standard?"Standard":"Whitelist with cap"}</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">Token Setup</p>
            </div>
            <div className="hidden">
              <DisplayField side='left' title={'Name'} value={this.state.token.name?this.state.token.name:"Token Name"}/>
              <DisplayField side='right' title={'Ticker'} value={this.state.token.ticker?this.state.token.ticker:"Ticker"}/>
              <DisplayField side='left' title={'SUPPLY'} value={this.state.token.supply?this.state.token.supply.toString():100}/>
              <DisplayField side='right' title={'DECIMALS'} value={this.state.token.decimals?this.state.token.decimals.toString():485}/>
            </div>
            {crowdsaleSetups}
            <div className="publish-title-container">
              <p className="publish-title" data-step={2 + this.state.crowdsale.length + 1}>Crowdsale Setup</p>
            </div>
            <div className="item">
              <p className="label">Compiler Version</p>
              <p className="value">0.4.11</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            {!this.state.tokenIsAlreadyCreated?tokenBlock:""}
            {(!this.state.tokenIsAlreadyCreated && this.state.contractType == this.state.contractTypes.whitelistwithcap)?pricingStrategyBlock:""}
            {this.state.contractType == this.state.contractTypes.whitelistwithcap?ABIEncodedOutputsPricingStrategy:""}
            <div className="item">
              <p className="label">Crowdsale Contract Source Code</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.src:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Crowdsale Contract ABI</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?JSON.stringify(this.state.contracts.crowdsale.abi):"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            {ABIEncodedOutputsCrowdsale}
          </div>
        </div>
        <div className="button-container">
          {/*<Link to='/crowdsale' onClick={this.deployCrowdsale}><a href="#" className="button button_fill">Continue</a></Link>*/}
          <div onClick={() => this.downloadCrowdsaleInfo()} className="button button_fill_secondary">Download PDF</div>
          <a onClick={this.deployCrowdsale} className="button button_fill">Continue</a>
        </div>
        <Loader show={this.state.loading}></Loader>
      </section>
    )}
}