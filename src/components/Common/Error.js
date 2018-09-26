import React from 'react'
import { Field } from 'react-final-form'

export const Error = ({ name }) => (
  <Field
    name={name}
    subscription={{ touched: true, pristine: true, error: true }}
    render={({ meta: { touched, pristine, error } }) => {
      const errors = [].concat(error)
      const errorList = errors.map((error, index) => (
        <div className="sw-Error" key={index}>
          {error}
        </div>
      ))

      return (!pristine || touched) && error ? <div>{errorList}</div> : null
    }}
  />
)
