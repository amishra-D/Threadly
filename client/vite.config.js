import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
       screens: path.resolve(__dirname, './src/screens'),
      components: 'src/components',
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
