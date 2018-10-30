import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {
  Home,
  Manage,
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  Crowdsale,
  Contribute,
  Stats,
  Crowdsales
} from './components/index'
import NoWeb3 from './components/Common/NoWeb3'
import IncompleteDeploy from './components/IncompleteDeploy'
import { getAddrFromQuery, toast } from './utils/utils'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { TOAST } from './utils/constants'
import { Web3Provider } from './react-web3'
import { getQueryVariable } from './utils/utils'

// import './assets/stylesheets/application.css'

@inject('deploymentStore')
@observer
class App extends Component {
  componentWillMount() {
    // temporary code to switch ui styling versions
    // obviously delete this when we get the v2.0 up and running
    const uiversion = getQueryVariable('uiversion')

    if (uiversion === '12') {
      require('./assets/stylesheets/application_styles.css')
      require('./assets/stylesheets/styles.css')
    } else if (uiversion === '1') {
      require('./assets/stylesheets/application_styles.css')
    } else if (uiversion === '2') {
      require('./assets/stylesheets/styles.css')
    } else {
      require('./assets/stylesheets/styles.css')
    }
  }
  render() {
    const { deploymentStore } = this.props
    let crowdsaleAddr = getAddrFromQuery()

    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={crowdsaleAddr ? Crowdsale : Home} />
            <Web3Provider onChangeAccount={deploymentStore.handleAccountChange} web3UnavailableScreen={NoWeb3}>
              <Switch>
                <Route path="/1" component={StepOne} />
                <Route exact path="/crowdsale" component={Crowdsale} />
                <Route exact path="/contribute" component={Contribute} />
                <Route exact path="/stats" component={Stats} />
                <Route exact path="/crowdsales" component={Crowdsales} />
                <Route>
                  <Switch>
                    {/* The route to /4 must be first for the incomplete deploy redirect to work */}
                    <Route path="/4" component={StepFour} />

                    {deploymentStore.deployInProgress ? (
                      <IncompleteDeploy />
                    ) : (
                      <Switch>
                        <Route exact path="/manage/:crowdsalePointer" component={Manage} />
                        <Route path="/2" component={StepTwo} />
                        <Route path="/3" component={StepThree} />
                      </Switch>
                    )}
                  </Switch>
                </Route>
              </Switch>
            </Web3Provider>
          </Switch>
          <AlertContainer ref={a => (toast.msg = a)} {...TOAST.DEFAULT_OPTIONS} />
        </div>
      </Router>
    )
  }
}

export default App
