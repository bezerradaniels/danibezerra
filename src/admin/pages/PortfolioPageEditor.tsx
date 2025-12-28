import { useState, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useSiteData, type PortfolioItem } from '../context/SiteDataContext'

export default function PortfolioPageEditorPage() {
  const { portfolioPage, setPortfolioPage, uploadImage } = useSiteData()
  const [items, setItems] = useState<PortfolioItem[]>(portfolioPage)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleItemChange = (index: number, field: keyof PortfolioItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleAddItem = () => {
    setItems([...items, { image: '', title: '', category: '', description: '' }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    await setPortfolioPage(items)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index)
    try {
      const url = await uploadImage(file)
      handleItemChange(index, 'image', url)
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(null)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portfólio Página</h1>
          <p className="mt-1 text-slate-500">Cards da página de portfólio</p>
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span className="icon">add</span>
          Adicionar projeto
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">Projeto {index + 1}</span>
              <button
                onClick={() => handleRemoveItem(index)}
                className="flex items-center gap-1 text-sm text-red-500 transition hover:text-red-600"
              >
                <span className="icon text-lg">delete</span>
                Remover
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Imagem
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.image}
                    onChange={(e) => handleItemChange(index, 'image', e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                    placeholder="URL ou caminho da imagem"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileInputRefs.current[index] = el }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(index, file)
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={uploading === index}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <span className="icon text-lg">{uploading === index ? 'hourglass_empty' : 'upload'}</span>
                    {uploading === index ? 'Enviando...' : 'Upload'}
                  </button>
                </div>
                {item.image && (
                  <img src={item.image} alt="Preview" className="mt-2 h-20 w-32 rounded-lg object-cover" />
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Título
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Nome do projeto"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Categoria
                </label>
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Site Institucional"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Descrição
                </label>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Breve descrição do projeto"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
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
    </AdminLayout>
  )
}
