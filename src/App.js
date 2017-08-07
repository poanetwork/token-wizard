import React, {Component} from 'react';
import './assets/stylesheets/application.css';
import { Header, Footer, Home, stepOne, stepTwo, stepThree, stepFour, stepFive, Invest } from './components/index'
import { getQueryVariable } from './components/utils'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends Component {
  render() {
    var crowdsaleAddr = getQueryVariable("addr");
    return (
      <Router>
        <div>
          <Header/>
            <Route exact path="/" component={crowdsaleAddr?stepFive:Home}/>
            <Route path="/1" component={stepOne}/>
            <Route path="/2" component={stepTwo}/>
            <Route path="/3" component={stepThree}/>
            <Route path="/4" component={stepFour}/>
            <Route path="/crowdsale" component={stepFive}/>
            <Route path="/invest" component={Invest}/>
          <Footer/>
        </div>
      </Router>
    )
  }
}

export default App;
