import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'build/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production
      }
    }),
    css({ output: 'bundle.css' }),

    nodeResolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    !production && livereload('_site'),

    production && terser()

  ],
  watch: {
    clearScreen: false
  }
}
