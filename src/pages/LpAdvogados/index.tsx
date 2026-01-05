import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.ts'

export default function LpAdvogadosPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    empresa: '',
    projeto: 'site-advogado',
    mensagem: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from('contatos')
        .insert([formData])

      if (supabaseError) throw supabaseError
      navigate('/Obrigado')
    } catch (err: unknown) {
      console.error('Erro ao enviar formulário:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(`Erro: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const beneficios = [
    { icon: 'gavel', title: 'Credibilidade Profissional', description: 'Transmita confiança e autoridade com um site que reflete a seriedade do seu escritório.' },
    { icon: 'person_search', title: 'Captação de Clientes', description: 'Seja encontrado por quem precisa dos seus serviços jurídicos na sua região.' },
    { icon: 'verified', title: 'Conformidade com OAB', description: 'Sites desenvolvidos seguindo as diretrizes de publicidade da Ordem dos Advogados.' },
    { icon: 'schedule', title: 'Disponível 24h', description: 'Seu escritório acessível a qualquer momento, mesmo fora do horário comercial.' },
    { icon: 'smartphone', title: 'Mobile First', description: 'Design responsivo que funciona perfeitamente em celulares e tablets.' },
    { icon: 'speed', title: 'Carregamento Rápido', description: 'Performance otimizada para não perder visitantes por lentidão.' },
  ]

  const diferenciais = [
    'Design exclusivo e personalizado',
    'Formulário de contato integrado',
    'Otimização para Google (SEO)',
    'Integração com WhatsApp',
    'Área de especialidades',
    'Seção de artigos/blog',
    'Certificado SSL incluso',
    'Suporte técnico dedicado',
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-amber-900/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Texto */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
                <span className="icon text-amber-400">workspace_premium</span>
                <span className="text-sm font-medium text-amber-300">Especializado para Advogados</span>
              </div>
              
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Seu escritório merece uma{' '}
                <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  presença digital
                </span>{' '}
                à altura
              </h1>
              
              <p className="mt-6 text-lg leading-relaxed text-slate-300">
                Sites profissionais para advogados e escritórios de advocacia. 
                Transmita credibilidade, conquiste novos clientes e fortaleça sua marca no meio jurídico.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="icon text-amber-500">check_circle</span>
                  <span>Conforme OAB</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="icon text-amber-500">check_circle</span>
                  <span>SEO otimizado</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="icon text-amber-500">check_circle</span>
                  <span>Suporte incluso</span>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Solicite seu orçamento</h2>
                <p className="mt-2 text-slate-400">Resposta em até 24 horas úteis</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Seu melhor e-mail"
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="WhatsApp (00) 00000-0000"
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="empresa"
                    required
                    value={formData.empresa}
                    onChange={handleChange}
                    placeholder="Nome do escritório"
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <textarea
                    name="mensagem"
                    rows={3}
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre seu escritório (opcional)"
                    className="w-full resize-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-red-500/20 p-3 text-center text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-6 py-4 font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Enviando...' : 'Quero meu site profissional'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-px left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
      </section>

      {/* Benefícios */}
      <section className="bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Benefícios</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Por que ter um site profissional?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Um site bem construído é o cartão de visitas digital do seu escritório
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition hover:border-amber-500/30 hover:bg-slate-800"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition group-hover:bg-amber-500/20">
                  <span className="icon text-2xl">{item.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluso */}
      <section className="bg-slate-800/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Completo</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Tudo que seu site precisa
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Desenvolvemos sites completos com todas as funcionalidades essenciais para advogados e escritórios de advocacia.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {diferenciais.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="icon text-amber-500">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-2xl">
                <div className="rounded-xl border border-slate-600 bg-slate-900">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/60" />
                      <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                      <span className="h-3 w-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="ml-4 flex-1 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-slate-500">
                      seuescritorio.adv.br
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20" />
                      <div>
                        <div className="h-3 w-32 rounded bg-slate-700" />
                        <div className="mt-1.5 h-2 w-20 rounded bg-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-3/4 rounded bg-slate-700" />
                      <div className="h-3 w-full rounded bg-slate-800" />
                      <div className="h-3 w-5/6 rounded bg-slate-800" />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="h-16 rounded-lg bg-amber-500/10 border border-amber-500/20" />
                      <div className="h-16 rounded-lg bg-amber-500/10 border border-amber-500/20" />
                      <div className="h-16 rounded-lg bg-amber-500/10 border border-amber-500/20" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -right-4 -top-4 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg">
                Responsivo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-linear-to-b from-slate-900 to-slate-800 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
            <span className="icon text-amber-400">rocket_launch</span>
            <span className="text-sm font-medium text-amber-300">Comece agora</span>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pronto para destacar seu escritório?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Solicite seu orçamento sem compromisso e receba uma proposta personalizada em até 24 horas.
          </p>

          <div className="mt-8">
            <a
              href="#topo"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500"
            >
              <span className="icon">arrow_upward</span>
              Solicitar orçamento gratuito
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Sem compromisso • Resposta em até 24h • Pagamento facilitado
          </p>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Dani Bezerra • Desenvolvimento Web & Marketing Digital
          </p>
        </div>
      </footer>
    </div>
  )
}
