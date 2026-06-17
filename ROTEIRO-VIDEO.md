# Roteiro do Vídeo de Apresentação (2 pessoas)

> ℹ️ **Sobre o Bootstrap**: o projeto usa **Tailwind CSS + shadcn/ui** como base de estilização, e agora também tem o **framework Bootstrap 5** instalado (`npm install bootstrap`), com o CSS importado em `app/layout.jsx`. O Bootstrap é usado no rodapé (`components/rodape-bootstrap.jsx`), visível em todas as telas — login e telas internas. Os dois frameworks convivem no mesmo projeto.

## Checklist do vídeo

- [ ] Bootstrap (framework CSS instalado e em uso) — **Luís**
- [ ] Telas HTML estáticas (`html-templates/`) — **Luís**
- [ ] Rotas / navegação entre telas — **Luís**
- [ ] CRUD 1 — Transações — **Luís**
- [ ] CRUD 2 — Contas e Cartões — **Luís**
- [ ] Estrutura de formulário (HTML/CSS) — **Alexandre**
- [ ] CRUD 3 — Orçamentos — **Alexandre**
- [ ] CRUD 4 — Dívidas e Parcelamentos — **Alexandre**

---

## 🟢 LUÍS — Bootstrap, Telas HTML, Rotas + 2 CRUDs

### 1. Bootstrap (framework CSS)

**Mostrar na tela:** `app/layout.jsx`, `components/rodape-bootstrap.jsx` e o rodapé no navegador (rolar até o fim de qualquer tela)

**O que falar:**
- "Além do Tailwind CSS, o projeto também usa o **framework Bootstrap** (pacote `bootstrap`, instalado via `npm install bootstrap`)."
- O CSS do Bootstrap é importado em `app/layout.jsx` (linha 4: `import 'bootstrap/dist/css/bootstrap.min.css'`) — esse é o arquivo que **inicializa/"bootstrapa"** toda a aplicação: define o HTML base (`<html>`, `<body>`), importa os estilos globais (Bootstrap + Tailwind via `globals.css`) e configura metadados como título e ícone.
- O componente `components/rodape-bootstrap.jsx` usa **classes do Bootstrap 5**: `container`, `d-flex`, `flex-column`, `flex-sm-row`, `justify-content-center`, `align-items-center`, `gap-2`, `bg-dark`, `text-white`, `text-center`, e os componentes `badge` (`badge bg-success`, `badge bg-secondary`, `badge bg-info`).
- Esse rodapé aparece em **todas as telas**: na tela de login (`tela-login.jsx`, final do arquivo) e em todas as telas internas (`layout-principal.jsx`, dentro de `<main>`, depois de `{children}`).
- Em `app/page.jsx`, o componente `Home` **envolve toda a aplicação** com o `FinanceiroProvider` — é aqui que o "estado global" (Context API) é inicializado. O componente `ConteudoPrincipal` verifica `isLoggedIn`: se não estiver logado, mostra `<TelaLogin />`; se estiver, mostra o layout principal.

**Frase-chave:** *"O Bootstrap entra no projeto em `app/layout.jsx` — o arquivo que inicializa a aplicação — e aparece visualmente no rodapé presente em todas as telas, usando classes como `container`, `d-flex` e `badge`, ao lado do Tailwind e do shadcn/ui."*

**Demonstração ao vivo:** abrir `http://localhost:3000`, rolar até o fim da tela de login para mostrar o rodapé Bootstrap, e depois fazer login para mostrar que o rodapé também aparece nas telas internas.

---

### 2. Telas HTML Estáticas (`html-templates/`)

**Mostrar na tela:** abrir a pasta `html-templates/` no explorador de arquivos e abrir os arquivos direto no navegador

**O que falar:**
- O projeto possui **9 telas HTML estáticas** na pasta `html-templates/`, que reproduzem visualmente cada tela do sistema usando **HTML puro + Bootstrap 5** (via CDN), sem necessidade de Node.js ou servidor.
- Cada arquivo é uma página completa e autossuficiente: contém `<html>`, `<head>` com o CSS do Bootstrap, `<body>` com sidebar de navegação, topbar, conteúdo principal e rodapé Bootstrap — a mesma estrutura do sistema React.
- A **navegação entre as telas funciona via links `<a href="...">`** na sidebar, conectando todos os 9 arquivos entre si.
- Os formulários usam elementos HTML nativos com classes Bootstrap: `<form>`, `<input>`, `<select>`, `<label>`, `<textarea>` — estilizados com `form-control`, `form-label`, `form-select`, `mb-3`.
- **Destaques de formulários específicos:**
  - `01-login.html`: `<form>` com `type="email"` e `type="password"`, atributos `required` e `minlength`
  - `04-transacoes.html`: `<input type="radio">` para tipo receita/despesa + `<select>` para categoria e conta
  - `05-contas.html`: formulário dinâmico — ao selecionar "Cartão de Crédito" no `<select>`, campos extras aparecem via JavaScript
  - `06-orcamentos.html`: `<input type="month">` para mês de referência
  - `07-fontes-receita.html`: `<input type="color">` para cor de identificação
  - `08-dividas.html`: cálculo em tempo real do valor da parcela (`valorTotal / qtdParcelas`) enquanto o usuário digita, usando evento `oninput`

