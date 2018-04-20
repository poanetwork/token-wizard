import React from 'react'
import { Link } from 'react-router-dom'
import { FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { ManageTierBlock } from './ManageTierBlock'
import classNames from 'classnames'

export const ManageForm = ({
  handleSubmit,
  invalid,
  pristine,
  handleChange,
  canSave,
  ...props,
}) => (
  <form onSubmit={handleSubmit}>
    <FieldArray name="tiers">
      {({ fields }) => (
        <ManageTierBlock
          fields={fields}
          {...props}
        />
      )}
    </FieldArray>
    <FormSpy subscription={{ values: true }} onChange={handleChange}/>

    <div className="steps">
      <div className="button-container">
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
      </div>
    </div>

  </form>
)
