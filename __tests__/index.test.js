import deepFreeze from 'deep-freeze-strict'
import initStore from '../src'

const { test, expect, describe } = global

describe('1st level state cannot be changed without setState', () => {
  test('safe object type', () => {
    const { state } = initStore()

    expect(typeof state).toBe('object')
  })

  test('correct prototype', () => {
    const { state } = initStore({
      stringKey: 'test',
    })

    expect(Object.getPrototypeOf(state)).toMatchSnapshot()
  })

  test('explicit empty object', () => {
    const { state } = initStore({})

    expect(() => {
      state.numberKey = 1
    }).toThrowErrorMatchingSnapshot()
  })

  test('implict empty object', () => {
    const { state } = initStore()

    expect(() => {
      state.numberKey = 1
    }).toThrowErrorMatchingSnapshot()
  })

  test('number', () => {
    const { state } = initStore({
      numberKey: 1,
    })

    expect(() => {
      state.numberKey = 2
    }).toThrowErrorMatchingSnapshot()
  })

  test('string', () => {
    const { state } = initStore({
      stringKey: 'test',
    })

    expect(() => {
      state.stringKey = 'new test'
    }).toThrowErrorMatchingSnapshot()
  })

  test('boolean', () => {
    const { state } = initStore({
      booleanKey: true,
    })

    expect(() => {
      state.booleanKey = false
    }).toThrowErrorMatchingSnapshot()
  })

  test('empty array', () => {
    const { state } = initStore({
      arrayKey: [],
    })

    expect(() => {
      state.arrayKey.push(1)
    }).toThrowErrorMatchingSnapshot()
  })

  test('object', () => {
    const { state } = initStore({
      emptyObjectKey: {},
    })

    expect(() => {
      state.emptyObjectKey = {}
    }).toThrowErrorMatchingSnapshot()
  })
})

describe('2nd level state cannot be changed without setState', () => {
  // only going to test one primative type
  test('number', () => {
    const { state } = initStore({
      secondLevel: {
        numberKey: 1,
      },
    })

    expect(() => {
      state.secondLevel.numberKey = 2
    }).toThrowErrorMatchingSnapshot()
  })

  test('empty array', () => {
    const { state } = initStore({
      secondLevel: {
        arrayKey: [],
      },
    })

    expect(() => {
      state.secondLevel.arrayKey.push(1)
    }).toThrowErrorMatchingSnapshot()
  })

  test('2d array', () => {
    const { state } = initStore({
      secondLevel: [
        [],
      ],
    })

    expect(() => {
      state.secondLevel[0].push(1)
    }).toThrowErrorMatchingSnapshot()
  })

  test('1d array with child object', () => {
    const { state } = initStore({
      secondLevel: [
        {
          testKey: 'test',
        },
      ],
    })

    expect(() => {
      state.secondLevel[0].testKey = 'bad test'
    }).toThrowErrorMatchingSnapshot()
  })

  test('object with object child', () => {
    const { state } = initStore({
      secondLevel: {
        emptyObjectKey: {},
      },
    })

    expect(() => {
      state.secondLevel.emptyObjectKey = {}
    }).toThrowErrorMatchingSnapshot()
  })
})

