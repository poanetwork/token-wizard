import React from "react";
import "../../assets/stylesheets/application.css";
import { Link } from "react-router-dom";
import { setExistingContractParams, getNetworkVersion, getNetWorkNameById } from "../../utils/blockchainHelpers";
import { defaultCompanyStartDate } from "./utils";
import { defaultCompanyEndDate, gweiToWei, weiToGwei } from "../../utils/utils";
import { StepNavigation } from "../Common/StepNavigation";
import { InputField } from "../Common/InputField";
import { RadioInputField } from "../Common/RadioInputField";
import { CrowdsaleBlock } from "./CrowdsaleBlock";
import { WhitelistInputBlock } from "../Common/WhitelistInputBlock";
import {
  NAVIGATION_STEPS,
  VALIDATION_MESSAGES,
  VALIDATION_TYPES,
  TEXT_FIELDS,
  CONTRACT_TYPES,
  CHAINS
} from "../../utils/constants";
import { inject, observer } from "mobx-react";
import { Loader } from '../Common/Loader'
import { noGasPriceAvailable, warningOnMainnetAlert } from '../../utils/alerts'

const { CROWDSALE_SETUP } = NAVIGATION_STEPS;
const { EMPTY, VALID } = VALIDATION_TYPES;
const {
  START_TIME,
  END_TIME,
  MINCAP,
  RATE,
  SUPPLY,
  WALLET_ADDRESS,
  CROWDSALE_SETUP_NAME,
  ALLOWMODIFYING,
  ENABLE_WHITELISTING
} = TEXT_FIELDS;

@inject("contractStore", "crowdsaleBlockListStore", "pricingStrategyStore", "web3Store", "tierStore", "generalStore", "gasPriceStore", "reservedTokenStore")
@observer
export class stepThree extends React.Component {
  constructor(props) {
    super(props);
    const { contractStore, crowdsaleBlockListStore, tierStore, gasPriceStore } = props;
    window.scrollTo(0, 0);
    if (contractStore.crowdsale.addr.length > 0) {
      contractStore.setContractProperty("pricingStrategy", "addr", []);
      setExistingContractParams(contractStore.abi, contractStore.addr[0], contractStore.setContractProperty);
    }
    crowdsaleBlockListStore.emptyList();
    tierStore.setTierProperty("Tier 1", "tier", 0);
    tierStore.setTierProperty("off", "updatable", 0);
    tierStore.setTierProperty("no", "whitelistEnabled", 0);

    this.state = {
      loading: true,
      gasPriceSelected: gasPriceStore.slow.id
    }
  }

  showErrorMessages = parent => {
    this.props.tierStore.invalidateToken();
  };

  changeState = (event, parent, key, property) => {
    if (property.indexOf("whitelist_") === 0) {
      const { tierStore } = this.props;
      const whitelistInputProps = { ...tierStore.tiers[key].whitelistInput };
      const prop = property.split("_")[1];

      whitelistInputProps[prop] = event.target.value;
      tierStore.setTierProperty(whitelistInputProps, "whitelistInput", key);
    }
  };

  addCrowdsale() {
    const { crowdsaleBlockListStore, tierStore } = this.props;
    let num = crowdsaleBlockListStore.blockList.length + 1;
    const newTier = {
      tier: "Tier " + (num + 1),
      supply: 0,
      rate: 0,
      updatable: "off",
      whitelist: [],
      whitelistElements: [],
      whitelistInput: {}
    };

    const newTierValidations = {
      tier: VALID,
      startTime: VALID,
      endTime: VALID,
      supply: EMPTY,
      rate: EMPTY
    };

    tierStore.addTier(newTier);
    tierStore.addTierValidations(newTierValidations);
    this.addCrowdsaleBlock(num);
  }

  updateCrowdsaleBlockListStore = (event, property, index) => {
    const { crowdsaleBlockListStore } = this.props;
    const value = event.target.value;
    crowdsaleBlockListStore.setCrowdsaleBlockProperty(value, property, index);
    crowdsaleBlockListStore.validateCrowdsaleListBlockProperty(property, index);
  };

  updateTierStore = (event, property, index) => {
    const { tierStore } = this.props;
    const value = event.target.value;
    tierStore.setTierProperty(value, property, index);
    tierStore.validateTiers(property, index);
  };

  updatePricingStrategyStore = (event, index, property) => {
    const { pricingStrategyStore } = this.props;
    const value = event.target.value;
    pricingStrategyStore.setStrategyProperty(value, property, index);
  };

  goToDeploymentStage = () => {
    this.props.history.push('/4')
  }

  addCrowdsaleBlock(num) {
    this.props.crowdsaleBlockListStore.addCrowdsaleItem(<CrowdsaleBlock num={num} />);
  }

  renderLink() {
    return (
      <div>
        <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary">
          {" "}
          Add Tier
        </div>
        <Link
          to={{ pathname: "/4", query: { state: this.state, changeState: this.changeState } }}
          onClick={e => this.beforeNavigate(e)}
          className="button button_fill"
        >
          Continue
        </Link>
      </div>
    );
  }

