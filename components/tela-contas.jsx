/**
 * ==========================================================================
 * COMPONENTE: Tela de Contas e Cartões
 * ==========================================================================
 * CRUD para gerenciar contas bancárias, poupanças e cartões de crédito.
 * Exibe saldos e informações de fatura dos cartões.
 */

'use client';

import { useState } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Wallet,
  CreditCard,
  Landmark,
  PiggyBank,
  Calendar } from
'lucide-react';
import { cn } from '@/lib/utils';

// Cores disponíveis
const coresDisponiveis = [
{ nome: 'Roxo', valor: '#8B5CF6' },
{ nome: 'Laranja', valor: '#F97316' },
{ nome: 'Verde', valor: '#22C55E' },
{ nome: 'Azul', valor: '#3B82F6' },
{ nome: 'Rosa', valor: '#EC4899' },
{ nome: 'Vermelho', valor: '#EF4444' },
{ nome: 'Ciano', valor: '#06B6D4' }];


// Estado inicial do formulário
const contaVazia = {
  nome: '',
  tipo: 'corrente',
  saldo: 0,
  cor: '#8B5CF6',
  limiteCartao: undefined,
  diaFechamento: undefined,
  diaVencimento: undefined
};

export function TelaContas() {
  // -------------------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // -------------------------------------------------------------------------
  const [modalAberto, setModalAberto] = useState(false);
  const [contaEditando, setContaEditando] = useState(null);
  const [formData, setFormData] = useState(contaVazia);
  const [alertDeletar, setAlertDeletar] = useState(null);

  // Acesso ao contexto global
  const {
    contas,
    adicionarConta,
    editarConta,
    deletarConta
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // FUNÇÕES DE MANIPULAÇÃO
  // -------------------------------------------------------------------------

  const abrirModalNovo = () => {
    setContaEditando(null);
    setFormData(contaVazia);
    setModalAberto(true);
  };

  const abrirModalEditar = (conta) => {
    setContaEditando(conta);
    setFormData({
      nome: conta.nome,
      tipo: conta.tipo,
      saldo: conta.saldo,
      cor: conta.cor,
      limiteCartao: conta.limiteCartao,
      diaFechamento: conta.diaFechamento,
      diaVencimento: conta.diaVencimento
    });
    setModalAberto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (contaEditando) {
      editarConta(contaEditando.id, formData);
    } else {
      adicionarConta(formData);
    }

    setModalAberto(false);
    setFormData(contaVazia);
  };

  const confirmarDeletar = () => {
    if (alertDeletar) {
      deletarConta(alertDeletar);
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

  // Ícone baseado no tipo de conta
  const getIconeConta = (tipo) => {
    switch (tipo) {
      case 'corrente':
        return Landmark;
      case 'poupanca':
        return PiggyBank;
      case 'carteira':
        return Wallet;
      case 'cartao':
        return CreditCard;
      default:
        return Wallet;
    }
  };

  // Calcula saldo total (exceto cartões)
  const saldoTotal = contas.
  filter((c) => c.tipo !== 'cartao').
  reduce((acc, c) => acc + c.saldo, 0);

  // Separa cartões das outras contas
  const contasBancarias = contas.filter((c) => c.tipo !== 'cartao');
  const cartoes = contas.filter((c) => c.tipo === 'cartao');

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C343F]">Contas e Cartões</h1>
          <p className="text-gray-500 text-sm">
            Gerencie seus saldos e faturas
          </p>
        </div>

        <Button
          onClick={abrirModalNovo}
          className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Card de saldo total */}
      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Wallet className="w-5 h-5" />
            Patrimônio Total
          </CardTitle>
          <CardDescription>
            Soma de todas as contas (exceto cartões)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={cn(
            "text-3xl font-bold",
            saldoTotal >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {formatarMoeda(saldoTotal)}
          </p>
        </CardContent>
      </Card>

      {/* Seção: Contas Bancárias */}
      <div>
        <h2 className="text-lg font-semibold text-[#2C343F] mb-4">
          Contas Bancárias
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contasBancarias.map((conta) => {
            const Icon = getIconeConta(conta.tipo);

            return (
              <Card key={conta.id} className="relative overflow-hidden">
                {/* Barra de cor */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: conta.cor }} />
                
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${conta.cor}20` }}>
                        
                        <Icon className="w-5 h-5" style={{ color: conta.cor }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{conta.nome}</CardTitle>
                        <CardDescription className="text-xs capitalize">
                          Conta {conta.tipo}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => abrirModalEditar(conta)}
                        className="h-8 w-8 text-gray-500 hover:text-orange-600">
                        
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setAlertDeletar(conta.id)}
                        className="h-8 w-8 text-gray-500 hover:text-red-600">
                        
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-2xl font-bold",
                    conta.saldo >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatarMoeda(conta.saldo)}
                  </p>
                </CardContent>
              </Card>);

          })}

          {contasBancarias.length === 0 &&
          <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Landmark className="w-10 h-10 mb-2 text-gray-300" />
                <p>Nenhuma conta bancária cadastrada</p>
              </CardContent>
            </Card>
          }
        </div>
      </div>

      {/* Seção: Cartões de Crédito */}
      <div>
        <h2 className="text-lg font-semibold text-[#2C343F] mb-4">
          Cartões de Crédito
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartoes.map((cartao) =>
          <Card key={cartao.id} className="relative overflow-hidden">
              {/* Barra de cor */}
              <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: cartao.cor }} />
            
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${cartao.cor}20` }}>
                    
                      <CreditCard className="w-5 h-5" style={{ color: cartao.cor }} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{cartao.nome}</CardTitle>
                      <CardDescription className="text-xs">
                        Cartão de Crédito
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => abrirModalEditar(cartao)}
                    className="h-8 w-8 text-gray-500 hover:text-orange-600">
                    
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAlertDeletar(cartao.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-600">
                    
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Limite</p>
                    <p className="font-semibold">
                      {formatarMoeda(cartao.limiteCartao || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Disponível</p>
                    <p className="font-semibold text-green-600">
                      {formatarMoeda((cartao.limiteCartao || 0) - cartao.saldo)}
                    </p>
                  </div>
                </div>

                {(cartao.diaFechamento || cartao.diaVencimento) &&
              <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t">
                    {cartao.diaFechamento &&
                <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Fecha dia {cartao.diaFechamento}
                      </div>
                }
                    {cartao.diaVencimento &&
                <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Vence dia {cartao.diaVencimento}
                      </div>
                }
                  </div>
              }
              </CardContent>
            </Card>
          )}

          {cartoes.length === 0 &&
          <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-gray-500">
                <CreditCard className="w-10 h-10 mb-2 text-gray-300" />
                <p>Nenhum cartão cadastrado</p>
              </CardContent>
            </Card>
          }
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {contaEditando ? 'Editar Conta' : 'Nova Conta'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Nubank, Itaú, Bradesco..."
                required />
              
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) => setFormData({
                  ...formData,
                  tipo: v,
                  limiteCartao: v === 'cartao' ? formData.limiteCartao : undefined,
                  diaFechamento: v === 'cartao' ? formData.diaFechamento : undefined,
                  diaVencimento: v === 'cartao' ? formData.diaVencimento : undefined
                })}>
                
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Poupança</SelectItem>
                  <SelectItem value="carteira">Carteira</SelectItem>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Saldo (ou fatura atual para cartão) */}
            <div className="space-y-2">
              <Label htmlFor="saldo">
                {formData.tipo === 'cartao' ? 'Fatura Atual' : 'Saldo'}
              </Label>
              <Input
                id="saldo"
                type="number"
                step="0.01"
                value={formData.saldo || ''}
                onChange={(e) => setFormData({ ...formData, saldo: parseFloat(e.target.value) || 0 })}
                placeholder="0,00" />
              
            </div>

            {/* Campos específicos de cartão */}
            {formData.tipo === 'cartao' &&
            <>
                <div className="space-y-2">
                  <Label htmlFor="limite">Limite do Cartão</Label>
                  <Input
                  id="limite"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.limiteCartao || ''}
                  onChange={(e) => setFormData({ ...formData, limiteCartao: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00" />
                
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechamento">Dia do Fechamento</Label>
                    <Input
                    id="fechamento"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.diaFechamento || ''}
                    onChange={(e) => setFormData({ ...formData, diaFechamento: parseInt(e.target.value) || undefined })}
                    placeholder="Ex: 15" />
                  
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vencimento">Dia do Vencimento</Label>
                    <Input
                    id="vencimento"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.diaVencimento || ''}
                    onChange={(e) => setFormData({ ...formData, diaVencimento: parseInt(e.target.value) || undefined })}
                    placeholder="Ex: 22" />
                  
                  </div>
                </div>
              </>
            }

            {/* Cor */}
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {coresDisponiveis.map((cor) =>
                <button
                  key={cor.valor}
                  type="button"
                  onClick={() => setFormData({ ...formData, cor: cor.valor })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  formData.cor === cor.valor ? 'scale-110 border-gray-800' : 'border-transparent'}`
                  }
                  style={{ backgroundColor: cor.valor }}
                  title={cor.nome} />

                )}
              </div>
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
                
                {contaEditando ? 'Salvar Alterações' : 'Adicionar'}
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
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
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