describe('Object keys cannot be added with setState', () => {
  test('1st level', () => {
    const { setState } = initStore({
      firstKey: 'test',
    })

    expect(() => {
      setState({ firstKey: 'new test', secondKey: 'fail test' })
    }).toThrowErrorMatchingSnapshot()
  })

  test('2nd level', () => {
    const { state, setState } = initStore({
      secondLevel: {
        firstKey: 'test',
      },
    })

    expect(() => {
      setState({
        secondLevel: {
          ...state.secondLevel,
          secondKey: 'fail test',
        },
      })
    }).toThrowErrorMatchingSnapshot()
  })

  test('10th level', () => {
    const { state, setState } = initStore({
      secondLevel: {
        thirdLevel: {
          fourthLevel: {
            fifthLevel: {
              sixthLevel: {
                seventhLevel: {
                  eighthLevel: {
                    ninthLevel: {
                      tenthLevel: {
                        stringKey: 'test',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    expect(() => {
      setState({
        secondLevel: {
          ...state.secondLevel,
          thirdLevel: {
            ...state.thirdLevel,
            fourthLevel: {
              ...state.fourthLevel,
              fifthLevel: {
                ...state.fifthLevel,
                sixthLevel: {
                  ...state.sixthLevel,
                  seventhLevel: {
                    ...state.seventhLevel,
                    eighthLevel: {
                      ...state.eighthLevel,
                      ninthLevel: {
                        ...state.ninthLevel,
                        tenthLevel: {
                          ...state.tenthLevel,
                          stringKey2: 'test',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
    }).toThrowErrorMatchingSnapshot()
  })
})

describe('Object keys can be changed with setState', () => {
  test('1st level', () => {
    const { state, setState } = initStore({
      stringKey: 'test',
    })

    setState({ stringKey: 'new test' })

    expect(state).toMatchSnapshot()
  })

  test('2nd level', () => {
    const { state, setState } = initStore({
      secondLevel: {
        stringKey: 'test',
        numberKey: 1,
      },
    })

    setState({
      secondLevel: {
        stringKey: 'new test',
      },
    })

    expect(state).toMatchSnapshot()
  })

  test('10th level state can be changed with setState', () => {
    const { state, setState } = initStore({
      secondLevel: {
        thirdLevel: {
          fourthLevel: {
            fifthLevel: {
              sixthLevel: {
                seventhLevel: {
                  eighthLevel: {
                    ninthLevel: {
                      tenthLevel: {
                        stringKey: 'test',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    setState({
      secondLevel: {
        ...state.secondLevel,
        thirdLevel: {
          ...state.thirdLevel,
          fourthLevel: {
            ...state.fourthLevel,
            fifthLevel: {
              ...state.fifthLevel,
              sixthLevel: {
                ...state.sixthLevel,
                seventhLevel: {
                  ...state.seventhLevel,
                  eighthLevel: {
                    ...state.eighthLevel,
                    ninthLevel: {
                      ...state.ninthLevel,
                      tenthLevel: {
                        ...state.tenthLevel,
                        stringKey: 'new test',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    expect(state).toMatchSnapshot()
  })
})

describe('underlying state Object is a deep copy of the input', () => {
  test('2nd level deep', () => {
    const { state, setState } = initStore({
      secondLevel: {
        stringKey: 'test',
      },
    })

    const change = {
      secondLevel: {
        stringKey: 'new test',
      },
    }

    setState(change)

    expect(state.secondLevel).not.toBe(change.secondLevel)
  })

  test('3rd level deep', () => {
    const { state, setState } = initStore({
      secondLevel: {
        thirdLevel: {
          stringKey: 'test',
        },
      },
    })

    const change = {
      secondLevel: {
        thirdLevel: {
          stringKey: 'new test',
        },
      },
    }

    setState(change)

    expect(state.secondLevel).not.toBe(change.secondLevel)
  })

  test('3rd level deep deepFreeze()', () => {
    const { state, setState } = initStore({
      secondLevel: {
        thirdLevel: {
          stringKey: 'test',
        },
      },
    })

    const change = deepFreeze({
      secondLevel: {
        thirdLevel: {
          stringKey: 'new test',
        },
      },
    })

    setState(change)

    expect(state).toEqual(change)
  })
})

describe('sub-object keys are removed if setState does not specify them', () => {
  test('2nd level deep', () => {
    const { state, setState } = initStore({
      secondLevel: {
        numberKey: 1,
        stringKey: 'test',
      },
    })

    setState({
      secondLevel: {
        numberKey: 2,
      },
    })

    expect(state).toMatchSnapshot()
  })

  test('3rd level deep', () => {
    const { state, setState } = initStore({
      secondLevel: {
        thirdLevel: {
          numberKey: 2,
          stringKey: 'test',
        },
      },
    })

    setState({
      secondLevel: {
        thirdLevel: {
          numberKey: 3,
        },
      },
    })

    expect(state).toMatchSnapshot()
  })
})

describe('Arrays', () => {
  test('can grow', () => {
    const { state, setState } = initStore({
      arrayKey: [],
    })

    setState({
      arrayKey: ['test'],
    })

    expect(state).toMatchSnapshot()
  })

  test('can change children', () => {
    const { state, setState } = initStore({
      arrayKey: ['test'],
    })

    setState({
      arrayKey: [1],
    })

    expect(state).toMatchSnapshot()
  })

  test('have correct prototype', () => {
    const { state, setState } = initStore({
      arrayKey: ['test'],
    })

    setState({
      arrayKey: [],
    })

    expect(Object.getPrototypeOf(state.arrayKey)).toMatchSnapshot()
  })
})

describe('Callback function', () => {
  test('gets called when state is updated', () => {
    const callback = jest.fn((state) => { expect(state).toMatchSnapshot() })

    const { setState } = initStore({
      stringKey: 'test',
    }, callback)

    setState({ stringKey: 'new test' })

    expect(callback).toHaveBeenCalled()
  })
})
