# Sistema de Consulta de Pedidos — Laboratório Sobral

Documentação técnica completa do sistema `pedidomobile`.

---

## Visão Geral

Sistema web de consulta de pedidos por representante comercial (RCA), desenvolvido para o Laboratório Sobral. Os dados foram extraídos **uma única vez** da plataforma pedidomobile.com e armazenados como arquivos JSON estáticos. Não há banco de dados, não há sincronização em tempo real. Os dados cobrem o período até **31/12/2025**.

**URL de produção:** https://pedidomobile.vercel.app
**Deploy:** automático via push na branch `main` → Vercel

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 · App Router |
| Linguagem | TypeScript (strict mode) |
| Estilização | Tailwind CSS + CSS custom properties |
| Tema | next-themes (dark por padrão, alternável) |
| Autenticação | bcryptjs (hash de senha) + jose (JWT em cookie httpOnly) |
| PDF export | react-to-print v3 |
| Deploy | Vercel (serverless) |
| Persistência de senha | @vercel/blob (arquivo users.json) |

---

## Estrutura de Arquivos

```
app/
  layout.tsx              ← Root layout: fontes (Outfit, DM Mono, DM Serif), ThemeProvider
  globals.css             ← CSS variables para tema light/dark
  login/page.tsx          ← Página de login
  admin/
    page.tsx              ← Server component async: calcula situação real, renderiza AdminClientShell
    rca/[id]/page.tsx     ← Página admin de uma representada: RcaSummaryHeader + Dashboard

  rca/[id]/page.tsx       ← Página do vendedor (acesso próprio RCA apenas)
  icon.svg                ← Favicon
  api/
    auth/login/route.ts   ← POST: verifica senha → cria JWT no cookie 'session'
    auth/logout/route.ts  ← POST: remove cookie 'session'
    admin/password/       ← PATCH: troca senha (admin) → persiste via Vercel Blob
    admin/vendors/        ← GET/POST: lista/cria vendedores
    admin/vendors/[id]/   ← PATCH/DELETE: edita/remove vendedor
    admin/consulta/       ← GET: consulta cross-representada com filtros (admin only)

components/
  Logo.tsx                ← Logo do sistema (fallback texto se SVG ausente)
  ThemeToggle.tsx         ← Botão sol/lua para alternar tema
  Dashboard.tsx           ← Layout standalone do vendedor/admin-rca (header + aviso + conteúdo)
  KpiStrip.tsx            ← 6 KPIs: linhas, pedidos, clientes, qtde total/filtrada, valor
  MiniCharts.tsx          ← Top clientes e top produtos (desktop only, hidden mobile)
  FilterBar.tsx           ← Filtros: busca texto, intervalo de datas (De/Até), cliente, pedido, situação, estado, tabela, plano
  PedidosTable.tsx        ← Tabela de pedidos agrupados (1 linha = 1 pedido distinto)
  PedidoModal.tsx         ← Modal "espelho do pedido" com PDF export

  admin/
    AdminLayout.tsx           ← Layout admin: sidebar com grupos colapsáveis + bottom nav mobile
    AdminClientShell.tsx      ← Client shell: useState para navegação entre seções
    AdminOverview.tsx         ← Visão Geral: KPIs, situação real, filtros, ranking clicável
    RcaSummaryHeader.tsx      ← Header de stats da representada (server component)
    ConsultasOperacionais.tsx ← Consultas cross-representada com filtros combinados
    VendorList.tsx            ← Lista e gerencia vendedores
    VendorForm.tsx            ← Formulário de criação/edição de vendedor
    PasswordForm.tsx          ← Troca de senha via API

lib/
  types.ts                ← Interfaces: PedidoItem, RcaMeta, UsersFile, SessionPayload
  data.ts                 ← REGISTRY de RCAs + getRcaMeta + getAllRcaIds + getRcaData (async)
  auth.ts                 ← verifyLogin, createToken, verifyToken
  users.ts                ← leitura/escrita de users.json via Vercel Blob

middleware.ts             ← Protege /rca/* e /admin/* via JWT no cookie 'session'

data/
  rca-031.json … rca-260.json   ← 21 arquivos, imutáveis
  clientes.json                  ← 1.325 clientes
  produtos.json                  ← 71 produtos
  users.json                     ← usuários, hashes, lista de vendedores (gerenciado via Blob)

public/
  logo.svg                ← Logo Pedido Mobile
  logo_sobral.svg         ← Logo Laboratório Sobral (rodapé)
```

---

## Dados

### Origem
Extraídos da API pedidomobile.com em uma única extração. Imutáveis — nunca devem ser modificados via código.

