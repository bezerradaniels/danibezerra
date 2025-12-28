import Button from '../ui/Button.tsx'
import { useFadeIn } from '../../hooks/useFadeIn'

type MockupConfig = {
  badge: string
  title: string
  subtitle: string
  gradient: string
  accent: string
  metrics: { label: string; value: string }[]
}

type Solution = {
  title: string
  subtitle: string
  bullets: string[]
  tags: string[]
  mockup: MockupConfig
  imageAlign: 'left' | 'right'
}

function MockupLaptop({ config, align }: { config: MockupConfig; align: 'left' | 'right' }) {
  return (
    <div
      className={`flex w-full flex-1 justify-center ${
        align === 'left' ? 'lg:order-1' : 'lg:order-2'
      }`}
    >
      <div className="relative w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-400/30">
        <div className="rounded-3xl border border-slate-200 bg-slate-900/90 shadow-inner">
          <div
            className={`rounded-t-3xl border-b border-white/10 bg-linear-to-br ${config.gradient} p-6 text-white`}
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
              <span>{config.badge}</span>
              <span>live</span>
            </div>
            <h4 className="mt-4 text-xl font-semibold">{config.title}</h4>
            <p className="text-sm text-white/70">{config.subtitle}</p>
            <div className="mt-4 flex gap-3 text-xs text-white/80">
              <span className="inline-flex rounded-full border border-white/30 px-3 py-1">QA</span>
              <span className="inline-flex rounded-full border border-white/30 px-3 py-1">Design</span>
              <span className="inline-flex rounded-full border border-white/30 px-3 py-1">Ops</span>
            </div>
          </div>

          <div className="grid gap-4 rounded-b-3xl bg-slate-950/60 p-6 text-slate-100 md:grid-cols-2">
            {config.metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-white/60">{metric.label}</p>
                <p
                  className="mt-1 text-lg font-semibold"
                  style={{ color: config.accent }}
                >
                  {metric.value}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '70%',
                      background: config.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-4 left-1/2 h-3 w-48 -translate-x-1/2 rounded-full bg-slate-500/40 blur" />
      </div>
    </div>
  )
}

const solutions: Solution[] = [
  {
    title: 'Criação de sites rápidos e focados em conversão',
    subtitle:
      'One pages dinâmicas ou sites completos com SEO, performance e integrações que transformam visitantes em leads.',
    bullets: ['Arquitetura pensada para SEO', 'Integração com formulários e automações', 'Layout responsivo e acessível'],
    tags: ['SEO', 'Performance', 'Formulários'],
    mockup: {
      badge: 'Web build',
      title: 'Landing page — Hazak Fit',
      subtitle: 'SEO 95 • UX score 9.2',
      gradient: 'from-slate-900 via-[#0b1d2a] to-[#0f5132]',
      accent: '#14CC45',
      metrics: [
        { label: 'Tempo de carga', value: '1.2s' },
        { label: 'Conversão', value: '+38%' },
        { label: 'Core Web Vitals', value: 'Green' },
        { label: 'Páginas', value: '05' },
      ],
    } satisfies MockupConfig,
    imageAlign: 'right',
  },
  {
    title: 'Marketing digital com estratégia e execução',
    subtitle: 'Campanhas, conteúdo e funis de vendas pensados para gerar oportunidades reais para o seu negócio.',
    bullets: ['Gestão de Google Ads e Social Ads', 'Planejamento de conteúdo e copywriting', 'Otimização constante com dados'],
    tags: ['Ads', 'Análise', 'Copy'],
    mockup: {
      badge: 'Paid media',
      title: 'Campanha Performance+',
      subtitle: 'Omnichannel • Always on',
      gradient: 'from-[#160d3a] via-[#2d1c66] to-[#ff4fd8]',
      accent: '#F8BF4C',
      metrics: [
        { label: 'ROAS', value: '6.2x' },
        { label: 'Custo por lead', value: 'R$ 23' },
        { label: 'Criativos ativos', value: '12' },
        { label: 'Segmentos', value: '4' },
      ],
    } satisfies MockupConfig,
    imageAlign: 'left',
  },
  {
    title: 'Data Analytics para decisões sem achismo',
    subtitle: 'Dashboards claros, metas e métricas em tempo real para guiar as próximas ações com segurança.',
    bullets: ['Construção de dashboards e relatórios', 'Integração com fontes como GA4 e CRM', 'Alertas e insights acionáveis'],
    tags: ['BI', 'GA4', 'Métricas'],
    mockup: {
      badge: 'Data studio',
      title: 'Painel CX ao vivo',
      subtitle: 'Atualização a cada 15 min',
      gradient: 'from-slate-900 via-slate-800 to-slate-900',
      accent: '#5BE5FF',
      metrics: [
        { label: 'NPS', value: '78' },
        { label: 'Churn', value: '1.4%' },
        { label: 'Ticket médio', value: 'R$ 642' },
        { label: 'Alertas', value: '03 ativos' },
      ],
    } satisfies MockupConfig,
    imageAlign: 'right',
  },
]

export default function SolutionsShowcase() {
  const { ref: headerRef, isVisible: headerVisible } = useFadeIn()
  const { ref: cardsRef, isVisible: cardsVisible } = useFadeIn({ threshold: 0.2 })
  const { ref: footerRef, isVisible: footerVisible } = useFadeIn()

  return (
    <section className="bg-[#F3EEE4] py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={headerRef} className={`fade-in mb-16 text-center ${headerVisible ? 'visible' : ''}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#14CC45]">Soluções</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Entregas completas para acelerar seu digital
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
            Escolha a frente que faz mais sentido agora ou combine todas para um crescimento contínuo.
          </p>
        </div>

        <div ref={cardsRef} className="space-y-12">
          {solutions.map((solution, index) => (
            <article
              key={solution.title}
              className={`fade-in flex flex-col gap-6 rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60 transition lg:flex-row ${
                cardsVisible ? 'visible' : ''
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <MockupLaptop
                config={solution.mockup}
                align={solution.imageAlign}
              />

              <div
                className={`flex flex-1 flex-col justify-center ${
                  solution.imageAlign === 'left' ? 'lg:order-2 lg:pl-10' : 'lg:order-1 lg:pr-10'
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  {solution.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mt-4 text-2xl font-bold text-slate-900">{solution.title}</h3>
                <p className="mt-2 text-base text-slate-600">{solution.subtitle}</p>

                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {solution.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="icon inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#14CC45]/15 text-base text-[#0E9F33]">
                        check
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button
                    as="a"
                    href="/Contato"
                    size="lg"
                    variant="primary"
                    clickId={`solutions-${index + 1}-cta`}
                    className="shadow-[#14CC45]/25"
                  >
                    Solicitar orçamento
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          ref={footerRef}
          className={`fade-in mt-16 flex flex-col items-center gap-4 text-center ${footerVisible ? 'visible' : ''}`}
        >
          <p className="text-lg font-semibold text-slate-800">Pronto para colocar essas soluções em prática?</p>
          <Button
            as="a"
            href="/Contato"
            size="lg"
            variant="primary"
            clickId="solutions-footer-cta"
            className="shadow-[#14CC45]/30"
          >
            Vamos conversar
          </Button>
          <p className="text-sm text-slate-500">Resposta em até 1 dia útil com um plano personalizado.</p>
        </div>
      </div>
    </section>
  )
}
