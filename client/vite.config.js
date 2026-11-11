// The proxy makes the browser believe /api lives on the same origin as the
// client during local dev. In production the client calls the real server URL;
import { defineconfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
             // habit is right because it will matter once you add Supabase or a CDN.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        },
    },
},
});