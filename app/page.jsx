/**
 * ==========================================================================
 * PÁGINA PRINCIPAL - SISTEMA DE GESTÃO FINANCEIRA PESSOAL
 * ==========================================================================
 * Este é o ponto de entrada da aplicação React/Next.js.
 * Gerencia a autenticação e navegação entre as diferentes telas.
 * 
 * Funcionalidades:
 * - Login simulado com validação
 * - Navegação entre 8 telas diferentes
 * - Estado global via Context API
 * - Interface responsiva com Tailwind CSS
 * - Componentes do shadcn/ui
 */

'use client';

import { useState } from 'react';
import { FinanceiroProvider, useFinanceiro } from '@/lib/financeiro-context';
import { TelaLogin } from '@/components/tela-login';
import { LayoutPrincipal } from '@/components/layout-principal';
import { TelaInicio } from '@/components/tela-inicio';
import { TelaDashboard } from '@/components/tela-dashboard';
import { TelaTransacoes } from '@/components/tela-transacoes';
import { TelaContas } from '@/components/tela-contas';
import { TelaOrcamentos } from '@/components/tela-orcamentos';
import { TelaFontesReceita } from '@/components/tela-fontes-receita';
import { TelaDividas } from '@/components/tela-dividas';
import { TelaCategorias } from '@/components/tela-categorias';

// ============================================================================
// COMPONENTE: Conteúdo Principal
// ============================================================================
// Gerencia qual tela deve ser exibida baseado no estado de navegação.
function ConteudoPrincipal() {
  // Estado que controla qual página está ativa no momento
  const [paginaAtiva, setPaginaAtiva] = useState('inicio');

  // Verifica se o usuário está logado através do contexto
  const { isLoggedIn } = useFinanceiro();

  // -------------------------------------------------------------------------
  // LÓGICA DE RENDERIZAÇÃO CONDICIONAL
  // -------------------------------------------------------------------------

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return <TelaLogin />;
  }

  // Renderiza o conteúdo baseado na página ativa
  // Este switch determina qual componente de tela será exibido
  const renderizarConteudo = () => {
    switch (paginaAtiva) {
      case 'inicio':
        // Tela inicial com resumo rápido
        return <TelaInicio setPaginaAtiva={setPaginaAtiva} />;

      case 'dashboard':
        // Painel de gráficos e analytics
        return <TelaDashboard />;

      case 'transacoes':
        // CRUD principal de Entradas/Saídas
        return <TelaTransacoes />;

      case 'contas':
        // Gerenciamento de Saldos e Faturas
        return <TelaContas />;

      case 'orcamentos':
        // Planejamento de limites teto de gastos por categoria
        return <TelaOrcamentos />;

      case 'fontes':
        // GERENCIAMENTO DE ESTADO DAS FONTES DE RENDA
        // Gestão de origens de renda
        return <TelaFontesReceita />;

      case 'dividas':
        // LÓGICA DE PARCELAMENTO MATEMÁTICO DO CARTÃO
        // CÁLCULO DE PROJEÇÃO DE FIM DE DÍVIDAS
        // Controle de cartão e empréstimos
        return <TelaDividas />;

      case 'categorias':
        // Customização de tags, ícones e cores
        return <TelaCategorias />;

      default:
        return <TelaInicio setPaginaAtiva={setPaginaAtiva} />;
    }
  };

  // Renderiza o layout principal com a sidebar e o conteúdo
  return (
    <LayoutPrincipal
      paginaAtiva={paginaAtiva}
      setPaginaAtiva={setPaginaAtiva}>
      
      {renderizarConteudo()}
    </LayoutPrincipal>);

}

// ============================================================================
// COMPONENTE EXPORTADO: Página Principal
// ============================================================================
// Envolve toda a aplicação com o Provider do contexto financeiro.
export default function Home() {
  return (
    // Provider que fornece o estado global para toda a aplicação
    <FinanceiroProvider>
      <ConteudoPrincipal />
    </FinanceiroProvider>);

}