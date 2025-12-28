import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const cards = [
  { title: 'Hero', description: 'Título e subtítulo da página inicial', icon: 'title', path: '/admin/hero', color: 'bg-blue-500' },
  { title: 'Portfólio Home', description: 'Slider de projetos na home', icon: 'view_carousel', path: '/admin/portfolio-home', color: 'bg-purple-500' },
  { title: 'Portfólio Página', description: 'Cards da página de portfólio', icon: 'grid_view', path: '/admin/portfolio-page', color: 'bg-pink-500' },
  { title: 'Planos', description: 'Valores e recursos dos planos', icon: 'payments', path: '/admin/planos', color: 'bg-amber-500' },
]

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Gerencie o conteúdo do site</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.color} text-white`}>
              <span className="icon text-2xl">{card.icon}</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[#14CC45]">{card.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Instruções</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="icon text-[#14CC45]">check_circle</span>
            <span>As alterações são salvas automaticamente no navegador (localStorage)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="icon text-[#14CC45]">check_circle</span>
            <span>Para ver as mudanças no site, atualize a página após salvar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="icon text-[#14CC45]">check_circle</span>
            <span>As imagens devem estar na pasta /public/images/portfolio/</span>
          </li>
        </ul>
      </div>
    </AdminLayout>
  )
}