### Arquivos RCA

| Arquivo | Itens | Pedidos |
|---|---|---|
| rca-031.json | 5.479 | 565 |
| rca-132.json | 89 | 31 |
| rca-200.json | 8.623 | 1.330 |
| rca-216.json | 1.251 | 224 |
| rca-217.json | 4.743 | 754 |
| rca-224.json | 617 | 75 |
| rca-225.json | 742 | 257 |
| rca-227.json | 3.343 | 516 |
| rca-231.json | 1.636 | 226 |
| rca-237.json | 6.508 | 1.014 |
| rca-240.json | 1.035 | 151 |
| rca-245.json | 4.182 | 523 |
| rca-248.json | 738 | 155 |
| rca-251.json | 716 | 89 |
| rca-252.json | 1.305 | 248 |
| rca-254.json | 1.096 | 174 |
| rca-256.json | 1.035 | 172 |
| rca-257.json | 3.642 | 608 |
| rca-258.json | 131 | 27 |
| rca-259.json | 454 | 86 |
| rca-260.json | 220 | 36 |
| **Total** | **~47.765** | **~6.054** |

### Schema de cada item (`PedidoItem`)

```ts
interface PedidoItem {
  pedido:          string   // número do pedido
  data:            string   // "dd/mm/yyyy"
  situacao:        string   // "Faturado" | "Cancelado" | "Em processamento" | "Em carteira" | "Enviado" | "Recepcionado"
  codCliente:      string   // CNPJ do cliente
  cliente:         string   // "código - NOME DO CLIENTE"
  clienteFantasia: string
  municipio:       string
  estado:          string   // UF, ex: "PI"
  produto:         string   // descrição completa do produto
  codigo:          string   // código do produto
  unidade:         string   // "UN", "CX", etc.
  qtde:            number
  preco:           number
  desconto:        number
  total:           number   // qtde × preco × (1 - desconto)
  tabelaPreco:     string   // "BÁSICA", etc.
  planoPagto:      string   // ex: "28/63/91"
  observacoes:     string
  dataEntrega:     string
  ordemCompra:     string
  totalBruto:      number   // total do pedido inteiro (repetido em todos os itens do pedido)
  totalLiquido:    number   // total líquido do pedido (repetido em todos os itens do pedido)
}
```

> **Atenção:** `totalBruto` e `totalLiquido` são campos do **pedido** repetidos em cada linha de item. Para calcular o valor de um pedido, use `totalLiquido` de qualquer item desse pedido (são todos iguais). Para somar pedidos distintos, agrupe por `pedido` antes de somar.

---

## Autenticação e Controle de Acesso

### Fluxo
1. Usuário entra com matrícula + senha na `/login`
2. API `/api/auth/login` verifica senha com bcryptjs contra `users.json`
3. JWT criado com `jose` e salvo no cookie `session` (httpOnly, sem expiração)
4. `middleware.ts` valida o JWT em cada request para `/rca/*` e `/admin/*`

### Roles
| Role | Acesso |
|---|---|
| `vendor` | Apenas `/rca/{própria matrícula}` |
| `admin` | `/admin` + qualquer `/admin/rca/[id]` |

### Credenciais padrão
| Perfil | Matrícula | Senha padrão |
|---|---|---|
| Vendedor (qualquer RCA) | ID do RCA (ex: `200`) | `sobral2024` |
| Gerente/Admin | `admin` | `admin2024` |

> Senhas devem ser alteradas após o primeiro deploy via painel Admin → Senhas.

### Persistência de senha
Senhas são armazenadas como hashes bcrypt no `data/users.json`. Em produção (Vercel), o arquivo é lido/gravado via **Vercel Blob** (storage persistente), pois o filesystem serverless é efêmero.

---

## Tema Visual

### Paleta — Verde Institucional Laboratório Sobral

| Token CSS | Light | Dark | Uso |
|---|---|---|---|
| `--bg` | `#F5FAF7` | `#0A0F0D` | Fundo global |
| `--surface` | `#F0F7F4` | `#0F1A14` | Cards, header, tabela |
| `--surface2` | `#E8F3EE` | `#0F1F17` | Thead, footer, sub-header |
| `--border` | `#C8DDD6` | `#1F5C3E` | Bordas |
| `--accent` | `#1A8C5B` | `#2ECC8A` | Verde principal |
| `--highlight` | `#0B6640` | `#7EFFD4` | Destaques, labels |
| `--text` | `#0D1F17` | `#E8F3EE` | Texto principal |
| `--muted` | `#5A7A6E` | `#6B9E85` | Texto secundário |
| `--amber` | `#B87A0A` | `#E6A020` | Preços, valores R$, brand |
| `--danger` | `#C0392B` | `#F87171` | Erros, cancelado |
| `--amber-*` | variantes rgba | variantes rgba | bordas, sombras, glow |

