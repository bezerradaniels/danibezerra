import Button from '../ui/Button.tsx'
import { useFadeIn } from '../../hooks/useFadeIn'

const niches = [
  { name: 'Pequenas Empresas', icon: 'storefront' },
  { name: 'Clínicas', icon: 'local_hospital' },
  { name: 'Advogados', icon: 'gavel' },
  { name: 'Nutricionistas', icon: 'nutrition' },
  { name: 'Dentistas', icon: 'dentistry' },
  { name: 'Contadores', icon: 'calculate' },
  { name: 'Personal Trainers', icon: 'fitness_center' },
  { name: 'Veterinários', icon: 'pets' },
]

export default function Niches() {
  const { ref: headerRef, isVisible: headerVisible } = useFadeIn()
  const { ref: gridRef, isVisible: gridVisible } = useFadeIn({ threshold: 0.1 })

  return (
    <section className="border-y border-slate-200/50 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div
          ref={headerRef}
          className={`fade-in mb-12 text-center ${headerVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Nichos que Atendemos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Soluções personalizadas para profissionais e empresas de diversos segmentos
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        >
          {niches.map((niche, index) => (
            <div
              key={niche.name}
              className={`fade-in-scale group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-[#FAF8F3] p-6 text-center transition hover:border-[#14CC45]/30 hover:shadow-lg ${gridVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:bg-[#14CC45]/10">
                <span className="icon text-4xl text-slate-400 transition group-hover:text-[#14CC45]">
                  {niche.icon}
                </span>
              </div>
              <span className="font-semibold text-slate-700">{niche.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button as="a" href="/Contato" size="lg" clickId="home-niches-cta">
            Solicitar orçamento
          </Button>
        </div>
      </div>
    </section>
  )
}
