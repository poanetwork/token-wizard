import React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import { InputField2 } from './InputField2'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import {
  composeValidators,
  isDateInFuture,
  isDateLaterThan,
  isDatePreviousThan,
  isDateSameOrLaterThan,
  isDateSameOrPreviousThan,
  isInteger,
  isLessOrEqualThan,
  isPositive,
  isRequired,
  isMaxLength,
} from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

const {
  ALLOWMODIFYING,
  CROWDSALE_SETUP_NAME,
  START_TIME,
  END_TIME,
  RATE,
  SUPPLY
} = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const TierBlock = ({ fields, ...props }) => {
  const validateTierStartDate  = (index) => (value, values) => {
    const listOfValidations = [
      isRequired(),
      isDateInFuture(),
      isDatePreviousThan("Should be previous than same tier's End Time")(values.tiers[index].endTime),
    ]

    if (index > 0) {
      listOfValidations.push(isDateSameOrLaterThan("Should be same or later than previous tier's End Time")(values.tiers[index - 1].endTime))
    }

    return composeValidators(...listOfValidations)(value)
  }

  const validateTierEndDate  = (index) => (value, values) => {
    const listOfValidations = [
      isRequired(),
      isDateInFuture(),
      isDateLaterThan("Should be later than same tier's Start Time")(values.tiers[index].startTime),
    ]

    if (index < values.tiers.length - 1) {
      listOfValidations.push(isDateSameOrPreviousThan("Should be same or previous than next tier's Start Time")(values.tiers[index + 1].startTime))
    }

    return composeValidators(...listOfValidations)(value)
  }

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
                    <label className="label">{ALLOWMODIFYING}</label>
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
              <Field
                name={`${name}.startTime`}
                component={InputField2}
                validate={validateTierStartDate(index)}
                errorStyle={inputErrorStyle}
                type="datetime-local"
                side="left"
                label={START_TIME}
                description={DESCRIPTION.START_TIME}
              />
              <Field
                name={`${name}.endTime`}
                component={InputField2}
                validate={validateTierEndDate(index)}
                errorStyle={inputErrorStyle}
                type="datetime-local"
                side="right"
                label={END_TIME}
                description={DESCRIPTION.END_TIME}
              />
            </div>

            <div className="input-block-container">
              <Field
                name={`${name}.rate`}
                component={InputField2}
                validate={composeValidators(
                  isPositive(),
                  isInteger(),
                  isLessOrEqualThan('Should not be greater than 1 quintillion (10^18)')('1e18')
                )}
                errorStyle={inputErrorStyle}
                type="text"
                side="left"
                label={RATE}
                description={DESCRIPTION.RATE}
              />
              <Field
                name={`${name}.supply`}
                component={InputField2}
                validate={isPositive()}
                errorStyle={inputErrorStyle}
                type="text"
                side="right"
                label={SUPPLY}
                description={DESCRIPTION.SUPPLY}
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
