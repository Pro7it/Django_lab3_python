import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
  watch: {
    usePolling: true,
    interval: 1000
  },
  host: true,
}
})
