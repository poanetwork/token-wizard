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

const { ALLOW_MODIFYING, CROWDSALE_SETUP_NAME, ENABLE_WHITELISTING } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px'
}

export const TierBlock = ({ fields, ...props }) => {
  const onChangeWhitelisted = (value, input, index) => {
    //Clear whitelist
    if (props.tierStore) {
      props.tierStore.emptyWhitelist(index)
    }
    return input.onChange(value)
  }

  return (
    <div>
      {fields.map((name, index) => (
        <div style={{ marginTop: '40px' }} className="steps-content container" key={index}>
          <div className="hidden">
            <div className="input-block-container">
              <Field
                id={`${name}.tier`}
                name={`${name}.tier`}
                validate={value => {
                  const errors = composeValidators(isRequired(), isMaxLength()(30))(value)

                  if (errors) return errors.shift()
                }}
                errorStyle={inputErrorStyle}
                component={InputField2}
                type="text"
                side="left"
                label={CROWDSALE_SETUP_NAME}
                description={DESCRIPTION.CROWDSALE_SETUP_NAME}
              />
            </div>

            <div className="input-block-container">
              <Field
                id={`${name}.updatable`}
                name={`${name}.updatable`}
                render={({ input }) => (
                  <div className="left">
                    <label className="label">{ALLOW_MODIFYING}</label>
                    <div className="radios-inline">
                      <label className="radio-inline">
                        <input
                          id={`${name}.allow_modifying_on`}
                          type="radio"
                          checked={input.value === 'on'}
                          onChange={() => input.onChange('on')}
                          value="on"
                        />
                        <span className="title">on</span>
                      </label>
                      <label className="radio-inline">
                        <input
                          id={`${name}.allow_modifying_off`}
                          type="radio"
                          checked={input.value === 'off'}
                          value="off"
                          onChange={() => input.onChange('off')}
                        />
                        <span className="title">off</span>
                      </label>
                    </div>
                    <p className="description">{DESCRIPTION.ALLOW_MODIFYING}</p>
                  </div>
                )}
              />

              <Field
                name={`${name}.whitelistEnabled`}
                render={({ input }) => (
                  <div className="right">
                    <label className="label">{ENABLE_WHITELISTING}</label>
                    <div className="radios-inline">
                      <label className="radio-inline">
                        <input
                          id={`${name}.enable_whitelisting_yes`}
                          type="radio"
                          checked={input.value === 'yes'}
                          value="yes"
                          onChange={() => onChangeWhitelisted('yes', input, index)}
                        />
                        <span className="title">yes</span>
                      </label>
                      <label className="radio-inline">
                        <input
                          id={`${name}.enable_whitelisting_no`}
                          type="radio"
                          checked={input.value === 'no'}
                          value="no"
                          onChange={() => onChangeWhitelisted('no', input, index)}
                        />
                        <span className="title">no</span>
                      </label>
                    </div>
                    <p className="description">{DESCRIPTION.ENABLE_WHITELIST}</p>
                  </div>
                )}
              />
            </div>

            <div className="input-block-container">
              <CrowdsaleStartTime
                name={`${name}.startTime`}
                index={index}
                disabled={index > 0}
                side="left"
                errorStyle={inputErrorStyle}
              />
              <CrowdsaleEndTime name={`${name}.endTime`} index={index} side="right" errorStyle={inputErrorStyle} />
            </div>

            <div className="input-block-container">
              <CrowdsaleRate name={`${name}.rate`} errorStyle={inputErrorStyle} side="left" />
              <Supply
                name={`${name}.supply`}
                errorStyle={inputErrorStyle}
                side="right"
                disabled={
                  (props.tierStore && props.tierStore.tiers[index].whitelistEnabled === 'yes') ||
                  (props.tierStore && props.tierStore.tiers[index].whitelist.length)
                }
              />
            </div>
            <div className="input-block-container">
              <MinCap
                name={`${name}.minCap`}
                errorStyle={inputErrorStyle}
                decimals={props.decimals}
                index={index}
                disabled={props.tierStore ? props.tierStore.tiers[index].whitelistEnabled === 'yes' : true}
                side="left"
              />
            </div>
          </div>
          {props.tierStore.tiers[index].whitelistEnabled === 'yes' ? (
            <div>
              <div className="section-title">
                <p className="title">Whitelist</p>
              </div>
              <WhitelistInputBlock num={index} decimals={props.decimals} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
