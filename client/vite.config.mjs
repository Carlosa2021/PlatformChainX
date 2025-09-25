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
    },
    resolve: {
      alias: {},
    },
  };
});
