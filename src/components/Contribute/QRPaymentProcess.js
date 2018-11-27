import React from 'react'
import QRCode from 'qrcode.react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

const QRPaymentProcess = ({ crowdsaleProxyAddr, registryExecAddr, txData }) => {
  const targetContractStr = crowdsaleProxyAddr ? 'proxy' : 'RegistryExec'
  const targetAddr = crowdsaleProxyAddr ? crowdsaleProxyAddr : registryExecAddr

  return (
    <div className="cnt-QRPaymentProcess">
      <div className="cnt-QRPaymentProcess_QR">
        <QRCode fgColor="#5a2da5" value={targetAddr} size={115} bgColor="#f6f6f6" />
      </div>
      <div className="cnt-QRPaymentProcess_HashContainer">
        <span className="cnt-QRPaymentProcess_Hash">{targetAddr}</span>
        <ButtonCopyToClipboard value={targetAddr} />
      </div>
      <div className="cnt-QRPaymentProcess_Note">
        <h3 className="cnt-QRPaymentProcess_NoteTitle">Important</h3>
        <p className="cnt-QRPaymentProcess_NoteDescription">
          Send ethers to the crowdsale {targetContractStr} address with a data:{' '}
        </p>
        <div className="cnt-QRPaymentProcess_txDataContainer">
          <span className="cnt-QRPaymentProcess_txData">{txData}</span>
          <ButtonCopyToClipboard buttonColor="#270167" value={txData} />
        </div>
      </div>
    </div>
  )
}

export default QRPaymentProcess
