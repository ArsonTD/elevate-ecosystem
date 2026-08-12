import { useLayoutEffect, useRef } from 'react'
import Link from './Link'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { COMPANIES, ELEVATE_SOCIAL } from '../lib/companies'
import SocialIcon, { SOCIAL_LABEL } from './SocialIcon'
import Logo from './Logo'
import './footer.css'

/** Solo se pintan las redes que tengan URL real. */
const SOCIALS = ['linkedin', 'instagram', 'facebook']
  .map((type) => [type, ELEVATE_SOCIAL[type]])
  .filter(([, url]) => Boolean(url))

const PAGES_A = [
  { label: 'Home', to: '/' },
  { label: 'Ecosystem', to: '/about' },
  { label: 'Companies', to: '/companies' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.footer_main > *, .footer_legal', {
        y: 34,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: .1,
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
      gsap.from('.footer_brand', {
        yPercent: 45,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 60%',
          // La flecha del logo sube al entrar el footer en pantalla: al
          // cargar la página ocurriría muy por debajo del viewport
          onEnter: () => {
            const arrow = ref.current?.querySelector('.footer_brand .logo_arrow')
            if (!arrow) return
            arrow.classList.remove('is-rising')
            void arrow.offsetWidth // fuerza reflow para reiniciar la animación
            arrow.classList.add('is-rising')
          },
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={ref}>
      <div className="padding-global">
        <div className="footer_wrap">
          <div className="footer_main">
            <div className="footer_group">
              <div className="footer_label">Pages</div>
              <div className="footer_lists">
                <div className="footer_list">
                  {PAGES_A.map((p) => (
                    <Link to={p.to} className="footer_link" key={p.label}>{p.label}</Link>
                  ))}
                </div>
                <div className="footer_list">
                  {COMPANIES.map((c) => (
                    <Link to={`/companies/${c.slug}`} className="footer_link" key={c.slug}>{c.name}</Link>
                  ))}
                </div>
              </div>
            </div>

            {SOCIALS.length > 0 && (
              <div className="footer_social">
                {SOCIALS.map(([type, url]) => (
                  <a
                    key={type}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="footer_social-link"
                    aria-label={`Elevate on ${SOCIAL_LABEL[type]}`}
                  >
                    <SocialIcon type={type} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="footer_legal">
            <span>© 2026 Elevate</span>
            <span className="footer_divider" />
            <span>Solutions, one entry point</span>
            <span className="footer_divider" />
            <span>Knoxville, TN</span>
          </div>

          <div className="footer_brand" aria-hidden="true">
            <Logo className="footer_brand-mark" size=".72em" withWord={false} />
            <span className="footer_brand-word">Elevate</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
