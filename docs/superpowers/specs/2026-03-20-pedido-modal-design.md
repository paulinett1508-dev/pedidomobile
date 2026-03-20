# Pedido Modal — Espelho do Pedido com Export PDF

**Data:** 2026-03-20
**Status:** Aprovado pelo usuário

---

## Objetivo

Quando o vendedor clica no número de um pedido na tabela, abre um modal mostrando o detalhamento completo daquele pedido linha a linha — estilo "espelho de NF-e". O modal inclui opção de salvar/exportar como PDF via `react-to-print`.

---

## Contexto do Projeto

- Stack: Next.js 14, App Router, TypeScript strict, Tailwind CSS
- Dados 100% estáticos em `data/rca-*.json` — cada linha é um item de pedido
- Componente principal: `components/PedidosTable.tsx` (tabela desktop + cards mobile)
- Sem banco de dados — agrupamento feito em memória no cliente
- Paleta: verde institucional Sobral com suporte dark/light via CSS custom properties

---

## Arquitetura

### Novo componente: `components/PedidoModal.tsx`

Componente isolado responsável por:
- Receber `items: PedidoItem[]` (todos os itens do pedido selecionado) e `onClose: () => void`
- Renderizar o espelho do pedido (cabeçalho + tabela de itens + totais)
- Expor ref para `react-to-print`

### Alterações em `components/PedidosTable.tsx`

- Adicionar `meta: RcaMeta` e `allItems: PedidoItem[]` às props (além de `items` já existente)
  - `items`: lista filtrada — usada para renderizar a tabela/cards (comportamento atual)
  - `allItems`: lista completa sem filtros — usada exclusivamente para lookup do modal
- Adicionar estado `selectedPedido: string | null`
- Tornar o número do pedido clicável (botão estilizado com underline/hover accent)
- Renderizar `<PedidoModal>` quando `selectedPedido !== null`
- Passar `allItems.filter(i => i.pedido === selectedPedido)` para o modal (não `items`, garantindo pedido completo mesmo com filtros ativos)

### Alterações em `components/Dashboard.tsx`

- Passar `meta` e `allItems` (items sem filtro) para `<PedidosTable>`

---

## Layout do Modal

```
┌──────────────────────────────────────────────────────┐
│  Pedido #484  ·  08/04/2024            [PDF] [X]      │
├──────────────────────────────────────────────────────┤
│  EMITENTE                                             │
│  132 - AVANTEPHARMA REPRESENTAÇÕES LTDA.              │
│                                                       │
│  DESTINATÁRIO                                         │
│  06718 - DROGARIA NOVA ESPERANCA LTDA                 │
│  CNPJ: 43.575.877/0004-66                             │
│  São Paulo / SP                                       │
│                                                       │
│  Situação: Faturado  ·  Tabela: BÁSICA  ·  Plano: 35 │
├──────────────────────────────────────────────────────┤
│  ITENS                                                │
│  # │ Código │ Produto              │ Un │ Qtde │ Preço │ Total   │
│  1 │ 1103   │ PROPZINCO GENGIBRE.. │ UN │ 359  │ 5,50  │ 1.974,50│
│  2 │ 1104   │ PROPZINCO MEL..      │ UN │ 367  │ 5,50  │ 2.018,50│
│  ...                                                  │
├──────────────────────────────────────────────────────┤
│                        Total Bruto:  R$ 17.463,11     │
│                        Total Líquido: R$ 17.463,11    │
└──────────────────────────────────────────────────────┘
```

---

## Dados

Os dados do pedido vêm exclusivamente dos itens já carregados em memória:

```ts
const pedidoItems = items.filter(i => i.pedido === selectedPedido)
const header = pedidoItems[0] // fornece: cliente, codCliente, data, situacao,
                               // municipio, estado, tabelaPreco, planoPagto,
                               // totalBruto, totalLiquido, observacoes
```

Campos por seção:
- **Cabeçalho emitente**: `meta.representada` (via prop `RcaMeta` passada ao modal)
- **Cabeçalho destinatário**: `header.cliente`, `header.codCliente`, `header.municipio`, `header.estado`
- **Info pedido**: `header.data`, `header.situacao`, `header.tabelaPreco`, `header.planoPagto`
- **Linha de item**: `item.codigo`, `item.produto`, `item.unidade`, `item.qtde`, `item.preco`, `item.desconto`, `item.total`
- **Totais**: `header.totalBruto`, `header.totalLiquido`

---

## Comportamento UX

| Ação | Resultado |
|------|-----------|
| Clique no número do pedido | Abre o modal |
| Clique fora do modal (overlay) | Fecha |
| Tecla ESC | Fecha |
| Botão X | Fecha |
| Botão "Salvar PDF" | Chama `react-to-print` → diálogo de impressão do browser |
| Print | Apenas o conteúdo do espelho (sem overlay, sem header da página) |

---

## Responsividade

| Viewport | Comportamento |
|----------|---------------|
| Desktop (>= md) | Modal centralizado, max-w-4xl, scroll interno se necessário, z-index `z-[60]` (acima do drawer do FilterBar que usa `z-50`) |
| Mobile (< md) | Full-screen sheet (top-0 left-0 w-full h-full), scroll vertical, z-index `z-[60]` |

---

## PDF / Impressão

- Biblioteca: `react-to-print@^3` (API v3 com `contentRef` direto, compatível com React 18)
- `useReactToPrint` aponta para uma ref no container do espelho
- CSS `@media print`: esconde overlay e botões, mantém apenas o conteúdo do espelho
- Fonte legível, cores ajustadas para impressão (sem fundos escuros)

---

## Dependências Novas

- `react-to-print` — única dependência nova (leve, ~15kb)

---

## Fora do Escopo

- Dados em tempo real / sincronização com API
- Edição de pedidos
- Envio por e-mail
- Geração de PDF server-side
