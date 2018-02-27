import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import './assets/stylesheets/application.css';
import { Header, Footer, Home, Manage, stepOne, stepTwo, stepThree, stepFour, Crowdsale, Invest } from './components/index'
import IncompleteDeploy from './components/IncompleteDeploy'
import { getQueryVariable } from './utils/utils'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import AlertContainer from 'react-alert'
import { TOAST } from './utils/constants'
import { toast } from './utils/utils'

@inject('deploymentStore')
@observer
class App extends Component {
  render() {
    const { deploymentStore } = this.props
    var crowdsaleAddr = getQueryVariable("addr");

    return (
      <Router>
        <div>
          <Header/>

          <Switch>
            {/* The route to /4 must be first for the incomplete deploy redirect to work */}
            <Route path="/4" component={stepFour}/>

            {
              deploymentStore.deploymentStep !== null ? (
                <IncompleteDeploy />
              ) : (
                <Switch>
                  <Route exact path="/" component={crowdsaleAddr ? Crowdsale : Home}/>
                  <Route exact path="/crowdsale" component={Crowdsale}/>
                  <Route exact path="/invest" component={Invest}/>
                  <Route exact path="/manage/:crowdsaleAddress" component={Manage}/>
                  <Route path="/1" component={stepOne}/>
                  <Route path="/2" component={stepTwo}/>
                  <Route path="/3" component={stepThree}/>
                </Switch>
              )
            }
          </Switch>

          <Footer/>
          <AlertContainer ref={a => toast.msg = a} {...TOAST.DEFAULT_OPTIONS} />
        </div>
      </Router>
    )
  }
}

export default App;
