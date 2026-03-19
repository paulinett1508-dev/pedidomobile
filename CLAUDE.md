# pedidomobile — Laboratório Sobral

Sistema de relatórios de pedidos por representante comercial (RCA).
Dados estáticos em JSON, sem banco de dados. Deploy automático no Vercel via push na `main`.

---

## Stack

- Next.js 14 · App Router · TypeScript strict
- Tailwind CSS · next-themes (dark/light)
- bcryptjs · jose (JWT em cookie httpOnly)
- Sem banco — dados em `data/*.json`

---

## Estrutura crítica

```
data/
  rca-{id}.json     ← dados de cada vendedor (gerados a partir de PDFs)
  users.json        ← usuários, hashes de senha, lista de vendedores

lib/
  data.ts           ← REGISTRY de RCAs + loaders
  auth.ts           ← JWT, verifyLogin, createToken
  users.ts          ← leitura/escrita do users.json

middleware.ts       ← protege /rca/* e /admin/* via cookie 'session'
```

---

## Regras de negócio

- **Vendedor** acessa apenas `/rca/{própria matrícula}` — ex: matrícula 224 → `/rca/224`
- **Gerente** (`id: "admin"`) acessa `/admin` e qualquer `/admin/rca/[id]`
- Senha dos vendedores é **única e compartilhada** — um hash para todos em `vendorPasswordHash`
- Sessão **sem expiração** — cookie httpOnly sem `maxAge`, dura até o usuário limpar cookies
- Autenticação: matrícula (string) + senha → JWT no cookie `session`

---

## Como adicionar novo RCA (fluxo padrão)

1. Receber PDF do SAP Business One
2. Pedir ao Claude Code: *"Converta este PDF para JSON seguindo o schema de `data/rca-224.json` e salve em `data/rca-{id}.json`"*
3. Registrar em `lib/data.ts` → objeto `REGISTRY`
4. Adicionar `{ id: '{id}' }` em `generateStaticParams()` em `app/rca/[id]/page.tsx`
5. Adicionar vendedor via painel admin ou diretamente em `data/users.json`
6. `git push main` → Vercel deploya em ~30s

---

## Schema do JSON de RCA

```ts
interface PedidoItem {
  pedido: string      // ex: "000484"
  codCliente: string  // ex: "06664"
  cliente: string     // ex: "GHC MED DISTRIBUIDORA LTDA"
  produto: string     // ex: "DOSEVIT – VITAMINA D 20 ML - CX C/120"
  qtde: number        // ex: 720
  preco: number       // ex: 4.44
  total: number       // qtde * preco, 2 casas decimais
}
```

---

## Paleta de cores

| Token CSS        | Light      | Dark       | Uso                        |
|------------------|------------|------------|----------------------------|
| `--bg`           | `#F5FAF7`  | `#0A0F0D`  | Fundo global               |
| `--surface`      | `#F0F7F4`  | `#0F1A14`  | Cards, header, tabela      |
| `--surface2`     | `#E8F3EE`  | `#0F1F17`  | Thead, footer              |
| `--border`       | `#C8DDD6`  | `#1F5C3E`  | Bordas                     |
| `--accent`       | `#1A8C5B`  | `#2ECC8A`  | Verde principal, qtde      |
| `--highlight`    | `#0B6640`  | `#7EFFD4`  | Destaques, labels          |
| `--text`         | `#0D1F17`  | `#E8F3EE`  | Texto principal            |
| `--muted`        | `#5A7A6E`  | `#6B9E85`  | Texto secundário           |
| `--amber`        | `#B87A0A`  | `#E6A020`  | Preços, valores R$         |
| `--danger`       | `#C0392B`  | `#F87171`  | Erros, botão remover       |

---

## Logo

- Arquivo: `public/logo.svg`
- Componente: `components/Logo.tsx`
- Para substituir: trocar o arquivo `public/logo.svg` e fazer push. Zero mudança de código.
- Tamanhos: `h-8` no header, `h-12` na página de login

---

## Responsividade — regras fixas

| Elemento       | Mobile (< md)                          | Desktop (>= md)              |
|----------------|----------------------------------------|------------------------------|
| KpiStrip       | `grid-cols-2`                          | `grid-cols-6`                |
| MiniCharts     | `hidden`                               | `grid-cols-2`                |
| FilterBar      | Botão "Filtrar" + bottom drawer        | Inline com selects           |
| PedidosTable   | Cards empilhados com borda-l accent    | Tabela completa com sort     |
| Admin nav      | Bottom navigation                      | Sidebar 240px                |

---

## Variáveis de ambiente

```
JWT_SECRET=string_aleatoria_minimo_32_chars
```

Configurar em: Vercel → Settings → Environment Variables

---

## Comandos úteis

```bash
npm run dev      # desenvolvimento local → http://localhost:3000
npm run build    # build de produção — deve passar sem erros TS
npm run lint     # ESLint
```

---

## Credenciais iniciais (alterar após primeiro deploy)

- Vendedor 224: matrícula `224` + senha `sobral2024`
- Gerente: matrícula `admin` + senha `admin2024`

---

## Regras para o Claude Code neste repo

- Nunca expor `data/users.json` via rota pública ou `getStaticProps`
- Nunca usar `console.log` em produção — usar `console.error` apenas em catch de erros críticos
- Todo componente novo deve ter versão mobile e desktop conforme tabela acima
- Formatação de moeda sempre com `toLocaleString('pt-BR', { minimumFractionDigits: 2 })`
- Ao gerar JSON de novo RCA a partir de PDF, sempre validar contra o schema `PedidoItem` antes de salvar
- `npm run build` deve passar antes de qualquer commit
