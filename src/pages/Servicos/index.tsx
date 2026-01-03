import PageHero from '../../components/layout/PageHero.tsx'
import Button from '../../components/ui/Button.tsx'

const servicos = [
  { title: 'Criação de sites', icon: 'language', description: 'Sites completos, responsivos e otimizados para conversão.' },
  { title: 'Criação de landing pages', icon: 'web', description: 'Páginas focadas em capturar leads e gerar vendas.' },
  { title: 'Criação de blogs', icon: 'article', description: 'Blogs profissionais para atrair tráfego orgânico.' },
  { title: 'Gestão Google Ads', icon: 'ads_click', description: 'Campanhas otimizadas para maximizar seu ROI.' },
  { title: 'Gestão Meta Ads', icon: 'campaign', description: 'Anúncios no Facebook e Instagram que convertem.' },
  { title: 'SEO', icon: 'search', description: 'Otimização para aparecer no topo do Google.' },
  { title: 'Criação de conteúdo para blog', icon: 'edit_note', description: 'Artigos estratégicos que atraem e engajam.' },
  { title: 'Criação de conteúdo social media', icon: 'share', description: 'Posts que conectam sua marca ao público.' },
  { title: 'Google Analytics e Tag Manager', icon: 'analytics', description: 'Métricas e rastreamento para decisões inteligentes.' },
]

export default function ServicosPage() {
  return (
    <>
      <PageHero 
        title="Serviços" 
        subtitle="O que fazemos"
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {servicos.map((servico) => (
              <div
                key={servico.title}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:border-[#14CC45]/30 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14CC45]/10">
                  <span className="icon text-3xl text-[#14CC45]">{servico.icon}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{servico.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{servico.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center">
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
