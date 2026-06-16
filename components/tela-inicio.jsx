/**
 * ==========================================================================
 * COMPONENTE: Tela Inicial (Início)
 * ==========================================================================
 * Tela padrão ativa com resumo rápido e últimas transações.
 * Oferece uma visão geral rápida do estado financeiro atual.
 */

'use client';

import { useFinanceiro } from '@/lib/financeiro-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Target } from
'lucide-react';
import { cn } from '@/lib/utils';






export function TelaInicio({ setPaginaAtiva }) {
  // -------------------------------------------------------------------------
  // ACESSO AO CONTEXTO GLOBAL
  // -------------------------------------------------------------------------
  const {
    transacoes,
    calcularTotalReceitas,
    calcularTotalDespesas,
    calcularSaldo,
    calcularValorResidualDividas,
    dividas,
    orcamentos,
    usuario
  } = useFinanceiro();

  // Cálculos
  const totalReceitas = calcularTotalReceitas();
  const totalDespesas = calcularTotalDespesas();
  const saldo = calcularSaldo();
  const valorResidualDividas = calcularValorResidualDividas();

  // Últimas 5 transações
  const ultimasTransacoes = transacoes.slice(0, 5);

  // Orçamentos em alerta (> 80% do limite)
  const orcamentosEmAlerta = orcamentos.filter((o) => o.gastoAtual / o.valorTeto > 0.8);

  // -------------------------------------------------------------------------
  // FORMATAÇÃO
  // -------------------------------------------------------------------------
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  // Saudação baseada na hora
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho com saudação */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C343F]">
          {getSaudacao()}, {usuario?.nome?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-gray-500 text-sm">
          Aqui está o resumo das suas finanças
        </p>
      </div>

      {/* Cards de resumo rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Total */}
        <Card className="bg-gradient-to-br from-[#0C6A36]/10 to-white border-[#0C6A36]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Saldo Atual
            </CardTitle>
            <Wallet className="w-4 h-4 text-[#0C6A36]" />
          </CardHeader>
          <CardContent>
            <p className={cn(
              "text-2xl font-bold",
              saldo >= 0 ? "text-[#0C6A36]" : "text-red-600"
            )}>
              {formatarMoeda(saldo)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>

        {/* Receitas do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Receitas
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatarMoeda(totalReceitas)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total de entradas
            </p>
          </CardContent>
        </Card>

        {/* Despesas do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Despesas
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatarMoeda(totalDespesas)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total de saídas
            </p>
          </CardContent>
        </Card>

        {/* Dívidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Dívidas
            </CardTitle>
            <CreditCard className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {formatarMoeda(valorResidualDividas)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dividas.length} parcelamento(s) ativo(s)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Transações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Últimas Transações</CardTitle>
                <CardDescription>Suas movimentações recentes</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaginaAtiva('transacoes')}
                className="text-[#0C6A36]">
                
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ultimasTransacoes.length > 0 ?
            <div className="space-y-3">
                {ultimasTransacoes.map((transacao) =>
              <div
                key={transacao.id}
                className="flex items-center justify-between py-2 border-b last:border-0">
                
                    <div className="flex items-center gap-3">
                      <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    transacao.tipo === 'receita' ?
                    "bg-green-100" :
                    "bg-red-100"
                  )}>
                        {transacao.tipo === 'receita' ?
                    <ArrowUpCircle className="w-4 h-4 text-green-600" /> :

                    <ArrowDownCircle className="w-4 h-4 text-red-600" />
                    }
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[150px]">
                          {transacao.descricao}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatarData(transacao.data)} • {transacao.categoria}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                  "font-semibold text-sm",
                  transacao.tipo === 'receita' ? "text-green-600" : "text-red-600"
                )}>
                      {transacao.tipo === 'receita' ? '+' : '-'}
                      {formatarMoeda(transacao.valor)}
                    </span>
                  </div>
              )}
              </div> :

            <div className="text-center py-8 text-gray-500">
                <p>Nenhuma transação registrada</p>
                <Button
                variant="link"
                onClick={() => setPaginaAtiva('transacoes')}
                className="text-[#0C6A36]">
                
                  Adicionar primeira transação
                </Button>
              </div>
            }
          </CardContent>
        </Card>

        {/* Alertas de Orçamento */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Orçamentos
                </CardTitle>
                <CardDescription>Status dos seus limites</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaginaAtiva('orcamentos')}
                className="text-[#0C6A36]">
                
                Gerenciar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {orcamentos.length > 0 ?
            <div className="space-y-4">
                {orcamentos.slice(0, 4).map((orcamento) => {
                const percentual = orcamento.gastoAtual / orcamento.valorTeto * 100;
                const ultrapassou = percentual > 100;
                const alerta = percentual > 80 && percentual <= 100;

                return (
                  <div key={orcamento.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{orcamento.categoria}</span>
                        <span className={cn(
                        ultrapassou && "text-red-600",
                        alerta && "text-yellow-600"
                      )}>
                          {formatarMoeda(orcamento.gastoAtual)} / {formatarMoeda(orcamento.valorTeto)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          ultrapassou ? "bg-red-500" :
                          alerta ? "bg-yellow-500" : "bg-[#0C6A36]"
                        )}
                        style={{ width: `${Math.min(percentual, 100)}%` }} />
                      
                      </div>
                    </div>);

              })}

                {orcamentosEmAlerta.length > 0 &&
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ {orcamentosEmAlerta.length} orçamento(s) próximo(s) do limite
                    </p>
                  </div>
              }
              </div> :

            <div className="text-center py-8 text-gray-500">
                <p>Nenhum orçamento definido</p>
                <Button
                variant="link"
                onClick={() => setPaginaAtiva('orcamentos')}
                className="text-[#0C6A36]">
                
                  Definir limites de gastos
                </Button>
              </div>
            }
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setPaginaAtiva('transacoes')}>
              
              <ArrowUpCircle className="w-6 h-6 text-green-600" />
              <span className="text-xs">Nova Receita</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setPaginaAtiva('transacoes')}>
              
              <ArrowDownCircle className="w-6 h-6 text-red-600" />
              <span className="text-xs">Nova Despesa</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setPaginaAtiva('dividas')}>
              
              <CreditCard className="w-6 h-6 text-orange-600" />
              <span className="text-xs">Nova Dívida</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setPaginaAtiva('dashboard')}>
              
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-xs">Ver Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);

}