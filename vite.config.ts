import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
        {
          src: 'public/icons',
          dest: '.',
        }
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        background: './src/background.js',
        contentScript: './src/contentScript.js',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'contentScript' ? 'contentScript.js' : '[name].js';
        },
      },
    },
  },
});