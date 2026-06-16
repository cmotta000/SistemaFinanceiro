/**
 * ==========================================================================
 * COMPONENTE: Tela de Dashboard
 * ==========================================================================
 * Painel de gráficos e analytics com visão analítica das finanças.
 * Inclui gráfico de barras, donut/pizza e card de previsão de dívidas.
 */

'use client';

import { useMemo } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';
import { dadosMensaisGrafico } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  CreditCard,
  Calendar,
  CheckCircle2 } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend } from
'recharts';

// ============================================================================
// CORES PARA OS GRÁFICOS
// ============================================================================
const CORES_RECEITAS_DESPESAS = {
  receitas: '#22C55E', // Verde para receitas
  despesas: '#EF4444' // Vermelho para despesas
};

export function TelaDashboard() {
  // -------------------------------------------------------------------------
  // ACESSO AO CONTEXTO GLOBAL
  // -------------------------------------------------------------------------
  const {
    calcularTotalReceitas,
    calcularTotalDespesas,
    calcularSaldo,
    calcularValorResidualDividas,
    calcularDataQuitacaoDividas,
    fontesReceita,
    transacoes,
    dividas,
    orcamentos,
    obterProgressoDivida
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // CÁLCULOS DE MÉTRICAS
  // -------------------------------------------------------------------------
  const totalReceitas = calcularTotalReceitas();
  const totalDespesas = calcularTotalDespesas();
  const saldo = calcularSaldo();
  const valorResidualDividas = calcularValorResidualDividas();
  const dataQuitacao = calcularDataQuitacaoDividas();

  // -------------------------------------------------------------------------
  // DADOS PARA O GRÁFICO DE PIZZA (FONTES DE RECEITA)
  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE ESTADO DAS FONTES DE RENDA
  // Calcula a distribuição percentual de onde vêm os ganhos
  const dadosFontesReceita = useMemo(() => {
    // Agrupa receitas por fonte
    const receitasPorFonte = transacoes.
    filter((t) => t.tipo === 'receita' && t.fonteReceitaId).
    reduce((acc, t) => {
      const fonte = fontesReceita.find((f) => f.id === t.fonteReceitaId);
      if (fonte) {
        acc[fonte.nome] = (acc[fonte.nome] || 0) + t.valor;
      }
      return acc;
    }, {});

    // Converte para formato de gráfico
    return Object.entries(receitasPorFonte).map(([nome, valor]) => {
      const fonte = fontesReceita.find((f) => f.nome === nome);
      return {
        name: nome,
        value: valor,
        color: fonte?.cor || '#6B7280'
      };
    });
  }, [transacoes, fontesReceita]);

  // -------------------------------------------------------------------------
  // FORMATAÇÃO DE VALORES
  // -------------------------------------------------------------------------
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // -------------------------------------------------------------------------
  // CÁLCULO DO TOTAL DE PARCELAS
  // -------------------------------------------------------------------------
  // LÓGICA DE PARCELAMENTO MATEMÁTICO DO CARTÃO
  const totalParcelasPagas = dividas.reduce((acc, d) => acc + d.parcelasPagas, 0);
  const totalParcelas = dividas.reduce((acc, d) => acc + d.quantidadeParcelas, 0);
  const percentualQuitado = totalParcelas > 0 ?
  Math.round(totalParcelasPagas / totalParcelas * 100) :
  0;

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO DA INTERFACE
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C343F]">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Visão geral das suas finanças
        </p>
      </div>

      {/* ================================================================== */}
      {/* CARDS DE RESUMO (Receitas, Despesas, Saldo, Dívidas)              */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Total de Receitas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Receitas
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatarMoeda(totalReceitas)}
            </p>
          </CardContent>
        </Card>

        {/* Card Total de Despesas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Despesas
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatarMoeda(totalDespesas)}
            </p>
          </CardContent>
        </Card>

        {/* Card Saldo Atual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Saldo Atual
            </CardTitle>
            <Wallet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatarMoeda(saldo)}
            </p>
          </CardContent>
        </Card>

        {/* Card Dívidas Pendentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Dívidas Pendentes
            </CardTitle>
            <CreditCard className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {formatarMoeda(valorResidualDividas)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================== */}
      {/* GRÁFICOS                                                          */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============================================================== */}
        {/* GRÁFICO DE TORRES (BAR CHART)                                  */}
        {/* Comparativo mensal vertical: Receitas vs Despesas              */}
        {/* ============================================================== */}
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparativo mensal dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosMensaisGrafico}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: '#6B7280', fontSize: 12 }} />
                  
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(v) => `R$ ${v / 1000}k`} />
                  
                  <Tooltip
                    formatter={(value) => formatarMoeda(value)}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} />
                  
                  <Legend />
                  <Bar
                    dataKey="receitas"
                    name="Receitas"
                    fill={CORES_RECEITAS_DESPESAS.receitas}
                    radius={[4, 4, 0, 0]} />
                  
                  <Bar
                    dataKey="despesas"
                    name="Despesas"
                    fill={CORES_RECEITAS_DESPESAS.despesas}
                    radius={[4, 4, 0, 0]} />
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================== */}
        {/* GRÁFICO DE DISTRIBUIÇÃO (DONUT/PIE CHART)                      */}
        {/* Exibição percentual de onde vêm os ganhos                      */}
        {/* ============================================================== */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Receitas</CardTitle>
            <CardDescription>Origem dos seus ganhos por fonte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {dadosFontesReceita.length > 0 ?
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                    data={dadosFontesReceita}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                    }>
                    
                      {dadosFontesReceita.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    )}
                    </Pie>
                    <Tooltip
                    formatter={(value) => formatarMoeda(value)}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} />
                  
                    <Legend />
                  </PieChart>
                </ResponsiveContainer> :

              <div className="h-full flex items-center justify-center text-gray-500">
                  Nenhuma receita registrada com fonte
                </div>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================== */}
      {/* CARD AVANÇADO - PREVISÃO DE ENCERRAMENTO DE DÍVIDAS              */}
      {/* ================================================================== */}
      {/* CÁLCULO DE PROJEÇÃO DE FIM DE DÍVIDAS                            */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-600" />
            Previsão de Encerramento de Dívidas
          </CardTitle>
          <CardDescription>
            Projeção matemática baseada nas parcelas pendentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dividas.length > 0 ?
          <>
              {/* Métricas principais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Valor Residual Total */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Wallet className="w-4 h-4" />
                    Valor Residual Total
                  </div>
                  <p className="text-xl font-bold text-orange-600">
                    {formatarMoeda(valorResidualDividas)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Soma de todas as parcelas pendentes
                  </p>
                </div>

                {/* Data Estimada de Quitação */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Data de Quitação
                  </div>
                  <p className="text-xl font-bold text-blue-600 capitalize">
                    {dataQuitacao}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Quando a última parcela será paga
                  </p>
                </div>

                {/* Progresso Geral */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Progresso Geral
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    {totalParcelasPagas} de {totalParcelas}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    parcelas quitadas ({percentualQuitado}%)
                  </p>
                </div>
              </div>

              {/* Barra de progresso geral */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progresso total de quitação</span>
                  <span className="font-medium text-[#0C6A36]">{percentualQuitado}%</span>
                </div>
                <Progress
                value={percentualQuitado}
                className="h-3" />
              
              </div>

              {/* Lista de dívidas individuais */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Detalhamento por dívida:</h4>
                {dividas.map((divida) => {
                const progresso = obterProgressoDivida(divida.id);
                // LÓGICA DE PARCELAMENTO MATEMÁTICO DO CARTÃO
                const valorParcela = divida.valorTotal / divida.quantidadeParcelas;

                return (
                  <div
                    key={divida.id}
                    className="bg-white rounded-lg p-3 shadow-sm border">
                    
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{divida.nome}</p>
                          <p className="text-xs text-gray-500">
                            Parcela: {formatarMoeda(valorParcela)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-orange-600">
                          {progresso.pagas}/{progresso.total}
                        </span>
                      </div>
                      <Progress
                      value={progresso.percentual}
                      className="h-2" />
                    
                    </div>);

              })}
              </div>
            </> :

          <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Parabéns! Você não possui dívidas.</p>
            </div>
          }
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* CONTROLE DE TETO DO ORÇAMENTO POR CATEGORIA                      */}
      {/* ================================================================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Orçamentos do Mês
          </CardTitle>
          <CardDescription>
            Acompanhamento dos limites de gastos por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orcamentos.length > 0 ?
          <div className="space-y-4">
              {orcamentos.map((orc) => {
              // Calcula percentual de uso do orçamento
              const percentualUsado = Math.min(orc.gastoAtual / orc.valorTeto * 100, 100);
              const ultrapassou = orc.gastoAtual > orc.valorTeto;

              return (
                <div key={orc.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{orc.categoria}</span>
                      <span className={ultrapassou ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        {formatarMoeda(orc.gastoAtual)} / {formatarMoeda(orc.valorTeto)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                      value={percentualUsado}
                      className={`h-2 ${ultrapassou ? '[&>div]:bg-red-500' : ''}`} />
                    
                      {/* Alerta visual se ultrapassou o teto */}
                      {ultrapassou &&
                    <span className="absolute right-0 -top-5 text-xs text-red-600 font-medium">
                          ⚠️ Limite excedido!
                        </span>
                    }
                    </div>
                  </div>);

            })}
            </div> :

          <div className="text-center py-8 text-gray-500">
              Nenhum orçamento cadastrado. Vá em Orçamentos para definir limites.
            </div>
          }
        </CardContent>
      </Card>
    </div>);

}