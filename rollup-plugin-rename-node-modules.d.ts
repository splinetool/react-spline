declare module 'rollup-plugin-rename-node-modules' {
  import { Plugin } from 'vite';
  export default function renameNodeModules(name: string): Plugin;
}
