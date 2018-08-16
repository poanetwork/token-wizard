import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import { MinCap } from './MinCap'
import {
  composeValidators,
  isDateInFuture,
  isDateLaterThan,
  isDatePreviousThan,
  isDateSameOrLaterThan,
  isDateSameOrPreviousThan,
  isInteger,
  isLessThan,
  isGreaterThan,
  isLessOrEqualThan,
  isPositive,
  isRequired
} from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { acceptPositiveIntegerOnly } from '../../utils/utils'

const { START_TIME, END_TIME, MIN_RATE, MAX_RATE, SUPPLY_SHORT, ENABLE_WHITELISTING } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px'
}

export const DutchAuctionBlock = inject('tierStore', 'tokenStore')(
  observer(({ tierStore, tokenStore, fields, ...props }) => {
    const validateTierStartDate = index => (value, values) => {
      const listOfValidations = [
        isRequired(),
        isDateInFuture(),
        isDatePreviousThan("Should be previous than same tier's End Time")(values.tiers[index].endTime)
      ]

      if (index > 0) {
        listOfValidations.push(
          isDateSameOrLaterThan("Should be same or later than previous tier's End Time")(
            values.tiers[index - 1].endTime
          )
        )
      }

      return composeValidators(...listOfValidations)(value)
    }

    const validateTierEndDate = index => (value, values) => {
      const listOfValidations = [
        isRequired(),
        isDateInFuture(),
        isDateLaterThan("Should be later than same tier's Start Time")(values.tiers[index].startTime)
      ]

      if (index < values.tiers.length - 1) {
        listOfValidations.push(
          isDateSameOrPreviousThan("Should be same or previous than next tier's Start Time")(
            values.tiers[index + 1].startTime
          )
        )
      }

      return composeValidators(...listOfValidations)(value)
    }

    const onChangeWhitelisted = (value, input, index) => {
      //Clear whitelist
      if (tierStore) {
        tierStore.emptyWhitelist(index)
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
                  name={`${name}.minRate`}
                  component={InputField2}
                  validate={(value, allValues) => {
                    const errors = composeValidators(
                      isPositive(),
                      isInteger(),
                      isLessThan('Should be less than Max Rate')(allValues.tiers[index].maxRate),
                      isLessOrEqualThan('Should be less than or equal to 1 quintillion (10^18)')('1e18')
                    )(value)

                    if (errors) return errors.shift()
                  }}
                  errorStyle={inputErrorStyle}
                  type="text"
                  side="left"
                  label={MIN_RATE}
                  description={DESCRIPTION.RATE}
                />
                <Field
                  name={`${name}.maxRate`}
                  component={InputField2}
                  validate={(value, allValues) => {
                    const errors = composeValidators(
                      isPositive(),
                      isInteger(),
                      isGreaterThan('Should be greater than Min Rate')(allValues.tiers[index].minRate),
                      isLessOrEqualThan('Should less than or equal to 1 quintillion (10^18)')('1e18')
                    )(value)

                    if (errors) return errors.shift()
                  }}
                  errorStyle={inputErrorStyle}
                  type="text"
                  side="right"
                  label={MAX_RATE}
                  description={DESCRIPTION.RATE}
                />
                <Field
                  name={`${name}.supply`}
                  component={InputField2}
                  validate={value => {
                    const { supply } = tokenStore
                    const errors = composeValidators(
                      isPositive(),
                      isLessOrEqualThan(`Should not be greater than Token's total supply: ${supply}`)(supply)
                    )(value)
                    if (errors) return errors.shift()
                  }}
                  parse={acceptPositiveIntegerOnly}
                  errorStyle={inputErrorStyle}
                  type="text"
                  side="left"
                  label={SUPPLY_SHORT}
                  description={DESCRIPTION.SUPPLY}
                  disabled={
                    (tierStore && tierStore.tiers[index].whitelistEnabled === 'yes') ||
                    (tierStore && tierStore.tiers[index].whitelist.length)
                  }
                />
                <Field
                  name={`${name}.whitelistEnabled`}
                  render={({ input }) => (
                    <div className="right">
                      <label className="label">{ENABLE_WHITELISTING}</label>
                      <div className="radios-inline">
                        <label className="radio-inline">
                          <input
                            type="radio"
                            checked={input.value === 'yes'}
                            value="yes"
                            onChange={() => onChangeWhitelisted('yes', input, index)}
                          />
                          <span className="title">yes</span>
                        </label>
                        <label className="radio-inline">
                          <input
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
            </div>
            <div className="input-block-container">
              <MinCap
                name={`${name}.minCap`}
                errorStyle={inputErrorStyle}
                decimals={props.decimals}
                index={index}
                disabled={tierStore ? tierStore.tiers[index].whitelistEnabled === 'yes' : true}
                side="left"
              />
            </div>
            {tierStore.tiers[index].whitelistEnabled === 'yes' ? (
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
  })
)
