import { useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { TEAM } from '../lib/team'
import TeamCard from '../components/TeamCard'
import CTA from '../components/CTA'
import './teampage.css'

/** Team: el equipo completo de Elevate en grid (cards compartidas). */
export default function TeamPage() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.tpage_head > *', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: .1,
      })
      gsap.from('.tpage_grid .tcard', {
        y: 44,
        autoAlpha: 0,
        duration: .9,
        ease: 'expo.out',
        stagger: .06,
        delay: .25,
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <main className="page-top" ref={ref}>
      <section className="section_tpage">
        <div className="padding-global section-pad">
          <div className="container-medium">
            <div className="tpage_head">
              <div className="text-style-label">The people</div>
              <h1 className="tpage_title">Meet the team</h1>
              <p className="tpage_sub">
                The crew behind Elevate — coordinating every company so your
                project moves as one.
              </p>
            </div>

            <div className="tpage_grid">
              {TEAM.map((m) => <TeamCard member={m} key={m.name} />)}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
