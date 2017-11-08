import React from 'react'
import '../../assets/stylesheets/application.css';
import { deployContract, getWeb3, checkWeb3, getNetworkVersion } from '../../utils/blockchainHelpers'
import { setLastCrowdsaleRecursive, addWhiteListRecursive, setFinalizeAgentRecursive, setMintAgentRecursive, setReleaseAgentRecursive, updateJoinedCrowdsalesRecursive, transferOwnership, setReservedTokensListMultiple, setLastCrowdsale } from './utils'
import {download, handleContractsForFile, handleTokenForFile, handleCrowdsaleForFile, handlePricingStrategyForFile, handleFinalizeAgentForFile, handleConstantForFile, scrollToBottom } from './utils'
import { noMetaMaskAlert, noContractDataAlert } from '../../utils/alerts'
import { defaultState, FILE_CONTENTS, DOWNLOAD_NAME, DOWNLOAD_TYPE, TOAST } from '../../utils/constants'
import { getOldState, toFixed, floorToDecimals, toast } from '../../utils/utils'
import { getEncodedABIClientSide } from '../../utils/microservices'
import { stepTwo } from '../stepTwo'
import { StepNavigation } from '../Common/StepNavigation'
import { DisplayField } from '../Common/DisplayField'
import { DisplayTextArea } from '../Common/DisplayTextArea'
import { Loader } from '../Common/Loader'
import { NAVIGATION_STEPS, TRUNC_TO_DECIMALS } from '../../utils/constants'
import { copy } from '../../utils/copy';
const { PUBLISH } = NAVIGATION_STEPS

