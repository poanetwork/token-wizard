import { findConstructor, toFixed } from '../utils/utils'
import { getconstructorParams } from '../stores/utils'
import { web3Store } from '../stores'

export const getEncodedABIClientSide = (abi, vals, crowdsaleNum, isCrowdsale) => {
  const abiConstructor = findConstructor(abi)
  let params = getconstructorParams(abiConstructor, vals, crowdsaleNum, isCrowdsale)

  return getABIEncoded(params.types, params.vals)
}

const getABIEncoded = (types, vals) => {
  const { web3 } = web3Store

  return new Promise((resolve, reject) => {
    if (vals) {
      for (let i = 0; i < vals.length; i++) {
        let val = vals[i]
        if (Array.isArray(val)) {
          for (let j = 0; j < val.length; j++) {
            if (val[j]) {
              vals[i][j] = toFixed(val[j])
            }
          }
        }
      }
    }

    console.log(types)
    console.log(vals)

    try {
      let encoded = web3.eth.abi.encodeParameters(types, vals)
      let ABIEncodedRaw = encoded.toString('hex')
      let ABIEncoded = ABIEncodedRaw.indexOf('0x') > -1 ? ABIEncodedRaw.substr(2) : ABIEncodedRaw
      resolve(ABIEncoded)
    } catch (e) {
      reject(e)
    }

  })
}
