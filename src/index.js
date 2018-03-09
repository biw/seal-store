const isObject = (obj) => {
  try {
    return Object.getPrototypeOf(obj) === Object.getPrototypeOf({})
  } catch (_) {
    return false
  }
}

const subSetter = (baseObject, edits) => {
  Object.entries(edits).forEach(([key, value]) => {
    const keyInObject = {}.hasOwnProperty.call(baseObject, key) === true

    if (keyInObject === false && Array.isArray(baseObject) === false) {
      throw new TypeError(`The key '${key}' is not in the object '${baseObject}'`)
    }

    if (Array.isArray(baseObject[key]) === true) {
      baseObject[key] = [ ...baseObject[key] ] // unfreeze the object
      subSetter(baseObject[key], value)
      Object.freeze(baseObject[key]) // refreeze the objet
    } else if (typeof baseObject[key] === 'object') {
      baseObject[key] = { ...baseObject[key] } // unfreeze the object
      subSetter(baseObject[key], value)
      Object.freeze(baseObject[key]) // refreeze the objet
      return
    }

    baseObject[key] = value
  })
}

const freezedCopy = (baseObject) => {
  Object.entries(baseObject).forEach(([key, value]) => {
    if (Array.isArray(baseObject[key]) === true) {
      baseObject[key] = [ ...baseObject[key] ]
      baseObject[key] = freezedCopy(baseObject[key])
      Object.freeze(baseObject[key])
    } else if (typeof baseObject[key] === 'object') {
      baseObject[key] = { ...baseObject[key] }
      baseObject[key] = freezedCopy(baseObject[key])
      Object.freeze(baseObject[key])
    }
  })
  return baseObject
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

  const shallowInitStateCopy = { ...initState }
  const internalState = freezedCopy(shallowInitStateCopy)
  const baseObject = sealProxy(internalState)

  const setState = (edits = {}) => {
    initalized = false
    subSetter(baseObject, edits, true)
    initalized = true
    callback(baseObject)
  }

  initalized = true

  return {
    state: baseObject,
    setState,
  }
}

export default sealStore
