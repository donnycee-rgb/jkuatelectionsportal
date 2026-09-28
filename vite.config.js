import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' lets the built site run from any folder on any static host
// (GitHub Pages sub-paths, Netlify, Vercel, cPanel, Firebase Hosting).
export default defineConfig({
  plugins: [react()],
  base: './',
});
