import React from 'react'
import Circle from 'react-circle'

const CountdownTimer = ({
  altMessage,
  crowdsaleTimePassedPercentage,
  days,
  hours,
  isFinalized,
  isLoading,
  minutes,
  nextTick,
  seconds,
  tiersLength
}) => {
  const noTimeLeft = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0
  const crowdsaleIsRunning = !isFinalized && nextTick.type
  const hoursHaveBlinker = days ? 'cnt-CountdownTimer_TimeItem-blinking' : ''

  const countdownClock = (
    <div className="cnt-CountdownTimer_Time">
      {days ? (
        <div className="cnt-CountdownTimer_TimeItem">
          <div className="cnt-CountdownTimer_TimeCount">{days}</div>
          <div className="cnt-CountdownTimer_TimeInterval">Days</div>
        </div>
      ) : null}
      <div className={`cnt-CountdownTimer_TimeItem ${hoursHaveBlinker}`}>
        <div className="cnt-CountdownTimer_TimeCount">{hours}</div>
        <div className="cnt-CountdownTimer_TimeInterval">Hours</div>
      </div>
      <div className="cnt-CountdownTimer_TimeItem">
        <div className="cnt-CountdownTimer_TimeCount">{minutes}</div>
        <div className="cnt-CountdownTimer_TimeInterval">Mins</div>
      </div>
      {days ? null : (
        <div className="cnt-CountdownTimer_TimeItem">
          <div className="cnt-CountdownTimer_TimeCount">{seconds}</div>
          <div className="cnt-CountdownTimer_TimeInterval">Secs</div>
        </div>
      )}
    </div>
  )

  const getCrowdsaleMessage = () => {
    let theMessage = 'Crowdsale has ended'

    if (crowdsaleIsRunning) {
      if (nextTick.type === 'start') {
        theMessage = `To start of tier ${nextTick.order} of ${tiersLength}`
      } else {
        theMessage = `To end of tier ${nextTick.order} of ${tiersLength}`
      }
    }

    return <div className="cnt-CountdownTimer_Message">{theMessage}</div>
  }

  const getCrowdsaleAltMessage = () => {
    return altMessage ? <div className="cnt-CountdownTimer_AltMessage">{altMessage}</div> : null
  }

  const getCrowdsaleProgress = () => {
    if (noTimeLeft || !crowdsaleIsRunning) {
      return 100
    }

    return crowdsaleTimePassedPercentage
  }

  return (
    <div className="cnt-CountdownTimer">
      <div className="cnt-CountdownTimer_ReactCountdownClock">
        <Circle
          animate={true}
          bgColor="#5a2da5"
          lineWidth="50"
          progress={getCrowdsaleProgress()}
          progressColor="#a971f9"
          responsive={false}
          roundedStroke={false}
          showPercentage={false}
          size="250"
        />
        {isLoading ? null : (
          <div className="cnt-CountdownTimer_TimeContainer">
            {noTimeLeft ? null : countdownClock}
            {getCrowdsaleMessage()}
            {getCrowdsaleAltMessage()}
          </div>
        )}
      </div>
    </div>
  )
}

export default CountdownTimer
