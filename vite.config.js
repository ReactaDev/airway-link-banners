import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    fs: {
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/Airwaylink Banner Studio.html', '**/Previous Versions/**', '**/upload/**'],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
});
