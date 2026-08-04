import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import GradientButton from './GradientButton'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import './navbar.css'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Ecosystem', to: '/about' },
  { label: 'Companies', to: '/companies' },
  { label: 'Team', to: '/team' },
]

export default function Navbar() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(ref.current, { autoAlpha: 1 })
        return
      }
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .set(ref.current, { autoAlpha: 1 })
        .from('.navbar_logo-wrap', { y: -24, autoAlpha: 0, duration: .9 }, .2)
        .from('.navbar_links-wrap', { y: -24, autoAlpha: 0, duration: .9, clearProps: 'opacity,visibility,transform' }, .3)
        .from('.navbar_link, .navbar_cta', { yPercent: 120, duration: .7, stagger: .06 }, .45)
        .from('.navbar_hamburger-line', { scaleX: 0, duration: .6, stagger: .08 }, .5)
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <nav className="navbar" ref={ref}>
      <div className="padding-global">
        <div className="navbar_component">
          <Link to="/" className="navbar_logo-wrap" aria-label="Elevate — home">
            <Logo size="2rem" delay=".45s" />
          </Link>

          <div className="navbar_actions">
            <div className={`navbar_links-wrap ${open ? 'is-open' : ''}`}>
              <div className="navbar_links">
                {LINKS.map(({ label, to }) => (
                  <Link
                    to={to}
                    key={label}
                    className={`navbar_link ${pathname === to && to !== '/' ? 'is-current' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="navbar_link-text t1">{label}</span>
                    <span className="navbar_link-text t2" aria-hidden="true">{label}</span>
                  </Link>
                ))}
              </div>
              <span className="navbar_cta">
                <GradientButton variant="is-small" to="/contact" onClick={() => setOpen(false)}>Contact</GradientButton>
              </span>
            </div>

            <ThemeToggle />

            <button
              className={`navbar_hamburger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span className="navbar_hamburger-line l1" />
              <span className="navbar_hamburger-line l2" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
