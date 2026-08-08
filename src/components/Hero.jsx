import { useLayoutEffect, useRef } from 'react'
import { gsap, splitWords, reducedMotion } from '../lib/gsapSetup'
import { photo } from '../lib/companies'
import GradientButton from './GradientButton'
import './hero.css'

const HEADINGS = ['One entry, every trade', 'Solutions, one team', 'Your project, connected']

/**
 * Anillo del hero: fotos reales del cliente (/photos) mezcladas con
 * stock donde todavía no hay material propio. w/h son las medidas
 * reales del archivo para reservar el espacio y evitar saltos.
 */
const RING_IMGS = [
  { img: '/photos/afterimage-lighting.jpg', w: 950, h: 1800 }, // bano con colgantes
  { img: '/photos/monarch-mirror.jpg', w: 1012, h: 1800 },     // espejo de piel, Monarch
  { img: '/photos/avs-great-room.jpg', w: 1800, h: 1350 },     // great room con Control4, AVS
  { img: '/photos/cutting-edge.jpg', w: 1800, h: 1012 },       // sala enmascarada
  { img: '/photos/finishing.jpg', w: 1800, h: 1012 },          // acabado de pared
  { img: '/photos/luv-painting-bath.jpg', w: 1800, h: 950 },   // bano empapelado, Luv Painting
  { img: '/photos/parallel-concrete.jpg', w: 1800, h: 950 },   // vaciado de hormigon, Parallel
  { img: '1558036117-15d82a90b9b1', w: 680, h: 520 },          // stock: propiedad al atardecer
]

export default function Hero() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const headingEls = gsap.utils.toArray('.hero_heading')

      if (reducedMotion) {
        gsap.set(ref.current.querySelectorAll('.hero_stage, .hero_text, .hero_button, .hero_imgs-wrap, .hero_labels'), { autoAlpha: 1 })
        gsap.set(headingEls[0], { autoAlpha: 1 })
        return
      }

      // Divide cada titular en palabras; animamos las máscaras (fade con
      // leve movimiento, como el original) en vez de slide por carácter.
      const wordSets = headingEls.map((h) => splitWords(h).map((w) => w.parentElement))
      gsap.set(headingEls, { autoAlpha: 1 })
      wordSets.forEach((set) => gsap.set(set, { autoAlpha: 0, y: 16 }))

      const cards = gsap.utils.toArray('.hero_img-wrap')

      // --- Ciclo: flip 3D de las tarjetas + crossfade del titular ---
      // Arranca pausado: lo dispara la intro al terminar.
      const HOLD = 2.6
      const cycle = gsap.timeline({ repeat: -1, paused: true })
      cycle.to({}, { duration: HOLD })
      HEADINGS.forEach((_, i) => {
        const cur = wordSets[i]
        const next = wordSets[(i + 1) % wordSets.length]
        cycle
          .to(cards, {
            rotationY: '+=180',
            transformPerspective: 1100,
            duration: 1.7,
            ease: 'sine.inOut',
            stagger: { each: .06, from: 'random' },
          })
          .to(cur, { autoAlpha: 0, y: -12, duration: .4, ease: 'power2.in', stagger: .05 }, '<')
          .fromTo(
            next,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .12 },
            '<+=.4',
          )
          .to({}, { duration: HOLD })
      })

      // --- Entrada: anillo + texto + botón + labels (al entrar en viewport) ---
      const intro = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
        onComplete: () => cycle.play(),
      })
      intro
        .set(ref.current.querySelectorAll('.hero_stage, .hero_imgs-wrap, .hero_labels'), { autoAlpha: 1 })
        // El anillo aparece YA abierto: cada tarjeta hace pop en su
        // posición final (sin contraerse hacia el centro)
        .from('.hero_imgs-wrap', { rotation: -5, duration: 1.6, ease: 'expo.out' }, 0)
        .from(cards, { scale: 0, duration: 1.1, ease: 'back.out(1.5)', stagger: { each: .07, from: 'random' } }, .15)
        .to(wordSets[0], { autoAlpha: 1, y: 0, duration: .8, stagger: .12 }, .45)
        .fromTo('.hero_text', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8 }, 1.05)
        .fromTo('.hero_button', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8 }, 1.2)
        .fromTo('.hero_labels > *', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7, stagger: .1 }, 1.3)

      // --- Flotación continua de las tarjetas (idle, sin mouse) ---
      cards.forEach((el, i) => {
        gsap.to(el, {
          y: (i % 2 ? -1 : 1) * gsap.utils.random(10, 18),
          duration: gsap.utils.random(2.4, 3.8),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: gsap.utils.random(0, 1),
        })
      })

      // --- Scroll: el anillo rota y se abre levemente ---
      gsap.to('.hero_imgs-wrap', {
        rotation: 10,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 },
      })
      cards.forEach((el, i) => {
        gsap.to(el, {
          yPercent: (i % 2 ? -1 : 1) * (8 + (i % 3) * 5),
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={ref}>
      {/* Anillo de imágenes alrededor del texto */}
      <div className="hero_imgs-wrapper" aria-hidden="true">
        <div className="hero_imgs-wrap">
          {RING_IMGS.map((img, i) => (
            <div className={`hero_img-wrap p${i + 1}`} key={img.img}>
              <img
                className="hero_img"
                src={photo(img.img, img.w, img.h)}
                width={img.w}
                height={img.h}
                alt=""
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido central */}
      <div className="padding-global hero_z">
        <div className="hero_component">
          <div className="hero_stage">
            {HEADINGS.map((text, i) => (
              <h1 className={`hero_heading h${i + 1}`} key={text}>{text}</h1>
            ))}
          </div>
          <p className="hero_text">Skilled-trade companies, one place to find them.</p>
          <div className="hero_button">
            <GradientButton to="/contact">Start your project</GradientButton>
          </div>
        </div>
      </div>

      {/* Labels inferiores */}
      <div className="hero_labels-wrap">
        <div className="padding-global">
          <div className="hero_labels">
            <div className="hero_location">
              <svg className="hero_globe" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <ellipse cx="12" cy="12" rx="4.5" ry="10" fill="none" stroke="currentColor" strokeWidth="1.2" className="hero_globe-spin" />
                <path d="M2.5 9h19M2.5 15h19" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="hero_label">Knoxville, TN</span>
            </div>
            <span className="hero_label">©2026</span>
          </div>
        </div>
      </div>
    </section>
  )
}
