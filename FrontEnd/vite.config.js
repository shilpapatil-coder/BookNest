import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),],
   server: {
    watch: {
      ignored: ['**/.vs/**'] // This tells Vite to ignore Visual Studio's hidden folder
    }
  }
})
