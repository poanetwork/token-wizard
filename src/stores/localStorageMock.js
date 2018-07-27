class localStorageMock {
  constructor() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key]
  }

  setItem(key, value) {
    this.store[key] = value.toString()
  }

  clear() {
    this.store = {}
  }
  removeItem(key) {
    delete this.store[key]
  }
}

export default localStorageMock
