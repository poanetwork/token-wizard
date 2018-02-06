import React, {Component} from 'react'

export class PreventRefresh extends Component {
  onUnload = (e) => {
    e.returnValue = "You'll lose current deployment, are you sure?"
  }

  componentDidMount () {
    window.addEventListener('beforeunload', this.onUnload)
  }

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  render () {
    return <div />
  }
}
