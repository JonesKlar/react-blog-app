import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/react-blog-app/',
  build: {
    outDir: "build", // Change 'dist' to 'build'
  },
  server: {
    host: true,      // shorthand for 0.0.0.0
    port: 5173,
  },
})
