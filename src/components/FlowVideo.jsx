import { useEffect, useRef } from 'react'
import { paintFlow } from '../lib/flow'
import { reducedMotion } from '../lib/gsapSetup'

/** Slot de "video" fluido: canvas animado con blur, estilo tinta. */
export default function FlowVideo({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let running = false

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(2, Math.floor(r.width / 2))
      canvas.height = Math.max(2, Math.floor(r.height / 2))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (reducedMotion) {
      paintFlow(ctx, canvas.width, canvas.height, 12000)
      return () => ro.disconnect()
    }

    const loop = (t) => {
      paintFlow(ctx, canvas.width, canvas.height, t)
      raf = requestAnimationFrame(loop)
    }

    // Pinta solo mientras el canvas está en pantalla: lleva blur(14px)
    // en CSS y cada repintado re-rasteriza el filtro, así que dejarlo
    // corriendo fuera del viewport producía tirones en todo el scroll.
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop) } }
    const stop = () => { if (running) { running = false; cancelAnimationFrame(raf) } }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(canvas)

    return () => { stop(); io.disconnect(); ro.disconnect() }
  }, [])

  return <canvas className={`flow-video ${className}`} ref={ref} aria-hidden="true" />
}
