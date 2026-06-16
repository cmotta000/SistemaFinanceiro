/**
 * ==========================================================================
 * COMPONENTE: Tela de Login
 * ==========================================================================
 * Tela inicial minimalista com validação de campos simples.
 * Simula o login e redireciona para o app principal.
 */

'use client';

import { useState } from 'react';
import { useFinanceiro } from '@/lib/financeiro-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { RodapeBootstrap } from '@/components/rodape-bootstrap';

export function TelaLogin() {
  // -------------------------------------------------------------------------
  // ESTADO LOCAL DO FORMULÁRIO
  // -------------------------------------------------------------------------
  const [email, setEmail] = useState(''); // Armazena o email digitado
  const [senha, setSenha] = useState(''); // Armazena a senha digitada
  const [mostrarSenha, setMostrarSenha] = useState(false); // Toggle visibilidade
  const [erro, setErro] = useState(''); // Mensagem de erro de validação
  const [carregando, setCarregando] = useState(false); // Estado de loading

  // Acesso à função de login do contexto global
  const { login } = useFinanceiro();

  // -------------------------------------------------------------------------
  // VALIDAÇÃO E SUBMISSÃO DO FORMULÁRIO
  // -------------------------------------------------------------------------

  /**
   * Processa o envio do formulário de login.
   * Realiza validações básicas antes de tentar autenticar.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validação de campos obrigatórios
    if (!email.trim()) {
      setErro('Por favor, insira seu e-mail');
      return;
    }

    // Validação de formato de e-mail (regex simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro('Por favor, insira um e-mail válido');
      return;
    }

    // Validação de senha mínima
    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    // Simula delay de autenticação para UX
    setCarregando(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Tenta realizar o login através do contexto
    const sucesso = login(email, senha);

    if (!sucesso) {
      setErro('Credenciais inválidas. Tente novamente.');
    }

    setCarregando(false);
  };

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO DA INTERFACE
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          {/* Logo/Ícone do Sistema */}
          <div className="mx-auto w-16 h-16 bg-[#0C6A36] rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold text-[#2C343F]">
              Gestão Financeira
            </CardTitle>
            <CardDescription className="text-gray-500">
              Entre para gerenciar suas finanças
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2C343F]">
                E-mail
              </Label>
              <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={carregando} />
                
            </div>

            {/* Campo de Senha com Toggle de Visibilidade */}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-[#2C343F]">
                Senha
              </Label>
              <div className="relative">
                <Input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-11 pr-10"
                    disabled={carregando} />
                  
                {/* Botão para mostrar/ocultar senha */}
                <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}>
                    
                  {mostrarSenha ?
                    <EyeOff className="w-5 h-5" /> :

                    <Eye className="w-5 h-5" />
                    }
                </button>
              </div>
            </div>

            {/* Exibição de Mensagem de Erro */}
            {erro &&
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
              }

            {/* Botão de Submissão */}
            <Button
                type="submit"
                className="w-full h-11 bg-[#0C6A36] hover:bg-[#0a5a2e] text-white"
                disabled={carregando}>
                
              {carregando ?
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span> :

                'Entrar'
                }
            </Button>

            {/* Dica para demonstração */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Use qualquer e-mail válido e senha com 4+ caracteres para entrar
            </p>
          </form>
        </CardContent>
      </Card>
      </div>
      <RodapeBootstrap />
    </div>);

}