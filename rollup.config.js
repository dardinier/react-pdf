import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import copy from 'rollup-plugin-copy'
import svgr from '@svgr/rollup'

import config from './package.json'

export default {
  input: 'src/index.jsx',
  output: [
    {
      file: config.main,
      format: 'cjs',
    },
  ],
  plugins: [
    external(),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve({
      extensions: [ '.js', '.jsx' ],
      preferBuiltins: true
    }),
    commonjs({
      namedExports: {
        'pdfjs-dist/web/pdf_viewer': [ 'PDFViewer' ]
      }
    }),
    copy({
      targets: [
        { src: 'src/scss/index.scss', dest: 'dist/', rename: () => 'react-pdf.scss' },
      ]
    })
  ]
}
