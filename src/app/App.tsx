import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Footer from '../components/layout/Footer.tsx'
import Navbar from '../components/layout/Navbar.tsx'
import Container from '../components/layout/Container.tsx'
import WhatsAppButton from '../components/ui/WhatsAppButton.tsx'
import HomePage from '../pages/Home/index.tsx'
import ServicosPage from '../pages/Servicos/index.tsx'
import NichosPage from '../pages/Nichos/index.tsx'
import PortfolioPage from '../pages/Portfolio/index.tsx'
import FAQPage from '../pages/FAQ/index.tsx'
import ContatoPage from '../pages/Contato/index.tsx'
import PoliticaPage from '../pages/Politica/index.tsx'
import ObrigadoPage from '../pages/Obrigado/index.tsx'
import LpAdvogadosPage from '../pages/LpAdvogados/index.tsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return null
}

function App() {
  const { pathname } = useLocation()
  const isLandingPage = pathname.startsWith('/lp/')

  if (isLandingPage) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/lp/advogados" element={<LpAdvogadosPage />} />
        </Routes>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-800">
      <ScrollToTop />
      <Navbar />
      <main className="pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Servicos" element={<ServicosPage />} />
          <Route path="/Nichos" element={<NichosPage />} />
          <Route path="/Portfolio" element={<PortfolioPage />} />
          <Route path="/FAQ" element={<FAQPage />} />
          <Route path="/Contato" element={<Container><ContatoPage /></Container>} />
          <Route path="/Politica" element={<PoliticaPage />} />
          <Route path="/Obrigado" element={<Container><ObrigadoPage /></Container>} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
