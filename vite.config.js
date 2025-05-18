import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // serve at ‘/’ in dev, but build to “/react-blog-app/” in prod
  base: command === 'serve'
    ? '/'                    // dev‐server URL: http://localhost:5173/
    : '/react-blog-app/',    // production build
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5173,
  },
}))


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   base: '/react-blog-app/',
//   build: {
//     outDir: "dist", // Change 'dist' to 'build'
//   },
//   server: {
//     host: true,      // shorthand for 0.0.0.0
//     port: 5173,
//   },
// })
