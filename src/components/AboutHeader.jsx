import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, splitWords, reducedMotion } from '../lib/gsapSetup'
import { paintFlow } from '../lib/flow'
import { asset } from '../lib/companies'
import './aboutheader.css'

/**
 * Header del About: label + titular centrado y, debajo, un prisma 3D
 * flotante (Three.js) con 4 caras — 3 fotos y 1 "video" de flujo —
 * cada una con su gradiente y caption, girando con idle + mouse + scroll.
 */

const FACES = [
  { type: 'img', src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&h=1180&q=80', caption: 'On the way to your project' },
  { type: 'flow', caption: 'The group, in motion' },
  { type: 'img', src: asset('/photos/cutting-edge-crew.jpg'), caption: 'Real crews, real work' },
  { type: 'img', src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=640&h=1180&q=80', caption: 'Knoxville and beyond' },
]

const FW = 512            // ancho del canvas de cara
const FH = Math.round(FW * 1.85) // ratio 1:1.85 del original
const RADIUS = 46         // esquinas redondeadas (≈3vh)

function roundRectPath(ctx, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.arcTo(w, 0, w, h, r)
  ctx.arcTo(w, h, 0, h, r)
  ctx.arcTo(0, h, 0, 0, r)
  ctx.arcTo(0, 0, w, 0, r)
  ctx.closePath()
}

/** Gradiente superior + caption + línea, como las caras del original */
function drawOverlay(ctx, caption) {
  const grad = ctx.createLinearGradient(0, 0, 0, FH * 0.2)
  grad.addColorStop(0, 'rgba(0,0,0,.47)')
  grad.addColorStop(.54, 'rgba(0,0,0,.05)')
  grad.addColorStop(.78, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, FW, FH * 0.2)

  const pad = 34
  ctx.fillStyle = '#fff'
  ctx.font = '500 21px "Schibsted Grotesk", Arial, sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(caption, pad, pad)

  ctx.fillStyle = 'rgba(255,255,255,.38)'
  ctx.fillRect(pad, pad + 34, FW - pad * 2, 1.5)
}

function coverDraw(ctx, img) {
  const s = Math.max(FW / img.width, FH / img.height)
  const dw = img.width * s
  const dh = img.height * s
  ctx.drawImage(img, (FW - dw) / 2, (FH - dh) / 2, dw, dh)
}

export default function AboutHeader() {
  const ref = useRef(null)
  const mountRef = useRef(null)

  // ---------- Escena Three.js ----------
  useLayoutEffect(() => {
    const mount = mountRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      mount.classList.add('is-fallback')
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 50)
    camera.position.set(0, 0, 5.4)

    const group = new THREE.Group()
    scene.add(group)

    // Prisma: ancho 1, alto 1.85, profundidad 1 (caras a ±0.5)
    const W = 1, H = 1.85, D = 1
    const geo = new THREE.PlaneGeometry(W, H)
    const flowState = { canvas: null, ctx: null, tex: null }
    const disposables = [geo]

    FACES.forEach((face, i) => {
      const canvas = document.createElement('canvas')
      canvas.width = FW
      canvas.height = FH
      const ctx = canvas.getContext('2d')

      // Base oscura con esquinas redondeadas mientras carga
      ctx.save()
      roundRectPath(ctx, FW, FH, RADIUS)
      ctx.clip()
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, FW, FH)
      drawOverlay(ctx, face.caption)
      ctx.restore()

      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true })
      const mesh = new THREE.Mesh(geo, mat)
      disposables.push(tex, mat)

      // Posiciones: frente, derecha, atrás, izquierda (como el original)
      if (i === 0) mesh.position.z = D / 2
      if (i === 1) { mesh.rotation.y = Math.PI / 2; mesh.position.x = D / 2 }
      if (i === 2) { mesh.rotation.y = Math.PI; mesh.position.z = -D / 2 }
      if (i === 3) { mesh.rotation.y = -Math.PI / 2; mesh.position.x = -D / 2 }
      group.add(mesh)

      if (face.type === 'flow') {
        Object.assign(flowState, { canvas, ctx, tex, caption: face.caption })
      } else {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          ctx.save()
          roundRectPath(ctx, FW, FH, RADIUS)
          ctx.clip()
          coverDraw(ctx, img)
          drawOverlay(ctx, face.caption)
          ctx.restore()
          tex.needsUpdate = true
        }
        img.src = face.src
      }
    })

    // Redibuja captions cuando la fuente web esté lista
    if (document.fonts?.ready) document.fonts.ready.then(() => {
      group.children.forEach((m) => { m.material.map.needsUpdate = true })
    })

    const resize = () => {
      const r = mount.getBoundingClientRect()
      renderer.setSize(r.width, r.height)
      camera.aspect = r.width / r.height
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // Interacción: idle spin + flotación + tilt con el mouse + scroll
    const state = { mx: 0, my: 0 }
    const onMove = (e) => {
      state.mx = (e.clientX / window.innerWidth - .5) * 2
      state.my = (e.clientY / window.innerHeight - .5) * 2
    }
    window.addEventListener('mousemove', onMove)

    let scrollRot = 0
    const st = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => { scrollRot = self.progress * Math.PI * 1.2 },
      },
    })

    let baseY = reducedMotion ? Math.PI / 7 : 0
    let raf = 0
    const clock = new THREE.Clock()

    const loop = () => {
      const t = clock.getElapsedTime()

      if (!reducedMotion) {
        baseY += .0035 // giro idle
        group.position.y = Math.sin(t * .9) * .05 // flotación
        group.rotation.x += ((state.my * .1) - group.rotation.x) * .06
      }
      group.rotation.y = baseY + scrollRot + state.mx * .18

      // Cara de video: pinta el flow en cada frame
      if (flowState.ctx && !reducedMotion) {
        const c = flowState.ctx
        c.save()
        roundRectPath(c, FW, FH, RADIUS)
        c.clip()
        paintFlow(c, FW, FH, performance.now())
        drawOverlay(c, flowState.caption)
        c.restore()
        flowState.tex.needsUpdate = true
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }

    // Entrada del cubo (como la reveal del original)
    if (!reducedMotion) {
      gsap.set(mount, { autoAlpha: 1 })
      gsap.from(group.position, { y: -2.4, duration: 1.7, ease: 'expo.out', delay: .55 })
      gsap.from(group.scale, { x: .6, y: .6, z: .6, duration: 1.7, ease: 'expo.out', delay: .55 })
      const spin = { v: -2.6 }
      gsap.to(spin, {
        v: 0, duration: 2, ease: 'expo.out', delay: .55,
        onUpdate: () => { baseY = spin.v },
      })
    } else {
      gsap.set(mount, { autoAlpha: 1 })
    }

    if (flowState.ctx && reducedMotion) {
      const c = flowState.ctx
      c.save(); roundRectPath(c, FW, FH, RADIUS); c.clip()
      paintFlow(c, FW, FH, 12000); drawOverlay(c, flowState.caption); c.restore()
      flowState.tex.needsUpdate = true
      renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      ro.disconnect()
      st.scrollTrigger?.kill()
      st.kill()
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  // ---------- Reveal del texto ----------
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.ah_label, .ah_title', { autoAlpha: 1 })
        return
      }
      const words = splitWords(ref.current.querySelector('.ah_title'))
      gsap.set('.ah_title', { autoAlpha: 1 })
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.ah_label', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8 }, .15)
        .from(words, { yPercent: 115, duration: .9, stagger: .035 }, .3)

      // El prisma (superpuesto al titular) baja con el scroll y lo revela.
      // Dos límites que lo definen:
      //  - recorrido: 21vh es lo máximo que despeja el titular sin que el
      //    borde inferior del prisma cruce la línea divisoria de abajo.
      //  - tramo: se completa en los primeros ~300px de scroll, mientras
      //    el titular todavía está en pantalla. Con el tramo largo el
      //    reveal terminaba cuando el texto ya había salido por arriba.
      gsap.to('.ah_cube-stage', {
        y: '19vh',
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: '+=300',
          scrub: .6,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section_ah" ref={ref}>
      <div className="padding-global">
        <div className="ah_container">
          <div className="ah_component">
            <div className="text-style-label ah_label">About the ecosystem</div>
            <h1 className="ah_title">
              Skilled-trade companies, backed by one group so they can
              focus on the work.
            </h1>
          </div>
        </div>
      </div>

      <div className="ah_cube-stage">
        <div className="ah_cube-mount" ref={mountRef} />
      </div>
    </section>
  )
}
