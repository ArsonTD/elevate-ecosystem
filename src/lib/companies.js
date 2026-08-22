/**
 * Datos del ecosistema Elevate: las seis empresas, escenarios de
 * cross-discovery y el mapa servicio → empresa del formulario router.
 *
 * Descripciones, categorías y servicios confirmados por el cliente el
 * 2026-08-20. Corrigieron dos suposiciones anteriores: Monarch es
 * logística para estudios de interiorismo (no obra) y Parallel es la
 * constructora (no mudanzas); Cutting Edge hace acabados de pared, no
 * carpintería. SCENARIOS y SERVICE_OPTIONS se reajustaron en
 * consecuencia, porque el formulario enrutaba a la empresa equivocada.
 *
 * PENDIENTE:
 *  - Cutting Edge Finishes y Luv Painting: sin web ni redes localizadas.
 *    Los homónimos de buscadores son de otros estados — NO usarlos.
 *  - Electrical y Plumbing: ninguna de las seis los declara, así que
 *    entran por el inbox central de Elevate.
 *  - EMF: logo entregado pero empresa no identificada. El archivo está
 *    en public/logos/emf.png, sin usar hasta que el cliente lo aclare.
 */

/**
 * Prefijo del sitio: "/" en local y "/<repo>/" al publicarlo en
 * GitHub Pages. Todo lo que viva en public/ debe pasar por aquí o
 * daría 404 al desplegar en un subdirectorio.
 */