  beforeNavigate = e => {
    e.preventDefault();
    e.stopPropagation();

    const { tierStore } = this.props;

    for (let index = 0; index < tierStore.tiers.length; index++) {
      tierStore.validateTiers("endTime", index);
      tierStore.validateTiers("startTime", index);
    }

    if (tierStore.areTiersValid) {
      getNetworkVersion()
        .then(networkID => {
          if (getNetWorkNameById(networkID) === CHAINS.MAINNET) {
            const { generalStore, reservedTokenStore } = this.props

            const tiersCount = tierStore.tiers.length
            const priceSelected = generalStore.gasPrice
            const reservedCount = reservedTokenStore.tokens.length
            let whitelistCount = 0

            if (tierStore.tiers[0].whitelistdisabled === 'no') {
              whitelistCount = tierStore.tiers.reduce((total, tier) => {
                total += tier.whitelist.filter(address => !address.deleted).length
                return total
              }, 0)
            }

            return warningOnMainnetAlert(tiersCount, priceSelected, reservedCount, whitelistCount, this.goToDeploymentStage)
          }
          this.goToDeploymentStage()
        })
        .catch(error => {
          console.error(error)
          this.showErrorMessages(e)
        })
    } else {
      this.showErrorMessages(e);
    }
  };

  componentDidMount() {
    const { tierStore, web3Store, gasPriceStore } = this.props;
    const { curAddress } = web3Store;
    tierStore.setTierProperty(curAddress, "walletAddress", 0);
    tierStore.setTierProperty(defaultCompanyStartDate(), "startTime", 0);
    tierStore.setTierProperty(defaultCompanyEndDate(tierStore.tiers[0].startTime), "endTime", 0);

    gasPriceStore.updateValues()
      .then(() => this.setGasPrice(gasPriceStore.slow))
      .catch(() => noGasPriceAvailable())
      .then(() => this.setState({ loading: false }))
  }

  setGasPrice({ id, price }) {
    this.setState({
      gasPriceSelected: id
    })

    // Don't modify the price when choosing custom
    if (id !== this.props.gasPriceStore.custom.id) {
      this.props.generalStore.setGasPrice(price)
    }
  }

  renderGasPriceInput() {
    const { generalStore, gasPriceStore } = this.props

    return (
      <div className="right">
        <label className="label">Gas Price</label>
        <div className="radios-inline">
          <label className="radio-inline">
            <input
              type="radio"
              checked={this.state.gasPriceSelected === gasPriceStore.slow.id}
              name="gas-price-option-slow"
              onChange={() => this.setGasPrice(gasPriceStore.slow)}
              value="slow"
            />
            <span className="title">{gasPriceStore.slow.description()}</span>
          </label>
        </div>
        <div className="radios-inline">
          <label className="radio-inline">
            <input
              type="radio"
              checked={this.state.gasPriceSelected === gasPriceStore.standard.id}
              name="gas-price-option-normal"
              onChange={() => this.setGasPrice(gasPriceStore.standard)}
              value="slow"
            />
            <span className="title">{gasPriceStore.standard.description()}</span>
          </label>
        </div>
        <div className="radios-inline">
          <label className="radio-inline">
            <input
              type="radio"
              checked={this.state.gasPriceSelected === gasPriceStore.fast.id}
              name="gas-price-option-fast"
              onChange={() => this.setGasPrice(gasPriceStore.fast)}
              value="slow"
            />
            <span className="title">{gasPriceStore.fast.description()}</span>
          </label>
        </div>
        <div className="radios-inline">
          <label className="radio-inline">
            <input
              type="radio"
              checked={this.state.gasPriceSelected === gasPriceStore.custom.id}
              name="gas-price-option-fast"
              onChange={() => this.setGasPrice(gasPriceStore.custom)}
              value="slow"
            />
            <span className="title">{gasPriceStore.custom.description()}</span>
          </label>
        </div>

        {
          this.state.gasPriceSelected === gasPriceStore.custom.id ?
            <input
              className="input"
              style={{ display: 'inline-block' }}
              type="number"
              value={weiToGwei(generalStore.gasPrice)}
              onChange={(e) => generalStore.setGasPrice(gweiToWei(e.target.value))}
            /> :
            null
        }

        <p className="description">Slow is cheap, fast is expensive</p>
      </div>
    );
  }

  updateWhitelistEnabled = (e) => {
    this.props.tierStore.setGlobalMinCap('')
    this.updateTierStore(e, "whitelistEnabled", 0)
  }

