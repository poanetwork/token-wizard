import React from 'react'
import { Field } from 'react-final-form'

export const Error = ({ name, errorStyle }) => (
  <Field
    name={name}
    subscription={{ touched: true, pristine: true, error: true }}
    render={({ meta: { touched, pristine, error } }) => {
      const errors = [].concat(error)

      return (
        <div>
          {errors.length
            ? errors.map((error, index) => (
                <div className="sw-Error" key={index}>
                  {(!pristine || touched) && error}
                </div>
              ))
            : null}
        </div>
      )
    }}
  />
)
