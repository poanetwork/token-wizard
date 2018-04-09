import React from 'react'
import { Field } from 'react-final-form'

const defaultErrorStyles = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const Error = ({ name, errorStyle }) => (
  <Field
    name={name}
    subscription={{ touched: true, pristine: true, error: true }}
    render={({ meta: { touched, pristine, error } }) => {
      const errors = [].concat(error)

      return (
        <span>
        {
          errors.length
            ? errors.map((error, index) => (
              <p className="error" key={index} style={errorStyle || defaultErrorStyles}>{(!pristine || touched) && error}</p>
            ))
            : null
        }
        </span>
      )
    }}
  />
)
