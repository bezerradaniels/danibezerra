import { useState } from 'react'
import { useFadeIn } from '../../hooks/useFadeIn'

const portfolioItems = [
  { image: '/images/portfolio/hazak-fit.png', title: 'Hazak Fit', category: 'Site institucional' },
  { image: '/images/portfolio/casa-bebe.png', title: 'Casa do Bebê', category: 'Landing Page' },
  { image: '/images/portfolio/clinica-sim.png', title: 'Clínica SIM', category: 'Site Institucional' },
  { image: '/images/portfolio/grafica-inova-print.png', title: 'Gráfica Inova Print', category: 'Site Institucional' },
  { image: '/images/portfolio/personal-juninho.png', title: 'Personal Juninho', category: 'Landing Page' },
  { image: '/images/portfolio/victor-manuel.png', title: 'Victor Manuel', category: 'Site Institucional' },
  { image: '/images/portfolio/ativa-tea.png', title: 'Ativa TEA', category: 'Site Institucional' },
]

export default function Portfolio() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { ref: headerRef, isVisible: headerVisible } = useFadeIn()
  const { ref: sliderRef, isVisible: sliderVisible } = useFadeIn({ threshold: 0.1 })
  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? portfolioItems.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === portfolioItems.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const closeSpotlight = () => setSpotlightIndex(null)
  const currentSpotlightItem = spotlightIndex !== null ? portfolioItems[spotlightIndex] : null

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div
          ref={headerRef}
          className={`fade-in mb-12 text-center ${headerVisible ? 'visible' : ''}`}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-[#14CC45]">
            Portfólio
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Projetos em destaque
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Conheça alguns dos projetos que desenvolvi para clientes de diversos segmentos.
          </p>
        </div>

        {/* Slider Container */}
        <div
          ref={sliderRef}
          className={`fade-in-scale relative ${sliderVisible ? 'visible' : ''}`}
        >
          {/* Setas de navegação */}
          <button
            onClick={goToPrevious}
            id="portfolio-slider-previous"
            data-click-id="portfolio-slider-previous"
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-slate-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#14CC45] lg:-translate-x-6 cursor-pointer"
            aria-label="Slide anterior"
          >
            <svg
              className="h-6 w-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            id="portfolio-slider-next"
            data-click-id="portfolio-slider-next"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-white p-3 shadow-lg transition hover:bg-slate-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#14CC45] lg:translate-x-6 cursor-pointer"
            aria-label="Próximo slide"
          >
            <svg
              className="h-6 w-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Slide */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="w-full shrink-0"
                >
                  <div className="relative flex cursor-pointer flex-col items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-auto max-h-125 w-auto max-w-full cursor-zoom-in rounded-2xl object-contain transition hover:opacity-90"
                      onClick={() => setSpotlightIndex(index)}
                    />
                    {/* Info abaixo da imagem */}
                    <div className="mt-6 text-center">
                      <span className="inline-block rounded-full bg-[#14CC45] px-3 py-1 text-xs font-semibold text-white">
                        {item.category}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {portfolioItems.map((_, index) => (
              <button
                key={index}
                id={`portfolio-slider-dot-${index + 1}`}
                data-click-id={`portfolio-slider-dot-${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#14CC45] focus:ring-offset-2 cursor-pointer ${
                  index === currentIndex
                    ? 'w-8 bg-[#14CC45]'
                    : 'w-3 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Spotlight Modal */}
      {currentSpotlightItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada de ${currentSpotlightItem.title}`}
          onClick={closeSpotlight}
        >
          <button
            className="absolute right-6 top-6 rounded-full bg-white/90 p-2 text-slate-700 shadow-lg transition hover:bg-white"
            onClick={(event) => {
              event.stopPropagation()
              closeSpotlight()
            }}
            aria-label="Fechar visualização"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={currentSpotlightItem.image}
              alt={currentSpotlightItem.title}
              className="max-h-[80vh] w-full rounded-3xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-sm uppercase tracking-wide text-white/70">{currentSpotlightItem.category}</p>
              <h3 className="text-2xl font-semibold">{currentSpotlightItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
