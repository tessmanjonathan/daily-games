import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/daily-games/',  // Replace with your repo name
  plugins: [react()],
})