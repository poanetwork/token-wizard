import React, { Component } from 'react'
import { inject, observer } from 'mobx-react/index'
import { Route, Redirect } from 'react-router-dom'

@inject('deploymentStore')
@observer
export class ProtectedRoute extends Component {
  render() {
    const { component: Component, deploymentStore, ...props } = this.props
    return (
      <Route
        {...props}
        render={props => (!deploymentStore.deployInProgress ? <Component {...props} /> : <Redirect to="/" />)}
      />
    )
  }
}
