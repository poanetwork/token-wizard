import React from 'react'
import '../../assets/stylesheets/application.css'
import { checkWeb3, deployContract, getNetworkVersion } from '../../utils/blockchainHelpers'
import {
  addWhiteListRecursive,
  download,
  getDownloadName,
  handleConstantForFile,
  handleContractsForFile,
  handlerForFile,
  scrollToBottom,
  setFinalizeAgentRecursive,
  setLastCrowdsaleRecursive,
  setMintAgentRecursive,
  setReleaseAgentRecursive,
  setReservedTokensListMultiple,
  transferOwnership,
  updateJoinedCrowdsalesRecursive
} from './utils'
import { noContractDataAlert, noMetaMaskAlert } from '../../utils/alerts'
import {
  CONTRACT_TYPES,
  DOWNLOAD_TYPE,
  FILE_CONTENTS,
  NAVIGATION_STEPS,
  TOAST,
  TRUNC_TO_DECIMALS
} from '../../utils/constants'
import { floorToDecimals, toast, toFixed } from '../../utils/utils'
import { getEncodedABIClientSide } from '../../utils/microservices'
import { StepNavigation } from '../Common/StepNavigation'
import { DisplayField } from '../Common/DisplayField'
import { DisplayTextArea } from '../Common/DisplayTextArea'
import { Loader } from '../Common/Loader'
import { copy } from '../../utils/copy'
import { inject, observer } from 'mobx-react'
import { isObservableArray } from 'mobx'
import JSZip from 'jszip'

const { PUBLISH } = NAVIGATION_STEPS


