import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, splitWords, reducedMotion } from '../lib/gsapSetup'
import { asset } from '../lib/companies'
import './aboutheader.css'

/**
 * Header del About: label + titular centrado y, debajo, un prisma 3D
 * flotante (Three.js) con 4 caras — una por video de las empresas —
 * cada una con su gradiente y caption, girando con idle + mouse + scroll.
 */

const FACES = [
  { src: 'cube-pma',   caption: 'Real crews, real work' },
  { src: 'cube-aft',   caption: 'The group, in motion' },
  { src: 'cube-par-2', caption: 'Knoxville and beyond' },
  { src: 'cube-par-1', caption: 'On the way to your project' },
]

const FW = 512                        // ancho de referencia de una cara
const FH = Math.round(FW * 1.85)      // ratio 1:1.85 del original
const OH = Math.round(FH * 0.2)       // alto de la banda de caption
const RADIUS = 46                     // esquinas redondeadas (≈3vh)

// Prisma: ancho 1, alto 1.85, profundidad 1 (caras a ±0.5)
const W = 1, H = 1.85, D = 1

function roundRectPath(ctx, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.arcTo(w, 0, w, h, r)
  ctx.arcTo(w, h, 0, h, r)
  ctx.arcTo(0, h, 0, 0, r)
  ctx.arcTo(0, 0, w, 0, r)
  ctx.closePath()
}

/**
 * Máscara de esquinas redondeadas, compartida por las 4 caras. El video
 * llega como textura rectangular, así que el redondeo se aplica por
 * alpha en vez de recortarlo en un canvas por frame.
 */
function makeCornerMask() {
  const canvas = document.createElement('canvas')
  canvas.width = FW
  canvas.height = FH
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, FW, FH)
  roundRectPath(ctx, FW, FH, RADIUS)
  ctx.fillStyle = '#fff'
  ctx.fill()
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  return tex
}

/** Gradiente superior + caption + línea, como las caras del original */
function makeOverlay(caption) {
  const canvas = document.createElement('canvas')
  canvas.width = FW
  canvas.height = OH
  const ctx = canvas.getContext('2d')

  // El path usa el alto completo de la cara para que el recorte caiga
  // sobre las esquinas superiores reales, no sobre las de la banda.
  ctx.save()
  roundRectPath(ctx, FW, FH, RADIUS)
  ctx.clip()

  const grad = ctx.createLinearGradient(0, 0, 0, OH)
  grad.addColorStop(0, 'rgba(0,0,0,.47)')
  grad.addColorStop(.54, 'rgba(0,0,0,.05)')
  grad.addColorStop(.78, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, FW, OH)

  const pad = 34
  ctx.fillStyle = '#fff'
  ctx.font = '500 21px "Schibsted Grotesk", Arial, sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(caption, pad, pad)

  ctx.fillStyle = 'rgba(255,255,255,.38)'
  ctx.fillRect(pad, pad + 34, FW - pad * 2, 1.5)
  ctx.restore()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return { tex, canvas, ctx, caption }
}

/**
 * Encaja un medio de proporción libre en la cara sin deformarlo
 * (equivalente a `object-fit: cover`), recortando por UV.
 */
function coverTexture(tex, mediaW, mediaH) {
  if (!mediaW || !mediaH) return
  const face = W / H
  const media = mediaW / mediaH
  tex.repeat.set(1, 1)
  tex.offset.set(0, 0)
  if (media > face) {
    tex.repeat.x = face / media
    tex.offset.x = (1 - tex.repeat.x) / 2
  } else {
    tex.repeat.y = media / face
    tex.offset.y = (1 - tex.repeat.y) / 2
  }
}

