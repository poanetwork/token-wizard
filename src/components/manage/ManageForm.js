import React from 'react'
import { Link } from 'react-router-dom'
import { FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { ManageTierBlock } from './ManageTierBlock'
import { ManageDutchAuctionBlock } from './ManageDutchAuctionBlock'
import classNames from 'classnames'

export const ManageForm = ({
  handleSubmit,
  invalid,
  pristine,
  handleChange,
  canSave,
  displaySave,
  ...props,
}) => {
  function getManageBlock (fields) {
    let manageBlock = null
    if (props.crowdsaleStore.isMintedCappedCrowdsale)
      manageBlock = <ManageTierBlock
        fields={fields}
        {...props}
      />
    else if (props.crowdsaleStore.isDutchAuction) {
      manageBlock = <ManageDutchAuctionBlock
        fields={fields}
        {...props}
      />
    }
    return manageBlock;
  }
  const saveButton = (
    <Link to='#' onClick={handleSubmit}>
      <span className={classNames(
        'no_arrow',
        'button',
        'button_fill',
        {
          'button_disabled': (pristine || invalid) && !canSave
        }
      )}>Save</span>
    </Link>
  )

  return (
    <form onSubmit={handleSubmit}>
      <FieldArray name="tiers">
        {({ fields }) => (
          getManageBlock(fields)
        )}
      </FieldArray>
      <FormSpy subscription={{ values: true }} onChange={handleChange}/>

      <div className="steps">
        <div className="button-container">
        { displaySave? saveButton : null }
        </div>
      </div>

    </form>
  )
}
