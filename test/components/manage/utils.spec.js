import { getFieldsToUpdate } from '../../../src/components/manage/utils'

describe('getFieldsToUpdate', () => {
  it('should include only fields that have changed', () => {
    // Given
    const updatableTiers = [
      {
        index: 0,
        whitelist: [{ addr: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', min: 1234, max: 50505, stored: true }]
      }
    ]
    const tiers = [
      {
        whitelist: [{ addr: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', min: 12345, max: 50505, stored: false }]
      }
    ]

    // When
    const result = getFieldsToUpdate(updatableTiers, tiers)

    // Then
    expect(result).toEqual([
      {
        key: 'whitelist',
        newValue: [{ addr: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', min: 12345, max: 50505, stored: false }],
        tier: 0
      }
    ])
  })

  it('should work with several tiers', () => {
    // Given
    const updatableTiers = [
      {
        index: 0,
        whitelist: [{ addr: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', min: 1234, max: 50505, stored: true }]
      },
      {
        index: 1,
        whitelist: [{ addr: '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d', min: 1234, max: 50505, stored: true }]
      }
    ]
    const tiers = [
      {
        whitelist: [{ addr: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', min: 1234, max: 50505, stored: false }]
      },
      {
        whitelist: [{ addr: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', min: 1234, max: 50505, stored: false }]
      }
    ]

    // When
    const result = getFieldsToUpdate(updatableTiers, tiers)

    // Then
    expect(result).toEqual([
      {
        key: 'whitelist',
        newValue: [{ addr: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', min: 1234, max: 50505, stored: false }],
        tier: 0
      },
      {
        key: 'whitelist',
        newValue: [{ addr: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', min: 1234, max: 50505, stored: false }],
        tier: 1
      }
    ])
  })

  it('should update endTime', () => {
    // Given
    const updatableTiers = [
      {
        index: 0,
        endTime: '2018-01-05T00:00'
      }
    ]
    const tiers = [
      {
        endTime: '2018-01-10T00:00'
      }
    ]

    // When
    const result = getFieldsToUpdate(updatableTiers, tiers)

    // Then
    expect(result).toEqual([
      {
        key: 'endTime',
        newValue: '2018-01-10T00:00',
        tier: 0
      }
    ])
  })
})
