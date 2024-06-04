import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import preserveDirectives from 'rollup-preserve-directives';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preserveDirectives(), renameNodeModules('external')],
  root: 'example',
  build: {
    lib: {
      entry: {
        ['react-spline']: path.resolve(__dirname, './src/Spline.tsx'),
        ['react-spline-next']: path.resolve(
          __dirname,
          './src/next/SplineNext.tsx'
        ),
      },
      name: 'react-spline',
      formats: ['es'],
      fileName: (format, alias) => `${alias}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        '@splinetool/runtime',
        'next/image',
      ],
      output: {
        // Override dist folder because root is in the example/ folder
        dir: 'dist',
        // Needed by preserveDirectives()
        preserveModules: true,
      },
    },
  },
});
