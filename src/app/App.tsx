import { Routes, Route } from 'react-router-dom'
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

import { AuthProvider } from '../admin/context/AuthContext.tsx'
import { SiteDataProvider } from '../admin/context/SiteDataContext.tsx'
import ProtectedRoute from '../admin/components/ProtectedRoute.tsx'
import LoginPage from '../admin/pages/Login.tsx'
import DashboardPage from '../admin/pages/Dashboard.tsx'
import HeroEditorPage from '../admin/pages/HeroEditor.tsx'
import PortfolioHomeEditorPage from '../admin/pages/PortfolioHomeEditor.tsx'
import PortfolioPageEditorPage from '../admin/pages/PortfolioPageEditor.tsx'
import PlanosEditorPage from '../admin/pages/PlanosEditor.tsx'

function App() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/hero" element={<ProtectedRoute><HeroEditorPage /></ProtectedRoute>} />
          <Route path="/admin/portfolio-home" element={<ProtectedRoute><PortfolioHomeEditorPage /></ProtectedRoute>} />
          <Route path="/admin/portfolio-page" element={<ProtectedRoute><PortfolioPageEditorPage /></ProtectedRoute>} />
          <Route path="/admin/planos" element={<ProtectedRoute><PlanosEditorPage /></ProtectedRoute>} />

          {/* Public routes */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-[#FAF8F3] text-slate-800">
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
            }
          />
        </Routes>
      </SiteDataProvider>
    </AuthProvider>
  )
}

export default App
