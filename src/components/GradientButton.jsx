import { Link } from 'react-router-dom'

/**
 * Botón con "gradient balls": bolas de gradiente borrosas que se
 * encienden al hover dentro del botón + un glow exterior detrás.
 * Acepta `href` (ancla/externo) o `to` (ruta interna con react-router).
 */
export default function GradientButton({ children, href = '#', to, variant = '', onClick }) {
  const balls = (
    <>
      <i className="gbtn_ball b1" />
      <i className="gbtn_ball b2" />
    </>
  )

  const inner = (
    <>
      <span className="gbtn_inner">
        <span className="gbtn_gradient">{balls}</span>
        <span className="gbtn_text">{children}</span>
      </span>
      <span className="gbtn_glow">{balls}</span>
    </>
  )

  if (to) {
    return (
      <Link className={`gbtn ${variant}`} to={to} onClick={onClick}>
        {inner}
      </Link>
    )
  }

  return (
    <a className={`gbtn ${variant}`} href={href} onClick={onClick}>
      {inner}
    </a>
  )
}
