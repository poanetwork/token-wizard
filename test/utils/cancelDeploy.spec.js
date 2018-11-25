import cancelDeploy from '../../src/utils/cancelDeploy'

jest.mock('../../src/utils/alerts')

describe('cancelDeploy test', () => {
  it('should copy a content', async () => {
    const window = global

    window.localStorage.test = 'test'
    expect(window.localStorage.test).toBe('test')

    const results = await cancelDeploy()
    expect(window.localStorage.test).toBeUndefined()
  })
})
