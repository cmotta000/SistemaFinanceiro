/**
 * ==========================================================================
 * COMPONENTE: Layout Principal da Aplicação
 * ==========================================================================
 * Estrutura principal com Topbar, Sidebar e área de conteúdo.
 * Gerencia a navegação entre as diferentes telas do sistema.
 */

'use client';

import { useState } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  DollarSign,
  CreditCard,
  Tags,
  LogOut,
  ChevronRight } from
'lucide-react';
import { cn } from '@/lib/utils';
import { RodapeBootstrap } from '@/components/rodape-bootstrap';

// ============================================================================
// DEFINIÇÃO DOS ITENS DO MENU
// ============================================================================
// Estrutura de navegação seguindo as melhores práticas do mercado.
const menuItems = [
{ id: 'inicio', label: 'Início', icon: Home },
{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
{ id: 'transacoes', label: 'Transações', icon: ArrowLeftRight },
{ id: 'contas', label: 'Contas e Cartões', icon: Wallet },
{ id: 'orcamentos', label: 'Orçamentos', icon: Target },
{ id: 'fontes', label: 'Fontes de Receita', icon: DollarSign },
{ id: 'dividas', label: 'Dívidas e Parcelamentos', icon: CreditCard },
{ id: 'categorias', label: 'Categorias', icon: Tags }];


// ============================================================================
// TIPO PARA AS PÁGINAS DA APLICAÇÃO
// ============================================================================
















export function LayoutPrincipal({
  children,
  paginaAtiva,
  setPaginaAtiva
}) {
  // -------------------------------------------------------------------------
  // ESTADO DA SIDEBAR (aberta/fechada)
  // -------------------------------------------------------------------------
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [sidebarMobileAberta, setSidebarMobileAberta] = useState(false);

  // Acesso ao contexto para função de logout
  const { logout, usuario } = useFinanceiro();

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* ================================================================== */}
      {/* TOPBAR - Barra superior fixa verde (#0C6A36)                       */}
      {/* ================================================================== */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0C6A36] z-50 flex items-center px-4">
        {/* Botão Menu Hambúrguer - Desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarAberta(!sidebarAberta)}
          className="text-white hover:bg-white/10 hidden md:flex"
          aria-label="Toggle menu">
          
          <Menu className="w-6 h-6" />
        </Button>

        {/* Botão Menu Hambúrguer - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarMobileAberta(true)}
          className="text-white hover:bg-white/10 md:hidden"
          aria-label="Abrir menu">
          
          <Menu className="w-6 h-6" />
        </Button>

        {/* Nome do usuário à direita */}
        <div className="ml-auto flex items-center gap-4">
          <span className="text-white/90 text-sm hidden sm:block">
            Olá, {usuario?.nome || 'Usuário'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white hover:bg-white/10"
            aria-label="Sair">
            
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* ================================================================== */}
      {/* SIDEBAR DESKTOP - Cor cinza escuro grafite (#2C343F)               */}
      {/* ================================================================== */}
      <aside
        className={cn(
          'fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-[#2C343F] z-40 transition-all duration-300 hidden md:block',
          sidebarAberta ? 'w-64' : 'w-16'
        )}>
        
        <ScrollArea className="h-full py-4">
          {/* Texto "MENU" no topo - visível apenas quando sidebar expandida */}
          {sidebarAberta &&
          <div className="px-4 mb-4">
              <span className="text-gray-400 text-xs font-semibold tracking-wider">
                MENU
              </span>
            </div>
          }

          {/* Lista de itens de navegação */}
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = paginaAtiva === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setPaginaAtiva(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                    isActive ?
                    'bg-[#0C6A36] text-white' :
                    'text-gray-300 hover:bg-white/5 hover:text-white'
                  )}>
                  
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarAberta &&
                  <>
                      <span className="flex-1 text-sm">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </>
                  }
                </button>);

            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* ================================================================== */}
      {/* SIDEBAR MOBILE - Overlay                                          */}
      {/* ================================================================== */}
      {sidebarMobileAberta &&
      <>
          {/* Backdrop escuro */}
          <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarMobileAberta(false)} />
        
          
          {/* Sidebar móvel */}
          <aside className="fixed top-0 left-0 w-72 h-full bg-[#2C343F] z-50 md:hidden">
            {/* Header da sidebar mobile */}
            <div className="h-14 bg-[#0C6A36] flex items-center justify-between px-4">
              <span className="text-white font-semibold">Menu</span>
              <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarMobileAberta(false)}
              className="text-white hover:bg-white/10">
              
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Lista de navegação mobile */}
            <ScrollArea className="h-[calc(100%-3.5rem)] py-4">
              <div className="px-4 mb-4">
                <span className="text-gray-400 text-xs font-semibold tracking-wider">
                  MENU
                </span>
              </div>

              <nav className="space-y-1 px-2">
                {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = paginaAtiva === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPaginaAtiva(item.id);
                      setSidebarMobileAberta(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                      isActive ?
                      'bg-[#0C6A36] text-white' :
                      'text-gray-300 hover:bg-white/5 hover:text-white'
                    )}>
                    
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1 text-sm">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </button>);

              })}
              </nav>
            </ScrollArea>
          </aside>
        </>
      }

      {/* ================================================================== */}
      {/* ÁREA DE CONTEÚDO PRINCIPAL                                        */}
      {/* ================================================================== */}
      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-300',
          sidebarAberta ? 'md:ml-64' : 'md:ml-16'
        )}>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
        <RodapeBootstrap />
      </main>
    </div>);

}