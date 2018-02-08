import React from "react";
import "../../assets/stylesheets/application.css";
import { WhitelistInputBlock } from "../Common/WhitelistInputBlock";
import { defaultCompanyEndDate } from "../../utils/utils";
import { InputField } from "../Common/InputField";
import { RadioInputField } from "../Common/RadioInputField";
import { inject, observer } from "mobx-react";
import { VALIDATION_MESSAGES, TEXT_FIELDS, DESCRIPTION } from "../../utils/constants";
const { START_TIME, END_TIME, RATE, SUPPLY, CROWDSALE_SETUP_NAME, ALLOWMODIFYING } = TEXT_FIELDS;

@inject("tierStore")
@observer
export class CrowdsaleBlock extends React.Component {
  componentWillMount() {
    const { tierStore, num } = this.props;
    const startTime = tierStore.tiers[num - 1].endTime;
    const endTime = defaultCompanyEndDate(tierStore.tiers[num - 1].endTime);
    tierStore.setTierProperty(startTime, "startTime", num);
    tierStore.setTierProperty(endTime, "endTime", num);
  }
  changeState = (event, parent, key, property) => {
    if (property.indexOf("whitelist_") === 0) {
      const { tierStore } = this.props;
      const whitelistInputProps = { ...tierStore.tiers[key].whitelistInput };
      const prop = property.split("_")[1];

      whitelistInputProps[prop] = event.target.value;
      tierStore.setTierProperty(whitelistInputProps, "whitelistInput", key);
    }
  };

  updateTierStore = (event, property) => {
    const { tierStore, num } = this.props;
    const value = event.target.value;
    tierStore.setTierProperty(value, property, num);
    tierStore.validateTiers(property, num);
  };

  render() {
    let { num, tierStore } = this.props;
    let whitelistInputBlock = (
      <div>
        <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        <WhitelistInputBlock num={num} onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, num, prop)} />
      </div>
    );
    return (
      <div key={num.toString()} style={{ marginTop: "40px" }} className="steps-content container">
        <div className="hidden">
          <div className="input-block-container">
            <InputField
              side="left"
              type="text"
              title={CROWDSALE_SETUP_NAME}
              value={tierStore.tiers[num].tier}
              valid={tierStore.validTiers[num].tier}
              errorMessage={VALIDATION_MESSAGES.TIER}
              onChange={e => this.updateTierStore(e, "tier")}
              description={DESCRIPTION.CROWDSALE_SETUP_NAME}
            />
            <RadioInputField
              extraClassName="right"
              title={ALLOWMODIFYING}
              items={[{ label: 'on', value: 'on' }, { label: 'off', value: 'off' }]}
              selectedItem={this.props.tierStore.tiers[this.props.num].updatable}
              onChange={e => this.updateTierStore(e, "updatable")}
              description={DESCRIPTION.ALLOW_MODIFYING}
            />
          </div>
          <div className="input-block-container">
            <InputField
              side="left"
              type="datetime-local"
              title={START_TIME}
              value={tierStore.tiers[num].startTime}
              valid={tierStore.validTiers[num].startTime}
              errorMessage={VALIDATION_MESSAGES.MULTIPLE_TIERS_START_TIME}
              onChange={e => this.updateTierStore(e, "startTime")}
              description={DESCRIPTION.START_TIME}
            />
            <InputField
              side="right"
              type="datetime-local"
              title={END_TIME}
              value={tierStore.tiers[num].endTime}
              valid={tierStore.validTiers[num].endTime}
              errorMessage={VALIDATION_MESSAGES.END_TIME}
              onChange={e => this.updateTierStore(e, "endTime")}
              description={DESCRIPTION.END_TIME}
            />
          </div>
          <div className="input-block-container">
            <InputField
              side="left"
              type="number"
              title={RATE}
              value={tierStore.tiers[num].rate}
              valid={tierStore.validTiers[num].rate}
              errorMessage={VALIDATION_MESSAGES.RATE}
              onChange={e => this.updateTierStore(e, "rate")}
              description={DESCRIPTION.RATE}
            />
            <InputField
              side="right"
              type="number"
              title={SUPPLY}
              value={tierStore.tiers[num].supply}
              valid={tierStore.validTiers[num].supply}
              errorMessage={VALIDATION_MESSAGES.SUPPLY}
              onChange={e => this.updateTierStore(e, "supply")}
              description={DESCRIPTION.SUPPLY}
            />
          </div>
        </div>
        {tierStore.tiers[0].whitelistEnabled === "yes" ? whitelistInputBlock : ""}
      </div>
    );
  }
}
