# pedidomobile — Laboratório Sobral

Sistema de relatórios de pedidos por representante comercial (RCA).
Dados extraídos uma única vez da API pedidomobile.com e armazenados como JSON estático.
Sem banco de dados. Sem sincronização. Deploy automático no Vercel via push na `main`.

---

## Stack

- Next.js 14 · App Router · TypeScript strict
- Tailwind CSS · next-themes (dark/light)
- bcryptjs · jose (JWT em cookie httpOnly)
- Dados 100% estáticos em `data/rca-*.json`

---

## Estrutura crítica

```
data/
  rca-031.json   ← 5.479 itens · 565 pedidos
  rca-132.json   ← 89 itens · 31 pedidos
  rca-200.json   ← 8.623 itens · 1.330 pedidos
  rca-216.json   ← 1.251 itens · 224 pedidos
  rca-217.json   ← 4.743 itens · 754 pedidos
  rca-224.json   ← 617 itens · 75 pedidos (Júlio Cesar Lima dos Santos)
  rca-225.json   ← 742 itens · 257 pedidos
  rca-227.json   ← 3.343 itens · 516 pedidos
  rca-231.json   ← 1.636 itens · 226 pedidos
  rca-237.json   ← 6.508 itens · 1.014 pedidos
  rca-240.json   ← 1.035 itens · 151 pedidos
  rca-245.json   ← 4.182 itens · 523 pedidos
  rca-248.json   ← 738 itens · 155 pedidos
  rca-251.json   ← 716 itens · 89 pedidos
  rca-252.json   ← 1.305 itens · 248 pedidos
  rca-254.json   ← 1.096 itens · 174 pedidos
  rca-256.json   ← 1.035 itens · 172 pedidos
  rca-257.json   ← 3.642 itens · 608 pedidos
  rca-258.json   ← 131 itens · 27 pedidos
  rca-259.json   ← 454 itens · 86 pedidos
  rca-260.json   ← 220 itens · 36 pedidos
  users.json     ← usuários, hashes de senha, lista de vendedores
  clientes.json  ← 1.325 clientes extraídos
  produtos.json  ← 71 produtos extraídos

lib/
  data.ts        ← REGISTRY de RCAs + loaders
  auth.ts        ← JWT, verifyLogin, createToken
  users.ts       ← leitura/escrita do users.json

middleware.ts    ← protege /rca/* e /admin/* via cookie 'session'
```

---

## Schema de cada item em rca-*.json

```ts
interface PedidoItem {
  pedido:          string   // ex: "484"
  data:            string   // ex: "29/09/2023"
  situacao:        string   // ex: "Faturado" | "Cancelado" | "Pendente"
  codCliente:      string   // ex: "07.222.185/0001-28"
  cliente:         string   // ex: "00388 - JORGE BATISTA & CIA LTDA"
  clienteFantasia: string
  municipio:       string   // ex: "FLORIANO"
  estado:          string   // ex: "PI"
  produto:         string   // ex: "DOSEVIT – VITAMINA D 20 ML - CX C/120"
  codigo:          string   // ex: "1016"
  unidade:         string   // ex: "UN"
  qtde:            number   // ex: 720
  preco:           number   // ex: 4.44
  desconto:        number   // ex: 0
  total:           number   // ex: 3196.80
  tabelaPreco:     string   // ex: "BÁSICA"
  planoPagto:      string   // ex: "35"
  observacoes:     string
  dataEntrega:     string
  ordemCompra:     string
  totalBruto:      number   // total do pedido inteiro
  totalLiquido:    number
}
```

---

## REGISTRY completo (lib/data.ts)

```ts
const REGISTRY: Record<string, RcaMeta> = {
  '031': { id: '031', representada: '031 - THEODORO F SOBRAL E CIA LTDA (CASA)' },
  '132': { id: '132', representada: '132 - ...' },
  '200': { id: '200', representada: '200 - ...' },
  '216': { id: '216', representada: '216 - ...' },
  '217': { id: '217', representada: '217 - ...' },
  '224': { id: '224', representada: '224 - JC LIMA REPRESENTAÇÕES LTDA (GRV GUSTAVO)' },
  '225': { id: '225', representada: '225 - ...' },
  '227': { id: '227', representada: '227 - ...' },
  '231': { id: '231', representada: '231 - ...' },
  '237': { id: '237', representada: '237 - ...' },
  '240': { id: '240', representada: '240 - ...' },
  '245': { id: '245', representada: '245 - ...' },
  '248': { id: '248', representada: '248 - ...' },
  '251': { id: '251', representada: '251 - ...' },
  '252': { id: '252', representada: '252 - ...' },
  '254': { id: '254', representada: '254 - ...' },
  '256': { id: '256', representada: '256 - ...' },
  '257': { id: '257', representada: '257 - ...' },
  '258': { id: '258', representada: '258 - ...' },
  '259': { id: '259', representada: '259 - ...' },
  '260': { id: '260', representada: '260 - ...' },
}
```

