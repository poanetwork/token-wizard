import { getFieldsToUpdate } from './utils'

describe('getFieldsToUpdate', () => {
  it('should include only fields that have changed', () => {
    // Given
    const updatableTiers = [{
      index: 0,
      addresses: {},
      rate: '10',
      supply: '1000'
    }]
    const tiers = [{
      rate: '20',
      supply: '1000'
    }]

    // When
    const result = getFieldsToUpdate(updatableTiers, tiers)

    // Then
    expect(result).toEqual([{
      addresses: {},
      key: 'rate',
      newValue: '20',
      tier: 0
    }])
  })

  it('should work with several tiers', () => {
    // Given
    const updatableTiers = [{
      index: 0,
      addresses: {},
      rate: '10',
      supply: '1000'
    }, {
      index: 1,
      addresses: {},
      rate: '10',
      supply: '1000'
    }]
    const tiers = [{
      rate: '20',
      supply: '1000'
    }, {
      rate: '10',
      supply: '2000'
    }]

    // When
    const result = getFieldsToUpdate(updatableTiers, tiers)

    // Then
    expect(result).toEqual([{
      addresses: {},
      key: 'supply',
      newValue: '2000',
      tier: 1
    }, {
      addresses: {},
      key: 'rate',
      newValue: '20',
      tier: 0
    }])
  })

  it('should update endTime before startTime', () => {
    // Given
    const updatableTiers = [{
      index: 0,
      addresses: {},
      startTime: '2018-01-01T00:00',
      endTime: '2018-01-05T00:00'
    }]
    const tiers = [{
      startTime: '2018-01-06T00:00',
      endTime: '2018-01-10T00:00'
    }]

    // When
    const result = getFieldsToUpdate(updatableTiers, tiers)

    // Then
    expect(result).toEqual([{
      addresses: {},
      key: 'endTime',
      newValue: '2018-01-10T00:00',
      tier: 0
    }, {
      addresses: {},
      key: 'startTime',
      newValue: '2018-01-06T00:00',
      tier: 0
    }])
  })
})
