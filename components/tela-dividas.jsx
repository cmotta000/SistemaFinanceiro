/**
 * ==========================================================================
 * COMPONENTE: Tela de Dívidas e Parcelamentos
 * ==========================================================================
 * CRUD para gerenciar compras parceladas e dívidas.
 * Calcula automaticamente o valor de cada parcela e cria projeção de lançamentos.
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'@/components/ui/table';
import {
  Plus,
  Pencil,
  Trash2,
  CreditCard,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronUp } from
'lucide-react';


// Estado inicial do formulário
const dividaVazia = {
  nome: '',
  valorTotal: 0,
  dataCompra: new Date().toISOString().split('T')[0],
  quantidadeParcelas: 1,
  parcelasPagas: 0,
  categoria: ''
};

export function TelaDividas() {
  // -------------------------------------------------------------------------
  // ESTADOS DO COMPONENTE
  // -------------------------------------------------------------------------
  const [modalAberto, setModalAberto] = useState(false);
  const [dividaEditando, setDividaEditando] = useState(null);
  const [formData, setFormData] = useState(dividaVazia);
  const [alertDeletar, setAlertDeletar] = useState(null);
  const [projecaoAberta, setProjecaoAberta] = useState(null);

  // Acesso ao contexto global
  const {
    dividas,
    adicionarDivida,
    editarDivida,
    deletarDivida,
    pagarParcelaDivida,
    categorias,
    calcularValorResidualDividas,
    calcularDataQuitacaoDividas,
    obterProgressoDivida
  } = useFinanceiro();

  // -------------------------------------------------------------------------
  // FUNÇÕES DE MANIPULAÇÃO
  // -------------------------------------------------------------------------

  const abrirModalNovo = () => {
    setDividaEditando(null);
    setFormData(dividaVazia);
    setModalAberto(true);
  };

  const abrirModalEditar = (divida) => {
    setDividaEditando(divida);
    setFormData({
      nome: divida.nome,
      valorTotal: divida.valorTotal,
      dataCompra: divida.dataCompra,
      quantidadeParcelas: divida.quantidadeParcelas,
      parcelasPagas: divida.parcelasPagas,
      categoria: divida.categoria
    });
    setModalAberto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dividaEditando) {
      editarDivida(dividaEditando.id, formData);
    } else {
      adicionarDivida(formData);
    }

    setModalAberto(false);
    setFormData(dividaVazia);
  };

  const confirmarDeletar = () => {
    if (alertDeletar) {
      deletarDivida(alertDeletar);
      setAlertDeletar(null);
    }
  };

  // -------------------------------------------------------------------------
  // FORMATAÇÃO DE VALORES
  // -------------------------------------------------------------------------
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // -------------------------------------------------------------------------
  // LÓGICA DE PARCELAMENTO MATEMÁTICO DO CARTÃO
  // -------------------------------------------------------------------------
  /**
   * Gera a projeção de parcelas futuras para uma dívida.
   * Calcula automaticamente as datas e valores de cada parcela.
   * 
   * Fórmula:
   *   Valor da Parcela = Valor Total / Quantidade de Parcelas
   *   Data da Parcela N = Data da Compra + N meses
   */
  const gerarProjecaoParcelas = (divida) => {
    const parcelas = [];
    const valorParcela = divida.valorTotal / divida.quantidadeParcelas;
    const dataInicial = new Date(divida.dataCompra);

    for (let i = 1; i <= divida.quantidadeParcelas; i++) {
      const dataParcela = new Date(dataInicial);
      dataParcela.setMonth(dataParcela.getMonth() + i);

      parcelas.push({
        numero: i,
        data: dataParcela.toISOString().split('T')[0],
        valor: valorParcela,
        paga: i <= divida.parcelasPagas
      });
    }

    return parcelas;
  };

  // Métricas calculadas
  const valorResidual = calcularValorResidualDividas();
  const dataQuitacao = calcularDataQuitacaoDividas();

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C343F]">Dívidas e Parcelamentos</h1>
          <p className="text-gray-500 text-sm">
            Controle de cartão e empréstimos
          </p>
        </div>

        <Button
          onClick={abrirModalNovo}
          className="bg-[#0C6A36] hover:bg-[#0a5a2e] text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Nova Dívida
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <CreditCard className="w-5 h-5" />
              Valor Residual Total
            </CardTitle>
            <CardDescription>
              Soma de todas as parcelas pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {formatarMoeda(valorResidual)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-5 h-5" />
              Previsão de Quitação
            </CardTitle>
            <CardDescription>
              Data estimada para zerar as dívidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 capitalize">
              {dataQuitacao}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de dívidas */}
      <div className="space-y-4">
        {dividas.map((divida) => {
          const progresso = obterProgressoDivida(divida.id);
          const valorParcela = divida.valorTotal / divida.quantidadeParcelas;
          const projecao = gerarProjecaoParcelas(divida);
          const estaAberta = projecaoAberta === divida.id;

          return (
            <Card key={divida.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{divida.nome}</CardTitle>
                    <CardDescription>
                      Compra em {formatarData(divida.dataCompra)} • {divida.categoria}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {/* Botão pagar parcela */}
                    {progresso.pagas < progresso.total &&
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => pagarParcelaDivida(divida.id)}
                      className="text-green-600 border-green-300 hover:bg-green-50">
                      
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Pagar Parcela
                      </Button>
                    }
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => abrirModalEditar(divida)}
                      className="h-8 w-8 text-gray-500 hover:text-orange-600">
                      
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setAlertDeletar(divida.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-600">
                      
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informações principais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Valor Total</p>
                    <p className="font-semibold">{formatarMoeda(divida.valorTotal)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valor da Parcela</p>
                    <p className="font-semibold">{formatarMoeda(valorParcela)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Parcelas</p>
                    <p className="font-semibold">
                      {progresso.pagas} de {progresso.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Restante</p>
                    <p className="font-semibold text-orange-600">
                      {formatarMoeda(valorParcela * (progresso.total - progresso.pagas))}
                    </p>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso de quitação</span>
                    <span className="font-medium text-[#0C6A36]">{progresso.percentual}%</span>
                  </div>
                  <Progress value={progresso.percentual} className="h-2" />
                </div>

                {/* Botão para expandir projeção */}
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-800"
                  onClick={() => setProjecaoAberta(estaAberta ? null : divida.id)}>
                  
                  {estaAberta ?
                  <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Ocultar Projeção de Parcelas
                    </> :

                  <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Ver Projeção de Parcelas
                    </>
                  }
                </Button>

                {/* CÁLCULO DE PROJEÇÃO DE FIM DE DÍVIDAS */}
                {/* Tabela de projeção de parcelas */}
                {estaAberta &&
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parcela</TableHead>
                          <TableHead>Data Prevista</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projecao.map((parcela) =>
                      <TableRow
                        key={parcela.numero}
                        className={parcela.paga ? 'bg-green-50' : ''}>
                        
                            <TableCell className="font-medium">
                              {parcela.numero}/{divida.quantidadeParcelas}
                            </TableCell>
                            <TableCell>{formatarData(parcela.data)}</TableCell>
                            <TableCell>{formatarMoeda(parcela.valor)}</TableCell>
                            <TableCell>
                              {parcela.paga ?
                          <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Paga
                                </span> :

                          <span className="text-orange-600">Pendente</span>
                          }
                            </TableCell>
                          </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  </div>
                }
              </CardContent>
            </Card>);

        })}

        {dividas.length === 0 &&
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mb-3 text-green-500" />
              <p className="font-medium">Parabéns! Você não possui dívidas.</p>
              <Button
              variant="link"
              onClick={abrirModalNovo}
              className="text-[#0C6A36]">
              
                Registrar uma compra parcelada
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
              {dividaEditando ? 'Editar Dívida' : 'Nova Dívida'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome da Dívida */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Dívida</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: iPhone 15, Sofá, Notebook..."
                required />
              
            </div>

            {/* Valor Total */}
            <div className="space-y-2">
              <Label htmlFor="valorTotal">Valor Total</Label>
              <Input
                id="valorTotal"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorTotal || ''}
                onChange={(e) => setFormData({ ...formData, valorTotal: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required />
              
            </div>

            {/* Data da Compra */}
            <div className="space-y-2">
              <Label htmlFor="dataCompra">Data da Compra</Label>
              <Input
                id="dataCompra"
                type="date"
                value={formData.dataCompra}
                onChange={(e) => setFormData({ ...formData, dataCompra: e.target.value })}
                required />
              
            </div>

            {/* Quantidade de Parcelas */}
            <div className="space-y-2">
              <Label htmlFor="parcelas">Quantidade de Parcelas</Label>
              <Input
                id="parcelas"
                type="number"
                min="1"
                max="48"
                value={formData.quantidadeParcelas || ''}
                onChange={(e) => setFormData({ ...formData, quantidadeParcelas: parseInt(e.target.value) || 1 })}
                required />
              
              {/* Preview do valor da parcela */}
              {formData.valorTotal > 0 && formData.quantidadeParcelas > 0 &&
              <p className="text-sm text-gray-500">
                  Valor de cada parcela: {formatarMoeda(formData.valorTotal / formData.quantidadeParcelas)}
                </p>
              }
            </div>

            {/* Parcelas já pagas (apenas na edição) */}
            {dividaEditando &&
            <div className="space-y-2">
                <Label htmlFor="parcelasPagas">Parcelas já Pagas</Label>
                <Input
                id="parcelasPagas"
                type="number"
                min="0"
                max={formData.quantidadeParcelas}
                value={formData.parcelasPagas || 0}
                onChange={(e) => setFormData({ ...formData, parcelasPagas: parseInt(e.target.value) || 0 })} />
              
              </div>
            }

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
                  {categorias.map((cat) =>
                  <SelectItem key={cat.id} value={cat.nome}>
                      {cat.nome}
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
                
                {dividaEditando ? 'Salvar Alterações' : 'Adicionar'}
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
              Tem certeza que deseja excluir esta dívida? Esta ação não pode ser desfeita.
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