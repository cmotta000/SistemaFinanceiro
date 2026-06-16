/**
 * ==========================================================================
 * COMPONENTE: Tela de Orçamentos
 * ==========================================================================
 * CRUD para definir limites de gastos mensais por categoria.
 * Alerta visualmente se os gastos ultrapassarem o teto definido.
 */

'use client';

import { useState } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  Pencil,
  Trash2,
  Target,
  AlertTriangle,
  CheckCircle2 } from
'lucide-react';
import { cn } from '@/lib/utils';

// Estado inicial do formulário
const orcamentoVazio = {
  categoria: '',
  valorTeto: 0,
  gastoAtual: 0,
  mes: new Date().toISOString().slice(0, 7)
};

export function TelaOrcamentos() {
  // -------------------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // -------------------------------------------------------------------------
  const [modalAberto, setModalAberto] = useState(false);
  const [orcamentoEditando, setOrcamentoEditando] = useState(null);
  const [formData, setFormData] = useState(orcamentoVazio);
  const [alertDeletar, setAlertDeletar] = useState(null);

  // Acesso ao contexto global
  const {
    orcamentos,
    adicionarOrcamento,
    editarOrcamento,
    deletarOrcamento,
    categorias,
    calcularGastoPorCategoria
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // FUNÇÕES DE MANIPULAÇÃO
  // -------------------------------------------------------------------------

  const abrirModalNovo = () => {
    setOrcamentoEditando(null);
    setFormData(orcamentoVazio);
    setModalAberto(true);
  };

  const abrirModalEditar = (orcamento) => {
    setOrcamentoEditando(orcamento);
    setFormData({
      categoria: orcamento.categoria,
      valorTeto: orcamento.valorTeto,
      gastoAtual: orcamento.gastoAtual,
      mes: orcamento.mes
    });
    setModalAberto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // CONTROLE DE TETO DO ORÇAMENTO POR CATEGORIA
    // Calcula o gasto atual da categoria para preencher automaticamente
    const gastoCalculado = calcularGastoPorCategoria(formData.categoria);

    if (orcamentoEditando) {
      editarOrcamento(orcamentoEditando.id, {
        ...formData,
        gastoAtual: gastoCalculado
      });
    } else {
      adicionarOrcamento({
        ...formData,
        gastoAtual: gastoCalculado
      });
    }

    setModalAberto(false);
    setFormData(orcamentoVazio);
  };

  const confirmarDeletar = () => {
    if (alertDeletar) {
      deletarOrcamento(alertDeletar);
      setAlertDeletar(null);
    }
  };

  // Formatação de moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Filtra categorias de despesa disponíveis
  const categoriasDespesa = categorias.filter((c) => c.tipo === 'despesa' || c.tipo === 'ambos');

  // Calcula totais
  const totalTeto = orcamentos.reduce((acc, o) => acc + o.valorTeto, 0);
  const totalGasto = orcamentos.reduce((acc, o) => acc + o.gastoAtual, 0);
  const percentualGeralUsado = totalTeto > 0 ? totalGasto / totalTeto * 100 : 0;

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C343F]">Orçamentos</h1>
          <p className="text-gray-500 text-sm">
            Defina limites de gastos por categoria
          </p>
        </div>

        <Button
          onClick={abrirModalNovo}
          className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Card de resumo geral */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Target className="w-5 h-5" />
            Resumo do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Orçado</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatarMoeda(totalTeto)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Gasto</p>
              <p className={cn(
                "text-2xl font-bold",
                totalGasto > totalTeto ? "text-red-600" : "text-green-600"
              )}>
                {formatarMoeda(totalGasto)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uso geral do orçamento</span>
              <span className="font-medium">{Math.round(percentualGeralUsado)}%</span>
            </div>
            <Progress
              value={Math.min(percentualGeralUsado, 100)}
              className={cn(
                "h-3",
                percentualGeralUsado > 100 && "[&>div]:bg-red-500"
              )} />
            
          </div>
        </CardContent>
      </Card>

      {/* Lista de orçamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orcamentos.map((orcamento) => {
          // CONTROLE DE TETO DO ORÇAMENTO POR CATEGORIA
          const percentualUsado = orcamento.gastoAtual / orcamento.valorTeto * 100;
          const ultrapassou = orcamento.gastoAtual > orcamento.valorTeto;
          const restante = orcamento.valorTeto - orcamento.gastoAtual;

          return (
            <Card
              key={orcamento.id}
              className={cn(
                "relative overflow-hidden",
                ultrapassou && "border-red-300 bg-red-50/30"
              )}>
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {orcamento.categoria}
                      {/* Alerta visual se ultrapassou */}
                      {ultrapassou &&
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      }
                    </CardTitle>
                    <CardDescription>
                      Limite: {formatarMoeda(orcamento.valorTeto)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => abrirModalEditar(orcamento)}
                      className="h-8 w-8 text-gray-500 hover:text-orange-600">
                      
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setAlertDeletar(orcamento.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-600">
                      
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Valores */}
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-sm text-gray-500">Gasto</p>
                    <p className={cn(
                      "text-xl font-bold",
                      ultrapassou ? "text-red-600" : "text-gray-800"
                    )}>
                      {formatarMoeda(orcamento.gastoAtual)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Disponível</p>
                    <p className={cn(
                      "text-lg font-semibold",
                      restante < 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {formatarMoeda(restante)}
                    </p>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="space-y-1">
                  <Progress
                    value={Math.min(percentualUsado, 100)}
                    className={cn(
                      "h-2",
                      ultrapassou && "[&>div]:bg-red-500",
                      percentualUsado > 80 && percentualUsado <= 100 && "[&>div]:bg-yellow-500"
                    )} />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(percentualUsado)}% utilizado</span>
                    {ultrapassou &&
                    <span className="text-red-600 font-medium">
                        Excedido em {formatarMoeda(Math.abs(restante))}
                      </span>
                    }
                  </div>
                </div>

                {/* Status visual */}
                {!ultrapassou && percentualUsado <= 80 &&
                <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Dentro do limite
                  </div>
                }
                {!ultrapassou && percentualUsado > 80 &&
                <div className="flex items-center gap-1 text-yellow-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Atenção: próximo do limite
                  </div>
                }
                {ultrapassou &&
                <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Limite excedido!
                  </div>
                }
              </CardContent>
            </Card>);

        })}

        {orcamentos.length === 0 &&
        <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Target className="w-12 h-12 mb-3 text-gray-300" />
              <p>Nenhum orçamento cadastrado</p>
              <Button
              variant="link"
              onClick={abrirModalNovo}
              className="text-[#0C6A36]">
              
                Definir primeiro limite
              </Button>
            </CardContent>
          </Card>
        }
      </div>

      {/* Modal de cadastro/edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {orcamentoEditando ? 'Editar Orçamento' : 'Novo Orçamento'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  {categoriasDespesa.map((cat) =>
                  <SelectItem key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Valor Teto */}
            <div className="space-y-2">
              <Label htmlFor="valorTeto">Valor Limite (Teto)</Label>
              <Input
                id="valorTeto"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorTeto || ''}
                onChange={(e) => setFormData({ ...formData, valorTeto: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 500,00"
                required />
              
              <p className="text-xs text-gray-500">
                Valor máximo que você planeja gastar nesta categoria
              </p>
            </div>

            {/* Mês de Referência */}
            <div className="space-y-2">
              <Label htmlFor="mes">Mês de Referência</Label>
              <Input
                id="mes"
                type="month"
                value={formData.mes}
                onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                required />
              
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
                
                {orcamentoEditando ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!alertDeletar} onOpenChange={() => setAlertDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
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