import { Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero.tsx'

const planos = [
  {
    nome: 'Onepage',
    preco: 'R$ 99',
    tipo: 'PAGAMENTO ÚNICO',
    parcelamento: 'ou 10x sem juros',
    descricao: 'Ideal para profissionais divulgarem produtos, serviços e contatos.',
    recursos: ['1 página responsiva', 'Formulário de contato', 'SEO básico', 'Hospedagem inclusa', 'Suporte por 30 dias'],
    destaque: false,
  },
  {
    nome: 'Multipages',
    preco: 'R$ 399',
    tipo: 'PAGAMENTO ÚNICO',
    parcelamento: 'ou 10x sem juros',
    descricao: 'Ideal para empresas que precisam de sites modernos, rápidos e que convertem.',
    recursos: ['Até 5 páginas', 'Design personalizado', 'SEO avançado', 'Blog integrado', 'Painel administrativo', 'Suporte por 60 dias'],
    destaque: true,
  },
  {
    nome: 'Copiloto de Marketing',
    preco: 'R$ 800',
    tipo: '/MÊS',
    parcelamento: null,
    descricao: 'Estratégias completas de sites, anúncios online e data analytics.',
    recursos: ['Gestão de campanhas', 'Relatórios mensais', 'Otimização contínua', 'Criativos inclusos', 'Reuniões semanais', 'Suporte prioritário'],
    destaque: false,
  },
]

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export default function PlanosPage() {
  return (
    <>
      <PageHero 
        title="Planos e Preços" 
        subtitle="Investimento"
        backgroundImage="/images/portfolio/victor-manuel.png"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Escolha o plano ideal para você
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Soluções flexíveis para cada etapa do seu negócio.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {planos.map((plano) => {
              const planoSlug = slugify(plano.nome)

              return (
                <div
                  key={plano.nome}
                  className={`relative rounded-3xl border p-8 transition ${
                    plano.destaque
                      ? 'border-[#14CC45] bg-white shadow-xl'
                      : 'border-slate-200 bg-white hover:shadow-lg'
                  }`}
                >
                  {plano.destaque && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#14CC45] px-4 py-1 text-xs font-semibold text-white">
                      Mais popular
                    </span>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">{plano.nome}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-[#14CC45]">{plano.preco}</span>
                      <span className="text-slate-500">{plano.tipo}</span>
                    </div>
                    {plano.parcelamento && (
                      <p className="mt-1 text-sm text-slate-400">{plano.parcelamento}</p>
                    )}
                    <p className="mt-4 text-sm text-slate-600">{plano.descricao}</p>
                  </div>

                  <ul className="mt-8 space-y-3">
                    {plano.recursos.map((recurso) => (
                      <li key={recurso} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="icon text-lg text-[#14CC45]">check_circle</span>
                        {recurso}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/Contato"
                    id={`planos-cta-${planoSlug}`}
                    data-click-id={`planos-cta-${planoSlug}`}
                    className={`mt-8 block w-full cursor-pointer rounded-full py-3 text-center font-semibold transition ${
                      plano.destaque
                        ? 'bg-[#14CC45] text-white shadow-lg shadow-[#14CC45]/20 hover:bg-[#12B83E]'
                        : 'border border-slate-200 text-slate-700 hover:border-[#14CC45] hover:text-[#14CC45]'
                    }`}
                  >
                    Solicitar orçamento
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