  render() {
    const { contractStore, crowdsaleBlockListStore, tierStore } = this.props;
    let globalSettingsBlock = (
      <div>
        <div className="section-title">
          <p className="title">Global settings</p>
        </div>
        <div className="input-block-container">
          <InputField
            side="left"
            type="text"
            title={WALLET_ADDRESS}
            value={tierStore.tiers[0].walletAddress}
            valid={tierStore.validTiers[0] && tierStore.validTiers[0].walletAddress}
            errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
            onChange={e => this.updateTierStore(e, "walletAddress", 0)}
            description={`Where the money goes after investors transactions. Immediately after each transaction. We recommend to setup a multisig wallet with hardware based signers.`}
          />
          {this.renderGasPriceInput()}
        </div>
        <div className="input-block-container">
          <InputField
            side="left"
            type="number"
            disabled={tierStore.tiers[0].whitelistEnabled === "yes"}
            title={MINCAP}
            value={tierStore.globalMinCap}
            valid={VALID}
            errorMessage={VALIDATION_MESSAGES.MINCAP}
            onChange={e => tierStore.setGlobalMinCap(e.target.value)}
            description={`Minimum amount tokens to buy. Not a minimal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
          />
          <RadioInputField
            extraClassName="right"
            title={ENABLE_WHITELISTING}
            items={[{ label: 'yes', value: 'yes' }, { label: 'no', value: 'no' }]}
            defaultValue={tierStore.tiers[0].whitelistEnabled}
            onChange={e => this.updateWhitelistEnabled(e)}
            description={`Enables whitelisting. If disabled, anyone can participate in the crowdsale.`}
          />
        </div>
      </div>
    );
    if (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) {
      let whitelistInputBlock = (
        <div>
          <div className="section-title">
            <p className="title">Whitelist</p>
          </div>
          <WhitelistInputBlock num={0} onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, 0, prop)} />
        </div>
      );
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP} />
          <div className="steps-content container">
            <div className="about-step">
              <div className="step-icons step-icons_crowdsale-setup" />
              <p className="title">Crowdsale setup</p>
              <p className="description">
                The most important and exciting part of the crowdsale process. Here you can define parameters of your
                crowdsale campaign.
              </p>
            </div>
            {globalSettingsBlock}
          </div>

          {/* First tier */}
          <div style={{ marginTop: "40px" }} className="steps-content container">
            <div className="hidden">
              <div className="input-block-container">
                <InputField
                  side="left"
                  type="text"
                  title={CROWDSALE_SETUP_NAME}
                  value={tierStore.tiers[0].tier}
                  valid={tierStore.validTiers[0] && tierStore.validTiers[0].tier}
                  errorMessage={VALIDATION_MESSAGES.TIER}
                  onChange={e => this.updateTierStore(e, "tier", 0)}
                  description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
                />
                <RadioInputField
                  extraClassName="right"
                  title={ALLOWMODIFYING}
                  items={[{ label: 'on', value: 'on' }, { label: 'off', value: 'off' }]}
                  defaultValue="off"
                  onChange={e => this.updateTierStore(e, "updatable", 0)}
                  description={`Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`}
                />
              </div>
              <div className="input-block-container">
                <InputField
                  side="left"
                  type="datetime-local"
                  title={START_TIME}
                  value={tierStore.tiers[0].startTime}
                  valid={tierStore.validTiers[0] && tierStore.validTiers[0].startTime}
                  errorMessage={VALIDATION_MESSAGES.START_TIME}
                  onChange={e => this.updateTierStore(e, "startTime", 0)}
                  description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
                />
                <InputField
                  side="right"
                  type="datetime-local"
                  title={END_TIME}
                  value={tierStore.tiers[0].endTime}
                  valid={tierStore.validTiers[0] && tierStore.validTiers[0].endTime}
                  errorMessage={VALIDATION_MESSAGES.END_TIME}
                  onChange={e => this.updateTierStore(e, "endTime", 0)}
                  description={`Date and time when the tier ends. Can be only in the future.`}
                />
              </div>
              <div className="input-block-container">
                <InputField
                  side="left"
                  type="number"
                  title={RATE}
                  value={tierStore.tiers[0].rate}
                  valid={tierStore.validTiers[0] && tierStore.validTiers[0].rate}
                  errorMessage={VALIDATION_MESSAGES.RATE}
                  onChange={e => this.updateTierStore(e, "rate", 0)}
                  description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
                />
                <InputField
                  side="right"
                  type="number"
                  title={SUPPLY}
                  value={tierStore.tiers[0].supply}
                  valid={tierStore.validTiers[0] && tierStore.validTiers[0].supply}
                  errorMessage={VALIDATION_MESSAGES.SUPPLY}
                  onChange={e => this.updateTierStore(e, "supply", 0)}
                  description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
                />
              </div>
            </div>
            {tierStore.tiers[0].whitelistEnabled === "yes" ? whitelistInputBlock : ""}
          </div>

          {/* Other tiers */}
          <div>{crowdsaleBlockListStore.blockList}</div>

          <div className="button-container">{this.renderLink()}</div>
          <Loader show={this.state.loading}/>
        </section>
      );
    }
  }
}
