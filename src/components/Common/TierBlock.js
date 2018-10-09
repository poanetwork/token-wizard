import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import { composeValidators, isRequired, isMaxLength } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { CrowdsaleStartTime } from './CrowdsaleStartTime'
import { CrowdsaleEndTime } from './CrowdsaleEndTime'
import { CrowdsaleRate } from './CrowdsaleRate'
import { Supply } from './Supply'
import { MinCap } from './MinCap'
import { FormControlTitle } from '../Common/FormControlTitle'

const { ALLOW_MODIFYING, CROWDSALE_SETUP_NAME, ENABLE_WHITELISTING } = TEXT_FIELDS

export const TierBlock = ({ fields, ...props }) => {
  const onChangeWhitelisted = (value, input, index) => {
    // Clear whitelist
    if (props.tierStore) {
      props.tierStore.emptyWhitelist(index)
    }

    return input.onChange(value)
  }

  const tierBlockSelectButtons = (title, description, buttons, extraClassName = '') => {
    return (
      <div className={`sw-TierBlock_SelectButtons ${extraClassName ? extraClassName : ''}`}>
        <FormControlTitle title={title} description={description} />
        <div className="sw-TierBlock_SelectButtonsContainer">
          {buttons.map((item, index) => (
            <label className="sw-TierBlock_SelectButtonsLabel" key={index}>
              <input
                checked={item.checked}
                className="sw-TierBlock_SelectButtonsInput"
                id={item.id}
                name={item.name}
                onChange={item.onChange}
                type="radio"
                value={item.value}
              />
              <span className="sw-TierBlock_SelectButtonsButton">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
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
        <div className="sw-BorderedBlock sw-BorderedBlock-6Rows2Columns" key={index}>
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
            render={({ input }) =>
              tierBlockSelectButtons(
                ENABLE_WHITELISTING,
                DESCRIPTION.ENABLE_WHITELIST,
                getWhiteListingButtons(`${name}.whitelistEnabled`, input, index),
                'sw-InputField2-WhitelistEnabled'
              )
            }
          />
          <Field
            id={`${name}.updatable`}
            name={`${name}.updatable`}
            render={({ input }) =>
              tierBlockSelectButtons(
                ALLOW_MODIFYING,
                DESCRIPTION.ALLOW_MODIFYING,
                getAllowModifiyingButtons(`${name}.updatable`, input),
                'sw-InputField2-AllowModifying'
              )
            }
          />
          {props.tierStore.tiers[index].whitelistEnabled === 'yes' ? (
            <WhitelistInputBlock num={index} decimals={props.decimals} />
          ) : null}
        </div>
      ))}
    </div>
  )
}
