/**
 * ==========================================================================
 * COMPONENTE: Rodapé com Bootstrap
 * ==========================================================================
 * Pequeno rodapé que demonstra o uso do framework CSS Bootstrap
 * (classes "container", "d-flex", "badge", "bg-dark", etc.), lado a
 * lado com o restante da aplicação que usa Tailwind CSS + shadcn/ui.
 */

export function RodapeBootstrap() {
  return (
    <footer className="bg-dark text-white text-center py-2">
      <div className="container d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
        <small className="mb-0">
          Sistema de Gestão Financeira Pessoal &copy; 2026
        </small>
        <span className="badge bg-success">Bootstrap</span>
        <span className="badge bg-secondary">Tailwind CSS</span>
        <span className="badge bg-info text-dark">Next.js</span>
      </div>
    </footer>);

}