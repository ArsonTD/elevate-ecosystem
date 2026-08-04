/**
 * Tema claro/oscuro. Por defecto SIEMPRE claro: el oscuro es opt-in
 * con el toggle y se recuerda. No se sigue el tema del sistema.
 *
 * El tema inicial lo fija un script inline en index.html (antes del
 * primer paint) para que no haya destello; aquí solo se lee y cambia.
 */

const KEY = 'elevate-theme'

export const getTheme = () =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

export function setTheme(theme, { persist = true, animate = true } = {}) {
  const root = document.documentElement

  if (animate) {
    root.classList.add('theme-switching')
    window.clearTimeout(setTheme._t)
    setTheme._t = window.setTimeout(() => root.classList.remove('theme-switching'), 400)
  }

  root.setAttribute('data-theme', theme)

  if (persist) {
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* modo privado: el tema dura la sesión */
    }
  }
}

export const toggleTheme = () => {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}
