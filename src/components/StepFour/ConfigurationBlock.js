import React from 'react'
import { DisplayField } from '../Common/DisplayField'
import { PUBLISH_DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { getOptimizationFlagByStore, getVersionFlagByStore } from './utils'

export const ConfigurationBlock = store => {
  const { crowdsaleStore } = store.store
  const optimizationFlag = getOptimizationFlagByStore(crowdsaleStore)
  const versionFlag = getVersionFlagByStore(crowdsaleStore)
  const { COMPILER_VERSION, CONTRACT_NAME, COMPILING_OPTIMIZATION } = TEXT_FIELDS
  const {
    COMPILER_VERSION: PD_COMPILER_VERSION,
    CONTRACT_NAME: PD_CONTRACT_NAME,
    COMPILING_OPTIMIZATION: PD_COMPILING_OPTIMIZATION
  } = PUBLISH_DESCRIPTION

  return (
    <div className="cb-ConfigurationBlock">
      <DisplayField title={COMPILER_VERSION} value={versionFlag} description={PD_COMPILER_VERSION} />
      <DisplayField description={PD_CONTRACT_NAME} title={CONTRACT_NAME} value={crowdsaleStore.proxyName} />
      <DisplayField description={PD_COMPILING_OPTIMIZATION} title={COMPILING_OPTIMIZATION} value={optimizationFlag} />
    </div>
  )
}
