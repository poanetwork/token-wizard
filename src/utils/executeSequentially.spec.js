import executeSequentially from './executeSequentially'

describe('executeSequentially', () => {
  it('should resolve if the list is empty', () => {
    // given
    const list = []

    // when
    return executeSequentially(list)
      .then(() => {
        // then
        // it should resolve
      })
  })

  it('should execute all the functions in the list', () => {
    // given
    const list = [
      jest.fn().mockReturnValue(Promise.resolve())
    ]

    // when
    return executeSequentially(list)
      .then(() => {
        // then
        expect(list[0]).toHaveBeenCalledTimes(1)
      })
  })

  it('should wait for function to finish', () => {
    // given
    let finished = 0

    const list = [
      buildMockFunction(100),
      buildMockFunction(50)
    ]

    // when
    return executeSequentially(list)
      .then(() => {
        // then
        expect(list[0]).toHaveBeenCalledTimes(1)
        expect(list[1]).toHaveBeenCalledTimes(1)
        expect(finished).toBe(2)
      })

    function buildMockFunction (timeout) {
      return jest.fn(() => new Promise(resolve => {
        setTimeout(() => {
          finished++
          resolve()
        }, timeout)
      }))
    }
  })

  it('should return index of the function that failed (last function fails)', () => {
    // given
    const list = [
      buildMockFunction(0),
      buildMockFunction(0),
      buildMockFunction(0, true)
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => { expect(index).toBe(2) }
      )

    function buildMockFunction (timeout, shouldFail) {
      return jest.fn(() => new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject()
          } else {
            resolve()
          }

        }, timeout)
      }))
    }
  })

  it('should return index of the function that failed (first function rejects)', () => {
    // given
    const list = [
      buildMockFunction(0, true),
      buildMockFunction(0),
      buildMockFunction(0)
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => { expect(index).toBe(0) }
      )

    function buildMockFunction (timeout, shouldFail) {
      return jest.fn(() => new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject()
          } else {
            resolve()
          }

        }, timeout)
      }))
    }
  })

  it('should return index of the function that failed (first function throws)', () => {
    // given
    const list = [
      buildMockFunction(0, true),
      buildMockFunction(0),
      buildMockFunction(0)
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => { expect(index).toBe(0) }
      )

    function buildMockFunction (timeout, shouldFail) {
      return jest.fn(() => {
        throw new Error()
      })
    }
  })

  it('should not execute the functions after the function that failed', () => {
    // given
    let finished = 0

    const list = [
      buildMockFunction(0, true),
      buildMockFunction(0),
      buildMockFunction(0)
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => {
          expect(index).toBe(0)
          expect(finished).toBe(1)
          expect(list[0]).toHaveBeenCalledTimes(1)
          expect(list[1]).toHaveBeenCalledTimes(0)
          expect(list[2]).toHaveBeenCalledTimes(0)
        }
      )

    function buildMockFunction (timeout, shouldFail) {
      return jest.fn(() => new Promise((resolve, reject) => {
        setTimeout(() => {
          finished++

          if (shouldFail) {
            reject()
          } else {
            resolve()
          }

        }, timeout)
      }))
    }
  })

  it('should reject with the error of the failed function', () => {
    // given
    let finished = 0

    const list = [
      buildMockFunction(0, true),
      buildMockFunction(0),
      buildMockFunction(0)
    ]

    const ERR = 'FN FAILED'

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => {
          expect(err).toBe(ERR)

          expect(index).toBe(0)
          expect(finished).toBe(1)

          expect(list[0]).toHaveBeenCalledTimes(1)
          expect(list[1]).toHaveBeenCalledTimes(0)
          expect(list[2]).toHaveBeenCalledTimes(0)
        }
      )

    function buildMockFunction (timeout, shouldFail) {
      return jest.fn(() => new Promise((resolve, reject) => {
        setTimeout(() => {
          finished++

          if (shouldFail) {
            reject(ERR)
          } else {
            resolve()
          }

        }, timeout)
      }))
    }
  })
})
