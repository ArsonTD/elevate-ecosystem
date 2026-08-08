import { useEffect, useLayoutEffect, useRef } from 'react'
import Link from './Link'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { COMPANIES, asset, photo } from '../lib/companies'
import './worklist.css'

const SLIDE_HOLD = 2.8   // segundos que aguanta cada foto del carrusel
const SLIDE_FADE = .8    // duración del cruce entre fotos

const svgGradient = (c1, c2, angle = 35) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" gradientTransform="rotate(${angle})"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`,
  )}`

export default function WorkList() {
  const ref = useRef(null)
  const pillRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return

      // Cabecera
      gsap.from('.work_head > *', {
        y: 50,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: .1,
        scrollTrigger: { trigger: '.work_head', start: 'top 85%' },
      })

      // Cada proyecto: imagen principal escala 1.3→1 con scrub,
      // tarjeta secundaria con parallax, infos con reveal
      gsap.utils.toArray('.work_item').forEach((item) => {
        const mainImg = item.querySelector('.work_img-main')
        const second = item.querySelector('.work_image-second')
        const infos = item.querySelector('.work_infos')

        gsap.fromTo(
          mainImg,
          { scale: 1.3 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 20%', scrub: 1 },
          },
        )

        gsap.fromTo(
          second,
          { yPercent: 24, rotation: 4 },
          {
            yPercent: -14,
            rotation: -3,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          },
        )

        gsap.from(infos.children, {
          y: 30,
          autoAlpha: 0,
          duration: .9,
          ease: 'expo.out',
          stagger: .08,
          scrollTrigger: { trigger: infos, start: 'top 92%' },
        })
      })

      // Pill "Ver caso" que sigue el cursor sobre la imagen
      const pill = pillRef.current
      if (window.matchMedia('(pointer: fine)').matches) {
        const xTo = gsap.quickTo(pill, 'x', { duration: .35, ease: 'power3.out' })
        const yTo = gsap.quickTo(pill, 'y', { duration: .35, ease: 'power3.out' })

        gsap.utils.toArray('.work_image-main').forEach((zone) => {
          zone.addEventListener('mouseenter', (e) => {
            xTo(e.clientX); yTo(e.clientY)
            gsap.to(pill, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(2)' })
          })
          zone.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY) })
          zone.addEventListener('mouseleave', () => {
            gsap.to(pill, { autoAlpha: 0, scale: .6, duration: .3, ease: 'power2.in' })
          })
        })
      }
    }, ref)

    return () => ctx.revert()
  }, [])

  // Las tarjetas pequeñas se animan solas: unas llevan video, otras un
  // carrusel de fotos. En ambos casos solo arrancan cerca del viewport —
  // son seis por página y dejarlas todas vivas encarece el scroll sin
  // que se vea nada.
  useEffect(() => {
    const media = []

    ref.current.querySelectorAll('.work_video-second').forEach((video) => {
      media.push({
        el: video,
        play: () => {
          if (video.preload === 'none') video.preload = 'auto'
          video.play().catch(() => {})
        },
        stop: () => video.pause(),
      })
    })

    if (!reducedMotion) {
      ref.current.querySelectorAll('.work_card-carousel').forEach((box) => {
        const slides = [...box.querySelectorAll('.work_card-slide')]
        if (slides.length < 2) return

        gsap.set(slides, { autoAlpha: 0 })
        gsap.set(slides[0], { autoAlpha: 1 })

        const tl = gsap.timeline({ repeat: -1, paused: true })
        slides.forEach((slide, i) => {
          const next = slides[(i + 1) % slides.length]
          tl.to({}, { duration: SLIDE_HOLD })
            .to(slide, { autoAlpha: 0, duration: SLIDE_FADE, ease: 'power2.inOut' })
            .to(next, { autoAlpha: 1, duration: SLIDE_FADE, ease: 'power2.inOut' }, '<')
        })

        media.push({ el: box, play: () => tl.play(), stop: () => tl.pause(), tl })
      })
    }

    if (!media.length) return

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const item = media.find((m) => m.el === e.target)
        if (item) (e.isIntersecting ? item.play() : item.stop())
      }),
      { rootMargin: '200px' },
    )
    media.forEach((m) => io.observe(m.el))

    return () => {
      io.disconnect()
      media.forEach((m) => m.tl?.kill())
    }
  }, [])

  return (
    <section className="section_work" id="companies" ref={ref}>
      <div className="padding-global section-pad">
        <div className="container-medium">
          <div className="work_head">
            <h2 className="work_title">Companies</h2>
            <div className="work_number-wrap"><span className="work_number">{COMPANIES.length}</span></div>
          </div>

          <div className="work_list">
            {COMPANIES.map((c) => (
              <article className="work_item" key={c.slug}>
                <Link to={`/companies/${c.slug}`} className="work_block" aria-label={`View ${c.name}`}>
                  <div className="work_images-wrap">
                    <div className="work_image-main">
                      <img
                        className="work_img-main"
                        src={photo(c.img, 1920, 1080)}
                        alt={c.name}
                        loading="lazy"
                      />
                    </div>
                    <div className={`work_image-second${c.cardImages ? ' work_card-carousel' : ''}`}>
                      {c.cardVideo && !reducedMotion ? (
                        <video
                          className="work_img-second work_video-second"
                          src={asset(c.cardVideo)}
                          poster={asset(c.cardPoster)}
                          muted
                          loop
                          playsInline
                          preload="none"
                          aria-hidden="true"
                        />
                      ) : c.cardImages ? (
                        c.cardImages.map((src) => (
                          <img
                            className="work_img-second work_card-slide"
                            src={asset(src)}
                            key={src}
                            alt=""
                            loading="lazy"
                          />
                        ))
                      ) : (
                        <img
                          className="work_img-second"
                          src={c.cardPoster ? asset(c.cardPoster) : svgGradient(c.grad[0], c.grad[1])}
                          alt=""
                          loading="lazy"
                        />
                      )}
                    </div>
                  </div>
                  <div className="work_infos">
                    <h3 className="heading-h6">{c.name}</h3>
                    <p className="work_desc">{c.tagline}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Pill flotante compartida */}
      <div className="work_pill" ref={pillRef} aria-hidden="true">View company</div>
    </section>
  )
}
