import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'

const CountdownTimer = ({
  displaySeconds,
  nextTick,
  tiersLength,
  days,
  hours,
  minutes,
  seconds,
  msToNextTick,
  onComplete,
  isFinalized,
  altMessage
}) => {
  const countdownClock = (
    <div>
      {displaySeconds ? null : (
        <div className="timer-i">
          <div className="timer-count">{days}</div>
          <div className="timer-interval">Days</div>
        </div>
      )}
      {displaySeconds ? null : (
        <div className="timer-i">
          <div className="timer-count">{hours}</div>
          <div className="timer-interval">Hours</div>
        </div>
      )}
      <div className="timer-i">
        <div className="timer-count">{minutes}</div>
        <div className="timer-interval">Mins</div>
      </div>
      {!displaySeconds ? null : (
        <div className="timer-i">
          <div className="timer-count">{seconds}</div>
          <div className="timer-interval">Secs</div>
        </div>
      )}
    </div>
  )

  let message = null

  if (isFinalized) {
    message = 'crowdsale has been finalized'
    msToNextTick = 0
  } else {
    if (nextTick.type) {
      if (nextTick.type === 'start') {
        message = `to start of tier ${nextTick.order} of ${tiersLength}`
      } else {
        message = `to end of tier ${nextTick.order} of ${tiersLength}`
      }
    } else {
      message = 'crowdsale has ended'
    }
  }

  return (
    <div className="timer-container">
      <div style={{ marginLeft: '-20px', marginTop: '-20px' }}>
        <ReactCountdownClock
          seconds={msToNextTick / 1000}
          color="#733EAB"
          alpha={0.9}
          size={270}
          showMilliseconds={false}
          onComplete={onComplete}
        />
      </div>
      <div className="timer">
        <div className="timer-inner">
          {isFinalized ? null : countdownClock}
          <div className="timer-i">
            <div className="timer-interval">
              <strong>{message}</strong>
              {altMessage ? <div className="timer__altMessage">{altMessage}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
