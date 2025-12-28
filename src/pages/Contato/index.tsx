import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.ts'
import { useSiteData } from '../../admin/context/SiteDataContext'

export default function ContatoPage() {
  const { plans } = useSiteData()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    empresa: '',
    projeto: '',
    mensagem: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from('contatos')
        .insert([formData])

      if (supabaseError) {
        throw supabaseError
      }

      navigate('/Obrigado')
    } catch (err) {
      console.error('Erro ao enviar formulário:', err)
      setError('Ocorreu um erro ao enviar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-6rem)] items-center py-12 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Coluna esquerda - Info e Planos */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#14CC45]">
            Orçamento
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Vamos dar o próximo passo.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Preencha o formulário ao lado e receba uma proposta personalizada em até 24h.
          </p>

          <div className="mt-10">
            <h3 className="mb-4 font-semibold text-slate-700">Planos:</h3>
            <div className="space-y-4">
              {plans.map((plano) => (
                <div
                  key={plano.nome}
                  className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="max-w-50">
                    <h4 className="font-bold text-slate-900">{plano.nome}</h4>
                    <p className="mt-1 text-sm text-slate-500">{plano.descricao}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#14CC45]">{plano.preco}</span>
                    <p className="text-xs text-slate-400">{plano.tipo}</p>
                    {plano.parcelamento && (
                      <p className="text-[10px] text-slate-400">{plano.parcelamento}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita - Formulário */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#FAF8F3] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#FAF8F3] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-slate-700">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#FAF8F3] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label htmlFor="empresa" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Empresa
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#FAF8F3] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Nome da sua empresa"
                />
              </div>
            </div>

            <div>
              <label htmlFor="projeto" className="mb-1.5 block text-sm font-medium text-slate-700">
                Tipo de projeto
              </label>
              <select
                id="projeto"
                name="projeto"
                required
                value={formData.projeto}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#FAF8F3] px-4 py-3 text-slate-800 focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
              >
                <option value="">Selecione o tipo de projeto</option>
                <option value="onepage">Site One Page</option>
                <option value="multipage">Site Multi Page</option>
                <option value="copiloto">Copiloto de Marketing</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-slate-700">
                Mensagem (opcional)
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                value={formData.mensagem}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-slate-200 bg-[#FAF8F3] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                placeholder="Conte rapidamente o que você precisa..."
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              id="contato-form-submit"
              data-click-id="contato-form-submit"
              className="w-full rounded-full bg-[#14CC45] px-6 py-3.5 font-semibold tracking-wide text-white shadow-lg shadow-[#14CC45]/20 transition hover:bg-[#12B83E] focus:outline-none focus:ring-2 focus:ring-[#14CC45] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Enviando...' : 'Enviar orçamento'}
            </button>

            <p className="text-center text-sm text-slate-400">
              Garantia de resposta em até 24 horas úteis.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
