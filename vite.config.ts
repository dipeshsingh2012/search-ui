import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import fs from 'node:fs';
import path from 'node:path';

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
    {
      name: 'serve-federation-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/assets/')) {
            const cleanUrl = req.url.split('?')[0];
            const filePath = path.resolve(__dirname, 'dist', cleanUrl.replace(/^\//, ''));
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', '*');
              if (filePath.endsWith('.js')) {
                res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
              } else if (filePath.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css; charset=utf-8');
              }
              return fs.createReadStream(filePath).pipe(res);
            }
          }
          next();
        });
      },
    },
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5179,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 5179,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
