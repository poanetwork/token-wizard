import { DOWNLOAD_STATUS, TOAST } from '../../utils/constants'
import { getNetworkVersion } from '../../utils/blockchainHelpers'
import { getCrowdsaleAssets } from '../../stores/utils'
import { toast } from '../../utils/utils'
import logdown from 'logdown'

const logger = logdown('TW:home:utils')

export const reloadStorage = async props => {
  let { generalStore, contractStore } = props

  try {
    contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.PENDING)

    // General store, check network
    let networkID = await getNetworkVersion()
    generalStore.setProperty('networkID', networkID)

    // Contract store, get contract and abi
    await getCrowdsaleAssets(networkID)
    contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.SUCCESS)
  } catch (e) {
    logger.error('Error downloading contracts', e)
    contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.FAILURE)
    throw e
  }
}
