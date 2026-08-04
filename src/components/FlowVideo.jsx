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
    } else {
      const loop = (t) => {
        paintFlow(ctx, canvas.width, canvas.height, t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas className={`flow-video ${className}`} ref={ref} aria-hidden="true" />
}
