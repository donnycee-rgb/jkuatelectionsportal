import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// The public address of the site, used for link previews (Open Graph and
// Twitter cards need absolute URLs). Set VITE_SITE_URL in .env or in the
// host's environment variables if the site moves to another address.
const DEFAULT_SITE_URL = 'https://jkuat-french-club-elections.netlify.app';

// base: './' lets the built site run from any folder on any static host
// (GitHub Pages sub-paths, Netlify, Vercel, cPanel, Firebase Hosting).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).trim().replace(/\/+$/, '');
  return {
    plugins: [
      react(),
      {
        name: 'site-url',
        transformIndexHtml: {
          order: 'pre',
          handler: (html) => html.replaceAll('%SITE_URL%', siteUrl),
        },
      },
    ],
    base: './',
  };
});
