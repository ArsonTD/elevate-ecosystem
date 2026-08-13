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
  vite: {
    /**
     * three y gsap solo los importan islas concretas (el prisma del
     * About), así que Vite los descubría tarde en dev, re-optimizaba a
     * mitad de vuelo y la petición del módulo moría con 504 "Outdated
     * Optimize Dep": la isla no hidrataba y el prisma no aparecía.
     * Declararlos por adelantado evita esa re-optimización.
     */
    optimizeDeps: {
      include: ['three', 'gsap', 'gsap/ScrollTrigger', 'lenis'],
    },
  },
})