export const asset = (path) =>
  import.meta.env.BASE_URL + String(path).replace(/^\//, '')

/**
 * Fuente de imagen. Acepta dos cosas:
 *  - una ruta local que empieza por "/" → foto real del cliente,
 *    resuelta contra el prefijo del sitio (el recorte lo hace el
 *    object-fit del CSS)
 *  - un id de Unsplash → se pide ya recortado al tamaño pedido
 */
export const photo = (src, w, h) => {
  if (!src) return ''
  if (src.startsWith('/')) return asset(src)
  return `https://images.unsplash.com/photo-${src}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`
}

export const COMPANIES = [
  {
    slug: 'afterimage-lighting',
    logo: '/logos/afterimage-lighting.png',
    name: 'Afterimage Lighting',
    category: 'Lighting',
    tagline: 'Architectural & decorative lighting',
    desc: 'Architectural and decorative lighting — design and distribution.',
    services: ['Lighting design', 'Architectural lighting', 'Decorative lighting', 'Distribution'],
    specialties: ['Architectural lighting', 'Decorative fixtures', 'Design & distribution'],
    related: ['avs', 'cutting-edge'],
    links: {
      site: 'https://www.afterimagelighting.com/',
      instagram: 'https://www.instagram.com/afterimagelighting/',
      facebook: 'https://www.facebook.com/profile.php?id=61559795840296',
      linkedin: 'https://www.linkedin.com/company/afterimage-lighting',
    },
    phone: '865-214-6376',
    email: 'info@afterimagelighting.com',
    seed: 'elv-co-lighting',
    img: '/photos/afterimage-card.jpg',
    gallery: ['/photos/afterimage-lighting.jpg'],
    grad: ['#ffb347', '#2b1600'],
    // Video de la tarjeta pequeña del listado. Sin él, esa tarjeta cae
    // al gradiente de `grad`.
    cardVideo: '/video/card-afterimage-lighting.mp4',
    cardPoster: '/video/card-afterimage-lighting-poster.jpg',
  },
  {
    slug: 'monarch',
    logo: '/logos/monarch.webp',
    name: 'Monarch',
    category: 'Logistics',
    tagline: 'Receiving, storage & installation',
    desc: 'Receiving, inspecting, storage and installations for interior design firms.',
    services: ['Receiving', 'Inspecting', 'Storage', 'Installations'],
    specialties: ['Support for interior design firms', 'Warehousing & inspection', 'White-glove installation'],
    related: ['parallel', 'cutting-edge'],
    links: {
      site: 'https://www.monarchdesignersolutions.com/',
      instagram: 'https://www.instagram.com/monarch_designersolutions/',
      facebook: 'https://www.facebook.com/p/Monarch-Designer-Solutions-61577344197589/',
      linkedin: null,
    },
    phone: '865-214-7388',
    email: 'info@monarchdesignersolutions.com',
    seed: 'elv-co-remodel',
    img: '/photos/monarch-lounge.jpg',
    gallery: ['/photos/monarch-living.jpg'],
    grad: ['#e8dfca', '#5a4a2f'],
    cardVideo: '/video/card-monarch.mp4',
    cardPoster: '/video/card-monarch-poster.jpg',
  },
  {
    slug: 'parallel',
    logo: '/logos/parallel.webp',
    name: 'Parallel Construction',
    category: 'Construction',
    tagline: 'Renovations, additions & custom homes',
    desc: 'Renovations, additions and custom homes.',
    services: ['Renovations', 'Additions', 'Custom homes'],
    specialties: ['Whole-home renovation', 'Additions', 'New custom builds'],
    related: ['cutting-edge', 'luv-painting'],
    links: {
      site: 'https://www.parallelconstruction.com/',
      instagram: 'https://www.instagram.com/parallelconstructionservices/',
      facebook: 'https://www.facebook.com/ParallelConstructionServices',
      linkedin: null,
    },
    phone: null,
    email: 'info@parallel.contractors',
    seed: 'elv-co-moving',
    img: '/photos/parallel-foundation.jpg',
    cardVideo: '/video/card-parallel.mp4',
    cardPoster: '/video/card-parallel-poster.jpg',
    gallery: ['/photos/parallel-house.jpg', '/photos/parallel-painting.jpg'],
    grad: ['#9db8d2', '#1d2a3a'],
  },
  {
    slug: 'cutting-edge',
    logo: '/logos/cutting-edge.png',
    name: 'Cutting Edge',
    category: 'Finishes',
    tagline: 'Drywall, plaster & wall coverings',
    desc: 'Drywall, Venetian plaster and wall coverings.',
    services: ['Drywall', 'Venetian plaster', 'Wall coverings'],
    specialties: ['Venetian plaster', 'Specialty wall coverings', 'Drywall finishing'],
    related: ['parallel', 'luv-painting'],
    links: { site: null, instagram: null, facebook: null, linkedin: null },
    phone: null,
    email: null,
    seed: 'elv-co-carpentry',
    img: '/photos/cutting-edge.jpg',
    cardVideo: '/video/card-cutting-edge.mp4',
    cardPoster: '/video/card-cutting-edge-poster.jpg',
    gallery: ['/photos/cutting-edge-crew.jpg'],
    grad: ['#c98d5a', '#2e1c0e'],
  },
  {
    slug: 'avs',
    logo: '/logos/avs.svg',
    name: 'AVS',
    category: 'AV & Smart Home',
    tagline: 'Audio, video & smart home',
    desc: 'Audio, video and smart-home systems — home theaters, whole-home audio, networking and automation, installed clean and configured right.',
    services: ['Home theater', 'Whole-home audio', 'Networking & Wi-Fi', 'Smart home automation', 'TV mounting'],
    specialties: ['Home theaters', 'Smart automation', 'Commercial AV'],
    related: ['afterimage-lighting', 'cutting-edge'],
    links: {
      site: 'https://www.avsdc.com/',
      instagram: null,
      facebook: 'https://www.facebook.com/pages/category/Audio-Visual-Equipment-Store/AVS-Design-Concepts-Inc-100253788658721/',
      linkedin: 'https://www.linkedin.com/company/avs-design-concepts-inc.',
    },
    phone: '865-523-4018',
    email: 'info@avsdc.com',
    seed: 'elv-co-av',
    img: '/photos/avs-fireplace.jpg',
    // Sin video todavía: la tarjeta pequeña se queda en foto fija.
    cardPoster: '/photos/avs-card.jpg',
    gallery: ['/photos/avs-frame-tv.jpg'],
    grad: ['#7a5cff', '#120a2e'],
  },
  {
    slug: 'luv-painting',
    logo: '/logos/luv-painting.png',
    name: 'Luv Painting',
    category: 'Painting',
    tagline: 'Painting',
    desc: 'Painting.',
    services: ['Painting'],
    specialties: ['Interior painting', 'Exterior painting'],
    related: ['parallel', 'cutting-edge'],
    links: { site: null, instagram: null, facebook: null, linkedin: null },
    phone: null,
    email: null,
    seed: 'elv-co-painting',
    img: '1562259949-e8e7689d7828',
    // Carrusel de la tarjeta pequeña: cruza entre estas fotos en bucle.
    cardImages: [
      '/photos/luv-card-1.jpg',
      '/photos/luv-card-2.jpg',
      '/photos/luv-card-3.jpg',
      '/photos/luv-card-4.jpg',
      '/photos/luv-card-5.jpg',
    ],
    grad: ['#ff7a9e', '#3a0f1e'],
  },
]

export const getCompany = (slug) => COMPANIES.find((c) => c.slug === slug)

/** Escenarios "Solutions by project" (cross-discovery). */
export const SCENARIOS = [
  {
    title: 'Renovating a property',
    desc: 'Construction, drywall and plaster, paint and lighting — one submission covers the whole scope.',
    companies: ['parallel', 'cutting-edge', 'luv-painting', 'afterimage-lighting'],
    seed: 'elv-scene-renovate',
    img: '1595814432314-90095f342694',
  },
  {
    title: 'Furnishing a design project',
    desc: 'Pieces received, inspected and stored until install day — with lighting and AV to match.',
    companies: ['monarch', 'afterimage-lighting', 'avs'],
    seed: 'elv-scene-move',
    img: '1586023492125-27b2c045efd7',
  },
  {
    title: 'Building or adding on',
    desc: 'Additions and custom homes, finished inside with plaster, paint and smart systems.',
    companies: ['parallel', 'cutting-edge', 'avs'],
    seed: 'elv-scene-upgrade',
    img: '1590725140246-20acdee442be',
  },
]

/**
 * Opciones del formulario router: servicio visible → empresa destino.
 * El backend (función serverless) usará este mapa para enrutar cada
 * inquiry al inbox correcto + copia al inbox central de Elevate.
 */
export const SERVICE_OPTIONS = [
  { id: 'lighting',    label: 'Lighting',                    slug: 'afterimage-lighting' },
  { id: 'renovation',  label: 'Renovations',                 slug: 'parallel' },
  { id: 'additions',   label: 'Additions',                   slug: 'parallel' },
  { id: 'customhome',  label: 'Custom homes',                slug: 'parallel' },
  { id: 'drywall',     label: 'Drywall',                     slug: 'cutting-edge' },
  { id: 'plaster',     label: 'Venetian plaster',            slug: 'cutting-edge' },
  { id: 'wallcover',   label: 'Wall coverings / wallpaper',  slug: 'cutting-edge' },
  { id: 'painting',    label: 'Painting',                    slug: 'luv-painting' },
  { id: 'av',          label: 'Audio, video & smart home',   slug: 'avs' },
  { id: 'receiving',   label: 'Receiving, storage & installation', slug: 'monarch' },
  // Sin empresa asignada: entran por el inbox central de Elevate, que
  // los deriva. Ninguna de las seis declara estos oficios.
  { id: 'electrical',  label: 'Electrical',                  slug: null },
  { id: 'plumbing',    label: 'Plumbing',                    slug: null },
]

/** Nombre del destinatario de un servicio, para mostrar en el formulario. */
export const routeTarget = (option) =>
  option.slug ? getCompany(option.slug).name : 'the Elevate team'

/**
 * Redes del grupo Elevate. Solo se renderizan las que tengan URL:
 * dejar en null lo que no exista todavía (nada de enlaces rotos).
 */
export const ELEVATE_SOCIAL = {
  linkedin: null,
  instagram: null,
  facebook: null,
}

/**
 * Contacto del grupo para el footer. Teléfono y email siguen sin
 * confirmar: quedan en null y no se pintan hasta que existan.
 */
export const ELEVATE_CONTACT = {
  address: ['917 Dinwiddie St', 'Knoxville, TN 37921'],
  phone: null,
  email: null,
}
