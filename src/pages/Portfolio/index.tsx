import PageHero from '../../components/layout/PageHero.tsx'
import Button from '../../components/ui/Button.tsx'

const projetos = [
  { image: '/images/portfolio/ativa-tea.png', title: 'Ativa TEA', category: 'Site Institucional', description: 'Portal informativo com recursos educacionais e captação de contatos de responsáveis.' },
  { image: '/images/portfolio/casa-bebe.png', title: 'Casa do Bebê', category: 'E-commerce', description: 'Experiência acolhedora com catálogo organizado e chamadas à ação claras para aumentar pedidos.' },
  { image: '/images/portfolio/clinica-sim.png', title: 'Clínica SIM', category: 'Site Institucional', description: 'Site institucional com foco em credibilidade e facilidade para agendar consultas online.' },
  { image: '/images/portfolio/grafica-inova-print.png', title: 'Gráfica Inova Print', category: 'Site Institucional', description: 'Mostruário digital com portfólio e formulário de orçamento para acelerar o atendimento comercial.' },
  { image: '/images/portfolio/hazak-fit.png', title: 'Hazak Fit', category: 'Landing Page', description: 'Landing page enxuta com formulário integrado para captar novos alunos e destacar diferenciais.' },
  { image: '/images/portfolio/personal-juninho.png', title: 'Personal Juninho', category: 'Landing Page', description: 'Landing page com storytelling e depoimentos para converter leads em planos de personal trainer.' },
  { image: '/images/portfolio/victor-manuel.png', title: 'Victor Manuel', category: 'Site Institucional', description: 'Site institucional para engenheiro civil com CTA direto no WhatsApp e destaque para serviços.' },
]

export default function PortfolioPage() {
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
            {projetos.map((projeto) => (
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
