import { withBase } from '../lib/paths'

/**
 * Sustituto del <Link> de react-router tras la migración a Astro:
 * un ancla nativa con la misma API (`to` + resto de props). El prefijo
 * del sitio, que antes ponía el basename del router, lo añade withBase.
 */
export default function Link({ to, children, ...props }) {
  return (
    <a href={withBase(to)} {...props}>
      {children}
    </a>
  )
}
