import React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import { InputField2 } from './InputField2'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import { composeValidators, isRequired, isMaxLength } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { CrowdsaleStartTime } from './CrowdsaleStartTime'
import { CrowdsaleEndTime } from './CrowdsaleEndTime'
import { CrowdsaleRate } from './CrowdsaleRate'
import { CrowdsaleSupply } from './CrowdsaleSupply'

const { ALLOW_MODIFYING, CROWDSALE_SETUP_NAME } = TEXT_FIELDS

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

              <Field
                name={`${name}.updatable`}
                render={({ input }) => (
                  <div className='right'>
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
              <CrowdsaleSupply
                name={`${name}.supply`}
                errorStyle={inputErrorStyle}
                side="right"
              />
              {
                /*
                  * TODO: REVIEW. I'm not sure about this approach.
                  * But it worked for me to keep the error messages properly updated for the minCap field.
                  */
              }
              <Field name="minCap" subscription={{}}>
                {({ input: { onChange } }) => (
                  <OnChange name={`${name}.supply`}>
                    {() => {
                      onChange(0)
                      onChange(props.minCap)
                    }}
                  </OnChange>
                )}
              </Field>
            </div>
          </div>
          {
            props.tierStore.tiers[0].whitelistEnabled === 'yes' ? (
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
