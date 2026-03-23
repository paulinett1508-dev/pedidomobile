/**
 * Utilitários de exportação — Excel (.xlsx) e PDF (.pdf)
 * 100% client-side. Não requer servidor.
 */

// ─── Excel ───────────────────────────────────────────────────────────────────

export async function exportExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const mod = await import('xlsx')
  const XLSX = mod.default ?? mod
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

  // Largura automática das colunas
  const colWidths = headers.map((h, i) => {
    const maxLen = rows.reduce((max, row) => {
      const val = row[i] != null ? String(row[i]) : ''
      return Math.max(max, val.length)
    }, h.length)
    return { wch: Math.min(maxLen + 2, 60) }
  })
  ws['!cols'] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export async function exportPDF(
  filename: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: rows[0]?.length > 6 ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' })

  // Header
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Laboratório Sobral', 14, 14)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 14, 21)

  if (subtitle) {
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(subtitle, 14, 27)
    doc.setTextColor(0, 0, 0)
  }

  const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text(`Gerado em ${date}`, doc.internal.pageSize.width - 14, 14, { align: 'right' })
  doc.setTextColor(0, 0, 0)

  autoTable(doc, {
    startY: subtitle ? 32 : 28,
    head: [headers],
    body: rows.map(r => r.map(v => String(v ?? ''))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [26, 140, 91], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 247, 244] },
    margin: { left: 14, right: 14 },
  })

  doc.save(`${filename}.pdf`)
}

// ─── Formatadores compartilhados ─────────────────────────────────────────────

export function fmtMoeda(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
