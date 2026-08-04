import { useLayoutEffect, useRef } from 'react'
import { gsap, splitWords, reducedMotion } from '../lib/gsapSetup'
import { SCENARIOS, getCompany, photo } from '../lib/companies'
import './services.css'

export default function Services() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return

      // El gran párrafo se "pinta" palabra a palabra siguiendo el scroll:
      // de gris tenue a negro, atado a la posición (scrub)
      const words = splitWords(ref.current.querySelector('.services_heading'))
      gsap.fromTo(
        words,
        { autoAlpha: .16 },
        {
          autoAlpha: 1,
          stagger: .06,
          ease: 'none',
          scrollTrigger: {
            trigger: '.services_content',
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 1,
          },
        },
      )

      gsap.from('.services_content .label_wrap', {
        y: 30,
        autoAlpha: 0,
        duration: .9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.services_content', start: 'top 82%' },
      })

      // Imágenes con zoom-out al entrar (scrub) + infos
      gsap.utils.toArray('.services_item').forEach((item) => {
        gsap.fromTo(
          item.querySelector('.services_img'),
          { scale: 1.28 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 25%', scrub: 1 },
          },
        )
        gsap.from(item.querySelector('.services_infos'), {
          y: 26,
          autoAlpha: 0,
          duration: .8,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 80%' },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section_services" id="solutions" ref={ref}>
      <div className="section-pad-sm" />
      <div className="padding-global is-tiny"><div className="line" /></div>

      <div className="padding-global section-pad">
        <div className="container-medium">
          <div className="services_component">
            <div className="services_content">
              <div className="label_wrap">
                <div className="label_line" />
                <h2 className="text-style-label">Solutions by project</h2>
              </div>
              <h3 className="heading-h3 services_heading">
                You don’t have to know which company you need. Start from your
                project — we route each part of it to the right specialist,
                and the companies coordinate with each other.
              </h3>
            </div>

            <div className="services_items">
              {SCENARIOS.map((s) => (
                <div className="services_item" key={s.title}>
                  <div className="services_img-wrap">
                    <img
                      className="services_img"
                      src={photo(s.img, 1400, 900)}
                      alt={s.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="services_infos">
                    <h3 className="heading-h6">{s.title}</h3>
                    <p className="services_desc">{s.desc}</p>
                    <p className="services_desc services_companies">
                      {s.companies.map((slug) => getCompany(slug).name).join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
