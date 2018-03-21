import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { FormSpy } from 'react-final-form'
import { TokenName } from '../Common/TokenName'
import { TokenTicker } from '../Common/TokenTicker'
import { TokenDecimals } from '../Common/TokenDecimals'

const errorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '10px',
}

@observer
export class StepTwoForm extends Component {
  render () {
    const { id, handleSubmit, disableDecimals, updateTokenStore } = this.props

    return (
      <form id={id} onSubmit={handleSubmit}>
        <div className="hidden">
          <TokenName errorStyle={errorStyle}/>
          <TokenTicker errorStyle={errorStyle}/>
          <TokenDecimals disabled={disableDecimals} errorStyle={errorStyle}/>
        </div>
        <FormSpy
          onChange={({ values }) => {
            updateTokenStore('name', values.name)
            updateTokenStore('ticker', values.ticker)
            updateTokenStore('decimals', values.decimals)
          }}
        />
      </form>
    )
  }
}

