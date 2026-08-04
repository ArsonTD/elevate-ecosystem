import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Divide el texto de un nodo en spans por carácter dentro de máscaras,
 * conservando los espacios. Devuelve la lista de chars animables.
 */
export function splitChars(el) {
  const text = el.textContent
  el.setAttribute('aria-label', text)
  el.textContent = ''
  const chars = []
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '))
      continue
    }
    const mask = document.createElement('span')
    mask.className = 'char-mask'
    mask.setAttribute('aria-hidden', 'true')
    const inner = document.createElement('span')
    inner.className = 'char'
    inner.textContent = ch
    mask.appendChild(inner)
    el.appendChild(mask)
    chars.push(inner)
  }
  return chars
}

/** Divide en palabras enmascaradas (para reveals por línea/palabra). */
export function splitWords(el) {
  const text = el.textContent.trim()
  el.setAttribute('aria-label', text)
  el.textContent = ''
  const words = []
  text.split(/\s+/).forEach((w, i, arr) => {
    const mask = document.createElement('span')
    mask.className = 'word-mask'
    mask.setAttribute('aria-hidden', 'true')
    const inner = document.createElement('span')
    inner.className = 'word'
    inner.textContent = w
    mask.appendChild(inner)
    el.appendChild(mask)
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '))
    words.push(inner)
  })
  return words
}

export { gsap, ScrollTrigger }
