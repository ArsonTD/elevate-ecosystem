/**
 * Prefijo del sitio para rutas internas: "/" en local y "/<repo>/" en
 * GitHub Pages. Es lo que antes resolvía el basename del BrowserRouter;
 * ahora cada ancla interna pasa por aquí.
 */
export const withBase = (path = '/') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return base + (String(path).startsWith('/') ? path : `/${path}`)
}
