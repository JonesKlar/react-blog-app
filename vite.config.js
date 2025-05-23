import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'web.config', // relative to project root
    //       dest: ''           // copy to dist root
    //     }
    //   ]
    // })
  ],

  // serve at ‘/’ in dev, but build to “/react-blog-app/” in prod
  base: command === 'serve'
    ? '/'                    // dev‐server URL: http://localhost:5173/
    : mode === 'docker'
      ? '/'
      : '/react-blog-app/',    // production build
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5173,
  },
}))
