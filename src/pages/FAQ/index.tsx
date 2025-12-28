import { useState } from 'react'
import PageHero from '../../components/layout/PageHero.tsx'
import Button from '../../components/ui/Button.tsx'

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const faqs = [
  {
    pergunta: 'Quanto tempo leva para criar um site?',
    resposta: 'O prazo varia de acordo com o projeto. Sites one page ficam prontos em até 7 dias. Sites multipages levam de 15 a 30 dias, dependendo da complexidade.',
  },
  {
    pergunta: 'O site é responsivo?',
    resposta: 'Sim! Todos os sites são desenvolvidos com design responsivo, funcionando perfeitamente em celulares, tablets e desktops.',
  },
  {
    pergunta: 'Vocês fazem hospedagem?',
    resposta: 'Sim, oferecemos hospedagem inclusa em todos os planos. Você não precisa se preocupar com configurações técnicas.',
  },
  {
    pergunta: 'Como funciona o pagamento?',
    resposta: 'Aceitamos PIX, cartão de crédito (em até 10x sem juros) e boleto bancário. O pagamento é dividido em 50% na aprovação e 50% na entrega.',
  },
  {
    pergunta: 'Posso fazer alterações depois?',
    resposta: 'Sim! Oferecemos suporte para pequenas alterações por 30 a 60 dias após a entrega, dependendo do plano. Alterações maiores são orçadas separadamente.',
  },
  {
    pergunta: 'Vocês criam conteúdo para o site?',
    resposta: 'Podemos ajudar com a estrutura e sugestões de conteúdo, mas textos e imagens específicas do seu negócio devem ser fornecidos por você.',
  },
  {
    pergunta: 'O que é o Copiloto de Marketing?',
    resposta: 'É um serviço mensal onde gerenciamos suas campanhas de anúncios, criamos relatórios e otimizamos continuamente para gerar mais resultados.',
  },
  {
    pergunta: 'Como faço para começar?',
    resposta: 'Basta preencher o formulário de contato ou nos chamar no WhatsApp. Faremos uma reunião para entender suas necessidades e enviar uma proposta personalizada.',
  },
]

function FAQItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const slug = slugify(pergunta)

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        id={`faq-toggle-${slug}`}
        data-click-id={`faq-toggle-${slug}`}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-slate-900">{pergunta}</span>
        <span className={`icon text-2xl text-[#14CC45] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-slate-600">{resposta}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <>
      <PageHero 
        title="Perguntas Frequentes" 
        subtitle="FAQ"
        backgroundImage="/images/portfolio/ativa-tea.png"
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tire suas dúvidas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Respostas para as perguntas mais comuns sobre nossos serviços.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            {faqs.map((faq) => (
              <FAQItem key={faq.pergunta} pergunta={faq.pergunta} resposta={faq.resposta} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl bg-slate-900 px-8 py-10 text-center text-white shadow-2xl shadow-slate-900/30">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#14CC45]">Precisa de ajuda?</p>
            <h3 className="mt-3 text-2xl font-bold">Vamos responder suas próximas perguntas pessoalmente</h3>
            <p className="mt-2 text-slate-200">
              Envie seu projeto e receba um plano sob medida em até 1 dia útil.
            </p>
            <div className="mt-6">
              <Button
                as="a"
                href="/Contato"
                size="lg"
                variant="primary"
                clickId="faq-footer-cta"
                className="shadow-[#14CC45]/30"
              >
                Falar com a Dani
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
