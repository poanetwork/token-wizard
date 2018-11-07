import React from 'react'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const QRPaymentProcess = ({ crowdsaleProxyAddr, registryExecAddr, txData }) => {
  const targetContractStr = crowdsaleProxyAddr ? 'Proxy' : 'RegistryExec'
  const targetAddr = crowdsaleProxyAddr ? crowdsaleProxyAddr : registryExecAddr
  return (
    <div>
      <div className="payment-process">
        <div className="payment-process-qr">
          <QRCode value={targetAddr} />
        </div>
        <p className="payment-process-hash">{targetAddr}</p>

        <CopyToClipboard text={targetAddr}>
          <a href="" onClick={e => e.preventDefault()} className="payment-process-copy">
            Copy Address
          </a>
        </CopyToClipboard>

        <div className="payment-process-notation">
          <p className="payment-process-notation-title">Important</p>
          <p className="payment-process-notation-description">
            Send ethers to the Auth-os {targetContractStr} smart-contract address with a data: {txData}
          </p>
        </div>
      </div>
    </div>
  )
}

export default QRPaymentProcess
