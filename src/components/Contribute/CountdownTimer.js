import React from 'react'
import Circle from 'react-circle'
import { pad } from '../../utils/utils'
import logdown from 'logdown'

const logger = logdown('TW:CountDownTimer')

const CountdownTimer = ({
  altMessage,
  crowdsaleTimePassedPercentage,
  days,
  hours,
  isFinalized,
  isSoldOut,
  isTierSoldOut,
  isLoading,
  minutes,
  nextTick,
  seconds,
  tiersLength
}) => {
  const noTimeLeft = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0
  const crowdsaleIsRunning = !isFinalized && nextTick && nextTick.type
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
        <div className="cnt-CountdownTimer_TimeCount">{pad(hours, 2)}</div>
        <div className="cnt-CountdownTimer_TimeInterval">Hours</div>
      </div>
      <div className="cnt-CountdownTimer_TimeItem">
        <div className="cnt-CountdownTimer_TimeCount">{pad(minutes, 2)}</div>
        <div className="cnt-CountdownTimer_TimeInterval">Mins</div>
      </div>
      {days ? null : (
        <div className="cnt-CountdownTimer_TimeItem">
          <div className="cnt-CountdownTimer_TimeCount">{pad(seconds, 2)}</div>
          <div className="cnt-CountdownTimer_TimeInterval">Secs</div>
        </div>
      )}
    </div>
  )

  const getCrowdsaleMessage = () => {
    let theMessage

    logger.log('Is Finalized', isFinalized)
    logger.log('Is sold out', isSoldOut)
    logger.log('Is Tier sold out', isTierSoldOut)
    if (isFinalized) {
      theMessage = 'crowdsale has been finalized'
    } else {
      if (nextTick && nextTick.type) {
        if (nextTick.type === 'start' && !noTimeLeft) {
          theMessage = `To start of tier ${nextTick.order} of ${tiersLength}`
        } else if (nextTick.type === 'end' && !noTimeLeft && isSoldOut && nextTick.order === tiersLength) {
          theMessage = 'Crowdsale has ended'
        } else if (nextTick.type === 'end' && !noTimeLeft) {
          theMessage = `To end of tier ${nextTick.order} of ${tiersLength}`
        } else {
          theMessage = `Waiting...`
        }
      } else {
        theMessage = 'Crowdsale has ended'
      }
    }

    return <div className="cnt-CountdownTimer_Message">{theMessage}</div>
  }

  const getCrowdsaleAltMessage = () => {
    return altMessage ? <div className="cnt-CountdownTimer_AltMessage">{altMessage}</div> : null
  }

  const getCrowdsaleProgress = () => {
    if (noTimeLeft || !crowdsaleIsRunning || isFinalized || isSoldOut) {
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
            {noTimeLeft || isFinalized || isSoldOut ? null : countdownClock}
            {getCrowdsaleMessage()}
            {getCrowdsaleAltMessage()}
          </div>
        )}
      </div>
    </div>
  )
}

export default CountdownTimer
