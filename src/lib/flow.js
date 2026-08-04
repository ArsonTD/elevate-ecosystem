/**
 * Pintor de "flow": gradiente fluido animado sobre canvas 2D.
 * Sustituto propio y auto-contenido de los videos de tinta/gradiente.
 * Se usa tanto en slots de video (Approach) como en la cara-video
 * del cubo 3D (CanvasTexture).
 */

const PLUMES = [
  { c: [255, 96, 40], r: .58, sx: .35, sy: .28, px: .30, py: .35 },
  { c: [255, 45, 150], r: .52, sx: .28, sy: .36, px: .75, py: .30 },
  { c: [120, 80, 255], r: .60, sx: .32, sy: .30, px: .55, py: .75 },
  { c: [35, 210, 190], r: .44, sx: .38, sy: .26, px: .18, py: .78 },
  { c: [255, 190, 60], r: .38, sx: .26, sy: .34, px: .88, py: .82 },
]

export function paintFlow(ctx, w, h, t) {
  // Fondo profundo
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#120f2e')
  bg.addColorStop(1, '#2a0f28')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'screen'

  PLUMES.forEach((p, i) => {
    const x = (p.px + Math.sin(t * .00023 + i * 1.7) * p.sx * .5) * w
    const y = (p.py + Math.cos(t * .00019 + i * 2.3) * p.sy * .5) * h
    const r = p.r * Math.min(w, h) * (1 + Math.sin(t * .0003 + i) * .18)

    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},.9)`)
    g.addColorStop(.55, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},.35)`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.globalCompositeOperation = 'source-over'
}