**Tema:** dark por padrão (`defaultTheme="dark"`, `enableSystem={false}`).

### Tipografia
| Fonte | Variável CSS | Uso |
|---|---|---|
| Outfit | `--font-sans` | Texto geral, UI |
| DM Mono | `--font-mono` | Matrículas, códigos, valores |
| DM Serif Display | `--font-serif` | Títulos de seção |

---

## Funcionalidades

### Área do Vendedor (`/rca/[id]`)

**Dashboard** com:
- **KPI Strip** — 6 indicadores em grid responsivo: Linhas de Item, Pedidos, Clientes, Qtde Total, Qtde Filtrada, Valor Filtrado
- **MiniCharts** (desktop) — Top clientes por valor + Top produtos por quantidade
- **FilterBar** — 9 filtros combinados: busca texto livre, intervalo de datas (De/Até), cliente, número do pedido, situação, estado, tabela de preço, plano de pagamento
- **PedidosTable** — tabela agrupada (1 linha por pedido distinto, não por item):
  - Colunas: Pedido, Data, Situação, Cliente, Município/UF, Tabela, Plano, Itens, Qtde, Total Líquido
  - Ordenação por qualquer coluna (clique no header)
  - Mobile: cards empilhados com borda-left colorida por situação
- **PedidoModal** — abre ao clicar no número do pedido:
  - Espelho estilo NF-e: emitente (representada), destinatário (cliente), linha a linha dos itens
  - Totais, plano de pagamento, observações
  - Exportação para PDF via react-to-print v3

### Área Admin (`/admin`)

#### Visão Geral
**Server component** que carrega todos os 21 JSONs e calcula:

**Top row — 5 cards em grid (desktop), 2 colunas (mobile):**
1. **Representadas** — total de RCAs ativas (21)
2. **Pedidos Totais** — soma de todos os pedidos de todas as RCAs
3. **Itens Totais** — soma de todas as linhas de pedido
4. **Situação dos Pedidos** — breakdown real (Faturado / Pendente / Cancelado) calculado em runtime dos JSONs, com contagem absoluta e percentual
5. **Filtrar Ranking** — busca por nome/matrícula + hint de ordenação por coluna

**Ranking de Representadas — tabela full-width:**
- 1 linha por representada, todas com mesmo tamanho (sem compactação)
- Colunas ordenáveis com setas ↑↓: `#`, Matrícula, Representada, Pedidos, Itens
- Matrícula em fonte mono verde, nome em destaque
- Linha inteira clicável → navega para `/admin/rca/[id]`
- Busca filtra a tabela em tempo real

#### Página de Representada (`/admin/rca/[id]`)

Estrutura da página (de cima para baixo):
1. **Header** "Pedido Mobile" — sticky, full-width
2. **Faixa de aviso** — "Sistema apenas para consultas", full-width, cor âmbar
3. **Botão Voltar** — `← Voltar ao painel` → `/admin`
4. **RcaSummaryHeader** (server component) — computed dos dados reais:
   - Nome + ID da representada, período ativo (data mín → máx), valor total estimado
   - KPIs: Pedidos únicos, Clientes únicos, Municípios, Estados
   - Situação dos pedidos da representada (barras com %, contagem e percentual)
   - Top 5 produtos por quantidade (barras relativas)
5. **Dashboard completo** — igual ao view do vendedor (KPI Strip, MiniCharts, FilterBar, PedidosTable, PedidoModal)

#### Consultas Operacionais

Nova seção no painel admin com busca cross-representada:

- **Filtros disponíveis:** representada (dropdown com matrícula + nome), situação, UF, busca texto livre, intervalo de datas (De/Até)
- **API:** `GET /api/admin/consulta` — carrega todos os JSONs em paralelo, aplica filtros, agrupa por pedido único (chave `rcaId+pedido`), retorna lista ordenada por data decrescente
- **Resultado:** tabela desktop com colunas (Pedido, Data, Representada, Município/UF, Itens, Total Líquido, Situação) + cards mobile com borda colorida por situação
- **Estado inicial:** tela vazia com instrução — dados só carregam ao clicar em "Consultar"
- **Performance:** delay de 3–5s aceitável dado o volume (~47k itens carregados server-side)

#### Configurações (grupo colapsável no sidebar)

