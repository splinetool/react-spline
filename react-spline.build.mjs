import esbuild from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';

esbuild
  .build({
    entryPoints: ['src/lib/Spline.tsx', 'src/lib/Spline.css'],
    outdir: './build',
    minify: true,
    target: browserslistToEsbuild(),
    format: 'esm',
    tsconfig: './react-spline.tsconfig.json',
  })
  .catch(() => process.exit(1));
