import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    target: 'node18',
    outDir: 'dist',
    clean: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    dts: false,
  },
  {
    entry: ['src/cli/index.ts'],
    format: ['esm'],
    target: 'node18',
    outDir: 'dist/cli',
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: false,
    dts: false,
  },
])
