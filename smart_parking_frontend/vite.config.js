import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Read custom port from env, fallback to 3000
const customPort = parseInt(process.env.VITE_PORT) || 3000

export default defineConfig({
  server: {
    port: customPort,
  },
  plugins: [react(), tailwindcss()],
})
