# Pedido Modal — Espelho do Pedido com Export PDF

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ao clicar no número de um pedido na tabela, abre um modal mostrando todos os itens daquele pedido estilo espelho de NF-e, com botão de exportar PDF via react-to-print.

**Architecture:** Novo componente `PedidoModal` recebe os itens já em memória (filtrados por número do pedido) e `RcaMeta` para o emitente. `PedidosTable` gerencia o estado `selectedPedido` e faz o lookup nos itens não-filtrados (`allItems`). `Dashboard` passa `meta` e `allItems` para baixo.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, CSS custom properties (paleta Sobral), react-to-print v3

---

## Mapa de Arquivos

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `components/PedidoModal.tsx` | **Criar** | Renderiza o espelho do pedido + PDF |
| `components/PedidosTable.tsx` | **Modificar** | Adiciona props `meta`/`allItems`, estado `selectedPedido`, torna pedido clicável |
| `components/Dashboard.tsx` | **Modificar** | Passa `meta` e `allItems={items}` para `<PedidosTable>` |

---

## Task 1: Instalar react-to-print

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Instalar a biblioteca**

```bash
npm install react-to-print@^3
```

- [ ] **Step 2: Verificar que instalou a v3**

```bash
npm list react-to-print
```

Expected: `react-to-print@3.x.x`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-to-print v3"
```

---

## Task 2: Criar PedidoModal

**Files:**
- Create: `components/PedidoModal.tsx`

O modal recebe os itens do pedido selecionado (`items: PedidoItem[]`) e o meta da representada (`meta: RcaMeta`). Todos os dados vêm do primeiro item (`header = items[0]`).

- [ ] **Step 1: Criar o arquivo**

```tsx
// components/PedidoModal.tsx
'use client'

