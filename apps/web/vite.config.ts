import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const root = fileURLToPath(new URL('../..', import.meta.url));
  const env = loadEnv(mode, root, '');
  return {
    plugins: [react(), tailwindcss()],
    envDir: root,
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: Number(env.WEB_PORT ?? 5173), strictPort: true, proxy: { '/api': { target: env.API_BASE_URL ?? 'http://localhost:3000', changeOrigin: true } } },
    preview: { port: Number(env.WEB_PORT ?? 5173), strictPort: true },
  };
});
