import Hero from '../../components/layout/Hero.tsx'
import ClientLogos from '../../components/layout/ClientLogos.tsx'
import Services from '../../components/layout/Services.tsx'
import Niches from '../../components/layout/Niches.tsx'
import SolutionsShowcase from '../../components/layout/SolutionsShowcase.tsx'
import Portfolio from '../../components/layout/Portfolio.tsx'
import AboutMe from '../../components/layout/AboutMe.tsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <Services />
      <SolutionsShowcase />
      <Niches />
      <Portfolio />
      <AboutMe />
    </>
  )
}
