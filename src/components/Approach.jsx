import { useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { photo } from '../lib/companies'
import FlowVideo from './FlowVideo'
import './approach.css'

const ITEMS = [
  {
    title: 'One entry',
    text: 'You describe your project once — buying, renovating or managing a property — and pick the services you need, without knowing which company does what.',
    img: '1581092160562-40aa08e78837', // planos y bocetos sobre el escritorio
  },
  {
    title: 'Smart routing',
    text: 'Each part of your inquiry reaches the right company automatically: lighting to Afterimage, paint to Luv Painting, remodeling to Monarch — with Elevate keeping a copy.',
    flow: true,
  },
  {
    title: 'Coordinated work',
    text: 'The companies already know each other and schedule around each other. One property, several trades, zero chasing — that’s the point of the ecosystem.',
    img: '1504307651254-35680f356dfd', // obra con varias cuadrillas a la vez
  },
]

export default function Approach() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return

      gsap.from('.approach_label', {
        y: 26, autoAlpha: 0, duration: .9, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

      gsap.utils.toArray('.approach_item').forEach((item, i) => {
        gsap.fromTo(
          item.querySelector('.approach_media'),
          { scale: 1.25 },
          {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 30%', scrub: 1 },
          },
        )
        gsap.from(item.querySelector('.approach_content'), {
          y: 34, autoAlpha: 0, duration: .9, ease: 'expo.out', delay: i * .08,
          scrollTrigger: { trigger: item, start: 'top 82%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section_approach" ref={ref}>
      <div className="section-pad-sm" />
      <div className="padding-global is-tiny"><div className="line" /></div>
      <div className="padding-global section-pad">
        <div className="container-medium">
          <div className="label_wrap approach_label">
            <div className="label_line" />
            <h2 className="text-style-label">How it works</h2>
          </div>

          <div className="approach_items">
            {ITEMS.map((item) => (
              <div className="approach_item" key={item.title}>
                <div className="approach_img-wrap">
                  {item.flow
                    ? <FlowVideo className="approach_media" />
                    : (
                      <img
                        className="approach_media"
                        src={photo(item.img, 1200, 800)}
                        alt={item.title}
                        loading="lazy"
                      />
                    )}
                </div>
                <div className="approach_content">
                  <h3 className="heading-h6">{item.title}</h3>
                  <p className="approach_text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
