import buble from 'rollup-plugin-buble'
import flow from 'rollup-plugin-flow'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

const name = 'sealStore'

export default {
  input: 'src/index.js',
  plugins: [
    flow(),
    buble(),
  ],
  output: [
    {
      name, file: pkg.main, format: 'cjs', sourcemap: true,
    },
    {
      name, file: pkg.module, format: 'es', sourcemap: true,
    },
    {
      name, file: pkg['umd:main'], format: 'umd', sourcemap: true,
    },
  ],
}
