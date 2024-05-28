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
      entry: path.resolve(__dirname, './src/Spline.tsx'),
      name: 'react-spline',
      formats: ['es', 'cjs'],
      fileName: (format) => `react-spline.${format === 'es' ? 'js' : 'cjs'}`,
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
        if (file.type === 'chunk') {
          const chunk = file as OutputChunk;
          chunk.code = `${stringToPrepend}${chunk.code}`;
        }
      }
    },
  };
}
