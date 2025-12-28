import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useSiteData } from '../context/SiteDataContext'

export default function HeroEditorPage() {
  const { hero, setHero } = useSiteData()
  const [title, setTitle] = useState(hero.title)
  const [subtitle, setSubtitle] = useState(hero.subtitle)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await setHero({ title, subtitle })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Editar Hero</h1>
        <p className="mt-1 text-slate-500">Título e subtítulo da página inicial</p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
              Título principal
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
              placeholder="Digite o título"
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="mb-2 block text-sm font-medium text-slate-700">
              Subtítulo
            </label>
            <textarea
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
              placeholder="Digite o subtítulo"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="rounded-xl bg-[#14CC45] px-6 py-3 font-semibold text-white shadow-lg shadow-[#14CC45]/20 transition hover:bg-[#12B83E]"
            >
              Salvar alterações
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-sm text-[#14CC45]">
                <span className="icon">check_circle</span>
                Salvo com sucesso!
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Preview</p>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>
      </div>
    </AdminLayout>
  )
}
