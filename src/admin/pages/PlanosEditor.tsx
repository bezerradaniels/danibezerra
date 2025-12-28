import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useSiteData, type Plan } from '../context/SiteDataContext'

export default function PlanosEditorPage() {
  const { plans, setPlans } = useSiteData()
  const [items, setItems] = useState<Plan[]>(plans)
  const [saved, setSaved] = useState(false)

  const handleItemChange = (index: number, field: keyof Plan, value: string | boolean | string[] | null) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleRecursosChange = (index: number, value: string) => {
    const recursos = value.split('\n').filter((r) => r.trim())
    handleItemChange(index, 'recursos', recursos)
  }

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        nome: '',
        preco: '',
        tipo: 'PAGAMENTO ÚNICO',
        parcelamento: null,
        descricao: '',
        recursos: [],
        destaque: false,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    await setPlans(items)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planos</h1>
          <p className="mt-1 text-slate-500">Valores e recursos dos planos</p>
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span className="icon">add</span>
          Adicionar plano
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border bg-white p-6 ${
              item.destaque ? 'border-[#14CC45] shadow-lg' : 'border-slate-200'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-400">Plano {index + 1}</span>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.destaque}
                    onChange={(e) => handleItemChange(index, 'destaque', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#14CC45] focus:ring-[#14CC45]"
                  />
                  <span className="text-sm text-slate-600">Destaque</span>
                </label>
              </div>
              <button
                onClick={() => handleRemoveItem(index)}
                className="flex items-center gap-1 text-sm text-red-500 transition hover:text-red-600"
              >
                <span className="icon text-lg">delete</span>
                Remover
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
                <input
                  type="text"
                  value={item.nome}
                  onChange={(e) => handleItemChange(index, 'nome', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Nome do plano"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Preço</label>
                <input
                  type="text"
                  value={item.preco}
                  onChange={(e) => handleItemChange(index, 'preco', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="R$ 99"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
                <select
                  value={item.tipo}
                  onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                >
                  <option value="PAGAMENTO ÚNICO">PAGAMENTO ÚNICO</option>
                  <option value="/MÊS">/MÊS</option>
                  <option value="/ANO">/ANO</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Parcelamento</label>
                <input
                  type="text"
                  value={item.parcelamento || ''}
                  onChange={(e) => handleItemChange(index, 'parcelamento', e.target.value || null)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="ou 10x sem juros"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
                <input
                  type="text"
                  value={item.descricao}
                  onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Descrição do plano"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Recursos (um por linha)
                </label>
                <textarea
                  value={item.recursos.join('\n')}
                  onChange={(e) => handleRecursosChange(index, e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
                  placeholder="Recurso 1&#10;Recurso 2&#10;Recurso 3"
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
