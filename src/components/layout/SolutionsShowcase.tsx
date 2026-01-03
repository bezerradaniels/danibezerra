import Button from '../ui/Button.tsx'
import { useFadeIn } from '../../hooks/useFadeIn'

type Solution = {
  title: string
  subtitle: string
  bullets: string[]
  tags: string[]
  mockupType: 'ide' | 'ads' | 'analytics'
  imageAlign: 'left' | 'right'
}

function MockupIDE() {
  return (
    <div className="relative">
      <div className="relative h-64 w-full rounded-t-xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 sm:h-72">
        <div className="flex h-7 items-center gap-2 rounded-t-xl bg-slate-100 px-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-[10px] text-slate-400">index.html — projeto</span>
        </div>
        <div className="flex h-[calc(100%-1.75rem)] overflow-hidden">
          <div className="flex w-10 flex-col items-center gap-3 border-r border-slate-100 bg-slate-50 py-3">
            <span className="icon text-sm text-slate-400">folder</span>
            <span className="icon text-sm text-[#14CC45]">code</span>
            <span className="icon text-sm text-slate-400">terminal</span>
          </div>
          <div className="flex-1 overflow-hidden bg-slate-900 p-3 font-mono text-[9px] leading-relaxed sm:text-[11px]">
            <div className="flex gap-3"><span className="select-none text-slate-600">1</span><span className="text-slate-500">{'<!DOCTYPE html>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">2</span><span className="text-pink-400">{'<html'}</span> <span className="text-purple-400">lang</span><span className="text-slate-400">=</span><span className="text-amber-300">"pt-BR"</span><span className="text-pink-400">{'>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">3</span><span className="text-pink-400">{'<head>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">4</span><span className="pl-4 text-pink-400">{'<title>'}</span><span className="text-slate-200">Meu Site</span><span className="text-pink-400">{'</title>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">5</span><span className="text-pink-400">{'</head>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">6</span><span className="text-pink-400">{'<body>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">7</span><span className="pl-4 text-pink-400">{'<h1>'}</span><span className="text-slate-200">Bem-vindo!</span><span className="text-pink-400">{'</h1>'}</span></div>
            <div className="flex gap-3"><span className="select-none text-slate-600">8</span><span className="text-pink-400">{'</body>'}</span></div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-[90%] rounded-b-xl bg-slate-300 shadow-lg" />
      <div className="mx-auto h-1 w-16 rounded-b bg-slate-400" />
    </div>
  )
}

function MockupGoogleAds() {
  return (
    <div className="relative">
      <div className="relative h-64 w-full rounded-t-xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 sm:h-72">
        <div className="flex h-7 items-center gap-2 rounded-t-xl bg-slate-100 px-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-[10px] text-slate-400">Google Ads — Campanhas</span>
        </div>
        <div className="h-[calc(100%-1.75rem)] overflow-hidden bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg font-bold text-[#4285F4]">G</span>
            <span className="text-xs font-semibold text-slate-700">Google Ads</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-blue-50 p-2">
              <p className="text-[10px] text-slate-500">Cliques</p>
              <p className="text-sm font-bold text-[#4285F4]">12.4k</p>
            </div>
            <div className="rounded-lg bg-green-50 p-2">
              <p className="text-[10px] text-slate-500">Conversões</p>
              <p className="text-sm font-bold text-[#14CC45]">847</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2">
              <p className="text-[10px] text-slate-500">ROAS</p>
              <p className="text-sm font-bold text-amber-600">4.2x</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded bg-slate-50 px-2 py-1.5 text-[10px]">
              <span className="text-slate-600">Campanha A</span>
              <span className="font-semibold text-[#14CC45]">+32%</span>
            </div>
            <div className="flex items-center justify-between rounded bg-slate-50 px-2 py-1.5 text-[10px]">
              <span className="text-slate-600">Campanha B</span>
              <span className="font-semibold text-[#14CC45]">+18%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-[90%] rounded-b-xl bg-slate-300 shadow-lg" />
      <div className="mx-auto h-1 w-16 rounded-b bg-slate-400" />
    </div>
  )
}

function MockupAnalytics() {
  return (
    <div className="relative">
      <div className="relative h-64 w-full rounded-t-xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 sm:h-72">
        <div className="flex h-7 items-center gap-2 rounded-t-xl bg-slate-100 px-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-[10px] text-slate-400">Google Analytics — Dashboard</span>
        </div>
        <div className="h-[calc(100%-1.75rem)] overflow-hidden bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg font-bold text-[#F9AB00]">📊</span>
            <span className="text-xs font-semibold text-slate-700">Analytics</span>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-orange-50 p-2 text-center">
              <p className="text-[10px] text-slate-500">Usuários</p>
              <p className="text-sm font-bold text-[#F9AB00]">24.8k</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-center">
              <p className="text-[10px] text-slate-500">Sessões</p>
              <p className="text-sm font-bold text-[#4285F4]">38.2k</p>
            </div>
          </div>
          <div className="flex h-16 items-end gap-1">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#14CC45]/70" style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="mt-1 text-center text-[9px] text-slate-400">Últimos 10 dias</p>
        </div>
      </div>
      <div className="mx-auto h-3 w-[90%] rounded-b-xl bg-slate-300 shadow-lg" />
      <div className="mx-auto h-1 w-16 rounded-b bg-slate-400" />
    </div>
  )
}

function getMockup(type: string) {
  switch (type) {
    case 'ide': return <MockupIDE />
    case 'ads': return <MockupGoogleAds />
    case 'analytics': return <MockupAnalytics />
    default: return null
  }
}

function MockupLaptop({ mockupType, align }: { mockupType: string; align: 'left' | 'right' }) {
  return (
    <div
      className={`flex w-full flex-1 justify-center ${
        align === 'left' ? 'lg:order-1' : 'lg:order-2'
      }`}
    >
      <div className="w-full max-w-xl">
        {getMockup(mockupType)}
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
    mockupType: 'ide',
    imageAlign: 'right',
  },
  {
    title: 'Marketing digital com estratégia e execução',
    subtitle: 'Campanhas, conteúdo e funis de vendas pensados para gerar oportunidades reais para o seu negócio.',
    bullets: ['Gestão de Google Ads e Social Ads', 'Planejamento de conteúdo e copywriting', 'Otimização constante com dados'],
    tags: ['Ads', 'Análise', 'Copy'],
    mockupType: 'ads',
    imageAlign: 'left',
  },
  {
    title: 'Data Analytics para decisões sem achismo',
    subtitle: 'Dashboards claros, metas e métricas em tempo real para guiar as próximas ações com segurança.',
    bullets: ['Construção de dashboards e relatórios', 'Integração com fontes como GA4 e CRM', 'Alertas e insights acionáveis'],
    tags: ['BI', 'GA4', 'Métricas'],
    mockupType: 'analytics',
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
                mockupType={solution.mockupType}
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
