export type RouteConfig = {
  path: string
  name: string
  description: string
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    description: 'Hero, diferenciais e acesso rápido aos principais serviços.',
  },
  {
    path: '/Servicos',
    name: 'Serviços',
    description: 'Detalhes sobre desenvolvimento web, branding e consultoria.',
  },
  {
    path: '/Nichos',
    name: 'Nichos',
    description: 'Estratégias pensadas para mercados específicos e comunidades.',
  },
  {
    path: '/Portfolio',
    name: 'Portfólio',
    description: 'Projetos recentes com foco em performance e identidade.',
  },
  {
    path: '/FAQ',
    name: 'FAQ',
    description: 'Principais dúvidas respondidas com transparência.',
  },
  {
    path: '/Contato',
    name: 'Contato',
    description: 'Converse sobre o seu projeto e receba um diagnóstico.',
  },
]
