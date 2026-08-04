import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsapSetup'

/** Scroll suave estilo Webflow/Lenis sincronizado con ScrollTrigger. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
