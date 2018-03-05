# seal-store

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![twitter][twitter-badge]][twitter]

[![Seal Playing Saxophone][sealImage]][sealImageLink]


A simple framework agnostic state store where the `state` object is immutable by any means other than a `setState` function.

```js
import initState from 'seal-store'

const { state, setState } = initState({
  saxPlayingSeal: 'looking good',
})

state.saxPlayingSeal = 'looking bad' // => throws TypeError

console.log(state.saxPlayingSeal) // looking good

setState({ saxPlayingSeal: 'looking good but getting dizzy' })

console.log(state.saxPlayingSeal) // looking good but is getting dizzy
```

Properties of the state object must be defined in the `initState`.

```js
const { state, setState } = initState({
  saxPlayingSeal: 'looking good',
})

setState({ fish: 'in water' }) // => throws TypeError
```

This rule in true infinity deep.
```js
const { state, setState } = initState({
  secondLevel: { thirdLevel: { fourthLevel: { 'saxPlayingSeal': 'looking good' } } }
})

setState({ secondLevel: { thirdLevel: { fourthLevel: { fish: 'in water' }) // => throws TypeError
```

There is one exception to adding properties: arrays can shrink or grow. However, any objects inside of them (other than arrays) properties cannot be added.
```js
const { state, setState } = initState({
  sealsInDocs: [{ name: 'spinningSeal' }],
})

setState({ sealsInReadme: [...state.sealsInReadme, { name: 'happySeal' }] }) // this is fine

setState({ sealsInReadme: [] }) // this is also fine
```

`seal-store` also comes with the ability to add an event callback when the state is updated.
```js
const stateHasBeenUpdated = (newState) => { console.log('the state has updated') }

const { state, setState } = initState({
  updated: false,
}, stateHasBeenUpdated)

setState({ updated: true }) // => 'the state has been updated'
```


## Install

```sh
yarn add seal-store
```
or
```sh
npm add --save seal-store
```
<!-- or as a script tag
```html
<script src="https://unpkg.com/seal-store/dist/seal-store.umd.js"></script>
<script type="application/javascript">
  const { state, setState } = window.sealStore({ 'saxPlayingSeal': 'looking good' })
</script>
``` -->

## A note on children objects
Currently, you cannot add properties to child object in the state tree. You can however, removed properties, in order to not have confusing syntax. (this may change in the v1.0.0 release of `seal-store`)

```js
const { state, setState } = initState({
  user: {
    name: 'Ben',
    twitter: '719ben',
    github: null,
  },
})

setState({
  user: {
    ...state.user, // use spread syntax if you don't want edit all child object keys
    github: '719ben',
  },
})

console.log(state) // { user: { name: 'Ben', twitter: '719ben', github: '719ben' } }

// if we don't use spread syntax, keys will be dropped
setState({
  user: {
    github: '719ben',
  }
})

console.log(state) // { user: { github: '719ben' } }
```

## Proxy Support

`seal-store` uses `proxy` objects. If you need to provide IE support, you'll need a [proxy polyfill](https://github.com/GoogleChrome/proxy-polyfill). You can look at the full compatibility table on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## LICENSE
MIT © [Ben Williams](https://719ben.com)

[sealImageLink]: https://www.youtube.com/watch?v=X0k7N0ASfp8
[sealImage]: https://media2.giphy.com/media/ySz02sRVFK372/giphy.gif
[build-badge]: https://img.shields.io/travis/719Ben/seal-store.svg?style=flat-square
[build]: https://travis-ci.org/719Ben/seal-store
[version-badge]: https://img.shields.io/npm/v/seal-store.svg?style=flat-square
[package]: https://www.npmjs.com/package/seal-store
[license-badge]: https://img.shields.io/npm/l/seal-store.svg?style=flat-square
[license]: https://github.com/719ben/seal-store/blob/master/LICENSE
[twitter-badge]: https://img.shields.io/twitter/follow/719ben.svg?style=flat-square&logo=twitter&label=Follow
[twitter]: https://twitter.com/719ben