**Vendedores**
- Listar todos os vendedores cadastrados
- Criar novo vendedor (matrícula + nome)
- Editar nome de vendedor existente
- Remover vendedor

**Senhas**
- Trocar senha dos vendedores (hash único compartilhado por todos)
- Trocar senha do admin

---

## Responsividade

| Elemento | Mobile (< md) | Desktop (≥ md) |
|---|---|---|
| KpiStrip | grid 2 colunas | grid 6 colunas |
| MiniCharts | oculto | grid 2 colunas |
| FilterBar | botão "Filtrar" + bottom drawer | inline com selects |
| PedidosTable | cards empilhados, borda-left colorida | tabela completa com sort |
| PedidoModal | full screen | modal centralizado |
| Admin nav | bottom navigation fixo (todos os itens) | sidebar 224px sticky com grupos colapsáveis |
| Admin top row | grid 2 colunas | grid 5 colunas (stretch) |
| Admin ranking | cards empilhados | tabela com colunas ordenáveis |

---

## Variáveis de Ambiente

```env
JWT_SECRET=string_aleatoria_minimo_32_chars
BLOB_READ_WRITE_TOKEN=vercel_blob_token   # gerado automaticamente pelo Vercel Blob
```

Configurar em: Vercel → Settings → Environment Variables

---

## Comandos de Desenvolvimento

```bash
npm run dev      # servidor local → http://localhost:3000
npm run build    # build de produção — deve passar sem erros TS
npm run lint     # ESLint
```

> `npm run build` deve passar sem erros antes de qualquer commit.

---

## Regras de Negócio Importantes

1. **Dados imutáveis** — os arquivos `data/rca-*.json` jamais devem ser modificados via código
2. **Senha única dos vendedores** — todos os vendedores compartilham o mesmo hash de senha (a distinção é feita pela matrícula, não pela senha)
3. **Sessão sem expiração** — cookie `session` não tem `maxAge`
4. **totalLiquido é por pedido, não por item** — repetido em todas as linhas do mesmo pedido; sempre agrupe por pedido antes de somar
5. **Pedidos únicos cross-RCA** — números de pedido podem se repetir entre RCAs diferentes; use a chave composta `rcaId + '-' + pedido` para comparações globais
6. **Moeda** — sempre formatar com `toLocaleString('pt-BR', { minimumFractionDigits: 2 })`
7. **Datas** — formato `dd/mm/yyyy` conforme vêm da API; parse com split('/') para cálculos

---

## Limitações Conhecidas

| Item | Situação |
|---|---|
| Dados em tempo real | ❌ Dados congelados em 31/12/2025 |
| API externa | ❌ Sem conexão com pedidomobile.com |
| Banco de dados | ❌ Apenas JSON estático |
| Valor total na Visão Geral | ⚠️ Não calculado (RcaSummaryHeader calcula por representada) |
| Dados cadastrais das representadas | ⚠️ Apenas razão social disponível |
| Comissões / metas / devoluções | ❌ Não disponíveis nos dados |
| Situação no card Visão Geral | ✅ Calculado em runtime dos JSONs reais |
| Situação no RcaSummaryHeader | ✅ Calculado em runtime dos JSONs reais |

---

## Histórico de Versões (commits principais)

| Commit | Descrição |
|---|---|
| `0619a1e` | Sidebar: grupos colapsáveis com animação de chevron |
| `06e803a` | Sidebar: seções "Painel" e "Configurações" (Vendedores + Senhas) |
| `bffdcdf` | Consultas: dropdown representada com matrícula + nome; todas as 6 situações |
| `e82b835` | Filtro de data (De/Até) no FilterBar + nova seção Consultas Operacionais |
| `2f2581a` | Situação dos Pedidos: dados reais calculados dos rca-*.json |
| `c4e9721` | Header full-width no topo, faixa de aviso full-width |
| `ef20586` | Ranking: rows uniformes, colunas ordenáveis, fonte maior |
| `041d2e7` | Layout edge-to-edge + botão Voltar + auditoria visual |
| `4ff1a4c` | Linhas do ranking clicáveis + RcaSummaryHeader |
| `a89cf1b` | Remove max-w-5xl: conteúdo admin ocupa 100% da largura |
| `7022a6b` | Redesign Admin Visão Geral: ranking + KPIs + filtros |
| `f329902` | Tabela de pedidos agrupada (1 linha por pedido distinto) |
| `f70da24` | PedidoModal: espelho do pedido + exportação PDF |
| `70f7c49` | Persistência de senha via Vercel Blob |
| `e73c757` | Paleta âmbar Laboratório Sobral |
