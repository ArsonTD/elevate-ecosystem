import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { COMPANIES, photo } from '../lib/companies'
import CTA from '../components/CTA'
import './companies.css'

const CATEGORIES = ['All', ...COMPANIES.map((c) => c.category)]

/**
 * Companies: grid tipo portfolio (referencia GSV) — filtros por categoría
 * y tarjetas por empresa con imagen, tag, descripción y meta.
 */
export default function Companies() {
  const ref = useRef(null)
  const [filter, setFilter] = useState('All')

  const visible = useMemo(
    () => (filter === 'All' ? COMPANIES : COMPANIES.filter((c) => c.category === filter)),
    [filter],
  )

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.cos_head > *', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: .1,
      })
      gsap.from('.cos_filters', {
        y: 24,
        autoAlpha: 0,
        duration: .9,
        ease: 'expo.out',
        delay: .3,
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  // Reveal suave de las tarjetas al cambiar el filtro
  useLayoutEffect(() => {
    if (reducedMotion) return
    const cards = ref.current.querySelectorAll('.cos_card')
    gsap.fromTo(cards, { y: 26, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: .7,
      ease: 'expo.out',
      stagger: .07,
    })
  }, [visible])

  return (
    <main className="page-top" ref={ref}>
      <section className="section_cos">
        <div className="padding-global section-pad">
          <div className="container-medium">
            <div className="cos_head">
              <div className="text-style-label">The companies</div>
              <h1 className="cos_title">One group, every specialist</h1>
              <p className="cos_sub">
                Every company in the Elevate ecosystem, ready for your next project.
              </p>
            </div>

            <div className="cos_filters" role="tablist" aria-label="Filter companies by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cos_filter ${filter === cat ? 'is-active' : ''}`}
                  onClick={() => setFilter(cat)}
                  role="tab"
                  aria-selected={filter === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="cos_grid">
              {visible.map((c) => (
                <Link to={`/companies/${c.slug}`} className="cos_card" key={c.slug}>
                  <div className="cos_card-media">
                    <img
                      src={photo(c.img, 1200, 760)}
                      alt={c.name}
                      loading="lazy"
                    />
                    <span className="cos_card-tag">{c.category}</span>
                    <span className="cos_card-logo">{c.name}</span>
                  </div>
                  <div className="cos_card-body">
                    <h2 className="heading-h6">{c.name}</h2>
                    <p className="cos_card-desc">{c.desc}</p>
                    <div className="cos_card-meta">
                      <div className="cos_meta-item">
                        <span className="cos_meta-label">Specialty</span>
                        <span className="cos_meta-value">{c.tagline}</span>
                      </div>
                      <div className="cos_meta-item">
                        <span className="cos_meta-label">Service area</span>
                        <span className="cos_meta-value">Knoxville, TN</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
