import React from 'react'
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const QRPaymentProcess = ({ crowdsaleAddress }) => {
  return (
    <div>
      <div className="payment-process">
          <div className="payment-process-qr">
            <QRCode value={crowdsaleAddress}></QRCode>
          </div>
        <p className="payment-process-hash">
          { crowdsaleAddress }
        </p>

        <CopyToClipboard text={crowdsaleAddress}>
          <a href="" onClick={e => e.preventDefault()} className="payment-process-copy">Copy Address</a>
        </CopyToClipboard>

        {/* <div className="payment-process-loader">Waiting for payment</div> */}
        <div className="payment-process-notation">
          <p className="payment-process-notation-title">Important</p>
          <p className="payment-process-notation-description">
            Send ethers to the crowdsale address with a MethodID: 0xa6f2ae3a
          </p>
        </div>
      </div>
      { /* <div className="payment-process">
        <div className="payment-process-success"></div>
        <p className="payment-process-description">
          Your Project tokens were sent to
        </p>
        <p className="payment-process-hash">
          0x6b0770d930bB22990c83fBBfcba6faB129AD7E385
        </p>
        <a href="#" className="payment-process-see">See it on the blockchain</a>
      </div> */ }
    </div>
  )
}

export default QRPaymentProcess;
