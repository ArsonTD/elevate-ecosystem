import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import Logo from './Logo'
import './preloader.css'

/**
 * Preloader: cortina beige con el logo de Elevate al cargar el sitio.
 * El logo entra, una barra de progreso se llena (~2s) y la cortina
 * se desliza hacia arriba revelando la página. Solo en la carga
 * inicial; bloquea el scroll mientras dura.
 *
 * Quién decide si toca: el script inline del <head> (Layout.astro),
 * que marca <html class="is-preloading"> antes del primer paint solo
 * en entradas externas/recargas — nunca al navegar dentro del sitio.
 */
export default function Preloader() {
  const ref = useRef(null)
  const [done, setDone] = useState(false)

  useLayoutEffect(() => {
    const html = document.documentElement

    // Navegación interna: el inline script no marcó la precarga,
    // la cortina está oculta por CSS y aquí solo se desmonta.
    if (!html.classList.contains('is-preloading')) {
      setDone(true)
      return
    }

    const finish = () => {
      html.classList.remove('is-preloading')
      setDone(true)
      // Avisa al hero para que arranque su animación de apertura
      window.dispatchEvent(new Event('elevate:ready'))
    }

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // El CSS deja logo/barra ocultos hasta que GSAP toma el control
        gsap.set('.preloader_logo, .preloader_bar', { autoAlpha: 1 })
        gsap.set('.preloader_bar-fill', { scaleX: 1 })
        gsap.to(ref.current, { autoAlpha: 0, duration: .4, delay: 1.2, onComplete: finish })
        return
      }

      // fromTo (no from): el HTML llega pre-renderizado con los estados
      // iniciales puestos por CSS, así que el destino se declara explícito.
      gsap.timeline({ onComplete: finish })
        .fromTo('.preloader_logo',
          { y: 42, autoAlpha: 0, scale: .92 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 1, ease: 'expo.out' }, .15)
        .fromTo('.preloader_bar',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: .5, ease: 'power2.out' }, .45)
        .fromTo('.preloader_bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, .45)
        .to('.preloader_logo, .preloader_bar', { y: -34, autoAlpha: 0, duration: .5, ease: 'expo.in' }, '+=.3')
        .to(ref.current, { yPercent: -100, duration: .85, ease: 'expo.inOut' }, '-=.1')
    }, ref)

    return () => {
      ctx.revert()
      html.classList.remove('is-preloading')
    }
  }, [])

  if (done) return null

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <Logo className="preloader_logo" size="clamp(2.8rem, 8vw, 4.25rem)" delay=".45s" />
      <div className="preloader_bar">
        <div className="preloader_bar-fill" />
      </div>
    </div>
  )
}