**Frase-chave:** *"Essas telas HTML mostram a estrutura base do sistema em HTML puro e Bootstrap 5 — cada formulário usa elementos nativos como `<form>`, `<input>` e `<select>` com classes Bootstrap, abrindo direto no navegador sem precisar de servidor."*

**Demonstração ao vivo:**
1. Abrir `html-templates/01-login.html` diretamente no navegador (duplo clique)
2. Navegar pela sidebar até `04-transacoes.html` — mostrar a tabela e clicar em "Nova Transação" para abrir o modal com o formulário HTML
3. Ir para `08-dividas.html` — digitar um valor total e quantidade de parcelas para mostrar o cálculo em tempo real da parcela

---

### 3. Rotas / Navegação entre telas

**Mostrar na tela:** `components/layout-principal.jsx` e o switch em `app/page.jsx` (linhas 53-93)

**O que falar:**
- Diferente de um site com várias URLs, este projeto é uma **SPA (Single Page Application)**: existe **uma única rota real** (`/`), e a "navegação" entre telas é controlada por **estado do React**, não pela URL.
- O array `menuItems` em `layout-principal.jsx` define os itens do menu lateral (ícone + label + id da página).
- Ao clicar em um item do menu, a função `setPaginaAtiva(item.id)` atualiza o estado.
- Em `app/page.jsx`, a função `renderizarConteudo()` (linhas 53-93) é um **switch** que decide qual componente de tela mostrar com base em `paginaAtiva` — esse é o "roteador" da aplicação.

**Frase-chave:** *"As rotas aqui são simuladas: a sidebar muda uma variável de estado (`paginaAtiva`), e um switch decide qual tela renderizar — sem recarregar a página."*

**Demonstração ao vivo:** abrir `http://localhost:3000`, fazer login, e clicar em 2-3 itens do menu lateral mostrando a troca de tela.

---

### 4. CRUD 1 — Transações (`components/tela-transacoes.jsx`)

**O que mostrar e falar:**
- **Create**: botão "Nova Transação" abre um modal (`Dialog`) com formulário (linha 400). Ao salvar, chama `adicionarTransacao` (definida em `lib/financeiro-context.jsx`, linha 158).
- **Read**: tabela zebrada (linhas 274-385) lista as transações, com busca por texto e filtro por tipo (receita/despesa).
- **Update**: botão laranja "Editar" (linha 360) abre o mesmo modal preenchido (`abrirModalEditar`), chamando `editarTransacao` (linha 182 do contexto).
- **Delete**: botão vermelho "Deletar" (linha 370) abre um `AlertDialog` de confirmação antes de chamar `deletarTransacao` (linha 192 do contexto).

**Demonstração ao vivo:** criar uma transação nova, editar o valor dela, e depois excluir, mostrando a tabela atualizando em tempo real.

---

### 5. CRUD 2 — Contas e Cartões (`components/tela-contas.jsx`)

**O que mostrar e falar:**
- **Create**: botão "Nova Conta" → modal de cadastro (linha 396) → `adicionarConta` (linha 285 do contexto).
- **Read**: cards separados em "Contas Bancárias" e "Cartões de Crédito" (linhas 214-385), mostrando saldo, limite e datas de fechamento/vencimento.
- **Update**: ícone de lápis em cada card → `editarConta` (linha 289 do contexto).
- **Delete**: ícone de lixeira → confirmação via `AlertDialog` → `deletarConta` (linha 295 do contexto).
- **Detalhe interessante**: o formulário muda dinamicamente — se o tipo selecionado for "Cartão de Crédito", aparecem campos extras (limite, dia de fechamento, dia de vencimento) (linhas 450-492).

**Demonstração ao vivo:** criar uma conta corrente, depois criar um cartão de crédito (mostrando os campos extras aparecerem), editar e excluir uma conta.

---

## 🔵 ALEXANDRE — Estrutura de Formulário + 2 CRUDs

### 1. Estrutura de Formulário (HTML/CSS)

**Mostrar na tela:** `components/tela-login.jsx` (linhas 102-178) primeiro, depois um formulário de CRUD (ex: `tela-orcamentos.jsx`, linhas 355-421)

