import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "https://shuckz77.github.io/PWCJR/", // your repo name with leading and trailing slash
  plugins: [react()],
});
