import React from 'react'

export const TxStatusIconClockActive = () => (
  <svg id="animatedClock" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <defs>
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes clock-animation {
              0% {
                transform: rotate(0);
                transform-origin: center center;
              }
              100% {
                transform: rotate(360deg);
                transform-origin: center center;
              }
            }
            #animatedClockMinutes {
              animation: clock-animation 5s steps(120, end) infinite both;
            }
          `
        }}
      />
    </defs>
    <path
      fill="#ffffff"
      d="M9.419 0C4.225 0 0 4.225 0 9.419c0 5.193 4.225 9.418 9.419 9.418 5.193 0 9.418-4.225 9.418-9.418C18.837 4.225 14.612 0 9.42 0zm0 16.833c-4.089 0-7.415-3.326-7.415-7.414 0-4.089 3.326-7.415 7.415-7.415 4.088 0 7.414 3.326 7.414 7.415 0 4.088-3.326 7.414-7.414 7.414z"
    />
    <g stroke="#ffffff" strokeLinecap="round" strokeWidth="1.6">
      <line id="animatedClockMinutes" x1="9.3" y1="4" x2="9.3" y2="10" />
      <line id="animatedClockHours" x1="9.8" x2="14.2" y1="9.5" y2="9.5" />
    </g>
  </svg>
)