/** Coloca la cara i en su lado del prisma: frente, derecha, atrás, izquierda */
function placeFace(obj, i, depth) {
  if (i === 0) obj.position.z = depth
  if (i === 1) { obj.rotation.y = Math.PI / 2; obj.position.x = depth }
  if (i === 2) { obj.rotation.y = Math.PI; obj.position.z = -depth }
  if (i === 3) { obj.rotation.y = -Math.PI / 2; obj.position.x = -depth }
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
      mount.style.backgroundImage = `url('${asset(`/video/${FACES[0].src}-poster.jpg`)}')`
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 50)
    camera.position.set(0, 0, 5.4)

    const group = new THREE.Group()
    scene.add(group)

    const faceGeo = new THREE.PlaneGeometry(W, H)
    const capGeo = new THREE.PlaneGeometry(W, H * 0.2)
    const mask = makeCornerMask()
    const disposables = [faceGeo, capGeo, mask]
    const videos = []

    // Con motion reducido no hay bucle: se pinta un solo frame cada vez
    // que algo cambia (póster cargado, fuente lista, resize).
    const renderOnce = () => renderer.render(scene, camera)

    FACES.forEach((face, i) => {
      // Arranca sin mapa y en negro: la textura solo se monta cuando hay
      // algo que subir al GPU, para no bindear un <video> aún sin frames.
      const mat = new THREE.MeshBasicMaterial({
        alphaMap: mask,
        transparent: true,
        color: 0x0a0a0a,
      })
      const mesh = new THREE.Mesh(faceGeo, mat)
      placeFace(mesh, i, D / 2)
      group.add(mesh)

      const attach = (map, mediaW, mediaH) => {
        map.colorSpace = THREE.SRGBColorSpace
        map.anisotropy = renderer.capabilities.getMaxAnisotropy()
        coverTexture(map, mediaW, mediaH)
        mat.map = map
        mat.color.setHex(0xffffff)
        mat.needsUpdate = true
        disposables.push(map)
      }

      if (reducedMotion) {
        new THREE.TextureLoader().load(asset(`/video/${face.src}-poster.jpg`), (tex) => {
          attach(tex, tex.image.width, tex.image.height)
          renderOnce()
        })
      } else {
        const video = document.createElement('video')
        video.muted = true
        video.defaultMuted = true
        video.loop = true
        video.playsInline = true
        video.setAttribute('playsinline', '')
        video.setAttribute('muted', '')
        video.preload = 'auto'
        video.className = 'ah_cube-src'
        video.src = asset(`/video/${face.src}.mp4`)
        // Safari en iOS solo decodifica de forma fiable si el elemento
        // está en el documento, así que va oculto pero presente.
        mount.appendChild(video)
        videos.push(video)

        video.addEventListener('loadeddata', () => {
          attach(new THREE.VideoTexture(video), video.videoWidth, video.videoHeight)
        }, { once: true })
      }

      // El caption va en su propio plano, delante del video: así el
      // gradiente y el texto se suben a la GPU una sola vez.
      const ov = makeOverlay(face.caption)
      const capMat = new THREE.MeshBasicMaterial({
        map: ov.tex, transparent: true, depthWrite: false,
      })
      const cap = new THREE.Mesh(capGeo, capMat)
      placeFace(cap, i, D / 2 + .004)
      cap.position.y = H / 2 - (H * 0.2) / 2
      cap.renderOrder = 1
      group.add(cap)

      disposables.push(mat, ov.tex, capMat)
    })

    // Redibuja captions cuando la fuente web esté lista
    if (document.fonts?.ready) document.fonts.ready.then(() => {
      group.children.forEach((m) => {
        if (m.geometry === capGeo) m.material.map.needsUpdate = true
      })
      if (reducedMotion) renderOnce()
    })

    const resize = () => {
      const r = mount.getBoundingClientRect()
      renderer.setSize(r.width, r.height)
      camera.aspect = r.width / r.height
      camera.updateProjectionMatrix()
      if (reducedMotion) renderOnce()
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

      baseY += .0035 // giro idle
      group.position.y = Math.sin(t * .9) * .05 // flotación
      group.rotation.x += ((state.my * .1) - group.rotation.x) * .06
      group.rotation.y = baseY + scrollRot + state.mx * .18

      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }

    // Entrada del cubo (como la reveal del original)
    gsap.set(mount, { autoAlpha: 1 })
    if (!reducedMotion) {
      gsap.from(group.position, { y: -2.4, duration: 1.7, ease: 'expo.out', delay: .55 })
      gsap.from(group.scale, { x: .6, y: .6, z: .6, duration: 1.7, ease: 'expo.out', delay: .55 })
      const spin = { v: -2.6 }
      gsap.to(spin, {
        v: 0, duration: 2, ease: 'expo.out', delay: .55,
        onUpdate: () => { baseY = spin.v },
      })
    } else {
      group.rotation.y = baseY
      renderOnce()
    }

    // Renderiza y reproduce solo mientras el prisma está en pantalla: son
    // 4 videos subiendo textura al GPU en cada frame, y dejarlos corriendo
    // tras salir del viewport producía tirones en el resto de la página.
    let running = false
    const start = () => {
      if (running || reducedMotion) return
      running = true
      videos.forEach((v) => { const p = v.play(); p?.catch(() => {}) })
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (!running) return
      running = false
      videos.forEach((v) => v.pause())
      cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(mount)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('mousemove', onMove)
      ro.disconnect()
      st.scrollTrigger?.kill()
      st.kill()
      videos.forEach((v) => {
        v.removeAttribute('src')
        v.load()
        v.remove()
      })
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
