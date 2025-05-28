import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

  ],
  server: {
    host: '0.0.0.0',      // Cho phép truy cập qua LAN
    port: 5173,
    strictPort: true,
    hmr: {
      host: '192.168.1.42',  // IP LAN của bạn
      port: 5173
    }
  }



})
