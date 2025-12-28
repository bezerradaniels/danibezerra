import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'

export type PortfolioItem = {
  image: string
  title: string
  category: string
  description?: string
}

export type Plan = {
  nome: string
  preco: string
  tipo: string
  parcelamento: string | null
  descricao: string
  recursos: string[]
  destaque: boolean
}

export type HeroData = {
  title: string
  subtitle: string
}

type SiteDataContextType = {
  portfolioHome: PortfolioItem[]
  setPortfolioHome: (items: PortfolioItem[]) => Promise<void>
  portfolioPage: PortfolioItem[]
  setPortfolioPage: (items: PortfolioItem[]) => Promise<void>
  plans: Plan[]
  setPlans: (plans: Plan[]) => Promise<void>
  hero: HeroData
  setHero: (hero: HeroData) => Promise<void>
  uploadImage: (file: File) => Promise<string>
  isLoading: boolean
}

const SiteDataContext = createContext<SiteDataContextType | null>(null)

const defaultPortfolioHome: PortfolioItem[] = [
  { image: '/images/portfolio/hazak-fit.png', title: 'Hazak Fit', category: 'Site institucional' },
  { image: '/images/portfolio/casa-bebe.png', title: 'Casa do Bebê', category: 'Landing Page' },
  { image: '/images/portfolio/clinica-sim.png', title: 'Clínica SIM', category: 'Site Institucional' },
  { image: '/images/portfolio/grafica-inova-print.png', title: 'Gráfica Inova Print', category: 'Site Institucional' },
  { image: '/images/portfolio/personal-juninho.png', title: 'Personal Juninho', category: 'Landing Page' },
  { image: '/images/portfolio/victor-manuel.png', title: 'Victor Manuel', category: 'Site Institucional' },
  { image: '/images/portfolio/ativa-tea.png', title: 'Ativa TEA', category: 'Site Institucional' },
]

const defaultPortfolioPage: PortfolioItem[] = [
  { image: '/images/portfolio/ativa-tea.png', title: 'Ativa TEA', category: 'Site Institucional', description: 'Portal informativo com recursos educacionais e captação de contatos de responsáveis.' },
  { image: '/images/portfolio/casa-bebe.png', title: 'Casa do Bebê', category: 'E-commerce', description: 'Experiência acolhedora com catálogo organizado e chamadas à ação claras para aumentar pedidos.' },
  { image: '/images/portfolio/clinica-sim.png', title: 'Clínica SIM', category: 'Site Institucional', description: 'Site institucional com foco em credibilidade e facilidade para agendar consultas online.' },
  { image: '/images/portfolio/grafica-inova-print.png', title: 'Gráfica Inova Print', category: 'Site Institucional', description: 'Mostruário digital com portfólio e formulário de orçamento para acelerar o atendimento comercial.' },
  { image: '/images/portfolio/hazak-fit.png', title: 'Hazak Fit', category: 'Landing Page', description: 'Landing page enxuta com formulário integrado para captar novos alunos e destacar diferenciais.' },
  { image: '/images/portfolio/personal-juninho.png', title: 'Personal Juninho', category: 'Landing Page', description: 'Landing page com storytelling e depoimentos para converter leads em planos de personal trainer.' },
  { image: '/images/portfolio/victor-manuel.png', title: 'Victor Manuel', category: 'Site Institucional', description: 'Site institucional para engenheiro civil com CTA direto no WhatsApp e destaque para serviços.' },
]

const defaultPlans: Plan[] = [
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

const defaultHero: HeroData = {
  title: 'Transforme sua presença digital em resultados reais',
  subtitle: 'Sites sob medida, branding estratégico e soluções de marketing para impulsionar o seu negócio.',
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [portfolioHome, setPortfolioHomeState] = useState<PortfolioItem[]>(defaultPortfolioHome)
  const [portfolioPage, setPortfolioPageState] = useState<PortfolioItem[]>(defaultPortfolioPage)
  const [plans, setPlansState] = useState<Plan[]>(defaultPlans)
  const [hero, setHeroState] = useState<HeroData>(defaultHero)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFromSupabase()
  }, [])

  const loadFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('id', 1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar dados:', error)
      }

      if (data) {
        if (data.portfolio_home) setPortfolioHomeState(data.portfolio_home)
        if (data.portfolio_page) setPortfolioPageState(data.portfolio_page)
        if (data.plans) setPlansState(data.plans)
        if (data.hero) setHeroState(data.hero)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do Supabase:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveToSupabase = async (data: {
    portfolio_home: PortfolioItem[]
    portfolio_page: PortfolioItem[]
    plans: Plan[]
    hero: HeroData
  }) => {
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ id: 1, ...data, updated_at: new Date().toISOString() })

      if (error) {
        console.error('Erro ao salvar dados:', error)
        throw error
      }
    } catch (err) {
      console.error('Erro ao salvar no Supabase:', err)
      throw err
    }
  }

  const setPortfolioHome = async (items: PortfolioItem[]) => {
    setPortfolioHomeState(items)
    await saveToSupabase({ portfolio_home: items, portfolio_page: portfolioPage, plans, hero })
  }

  const setPortfolioPage = async (items: PortfolioItem[]) => {
    setPortfolioPageState(items)
    await saveToSupabase({ portfolio_home: portfolioHome, portfolio_page: items, plans, hero })
  }

  const setPlans = async (newPlans: Plan[]) => {
    setPlansState(newPlans)
    await saveToSupabase({ portfolio_home: portfolioHome, portfolio_page: portfolioPage, plans: newPlans, hero })
  }

  const setHero = async (newHero: HeroData) => {
    setHeroState(newHero)
    await saveToSupabase({ portfolio_home: portfolioHome, portfolio_page: portfolioPage, plans, hero: newHero })
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `portfolio/${fileName}`

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) {
      console.error('Erro ao fazer upload:', error)
      throw error
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  return (
    <SiteDataContext.Provider
      value={{
        portfolioHome,
        setPortfolioHome,
        portfolioPage,
        setPortfolioPage,
        plans,
        setPlans,
        hero,
        setHero,
        uploadImage,
        isLoading,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider')
  }
  return context
}
