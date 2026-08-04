import { useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import GradientButton from './GradientButton'
import './cta.css'

/**
 * CTA en dos columnas: gráfico de gradientes animados con blur
 * (en vez de video externo) + tarjeta blanca con el mensaje.
 */
export default function CTA() {
  const ref = useRef(null)

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

  return (
    <section className="section_cta" id="contacto" ref={ref}>
      <div className="padding-global section-pad">
        <div className="container-medium">
          <div className="cta_component">
            <div className="cta_graphic-wrap" aria-hidden="true">
              <div className="cta_graphic">
                <i className="cta_blob b1" /><i className="cta_blob b2" />
                <i className="cta_blob b3" /><i className="cta_blob b4" />
              </div>
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
