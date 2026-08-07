import Hero from '../components/Hero'
import Brands from '../components/Brands'
import StickyAbout from '../components/StickyAbout'
import WorkList from '../components/WorkList'
import Services from '../components/Services'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <main>
      <StickyAbout />
      <Brands />
      <Hero />
      <WorkList />
      <Services />
      <CTA />
    </main>
  )
}
