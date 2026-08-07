# Elevate — Ecosystem website

Sitio del grupo Elevate (Knoxville, TN): un único punto de entrada que
presenta a las empresas de oficios del grupo y enruta cada solicitud a
la empresa correcta.

## Stack

Astro 5 · React 19 (islas) · GSAP + ScrollTrigger · Lenis · Three.js

Cada ruta es una página estática de Astro (`src/pages/*.astro`) que
pre-renderiza y monta las vistas React de `src/views/` como islas
(`client:load`). Las animaciones y la interacción siguen siendo los
mismos componentes React de siempre.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # sale en dist/
npm run preview
```

## Estructura

| Ruta | Contenido |
|---|---|
| `/` | Hero de video, marquee de empresas, escenarios y CTA |
| `/about` | Historia del ecosistema, prisma 3D, cómo funciona, valores |
| `/companies` | Grid filtrable de empresas |
| `/companies/[slug]` | Ficha de empresa: servicios, galería y cross-discovery |
| `/team` | Equipo completo |
| `/contact` | Formulario router por servicio |

Los datos de las empresas (descripciones, logos, fotos, links y el mapa
servicio → empresa del formulario) viven en un solo sitio:
`src/lib/companies.js`. El equipo, en `src/lib/team.js`.

## Despliegue

`.github/workflows/deploy.yml` publica en GitHub Pages con cada push a
`main`. El build recibe `VITE_BASE=/<repo>/` porque el sitio se sirve
desde un subdirectorio (lo lee `astro.config.mjs`). Astro genera un
HTML real por ruta más su propio `404.html`, así que ya no hace falta
el fallback del SPA.

## Pendiente

- Backend del formulario (Cloudflare Workers + Resend) con el mapa
  servicio → inbox que defina Elevate.
- Contenido real de las empresas: ver las notas al inicio de
  `src/lib/companies.js`.
- Retratos del equipo (hoy se muestran iniciales sobre gradiente).
