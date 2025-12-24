import { Link } from 'react-router-dom'

export default function ObrigadoPage() {
  return (
    <section className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-16">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#14CC45]/10">
          <span className="icon text-7xl text-[#14CC45]">check_circle</span>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">Obrigado pelo contato!</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          Recebemos sua solicitação e entraremos em contato em até 24 horas úteis
          pelo WhatsApp ou e-mail informado.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            id="obrigado-cta-voltar-home"
            data-click-id="obrigado-cta-voltar-home"
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#14CC45] px-6 py-3 font-semibold tracking-wide text-white shadow-lg shadow-[#14CC45]/20 transition hover:bg-[#12B83E]"
          >
            Voltar ao início
          </Link>
          <Link
            to="/Portfolio"
            id="obrigado-cta-ver-portfolio"
            data-click-id="obrigado-cta-ver-portfolio"
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold tracking-wide text-slate-800 transition hover:bg-slate-50"
          >
            Ver portfólio
          </Link>
        </div>
      </div>
    </section>
  )
}
