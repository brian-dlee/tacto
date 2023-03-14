import { defineConfig } from 'tsup';

export default defineConfig({
  clean: false,
  dts: true,
  outDir: 'dist',
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
});
