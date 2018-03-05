import deepFreeze from 'deep-freeze-strict'

const isObject = (obj) => {
  try {
    return Object.getPrototypeOf(obj) === Object.getPrototypeOf({})
  } catch (_) {
    return false
  }
}

const subSetter = (obj, edits, topLevel = false) => {
  Object.entries(edits).forEach(([key, value]) => {
    if ({}.hasOwnProperty.call(obj, key) === true || Array.isArray(obj)) {
      if (typeof obj[key] === 'object') {
        subSetter(obj[key], edits[key])
      }
      if (topLevel) {
        let newValue = value
        if (isObject(obj[key]) === true) {
          // there could be an issue here with hitting max stack limit
          // for very deep trees
          newValue = Object.assign({}, value)
        }
        obj[key] = newValue // eslint-disable-line no-param-reassign
        deepFreeze(obj[key])
      }
    } else {
      throw new TypeError(`The key '${key}' is not in the object '${obj}'`)
    }
  })
}

const sealStore = (initState = {}, callback = () => {}) => {
  let initalized = false

  const sealProxy = (proxyObj) => {
    const get = (target, prop) => target[prop]

    const set = (target, prop, value) => {
      if (initalized === true) {
        const err = `Cannot assign to read only property '${prop}' of ${target}`
        throw new TypeError(err)
      } else {
        target[prop] = value // eslint-disable-line no-param-reassign
        return true
      }
    }
    const api = {
      get,
      set,
    }

    return new Proxy(proxyObj, api)
  }

  const copyInitState = Object.assign({}, initState)
  const baseObject = sealProxy(copyInitState)

  const setState = (edits = {}) => {
    initalized = false
    subSetter(baseObject, edits, true)
    initalized = true
    callback(baseObject)
  }

  Object.keys(baseObject).forEach((key) => {
    deepFreeze(baseObject[key])
  })

  initalized = true

  return {
    state: baseObject,
    setState,
  }
}

export default sealStore
