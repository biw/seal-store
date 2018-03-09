# seal-store

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![twitter][twitter-badge]][twitter]

[![Nice Seal Drawing][sealImage]][sealImageLink]


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

Properties of the state object must be defined in the `initState` and cannot be removed.

```js
const { state, setState } = initState({
  saxPlayingSeal: 'looking good',
})

setState({ fish: 'in water' }) // => throws TypeError
```

This rule is true infinitely deep.
```js
const { state, setState } = initState({
  secondLevel: { thirdLevel: { fourthLevel: { 'saxPlayingSeal': 'looking good' } } }
})

setState({ secondLevel: { thirdLevel: { fourthLevel: { fish: 'in water' } } } }) // => throws TypeError
```

There is one exception to adding/removing properties: arrays can shrink or grow. However, in any objects inside of them (other than arrays) properties cannot be added/removed.
```js
const { state, setState } = initState({
  sealsInDocs: [{ name: 'spinningSeal' }],
})

setState({ sealsInReadme: [...state.sealsInReadme, { name: 'happySeal' }] }) // this is fine

setState({ sealsInReadme: [] }) // this is also fine
```

`seal-store` also comes with the ability to add a callback when any key in the state is updated.
```js
const stateHasBeenUpdated = (newState) => { console.log('the state has updated') }

const { state, setState } = initState({
  updated: false,
}, stateHasBeenUpdated)

setState({ updated: true }) // => 'the state has been updated'
```

Unlike other state stores, `seal-store` doesn't need spread syntax (`{ ...items }`) for changes that apply to child objects

```js
const { state, setState } = initState({
  secondLevel: {
    updated: false,
    stillHere: true,
  },
})

setState({ secondLevel: { updated: true } })

console.log(state) // => { secondLevel: { updated: true, stillHere: true } }
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

## Proxy & `object.entries` Support

`seal-store` uses `proxy` objects. If you need to provide IE support, you'll need a [proxy polyfill](https://github.com/GoogleChrome/proxy-polyfill). You can look at the full compatibility table on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

`seal-store` also uses the `object.entries` method. If you need to provide IE or Node <7 support, you'll need an [`object.entries` polyfill](https://github.com/es-shims/Object.entries). You can look at the full compatibility table on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries).

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
