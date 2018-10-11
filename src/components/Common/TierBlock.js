import React from 'react'
import { CrowdsaleEndTime } from './CrowdsaleEndTime'
import { CrowdsaleRate } from './CrowdsaleRate'
import { CrowdsaleStartTime } from './CrowdsaleStartTime'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { MinCap } from './MinCap'
import { RadioButton } from '../Common/RadioButton'
import { Supply } from './Supply'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import { composeValidators, isRequired, isMaxLength } from '../../utils/validations'

const { ALLOW_MODIFYING, CROWDSALE_SETUP_NAME, ENABLE_WHITELISTING } = TEXT_FIELDS

export const TierBlock = ({ fields, ...props }) => {
  const onChangeWhitelisted = (value, input, index) => {
    // Clear whitelist
    if (props.tierStore) {
      props.tierStore.emptyWhitelist(index)
    }

    return input.onChange(value)
  }

  const getWhiteListingButtons = (name, input, index) => {
    const buttons = [
      {
        checked: input.value === 'yes',
        id: `${name}.enable_whitelisting_yes`,
        label: 'Yes',
        name: name,
        onChange: () => onChangeWhitelisted('yes', input, index),
        value: 'yes'
      },
      {
        checked: input.value === 'no',
        id: `${name}.enable_whitelisting_no`,
        label: 'No',
        name: name,
        onChange: () => onChangeWhitelisted('no', input, index),
        value: 'no'
      }
    ]

    return buttons
  }

  const getAllowModifiyingButtons = (name, input) => {
    const buttons = [
      {
        checked: input.value === 'on',
        id: `${name}.allow_modifying_on`,
        label: 'On',
        name: name,
        onChange: () => input.onChange('on'),
        value: 'on'
      },
      {
        checked: input.value === 'off',
        id: `${name}.allow_modifying_off`,
        label: 'Off',
        name: name,
        onChange: () => input.onChange('off'),
        value: 'off'
      }
    ]

    return buttons
  }

  return (
    <div className="sw-TierBlock">
      {fields.map((name, index) => (
        <div className="sw-BorderedBlock sw-BorderedBlock-TierBlocksWhitelistCapped" key={index}>
          <Field
            component={InputField2}
            description={DESCRIPTION.CROWDSALE_SETUP_NAME}
            extraClassName="sw-InputField2-TierSetupName"
            id={`${name}.tier`}
            label={CROWDSALE_SETUP_NAME}
            name={`${name}.tier`}
            type="text"
            validate={value => {
              const errors = composeValidators(isRequired(), isMaxLength()(30))(value)
              if (errors) return errors.shift()
            }}
          />
          <CrowdsaleStartTime
            disabled={index > 0}
            extraClassName="sw-InputField2-CrowdsaleStartTime"
            index={index}
            name={`${name}.startTime`}
          />
          <CrowdsaleEndTime
            extraClassName="sw-InputField2-CrowdsaleEndTime"
            index={index}
            name={`${name}.endTime`}
            side="right"
          />
          <CrowdsaleRate extraClassName="sw-InputField2-CrowdsaleRate" name={`${name}.rate`} />
          <Supply
            disabled={
              props.tierStore &&
              props.tierStore.tiers[index].whitelistEnabled === 'yes' &&
              (props.tierStore && props.tierStore.tiers[index].whitelist.length)
            }
            extraClassName="sw-InputField2-CrowdsaleSupply"
            name={`${name}.supply`}
            side="right"
          />
          <MinCap
            decimals={props.decimals}
            disabled={props.tierStore.tiers[index].whitelistEnabled === 'yes' ? true : false}
            extraClassName="sw-InputField2-MinCap"
            index={index}
            name={`${name}.minCap`}
          />
          <Field
            id={`${name}.whitelistEnabled`}
            name={`${name}.whitelistEnabled`}
            render={({ input }) => (
              <RadioButton
                buttons={getWhiteListingButtons(`${name}.whitelistEnabled`, input, index)}
                description={DESCRIPTION.ENABLE_WHITELIST}
                extraClassName={'sw-InputField2-WhitelistEnabled'}
                title={ENABLE_WHITELISTING}
              />
            )}
          />
          <Field
            id={`${name}.updatable`}
            name={`${name}.updatable`}
            render={({ input }) => (
              <RadioButton
                buttons={getAllowModifiyingButtons(`${name}.updatable`, input)}
                description={DESCRIPTION.ALLOW_MODIFYING}
                extraClassName={'sw-InputField2-AllowModifying'}
                title={ALLOW_MODIFYING}
              />
            )}
          />
          {props.tierStore.tiers[index].whitelistEnabled === 'yes' ? (
            <WhitelistInputBlock num={index} decimals={props.decimals} />
          ) : null}
        </div>
      ))}
    </div>
  )
}
