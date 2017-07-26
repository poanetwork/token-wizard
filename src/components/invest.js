import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'

export class Invest extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      seconds: (props.endEvent - props.startEvent)/2 ,
    }
  }

  componentWillMount () {
    const timeInterval = setInterval(() => this.setState({ seconds: this.state.seconds - 1}), 1000)
    this.setState({ timeInterval })
  }

  renderPieTracker () {
    return <div style={{marginLeft: '-20px', marginTop: '-20px'}}>
      <ReactCountdownClock 
        seconds={this.state.seconds}
        color="#733EAB"
        alpha={0.9}
        size={270}
        />
    </div>
  }

  shouldStopCountDown () {
    const { seconds } = this.state
    if(seconds < 0) {
      this.state({ seconds: 0 })
      clearInterval(this.state.timeInterval)
    }
  }

  getTimeStamps (seconds) {
    this.shouldStopCountDown()
    var days        = Math.floor(seconds/24/60/60);
    var hoursLeft   = Math.floor((seconds) - (days*86400));
    var hours       = Math.floor(hoursLeft/3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
    var minutes     = Math.floor(minutesLeft/60); 
    return { days, hours, minutes}
  }

  render(state){
    const { seconds } = this.state
    const { days, hours, minutes } = this.getTimeStamps(seconds)
    return <div className="invest container">
      <div className="invest-table">
        <div className="invest-table-cell invest-table-cell_left">
          <div className="timer-container">
            <div className="timer">
              <div className="timer-inner">
                <div className="timer-i">
                  <div className="timer-count">{days}</div>
                  <div className="timer-interval">Days</div>
                </div>
                <div className="timer-i">
                  <div className="timer-count">{hours}</div>
                  <div className="timer-interval">Hours</div>
                </div>
                <div className="timer-i">
                  <div className="timer-count">{minutes}</div>
                  <div className="timer-interval">Mins</div>
                </div>
              </div>
            </div>
            {this.renderPieTracker()}
          </div>
          <div className="hashes">
            <div className="hashes-i">
              <p className="hashes-title">0x00579ab5e7d886bc7caea16085307edaa563a</p>
              <p className="hashes-description">Current Account</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">0x2b399e68fe95f8bc1a1a985634099a37709b3d4c</p>
              <p className="hashes-description">Token Address</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">0x6b0770d930bB22990c83fBBfcba6faB129AD7E385</p>
              <p className="hashes-description">Crowdsale Contract Address</p>
            </div>
            <div className="hashes-i hidden">
              <div className="left">
                <p className="hashes-title">Oracles Network</p>
                <p className="hashes-description">Name</p>
              </div>
              <div className="left">
                <p className="hashes-title">ORC</p>
                <p className="hashes-description">Ticker</p>
              </div>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">2,000,000,000 ORC</p>
              <p className="hashes-description">Total Supply</p>
            </div>
          </div>
          <p className="invest-title">LOREM IPSUM</p>
          <p className="invest-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
          </p>
        </div>
        <div className="invest-table-cell invest-table-cell_right">
          <div className="balance">
            <p className="balance-title">100,000 ORC</p>
            <p className="balance-description">Balance</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore.
            </p>
          </div>
          <form className="invest-form">
            <label for="" className="invest-form-label">Choose amount to invest</label>
            <div className="invest-form-input-container">
              <input type="text" className="invest-form-input" placeholder="0"/>
              <div className="invest-form-label">TOKENS</div>
            </div>
            <a href="#" className="button button_fill">Invest now</a>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod
            </p>
          </form>
        </div>
      </div>
    </div>
  }
}
 

