import _ from 'lodash'

class Store {
  values = {}
  set = (key, value) => {
    this.values = {
      ...this.values,
      [key]: value
    }
  }
  get = (key) => {
    return this.values[key]
  }
  remove = (key) => {
    this.values = _.omit(key)
  }
}

export default Store
