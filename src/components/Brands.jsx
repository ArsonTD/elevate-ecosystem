import { useLayoutEffect, useRef } from 'react'
import Link from './Link'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { COMPANIES, asset } from '../lib/companies'
import './brands.css'

/**
 * Marquee de las seis empresas con su logo real. Cada logo va sobre
 * una placa clara para que se lea igual en tema claro y oscuro
 * (los logos son monocromos oscuros o de color sobre blanco).
 */
function List({ clone = false }) {
  return (
    <div className="brands_list" aria-hidden={clone || undefined}>
      {COMPANIES.map((c) => (
        <Link
          className="brands_item"
          to={`/companies/${c.slug}`}
          key={c.slug}
          tabIndex={clone ? -1 : undefined}
        >
          <span className="brands_plate">
            <img
              className="brands_logo"
              src={asset(c.logo)}
              alt={clone ? '' : c.name}
              loading="lazy"
            />
          </span>
          <span className="brands_desc">{c.tagline}</span>
        </Link>
      ))}
    </div>
  )
}

export default function Brands() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.brands_head > *', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: .12,
        scrollTrigger: { trigger: '.brands_head', start: 'top 85%' },
      })
      gsap.from('.brands_marquee', {
        autoAlpha: 0,
        y: 50,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.brands_marquee', start: 'top 90%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section_brands" id="ecosystem" ref={ref}>
      <div className="padding-global is-tiny"><div className="line" /></div>

      <div className="padding-global section-pad">
        <div className="container-medium">
          <div className="brands_head">
            <div className="label_wrap">
              <div className="label_line" />
              <h2 className="text-style-label">The ecosystem</h2>
            </div>
            <h3 className="heading-h4 brands_heading">
              Lighting, construction, wall finishes, painting, logistics and AV —
              companies that already know each other and work as one group.
            </h3>
          </div>
        </div>
      </div>

      <div className="brands_marquee">
        <div className="brands_track">
          <List /><List clone /><List clone />
        </div>
      </div>

      <div className="section-pad-sm" />
    </section>
  )
}
