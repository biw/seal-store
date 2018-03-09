import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
  output: [
    {
      file: pkg.main, format: 'cjs', sourcemap: true,
    },
    {
      file: pkg.module, format: 'es', sourcemap: true,
    },
    {
      name: 'sealStore', file: pkg['umd:main'], format: 'umd', sourcemap: true,
    },
  ],
}
