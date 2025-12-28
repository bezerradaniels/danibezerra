import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (login(username, password)) {
      navigate('/admin')
    } else {
      setError('Usuário ou senha inválidos')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14CC45]/10">
            <span className="icon text-4xl text-[#14CC45]">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Painel Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Faça login para gerenciar o site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 transition focus:border-[#14CC45] focus:outline-none focus:ring-2 focus:ring-[#14CC45]/20"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#14CC45] py-3 font-semibold text-white shadow-lg shadow-[#14CC45]/20 transition hover:bg-[#12B83E]"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Acesso restrito a administradores
        </p>
      </div>
    </div>
  )
}
