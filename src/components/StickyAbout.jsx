import { useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { asset } from '../lib/companies'
import './stickyabout.css'

/**
 * Hero: una ventana de video pequeña y centrada que, al cargar la
 * página, se abre sola hasta casi ocupar la pantalla (referencia
 * Giulia Gartner). Mientras se abre, los textos que la flanquean se
 * retiran y el titular aparece superpuesto sobre el video.
 *
 * La apertura espera a que el preloader termine (evento
 * "elevate:ready") para que no ocurra detrás de la cortina.
 */
export default function StickyAbout() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Sin animación: la ventana ya abierta y el titular visible
      if (reducedMotion) {
        gsap.set('.sabout_img-wrap', { width: 'var(--sabout-w)', height: 'var(--sabout-h)' })
        gsap.set('.sabout_img-text', { autoAlpha: 1 })
        gsap.set('.sabout_welcome, .sabout_heading', { autoAlpha: 0 })
        return
      }

      const tl = gsap.timeline({ paused: true })

      tl
        // Entrada de la ventana pequeña con los textos que la flanquean
        .from('.sabout_img-wrap', { autoAlpha: 0, scale: .92, duration: .9, ease: 'expo.out' }, 0)
        .from('.sabout_welcome, .sabout_heading', {
          autoAlpha: 0, y: 18, duration: .8, ease: 'expo.out', stagger: .08,
        }, .15)

        // Se abre sola hasta casi pantalla completa
        .to('.sabout_img-wrap', {
          width: 'var(--sabout-w)',
          height: 'var(--sabout-h)',
          duration: 1.5,
          ease: 'expo.inOut',
        }, 1.1)
        // Los textos laterales se retiran mientras la ventana los alcanza
        .to('.sabout_welcome, .sabout_heading', {
          autoAlpha: 0, duration: .5, ease: 'power2.in',
        }, 1.1)
        // El titular aparece ya sobre el video
        .fromTo('.sabout_img-text',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out' },
          2.15,
        )
        .from('.sabout_note, .sabout_location', {
          autoAlpha: 0, y: 12, duration: .7, ease: 'expo.out', stagger: .1,
        }, 2.3)

      // Arranca cuando el preloader se retira (o ya, si no hay preloader)
      const start = () => tl.play()
      if (document.documentElement.classList.contains('is-preloading')) {
        window.addEventListener('elevate:ready', start, { once: true })
      } else {
        start()
      }

      return () => window.removeEventListener('elevate:ready', start)
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section_sabout" ref={ref}>
      <div className="sabout_wrapper">
        <div className="sabout_note">Keep scrolling</div>
        <div className="sabout_location">
          <svg className="sabout_globe" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <ellipse cx="12" cy="12" rx="4.5" ry="10" fill="none" stroke="currentColor" strokeWidth="1.2" className="sabout_globe-spin" />
            <path d="M2.5 9h19M2.5 15h19" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span>Knoxville, TN</span>
        </div>

        <div className="sabout_stage">
          <div className="sabout_component">
            <h2 className="sabout_welcome">Welcome</h2>
            <h2 className="sabout_heading h1">We are</h2>
            <div className="sabout_img-wrap">
              {/* Video del hero: la ventana se abre sola al cargar */}
              <video
                className="sabout_img"
                src={asset("/video/hero.mp4")}
                poster={asset("/video/hero-poster.jpg")}
                autoPlay={!reducedMotion}
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Work by the Elevate companies"
              />
              <h2 className="sabout_img-text">Every solution. One entry point.</h2>
            </div>
            <h2 className="sabout_heading h2">Elevate</h2>
          </div>
        </div>
      </div>
    </section>
  )
}
