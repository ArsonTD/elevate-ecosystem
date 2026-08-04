/**
 * Equipo real de Elevate (nombres y roles confirmados por el cliente).
 * `photo` es null → la card muestra un avatar de iniciales con gradiente.
 * Cuando Elevate entregue los retratos: photo: '/team/burch.jpg' (o import).
 */

export const TEAM = [
  { name: 'Burch Hutchinson', role: 'Owner', photo: null, grad: ['#3a3a3a', '#8a8a8a'] },
  { name: 'Nick Brothers', role: 'Co-Founder & Billing Coordinator', photo: null, grad: ['#5a4a2f', '#c9b48a'] },
  { name: 'Desiree Eads', role: 'Logistics Coordinator', photo: null, grad: ['#1d2a3a', '#9db8d2'] },
  { name: 'Leon Strong', role: 'Warehouse Operations Manager', photo: null, grad: ['#2e1c0e', '#c98d5a'] },
  { name: 'Eden Hutchinson', role: 'TLT Coordinator', photo: null, grad: ['#3a0f1e', '#ff7a9e'] },
  { name: 'Luke Hutchinson', role: 'Social Media Manager', photo: null, grad: ['#120a2e', '#7a5cff'] },
  { name: 'Marcus Strong', role: 'Installation & Delivery Specialist', photo: null, grad: ['#2b1600', '#ffb347'] },
  { name: 'Akeem Smith', role: 'Installation & Delivery Specialist', photo: null, grad: ['#0e2e1c', '#5ac98d'] },
  { name: 'Adrian Johansen', role: 'Installation & Delivery Specialist', photo: null, grad: ['#2e0e2a', '#c95ab8'] },
  { name: 'Abe Kinguelewa', role: 'Installation & Delivery Specialist', photo: null, grad: ['#0e1c2e', '#5a8dc9'] },
]

export const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
