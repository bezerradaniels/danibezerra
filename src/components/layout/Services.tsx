import Button from '../ui/Button.tsx'
import { useFadeIn } from '../../hooks/useFadeIn'

const services = [
  {
    title: 'Site One Page',
    description:
      'Página única e objetiva, ideal para landing pages, portfólios pessoais e negócios que precisam de presença digital rápida.',
    icon: 'web',
    features: ['Design responsivo', 'Carregamento rápido', 'SEO otimizado'],
  },
  {
    title: 'Site Multi Page',
    description:
      'Site completo com múltiplas páginas, perfeito para empresas que precisam apresentar serviços, portfólio e blog.',
    icon: 'devices',
    features: ['Várias seções', 'Blog integrado', 'Painel administrativo'],
  },
  {
    title: 'Marketing Digital',
    description:
      'Estratégias completas de marketing para aumentar sua visibilidade online e converter visitantes em clientes.',
    icon: 'campaign',
    features: ['Google Ads', 'Redes sociais', 'E-mail marketing'],
  },
]

export default function Services() {
  const { ref: headerRef, isVisible: headerVisible } = useFadeIn()
  const { ref: cardsRef, isVisible: cardsVisible } = useFadeIn({ threshold: 0.1 })

  return (
    <section className="bg-[#FAF8F3] py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div
          ref={headerRef}
          className={`fade-in mb-12 text-center ${headerVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Nossos Serviços
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Soluções digitais sob medida para impulsionar o seu negócio
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid gap-8 md:grid-cols-3"
        >
          {services.map((service, index) => (
            <article
              key={service.title}
              className={`fade-in flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 transition hover:shadow-xl ${cardsVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14CC45]/10">
                <span className="icon text-3xl text-[#14CC45]">{service.icon}</span>
              </div>

              <h3 className="mb-2 text-xl font-bold text-slate-900">{service.title}</h3>
              <p className="mb-6 flex-1 text-slate-600">{service.description}</p>

              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="icon text-base text-[#14CC45]">check</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button as="a" href="/Contato" size="lg" clickId="home-services-cta">
            Solicitar orçamento
          </Button>
        </div>
      </div>
    </section>
  )
}
