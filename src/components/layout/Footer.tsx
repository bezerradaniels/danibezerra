import Container from './Container'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-white py-10 text-sm text-slate-500">
      <Container>
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dani Dev. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/Politica" className="cursor-pointer hover:text-slate-900">
              Política de privacidade
            </a>
            <a href="/Contato" className="cursor-pointer hover:text-slate-900">
              Contato
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
