import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { asset } from '../lib/companies'
import GradientButton from './GradientButton'
import './cta.css'

const INTRO = '/video/cta-intro.mp4'
const INTRO_POSTER = '/video/cta-intro-poster.jpg'

/**
 * CTA en dos columnas: video de intro del grupo + tarjeta blanca con el
 * mensaje. Con motion reducido el video cede el sitio a los gradientes
 * animados con blur que ocupaban ese hueco antes.
 */
export default function CTA() {
  const ref = useRef(null)
  const videoRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.cta_graphic-wrap, .cta_card', {
        y: 70,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: .15,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
      gsap.from('.cta_card > *', {
        y: 30,
        autoAlpha: 0,
        duration: .9,
        ease: 'expo.out',
        stagger: .1,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  // El video solo se descarga y corre cuando el bloque se acerca al
  // viewport: son 4 MB al final de la home y no se ve hasta ahí.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === 'none') video.preload = 'auto'
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(video)

    return () => io.disconnect()
  }, [])

  return (
    <section className="section_cta" id="contacto" ref={ref}>
      <div className="padding-global section-pad">
        <div className="container-medium">
          <div className="cta_component">
            <div className="cta_graphic-wrap" aria-hidden="true">
              {reducedMotion ? (
                <div className="cta_graphic">
                  <i className="cta_blob b1" /><i className="cta_blob b2" />
                  <i className="cta_blob b3" /><i className="cta_blob b4" />
                </div>
              ) : (
                <video
                  className="cta_video"
                  ref={videoRef}
                  src={asset(INTRO)}
                  poster={asset(INTRO_POSTER)}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              )}
            </div>

            <div className="cta_card">
              <div className="cta_head">
                <span className="cta_pill">One form</span>
                <h2 className="heading-h5 cta_heading">
                  Describe your project once — every service you pick reaches
                  the right company automatically.
                </h2>
              </div>
              <div className="cta_bottom">
                <GradientButton to="/contact">Start your project</GradientButton>
                <p className="cta_text">
                  Pick one or more services, tell us about your property, and
                  the right team gets back to you — no chasing a list of phone numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
