import path from 'node:path'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import zipPack from 'vite-plugin-zip-pack'
import tailwind from 'tailwindcss'
import manifest from './manifest.json'
import biomePlugin from 'vite-plugin-biome'

export default defineConfig({
  build: {
    minify: 'esbuild',
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  output: {
    sourcemap: 'inline',
  },
  plugins: [
    crx({ manifest }),
    biomePlugin({
      mode: 'check',
      files: '.',
      applyFixes: true,
      failOnError: true,
    }),
    zipPack({ outDir: './' })
  ],
  css: {
    // https://github.com/vitejs/vite/discussions/8216
    modules: {
      scopeBehaviour: 'global',
    },
    postcss: {
      plugins: [tailwind()],
    },
  },
})
