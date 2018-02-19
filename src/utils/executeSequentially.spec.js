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
      buildMockFunction({ timeout: 100, cb: () => finished++ }),
      buildMockFunction({ timeout: 50, cb: () => finished++ })
    ]

    // when
    return executeSequentially(list)
      .then(() => {
        // then
        expect(list[0]).toHaveBeenCalledTimes(1)
        expect(list[1]).toHaveBeenCalledTimes(1)
        expect(finished).toBe(2)
      })
  })

  it('should return index of the function that failed (last function fails)', () => {
    // given
    const list = [
      buildMockFunction(),
      buildMockFunction(),
      buildMockFunction({ shouldFail: true })
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => { expect(index).toBe(2) }
      )

  })

  it('should return index of the function that failed (first function rejects)', () => {
    // given
    const list = [
      buildMockFunction({ shouldFail: true }),
      buildMockFunction(),
      buildMockFunction()
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => { expect(index).toBe(0) }
      )
  })

  it('should return index of the function that failed (first function throws)', () => {
    // given
    const list = [
      buildMockFunction({ shouldFail: true }),
      buildMockFunction(),
      buildMockFunction()
    ]

    // when
    return executeSequentially(list)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => { expect(index).toBe(0) }
      )
  })

  it('should not execute the functions after the function that failed', () => {
    // given
    let finished = 0

    const list = [
      buildMockFunction({ shouldFail: true, cb: () => finished++ }),
      buildMockFunction(),
      buildMockFunction()
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
  })

  it('should reject with the error of the failed function', () => {
    // given
    let finished = 0
    const ERR = 'FN FAILED'

    const list = [
      buildMockFunction({ shouldFail: true, rejectWith: ERR, cb: () => { finished++ } }),
      buildMockFunction(),
      buildMockFunction()
    ]


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
  })

  it('should accept an index to set the start of the execution', () => {
    // given
    const list = [
      buildMockFunction(),
      buildMockFunction(),
      buildMockFunction()
    ]

    // when
    return executeSequentially(list, 1)
      .then(() => {
        expect(list[0]).toHaveBeenCalledTimes(0)
        expect(list[1]).toHaveBeenCalledTimes(1)
        expect(list[2]).toHaveBeenCalledTimes(1)
      })
  })

  it('should fail with the absolute index of the failed function', () => {
    // given
    const list = [
      buildMockFunction(),
      buildMockFunction(),
      buildMockFunction(),
      buildMockFunction({ shouldFail: true }),
      buildMockFunction()
    ]

    // when
    return executeSequentially(list, 2)
      .then(
        () => { throw new Error('should not resolve') },
        ([err, index]) => {
          expect(index).toBe(3)
          expect(list[0]).toHaveBeenCalledTimes(0)
          expect(list[1]).toHaveBeenCalledTimes(0)
          expect(list[2]).toHaveBeenCalledTimes(1)
          expect(list[3]).toHaveBeenCalledTimes(1)
          expect(list[4]).toHaveBeenCalledTimes(0)
        }
      )
  })

  it('should accept a callback to execute after each successful execution', () => {
    // given
    const list = [
      buildMockFunction(),
      buildMockFunction(),
      buildMockFunction()
    ]

    // when
    const cb = jest.fn()
    return executeSequentially(list, 0, cb)
      .then(() => {
        // then
        expect(list[0]).toHaveBeenCalledTimes(1)
        expect(list[1]).toHaveBeenCalledTimes(1)
        expect(list[2]).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledTimes(3)
        expect(cb).toHaveBeenCalledWith(0)
        expect(cb).toHaveBeenCalledWith(1)
        expect(cb).toHaveBeenCalledWith(2)
      })
  })

  it('should not execute the callback after a failed function', () => {
    // given
    const list = [
      buildMockFunction(),
      buildMockFunction({ shouldFail: true }),
      buildMockFunction()
    ]

    // when
    const cb = jest.fn()
    return executeSequentially(list, 0, cb)
      .then(
        () => { throw new Error('should not resolve') },
        () => {
          // then
          expect(list[0]).toHaveBeenCalledTimes(1)
          expect(list[1]).toHaveBeenCalledTimes(1)
          expect(list[2]).toHaveBeenCalledTimes(0)
          expect(cb).toHaveBeenCalledTimes(2)
          expect(cb).toHaveBeenCalledWith(0)
          expect(cb).toHaveBeenCalledWith(1)
          expect(cb).not.toHaveBeenCalledWith(2)
        }
      )
  })
})

function buildMockFunction ({ timeout = 0, shouldFail = false, rejectWith = null, cb = () => {} } = {}) {
  return jest.fn(() => new Promise((resolve, reject) => {
    setTimeout(() => {
      cb()

      if (shouldFail) {
        reject(rejectWith)
      } else {
        resolve()
      }

    }, timeout)
  }))
}
