import PageHero from '../../components/layout/PageHero.tsx'
import Button from '../../components/ui/Button.tsx'
import { useSiteData } from '../../admin/context/SiteDataContext'

export default function PortfolioPage() {
  const { portfolioPage } = useSiteData()
  return (
    <>
      <PageHero 
        title="Portfólio" 
        subtitle="Nossos projetos"
        backgroundImage="/images/portfolio/hazak-fit.png"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Projetos em destaque
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Conheça alguns dos projetos que desenvolvi para clientes de diversos segmentos.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioPage.map((projeto) => (
              <div
                key={projeto.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-xl"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={projeto.image}
                    alt={projeto.title}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <span className="inline-block rounded-full bg-[#14CC45]/10 px-3 py-1 text-xs font-semibold text-[#14CC45]">
                    {projeto.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{projeto.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{projeto.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button as="a" href="/Contato" size="lg" clickId="portfolio-cta">
              Solicitar orçamento
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