**O que falar:**
- Todos os formulários do sistema usam a tag HTML nativa `<form onSubmit={...}>`. O exemplo mais simples é a **Tela de Login** (`tela-login.jsx`):
  - `<form>` com campos `<Label>` + `<Input>` (e-mail e senha)
  - Validação manual antes de enviar (regex de e-mail, tamanho mínimo de senha) — linhas 44-61
  - Mensagem de erro exibida condicionalmente (linhas 151-156)
- A estilização é feita inteiramente com **Tailwind CSS** (classes utilitárias como `space-y-4`, `rounded-md`, `bg-[#0C6A36]`), configurado em `app/globals.css`.
- **Padrão repetido em todos os CRUDs**: um `Dialog` (modal) contém um `<form>` com:
  - `Label` + `Input`/`Select` para cada campo
  - Estado local `formData` que guarda os valores digitados
  - `onSubmit` chama `handleSubmit`, que decide entre **criar** (se `algoEditando === null`) ou **editar** (se já existe um item selecionado)
  - `DialogFooter` com botão "Cancelar" e botão "Adicionar/Salvar Alterações"

**Frase-chave:** *"Existe um padrão único de formulário usado em toda a aplicação: HTML `<form>` + componentes de input estilizados com Tailwind + um único `handleSubmit` que serve tanto para criar quanto para editar."*

---

### 2. CRUD 3 — Orçamentos (`components/tela-orcamentos.jsx`)

**O que mostrar e falar:**
- **Create**: botão "Novo Orçamento" → modal (linha 347) com campos: categoria (`Select`), valor limite (`Input number`), mês de referência (`Input month`) → `adicionarOrcamento` (linha 249 do contexto).
- **Read**: cards com barra de progresso (`Progress`) mostrando quanto já foi gasto vs. o limite (linhas 213-344).
- **Update**: ícone de lápis → `editarOrcamento` (linha 253 do contexto).
- **Delete**: ícone de lixeira + `AlertDialog` → `deletarOrcamento` (linha 259 do contexto).
- **Detalhe interessante (regra de negócio)**: ao salvar, o sistema recalcula automaticamente `gastoAtual` chamando `calcularGastoPorCategoria` (linha 106) — ou seja, o orçamento "sabe" quanto já foi gasto na categoria, somando as transações existentes.

**Demonstração ao vivo:** criar um orçamento para uma categoria, mostrar a barra de progresso, editar o limite, e excluir.

---

### 3. CRUD 4 — Dívidas e Parcelamentos (`components/tela-dividas.jsx`)

**O que mostrar e falar:**
- **Create**: botão "Nova Dívida" → modal (linha 414) com campos: nome, valor total, data da compra, quantidade de parcelas, categoria → `adicionarDivida` (linha 218 do contexto).
- **Read**: lista de cards mostrando valor da parcela, progresso de pagamento e uma **projeção de parcelas futuras** (botão "Ver Projeção de Parcelas", linhas 332-390), gerada por `gerarProjecaoParcelas` (linha 164).
- **Update**: ícone de lápis → `editarDivida` (linha 222 do contexto). No modo edição, aparece um campo extra "Parcelas já Pagas" (linhas 483-495).
- **Delete**: ícone de lixeira + `AlertDialog` → `deletarDivida` (linha 228 do contexto).
- **Extra**: botão "Pagar Parcela" chama `pagarParcelaDivida` (linha 236 do contexto), incrementando o contador de parcelas pagas.
- **Detalhe interessante (form dinâmico)**: o formulário calcula e mostra **em tempo real** o valor de cada parcela (`valorTotal / quantidadeParcelas`) enquanto o usuário digita (linhas 475-479) — bom exemplo de formulário reativo.

**Demonstração ao vivo:** criar uma dívida parcelada (ex: 12x), mostrar o valor da parcela calculado automaticamente, abrir a projeção de parcelas, editar, e excluir.

---

## Sugestão de tempo (vídeo de ~12 min)

| Bloco | Responsável | Tempo aprox. |
|---|---|---|
| Bootstrap (framework CSS) | Luís | 1,5 min |
| Telas HTML estáticas (`html-templates/`) | Luís | 2 min |
| Rotas / navegação | Luís | 1 min |
| CRUD Transações | Luís | 1,5 min |
| CRUD Contas e Cartões | Luís | 1,5 min |
| Estrutura de formulário | Alexandre | 1,5 min |
| CRUD Orçamentos | Alexandre | 1,5 min |
| CRUD Dívidas e Parcelamentos | Alexandre | 1,5 min |

## Dica de gravação

Antes de gravar, deixem o servidor rodando (`pnpm dev` ou `npm run dev`) e abram `http://localhost:3000` no navegador. Façam login com qualquer e-mail válido + senha com 4+ caracteres. Pratiquem o fluxo de **criar → editar → excluir** em cada CRUD antes de gravar, para a demonstração ficar fluida.
