import Button from '../ui/Button.tsx'
import { useFadeIn } from '../../hooks/useFadeIn'
import { useSiteData } from '../../admin/context/SiteDataContext'

const floatingCards = [
  { label: 'Criação de sites', icon: 'web', delay: '0s' },
  { label: 'Data Analytics', icon: 'analytics', delay: '0.2s' },
  { label: 'Marketing Digital', icon: 'campaign', delay: '0.4s' },
]

export default function Hero() {
  const { hero } = useSiteData()
  const { ref: textRef, isVisible: textVisible } = useFadeIn()
  const { ref: mockupRef, isVisible: mockupVisible } = useFadeIn({ threshold: 0.2 })

  return (
    <section className="relative overflow-hidden py-12 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Coluna esquerda – texto + CTA */}
        <div
          ref={textRef}
          className={`fade-in-left flex flex-col items-center gap-6 text-center lg:items-start lg:text-left ${textVisible ? 'visible' : ''}`}
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {hero.title}
          </h1>
          <p className="max-w-md text-lg text-slate-600">
            {hero.subtitle}
          </p>
          <Button as="a" href="/Contato" size="lg" clickId="hero-cta-solicitar-orcamento">
            Solicitar orçamento
          </Button>
        </div>

        {/* Coluna direita – mockup com cards flutuantes */}
        <div
          ref={mockupRef}
          className={`fade-in-right relative flex items-center justify-center lg:justify-end ${mockupVisible ? 'visible' : ''}`}
        >
          {/* Laptop mockup */}
          <div className="relative">
            {/* Tela do laptop */}
            <div className="relative h-72 w-96 rounded-t-xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 sm:h-80 sm:w-130">
              {/* Barra de título da IDE */}
              <div className="flex h-7 items-center gap-2 rounded-t-xl bg-slate-100 px-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-[10px] text-slate-400">index.html — danidev</span>
              </div>

              {/* Conteúdo da IDE */}
              <div className="flex h-[calc(100%-1.75rem)] overflow-hidden">
                {/* Sidebar */}
                <div className="flex w-10 flex-col items-center gap-3 border-r border-slate-100 bg-slate-50 py-3">
                  <span className="icon text-sm text-slate-400">folder</span>
                  <span className="icon text-sm text-slate-400">search</span>
                  <span className="icon text-sm text-[#14CC45]">code</span>
                  <span className="icon text-sm text-slate-400">terminal</span>
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-hidden bg-slate-900 p-3 font-mono text-[9px] leading-relaxed sm:text-[11px]">
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">1</span>
                    <span><span className="text-slate-500">{'<!DOCTYPE html>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">2</span>
                    <span><span className="text-pink-400">{'<html'}</span> <span className="text-purple-400">lang</span><span className="text-slate-400">=</span><span className="text-amber-300">"pt-BR"</span><span className="text-pink-400">{'>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">3</span>
                    <span><span className="text-pink-400">{'<head>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">4</span>
                    <span className="pl-4"><span className="text-pink-400">{'<meta'}</span> <span className="text-purple-400">charset</span><span className="text-slate-400">=</span><span className="text-amber-300">"UTF-8"</span> <span className="text-pink-400">{'/>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">5</span>
                    <span className="pl-4"><span className="text-pink-400">{'<meta'}</span> <span className="text-purple-400">name</span><span className="text-slate-400">=</span><span className="text-amber-300">"viewport"</span> <span className="text-purple-400">content</span><span className="text-slate-400">=</span><span className="text-amber-300">"..."</span> <span className="text-pink-400">{'/>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">6</span>
                    <span className="pl-4"><span className="text-pink-400">{'<title>'}</span><span className="text-slate-200">Seu Site Personalizado</span><span className="text-pink-400">{'</title>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">7</span>
                    <span><span className="text-pink-400">{'</head>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">8</span>
                    <span><span className="text-pink-400">{'<body>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">9</span>
                    <span className="pl-4"><span className="text-pink-400">{'<h1>'}</span><span className="text-slate-200">Olá, mundo!</span><span className="text-pink-400">{'</h1>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">10</span>
                    <span><span className="text-pink-400">{'</body>'}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="select-none text-slate-600">11</span>
                    <span><span className="text-pink-400">{'</html>'}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Base do laptop */}
            <div className="mx-auto h-3 w-[90%] rounded-b-xl bg-slate-300 shadow-lg" />
            <div className="mx-auto h-1 w-16 rounded-b bg-slate-400" />
          </div>

          {/* Cards flutuantes */}
          {floatingCards.map((card, idx) => (
            <div
              key={card.label}
              style={{ animationDelay: card.delay }}
              className={`
                absolute flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/50
                animate-float
                ${idx === 0 ? '-left-6 top-8 sm:-left-10' : ''}
                ${idx === 1 ? '-right-4 top-1/2 -translate-y-1/2 sm:-right-8' : ''}
                ${idx === 2 ? '-left-2 bottom-6 sm:-left-6' : ''}
              `}
            >
              <span className="icon text-[#14CC45]">{card.icon}</span>
              <span className="whitespace-nowrap text-sm font-medium text-slate-800">
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
