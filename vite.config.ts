import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'example',
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'react-spline',
      fileName: (format) => `react-spline.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', '@splinetool/runtime'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          '@splinetool/runtime': 'SPRuntime',
        },
        dir: 'dist',
        format: 'esm',
      },
    },
  },
});
