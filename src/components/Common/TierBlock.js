import React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import { InputField2 } from './InputField2'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import {
  composeValidators,
  isRequired,
  isMaxLength,
  isDecimalPlacesNotGreaterThan,
  isNonNegative,
} from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { CrowdsaleStartTime } from './CrowdsaleStartTime'
import { CrowdsaleEndTime } from './CrowdsaleEndTime'
import { CrowdsaleRate } from './CrowdsaleRate'
import { Supply } from './Supply'
import { GlobalMinCap } from './GlobalMinCap'

const { ALLOW_MODIFYING, CROWDSALE_SETUP_NAME, ENABLE_WHITELISTING, MIN_CAP } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const TierBlock = ({ fields, ...props }) => {
  return (
    <div>
      {fields.map((name, index) => (
        <div style={{ marginTop: '40px' }} className='steps-content container' key={index}>
          <div className="hidden">
            <div className="input-block-container">
              <Field
                name={`${name}.tier`}
                validate={(value) => {
                  const errors = composeValidators(
                    isRequired(),
                    isMaxLength()(30)
                  )(value)

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
                name={`${name}.updatable`}
                render={({ input }) => (
                  <div className='left'>
                    <label className="label">{ALLOW_MODIFYING}</label>
                    <div className='radios-inline'>
                      <label className='radio-inline'>
                        <input
                          type='radio'
                          checked={input.value === 'on'}
                          onChange={() => input.onChange('on')}
                          value='on'
                        />
                        <span className='title'>on</span>
                      </label>
                      <label className='radio-inline'>
                        <input
                          type='radio'
                          checked={input.value === 'off'}
                          value='off'
                          onChange={() => input.onChange('off')}
                        />
                        <span className='title'>off</span>
                      </label>
                    </div>
                    <p className='description'>{DESCRIPTION.ALLOW_MODIFYING}</p>
                  </div>
                )}
              />

              <Field
                name={`${name}.whitelistEnabled`}
                render={({ input }) => (
                  <div className='right'>
                    <label className="label">{ENABLE_WHITELISTING}</label>
                    <div className='radios-inline'>
                      <label className='radio-inline'>
                        <input
                          type='radio'
                          checked={input.value === 'yes'}
                          value='yes'
                          onChange={() => input.onChange('yes')}
                        />
                        <span className='title'>yes</span>
                      </label>
                      <label className='radio-inline'>
                        <input
                          type='radio'
                          checked={input.value === 'no'}
                          value='no'
                          onChange={() => input.onChange('no')}
                        />
                        <span className='title'>no</span>
                      </label>
                    </div>
                    <p className='description'>{DESCRIPTION.ENABLE_WHITELIST}</p>
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
              <CrowdsaleEndTime
                name={`${name}.endTime`}
                index={index}
                side="right"
                errorStyle={inputErrorStyle}
              />
            </div>

            <div className="input-block-container">
              <CrowdsaleRate
                name={`${name}.rate`}
                errorStyle={inputErrorStyle}
                side="left"
              />
              <Supply
                name={`${name}.supply`}
                errorStyle={inputErrorStyle}
                side="right"
              />
            </div>
            <div className="input-block-container">
              <GlobalMinCap
                name={`${name}.minCap`}
                errorStyle={inputErrorStyle}
                decimals={props.decimals}
                tierStore={props.tierStore}
                disabled={props.tierStore ? props.tierStore.tiers[index].whitelistEnabled === 'yes' : true}
                side="left"
              />
              {
                /*
                  * TODO: REVIEW. I'm not sure about this approach.
                  * But it worked for me to keep the error messages properly updated for the minCap field.
                  */
              }
              <Field name={`${name}.minCap`} subscription={{}}>
                {({ input: { onChange } }) => (
                  <OnChange name={`${name}.supply`}>
                    {() => {
                      onChange(0)
                      onChange(props.tierStore.tiers[index].minCap)
                    }}
                  </OnChange>
                )}
              </Field>
            </div>
          </div>
          {
            props.tierStore.tiers[index].whitelistEnabled === 'yes' ? (
              <div>
                <div className="section-title">
                  <p className="title">Whitelist</p>
                </div>
                <WhitelistInputBlock num={index} decimals={props.decimals} />
              </div>
            ) : null
          }
        </div>
      ))}
    </div>
  )
}
