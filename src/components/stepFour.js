import React from 'react'
import '../assets/stylesheets/application.css';
import { deployContract, getWeb3, getNetworkVersion, addWhiteList, setFinalizeAgent, approve, setTransferAgent, setMintAgent, setReleaseAgent, transferOwnership } from '../utils/web3'
import { noMetaMaskAlert } from '../utils/alerts'
import { defaultState } from '../utils/constants'
import { getOldState } from '../utils/utils'
import { getEncodedABIClientSide } from '../utils/microservices'
import { stepTwo } from './stepTwo'
import { StepNavigation } from './Common/StepNavigation'
import { DisplayField } from './Common/DisplayField'
import { Loader } from './Common/Loader'
import { NAVIGATION_STEPS } from '../utils/constants'
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
        let abiPricingStrategy = this.state.contracts && this.state.contracts.pricingStrategy && this.state.contracts.pricingStrategy.abi || []
        
        let $this = this;
        setTimeout(function() {
           getWeb3((web3) => {
            state.web3 = web3;
            $this.setState(state);
            getEncodedABIClientSide(web3, abiToken, state, [], 0, (ABIencoded) => {
              let cntrct = "token";
              let state = { ...$this.state }
              state.contracts[cntrct].abiConstructor = ABIencoded;
              console.log(cntrct + " ABI encoded params constructor:");
              console.log(ABIencoded);
              $this.setState(state);
            });
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

            $this.deployTokenTransferProxy();
          });
        });
      } break;
      default:
        break;
    }
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
    var paramsPricingStrategy = this.getPricingStrategyParams(this.state.web3, pricingStrategies[i], this.state.token)
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
  getPricingStrategyParams = (web3, pricingStrategy, token) => {
    console.log(pricingStrategy);
    return [
      //web3.toWei(1/pricingStrategy.rate, "ether")
      //pricingStrategy.rate
      //web3.toWei(1/pricingStrategy.rate/10**token.decimals, "ether")
      web3.toWei(1/pricingStrategy.rate, "ether")
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
    for (let i = 1; i < contracts.crowdsale.addr.length; i++) {
      url += `&addr=` + contracts.crowdsale.addr[i]
    }
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
      parseInt(this.state.crowdsale[i].supply, 10)
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
      let binFinalizeAgent = contracts && contracts.finalizeAgent && contracts.finalizeAgent.bin || ''
      let abiFinalizeAgent = contracts && contracts.finalizeAgent && contracts.finalizeAgent.abi || []
      
      let crowdsales = this.state.contracts.crowdsale.addr;
      this.deployFinalizeAgentRecursive(0, crowdsales, this.state.web3, abiFinalizeAgent, binFinalizeAgent, this.state) 
     });
  }

  deployFinalizeAgentRecursive = (i, crowdsales, web3, abi, bin, state) => {
    var paramsFinalizeAgent = this.getFinalizeAgentParams(this.state.web3, i)
    console.log(paramsFinalizeAgent);
    if (i < crowdsales.length - 1) {
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
        this.deployFinalizeAgentRecursive(i, crowdsales, web3, abi, bin, state)
      })
    } else {
      deployContract(i, web3, abi, bin, paramsFinalizeAgent, state, this.handleDeployedFinalizeAgent)
    }

  }

  getFinalizeAgentParams = (web3, i) => {
    return [
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
        //post actions for Allocated crowdsale
        /*let initialSupplyInWei = this.state.web3.toWei(this.state.token.supply/this.state.pricingStrategy[0].rate, "ether")
        console.log("initialSupplyInWei: " + initialSupplyInWei)
        approve(this.state.web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.crowdsale.addr, initialSupplyInWei, () => {
          setTransferAgent(this.state.web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.multisig.addr, () => {
            setTransferAgent(this.state.web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.crowdsale.addr, () => {
              setTransferAgent(this.state.web3, this.state.contracts.token.abi, this.state.contracts.token.addr, finalizeAgentAddr, () => {
                setTransferAgent(this.state.web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.crowdsale[0].walletAddress, () => {
                  addWhiteList(this.state.web3, this.state.crowdsale[0].whitelist, this.state.contracts.crowdsale.abi, this.state.contracts.crowdsale.addr, () => {
                    setFinalizeAgent(this.state.web3, this.state.contracts.crowdsale.abi, this.state.contracts.crowdsale.addr, finalizeAgentAddr, () => {
                      newState.loading = false;
                      this.setState(newState);
                      this.goToCrowdsalePage();
                    });
                  });
                });
              });
            });
          });
        });*/
        //post actions for mintablecappedcrowdsale
        console.log(this.state.contracts.crowdsale.addr);
        this.setMintAgentRecursive(0, web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.crowdsale.addr, () => {
          this.setMintAgentRecursive(0, web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.finalizeAgent.addr, () => {
            this.addWhiteListRecursive(0, web3, this.state.crowdsale, this.state.contracts.crowdsale.abi, this.state.contracts.crowdsale.addr, () => {
              this.setFinalizeAgentRecursive(0, web3, this.state.contracts.crowdsale.abi, this.state.contracts.crowdsale.addr, this.state.contracts.finalizeAgent.addr, () => {
                this.setReleaseAgentRecursive(0, web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.finalizeAgent.addr, () => {
                  this.transferOwnershipRecursive(0, web3, this.state.contracts.token.abi, this.state.contracts.token.addr, this.state.contracts.finalizeAgent.addr, () => {
                    newState.loading = false;
                    this.setState(newState);
                    this.goToCrowdsalePage();
                  });
                });
              });
            });
          });
        });
      } else {
        this.goToCrowdsalePage();
      }
    });
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

  addWhiteListRecursive = (i, web3, crowdsale, abi, crowdsaleAddrs, cb) => {
    addWhiteList(i, web3, crowdsale, abi, crowdsaleAddrs[i], () => {
      i++;
      if (i < crowdsaleAddrs.length) {
        this.addWhiteListRecursive(i, web3, crowdsale, abi, crowdsaleAddrs, cb);
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

  transferOwnershipRecursive = (i, web3, abi, addr, finalizeAgentAddrs, cb) => {
    transferOwnership(web3, abi, addr, finalizeAgentAddrs[i], () => {
      i++;
      if (i < finalizeAgentAddrs.length) {
        this.transferOwnershipRecursive(i, web3, abi, addr, finalizeAgentAddrs, cb);
      } else {
        cb();
      }
    })
  }


  render() {
    let crowdsaleSetups = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      crowdsaleSetups.push(<div><div className="publish-title-container">
              <p className="publish-title" data-step={3+i}>Crowdsale Setup {this.state.crowdsale[i].tier}</p>
            </div>
            <div className="hidden">
              <DisplayField side='left' title={'Start time'} value={this.state.crowdsale[i].startTime?this.state.crowdsale[i].startTime.split("T").join(" "):""}/>
              <DisplayField side='right' title={'End time'} value={this.state.crowdsale[i].endTime?this.state.crowdsale[i].endTime.split("T").join(" "):""}/>
              <DisplayField side='left' title={'Wallet address'} value={this.state.crowdsale[i].walletAddress?this.state.crowdsale[i].walletAddress:"0xc1253365dADE090649147Db89EE781d10f2b972f"}/>
              <DisplayField side='right' title={'RATE'} value={this.state.pricingStrategy[i].rate?this.state.pricingStrategy[i].rate:1 + " ETH"}/>
            </div></div>);
    }
    let ABIEncidedOutputs = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      ABIEncidedOutputs.push(<div className="item">
              <p className="label">Constructor Arguments for {this.state.crowdsale[i].tier?this.state.crowdsale[i].tier : "contract"} (ABI-encoded and appended to the ByteCode above)</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.abiConstructor[i]:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>);
    }
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
              <p className="label">{this.state.contractType=="standard"?"Standard":"Whitelist with cap"}</p>
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
              <DisplayField side='left' title={'SUPPLY'} value={this.state.token.supply?this.state.token.supply:100}/>
              <DisplayField side='right' title={'DECIMALS'} value={this.state.token.decimals?this.state.token.decimals:485}/>
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
            <div className="item">
              <p className="label">Contract Source Code</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.src:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Contract ABI</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?JSON.stringify(this.state.contracts.crowdsale.abi):"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            {ABIEncidedOutputs}
          </div>
        </div>
        <div className="button-container">
          {/*<Link to='/crowdsale' onClick={this.deployCrowdsale}><a href="#" className="button button_fill">Continue</a></Link>*/}
          <a onClick={this.deployCrowdsale} className="button button_fill">Continue</a>
        </div>
        <Loader show={this.state.loading}></Loader>
      </section>
    )}
}