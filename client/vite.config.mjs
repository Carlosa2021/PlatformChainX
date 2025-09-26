import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Se mantiene alias sólo si existiera código legacy; puede retirarse más adelante
      'import.meta.env.VITE_TW_CLIENT_ID': JSON.stringify(
        env.VITE_THIRDWEB_CLIENT_ID || '',
      ),
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('thirdweb')) return 'thirdweb';
            if (id.includes('ethers')) return 'ethers';
            if (
              id.includes('react-router') ||
              id.includes('react-dom') ||
              id.includes('/react/')
            )
              return 'react';
            if (id.includes('@headlessui') || id.includes('lucide-react'))
              return 'ui';
            return 'vendor';
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },
    resolve: {
      alias: {},
    },
  };
});
