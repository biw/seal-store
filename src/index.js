if (!Object.entries) {
  // Object.entries polyfill
  Object.entries = (obj) => {
    const ownProps = Object.keys(obj)
    let i = ownProps.length
    const resArray = new Array(i)
    while (i) {
      i -= 1
      resArray[i] = [ownProps[i], obj[ownProps[i]]]
    }

    return resArray
  }
}

const subSetter = (baseObject, edits) => {
  Object.entries(edits).forEach(([key, value]) => {
    const keyInObject = {}.hasOwnProperty.call(baseObject, key) === true

    if (keyInObject === false && Array.isArray(baseObject) === false) {
      const err = `The key '${key}' is not in the object '${baseObject}'`
      throw new TypeError(err)
    }

    if (Array.isArray(baseObject[key]) === true) {
      baseObject[key] = [...baseObject[key]] // unfreeze the object
      subSetter(baseObject[key], value)
      Object.freeze(baseObject[key]) // refreeze the objet
    } else if (typeof baseObject[key] === 'object' && baseObject[key] !== null) {
      baseObject[key] = { ...baseObject[key] } // unfreeze the object
      subSetter(baseObject[key], value)
      Object.freeze(baseObject[key]) // refreeze the objet
      return
    }

    baseObject[key] = value
  })
}

const freezedCopy = (baseObject) => {
  Object.keys(baseObject).forEach((key) => {
    if (Array.isArray(baseObject[key]) === true) {
      baseObject[key] = [...baseObject[key]]
      baseObject[key] = freezedCopy(baseObject[key])
      Object.freeze(baseObject[key])
    } else if (typeof baseObject[key] === 'object' && baseObject[key] !== null) {
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
        target[prop] = value
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
