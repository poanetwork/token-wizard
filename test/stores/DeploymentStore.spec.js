import DeploymentStore from '../../src/stores/DeploymentStore'
import storage from 'store2'
import { getCrowdSaleParams, getDutchAuctionCrowdSaleParams } from '../../src/components/StepFour/utils'

describe('DeploymentStore', () => {
  let deploymentStore
  let tiers = [
    {
      tier: 'tier 1',
      supply: 1000,
      startTime: Date.now() * 1000,
      endTime: Date.now() * 1000,
      whitelistEnabled: 'yes',
      whitelist: [
        { addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', min: 1234, max: 50505 },
        { addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0', min: 1234, max: 50505 },
        { addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b', min: 1234, max: 50505 },
        { addr: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d', min: 1234, max: 50505 },
        { addr: '0xd03ea8624c8c5987235048901fb614fdca89b117', min: 1234, max: 50505 },
        { addr: '0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', min: 1234, max: 50505 },
        { addr: '0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9', min: 1234, max: 50505 },
        { addr: '0x28a8746e75304c0780e011bed21c72cd78cd535e', min: 1234, max: 50505 },
        { addr: '0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e', min: 1234, max: 50505 },
        { addr: '0x1df62f291b2e969fb0849d99d9ce41e2f137006e', min: 1234, max: 50505 }
      ]
    },
    {
      tier: 'tier 2',
      supply: 1000,
      startTime: Date.now() * 1000,
      endTime: Date.now() * 1000,
      whitelistEnabled: 'yes',
      whitelist: [
        { addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', min: 1234, max: 50505 },
        { addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0', min: 1234, max: 50505 },
        { addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b', min: 1234, max: 50505 },
        { addr: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d', min: 1234, max: 50505 },
        { addr: '0xd03ea8624c8c5987235048901fb614fdca89b117', min: 1234, max: 50505 },
        { addr: '0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', min: 1234, max: 50505 },
        { addr: '0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9', min: 1234, max: 50505 },
        { addr: '0x28a8746e75304c0780e011bed21c72cd78cd535e', min: 1234, max: 50505 },
        { addr: '0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e', min: 1234, max: 50505 },
        { addr: '0x1df62f291b2e969fb0849d99d9ce41e2f137006e', min: 1234, max: 50505 }
      ]
    },
    {
      tier: 'tier 3',
      supply: 1000,
      startTime: Date.now() * 1000,
      endTime: Date.now() * 1000,
      whitelistEnabled: 'yes',
      whitelist: [
        { addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', min: 1234, max: 50505 },
        { addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0', min: 1234, max: 50505 },
        { addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b', min: 1234, max: 50505 },
        { addr: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d', min: 1234, max: 50505 },
        { addr: '0xd03ea8624c8c5987235048901fb614fdca89b117', min: 1234, max: 50505 },
        { addr: '0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', min: 1234, max: 50505 },
        { addr: '0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9', min: 1234, max: 50505 },
        { addr: '0x28a8746e75304c0780e011bed21c72cd78cd535e', min: 1234, max: 50505 },
        { addr: '0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e', min: 1234, max: 50505 },
        { addr: '0x1df62f291b2e969fb0849d99d9ce41e2f137006e', min: 1234, max: 50505 }
      ]
    },
    {
      tier: 'tier 4',
      supply: 1000,
      startTime: Date.now() * 1000,
      endTime: Date.now() * 1000,
      whitelist: [
        { addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', min: 1234, max: 50505 },
        { addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0', min: 1234, max: 50505 },
        { addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b', min: 1234, max: 50505 },
        { addr: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d', min: 1234, max: 50505 },
        { addr: '0xd03ea8624c8c5987235048901fb614fdca89b117', min: 1234, max: 50505 },
        { addr: '0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', min: 1234, max: 50505 },
        { addr: '0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9', min: 1234, max: 50505 },
        { addr: '0x28a8746e75304c0780e011bed21c72cd78cd535e', min: 1234, max: 50505 },
        { addr: '0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e', min: 1234, max: 50505 },
        { addr: '0x1df62f291b2e969fb0849d99d9ce41e2f137006e', min: 1234, max: 50505 }
      ]
    }
  ]

  beforeEach(() => {
    deploymentStore = new DeploymentStore()
  })

  afterEach(() => {
    deploymentStore.reset()
  })

  it('should instantiates store properly', () => {
    expect(deploymentStore.txMap).toBeDefined()
    expect(deploymentStore.deploymentStep).toBeNull()
    expect(deploymentStore.hasEnded).toBeFalsy()
    expect(deploymentStore.deployerAccount).toBeNull()
    expect(deploymentStore.invalidAccount).toBeFalsy()
  })

  it('should check is tx map is correctly defined', () => {
    const deploymentStoreTxMap = new DeploymentStore()
    const deploymentStoreObject = storage.get('DeploymentStore')

    expect(deploymentStoreObject.txMap).toBeDefined()
    expect(deploymentStoreObject.deploymentStep).toBeNull()
    expect(deploymentStoreObject.hasEnded).toBeFalsy()
    expect(deploymentStoreObject.deployerAccount).toBeNull()
    expect(deploymentStoreObject.invalidAccount).toBeFalsy()
  })

  it('should initialize a deploymentStore', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()
  })

  it('should set a transaction as successfully', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    deploymentStore.setAsSuccessful('deployProxy')
    deploymentStore.setAsSuccessful('crowdsaleCreate')

    deploymentStore.txMap.forEach((steps, name) => {
      const step = steps[0]
      if (name === 'deployProxy' || name === 'crowdsaleCreate') {
        expect(step.mined).toBeTruthy()
      }
    })
  })

  it('should set deployment step', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    deploymentStore.setDeploymentStep(1)

    expect(deploymentStore.deploymentStep).toBe(1)
    expect(deploymentStore.deployInProgress).toBeTruthy()

    deploymentStore.resetDeploymentStep()
    expect(deploymentStore.deploymentStep).toBeNull()
  })

  it('should set deployer account', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.deployerAccount).toBeNull()

    deploymentStore.setDeployerAccount('account1')

    expect(deploymentStore.deployerAccount).toBe('account1')
  })

  it('should set deployer account check handle account undefined', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.deployerAccount).toBeNull()

    expect(deploymentStore.handleAccountChange('account1')).toBeUndefined()
  })

  it('should set deployer account check handle account ', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.deployerAccount).toBeNull()

    deploymentStore.setDeployerAccount('account1')

    expect(deploymentStore.deployerAccount).toBe('account1')

    deploymentStore.handleAccountChange('account1')
    expect(deploymentStore.invalidAccount).toBeFalsy()

    deploymentStore.handleAccountChange('account2')
    expect(deploymentStore.invalidAccount).toBeTruthy()
  })

  it('should set hasEnded property ', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.deployerAccount).toBeNull()

    deploymentStore.setHasEnded(true)

    expect(deploymentStore.hasEnded).toBeTruthy()

    deploymentStore.setHasEnded(false)

    expect(deploymentStore.hasEnded).toBeFalsy()
  })

  it('should get nex pending transaction', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    deploymentStore.setAsSuccessful('deployProxy')
    deploymentStore.setAsSuccessful('crowdsaleCreate')

    deploymentStore.txMap.forEach((steps, name) => {
      const step = steps[0]
      if (name === 'deployProxy' || name === 'crowdsaleCreate') {
        expect(step.mined).toBeTruthy()
      }
    })

    expect(deploymentStore.nextPendingTransaction).toBe('token')

    deploymentStore.setAsSuccessful('token')
    expect(deploymentStore.nextPendingTransaction).toBe('createCrowdsaleTiers')

    expect(deploymentStore.deploymentHasFinished).toBeFalsy()

    deploymentStore.setAsSuccessful('whitelist')
    deploymentStore.setAsSuccessful('setReservedTokens')
    deploymentStore.setAsSuccessful('updateGlobalMinContribution')
    deploymentStore.setAsSuccessful('createCrowdsaleTiers')
    deploymentStore.setAsSuccessful('crowdsaleInit')
    deploymentStore.setAsSuccessful('trackProxy')

    setTimeout(() => {
      // Then
      expect(deploymentStore.deploymentHasFinished).toBeTruthy()
    }, 2000)
  })

  it('should get active steps', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    deploymentStore.setAsSuccessful('deployProxy')
    deploymentStore.setAsSuccessful('crowdsaleCreate')

    deploymentStore.activeSteps.forEach((step, index) => {
      if (step.name === 'deployProxy' || step.name === 'crowdsaleCreate') {
        expect(step.mined).toBeTruthy()
      } else {
        expect(step.mined).toBeFalsy()
      }
    })
  })

  it('should get txRecoverable I', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    deploymentStore.setDeploymentStepTxHash({ executionOrder: 0, txHash: 'asdasd' })
    expect(deploymentStore.txRecoverable.name).toBe('deployProxy')
  })

  it('should get txRecoverable II', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    deploymentStore.setDeploymentStepTxHash({ executionOrder: 1, txHash: 'asdasd' })
    expect(deploymentStore.txRecoverable.name).toBe('crowdsaleCreate')
  })

  it('should get getStepExecutionOrder I', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    const step = deploymentStore.getStepExecutionOrder()
    expect(step).toBeUndefined()
  })

  it('should get getStepExecutionOrder II', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    const stepsValues = [
      {
        value: {
          name: 'deployProxy',
          innerIndex: 0
        },
        expected: 0
      },
      {
        value: {
          name: 'crowdsaleCreate',
          innerIndex: 0
        },
        expected: 1
      },
      {
        value: {
          name: 'token',
          innerIndex: 0
        },
        expected: 2
      }
    ]

    stepsValues.forEach((step, index) => {
      const stepIndex = deploymentStore.getStepExecutionOrder(step.value)
      expect(stepIndex).toBe(step.expected)
    })
  })

  it('should get resetTx I', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    const step = deploymentStore.resetTx()
    expect(step).toBeUndefined()
  })

  it('should get resetTx II', () => {
    deploymentStore.initialize(false, true, false, tiers, false)

    expect(deploymentStore.txMap.get('deployProxy')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleCreate')).toBeDefined()
    expect(deploymentStore.txMap.get('token')).toBeDefined()
    expect(deploymentStore.txMap.get('setReservedTokens')).toBeDefined()
    expect(deploymentStore.txMap.get('updateGlobalMinContribution')).toBeDefined()
    expect(deploymentStore.txMap.get('createCrowdsaleTiers')).toBeDefined()
    expect(deploymentStore.txMap.get('whitelist')).toBeDefined()
    expect(deploymentStore.txMap.get('crowdsaleInit')).toBeDefined()
    expect(deploymentStore.txMap.get('trackProxy')).toBeDefined()

    const step = deploymentStore.resetTx({
      name: 'deployProxy',
      innerIndex: 0
    })

    const getStep = deploymentStore.txMap.get('deployProxy').slice()[0]
    expect(getStep.active).toBeFalsy()
    expect(getStep.confirmationPending).toBeFalsy()
    expect(getStep.miningPending).toBeFalsy()
    expect(getStep.mined).toBeFalsy()
    expect(getStep.txHash).toBe('')
  })
})
