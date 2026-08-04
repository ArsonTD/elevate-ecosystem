import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/gsapSetup'
import { SERVICE_OPTIONS, routeTarget } from '../lib/companies'
import './contact.css'

/**
 * Formulario router (pieza central de la propuesta): el cliente elige
 * uno o más servicios, describe su proyecto y cada inquiry llega a la
 * empresa correcta + copia al inbox central de Elevate.
 *
 * TODO backend: conectar handleSubmit a la función serverless
 * (Cloudflare Workers + Resend) usando el mapa SERVICE_OPTIONS
 * servicio → inbox que defina Elevate.
 */
export default function Contact() {
  const ref = useRef(null)
  const [selected, setSelected] = useState([])
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      gsap.from('.contact_head > *, .contact_form > *', {
        y: 34,
        autoAlpha: 0,
        duration: .9,
        ease: 'expo.out',
        stagger: .06,
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const toggle = (id) => {
    setError('')
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)

    // Honeypot: si el campo oculto viene lleno, es un bot — salir en silencio
    if (form.get('company_website')) return

    if (!selected.length) {
      setError('Pick at least one service so we can route your inquiry.')
      return
    }
    if (!form.get('name') || !form.get('email') || !form.get('message')) {
      setError('Name, email and a short description are required.')
      return
    }

    // TODO backend: POST a la función de routing (Workers/Resend).
    setSent(true)
  }

  // Empresas destino, sin repetir: varios servicios pueden ir a la misma
  const routedTo = [...new Set(
    SERVICE_OPTIONS.filter((o) => selected.includes(o.id)).map(routeTarget),
  )]

  return (
    <main className="page-top" ref={ref}>
      <section className="section_contact">
        <div className="padding-global section-pad">
          <div className="container-medium">
            <div className="contact_layout">
              <div className="contact_head">
                <div className="label_wrap">
                  <div className="label_line" />
                  <span className="text-style-label">One entry point</span>
                </div>
                <h1 className="contact_title">Tell us about your project</h1>
                <p className="contact_sub">
                  Pick the services you need — even if that means several
                  companies. You describe the project once; each inquiry is
                  routed automatically to the right team, and Elevate keeps
                  a copy so nothing falls through.
                </p>
              </div>

              {sent ? (
                <div className="contact_confirm" role="status">
                  <h2 className="heading-h5">Inquiry sent ✓</h2>
                  <p>
                    Your project was routed to{' '}
                    <strong>{routedTo.join(', ')}</strong>. The right team will
                    get back to you shortly.
                  </p>
                </div>
              ) : (
                <form className="contact_form" onSubmit={handleSubmit} noValidate>
                  <fieldset className="contact_services">
                    <legend className="contact_label">What do you need?</legend>
                    <div className="contact_chips">
                      {SERVICE_OPTIONS.map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          className={`contact_chip ${selected.includes(opt.id) ? 'is-active' : ''}`}
                          onClick={() => toggle(opt.id)}
                          aria-pressed={selected.includes(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="contact_field">
                    <span className="contact_label">Your project</span>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Renovating a rental in Knoxville — needs paint, new lighting and the furniture moved out…"
                      required
                    />
                  </label>

                  <div className="contact_row">
                    <label className="contact_field">
                      <span className="contact_label">Name</span>
                      <input type="text" name="name" autoComplete="name" required />
                    </label>
                    <label className="contact_field">
                      <span className="contact_label">Email</span>
                      <input type="email" name="email" autoComplete="email" required />
                    </label>
                    <label className="contact_field">
                      <span className="contact_label">Phone (optional)</span>
                      <input type="tel" name="phone" autoComplete="tel" />
                    </label>
                  </div>

                  {/* Honeypot anti-spam: oculto para humanos */}
                  <input
                    type="text"
                    name="company_website"
                    className="contact_honeypot"
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {error && <p className="contact_error" role="alert">{error}</p>}

                  <button type="submit" className="contact_submit">
                    Send inquiry
                  </button>
                  <p className="contact_note">
                    {selected.length
                      ? `Routes to: ${routedTo.join(', ')}`
                      : 'Select one or more services above.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
