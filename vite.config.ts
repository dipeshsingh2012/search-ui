import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'searchUi',
      filename: 'remoteEntry.js',
      exposes: {
        './SearchModal': './src/components/SearchModal.tsx',
        './SearchFragment': './src/components/SearchFragment.tsx',
        './SearchBar': './src/components/SearchBar.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5179,
  },
});
