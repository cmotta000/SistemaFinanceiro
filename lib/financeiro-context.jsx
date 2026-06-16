/**
 * ==========================================================================
 * CONTEXTO GLOBAL DA APLICAÇÃO DE GESTÃO FINANCEIRA
 * ==========================================================================
 * Este arquivo implementa o Context API do React para gerenciar o estado
 * global da aplicação. Centraliza todas as operações CRUD e cálculos.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';









import {
  transacoesIniciais,
  fontesReceitaIniciais,
  dividasIniciais,
  orcamentosIniciais,
  categoriasIniciais,
  contasIniciais } from
'./mock-data';

// ============================================================================
// DEFINIÇÃO DO TIPO DO CONTEXTO
// ============================================================================
// Interface que define todas as funções e dados disponíveis no contexto.






















































// Criação do contexto com valor inicial undefined
const FinanceiroContext = createContext(undefined);

// ============================================================================
// PROVIDER DO CONTEXTO FINANCEIRO
// ============================================================================
// Componente que envolve a aplicação e fornece o estado global.
export function FinanceiroProvider({ children }) {
  // -------------------------------------------------------------------------
  // ESTADO DE AUTENTICAÇÃO
  // -------------------------------------------------------------------------
  const [usuario, setUsuario] = useState(null);

  // -------------------------------------------------------------------------
  // ESTADOS PRINCIPAIS (CRUDs)
  // -------------------------------------------------------------------------
  const [transacoes, setTransacoes] = useState(transacoesIniciais);
  const [fontesReceita, setFontesReceita] = useState(fontesReceitaIniciais);
  const [dividas, setDividas] = useState(dividasIniciais);
  const [orcamentos, setOrcamentos] = useState(orcamentosIniciais);
  const [categorias, setCategorias] = useState(categoriasIniciais);
  const [contas, setContas] = useState(contasIniciais);

  // -------------------------------------------------------------------------
  // FUNÇÕES DE AUTENTICAÇÃO
  // -------------------------------------------------------------------------

  /**
   * Simula o processo de login do usuário.
   * Em produção, isso seria uma chamada à API de autenticação.
   */
  const login = useCallback((email, senha) => {
    // SIMULAÇÃO DE VALIDAÇÃO - Em produção usar autenticação real
    if (email && senha.length >= 4) {
      setUsuario({
        id: '1',
        nome: 'Usuário Demo',
        email: email
      });
      return true;
    }
    return false;
  }, []);

  /**
   * Realiza o logout do usuário, limpando o estado de autenticação.
   */
  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  // Verifica se o usuário está logado
  const isLoggedIn = useMemo(() => usuario !== null, [usuario]);

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DAS TRANSAÇÕES
  // -------------------------------------------------------------------------
  // As ações da tabela (Editar/Deletar) atualizam os estados de forma
  // reativa instantaneamente na interface do usuário.

  /**
   * Gera um ID único para novas entidades.
   * Utiliza timestamp + random para evitar colisões.
   */
  const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Adiciona uma nova transação ao sistema.
   * Se for despesa, atualiza o gasto do orçamento correspondente.
   */
  const adicionarTransacao = useCallback((transacao) => {
    const novaTransacao = {
      ...transacao,
      id: gerarId()
    };

    setTransacoes((prev) => [novaTransacao, ...prev]);

    // CONTROLE DE TETO DO ORÇAMENTO POR CATEGORIA
    // Se for despesa, incrementa o gasto atual do orçamento
    if (transacao.tipo === 'despesa') {
      setOrcamentos((prev) => prev.map((orc) => {
        if (orc.categoria === transacao.categoria) {
          return { ...orc, gastoAtual: orc.gastoAtual + transacao.valor };
        }
        return orc;
      }));
    }
  }, []);

  /**
   * Edita uma transação existente pelo ID.
   * Atualização reativa instantânea na interface.
   */
  const editarTransacao = useCallback((id, dados) => {
    setTransacoes((prev) => prev.map((t) =>
    t.id === id ? { ...t, ...dados } : t
    ));
  }, []);

  /**
   * Remove uma transação do sistema pelo ID.
   * Atualização reativa instantânea na interface.
   */
  const deletarTransacao = useCallback((id) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DAS FONTES DE RENDA
  // -------------------------------------------------------------------------

  const adicionarFonteReceita = useCallback((fonte) => {
    setFontesReceita((prev) => [...prev, { ...fonte, id: gerarId() }]);
  }, []);

  const editarFonteReceita = useCallback((id, dados) => {
    setFontesReceita((prev) => prev.map((f) =>
    f.id === id ? { ...f, ...dados } : f
    ));
  }, []);

  const deletarFonteReceita = useCallback((id) => {
    setFontesReceita((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DAS DÍVIDAS E PARCELAMENTOS
  // -------------------------------------------------------------------------

  const adicionarDivida = useCallback((divida) => {
    setDividas((prev) => [...prev, { ...divida, id: gerarId() }]);
  }, []);

  const editarDivida = useCallback((id, dados) => {
    setDividas((prev) => prev.map((d) =>
    d.id === id ? { ...d, ...dados } : d
    ));
  }, []);

  const deletarDivida = useCallback((id) => {
    setDividas((prev) => prev.filter((d) => d.id !== id));
  }, []);

  /**
   * Registra o pagamento de uma parcela da dívida.
   * Incrementa o contador de parcelas pagas.
   */
  const pagarParcelaDivida = useCallback((id) => {
    setDividas((prev) => prev.map((d) => {
      if (d.id === id && d.parcelasPagas < d.quantidadeParcelas) {
        return { ...d, parcelasPagas: d.parcelasPagas + 1 };
      }
      return d;
    }));
  }, []);

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DOS ORÇAMENTOS
  // -------------------------------------------------------------------------

  const adicionarOrcamento = useCallback((orcamento) => {
    setOrcamentos((prev) => [...prev, { ...orcamento, id: gerarId() }]);
  }, []);

  const editarOrcamento = useCallback((id, dados) => {
    setOrcamentos((prev) => prev.map((o) =>
    o.id === id ? { ...o, ...dados } : o
    ));
  }, []);

  const deletarOrcamento = useCallback((id) => {
    setOrcamentos((prev) => prev.filter((o) => o.id !== id));
  }, []);

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DAS CATEGORIAS
  // -------------------------------------------------------------------------

  const adicionarCategoria = useCallback((categoria) => {
    setCategorias((prev) => [...prev, { ...categoria, id: gerarId() }]);
  }, []);

  const editarCategoria = useCallback((id, dados) => {
    setCategorias((prev) => prev.map((c) =>
    c.id === id ? { ...c, ...dados } : c
    ));
  }, []);

  const deletarCategoria = useCallback((id) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DAS CONTAS
  // -------------------------------------------------------------------------

  const adicionarConta = useCallback((conta) => {
    setContas((prev) => [...prev, { ...conta, id: gerarId() }]);
  }, []);

  const editarConta = useCallback((id, dados) => {
    setContas((prev) => prev.map((c) =>
    c.id === id ? { ...c, ...dados } : c
    ));
  }, []);

  const deletarConta = useCallback((id) => {
    setContas((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // -------------------------------------------------------------------------
  // CÁLCULOS E MÉTRICAS FINANCEIRAS
  // -------------------------------------------------------------------------

  /**
   * CÁLCULO: Total de todas as receitas registradas.
   * Filtra transações do tipo 'receita' e soma os valores.
   */
  const calcularTotalReceitas = useCallback(() => {
    return transacoes.
    filter((t) => t.tipo === 'receita').
    reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]);

  /**
   * CÁLCULO: Total de todas as despesas registradas.
   * Filtra transações do tipo 'despesa' e soma os valores.
   */
  const calcularTotalDespesas = useCallback(() => {
    return transacoes.
    filter((t) => t.tipo === 'despesa').
    reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]);

  /**
   * CÁLCULO: Saldo atual (Receitas - Despesas).
   * Fórmula: Saldo = Σ(Receitas) - Σ(Despesas)
   */
  const calcularSaldo = useCallback(() => {
    return calcularTotalReceitas() - calcularTotalDespesas();
  }, [calcularTotalReceitas, calcularTotalDespesas]);

  /**
   * CONTROLE DE TETO DO ORÇAMENTO POR CATEGORIA
   * Calcula quanto foi gasto em uma categoria específica.
   */
  const calcularGastoPorCategoria = useCallback((categoria) => {
    return transacoes.
    filter((t) => t.tipo === 'despesa' && t.categoria === categoria).
    reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]);

  // =========================================================================
  // LÓGICA DE PARCELAMENTO MATEMÁTICO DO CARTÃO
  // =========================================================================

  /**
   * CÁLCULO DE PROJEÇÃO DE FIM DE DÍVIDAS
   * Calcula o valor residual total de todas as dívidas parceladas.
   * 
   * Fórmula por dívida:
   *   Valor da Parcela = Valor Total / Quantidade de Parcelas
   *   Parcelas Restantes = Quantidade de Parcelas - Parcelas Pagas
   *   Valor Residual = Valor da Parcela × Parcelas Restantes
   * 
   * Valor Total Residual = Σ(Valor Residual de cada dívida)
   */
  const calcularValorResidualDividas = useCallback(() => {
    return dividas.reduce((total, divida) => {
      // Valor de cada parcela (divisão simples sem juros)
      const valorParcela = divida.valorTotal / divida.quantidadeParcelas;
      // Quantas parcelas ainda faltam pagar
      const parcelasRestantes = divida.quantidadeParcelas - divida.parcelasPagas;
      // Soma ao total o valor que ainda precisa ser pago desta dívida
      return total + valorParcela * parcelasRestantes;
    }, 0);
  }, [dividas]);

  /**
   * CÁLCULO DE PROJEÇÃO DE FIM DE DÍVIDAS
   * Determina a data estimada de quitação de todas as dívidas.
   * 
   * Algoritmo:
   * 1. Para cada dívida, calcula quantos meses faltam para quitação
   * 2. Encontra a dívida que vai demorar mais tempo
   * 3. Adiciona esses meses à data atual para obter a data de quitação
   */
  const calcularDataQuitacaoDividas = useCallback(() => {
    if (dividas.length === 0) return 'Sem dívidas';

    // Encontra o maior número de parcelas restantes entre todas as dívidas
    const mesesRestantes = dividas.reduce((maxMeses, divida) => {
      const parcelasRestantes = divida.quantidadeParcelas - divida.parcelasPagas;
      return Math.max(maxMeses, parcelasRestantes);
    }, 0);

    if (mesesRestantes === 0) return 'Quitado!';

    // Projeta a data de quitação somando os meses à data atual
    const dataQuitacao = new Date();
    dataQuitacao.setMonth(dataQuitacao.getMonth() + mesesRestantes);

    // Formata a data para exibição em português
    return dataQuitacao.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }, [dividas]);

  /**
   * Retorna o progresso de pagamento de uma dívida específica.
   * Usado para exibir barras de progresso e indicadores visuais.
   */
  const obterProgressoDivida = useCallback((id) => {
    const divida = dividas.find((d) => d.id === id);
    if (!divida) return { pagas: 0, total: 0, percentual: 0 };

    // LÓGICA DE PARCELAMENTO MATEMÁTICO DO CARTÃO
    // Percentual = (Parcelas Pagas / Total de Parcelas) × 100
    const percentual = divida.parcelasPagas / divida.quantidadeParcelas * 100;

    return {
      pagas: divida.parcelasPagas,
      total: divida.quantidadeParcelas,
      percentual: Math.round(percentual)
    };
  }, [dividas]);

  // -------------------------------------------------------------------------
  // VALOR DO CONTEXTO (memorizado para performance)
  // -------------------------------------------------------------------------
  const value = useMemo(() => ({
    // Autenticação
    usuario,
    isLoggedIn,
    login,
    logout,

    // Transações
    transacoes,
    adicionarTransacao,
    editarTransacao,
    deletarTransacao,

    // Fontes de Receita
    fontesReceita,
    adicionarFonteReceita,
    editarFonteReceita,
    deletarFonteReceita,

    // Dívidas
    dividas,
    adicionarDivida,
    editarDivida,
    deletarDivida,
    pagarParcelaDivida,

    // Orçamentos
    orcamentos,
    adicionarOrcamento,
    editarOrcamento,
    deletarOrcamento,

    // Categorias
    categorias,
    adicionarCategoria,
    editarCategoria,
    deletarCategoria,

    // Contas
    contas,
    adicionarConta,
    editarConta,
    deletarConta,

    // Cálculos
    calcularTotalReceitas,
    calcularTotalDespesas,
    calcularSaldo,
    calcularGastoPorCategoria,
    calcularValorResidualDividas,
    calcularDataQuitacaoDividas,
    obterProgressoDivida
  }), [
  usuario, isLoggedIn, login, logout,
  transacoes, adicionarTransacao, editarTransacao, deletarTransacao,
  fontesReceita, adicionarFonteReceita, editarFonteReceita, deletarFonteReceita,
  dividas, adicionarDivida, editarDivida, deletarDivida, pagarParcelaDivida,
  orcamentos, adicionarOrcamento, editarOrcamento, deletarOrcamento,
  categorias, adicionarCategoria, editarCategoria, deletarCategoria,
  contas, adicionarConta, editarConta, deletarConta,
  calcularTotalReceitas, calcularTotalDespesas, calcularSaldo,
  calcularGastoPorCategoria, calcularValorResidualDividas,
  calcularDataQuitacaoDividas, obterProgressoDivida]
  );

  return (
    <FinanceiroContext.Provider value={value}>
      {children}
    </FinanceiroContext.Provider>);

}

// ============================================================================
// HOOK CUSTOMIZADO PARA ACESSO AO CONTEXTO
// ============================================================================
// Fornece uma forma segura de acessar o contexto com verificação de erro.
export function useFinanceiro() {
  const context = useContext(FinanceiroContext);
  if (context === undefined) {
    throw new Error('useFinanceiro deve ser usado dentro de um FinanceiroProvider');
  }
  return context;
}