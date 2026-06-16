/**
 * ==========================================================================
 * COMPONENTE: Tela de Transações (CRUD Principal)
 * ==========================================================================
 * Tela principal com tabela zebrada de transações.
 * Inclui botões de ação: Recibo, Anexo, Editar e Deletar.
 * Modal para adicionar/editar transações.
 */

'use client';

import { useState, useMemo } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
'@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'@/components/ui/alert-dialog';
import {
  Plus,
  Receipt,
  Paperclip,
  Pencil,
  Trash2,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter } from
'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// ESTADO INICIAL DO FORMULÁRIO DE TRANSAÇÃO
// ============================================================================
const transacaoVazia = {
  descricao: '',
  valor: 0,
  tipo: 'despesa',
  categoria: '',
  data: new Date().toISOString().split('T')[0],
  fonteReceitaId: '',
  contaId: ''
};

export function TelaTransacoes() {
  // -------------------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // -------------------------------------------------------------------------
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);
  const [formData, setFormData] = useState(transacaoVazia);
  const [alertDeletar, setAlertDeletar] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Acesso ao contexto global
  const {
    transacoes,
    adicionarTransacao,
    editarTransacao,
    deletarTransacao,
    categorias,
    fontesReceita,
    contas
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // FILTRAGEM E BUSCA DE TRANSAÇÕES
  // -------------------------------------------------------------------------
  // Filtra as transações baseado na busca e tipo selecionado
  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter((t) => {
      // Filtro por texto (descrição ou categoria)
      const matchBusca = busca === '' ||
      t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      t.categoria.toLowerCase().includes(busca.toLowerCase());

      // Filtro por tipo (receita/despesa)
      const matchTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;

      return matchBusca && matchTipo;
    });
  }, [transacoes, busca, filtroTipo]);

  // -------------------------------------------------------------------------
  // FUNÇÕES DE MANIPULAÇÃO DO FORMULÁRIO
  // -------------------------------------------------------------------------

  /**
   * Abre o modal para criar uma nova transação.
   * Reseta o formulário para valores vazios.
   */
  const abrirModalNovo = () => {
    setTransacaoEditando(null);
    setFormData(transacaoVazia);
    setModalAberto(true);
  };

  /**
   * Abre o modal para editar uma transação existente.
   * Preenche o formulário com os dados da transação.
   */
  const abrirModalEditar = (transacao) => {
    setTransacaoEditando(transacao);
    setFormData({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoria: transacao.categoria,
      data: transacao.data,
      fonteReceitaId: transacao.fonteReceitaId || '',
      contaId: transacao.contaId || ''
    });
    setModalAberto(true);
  };

  /**
   * Processa a submissão do formulário.
   * Cria nova transação ou atualiza existente.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDAÇÃO: Se for receita, obriga seleção de fonte de receita
    if (formData.tipo === 'receita' && !formData.fonteReceitaId) {
      alert('Para receitas, selecione uma Fonte de Receita');
      return;
    }

    if (transacaoEditando) {
      // Atualiza transação existente - atualização reativa instantânea
      editarTransacao(transacaoEditando.id, formData);
    } else {
      // Cria nova transação
      adicionarTransacao(formData);
    }

    setModalAberto(false);
    setFormData(transacaoVazia);
  };

  /**
   * Confirma e executa a deleção de uma transação.
   * A interface é atualizada reativamente de forma instantânea.
   */
  const confirmarDeletar = () => {
    if (alertDeletar) {
      deletarTransacao(alertDeletar);
      setAlertDeletar(null);
    }
  };

  // Filtra categorias baseado no tipo selecionado
  const categoriasDisponiveis = categorias.filter(
    (c) => c.tipo === 'ambos' || c.tipo === formData.tipo
  );

  // -------------------------------------------------------------------------
  // FORMATAÇÃO DE VALORES
  // -------------------------------------------------------------------------

  /**
   * Formata um número para moeda brasileira.
   */
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  /**
   * Formata uma data ISO para formato brasileiro.
   */
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO DA INTERFACE
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C343F]">Transações</h1>
          <p className="text-gray-500 text-sm">
            Gerencie suas receitas e despesas
          </p>
        </div>

        {/* Botão Nova Transação - canto superior direito */}
        <Button
          onClick={abrirModalNovo}
          className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Card com filtros e tabela */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Campo de busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar transações..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10" />
              
            </div>

            {/* Filtro por tipo */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select
                value={filtroTipo}
                onValueChange={(v) => setFiltroTipo(v)}>
                
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="receita">Receitas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* ============================================================ */}
          {/* TABELA ZEBRADA DE TRANSAÇÕES                                 */}
          {/* ============================================================ */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.length === 0 ?
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow> :

                transacoesFiltradas.map((transacao, index) =>
                <TableRow
                  key={transacao.id}
                  // Estilo zebrado: linhas alternadas com cores diferentes
                  className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                  
                      <TableCell className="font-medium">
                        {formatarData(transacao.data)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* Ícone indicando tipo */}
                          {transacao.tipo === 'receita' ?
                      <ArrowUpCircle className="w-4 h-4 text-green-500 shrink-0" /> :

                      <ArrowDownCircle className="w-4 h-4 text-red-500 shrink-0" />
                      }
                          <span className="truncate max-w-[200px]">
                            {transacao.descricao}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {transacao.categoria}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                      className={cn(
                        'font-semibold',
                        transacao.tipo === 'receita' ?
                        'text-green-600' :
                        'text-red-600'
                      )}>
                      
                          {transacao.tipo === 'receita' ? '+' : '-'}
                          {formatarMoeda(transacao.valor)}
                        </span>
                      </TableCell>
                      {/* ================================================ */}
                      {/* COLUNA DE AÇÕES - 4 botões horizontais em bloco  */}
                      {/* ================================================ */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {/* Botão Recibo - Verde */}
                          <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                        onClick={() => alert('Funcionalidade de recibo')}>
                        
                            <Receipt className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Recibo</span>
                          </Button>

                          {/* Botão Anexo - Branco com borda fina */}
                          <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 border-gray-300"
                        onClick={() => alert('Funcionalidade de anexo')}>
                        
                            <Paperclip className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Anexo</span>
                          </Button>

                          {/* Botão Editar - Laranja */}
                          <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white h-8 px-2"
                        onClick={() => abrirModalEditar(transacao)}>
                        
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Editar</span>
                          </Button>

                          {/* Botão Deletar - Vermelho */}
                          <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white h-8 px-2"
                        onClick={() => setAlertDeletar(transacao.id)}>
                        
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Deletar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                )
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* MODAL DE NOVA/EDITAR TRANSAÇÃO                                    */}
      {/* ================================================================== */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {transacaoEditando ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo da transação */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) => setFormData({
                  ...formData,
                  tipo: v,
                  categoria: '',
                  fonteReceitaId: ''
                })}>
                
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Salário, Supermercado..."
                required />
              
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor || ''}
                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required />
              
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required />
              
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
                
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasDisponiveis.map((cat) =>
                  <SelectItem key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Fonte de Receita - OBRIGATÓRIO SE TIPO = RECEITA */}
            {formData.tipo === 'receita' &&
            <div className="space-y-2">
                <Label>
                  Fonte de Receita <span className="text-red-500">*</span>
                </Label>
                <Select
                value={formData.fonteReceitaId}
                onValueChange={(v) => setFormData({ ...formData, fonteReceitaId: v })}>
                
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontesReceita.map((fonte) =>
                  <SelectItem key={fonte.id} value={fonte.id}>
                        {fonte.nome}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>
            }

            {/* Conta */}
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select
                value={formData.contaId}
                onValueChange={(v) => setFormData({ ...formData, contaId: v })}>
                
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {contas.map((conta) =>
                  <SelectItem key={conta.id} value={conta.id}>
                      {conta.nome}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalAberto(false)}>
                
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
                
                {transacaoEditando ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================================================================== */}
      {/* DIALOG DE CONFIRMAÇÃO DE DELEÇÃO                                  */}
      {/* ================================================================== */}
      <AlertDialog open={!!alertDeletar} onOpenChange={() => setAlertDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarDeletar}
              className="bg-red-600 hover:bg-red-700">
              
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);

}