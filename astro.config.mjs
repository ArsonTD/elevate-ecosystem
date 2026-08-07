import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  /**
   * En GitHub Pages el sitio vive en https://usuario.github.io/<repo>/,
   * así que el build necesita ese prefijo. El workflow lo inyecta con
   * VITE_BASE; en local queda en "/".
   */
  base: process.env.VITE_BASE || '/',
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