@inject('contractStore', 'reservedTokenStore', 'tierStore', 'tokenStore', 'web3Store')
@observer export class stepFour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractDownloaded: false,
      loading: false
    }
  }

  contractDownloadSuccess = options => {
    this.setState({ contractDownloaded: true })
    toast.showToaster({ message: TOAST.MESSAGE.CONTRACT_DOWNLOAD_SUCCESS, options })
  }

  componentDidMount() {
    const { contractStore, web3Store, tierStore } = this.props
    const { web3 } = web3Store

    scrollToBottom();
    copy('copy');
    checkWeb3(web3);

    if (contractStore && contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) {
      this.setState({ loading: true })

      if (!contractStore.safeMathLib) {
        this.hideLoader()
        return noContractDataAlert()
      }

      const { token, pricingStrategy } = contractStore
      const abiToken = (token && token.abi) || []
      const addrToken = (token && token.addr) || null
      const abiPricingStrategy = (pricingStrategy && pricingStrategy.abi) || []

      const tokenABIConstructor = Promise.resolve(addrToken)
        .then(addrToken => {
          if (!addrToken) {
            return getEncodedABIClientSide(web3, abiToken, [], 0)
              .then(ABIEncoded => {
                contractStore.setContractProperty('token', 'abiConstructor', ABIEncoded)
                console.log('token ABI Encoded params constructor:', ABIEncoded)
              })
          }
        })

      const tiers = tierStore.tiers.map((value, index) => {
        return getEncodedABIClientSide(web3, abiPricingStrategy, [], index)
          .then(ABIEncoded => {
            const newContract = contractStore.pricingStrategy.abiConstructor.concat(ABIEncoded)
            contractStore.setContractProperty('pricingStrategy', 'abiConstructor', newContract)
            console.log('pricingStrategy ABI Encoded params constructor:', ABIEncoded)
          })
      })

      Promise.all([tokenABIConstructor, ...tiers])
        .then(() => this.deploySafeMathLibrary())
        .then(() => this.deployToken())
        .then(() => this.deployPricingStrategy())
        .then(() => this.deployCrowdsale())
        .then(() => this.calculateABIEncodedArgumentsForFinalizeAgentContractDeployment())
        .then(() => this.deployFinalizeAgent())
        .catch(error => this.handleError(error))
    }
  }

  handleError = (error) => {
    this.hideLoader()
    console.error(error)
    toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
  }

  hideLoader() {
    this.setState({ loading: false })
  }

  handleContentByParent(content, index = 0) {
    const { parent } = content

    switch (parent) {
      case 'crowdsale':
      case 'pricingStrategy':
      case 'finalizeAgent':
        return handlerForFile(content, this.props.contractStore[parent])
      case 'tierStore':
        index = 'walletAddress' === content.field ? 0 : index
        return handlerForFile(content, this.props[parent].tiers[index])
      case 'tokenStore':
        return handlerForFile(content, this.props[parent])
      case 'contracts':
        return handleContractsForFile(content, index, this.props.contractStore, this.props.tierStore)
      case 'none':
        return handleConstantForFile(content)
      default:
        // do nothing
    }
  }

  downloadCrowdsaleInfo = () => {
    const zip = new JSZip()
    const { files } = FILE_CONTENTS
    const [NULL_FINALIZE_AGENT, FINALIZE_AGENT] = ['nullFinalizeAgent', 'finalizeAgent']
    const tiersCount = isObservableArray(this.props.tierStore.tiers) ? this.props.tierStore.tiers.length : 1
    const contractsKeys = tiersCount === 1 ? files.order.filter(c => c !== NULL_FINALIZE_AGENT) : files.order;
    const orderNumber = order => order.toString().padStart(3, '0');
    let prefix = 1

    contractsKeys.forEach(key => {
      if (this.props.contractStore.hasOwnProperty(key)) {
        const { txt, sol, name } = files[key]
        const { abiConstructor } = this.props.contractStore[key]
        let tiersCountPerContract = isObservableArray(abiConstructor) ? abiConstructor.length : 1

        if (tiersCount > 1 && [NULL_FINALIZE_AGENT, FINALIZE_AGENT].includes(key)) {
          tiersCountPerContract = NULL_FINALIZE_AGENT === key ? tiersCount - 1 : 1
        }

        for (let tier = 0; tier < tiersCountPerContract; tier++) {
          const suffix = tiersCountPerContract > 1 ? `_${tier + 1}` : ''
          const solFilename = `${orderNumber(prefix++)}_${name}${suffix}`
          const txtFilename = `${orderNumber(prefix++)}_${name}${suffix}`
          const tierNumber = FINALIZE_AGENT === key ? tiersCount - 1 : tier
          const commonHeader = FILE_CONTENTS.common.map(content => this.handleContentByParent(content, tierNumber))

          zip.file(
            `${solFilename}.sol`,
            this.handleContentByParent(sol)
          )
          zip.file(
            `${txtFilename}.txt`,
            commonHeader.concat(txt.map(content => this.handleContentByParent(content, tierNumber))).join('\n\n')
          )
        }
      }
    })

    zip.generateAsync({ type: DOWNLOAD_TYPE.blob })
      .then(content => {
        const tokenAddr = this.props.contractStore ? this.props.contractStore.token.addr : '';

        getDownloadName(tokenAddr)
          .then(downloadName => download({ zip: content, filename: downloadName }))
      })
  }

  deploySafeMathLibrary = () => {
    const { web3Store, contractStore } = this.props
    const { web3 } = web3Store

    console.log("***Deploy safeMathLib contract***");

    if (!web3 || web3.eth.accounts.length === 0) {
      noMetaMaskAlert()
      return Promise.reject('no MetaMask')
    }

    const { safeMathLib } = contractStore
    const binSafeMathLib = safeMathLib.bin || ''
    const abiSafeMathLib = safeMathLib.abi || []

    return deployContract(0, web3, abiSafeMathLib, binSafeMathLib, [])
      .then(safeMathLibAddr => this.handleDeployedSafeMathLibrary(safeMathLibAddr))
  }

  handleDeployedSafeMathLibrary = safeMathLibAddr => {
    return new Promise((resolve, reject) => {
      const { contractStore } = this.props
      console.log('safeMathLibAddr: ' + safeMathLibAddr)

      contractStore.setContractProperty('safeMathLib', 'addr', safeMathLibAddr)

      try {
        Object.keys(contractStore)
          .filter(key => contractStore[key] !== undefined)
          .forEach(key => {
            if (contractStore[key].bin) {
              const strToReplace = '__:SafeMathLibExt_______________________'
              const newBin = window.reaplaceAll(strToReplace, safeMathLibAddr.substr(2), contractStore[key].bin)
              contractStore.setContractProperty(key, 'bin', newBin)
            }
          })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  deployToken = () => {
    const { web3Store, contractStore, tokenStore } = this.props
    const { web3 } = web3Store

    console.log("***Deploy token contract***");

    if (web3.eth.accounts.length === 0) {
      noMetaMaskAlert()
      return Promise.reject('no MetaMask')
    }

    const binToken = (contractStore && contractStore.token && contractStore.token.bin) || ''
    const abiToken = (contractStore && contractStore.token && contractStore.token.abi) || []
    const paramsToken = this.getTokenParams(tokenStore)

    console.log(paramsToken);

    return deployContract(0, web3, abiToken, binToken, paramsToken)
      .then(tokenAddr => this.handleDeployedToken(tokenAddr))
  }

  getTokenParams = (token) => {
    console.log(token);

    let minCap = 0

    if (this.props.tierStore.tiers[0].whitelistdisabled === 'yes' && this.props.tierStore.globalMinCap) {
      minCap = toFixed(this.props.tierStore.globalMinCap * 10 ** token.decimals).toString()
    }

    return [
      token.name,
      token.ticker,
      parseInt(token.supply, 10),
      parseInt(token.decimals, 10),
      true,
      minCap
    ]
  }

  handleDeployedToken = tokenAddr => {
    return Promise.resolve().then(() => this.props.contractStore.setContractProperty('token', 'addr', tokenAddr))
  }

  deployPricingStrategy = () => {
    const { web3Store, contractStore, tierStore } = this.props
    const { web3 } = web3Store

    console.log('***Deploy pricing strategy contract***')

    if (web3.eth.accounts.length === 0) {
      noMetaMaskAlert()
      return Promise.reject('no MetaMask')
    }

    const pricingStrategies = tierStore.tiers
    const binPricingStrategy = (contractStore && contractStore.pricingStrategy && contractStore.pricingStrategy.bin) || ''
    const abiPricingStrategy = (contractStore && contractStore.pricingStrategy && contractStore.pricingStrategy.abi) || []

    return pricingStrategies.reduce((promise, pricingStrategy, index) => {
      const paramsPricingStrategy = this.getPricingStrategyParams(pricingStrategy)

      console.log('***Deploy pricing strategy contract***', index)

      return promise
        .then(() => deployContract(index, web3, abiPricingStrategy, binPricingStrategy, paramsPricingStrategy))
        .then(pricingStrategyAddr => {
          console.log('***Deploy pricing strategy contract***', pricingStrategyAddr)

          const newPricingStrategy = contractStore.pricingStrategy.addr.concat(pricingStrategyAddr)
          contractStore.setContractProperty('pricingStrategy', 'addr', newPricingStrategy)
        })

    }, Promise.resolve())
      .then(() => this.handleDeployedPricingStrategy())
  }

  //FlatPricing
  getPricingStrategyParams = pricingStrategy => {
    const { web3Store } = this.props
    const oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1 / pricingStrategy.rate)

    console.log('web3Store', web3Store.web3, web3Store.web3.utils.toWei)

    return [
      web3Store.web3.utils.toWei(oneTokenInETH, 'ether'),
      pricingStrategy.updatable ? pricingStrategy.updatable === 'on' : false
    ]
  }

  handleDeployedPricingStrategy = () => {
    const { contractStore, tierStore, web3Store } = this.props
    const { web3 } = web3Store

    const abiCrowdsale = (contractStore && contractStore.crowdsale && contractStore.crowdsale.abi) || []

    return tierStore.tiers.reduce((promise, tier, index) => {
      return promise
        .then(() => getEncodedABIClientSide(web3, abiCrowdsale, [], index))
        .then(ABIEncoded => {
          const newContract = contractStore.crowdsale.abiConstructor.concat(ABIEncoded)
          contractStore.setContractProperty('crowdsale', 'abiConstructor', newContract)
          console.log('crowdsale ABI encoded params constructor:', ABIEncoded)
        })
    }, Promise.resolve())
  }

  deployCrowdsale = () => {
    return Promise.resolve()
      .then(() => getNetworkVersion(this.props.web3Store.web3))
      .then((networkID) => {
        const { web3Store, contractStore, tierStore } = this.props
        const { web3 } = web3Store

        console.log('***Deploy crowdsale contract***')
        console.log('web3', web3)

        if (web3.eth.accounts.length === 0) {
          noMetaMaskAlert()
          return Promise.reject('no MetaMask')
        }

        contractStore.setContractProperty('crowdsale', 'networkID', networkID)
        const binCrowdsale = (contractStore.crowdsale && contractStore.crowdsale.bin) || ''
        const abiCrowdsale = (contractStore.crowdsale && contractStore.crowdsale.abi) || []

        return tierStore.tiers.reduce((promise, tier, index) => {
          console.log('***Deploy crowdsale contract***', index)

          let paramsCrowdsale

          if (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) {
            paramsCrowdsale = this.getCrowdSaleParams(web3, index)
          }

          return promise
            .then(() => deployContract(index, web3, abiCrowdsale, binCrowdsale, paramsCrowdsale))
            .then(crowdsaleAddr => {
              console.log('***Deploy crowdsale contract***', crowdsaleAddr)

              const newAddr = contractStore.crowdsale.addr.concat(crowdsaleAddr)
              contractStore.setContractProperty('crowdsale', 'addr', newAddr)
            })

        }, Promise.resolve())
      })
  }

  //MintedTokenCappedCrowdsale
  getCrowdSaleParams = (web3, i) => {
    const { contractStore, tierStore, tokenStore } = this.props
    const tier = tierStore.tiers[i]
    const initialTier = tierStore.tiers[0]
    const whitelistDisabled = initialTier.whitelistdisabled

    return [
      contractStore.token.addr,
      contractStore.pricingStrategy.addr[i],
      initialTier.walletAddress,
      toFixed(parseInt(Date.parse(tier.startTime) / 1000, 10).toString()),
      toFixed(parseInt(Date.parse(tier.endTime) / 1000, 10).toString()),
      toFixed('0'),
      toFixed(parseInt(tier.supply, 10) * 10 ** parseInt(tokenStore.decimals, 10)).toString(),
      tier.updatable ? tier.updatable === 'on' : false,
      whitelistDisabled ? whitelistDisabled !== 'yes' : false
    ]
  }

  calculateABIEncodedArgumentsForFinalizeAgentContractDeployment = () => {
    const { web3Store, contractStore, tierStore } = this.props
    const { web3 } = web3Store
    const tiersMaxIndex = tierStore.tiers.length - 1
    let abiFinalizeAgent = (contractStore.nullFinalizeAgent && contractStore.nullFinalizeAgent.abi) || []

    return Promise.all(tierStore.tiers.map((tier, index) => {
      if (index === tiersMaxIndex) {
        abiFinalizeAgent = (contractStore.finalizeAgent && contractStore.finalizeAgent.abi) || []
      }

      return getEncodedABIClientSide(web3, abiFinalizeAgent, [], index)
        .then(ABIEncoded => {
          const newAbi = contractStore.finalizeAgent.abiConstructor.concat(ABIEncoded)
          contractStore.setContractProperty('finalizeAgent', 'abiConstructor', newAbi)
          console.log('finalizeAgent ABI encoded params constructor:', ABIEncoded)
        })
    }))
  }

  deployFinalizeAgent = () => {
    const { web3Store, contractStore } = this.props
    const { web3 } = web3Store

    console.log("***Deploy finalize agent contract***");

    if (web3.eth.accounts.length === 0) {
      noMetaMaskAlert()
      return Promise.reject('no MetaMask')
    }

    let binNullFinalizeAgent = (contractStore && contractStore.nullFinalizeAgent && contractStore.nullFinalizeAgent.bin) || ''
    let abiNullFinalizeAgent = (contractStore && contractStore.nullFinalizeAgent && contractStore.nullFinalizeAgent.abi) || []

    let binFinalizeAgent = (contractStore && contractStore.finalizeAgent && contractStore.finalizeAgent.bin) || ''
    let abiFinalizeAgent = (contractStore && contractStore.finalizeAgent && contractStore.finalizeAgent.abi) || []

    let crowdsales

    if (this.state.tokenStoreIsAlreadyCreated) {
      let curTierAddr = [contractStore.crowdsale.addr.slice(-1)[0]]
      let prevTierAddr = [contractStore.crowdsale.addr.slice(-2)[0]]
      crowdsales = [prevTierAddr, curTierAddr]
    } else {
      crowdsales = contractStore.crowdsale.addr
    }

    const crowdsalesMaxIndex = crowdsales.length - 1

    return crowdsales.reduce((promise, crowdsale, index) => {
      let abi, bin, paramsFinalizeAgent

      if (index === crowdsalesMaxIndex) {
        paramsFinalizeAgent = this.getFinalizeAgentParams(web3, index)
        abi = abiFinalizeAgent
        bin = binFinalizeAgent
      } else {
        abi = abiNullFinalizeAgent
        bin = binNullFinalizeAgent
        paramsFinalizeAgent = this.getNullFinalizeAgentParams(web3, index)
      }

      return promise
        .then(() => deployContract(index, web3, abi, bin, paramsFinalizeAgent))
        .then(finalizeAgentAddr => {
          console.log('***Deploy finalize agent contract***', finalizeAgentAddr)

          const newAddr = contractStore.finalizeAgent.addr.concat(finalizeAgentAddr)
          contractStore.setContractProperty('finalizeAgent', 'addr', newAddr)
        })
    }, Promise.resolve())
      .then(() => this.handleDeployedFinalizeAgent())
  }

  getNullFinalizeAgentParams = (web3, i) => {
    return [
      this.props.contractStore.crowdsale.addr[i]
    ]
  }

  getFinalizeAgentParams = (web3, i) => {
    const { contractStore } = this.props
    return [
      contractStore.token.addr,
      contractStore.crowdsale.addr[i]
    ]
  }

  handleDeployedFinalizeAgent = () => {
    const { contractStore, reservedTokenStore, tierStore, tokenStore, web3Store } = this.props
    const { pricingStrategy, crowdsale, token } = contractStore
    const { web3 } = web3Store

    const tokenABI = token.abi.slice()
    const pricingStrategyABI = pricingStrategy.abi.slice()
    const crowdsaleABI = crowdsale.abi.slice()

    const currFinalizeAgentAddr = contractStore.finalizeAgent.addr
    const tokenAddr = token.addr
    const crowdsaleAddr = crowdsale.addr

    setLastCrowdsaleRecursive(web3, pricingStrategyABI, pricingStrategy.addr, crowdsaleAddr.slice(-1)[0], 142982)
      .then(() => setReservedTokensListMultiple(web3, tokenABI, tokenAddr, tokenStore, reservedTokenStore))
      .then(() => updateJoinedCrowdsalesRecursive(web3, crowdsaleABI, crowdsaleAddr, 293146))
      .then(() => setMintAgentRecursive(web3, tokenABI, tokenAddr, crowdsaleAddr, 68425))
      .then(() => setMintAgentRecursive(web3, tokenABI, tokenAddr, currFinalizeAgentAddr, 68425))
      .then(() => addWhiteListRecursive(web3, tierStore, tokenStore, crowdsaleABI, crowdsaleAddr))
      .then(() => setFinalizeAgentRecursive(web3, crowdsaleABI, crowdsaleAddr, currFinalizeAgentAddr, 68622))
      .then(() => setReleaseAgentRecursive(web3, tokenABI, tokenAddr, currFinalizeAgentAddr, 65905))
      .then(() => transferOwnership(web3, tokenABI, tokenAddr, tierStore.tiers[0].walletAddress, 46699))
      .then(() => this.hideLoader())
      .catch(this.handleError.bind(this))
  }

  downloadContractButton = () => {
    this.downloadCrowdsaleInfo();
    this.contractDownloadSuccess({ offset: 14 })
  }

  goToCrowdsalePage = () => {
    const { contractStore } = this.props
    const { addr } = contractStore.crowdsale

    if (!addr || addr.length === 0) {
      return noContractDataAlert()
    }

    const isValidContract = contractStore && contractStore.crowdsale && addr

    let crowdsalePage = '/crowdsale'
    let url = `${crowdsalePage}?addr=${addr[0]}&networkID=${contractStore.crowdsale.networkID}`

    if (!this.state.contractDownloaded) {
      this.downloadCrowdsaleInfo()
      this.contractDownloadSuccess()
    }

    let newHistory = isValidContract ? url : crowdsalePage
    this.props.history.push(newHistory)
  }

  render() {
    const { tierStore, contractStore, tokenStore } = this.props
    let crowdsaleSetups = [];
    for (let i = 0; i < tierStore.tiers.length; i++) {
      let capBlock = <DisplayField
        side='left'
        title={'Max cap'}
        value={tierStore.tiers[i].supply?tierStore.tiers[i].supply:""}
        description="How many tokens will be sold on this tier."
      />
      let updatableBlock = <DisplayField
        side='right'
        title={'Allow modifying'}
        value={tierStore.tiers[i].updatable?tierStore.tiers[i].updatable:"off"}
        description="Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing."
      />

      crowdsaleSetups.push(<div key={i.toString()}><div className="publish-title-container">
          <p className="publish-title" data-step={3+i}>Crowdsale Setup {tierStore.tiers[i].tier}</p>
        </div>
        <div className="hidden">
          <div className="hidden">
            <DisplayField
              side='left'
              title={'Start time'}
              value={tierStore.tiers[i].startTime?tierStore.tiers[i].startTime.split("T").join(" "):""}
              description="Date and time when the tier starts."
            />
            <DisplayField
              side='right'
              title={'End time'}
              value={tierStore.tiers[i].endTime?tierStore.tiers[i].endTime.split("T").join(" "):""}
              description="Date and time when the tier ends."
            />
          </div>
          <div className="hidden">
            <DisplayField
              side='left'
              title={'Wallet address'}
              value={tierStore.tiers[i].walletAddress?tierStore.tiers[i].walletAddress:""}
              description="Where the money goes after investors transactions."
            />
            <DisplayField
              side='right'
              title={'RATE'}
              value={tierStore.tiers[i].rate?tierStore.tiers[i].rate:0 + " ETH"}
              description="Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens."
            />
          </div>
          {contractStore.contractType===CONTRACT_TYPES.whitelistwithcap?capBlock:""}
          {contractStore.contractType===CONTRACT_TYPES.whitelistwithcap?updatableBlock:""}
        </div></div>);
    }
    let ABIEncodedOutputsCrowdsale = [];
    for (let i = 0; i < tierStore.tiers.length; i++) {
      ABIEncodedOutputsCrowdsale.push(
        <DisplayTextArea
          key={i.toString()}
          label={"Constructor Arguments for " + (tierStore.tiers[i].tier?tierStore.tiers[i].tier : "contract") + " (ABI-encoded and appended to the ByteCode above)"}
          value={contractStore?contractStore.crowdsale?contractStore.crowdsale.abiConstructor?contractStore.crowdsale.abiConstructor[i]:"":"":""}
          description="Encoded ABI"
        />
      );
    }
    let ABIEncodedOutputsPricingStrategy = [];
    for (let i = 0; i < tierStore.tiers.length; i++) {
      ABIEncodedOutputsPricingStrategy.push(
        <DisplayTextArea
          key={i.toString()}
          label={"Constructor Arguments for " + (tierStore.tiers[i].tier?tierStore.tiers[i].tier : "") + " Pricing Strategy Contract (ABI-encoded and appended to the ByteCode above)"}
          value={contractStore?contractStore.pricingStrategy?contractStore.pricingStrategy.abiConstructor?contractStore.pricingStrategy.abiConstructor[i]:"":"":""}
          description="Contructor arguments for pricing strategy contract"
        />
      );
    }
    let ABIEncodedOutputsFinalizeAgent = [];
    for (let i = 0; i < tierStore.tiers.length; i++) {
      ABIEncodedOutputsFinalizeAgent.push(
        <DisplayTextArea
          key={i.toString()}
          label={"Constructor Arguments for " + (tierStore.tiers[i].tier?tierStore.tiers[i].tier : "") + " Finalize Agent Contract (ABI-encoded and appended to the ByteCode above)"}
          value={contractStore?contractStore.finalizeAgent?contractStore.finalizeAgent.abiConstructor?contractStore.finalizeAgent.abiConstructor[i]:"":"":""}
          description="Contructor arguments for finalize agent contract"
        />
      );
    }
    let globalLimitsBlock = <div><div className="publish-title-container">
      <p className="publish-title" data-step={2 + tierStore.tiers.length + 2}>Global Limits</p>
    </div>
    <div className="hidden">
      <DisplayField
        side='left'
        title='Min Cap'
        value={tierStore.globalMinCap}
        description="Min Cap for all investors"
      /></div>
    </div>;
    let tokenBlock = <div>
      <DisplayTextArea
        label={"Token Contract Source Code"}
        value={contractStore?contractStore.token?contractStore.token.src:"":""}
        description="Token Contract Source Code"
      />
      <DisplayTextArea
        label={"Token Contract ABI"}
        value={contractStore?contractStore.token?JSON.stringify(contractStore.token.abi):"":""}
        description="Token Contract ABI"
      />
       <DisplayTextArea
        label={"Token Constructor Arguments (ABI-encoded and appended to the ByteCode above)"}
        value={contractStore?contractStore.token?contractStore.token.abiConstructor?contractStore.token.abiConstructor:"":"":""}
        description="Token Constructor Arguments"
      />
    </div>;
    let pricingStrategyBlock = <div>
      <DisplayTextArea
        label={"Pricing Strategy Contract Source Code"}
        value={contractStore?contractStore.pricingStrategy?contractStore.pricingStrategy.src:"":""}
        description="Pricing Strategy Contract Source Code"
      />
      <DisplayTextArea
        label={"Pricing Strategy Contract ABI"}
        value={contractStore?contractStore.pricingStrategy?JSON.stringify(contractStore.pricingStrategy.abi):"":""}
        description="Pricing Strategy Contract ABI"
      />
    </div>;
    let finalizeAgentBlock = <div>
      <DisplayTextArea
        label={"Finalize Agent Contract Source Code"}
        value={contractStore?contractStore.finalizeAgent?contractStore.finalizeAgent.src:"":""}
        description="Finalize Agent Contract Source Code"
      />
      <DisplayTextArea
        label={"Finalize Agent Contract ABI"}
        value={contractStore?contractStore.finalizeAgent?JSON.stringify(contractStore.finalizeAgent.abi):"":""}
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
              <p className="label">{contractStore.contractType===CONTRACT_TYPES.standard?"Standard":"Whitelist with cap"}</p>
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
                  value={tokenStore.name?tokenStore.name:""}
                  description="The name of your token. Will be used by Etherscan and other token browsers."
                />
                <DisplayField
                  side='right'
                  title='Ticker'
                  value={tokenStore.ticker?tokenStore.ticker:""}
                  description="The three letter ticker for your token."
                />
              </div>
              <div className="hidden">
                <DisplayField
                  side='left'
                  title='DECIMALS'
                  value={tokenStore.decimals?tokenStore.decimals.toString():""}
                  description="The decimals of your token."
                />
              </div>
            </div>
            {crowdsaleSetups}
            <div className="publish-title-container">
              <p className="publish-title" data-step={2 + tierStore.tiers.length + 1}>Crowdsale Setup</p>
            </div>
            <div className="hidden">
              <DisplayField
                side='left'
                title='Compiler Version'
                value={'0.4.11'}
                description="Compiler Version"
              />
              <DisplayField
                side='right'
                title='Contract name'
                value={'MintedTokenCappedCrowdsaleExt'}
                description="Crowdsale contract name"
              />
              <DisplayField
                side='left'
                title='Optimized'
                value={true.toString()}
                description="Optimization in compiling"
              />
            </div>
            {tierStore.tiers[0].whitelistdisabled === "yes"?globalLimitsBlock:""}
            {tokenBlock}
            {pricingStrategyBlock}
            {ABIEncodedOutputsPricingStrategy}
            {finalizeAgentBlock}
            {ABIEncodedOutputsFinalizeAgent}
            <DisplayTextArea
              label={"Crowdsale Contract Source Code"}
              value={contractStore?contractStore.crowdsale?contractStore.crowdsale.src:"":""}
              description="Crowdsale Contract Source Code"
            />
            <DisplayTextArea
              label={"Crowdsale Contract ABI"}
              value={contractStore?contractStore.crowdsale?JSON.stringify(contractStore.crowdsale.abi):"":""}
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