import { useRef, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { PedidoItem, RcaMeta } from '@/lib/types'

interface PedidoModalProps {
  items: PedidoItem[]
  meta: RcaMeta
  onClose: () => void
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function situacaoColor(s: string) {
  const map: Record<string, string> = {
    Faturado:  'var(--accent)',
    Cancelado: 'var(--danger)',
    Pendente:  'var(--amber)',
  }
  return map[s] ?? 'var(--muted)'
}

export default function PedidoModal({ items, meta, onClose }: PedidoModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Pedido-${items[0]?.pedido ?? 'export'}`,
  })

  const header = items[0]

  // Fechar com ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Bloquear scroll do body enquanto modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!header) return null

  return (
    // Overlay
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Container — full-screen mobile, max-w-4xl desktop */}
      <div
        className="relative w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] md:rounded-2xl flex flex-col"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header do modal */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg" style={{ color: 'var(--accent)' }}>
              Pedido #{header.pedido}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ color: situacaoColor(header.situacao), background: 'var(--surface2)' }}
            >
              {header.situacao}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
              aria-label="Fechar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto flex-1 p-5">

          {/* Área printável */}
          <div ref={contentRef} data-print-area>

            {/* Cabeçalho para impressão (visível apenas no print) */}
            <div className="hidden print:block mb-4 text-center">
              <h1 className="text-xl font-bold">Espelho do Pedido #{header.pedido}</h1>
              <p className="text-sm text-gray-500">{header.data}</p>
            </div>

            {/* Emitente + Destinatário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Emitente */}
              <div className="rounded-xl p-4" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold uppercase mb-2 tracking-wide" style={{ color: 'var(--muted)' }}>
                  Emitente
                </p>
                <p className="font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>
                  {meta.representada}
                </p>
              </div>

              {/* Destinatário */}
              <div className="rounded-xl p-4" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold uppercase mb-2 tracking-wide" style={{ color: 'var(--muted)' }}>
                  Destinatário
                </p>
                <p className="font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>
                  {header.cliente}
                </p>
                {header.clienteFantasia && header.clienteFantasia !== header.cliente && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {header.clienteFantasia}
                  </p>
                )}
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted)' }}>
                  CNPJ/CPF: {header.codCliente}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {header.municipio}{header.estado ? ` / ${header.estado}` : ''}
                </p>
              </div>
            </div>

            {/* Info do pedido */}
            <div
              className="flex flex-wrap gap-4 px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              <div>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Data</span>
                <p className="font-mono font-medium" style={{ color: 'var(--text)' }}>{header.data}</p>
              </div>
              {header.dataEntrega && (
                <div>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Entrega</span>
                  <p className="font-mono font-medium" style={{ color: 'var(--text)' }}>{header.dataEntrega}</p>
                </div>
              )}
              <div>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Tabela</span>
                <p className="font-medium" style={{ color: 'var(--highlight)' }}>{header.tabelaPreco}</p>
              </div>
              <div>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Plano Pagto</span>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{header.planoPagto}</p>
              </div>
              {header.ordemCompra && (
                <div>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Ordem de Compra</span>
                  <p className="font-medium" style={{ color: 'var(--text)' }}>{header.ordemCompra}</p>
                </div>
              )}
            </div>

            {/* Tabela de itens */}
            <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: 'var(--surface2)' }}>
                      {['#', 'Código', 'Produto', 'Un', 'Qtde', 'Preço Unit.', 'Desconto', 'Total'].map(h => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left font-semibold whitespace-nowrap text-xs"
                          style={{ color: 'var(--highlight)', borderBottom: '1px solid var(--border)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={`${item.codigo}-${idx}`}
                        style={{
                          background: idx % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <td className="px-3 py-2 text-xs" style={{ color: 'var(--muted)' }}>{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs" style={{ color: 'var(--muted)' }}>{item.codigo}</td>
                        <td className="px-3 py-2 text-xs" style={{ color: 'var(--text)' }}>{item.produto}</td>
                        <td className="px-3 py-2 text-xs" style={{ color: 'var(--muted)' }}>{item.unidade}</td>
                        <td className="px-3 py-2 text-right font-medium" style={{ color: 'var(--accent)' }}>
                          {item.qtde.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-3 py-2 text-right" style={{ color: 'var(--amber)' }}>
                          R$ {fmt(item.preco)}
                        </td>
                        <td className="px-3 py-2 text-right text-xs" style={{ color: 'var(--muted)' }}>
                          {item.desconto > 0 ? `${item.desconto}%` : '—'}
                        </td>
                        <td className="px-3 py-2 text-right font-bold" style={{ color: 'var(--amber)' }}>
                          R$ {fmt(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totais */}
            <div className="flex flex-col items-end gap-1 mb-2">
              <div className="flex gap-8 text-sm">
                <span style={{ color: 'var(--muted)' }}>Total Bruto</span>
                <span className="font-mono font-semibold w-32 text-right" style={{ color: 'var(--text)' }}>
                  R$ {fmt(header.totalBruto)}
                </span>
              </div>
              <div className="flex gap-8 text-sm">
                <span style={{ color: 'var(--muted)' }}>Total Líquido</span>
                <span className="font-mono font-bold w-32 text-right" style={{ color: 'var(--amber)' }}>
                  R$ {fmt(header.totalLiquido)}
                </span>
              </div>
            </div>

            {/* Observações (se houver) */}
            {header.observacoes && (
              <div
                className="mt-4 px-4 py-3 rounded-xl text-xs"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Observações</p>
                {header.observacoes}
              </div>
            )}

          </div>{/* fim contentRef */}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          [data-print-area], [data-print-area] * { visibility: visible; }
          [data-print-area] { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}

// NOTA para implementador: o <style> está DENTRO do <div> overlay (não como irmão raiz).
// Se mover para fora do <div>, envolver o return em <> </> para evitar erro JSX.
```

- [ ] **Step 2: Verificar sem erros de TypeScript**

```bash
npx tsc --noEmit
```

Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add components/PedidoModal.tsx
git commit -m "feat: add PedidoModal component (espelho do pedido + PDF)"
```

---

## Task 3: Modificar PedidosTable — props + estado + click + modal

**Files:**
- Modify: `components/PedidosTable.tsx`

Três mudanças neste arquivo:
1. Adicionar `meta: RcaMeta` e `allItems: PedidoItem[]` às props
2. Adicionar estado `selectedPedido: string | null`
3. Tornar o `#{item.pedido}` em botão clicável (desktop e mobile)
4. Renderizar `<PedidoModal>` quando `selectedPedido !== null`

- [ ] **Step 1: Atualizar imports e interface de props**

Substituir as linhas 1-8 atuais:

```tsx
'use client'

import { useState } from 'react'
import type { PedidoItem, RcaMeta } from '@/lib/types'
import PedidoModal from './PedidoModal'

interface PedidosTableProps {
  items: PedidoItem[]
  allItems: PedidoItem[]
  meta: RcaMeta
}
```

- [ ] **Step 2: Atualizar assinatura da função e adicionar estado**

Substituir linha 26:
```tsx
export default function PedidosTable({ items, allItems, meta }: PedidosTableProps) {
```

Logo após a linha `const [sortDir, setSortDir] = useState<SortDir>('asc')`, adicionar:
```tsx
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null)
```

- [ ] **Step 3: Tornar pedido clicável na tabela desktop**

Na tabela desktop, substituir a `<td>` do pedido (linha ~103-105):

**Antes:**
```tsx
                  <td className="px-3 py-2.5 font-mono font-medium" style={{ color: 'var(--accent)' }}>
                    #{item.pedido}
                  </td>
```

**Depois:**
```tsx
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => setSelectedPedido(item.pedido)}
                      className="font-mono font-medium underline-offset-2 hover:underline transition-opacity hover:opacity-80"
                      style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                    >
                      #{item.pedido}
                    </button>
                  </td>
```

- [ ] **Step 4: Tornar pedido clicável nos cards mobile**

No card mobile, substituir o `<span>` com `#{item.pedido}` (linha ~177-179):

**Antes:**
```tsx
                <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                  #{item.pedido}
                </span>
```

**Depois:**
```tsx
                <button
                  onClick={() => setSelectedPedido(item.pedido)}
                  className="font-mono font-semibold underline-offset-2 hover:underline"
                  style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  #{item.pedido}
                </button>
```

- [ ] **Step 5: Renderizar o modal**

Antes do `return (` do componente, verificar que o estado existe.

No `return`, dentro do fragmento `<>...</>`, adicionar antes do último `</>`:

```tsx
      {selectedPedido && (
        <PedidoModal
          items={allItems.filter(i => i.pedido === selectedPedido)}
          meta={meta}
          onClose={() => setSelectedPedido(null)}
        />
      )}
```

**Resultado esperado do return completo:**
```tsx
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block ...">
        ...
      </div>

      {/* Mobile cards */}
      <div className="flex md:hidden ...">
        ...
      </div>

      {selectedPedido && (
        <PedidoModal
          items={allItems.filter(i => i.pedido === selectedPedido)}
          meta={meta}
          onClose={() => setSelectedPedido(null)}
        />
      )}
    </>
  )
```

- [ ] **Step 6: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: sem erros

- [ ] **Step 7: Commit**

```bash
git add components/PedidosTable.tsx
git commit -m "feat: make pedido number clickable, open PedidoModal on click"
```

---

## Task 4: Modificar Dashboard — passar meta e allItems

**Files:**
- Modify: `components/Dashboard.tsx` linha 144

Uma única linha muda: `<PedidosTable>` agora recebe `meta` e `allItems`.

- [ ] **Step 1: Atualizar o uso de PedidosTable**

**Antes (linha 144):**
```tsx
        <PedidosTable items={filtered} />
```

**Depois:**
```tsx
        <PedidosTable items={filtered} allItems={items} meta={meta} />
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: sem erros

- [ ] **Step 3: Build completo**

```bash
npm run build
```

Expected: build passa sem erros de TypeScript ou ESLint

- [ ] **Step 4: Commit**

```bash
git add components/Dashboard.tsx
git commit -m "feat: thread meta and allItems to PedidosTable for modal lookup"
```

---

## Task 5: Verificação manual e ajuste de print CSS

**Files:**
- Nenhum arquivo novo — verificação e possíveis ajustes no `PedidoModal.tsx`

- [ ] **Step 1: Rodar em dev**

```bash
npm run dev
```

Acessar `http://localhost:3000` → login → RCA → clicar em qualquer número de pedido.

Verificar:
- [ ] Modal abre com dados corretos (emitente, destinatário, itens, totais)
- [ ] Fechar com X funciona
- [ ] Fechar clicando fora funciona
- [ ] Fechar com ESC funciona
- [ ] Mobile: modal ocupa tela cheia, scroll funciona
- [ ] Desktop: modal centralizado, scroll interno se muitos itens

- [ ] **Step 2: Testar PDF**

Clicar em "Salvar PDF" → diálogo de impressão do browser abre.

Verificar:
- [ ] Apenas o conteúdo do espelho aparece na prévia de impressão
- [ ] Header/overlay não aparecem na impressão
- [ ] Texto é selecionável (não imagem)
- [ ] Nome do arquivo sugerido: `Pedido-{numero}`

- [ ] **Step 3: Testar com filtros ativos**

Aplicar filtro por produto → clicar em um pedido que deveria ter mais itens do que o filtro mostra.
Verificar: o modal mostra **todos** os itens do pedido (não apenas os filtrados).

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: pedido modal complete — espelho NF-e + PDF export"
```

---

## Referência rápida de estilos

| Elemento | CSS |
|----------|-----|
| Overlay | `fixed inset-0 z-[60] bg-black/60 backdrop-blur` |
| Modal container | `bg-[var(--surface)] border-[var(--border)] md:rounded-2xl` |
| Números de pedido | `color: var(--accent)` + `hover:underline` |
| Totais | `color: var(--amber)` para valores, `var(--muted)` para labels |
| Badges situação | Faturado=accent, Cancelado=danger, Pendente=amber |
