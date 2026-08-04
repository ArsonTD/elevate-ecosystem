import { useEffect, useRef } from 'react'
import './logo.css'

/**
 * Logo de Elevate: badge circular + wordmark.
 *
 * El círculo es el contenedor (overflow: hidden), así que la flecha
 * sube desde abajo recortada por él: círculo vacío → flecha asomando
 * → flecha centrada. Se re-anima al pasar el cursor.
 *
 * `size` controla todo el conjunto (--logo-size); `delay` retrasa el
 * arranque para encadenarlo con la entrada del navbar o el preloader.
 */
export default function Logo({
  size = '2rem',
  delay = '0s',
  withWord = true,
  className = '',
}) {
  const arrowRef = useRef(null)

  // Re-dispara la animación reiniciando la clase (forzando un reflow)
  const replay = () => {
    const el = arrowRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.remove('is-rising')
    void el.offsetWidth
    el.classList.add('is-rising')
  }

  // Evita que el hover reinicie la animación mientras aún corre la de carga
  const readyRef = useRef(false)
  useEffect(() => {
    const t = window.setTimeout(() => { readyRef.current = true }, 1200)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <span
      className={`logo ${className}`}
      style={{ '--logo-size': size, '--arrow-delay': delay }}
      onMouseEnter={() => readyRef.current && replay()}
    >
      <span className="logo_badge">
        <svg
          className="logo_arrow is-rising"
          ref={arrowRef}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 17.2V7.9M7.9 12L12 7.6l4.1 4.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withWord && <span className="logo_word">Elevate</span>}
    </span>
  )
}
