/**
 * ==========================================================================
 * DADOS MOCKADOS PARA SIMULAÇÃO DO SISTEMA FINANCEIRO
 * ==========================================================================
 * Este arquivo contém dados de exemplo para demonstrar a funcionalidade
 * completa do sistema sem necessidade de backend real.
 */










// ============================================================================
// CATEGORIAS PADRÃO DO SISTEMA
// ============================================================================
// Categorias pré-definidas com cores e ícones para classificação das transações.
export const categoriasIniciais = [
{ id: '1', nome: 'Alimentação', cor: '#22C55E', icone: 'Utensils', tipo: 'despesa' },
{ id: '2', nome: 'Transporte', cor: '#3B82F6', icone: 'Car', tipo: 'despesa' },
{ id: '3', nome: 'Moradia', cor: '#8B5CF6', icone: 'Home', tipo: 'despesa' },
{ id: '4', nome: 'Saúde', cor: '#EF4444', icone: 'Heart', tipo: 'despesa' },
{ id: '5', nome: 'Educação', cor: '#F59E0B', icone: 'GraduationCap', tipo: 'despesa' },
{ id: '6', nome: 'Lazer', cor: '#EC4899', icone: 'Gamepad2', tipo: 'despesa' },
{ id: '7', nome: 'Salário', cor: '#10B981', icone: 'Briefcase', tipo: 'receita' },
{ id: '8', nome: 'Freelance', cor: '#6366F1', icone: 'Laptop', tipo: 'receita' },
{ id: '9', nome: 'Investimentos', cor: '#14B8A6', icone: 'TrendingUp', tipo: 'receita' },
{ id: '10', nome: 'Outros', cor: '#6B7280', icone: 'MoreHorizontal', tipo: 'ambos' }];


// ============================================================================
// FONTES DE RECEITA INICIAIS
// ============================================================================
// Origens de renda do usuário para rastreamento financeiro.
export const fontesReceitaIniciais = [
{ id: '1', nome: 'Salário CLT', tipo: 'mensal', valorEstimado: 5000, cor: '#10B981' },
{ id: '2', nome: 'Freelance Design', tipo: 'variavel', valorEstimado: 2000, cor: '#6366F1' },
{ id: '3', nome: 'Rendimentos CDB', tipo: 'mensal', valorEstimado: 150, cor: '#14B8A6' }];


// ============================================================================
// CONTAS BANCÁRIAS E CARTÕES INICIAIS
// ============================================================================
// Contas para gestão de saldos e faturas.
export const contasIniciais = [
{ id: '1', nome: 'Nubank', tipo: 'corrente', saldo: 3500, cor: '#8B5CF6' },
{ id: '2', nome: 'Itaú', tipo: 'corrente', saldo: 1200, cor: '#F97316' },
{ id: '3', nome: 'Poupança', tipo: 'poupanca', saldo: 8000, cor: '#22C55E' },
{
  id: '4',
  nome: 'Cartão Nubank',
  tipo: 'cartao',
  saldo: 0,
  cor: '#8B5CF6',
  limiteCartao: 5000,
  diaFechamento: 15,
  diaVencimento: 22
}];


