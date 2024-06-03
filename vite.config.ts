import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import type { OutputChunk } from 'rollup';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prependString('"use client";')],
  root: 'example',
  build: {
    lib: {
      entry: {
        ['react-spline']: path.resolve(__dirname, './src/Spline.tsx'),
        ['react-spline-next']: path.resolve(__dirname, './src/SplineNext.tsx'),
      },
      name: 'react-spline',
      formats: ['es', 'cjs'],
      fileName: (format, alias) => `${alias}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', '@splinetool/runtime'],
      output: {
        // Override dist folder because root is in the example/ folder
        dir: 'dist',
      },
    },
  },
});

function prependString(stringToPrepend: string = ''): Plugin {
  return {
    name: 'vite-plugin-prepend-string',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type === 'chunk' && !fileName.includes('next')) {
          const chunk = file as OutputChunk;
          chunk.code = `${stringToPrepend}${chunk.code}`;
        }
      }
    },
  };
}
