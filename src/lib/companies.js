/**
 * Datos del ecosistema Elevate: las seis empresas, escenarios de
 * cross-discovery y el mapa servicio → empresa del formulario router.
 *
 * NOTA: descripciones, servicios y especialidades de Monarch, Parallel,
 * Cutting Edge y AVS son PLACEHOLDERS deducidos de la propuesta —
 * reemplazar con el contenido real que entregue Elevate.
 *
 * PENDIENTE DE CONFIRMAR CON EL CLIENTE (2026-08-03):
 *  - Monarch / Parallel: sus webs sugieren lo contrario de lo asignado
 *    aquí — monarchdesignersolutions.com se presenta como "logistics
 *    services tailored to interior designers" (+ Monarch Moving), y
 *    parallelconstruction.com es constructora. Se mantiene la
 *    asignación actual por decisión del cliente; si resulta invertida,
 *    hay que intercambiar category/tagline/desc/services/specialties
 *    y revisar SCENARIOS + SERVICE_OPTIONS (afecta el routing del form).
 *  - Parallel Construction tiene sede en Maryville, TN y no hay vínculo
 *    publicado con Elevate: confirmar que es la empresa correcta.
 *  - Cutting Edge Finishes y Luv Painting: sin presencia web localizada
 *    en Knoxville. Los homónimos que aparecen en buscadores son de otros
 *    estados (Oregón/Washington y Florida/Minnesota) — NO usarlos.
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
    tagline: 'Architectural & landscape lighting',
    desc: 'Lighting design and installation for homes and commercial properties — from landscape and architectural lighting to full LED upgrades.',
    services: ['Lighting design', 'Landscape lighting', 'Architectural accents', 'LED retrofits', 'Fixture installation'],
    specialties: ['Outdoor & landscape lighting', 'Holiday & event lighting', 'Energy-efficient upgrades'],
    related: ['avs', 'luv-painting'],
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
  },
  {
    slug: 'monarch',
    logo: '/logos/monarch.webp',
    name: 'Monarch',
    category: 'Remodeling',
    tagline: 'Renovation & remodeling',
    desc: 'Full-scope remodeling and renovation — kitchens, baths and whole-property updates, managed from demo to final walkthrough.',
    services: ['Kitchen & bath remodeling', 'Interior renovation', 'Property updates', 'Project management'],
    specialties: ['Kitchen & bath', 'Rental turnovers', 'Whole-property renovation'],
    related: ['cutting-edge', 'luv-painting'],
    links: {
      site: 'https://www.monarchdesignersolutions.com/',
      instagram: 'https://www.instagram.com/monarch_designersolutions/',
      facebook: 'https://www.facebook.com/p/Monarch-Designer-Solutions-61577344197589/',
      linkedin: null,
    },
    phone: '865-214-7388',
    email: 'info@monarchdesignersolutions.com',
    seed: 'elv-co-remodel',
    img: '/photos/monarch.jpg',
    gallery: ['/photos/monarch-living.jpg'],
    grad: ['#e8dfca', '#5a4a2f'],
  },
  {
    slug: 'parallel',
    logo: '/logos/parallel.webp',
    name: 'Parallel',
    category: 'Moving',
    tagline: 'Furniture moving & staging',
    desc: 'Furniture moving, staging and on-site logistics — careful crews that get properties emptied, filled or show-ready on schedule.',
    services: ['Furniture moving', 'Staging & placement', 'Delivery & assembly', 'On-site logistics'],
    specialties: ['Property staging', 'In-home moves', 'Coordinated with renovation crews'],
    related: ['monarch', 'luv-painting'],
    links: {
      site: 'https://www.parallelconstruction.com/',
      instagram: 'https://www.instagram.com/parallelconstructionservices/',
      facebook: 'https://www.facebook.com/ParallelConstructionServices',
      linkedin: null,
    },
    phone: null,
    email: 'info@parallel.contractors',
    seed: 'elv-co-moving',
    img: '/photos/parallel.jpg',
    gallery: ['/photos/parallel-house.jpg', '/photos/parallel-painting.jpg'],
    grad: ['#9db8d2', '#1d2a3a'],
  },
  {
    slug: 'cutting-edge',
    logo: '/logos/cutting-edge.png',
    name: 'Cutting Edge',
    category: 'Carpentry',
    tagline: 'Flooring & finish carpentry',
    desc: 'Flooring, trim and finish carpentry — the detail work that makes a renovation read as done, from doors and hardware to custom builds.',
    services: ['Flooring installation', 'Trim & finish carpentry', 'Doors & hardware', 'Custom builds'],
    specialties: ['Hardwood & LVP flooring', 'Finish trim packages', 'Built-ins'],
    related: ['monarch', 'afterimage-lighting'],
    links: { site: null, instagram: null, facebook: null, linkedin: null },
    phone: null,
    email: null,
    seed: 'elv-co-carpentry',
    img: '/photos/cutting-edge.jpg',
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
    img: '/photos/avs-media-room.jpg',
    gallery: ['/photos/avs-frame-tv.jpg'],
    grad: ['#7a5cff', '#120a2e'],
  },
  {
    slug: 'luv-painting',
    logo: '/logos/luv-painting.png',
    name: 'Luv Painting',
    category: 'Painting',
    tagline: 'Interior & exterior painting',
    desc: 'Interior and exterior painting with clean prep and clean lines — drywall repair, cabinet refinishing and specialty finishes included.',
    services: ['Interior painting', 'Exterior painting', 'Drywall repair', 'Cabinet refinishing', 'Specialty finishes'],
    specialties: ['Repaint before sale or rental', 'Cabinet & trim work', 'Commercial repaints'],
    related: ['monarch', 'parallel'],
    links: { site: null, instagram: null, facebook: null, linkedin: null },
    phone: null,
    email: null,
    seed: 'elv-co-painting',
    img: '1562259949-e8e7689d7828',
    grad: ['#ff7a9e', '#3a0f1e'],
  },
]

export const getCompany = (slug) => COMPANIES.find((c) => c.slug === slug)

/** Escenarios "Solutions by project" (cross-discovery). */
export const SCENARIOS = [
  {
    title: 'Renovating a property',
    desc: 'Remodeling, flooring, paint and lighting — one submission covers the whole scope.',
    companies: ['monarch', 'cutting-edge', 'luv-painting', 'afterimage-lighting'],
    seed: 'elv-scene-renovate',
    img: '1595814432314-90095f342694',
  },
  {
    title: 'Moving in or moving out',
    desc: 'Furniture moved, walls freshened, AV and Wi-Fi running from day one.',
    companies: ['parallel', 'luv-painting', 'avs'],
    seed: 'elv-scene-move',
    img: '1586023492125-27b2c045efd7',
  },
  {
    title: 'Upgrading a space',
    desc: 'Lighting, smart-home systems and finish work that lift the property’s value.',
    companies: ['afterimage-lighting', 'avs', 'cutting-edge'],
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
  { id: 'lighting',   label: 'Lighting',                   slug: 'afterimage-lighting' },
  { id: 'electrical', label: 'Electrical',                 slug: 'afterimage-lighting' },
  { id: 'remodeling', label: 'Remodeling & renovation',    slug: 'monarch' },
  { id: 'moving',     label: 'Furniture moving & staging', slug: 'parallel' },
  { id: 'flooring',   label: 'Flooring & finish carpentry', slug: 'cutting-edge' },
  { id: 'av',         label: 'Audio, video & smart home',  slug: 'avs' },
  { id: 'painting',   label: 'Painting',                   slug: 'luv-painting' },
  { id: 'plaster',    label: 'Plaster',                    slug: 'luv-painting' },
  { id: 'wallpaper',  label: 'Wallpaper',                  slug: 'luv-painting' },
  // Sin empresa asignada todavía: entra por el inbox central de Elevate,
  // que lo deriva. Igual servirá cuando se sumen empresas nuevas.
  { id: 'plumbing',   label: 'Plumbing',                   slug: null },
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