⚠️ Os nomes completos das representadas estão dentro de cada `rca-*.json`
no campo `representada` do primeiro item. Leia e preencha o REGISTRY ao construir.

---

## Regras de negócio

- **Vendedor** acessa apenas `/rca/{própria matrícula}` — matrícula = ID do RCA
- **Gerente** (`id: "admin"`) acessa `/admin` e qualquer `/admin/rca/[id]`
- Senha dos vendedores é **única e compartilhada** — um hash para todos
- Sessão **sem expiração** — cookie httpOnly sem `maxAge`
- Autenticação: matrícula (string) + senha → JWT no cookie `session`

---

## Paleta de cores — Verde Institucional Laboratório Sobral

| Token CSS     | Light      | Dark       | Uso                    |
|---------------|------------|------------|------------------------|
| `--bg`        | `#F5FAF7`  | `#0A0F0D`  | Fundo global           |
| `--surface`   | `#F0F7F4`  | `#0F1A14`  | Cards, header, tabela  |
| `--surface2`  | `#E8F3EE`  | `#0F1F17`  | Thead, footer          |
| `--border`    | `#C8DDD6`  | `#1F5C3E`  | Bordas                 |
| `--accent`    | `#1A8C5B`  | `#2ECC8A`  | Verde principal, qtde  |
| `--highlight` | `#0B6640`  | `#7EFFD4`  | Destaques, labels      |
| `--text`      | `#0D1F17`  | `#E8F3EE`  | Texto principal        |
| `--muted`     | `#5A7A6E`  | `#6B9E85`  | Texto secundário       |
| `--amber`     | `#B87A0A`  | `#E6A020`  | Preços, valores R$     |
| `--danger`    | `#C0392B`  | `#F87171`  | Erros, remover         |

Tema: **dark por padrão**, usuário pode alternar via ThemeToggle (sol/lua).
Implementação: `next-themes` com `defaultTheme="dark"` e `enableSystem={false}`.

---

## Logo

- Arquivo: `public/logo.svg` — slot reservado para logo real
- Componente: `components/Logo.tsx`
- Fallback enquanto logo não existe: texto "pedido**mobile**" estilizado
- Tamanhos: `h-8` no header, `h-12` na página de login
- Para substituir: trocar `public/logo.svg` e fazer push — zero código

---

## Responsividade — regras fixas

| Elemento     | Mobile (< md)                       | Desktop (>= md)           |
|--------------|-------------------------------------|---------------------------|
| KpiStrip     | `grid-cols-2`                       | `grid-cols-6`             |
| MiniCharts   | `hidden`                            | `grid-cols-2`             |
| FilterBar    | Botão "Filtrar" + bottom drawer     | Inline com selects        |
| PedidosTable | Cards empilhados, borda-l accent    | Tabela completa com sort  |
| Admin nav    | Bottom navigation                   | Sidebar 240px             |

---

## Variáveis de ambiente

```
JWT_SECRET=string_aleatoria_minimo_32_chars
```

Configurar em: Vercel → Settings → Environment Variables

---

## Credenciais iniciais (alterar após primeiro deploy)

- Vendedor (qualquer RCA): matrícula = ID do RCA + senha `sobral2024`
- Gerente: matrícula `admin` + senha `admin2024`

---

## Comandos

```bash
npm run dev      # desenvolvimento local → http://localhost:3000
npm run build    # build de produção — deve passar sem erros TS
npm run lint     # ESLint
```

---

## Regras para o Claude Code neste repo

- Nunca expor `data/users.json` via rota pública
- Nunca usar `console.log` em produção
- Todo componente novo: versão mobile e desktop conforme tabela acima
- Moeda sempre: `toLocaleString('pt-BR', { minimumFractionDigits: 2 })`
- Datas no formato `dd/mm/yyyy` (já vêm assim da API)
- `npm run build` deve passar antes de qualquer commit
- Os arquivos `data/rca-*.json` são imutáveis — nunca modificar via código
- O campo `situacao` pode ser: "Faturado", "Cancelado", "Pendente" ou outros

## Uso de Subagents

- Use subagents para pesquisa, exploração e análise paralela — mantém o contexto principal limpo
- Offload investigação de codebase, leitura de logs e tarefas independentes para subagents
- Uma tarefa por subagent para execução focada; prefira paralelismo a execução sequencial
- Para problemas complexos: jogue mais compute via subagents antes de travar o contexto principal

## Verificação antes de Concluir

- Nunca marque tarefa como concluída sem provar que funciona (diff, log, teste, screenshot)
- Checagem mental obrigatória: *"Um senior engineer aprovaria esse diff?"*
- Aplica-se a features e refactors — não apenas ao Bug Fix Protocol
- Se algo parece incerto: demonstre a correção, não apenas afirme

## Elegância (features não-triviais)

- Para mudanças que tocam 3+ arquivos: pause e pergunte "há solução mais elegante?"
- Se a solução parece hack: "sabendo tudo o que sei agora, qual é a implementação elegante?"
- **Exceção obrigatória:** fixes simples e óbvios — não over-engenheirar, não buscar elegância onde ela não agrega
