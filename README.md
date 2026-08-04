# Elevate — Ecosystem website

Sitio del grupo Elevate (Knoxville, TN): un único punto de entrada que
presenta a las empresas de oficios del grupo y enruta cada solicitud a
la empresa correcta.

## Stack

React 19 · Vite 7 · React Router 7 · GSAP + ScrollTrigger · Lenis · Three.js

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
| `/companies/:slug` | Ficha de empresa: servicios, galería y cross-discovery |
| `/team` | Equipo completo |
| `/contact` | Formulario router por servicio |

Los datos de las empresas (descripciones, logos, fotos, links y el mapa
servicio → empresa del formulario) viven en un solo sitio:
`src/lib/companies.js`. El equipo, en `src/lib/team.js`.

## Despliegue

`.github/workflows/deploy.yml` publica en GitHub Pages con cada push a
`main`. El build recibe `VITE_BASE=/<repo>/` porque el sitio se sirve
desde un subdirectorio, y copia `index.html` a `404.html` para que las
rutas del SPA funcionen al entrar directo.

## Pendiente

- Backend del formulario (Cloudflare Workers + Resend) con el mapa
  servicio → inbox que defina Elevate.
- Contenido real de las empresas: ver las notas al inicio de
  `src/lib/companies.js`.
- Retratos del equipo (hoy se muestran iniciales sobre gradiente).
