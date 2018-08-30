import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Home, Manage, stepOne, stepTwo, stepThree, stepFour, Crowdsale, Contribute, Stats } from './components/index'
import NoWeb3 from './components/Common/NoWeb3'
import IncompleteDeploy from './components/IncompleteDeploy'
import { getQueryVariable } from './utils/utils'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { TOAST } from './utils/constants'
import { toast } from './utils/utils'
import { Web3Provider } from './react-web3'

// import './assets/stylesheets/application.css'

@inject('deploymentStore')
@observer
class App extends Component {
  componentWillMount() {
    // temporary code to switch ui styling versions
    // obviously delete this when we get the v2.0 up and running
    const uiversion = getQueryVariable('uiversion')

    if (uiversion === '2') {
      require('./assets/stylesheets/styles.css')
    } else if (uiversion === '1') {
      require('./assets/stylesheets/application_styles.css')
    } else {
      require('./assets/stylesheets/application_styles.css')
      require('./assets/stylesheets/styles.css')
    }
  }
  render() {
    const { deploymentStore } = this.props
    var crowdsaleAddr = getQueryVariable('addr')

    return (
      <Router>
        <div>
          {/* <Header /> */}

          <Switch>
            <Route exact path="/crowdsale" component={Crowdsale} />
            <Route exact path="/contribute" component={Contribute} />
            <Route exact path="/stats" component={Stats} />
            <Route>
              <Web3Provider onChangeAccount={deploymentStore.handleAccountChange} web3UnavailableScreen={NoWeb3}>
                <Switch>
                  {/* The route to /4 must be first for the incomplete deploy redirect to work */}
                  <Route path="/4" component={stepFour} />

                  {deploymentStore.deployInProgress ? (
                    <IncompleteDeploy />
                  ) : (
                    <Switch>
                      <Route exact path="/" component={crowdsaleAddr ? Crowdsale : Home} />
                      <Route exact path="/manage/:crowdsalePointer" component={Manage} />
                      <Route path="/1" component={stepOne} />
                      <Route path="/2" component={stepTwo} />
                      <Route path="/3" component={stepThree} />
                    </Switch>
                  )}
                </Switch>
              </Web3Provider>
            </Route>
          </Switch>

          {/* <Footer /> */}
          <AlertContainer ref={a => (toast.msg = a)} {...TOAST.DEFAULT_OPTIONS} />
        </div>
      </Router>
    )
  }
}

export default App
