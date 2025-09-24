export default {
  entry: ['src/cli/index.ts'],
  format: 'esm',
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: false,
  dts: false,
}
