import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
    checker({
      typescript: true,
      overlay: false
    }),
    VitePluginRadar({
      analytics: {
        id: 'G-9Q2N23SRQJ',
      },
    })
  ],
});
