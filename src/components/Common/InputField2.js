import React from 'react'

export const InputField2 = ({ input, meta, side, label, type, description, disabled, errorStyle }) => {
  const errors = [].concat(meta.error)

  return (
    <div className={side}>
      <label htmlFor={input.name} className="label">{label}</label>
      <input
        autoComplete="off"
        className="input"
        type={type}
        disabled={disabled}
        id={input.name}
        {...input}
      />
      <p className="description">{description}</p>
      {errors.map((error, index)=> (
        <p key={index} style={errorStyle}>{(!meta.pristine || meta.touched) && error}</p>
      ))}
    </div>
  )
}

