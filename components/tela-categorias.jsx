/**
 * ==========================================================================
 * COMPONENTE: Tela de Categorias
 * ==========================================================================
 * CRUD para customização de categorias com tags, ícones e cores.
 * Permite criar categorias personalizadas para organizar transações.
 */

'use client';

import { useState } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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

  Utensils,
  Car,
  Home,
  Heart,
  GraduationCap,
  Gamepad2,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
  ShoppingCart,
  Plane,
  Smartphone,
  Tv,
  Coffee,
  Gift } from
'lucide-react';

// ============================================================================
// ÍCONES DISPONÍVEIS
// ============================================================================
const iconesDisponiveis = [
{ nome: 'Utensils', componente: Utensils, label: 'Talheres' },
{ nome: 'Car', componente: Car, label: 'Carro' },
{ nome: 'Home', componente: Home, label: 'Casa' },
{ nome: 'Heart', componente: Heart, label: 'Coração' },
{ nome: 'GraduationCap', componente: GraduationCap, label: 'Educação' },
{ nome: 'Gamepad2', componente: Gamepad2, label: 'Games' },
{ nome: 'Briefcase', componente: Briefcase, label: 'Trabalho' },
{ nome: 'Laptop', componente: Laptop, label: 'Tecnologia' },
{ nome: 'TrendingUp', componente: TrendingUp, label: 'Investimento' },
{ nome: 'ShoppingCart', componente: ShoppingCart, label: 'Compras' },
{ nome: 'Plane', componente: Plane, label: 'Viagem' },
{ nome: 'Smartphone', componente: Smartphone, label: 'Celular' },
{ nome: 'Tv', componente: Tv, label: 'TV' },
{ nome: 'Coffee', componente: Coffee, label: 'Café' },
{ nome: 'Gift', componente: Gift, label: 'Presente' },
{ nome: 'MoreHorizontal', componente: MoreHorizontal, label: 'Outros' }];


// Cores disponíveis
const coresDisponiveis = [
{ nome: 'Verde', valor: '#22C55E' },
{ nome: 'Azul', valor: '#3B82F6' },
{ nome: 'Roxo', valor: '#8B5CF6' },
{ nome: 'Vermelho', valor: '#EF4444' },
{ nome: 'Laranja', valor: '#F97316' },
{ nome: 'Rosa', valor: '#EC4899' },
{ nome: 'Amarelo', valor: '#EAB308' },
{ nome: 'Ciano', valor: '#06B6D4' },
{ nome: 'Cinza', valor: '#6B7280' }];


// Estado inicial
const categoriaVazia = {
  nome: '',
  cor: '#22C55E',
  icone: 'Utensils',
  tipo: 'despesa'
};

