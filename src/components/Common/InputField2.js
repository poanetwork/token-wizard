import React from 'react'

export const InputField2 = ({ input, meta, side, label, type, description, disabled, errorStyle }) => {
  return (
    <div className={side}>
      <label htmlFor={input.name} className="label">{label}</label>
      <input
        className="input"
        type={type}
        disabled={disabled}
        id={input.name}
        {...input}
      />
      <p className="description">{description}</p>
      <p style={errorStyle}>{(!meta.pristine || meta.touched) && meta.error}</p>
    </div>
  )
}

