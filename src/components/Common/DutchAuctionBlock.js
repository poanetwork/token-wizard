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
import { RadioButton } from '../Common/RadioButton'

const { START_TIME, END_TIME, MIN_RATE, MAX_RATE, SUPPLY_SHORT, ENABLE_WHITELISTING } = TEXT_FIELDS

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
      // Clear whitelist
      if (tierStore) {
        tierStore.emptyWhitelist(index)
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

    return (
      <div className="sw-DutchAuctionBlock">
        {fields.map((name, index) => (
          <div key={index}>
            <Field
              component={InputField2}
              description={DESCRIPTION.START_TIME}
              extraClassName="sw-InputField2-DutchAuctionStartTime"
              label={START_TIME}
              name={`${name}.startTime`}
              type="datetime-local"
              validate={validateTierStartDate(index)}
            />
            <Field
              component={InputField2}
              description={DESCRIPTION.END_TIME}
              extraClassName="sw-InputField2-DutchAuctionEndTime"
              label={END_TIME}
              name={`${name}.endTime`}
              type="datetime-local"
              validate={validateTierEndDate(index)}
            />
            <Field
              component={InputField2}
              description={DESCRIPTION.RATE}
              extraClassName="sw-InputField2-DutchAuctionMinRate"
              label={MIN_RATE}
              min="0"
              name={`${name}.minRate`}
              placeholder="Enter here"
              type="number"
              validate={(value, allValues) => {
                const errors = composeValidators(
                  isPositive(),
                  isInteger(),
                  isLessThan('Should be less than Max Rate')(allValues.tiers[index].maxRate),
                  isLessOrEqualThan('Should be less than or equal to 1 quintillion (10^18)')('1e18')
                )(value)

                if (errors) return errors.shift()
              }}
            />
            <Field
              component={InputField2}
              description={DESCRIPTION.RATE}
              extraClassName="sw-InputField2-DutchAuctionMaxRate"
              label={MAX_RATE}
              min="0"
              name={`${name}.maxRate`}
              placeholder="Enter here"
              type="number"
              validate={(value, allValues) => {
                const errors = composeValidators(
                  isPositive(),
                  isInteger(),
                  isGreaterThan('Should be greater than Min Rate')(allValues.tiers[index].minRate),
                  isLessOrEqualThan('Should less than or equal to 1 quintillion (10^18)')('1e18')
                )(value)

                if (errors) return errors.shift()
              }}
            />
            <Field
              component={InputField2}
              description={DESCRIPTION.SUPPLY}
              disabled={
                tierStore &&
                tierStore.tiers[index].whitelistEnabled === 'yes' &&
                (tierStore && tierStore.tiers[index].whitelist.length)
              }
              extraClassName="sw-InputField2-DutchAuctionSupply"
              label={SUPPLY_SHORT}
              max={tokenStore.supply}
              min="0"
              name={`${name}.supply`}
              parse={acceptPositiveIntegerOnly}
              placeholder="Enter here"
              step="1"
              type="number"
              validate={value => {
                const { supply } = tokenStore
                const errors = composeValidators(
                  isPositive(),
                  isLessOrEqualThan(`Should not be greater than Token's total supply: ${supply}`)(supply)
                )(value)
                if (errors) return errors.shift()
              }}
            />
            <MinCap
              decimals={props.decimals}
              disabled={tierStore.tiers[index].whitelistEnabled === 'yes' ? true : false}
              extraClassName="sw-InputField2-DutchAuctionMinCap"
              index={index}
              max={tierStore.tiers[index].supply}
              min="0"
              name={`${name}.minCap`}
              type="number"
            />
            <Field
              name={`${name}.whitelistEnabled`}
              render={({ input }) => (
                <RadioButton
                  buttons={getWhiteListingButtons(`${name}.whitelistEnabled`, input, index)}
                  description={DESCRIPTION.ENABLE_WHITELIST}
                  extraClassName="sw-RadioButton-DutchAuctionWhiteList"
                  title={ENABLE_WHITELISTING}
                />
              )}
            />
            {tierStore.tiers[index].whitelistEnabled === 'yes' ? (
              <WhitelistInputBlock num={index} decimals={props.decimals} />
            ) : null}
          </div>
        ))}
      </div>
    )
  })
)
