import { useLayoutEffect, useRef } from 'react'
import Link from '../components/Link'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { getCompany, photo, asset } from '../lib/companies'
import SocialIcon, { SOCIAL_LABEL } from '../components/SocialIcon'
import CTA from '../components/CTA'
import './company.css'

const LINK_ORDER = ['site', 'instagram', 'facebook', 'linkedin']

export default function Company({ slug }) {
  const company = getCompany(slug)
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (!company) return
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.co_panel > *', {
        y: 34,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: .08,
      })
      gsap.from('.co_media', {
        autoAlpha: 0,
        scale: .97,
        duration: 1.2,
        ease: 'expo.out',
        delay: .15,
      })
      gsap.from('.co_lists > *, .co_related-head, .co_related-card', {
        y: 30,
        autoAlpha: 0,
        duration: .9,
        ease: 'expo.out',
        stagger: .08,
        scrollTrigger: { trigger: '.co_lists', start: 'top 85%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [slug, company])

  if (!company) return null

  // Solo los canales que existen: nada de enlaces rotos
  const links = LINK_ORDER
    .map((type) => [type, company.links?.[type]])
    .filter(([, url]) => Boolean(url))

  return (
    <main className="page-top" ref={ref} key={slug}>
      <section className="section_co">
        <div className="padding-global section-pad">
          <div className="container-medium">
            <div className="co_hero">
              <div className="co_panel">
                <div className="label_wrap">
                  <div className="label_line" />
                  <span className="text-style-label">{company.category}</span>
                </div>
                <h1 className="co_title">{company.name}</h1>

                {links.length > 0 && (
                  <div className="co_socials">
                    {links.map(([type, url]) => (
                      <a
                        key={type}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="co_social"
                        aria-label={`${company.name} — ${SOCIAL_LABEL[type]}`}
                        title={SOCIAL_LABEL[type]}
                      >
                        <SocialIcon type={type} className="co_social-icon" />
                      </a>
                    ))}
                  </div>
                )}

                <div className="co_meta">
                  <div className="co_meta-item">
                    <span className="co_meta-label">Specialty</span>
                    <span className="co_meta-value">{company.tagline}</span>
                  </div>
                  <div className="co_meta-item">
                    <span className="co_meta-label">Service area</span>
                    <span className="co_meta-value">Knoxville, TN</span>
                  </div>
                  <div className="co_meta-item">
                    <span className="co_meta-label">Part of</span>
                    <span className="co_meta-value">Elevate ecosystem</span>
                  </div>
                </div>
                <div className="co_divider" />
                <p className="co_desc">{company.desc}</p>
                <div className="co_actions">
                  <Link to="/contact" className="co_cta">Request this service</Link>
                  {(company.phone || company.email) && (
                    <div className="co_direct">
                      {company.phone && (
                        <a href={`tel:${company.phone.replace(/[^\d+]/g, '')}`}>{company.phone}</a>
                      )}
                      {company.email && (
                        <a href={`mailto:${company.email}`}>{company.email}</a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="co_media">
                <img
                  src={photo(company.img, 1400, 1100)}
                  alt={company.name}
                />
                <span className="co_media-tag">{company.category}</span>
              </div>
            </div>

            {company.gallery?.length > 0 && (
              <div className="co_gallery">
                {company.gallery.map((src) => (
                  <div className="co_gallery-item" key={src}>
                    <img src={asset(src)} alt={`${company.name} work`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            <div className="co_lists">
              <div className="co_list">
                <h2 className="heading-h6">Services</h2>
                <ul>
                  {company.services.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div className="co_list">
                <h2 className="heading-h6">Specialties</h2>
                <ul>
                  {company.specialties.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="co_related">
              <h2 className="heading-h5 co_related-head">
                Often hired together with
              </h2>
              <div className="co_related-grid">
                {company.related.map((relSlug) => {
                  const rel = getCompany(relSlug)
                  return (
                    <Link to={`/companies/${rel.slug}`} className="co_related-card" key={rel.slug}>
                      <div className="co_related-media">
                        <img
                          src={photo(rel.img, 900, 600)}
                          alt={rel.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="co_related-body">
                        <span className="text-style-label">{rel.category}</span>
                        <h3 className="heading-h6">{rel.name}</h3>
                        <p>{rel.tagline}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