export function TelaCategorias() {
  // -------------------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // -------------------------------------------------------------------------
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formData, setFormData] = useState(categoriaVazia);
  const [alertDeletar, setAlertDeletar] = useState(null);

  // Acesso ao contexto global
  const {
    categorias,
    adicionarCategoria,
    editarCategoria,
    deletarCategoria
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // FUNÇÕES DE MANIPULAÇÃO
  // -------------------------------------------------------------------------

  const abrirModalNovo = () => {
    setCategoriaEditando(null);
    setFormData(categoriaVazia);
    setModalAberto(true);
  };

  const abrirModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setFormData({
      nome: categoria.nome,
      cor: categoria.cor,
      icone: categoria.icone,
      tipo: categoria.tipo
    });
    setModalAberto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (categoriaEditando) {
      editarCategoria(categoriaEditando.id, formData);
    } else {
      adicionarCategoria(formData);
    }

    setModalAberto(false);
    setFormData(categoriaVazia);
  };

  const confirmarDeletar = () => {
    if (alertDeletar) {
      deletarCategoria(alertDeletar);
      setAlertDeletar(null);
    }
  };

  // Obtém o componente de ícone pelo nome
  const getIconeComponente = (nomeIcone) => {
    const icone = iconesDisponiveis.find((i) => i.nome === nomeIcone);
    return icone?.componente || MoreHorizontal;
  };

  // Separa categorias por tipo
  const categoriasReceita = categorias.filter((c) => c.tipo === 'receita');
  const categoriasDespesa = categorias.filter((c) => c.tipo === 'despesa');
  const categoriasAmbos = categorias.filter((c) => c.tipo === 'ambos');

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C343F]">Categorias</h1>
          <p className="text-gray-500 text-sm">
            Customize suas categorias com tags, ícones e cores
          </p>
        </div>

        <Button
          onClick={abrirModalNovo}
          className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Seção: Categorias de Receita */}
      <div>
        <h2 className="text-lg font-semibold text-[#2C343F] mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          Categorias de Receita
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categoriasReceita.map((categoria) => {
            const Icone = getIconeComponente(categoria.icone);

            return (
              <Card key={categoria.id} className="group relative">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${categoria.cor}20` }}>
                    
                    <Icone className="w-5 h-5" style={{ color: categoria.cor }} />
                  </div>
                  <span className="font-medium text-sm truncate">{categoria.nome}</span>
                </CardContent>
                
                {/* Botões de ação - aparecem no hover */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => abrirModalEditar(categoria)}
                    className="h-7 w-7 text-gray-500 hover:text-orange-600">
                    
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAlertDeletar(categoria.id)}
                    className="h-7 w-7 text-gray-500 hover:text-red-600">
                    
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>);

          })}
          
          {categoriasReceita.length === 0 &&
          <p className="col-span-full text-gray-500 text-sm">
              Nenhuma categoria de receita
            </p>
          }
        </div>
      </div>

      {/* Seção: Categorias de Despesa */}
      <div>
        <h2 className="text-lg font-semibold text-[#2C343F] mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Categorias de Despesa
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categoriasDespesa.map((categoria) => {
            const Icone = getIconeComponente(categoria.icone);

            return (
              <Card key={categoria.id} className="group relative">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${categoria.cor}20` }}>
                    
                    <Icone className="w-5 h-5" style={{ color: categoria.cor }} />
                  </div>
                  <span className="font-medium text-sm truncate">{categoria.nome}</span>
                </CardContent>
                
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => abrirModalEditar(categoria)}
                    className="h-7 w-7 text-gray-500 hover:text-orange-600">
                    
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAlertDeletar(categoria.id)}
                    className="h-7 w-7 text-gray-500 hover:text-red-600">
                    
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>);

          })}
          
          {categoriasDespesa.length === 0 &&
          <p className="col-span-full text-gray-500 text-sm">
              Nenhuma categoria de despesa
            </p>
          }
        </div>
      </div>

      {/* Seção: Categorias Ambas */}
      {categoriasAmbos.length > 0 &&
      <div>
          <h2 className="text-lg font-semibold text-[#2C343F] mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            Categorias Gerais
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {categoriasAmbos.map((categoria) => {
            const Icone = getIconeComponente(categoria.icone);

            return (
              <Card key={categoria.id} className="group relative">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${categoria.cor}20` }}>
                    
                      <Icone className="w-5 h-5" style={{ color: categoria.cor }} />
                    </div>
                    <span className="font-medium text-sm truncate">{categoria.nome}</span>
                  </CardContent>
                  
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => abrirModalEditar(categoria)}
                    className="h-7 w-7 text-gray-500 hover:text-orange-600">
                    
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAlertDeletar(categoria.id)}
                    className="h-7 w-7 text-gray-500 hover:text-red-600">
                    
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>);

          })}
          </div>
        </div>
      }

      {/* Modal de cadastro/edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Alimentação, Salário..."
                required />
              
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ícone */}
            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                {iconesDisponiveis.map((icone) => {
                  const Componente = icone.componente;
                  return (
                    <button
                      key={icone.nome}
                      type="button"
                      onClick={() => setFormData({ ...formData, icone: icone.nome })}
                      className={`p-2 rounded transition-colors ${
                      formData.icone === icone.nome ?
                      'bg-[#0C6A36] text-white' :
                      'hover:bg-gray-100'}`
                      }
                      title={icone.label}>
                      
                      <Componente className="w-5 h-5" />
                    </button>);

                })}
              </div>
            </div>

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

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${formData.cor}20` }}>
                  
                  {(() => {
                    const Icone = getIconeComponente(formData.icone);
                    return <Icone className="w-5 h-5" style={{ color: formData.cor }} />;
                  })()}
                </div>
                <span className="font-medium">{formData.nome || 'Nome da categoria'}</span>
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
                
                {categoriaEditando ? 'Salvar Alterações' : 'Adicionar'}
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
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
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