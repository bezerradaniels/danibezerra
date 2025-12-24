import { Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero.tsx'

const servicos = [
  {
    id: 'sites',
    title: 'Criação de sites rápidos e focados em conversão',
    description: 'One page, multipage e landing pages com SEO, performance e integração com formulário.',
    image: '/images/portfolio/clinica-sim.png',
    tags: ['Performance', 'SEO', 'Responsivo', 'Formulário'],
    reverse: false,
  },
  {
    id: 'marketing',
    title: 'Marketing digital com estratégia e execução',
    description: 'Campanhas, criativos, tracking e otimização contínua para gerar demanda.',
    image: '/images/portfolio/hazak-fit.png',
    tags: ['Ads', 'Funil', 'A/B Testing', 'Pixel/Tag'],
    reverse: true,
  },
  {
    id: 'analytics',
    title: 'Data analytics para decisões sem achismo',
    description: 'Dashboards, eventos, mensuração e insights acionáveis.',
    image: '/images/portfolio/grafica-inova-print.png',
    tags: ['GA4', 'Eventos', 'Dashboards', 'Metas'],
    reverse: false,
  },
]

export default function ServicosPage() {
  return (
    <>
      <PageHero 
        title="Serviços" 
        subtitle="O que fazemos"
        backgroundImage="/images/portfolio/clinica-sim.png"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl space-y-24 px-6 lg:space-y-32">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                servico.reverse ? 'lg:direction-rtl' : ''
              }`}
            >
              {/* Texto */}
              <div className={servico.reverse ? 'lg:order-2' : ''}>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {servico.title}
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  {servico.description}
                </p>
                <Link
                  to="/Contato"
                  id={`servicos-cta-${servico.id}`}
                  data-click-id={`servicos-cta-${servico.id}`}
                  className="mt-6 inline-block cursor-pointer rounded-full bg-[#14CC45] px-6 py-3 font-semibold text-white shadow-lg shadow-[#14CC45]/20 transition hover:bg-[#12B83E]"
                >
                  Solicitar orçamento
                </Link>
              </div>

              {/* Imagem */}
              <div className={`relative ${servico.reverse ? 'lg:order-1' : ''}`}>
                <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-xl">
                  <img
                    src={servico.image}
                    alt={servico.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
                {/* Tags */}
                <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {servico.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      <span className="icon text-sm text-[#14CC45]">check_circle</span>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
