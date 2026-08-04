import { useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './lib/gsapSetup'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import About from './pages/About'
import Companies from './pages/Companies'
import Company from './pages/Company'
import Contact from './pages/Contact'
import TeamPage from './pages/TeamPage'

/** Al cambiar de ruta: vuelve arriba y recalcula los ScrollTriggers. */
function RouteReset() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return null
}

export default function App() {
  useSmoothScroll()

  return (
    // basename: "/" en local y "/<repo>/" al publicar en GitHub Pages
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteReset />
      <Preloader />
      <div className="page-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:slug" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/works" element={<Navigate to="/companies" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
