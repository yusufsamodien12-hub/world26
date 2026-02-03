import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isProd = mode === 'production';

    return {
      base: '/',
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html')
          }
        }
      },
      envPrefix: 'VITE_',
      define: {
        'import.meta.env.VITE_PROXY_URL': JSON.stringify(
          isProd 
            ? 'https://ai-proxy-cloudflare-worker.yusufsamodin67.workers.dev'
            : undefined
        ),
        'import.meta.env.VITE_PROXY_TOKEN': JSON.stringify(
          isProd 
            ? 'public-access-token-2026'
            : undefined
        )
      },
      server: {
        port: 4000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        noDiscovery: true
      },
      ssr: {
        noExternal: []
      }
    };
});
