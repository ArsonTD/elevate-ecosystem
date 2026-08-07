import { useEffect, useState } from 'react'
import { getTheme, toggleTheme } from '../lib/theme'
import './themetoggle.css'

/**
 * Botón sol/luna: alterna el tema y lo recuerda. El sitio arranca
 * siempre en claro; el oscuro es una elección del usuario.
 *
 * El estado inicial es "light" porque el HTML se pre-renderiza en el
 * servidor, donde no existe el documento; al montar se sincroniza con
 * el tema real que fijó el script inline del <head>.
 */
export default function ThemeToggle() {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'is-dark' : ''}`}
      onClick={() => setThemeState(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="tt_icons">
        {/* Sol (tema claro activo) */}
        <svg className="tt_icon tt_sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.6" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2.6v2" /><path d="M12 19.4v2" />
            <path d="M21.4 12h-2" /><path d="M4.6 12h-2" />
            <path d="M18.6 5.4l-1.4 1.4" /><path d="M6.8 17.2l-1.4 1.4" />
            <path d="M18.6 18.6l-1.4-1.4" /><path d="M6.8 6.8L5.4 5.4" />
          </g>
        </svg>
        {/* Luna (tema oscuro activo) */}
        <svg className="tt_icon tt_moon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.7 13.5A8.6 8.6 0 0 1 10.5 3.3a8.6 8.6 0 1 0 10.2 10.2z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  )
}
