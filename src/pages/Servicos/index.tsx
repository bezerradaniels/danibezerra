import { Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero.tsx'
import Button from '../../components/ui/Button.tsx'

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

const servicos = [
  {
    id: 'sites',
    title: 'Criação de sites rápidos e focados em conversão',
    description: 'One page, multipage e landing pages com SEO, performance e integração com formulário.',
    mockup: 'ide',
    tags: ['Performance', 'SEO', 'Responsivo', 'Formulário'],
    reverse: false,
  },
  {
    id: 'marketing',
    title: 'Marketing digital com estratégia e execução',
    description: 'Campanhas, criativos, tracking e otimização contínua para gerar demanda.',
    mockup: 'ads',
    tags: ['Ads', 'Funil', 'A/B Testing', 'Pixel/Tag'],
    reverse: true,
  },
  {
    id: 'analytics',
    title: 'Data analytics para decisões sem achismo',
    description: 'Dashboards, eventos, mensuração e insights acionáveis.',
    mockup: 'analytics',
    tags: ['GA4', 'Eventos', 'Dashboards', 'Metas'],
    reverse: false,
  },
]

function getMockup(type: string) {
  switch (type) {
    case 'ide': return <MockupIDE />
    case 'ads': return <MockupGoogleAds />
    case 'analytics': return <MockupAnalytics />
    default: return null
  }
}

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

              {/* Mockup */}
              <div className={`relative ${servico.reverse ? 'lg:order-1' : ''}`}>
                {getMockup(servico.mockup)}
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

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-2xl shadow-slate-200/70">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#14CC45]">Pronto para começar?</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">
              Envie seu briefing e receba um plano completo em até 24h úteis
            </h3>
            <p className="mt-2 text-slate-600">
              Vamos definir prioridades, escopo e cronograma juntos para acelerar seu próximo lançamento.
            </p>
            <div className="mt-6">
              <Button
                as="a"
                href="/Contato"
                size="lg"
                variant="primary"
                clickId="servicos-footer-cta"
                className="shadow-[#14CC45]/30"
              >
                Conversar sobre meu projeto
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
