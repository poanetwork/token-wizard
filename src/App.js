import React, { Component } from 'react';
import './assets/stylesheets/application.css';
import { Header, Footer, Home, stepOne, stepTwo, stepThree, stepFour, stepFive, Invest } from './components/index'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
const startEvent = new Date(2017, 6, 19)
const endEvent = new Date(2017, 6, 24)

const App = () => (
  <Router>
    <div>
      <Header/>
        <Route exact path="/" component={Home}/>
        <Route path="/1" component={stepOne}/>
        <Route path="/2" component={stepTwo}/>
        <Route path="/3" component={stepThree}/>
        <Route path="/4" component={stepFour}/>
        <Route path="/5" component={stepFive}/>
        <Route path='/invest' component={() => <Invest startEvent={startEvent} endEvent={endEvent}/>} />
      <Footer/>
    </div>
  </Router>
)

export default App;
