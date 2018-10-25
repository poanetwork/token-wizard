import executeSequentially from '../../src/utils/executeSequentially'

describe('executeSequentially', () => {
  it('should resolve if the list is empty', () => {
    // given
    const list = []

    // when
    return executeSequentially(list).then(() => {
      // then
      // it should resolve
    })
  })

  it('should execute all the functions in the list', () => {
    // given
    const list = [jest.fn().mockReturnValue(Promise.resolve())]

    // when
    return executeSequentially(list).then(() => {
      // then
      expect(list[0]).toHaveBeenCalledTimes(1)
    })
  })

  it('should wait for function to finish', () => {
    // given
    let finished = 0

    const list = [
      buildMockFunction({ timeout: 100, before: () => finished++ }),
      buildMockFunction({ timeout: 50, before: () => finished++ })
    ]

    // when
    return executeSequentially(list).then(() => {
      // then
      expect(list[0]).toHaveBeenCalledTimes(1)
      expect(list[1]).toHaveBeenCalledTimes(1)
      expect(finished).toBe(2)
    })
  })

  it('should return index of the function that failed (last function fails)', () => {
    // given
    const list = [buildMockFunction(), buildMockFunction(), buildMockFunction({ shouldFail: true })]

    // when
    return executeSequentially(list).then(
      () => {
        throw new Error('should not resolve')
      },
      ([err, index]) => {
        expect(index).toBe(2)
      }
    )
  })

  it('should return index of the function that failed (first function rejects)', () => {
    // given
    const list = [buildMockFunction({ shouldFail: true }), buildMockFunction(), buildMockFunction()]

    // when
    return executeSequentially(list).then(
      () => {
        throw new Error('should not resolve')
      },
      ([err, index]) => {
        expect(index).toBe(0)
      }
    )
  })

  it('should return index of the function that failed (first function throws)', () => {
    // given
    const list = [buildMockFunction({ shouldFail: true }), buildMockFunction(), buildMockFunction()]

    // when
    return executeSequentially(list).then(
      () => {
        throw new Error('should not resolve')
      },
      ([err, index]) => {
        expect(index).toBe(0)
      }
    )
  })

  it('should not execute the functions after the function that failed', () => {
    // given
    let finished = 0

    const list = [
      buildMockFunction({ shouldFail: true, before: () => finished++ }),
      buildMockFunction(),
      buildMockFunction()
    ]

    // when
    return executeSequentially(list).then(
      () => {
        throw new Error('should not resolve')
      },
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
      buildMockFunction({
        shouldFail: true,
        rejectWith: ERR,
        before: () => {
          finished++
        }
      }),
      buildMockFunction(),
      buildMockFunction()
    ]

    // when
    return executeSequentially(list).then(
      () => {
        throw new Error('should not resolve')
      },
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
    const list = [buildMockFunction(), buildMockFunction(), buildMockFunction()]

    // when
    return executeSequentially(list, 1).then(() => {
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
    return executeSequentially(list, 2).then(
      () => {
        throw new Error('should not resolve')
      },
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
    const list = [buildMockFunction(), buildMockFunction(), buildMockFunction()]

    // when
    const before = jest.fn()
    return executeSequentially(list, 0, before).then(() => {
      // then
      expect(list[0]).toHaveBeenCalledTimes(1)
      expect(list[1]).toHaveBeenCalledTimes(1)
      expect(list[2]).toHaveBeenCalledTimes(1)
      expect(before).toHaveBeenCalledTimes(3)
      expect(before).toHaveBeenCalledWith(0)
      expect(before).toHaveBeenCalledWith(1)
      expect(before).toHaveBeenCalledWith(2)
    })
  })

  it(`should not execute 'before' callback after a failed function`, () => {
    // given
    const list = [buildMockFunction(), buildMockFunction({ shouldFail: true }), buildMockFunction()]

    // when
    const before = jest.fn()
    return executeSequentially(list, 0, before).then(
      () => {
        throw new Error('should not resolve')
      },
      () => {
        // then
        expect(list[0]).toHaveBeenCalledTimes(1)
        expect(list[1]).toHaveBeenCalledTimes(1)
        expect(list[2]).toHaveBeenCalledTimes(0)
        expect(before).toHaveBeenCalledTimes(2)
        expect(before).toHaveBeenCalledWith(0)
        expect(before).toHaveBeenCalledWith(1)
        expect(before).not.toHaveBeenCalledWith(2)
      }
    )
  })

  it(`should call 'after' callback right before the failing function`, () => {
    // Given
    const list = [buildMockFunction(), buildMockFunction({ shouldFail: true }), buildMockFunction()]

    // When
    const before = jest.fn()
    const after = jest.fn()
    return executeSequentially(list, 0, before, after).then(
      () => {
        throw new Error('should not resolve')
      },
      () => {
        // Then
        expect(list[0]).toHaveBeenCalledTimes(1)
        expect(list[1]).toHaveBeenCalledTimes(1)
        expect(list[2]).toHaveBeenCalledTimes(0)
        expect(after).toHaveBeenCalledTimes(1)
        expect(after).toHaveBeenCalledWith(0)
        expect(after).not.toHaveBeenCalledWith(1)
        expect(after).not.toHaveBeenCalledWith(2)
      }
    )
  })
})

function buildMockFunction({
  timeout = 0,
  shouldFail = false,
  rejectWith = null,
  before = () => {},
  after = () => {}
} = {}) {
  return jest.fn(
    () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          before()

          if (shouldFail) {
            reject(rejectWith)
          } else {
            after()
            resolve()
          }
        }, timeout)
      })
  )
}
