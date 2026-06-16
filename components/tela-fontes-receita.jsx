/**
 * ==========================================================================
 * COMPONENTE: Tela de Fontes de Receita
 * ==========================================================================
 * CRUD para gerenciar as origens do dinheiro (Salário, Freelance, etc).
 * Campos: Nome da Fonte, Tipo (Mensal/Variável) e Valor Estimado.
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
  DollarSign,
  RefreshCw,
  CalendarDays } from
'lucide-react';

// ============================================================================
// CORES DISPONÍVEIS PARA AS FONTES
// ============================================================================
const coresDisponiveis = [
{ nome: 'Verde', valor: '#10B981' },
{ nome: 'Azul', valor: '#3B82F6' },
{ nome: 'Roxo', valor: '#8B5CF6' },
{ nome: 'Rosa', valor: '#EC4899' },
{ nome: 'Laranja', valor: '#F97316' },
{ nome: 'Amarelo', valor: '#EAB308' },
{ nome: 'Ciano', valor: '#06B6D4' }];


// Estado inicial do formulário
const fonteVazia = {
  nome: '',
  tipo: 'mensal',
  valorEstimado: 0,
  cor: '#10B981'
};

export function TelaFontesReceita() {
  // -------------------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // -------------------------------------------------------------------------
  const [modalAberto, setModalAberto] = useState(false);
  const [fonteEditando, setFonteEditando] = useState(null);
  const [formData, setFormData] = useState(fonteVazia);
  const [alertDeletar, setAlertDeletar] = useState(null);

  // Acesso ao contexto global
  const {
    fontesReceita,
    adicionarFonteReceita,
    editarFonteReceita,
    deletarFonteReceita
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // FUNÇÕES DE MANIPULAÇÃO
  // -------------------------------------------------------------------------

  const abrirModalNovo = () => {
    setFonteEditando(null);
    setFormData(fonteVazia);
    setModalAberto(true);
  };

  const abrirModalEditar = (fonte) => {
    setFonteEditando(fonte);
    setFormData({
      nome: fonte.nome,
      tipo: fonte.tipo,
      valorEstimado: fonte.valorEstimado,
      cor: fonte.cor
    });
    setModalAberto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fonteEditando) {
      editarFonteReceita(fonteEditando.id, formData);
    } else {
      adicionarFonteReceita(formData);
    }

    setModalAberto(false);
    setFormData(fonteVazia);
  };

  const confirmarDeletar = () => {
    if (alertDeletar) {
      deletarFonteReceita(alertDeletar);
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

  // Calcula total estimado de receitas
  const totalEstimado = fontesReceita.reduce((acc, f) => acc + f.valorEstimado, 0);

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C343F]">Fontes de Receita</h1>
          <p className="text-gray-500 text-sm">
            Gerencie suas origens de renda
          </p>
        </div>

        <Button
          onClick={abrirModalNovo}
          className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Nova Fonte
        </Button>
      </div>

      {/* Card de resumo */}
      <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="w-5 h-5" />
            Receita Mensal Estimada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">
            {formatarMoeda(totalEstimado)}
          </p>
        </CardContent>
      </Card>

      {/* Lista de fontes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fontesReceita.map((fonte) =>
        <Card key={fonte.id} className="relative overflow-hidden">
            {/* Barra de cor à esquerda */}
            <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: fonte.cor }} />
          
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{fonte.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    {fonte.tipo === 'mensal' ?
                  <>
                        <CalendarDays className="w-3 h-3" />
                        Renda Fixa Mensal
                      </> :

                  <>
                        <RefreshCw className="w-3 h-3" />
                        Renda Variável
                      </>
                  }
                  </CardDescription>
                </div>
                {/* Botões de ação */}
                <div className="flex gap-1">
                  <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => abrirModalEditar(fonte)}
                  className="h-8 w-8 text-gray-500 hover:text-orange-600">
                  
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setAlertDeletar(fonte.id)}
                  className="h-8 w-8 text-gray-500 hover:text-red-600">
                  
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" style={{ color: fonte.cor }}>
                {formatarMoeda(fonte.valorEstimado)}
              </p>
            </CardContent>
          </Card>
        )}

        {fontesReceita.length === 0 &&
        <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mb-3 text-gray-300" />
              <p>Nenhuma fonte de receita cadastrada</p>
              <Button
              variant="link"
              onClick={abrirModalNovo}
              className="text-[#0C6A36]">
              
                Adicionar primeira fonte
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
              {fonteEditando ? 'Editar Fonte de Receita' : 'Nova Fonte de Receita'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome da Fonte */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Fonte</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Salário, Freelance, Dividendos..."
                required />
              
            </div>

            {/* Tipo (Mensal/Variável) */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal (Renda Fixa)</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor Estimado */}
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Estimado</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorEstimado || ''}
                onChange={(e) => setFormData({ ...formData, valorEstimado: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required />
              
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label>Cor de Identificação</Label>
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
                
                {fonteEditando ? 'Salvar Alterações' : 'Adicionar'}
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
              Tem certeza que deseja excluir esta fonte de receita? Esta ação não pode ser desfeita.
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