import { useState } from 'react'
import { Link } from 'react-router-dom'
import { routes, type RouteConfig } from '../../app/routes.ts'
import Container from './Container'

const formatPathForId = (path: string) => {
  if (path === '/') return 'home'
  return path.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-[#FAF8F3]/95 backdrop-blur">
        <Container>
          <div className="flex items-center justify-between py-6 text-sm tracking-wide text-slate-600">
            <Link
              to="/"
              id="navbar-logo-home"
              data-click-id="navbar-logo-home"
              className="flex items-center gap-2 text-slate-900 cursor-pointer"
            >
              <span className="icon text-2xl text-[#14CC45]">terminal</span>
              <span className="font-mono text-lg font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Dani_</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-4 md:flex">
              {routes.map(({ path, name }: RouteConfig) => {
                const linkId = `navbar-link-${formatPathForId(path)}`
                return (
                  <Link
                    key={path}
                    to={path}
                    id={linkId}
                    data-click-id={linkId}
                    className="font-medium text-slate-500 transition hover:text-slate-900 cursor-pointer"
                  >
                    {name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              id="navbar-menu-toggle-open"
              data-click-id="navbar-menu-toggle-open"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Abrir menu"
            >
              <span className="icon text-2xl">{isOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden cursor-pointer"
          onClick={closeMenu}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <span className="text-base font-semibold text-slate-900">Menu</span>
          <button
            onClick={closeMenu}
            id="navbar-menu-toggle-close"
            data-click-id="navbar-menu-toggle-close"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 cursor-pointer"
            aria-label="Fechar menu"
          >
            <span className="icon text-2xl">close</span>
          </button>
        </div>

        <nav className="flex flex-col p-4">
          {routes.map(({ path, name }: RouteConfig) => {
            const linkId = `navbar-mobile-link-${formatPathForId(path)}`
            return (
              <Link
                key={path}
                to={path}
                id={linkId}
                data-click-id={linkId}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-medium text-slate-600 transition hover:bg-[#14CC45]/10 hover:text-[#14CC45] cursor-pointer"
              >
                {name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
