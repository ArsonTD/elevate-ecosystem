import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsapSetup'
import { photo } from '../lib/companies'
import './values.css'

const VALUES = [
  {
    num: '01',
    title: 'One point of contact',
    text: 'The biggest risk with a group of companies is friction — not knowing whom to call. Here there’s one form, one conversation, and the group sorts out the rest.',
    img: '1521791136064-7986c2920216', // apretón de manos
  },
  {
    num: '02',
    title: 'Trades that trust each other',
    text: 'These aren’t strangers sharing a job site. The companies already coordinate schedules, hand off work and vouch for each other’s quality.',
    img: '1621905252507-b35492cc74b4', // técnico en obra
  },
  {
    num: '03',
    title: 'Back office, handled',
    text: 'Elevate runs the paperwork, billing and coordination behind the scenes so every crew can focus on its technical work — and on your project.',
    img: '1556761175-4b46a572b786', // oficina del equipo
  },
]

/**
 * Valores: columna izquierda sticky con imágenes que se intercambian
 * (crossfade + zoom) según el bloque activo del lado derecho.
 */
export default function Values() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const imgs = gsap.utils.toArray('.values_img-wrap')

      if (reducedMotion) {
        gsap.set(imgs[0], { autoAlpha: 1 })
        return
      }

      gsap.set(imgs, { autoAlpha: 0 })
      gsap.set(imgs[0], { autoAlpha: 1 })

      let active = 0
      const activate = (i) => {
        if (i === active) return
        active = i
        imgs.forEach((img, j) => {
          gsap.to(img, { autoAlpha: j === i ? 1 : 0, duration: .5, ease: 'power2.out', overwrite: 'auto' })
        })
        gsap.fromTo(imgs[i].querySelector('img'), { scale: 1.12 }, { scale: 1, duration: .8, ease: 'power3.out' })
      }

      gsap.utils.toArray('.values_block').forEach((block, i) => {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && activate(i),
        })
        gsap.from(block.querySelector('.values_content'), {
          y: 44, autoAlpha: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: block, start: 'top 72%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section_values" ref={ref}>
      <div className="padding-global">
        <div className="values_wrapper">
          <div className="values_imgs-wrapper">
            <div className="values_imgs-wrap">
              {VALUES.map((v) => (
                <div className="values_img-wrap" key={v.num}>
                  <img
                    src={photo(v.img, 1400, 1600)}
                    alt=""
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="values_content-col">
            {VALUES.map((v) => (
              <div className="values_block" key={v.num}>
                <img
                  className="values_img-tablet"
                  src={photo(v.img, 1200, 900)}
                  alt=""
                  loading="lazy"
                />
                <div className="values_content">
                  <div className="values_head">
                    <div className="text-style-label">{v.num}</div>
                    <h2 className="heading-h4">{v.title}</h2>
                  </div>
                  <p className="values_text">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
