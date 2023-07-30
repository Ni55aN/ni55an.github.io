import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
    checker({
      typescript: true,
      overlay: false
    }),
  ],
});
