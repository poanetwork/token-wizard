class FakeProvider {
  countId = 1
  response = []
  error = []
  validation = []
  notificationCallbacks = []

  getResponseStub = () => {
    return {
      jsonrpc: '2.0',
      id: this.countId,
      result: null
    }
  }

  getErrorStub = () => {
    return {
      jsonrpc: '2.0',
      id: this.countId,
      error: {
        code: 1234,
        message: 'Stub error'
      }
    }
  }

  send = payload => {
    assert.equal(isArray(payload) || isObject(payload), true)

    let error = this.getResponseOrError('error', payload)
    if (error) {
      throw new Error(error.error.message)
    }

    let validation = this.validation.shift()

    if (validation) {
      // imitate plain json object
      validation(JSON.parse(JSON.stringify(payload)))
    }

    return this.getResponseOrError('response', payload)
  }

  sendAsync = (payload, callback) => {
    // set id
    if (payload.id) {
      this.countId = payload.id
    }

    assert.equal(isArray(payload) || isObject(payload), true)
    assert.equal(isFunction(callback), true)

    let validation = this.validation.shift()

    if (validation) {
      // imitate plain json object
      validation(JSON.parse(JSON.stringify(payload)), callback)
    }

    let response = this.getResponseOrError('response', payload)
    let error = this.getResponseOrError('error', payload)

    setTimeout(function() {
      callback(error, response)
    }, 1)
  }

  on = (type, callback) => {
    if (type === 'notification') {
      this.notificationCallbacks.push(callback)
    }
  }

  getResponseOrError = (type, payload) => {
    let response

    if (type === 'error') {
      response = this.error.shift()
    } else {
      response = this.response.shift() || this.getResponseStub()
    }

    if (response) {
      if (isArray(response)) {
        response = response.map((resp, index) => {
          resp.id = payload[index] ? payload[index].id : this.countId++
          return resp
        })
      } else {
        response.id = payload.id
      }
    }

    return response
  }

  injectNotification = notification => {
    setTimeout(() => {
      this.notificationCallbacks.forEach(cb => {
        if (notification && cb) {
          cb(null, notification)
        }
      })
    }, 100)
  }

  enable = () => {
    return new Promise((resolve, reject) => {
      return resolve(true)
    })
  }

  injectResponse = response => {
    this.response = response
  }

  injectResult = result => {
    let response = this.getResponseStub()
    response.result = result

    this.response.push(response)
  }

  injectBatchResults = (results, error) => {
    this.response.push(
      results.map(r => {
        let response
        if (error) {
          response = this.getErrorStub()
          response.error.message = r
        } else {
          response = this.getResponseStub()
          response.result = r
        }
        return response
      })
    )
  }

  injectError = error => {
    var error = this.getErrorStub()
    error.error = error // message, code

    this.error.push(error)
  }

  injectValidation = callback => {
    this.validation.push(callback)
  }
}

let isArray = function(object) {
  return object instanceof Array
}

let isObject = function(object) {
  return typeof object === 'object'
}

let isFunction = function(object) {
  return typeof object === 'function'
}

let assert = {
  equal: function(a, b) {
    if (a !== b) {
      throw new Error('Expected "' + a + '" to equal "' + b + '"')
    }
  }
}

module.exports = FakeProvider