export class stepFour extends stepTwo {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({ contractDownloaded: false }, oldState)
    console.log('oldState oldState oldState', oldState)
  }

  componentDidMount() {
    scrollToBottom();
    copy('copy');
    checkWeb3(this.state.web3);
    switch (this.state.contractType) {
      case this.state.contractTypes.whitelistwithcap: {
        if (!this.state.contracts.safeMathLib) {
          this.hideLoader();
          return noContractDataAlert();
        } 

        let state = { ...this.state }
        state.loading = true;
        this.setState(state);
        let abiToken = this.state.contracts && this.state.contracts.token && this.state.contracts.token.abi || []
        
        let abiPricingStrategy = this.state.contracts && this.state.contracts.pricingStrategy && this.state.contracts.pricingStrategy.abi || []
        
        setTimeout(() => {
           getWeb3((web3) => {
            state.web3 = web3;
            this.setState(state);
            let counter = 0;
            getEncodedABIClientSide(web3, abiToken, state, [], 0, (ABIencoded) => {
              counter++;
              let cntrct = "token";
              state.contracts[cntrct].abiConstructor = ABIencoded;
              console.log(cntrct + " ABI encoded params constructor:");
              console.log(ABIencoded);
              if (counter == (this.state.pricingStrategy.length + 1))
                this.setState(state, this.deploySafeMathLibrary());
            });
            for (let i = 0; i < this.state.pricingStrategy.length; i++) {
              getEncodedABIClientSide(web3, abiPricingStrategy, state, [], i, (ABIencoded) => {
                counter++;
                let cntrct = "pricingStrategy";
                state.contracts[cntrct].abiConstructor.push(ABIencoded);
                console.log(cntrct + " ABI encoded params constructor:");
                console.log(ABIencoded);
                if (counter == (this.state.pricingStrategy.length + 1))
                  this.setState(state, this.deploySafeMathLibrary());
              });
            }
          });
        }, 500);
      } break;
      default:
        break;
    }
  }

  hideLoader() {
    let newState = { ...this.state }
    newState.loading = false;
    this.setState(newState);
  }

  contractDownloadSuccess = options => {
    this.setState({ contractDownloaded: true })
    toast.showToaster({ message: TOAST.MESSAGE.CONTRACT_DOWNLOAD_SUCCESS, options })
  }

  /*testM() {
    let state = this.state;
    //mainnet
    //state.contracts.finalizeAgent.addr[0] = "0x9ee173a3e54014c6b89e5d5e01d06b269315a6e9"
    //state.contracts.crowdsale.addr[0] = "0x1c6d46dedd61ef982f0938e73975404b8de6d739"
    //state.contracts.pricingStrategy.addr[0] = "0xf188df9b40f5a5598a1d7088021a679312e62d03"
    //state.contracts.token.addr = "0x13462c0292f3007ee6d0aaf600dbe1db2ebcf4be"
    //testnet
    state.contracts.finalizeAgent.addr[0] = "0x24430ab3a5564034b2c878746223f4148cae1471"
    state.contracts.crowdsale.addr[0] = "0x050007744327a34a00c472951faebcdea1f8560e"
    state.contracts.pricingStrategy.addr[0] = "0x85704d886ba65b233dd589300509e40136a5bd68"
    state.contracts.token.addr = "0x12f05ca69f6244bf5aa48eecd3f5c516821a5326"
    this.setState(() => {
      let web3 = this.state.web3;
      let contracts = this.state.contracts;
      setLastCrowdsaleRecursive(0, web3, contracts.pricingStrategy.abi, contracts.pricingStrategy.addr, contracts.crowdsale.addr.slice(-1)[0], 42982, (err) => {
        if (err) return this.hideLoader();
        setReservedTokensListMultiple(web3, contracts.token.abi, contracts.token.addr, this.state.token, (err) => {
          if (err) return this.hideLoader();
          updateJoinedCrowdsalesRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, (err) => {
            if (err) return this.hideLoader();
            setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.crowdsale.addr, 68425, (err) => {
              if (err) return this.hideLoader();
              setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, 68425, (err) => {
                if (err) return this.hideLoader();
                addWhiteListRecursive(0, web3, this.state.crowdsale, this.state.token, contracts.crowdsale.abi, contracts.crowdsale.addr, (err) => {
                  if (err) return this.hideLoader();
                  setFinalizeAgentRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, contracts.finalizeAgent.addr, 68622, (err) => {
                    if (err) return this.hideLoader();
                    setReleaseAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, 65905, (err) => {
                      transferOwnership(web3, this.state.contracts.token.abi, contracts.token.addr, this.state.crowdsale[0].walletAddress, 46699, (err) => {
                        if (err) return this.hideLoader();
                        //this.goToCrowdsalePage();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }*/

  handleContentByParent(content, docData) {
    switch(content.parent) {
      case 'token':
        return handleTokenForFile(content, docData, this.state)
      case 'crowdsale':
        return handleCrowdsaleForFile(content, docData, this.state)
      case 'contracts':
        return handleContractsForFile(content, docData, this.state)
      case 'pricingStrategy':
        return handlePricingStrategyForFile(content, docData, this.state)
      case 'finalizeAgent':
        return handleFinalizeAgentForFile(content, docData, this.state)
      case 'none':
        return handleConstantForFile(content, docData)
    }
  }

  downloadCrowdsaleInfo() {
    var docData = { data: '' }
    FILE_CONTENTS.forEach(content => {
      this.handleContentByParent(content, docData)
    })
    console.log('docDAta', docData.data)
    download(docData.data, DOWNLOAD_NAME, DOWNLOAD_TYPE)
  }

  deploySafeMathLibrary = () => {
    console.log("***Deploy safeMathLib contract***");
    if (!this.state.web3) {
      this.hideLoader();
      return noMetaMaskAlert();
    }
    this.state.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.hideLoader();
        return noMetaMaskAlert();
      }
      var contracts = this.state.contracts;
      var binSafeMathLib = contracts && contracts.safeMathLib && contracts.safeMathLib.bin || ''
      var abiSafeMathLib = contracts && contracts.safeMathLib && contracts.safeMathLib.abi || []
      var safeMathLib = this.state.safeMathLib;
      deployContract(0, this.state.web3, abiSafeMathLib, binSafeMathLib, [], this.state, this.handleDeployedSafeMathLibrary)
    });
  }

  handleDeployedSafeMathLibrary = (err, safeMathLibAddr) => {
    console.log("safeMathLibAddr: " + safeMathLibAddr);
    if (err) {
      return this.hideLoader();
    }
    let newState = { ...this.state }
    newState.contracts.safeMathLib.addr = safeMathLibAddr;
    let contracts = newState.contracts;
    let keys = Object.keys(contracts);
    for(let i=0;i<keys.length;i++){
        let key = keys[i];
        if (contracts[key].bin)
          contracts[key].bin = window.reaplaceAll("__:SafeMathLibExt_______________________", safeMathLibAddr.substr(2), contracts[key].bin);
    }
    newState.contracts = contracts;
    this.setState(newState, () => {
      this.deployToken();
    });
  }

  deployToken = () => {
    console.log("***Deploy token contract***");
    this.state.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.hideLoader();
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
      true,
      this.state.crowdsale[0].whitelistdisabled === "yes"?this.state.token.globalmincap?toFixed(this.state.token.globalmincap*10**this.state.token.decimals).toString():0:0
    ]
  }

  handleDeployedToken = (err, tokenAddr) => {
    if (err) {
      return this.hideLoader();
    }
    let newState = { ...this.state }
    newState.contracts.token.addr = tokenAddr;
    this.deployPricingStrategy();
  }

  deployPricingStrategy = () => {
    console.log("***Deploy pricing strategy contract***");
    this.state.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.hideLoader();
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
        if (err) {
          return this.hideLoader();
        }
        let newState = { ...this.state }
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
    let oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1/pricingStrategy.rate)
    return [
      web3.utils.toWei(oneTokenInETH, "ether"),
      this.state.crowdsale[i].updatable?this.state.crowdsale[i].updatable=="on"?true:false:false
    ]
  }

  handleDeployedPricingStrategy = (err, pricingStrategyAddr) => {
    if (err) {
      return this.hideLoader();
    }
    let newState = { ...this.state }
    newState.contracts.pricingStrategy.addr.push(pricingStrategyAddr);
    this.setState(newState);
    let abiCrowdsale = this.state.contracts && this.state.contracts.crowdsale && this.state.contracts.crowdsale.abi || []
    let counter = 0;
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      getEncodedABIClientSide(this.state.web3, abiCrowdsale, newState, [], i, (ABIencoded) => {
        counter++;
        let cntrct = "crowdsale";
        let state = { ...this.state }
        state.contracts[cntrct].abiConstructor.push(ABIencoded);
        console.log(cntrct + " ABI encoded params constructor:");
        console.log(ABIencoded);
        this.setState(state);
        if (counter == this.state.crowdsale.length)
          this.deployCrowdsale();
      });
    }
  }

  deployCrowdsale = () => {
    console.log("***Deploy crowdsale contract***");
    getWeb3((web3) => {
      getNetworkVersion(web3, (_networkID) => {
        console.log('web3', web3)
        web3.eth.getAccounts().then((accounts) => {
          if (accounts.length === 0) {
            this.hideLoader();
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
    });
  }

  deployCrowdsaleRecursive = (i, crowdsales, binCrowdsale, abiCrowdsale) => {
    let paramsCrowdsale;
    switch (this.state.contractType) {
      //depreciated
      /*case this.state.contractTypes.standard: {
        paramsCrowdsale = this.getStandardCrowdSaleParams(this.state.web3)
      } break;*/
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
        if (err) {
          return this.hideLoader();
        }
        let newState = { ...this.state }
        newState.contracts.crowdsale.addr.push(crowdsaleAddr);
        this.setState(newState);
        this.deployCrowdsaleRecursive(i, crowdsales, binCrowdsale, abiCrowdsale);
      })
    } else {
      deployContract(i, this.state.web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, this.state, this.handleDeployedCrowdsaleContract)
    }
  }

  //MintedTokenCappedCrowdsale
  getCrowdSaleParams = (web3, i) => {
    return [
      this.state.contracts.token.addr,
      this.state.contracts.pricingStrategy.addr[i],
      this.state.crowdsale[0].walletAddress, //this.state.contracts.multisig.addr,
      toFixed(parseInt(Date.parse(this.state.crowdsale[i].startTime)/1000, 10).toString()), 
      toFixed(parseInt(Date.parse(this.state.crowdsale[i].endTime)/1000, 10).toString()), 
      toFixed("0"),
      toFixed(parseInt(this.state.crowdsale[i].supply, 10)*10**parseInt(this.state.token.decimals, 10)).toString(),
      this.state.crowdsale[i].updatable?this.state.crowdsale[i].updatable=="on"?true:false:false,
      this.state.crowdsale[0].whitelistdisabled?this.state.crowdsale[0].whitelistdisabled=="yes"?false:true:false
    ]
  }

  handleDeployedCrowdsaleContract = (err, crowdsaleAddr) => {
    if (err) {
      return this.hideLoader();
    }
    let newState = { ...this.state }
    newState.contracts.crowdsale.addr.push(crowdsaleAddr);
    this.setState(newState, this.calculateABIEncodedArgumentsForFinalizeAgentContractDeployment);    
  }

  calculateABIEncodedArgumentsForFinalizeAgentContractDeployment = () => {
    let newState = { ...this.state }
    console.log(newState);

    let abiFinalizeAgent = this.state.contracts && this.state.contracts.finalizeAgent && this.state.contracts.finalizeAgent.abi || []
    let counter = 0;

    for (let i = 0; i < this.state.pricingStrategy.length; i++) {
      getEncodedABIClientSide(this.state.web3, abiFinalizeAgent, this.state, [], i, (ABIencoded) => {
        counter++;
        let cntrct = "finalizeAgent";
        newState.contracts[cntrct].abiConstructor.push(ABIencoded);
        console.log(cntrct + " ABI encoded params constructor:");
        console.log(ABIencoded);
        if (counter == (this.state.pricingStrategy.length)) {
          this.setState(newState, this.deployFinalizeAgent);
        }
      });
    }
  }

  deployFinalizeAgent = () => {
    console.log("***Deploy finalize agent contract***");
    this.state.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.hideLoader();
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
    })
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
        if (err) {
          return this.hideLoader();
        }
        let newState = { ...this.state }
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
    if (err) {
      return this.hideLoader();
    }
    let newState = { ...this.state }
    newState.contracts.finalizeAgent.addr.push(finalizeAgentAddr);
    this.setState(newState, () => {
      let web3 = this.state.web3;
      let contracts = this.state.contracts;
      console.log(contracts);

      this.setState(() => {
        setLastCrowdsaleRecursive(0, web3, contracts.pricingStrategy.abi, contracts.pricingStrategy.addr, contracts.crowdsale.addr.slice(-1)[0], 142982, (err) => {
          if (err) return this.hideLoader();
          setReservedTokensListMultiple(web3, contracts.token.abi, contracts.token.addr, this.state.token, (err) => {
            if (err) return this.hideLoader();
            updateJoinedCrowdsalesRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, 293146, (err) => {
              if (err) return this.hideLoader();
              setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.crowdsale.addr, 68425, (err) => {
                if (err) return this.hideLoader();
                setMintAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, 68425, (err) => {
                  if (err) return this.hideLoader();
                  addWhiteListRecursive(0, web3, this.state.crowdsale, this.state.token, contracts.crowdsale.abi, contracts.crowdsale.addr, (err) => {
                    if (err) return this.hideLoader();
                    setFinalizeAgentRecursive(0, web3, contracts.crowdsale.abi, contracts.crowdsale.addr, contracts.finalizeAgent.addr, 68622, (err) => {
                      if (err) return this.hideLoader();
                      setReleaseAgentRecursive(0, web3, contracts.token.abi, contracts.token.addr, contracts.finalizeAgent.addr, 65905, (err) => {
                        transferOwnership(web3, this.state.contracts.token.abi, contracts.token.addr, this.state.crowdsale[0].walletAddress, 46699, (err) => {
                          if (err) return this.hideLoader();
                          this.hideLoader();
                          //this.goToCrowdsalePage();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  downloadContractButton = () => {
    this.downloadCrowdsaleInfo();
    this.contractDownloadSuccess({ offset: 14 })
  }

  goToCrowdsalePage = () => {
    const {contracts} = this.state
    if (!contracts.crowdsale.addr) {
      return noContractDataAlert();
    }
    if (contracts.crowdsale.addr.length === 0) {
      return noContractDataAlert();
    }
    let crowdsalePage = "/crowdsale";
    const isValidContract = contracts && contracts.crowdsale && contracts.crowdsale.addr
    let url;
    url = crowdsalePage + `?addr=` + contracts.crowdsale.addr[0]
    //crowdsale contracts relations are in the blockchain
    /*for (let i = 1; i < contracts.crowdsale.addr.length; i++) {
      url += `&addr=` + contracts.crowdsale.addr[i]
    }*/
    url += `&networkID=` + contracts.crowdsale.networkID
    //uncomment, if more then one contractType will appear
    //url += `&contractType=` + this.state.contractType
    let newHistory = isValidContract ? url : crowdsalePage

    if (!this.state.contractDownloaded) {
      this.downloadCrowdsaleInfo()
      setTimeout(this.contractDownloadSuccess, 450)
    }

    this.props.history.push(newHistory)
  }

  render() {
    let crowdsaleSetups = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      let capBlock = <DisplayField 
        side='left' 
        title={'Max cap'} 
        value={this.state.crowdsale[i].supply?this.state.crowdsale[i].supply:""}
        description="How many tokens will be sold on this tier."
      />
      let updatableBlock = <DisplayField 
        side='right' 
        title={'Allow modifying'} 
        value={this.state.crowdsale[i].updatable?this.state.crowdsale[i].updatable:"off"} 
        description="Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing."
      />
          
      crowdsaleSetups.push(<div key={i.toString()}><div className="publish-title-container">
          <p className="publish-title" data-step={3+i}>Crowdsale Setup {this.state.crowdsale[i].tier}</p>
        </div>
        <div className="hidden">
          <div className="hidden">
            <DisplayField 
              side='left' 
              title={'Start time'} 
              value={this.state.crowdsale[i].startTime?this.state.crowdsale[i].startTime.split("T").join(" "):""} 
              description="Date and time when the tier starts."
            />
            <DisplayField 
              side='right' 
              title={'End time'} 
              value={this.state.crowdsale[i].endTime?this.state.crowdsale[i].endTime.split("T").join(" "):""} 
              description="Date and time when the tier ends."
            />
          </div>
          <div className="hidden">
            <DisplayField 
              side='left' 
              title={'Wallet address'} 
              value={this.state.crowdsale[i].walletAddress?this.state.crowdsale[i].walletAddress:""} 
              description="Where the money goes after investors transactions."
            />
            <DisplayField 
              side='right' 
              title={'RATE'} 
              value={this.state.pricingStrategy[i].rate?this.state.pricingStrategy[i].rate:0 + " ETH"} 
              description="Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens."
            />
          </div>
          {this.state.contractType===this.state.contractTypes.whitelistwithcap?capBlock:""}
          {this.state.contractType===this.state.contractTypes.whitelistwithcap?updatableBlock:""}
        </div></div>);
    }
    let ABIEncodedOutputsCrowdsale = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      ABIEncodedOutputsCrowdsale.push(
        <DisplayTextArea
          key={i.toString()}
          label={"Constructor Arguments for " + (this.state.crowdsale[i].tier?this.state.crowdsale[i].tier : "contract") + " (ABI-encoded and appended to the ByteCode above)"}
          value={this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.abiConstructor?this.state.contracts.crowdsale.abiConstructor[i]:"":"":""}
          description="Encoded ABI"
        />
      );
    }
    let ABIEncodedOutputsPricingStrategy = [];
    for (let i = 0; i < this.state.pricingStrategy.length; i++) {
      ABIEncodedOutputsPricingStrategy.push(
        <DisplayTextArea
          key={i.toString()}
          label={"Constructor Arguments for " + (this.state.crowdsale[i].tier?this.state.crowdsale[i].tier : "") + " Pricing Strategy Contract (ABI-encoded and appended to the ByteCode above)"}
          value={this.state.contracts?this.state.contracts.pricingStrategy?this.state.contracts.pricingStrategy.abiConstructor?this.state.contracts.pricingStrategy.abiConstructor[i]:"":"":""}
          description="Contructor arguments for pricing strategy contract"
        />
      );
    }
    let ABIEncodedOutputsFinalizeAgent = [];
    for (let i = 0; i < this.state.crowdsale.length; i++) {
      ABIEncodedOutputsFinalizeAgent.push(
        <DisplayTextArea
          key={i.toString()}
          label={"Constructor Arguments for " + (this.state.crowdsale[i].tier?this.state.crowdsale[i].tier : "") + " Finalize Agent Contract (ABI-encoded and appended to the ByteCode above)"}
          value={this.state.contracts?this.state.contracts.finalizeAgent?this.state.contracts.finalizeAgent.abiConstructor?this.state.contracts.finalizeAgent.abiConstructor[i]:"":"":""}
          description="Contructor arguments for finalize agent contract"
        />
      );
    }
    let globalLimitsBlock = <div><div className="publish-title-container">
      <p className="publish-title" data-step={2 + this.state.crowdsale.length + 2}>Global Limits</p>
    </div>
    <div className="hidden">
      <DisplayField 
        side='left' 
        title='Min Cap' 
        value={this.state.token.globalmincap} 
        description="Min Cap for all onvestors"
      /></div>
    </div>;
    let tokenBlock = <div>
      <DisplayTextArea
        label={"Token Contract Source Code"}
        value={this.state.contracts?this.state.contracts.token?this.state.contracts.token.src:"":""}
        description="Token Contract Source Code"
      />
      <DisplayTextArea
        label={"Token Contract ABI"}
        value={this.state.contracts?this.state.contracts.token?JSON.stringify(this.state.contracts.token.abi):"":""}
        description="Token Contract ABI"
      />
       <DisplayTextArea
        label={"Token Constructor Arguments (ABI-encoded and appended to the ByteCode above)"}
        value={this.state.contracts?this.state.contracts.token?this.state.contracts.token.abiConstructor?this.state.contracts.token.abiConstructor:"":"":""}
        description="Token Constructor Arguments"
      />
    </div>;
    let pricingStrategyBlock = <div>
      <DisplayTextArea
        label={"Pricing Strategy Contract Source Code"}
        value={this.state.contracts?this.state.contracts.pricingStrategy?this.state.contracts.pricingStrategy.src:"":""}
        description="Pricing Strategy Contract Source Code"
      />
      <DisplayTextArea
        label={"Pricing Strategy Contract ABI"}
        value={this.state.contracts?this.state.contracts.pricingStrategy?JSON.stringify(this.state.contracts.pricingStrategy.abi):"":""}
        description="Pricing Strategy Contract ABI"
      />
    </div>;
    let finalizeAgentBlock = <div>
      <DisplayTextArea
        label={"Finalize Agent Contract Source Code"}
        value={this.state.contracts?this.state.contracts.finalizeAgent?this.state.contracts.finalizeAgent.src:"":""}
        description="Finalize Agent Contract Source Code"
      />
      <DisplayTextArea
        label={"Finalize Agent Contract ABI"}
        value={this.state.contracts?this.state.contracts.finalizeAgent?JSON.stringify(this.state.contracts.finalizeAgent.abi):"":""}
        description="Finalize Agent Contract ABI"
      />
    </div>;
    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish"></div>
            <p className="title">Publish</p>
            <p className="description">
            On this step we provide you artifacts about your token and crowdsale contracts. They are useful to verify contracts source code on <a href="https://etherscan.io/verifyContract">Etherscan</a> 
            </p>
          </div>
          <div className="hidden">
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">Crowdsale Contract</p>
              </div>
              <p className="label">{this.state.contractType===this.state.contractTypes.standard?"Standard":"Whitelist with cap"}</p>
              <p className="description">
              Crowdsale Contract
              </p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">Token Setup</p>
            </div>
            <div className="hidden">
              <div className="hidden">
                <DisplayField 
                  side='left' 
                  title='Name' 
                  value={this.state.token.name?this.state.token.name:""} 
                  description="The name of your token. Will be used by Etherscan and other token browsers."
                />
                <DisplayField 
                  side='right' 
                  title='Ticker' 
                  value={this.state.token.ticker?this.state.token.ticker:""} 
                  description="The three letter ticker for your token."
                />
              </div>
              <div className="hidden">
                <DisplayField 
                  side='left' 
                  title='DECIMALS' 
                  value={this.state.token.decimals?this.state.token.decimals.toString():""} 
                  description="The decimals of your token."
                />
              </div>
            </div>
            {crowdsaleSetups}
            <div className="publish-title-container">
              <p className="publish-title" data-step={2 + this.state.crowdsale.length + 1}>Crowdsale Setup</p>
            </div>
            <div className="hidden">
              <DisplayField 
                side='left' 
                title='Compiler Version' 
                value={this.state.compilerVersion} 
                description="Compiler Version"
              />
              <DisplayField 
                side='right' 
                title='Contract name' 
                value={this.state.contractName} 
                description="Crowdsale contract name"
              />
              <DisplayField 
                side='left' 
                title='Optimized' 
                value={this.state.optimized.toString()} 
                description="Optimization in compiling"
              />
            </div>
            {this.state.crowdsale[0].whitelistdisabled === "yes"?globalLimitsBlock:""}
            {tokenBlock}
            {pricingStrategyBlock}
            {ABIEncodedOutputsPricingStrategy}
            {finalizeAgentBlock}
            {ABIEncodedOutputsFinalizeAgent}
            <DisplayTextArea
              label={"Crowdsale Contract Source Code"}
              value={this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.src:"":""}
              description="Crowdsale Contract Source Code"
            />
            <DisplayTextArea
              label={"Crowdsale Contract ABI"}
              value={this.state.contracts?this.state.contracts.crowdsale?JSON.stringify(this.state.contracts.crowdsale.abi):"":""}
              description="Crowdsale Contract ABI"
            />
            {ABIEncodedOutputsCrowdsale}
          </div>
        </div>
        <div className="button-container">
          <div onClick={this.downloadContractButton} className="button button_fill_secondary">Download File</div>
          <a onClick={this.goToCrowdsalePage} className="button button_fill">Continue</a>
        </div>
        <Loader show={this.state.loading}></Loader>
      </section>
    )}
}
