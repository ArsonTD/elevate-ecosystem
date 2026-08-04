/** Iconos de red / sitio web, compartidos por el footer y las empresas. */
export default function SocialIcon({ type, className = 'footer_icon' }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {type === 'site' && (
        <g {...s}>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3.2 9h17.6M3.2 15h17.6" />
        </g>
      )}
      {type === 'instagram' && (
        <g {...s}>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
        </g>
      )}
      {type === 'facebook' && (
        <path
          d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.12V9.9H7.6V13h2.68v8z"
          fill="currentColor"
        />
      )}
      {type === 'linkedin' && (
        <g fill="currentColor">
          <path d="M6.94 8.9H4.1V20h2.84zM5.52 4a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" />
          <path d="M20 13.8c0-3.1-1.66-4.55-3.87-4.55-1.79 0-2.58.98-3.03 1.67V8.9H10.3c.04.8 0 11.1 0 11.1h2.8v-6.2c0-.25.02-.5.09-.68.2-.5.66-1.02 1.43-1.02 1.01 0 1.41.77 1.41 1.89V20H20z" />
        </g>
      )}
      {type === 'x' && <path d="M5 5l14 14M19 5L5 19" {...s} />}
      {type === 'youtube' && (
        <g {...s}>
          <rect x="3.5" y="6.5" width="17" height="11" rx="3" />
          <path d="M10.5 9.8v4.4l3.8-2.2z" fill="currentColor" stroke="none" />
        </g>
      )}
    </svg>
  )
}

/** Etiqueta accesible por tipo. */
export const SOCIAL_LABEL = {
  site: 'Website',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  x: 'X',
  youtube: 'YouTube',
}
