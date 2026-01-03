import PageHero from '../../components/layout/PageHero.tsx'
import Button from '../../components/ui/Button.tsx'

const nichos = [
  { icon: 'business', name: 'Pequenas Empresas', description: 'Sites e marketing para negócios locais que querem crescer online.' },
  { icon: 'local_hospital', name: 'Clínicas', description: 'Presença digital para clínicas médicas, odontológicas e estéticas.' },
  { icon: 'storefront', name: 'E-commerce', description: 'Lojas virtuais otimizadas para conversão e vendas.' },
  { icon: 'restaurant', name: 'Restaurantes', description: 'Cardápios digitais, delivery e presença nas redes sociais.' },
  { icon: 'fitness_center', name: 'Academias', description: 'Sites e campanhas para atrair e reter alunos.' },
  { icon: 'school', name: 'Educação', description: 'Plataformas e marketing para escolas e cursos.' },
  { icon: 'gavel', name: 'Advogados', description: 'Sites institucionais e captação de clientes qualificados.' },
  { icon: 'architecture', name: 'Arquitetura', description: 'Portfólios e presença digital para arquitetos e designers.' },
]

export default function NichosPage() {
  return (
    <>
      <PageHero 
        title="Nichos de Atuação" 
        subtitle="Especialidades"
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Segmentos que atendemos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Experiência comprovada em diversos setores, com soluções personalizadas para cada tipo de negócio.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nichos.map((nicho) => (
              <div
                key={nicho.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:border-[#14CC45]/30 hover:shadow-lg"
              >
                <span className="icon text-4xl text-[#14CC45]">{nicho.icon}</span>
                <h3 className="mt-4 font-bold text-slate-900">{nicho.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{nicho.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-2xl shadow-slate-900/30">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#14CC45]">Foco no seu nicho</p>
            <h3 className="mt-3 text-2xl font-bold">Vamos criar algo específico para o seu segmento?</h3>
            <p className="mt-2 text-slate-200">
              Conte seu contexto e receba propostas e referências alinhadas ao seu mercado.
            </p>
            <div className="mt-6">
              <Button
                as="a"
                href="/Contato"
                size="lg"
                variant="primary"
                clickId="nichos-footer-cta"
                className="shadow-[#14CC45]/30"
              >
                Falar sobre meu nicho
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