// ============================================================================
// TRANSAÇÕES DE EXEMPLO
// ============================================================================
// Movimentações financeiras para demonstração do sistema.
export const transacoesIniciais = [
{
  id: '1',
  descricao: 'Salário Maio',
  valor: 5000,
  tipo: 'receita',
  categoria: 'Salário',
  data: '2024-05-05',
  fonteReceitaId: '1',
  contaId: '1'
},
{
  id: '2',
  descricao: 'Supermercado Extra',
  valor: 450.75,
  tipo: 'despesa',
  categoria: 'Alimentação',
  data: '2024-05-08',
  contaId: '1'
},
{
  id: '3',
  descricao: 'Uber Mensal',
  valor: 280,
  tipo: 'despesa',
  categoria: 'Transporte',
  data: '2024-05-10',
  contaId: '1'
},
{
  id: '4',
  descricao: 'Projeto Website',
  valor: 1500,
  tipo: 'receita',
  categoria: 'Freelance',
  data: '2024-05-12',
  fonteReceitaId: '2',
  contaId: '2'
},
{
  id: '5',
  descricao: 'Aluguel Apartamento',
  valor: 1800,
  tipo: 'despesa',
  categoria: 'Moradia',
  data: '2024-05-01',
  contaId: '1'
},
{
  id: '6',
  descricao: 'Plano de Saúde',
  valor: 350,
  tipo: 'despesa',
  categoria: 'Saúde',
  data: '2024-05-05',
  contaId: '1'
},
{
  id: '7',
  descricao: 'Curso Udemy',
  valor: 29.90,
  tipo: 'despesa',
  categoria: 'Educação',
  data: '2024-05-15',
  contaId: '4'
},
{
  id: '8',
  descricao: 'Cinema',
  valor: 75,
  tipo: 'despesa',
  categoria: 'Lazer',
  data: '2024-05-18',
  contaId: '4'
},
{
  id: '9',
  descricao: 'Rendimento CDB',
  valor: 150,
  tipo: 'receita',
  categoria: 'Investimentos',
  data: '2024-05-20',
  fonteReceitaId: '3',
  contaId: '3'
},
{
  id: '10',
  descricao: 'Restaurante',
  valor: 120,
  tipo: 'despesa',
  categoria: 'Alimentação',
  data: '2024-05-22',
  contaId: '1'
}];


// ============================================================================
// DÍVIDAS E PARCELAMENTOS DE EXEMPLO
// ============================================================================
// Compras parceladas para demonstrar a lógica de projeção de parcelas.
export const dividasIniciais = [
{
  id: '1',
  nome: 'iPhone 15 Pro',
  valorTotal: 7999,
  dataCompra: '2024-01-15',
  quantidadeParcelas: 12,
  parcelasPagas: 4,
  categoria: 'Outros'
},
{
  id: '2',
  nome: 'Sofá Novo',
  valorTotal: 3500,
  dataCompra: '2024-03-01',
  quantidadeParcelas: 10,
  parcelasPagas: 2,
  categoria: 'Moradia'
},
{
  id: '3',
  nome: 'Notebook Dell',
  valorTotal: 4500,
  dataCompra: '2024-02-10',
  quantidadeParcelas: 6,
  parcelasPagas: 3,
  categoria: 'Educação'
}];


// ============================================================================
// ORÇAMENTOS MENSAIS DE EXEMPLO
// ============================================================================
// Limites de gastos por categoria para controle financeiro.
export const orcamentosIniciais = [
{ id: '1', categoria: 'Alimentação', valorTeto: 800, gastoAtual: 570.75, mes: '2024-05' },
{ id: '2', categoria: 'Transporte', valorTeto: 400, gastoAtual: 280, mes: '2024-05' },
{ id: '3', categoria: 'Lazer', valorTeto: 300, gastoAtual: 75, mes: '2024-05' },
{ id: '4', categoria: 'Educação', valorTeto: 200, gastoAtual: 29.90, mes: '2024-05' }];


// ============================================================================
// DADOS MENSAIS PARA GRÁFICOS
// ============================================================================
// Dados agregados para exibição nos gráficos do dashboard.
export const dadosMensaisGrafico = [
{ mes: 'Jan', receitas: 5150, despesas: 4200 },
{ mes: 'Fev', receitas: 5300, despesas: 3800 },
{ mes: 'Mar', receitas: 6800, despesas: 4500 },
{ mes: 'Abr', receitas: 5000, despesas: 4100 },
{ mes: 'Mai', receitas: 6650, despesas: 3105 },
{ mes: 'Jun', receitas: 5500, despesas: 3900 }];