import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { COMPANIES, photo } from '../lib/companies'
import './team.css'

export default function Team() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return

      gsap.from('.team_title', {
        y: 34, autoAlpha: 0, duration: .9, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

      gsap.utils.toArray('.team_item').forEach((item, i) => {
        gsap.fromTo(
          item.querySelector('img'),
          { scale: 1.25 },
          {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 35%', scrub: 1 },
          },
        )
        gsap.from(item.querySelector('.team_texts'), {
          y: 24, autoAlpha: 0, duration: .8, ease: 'expo.out', delay: i * .06,
          scrollTrigger: { trigger: item, start: 'top 85%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section_team" ref={ref}>
      <div className="padding-global section-pad">
        <div className="container-medium">
          <h2 className="heading-h4 team_title">The companies</h2>
          <div className="team_grid">
            {COMPANIES.map((c) => (
              <Link to={`/companies/${c.slug}`} className="team_item" key={c.slug}>
                <div className="team_img-wrap">
                  <img
                    src={photo(c.img, 800, 1000)}
                    alt={c.name}
                    loading="lazy"
                  />
                </div>
                <div className="team_texts">
                  <h3 className="team_name">{c.name}</h3>
                  <p className="team_role">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
