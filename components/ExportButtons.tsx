'use client'

import { useState } from 'react'
import { exportExcel, exportPDF } from '@/lib/exportUtils'

interface ExportButtonsProps {
  filename: string
  pdfTitle: string
  pdfSubtitle?: string
  sheetName?: string
  headers: string[]
  getRows: () => (string | number)[][]
  size?: 'sm' | 'md'
}

export default function ExportButtons({
  filename,
  pdfTitle,
  pdfSubtitle = '',
  sheetName = 'Dados',
  headers,
  getRows,
  size = 'sm',
}: ExportButtonsProps) {
  const [loadingXls, setLoadingXls] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)

  const px  = size === 'sm' ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
  const txt = size === 'sm' ? 'text-xs' : 'text-sm'

  async function handleExcel() {
    setLoadingXls(true)
    try { await exportExcel(filename, sheetName, headers, getRows()) }
    finally { setLoadingXls(false) }
  }

  async function handlePdf() {
    setLoadingPdf(true)
    try { await exportPDF(filename, pdfTitle, pdfSubtitle, headers, getRows()) }
    finally { setLoadingPdf(false) }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleExcel}
        disabled={loadingXls}
        title="Exportar Excel"
        className={`${px} ${txt} rounded-lg font-medium flex items-center gap-1.5 transition-opacity hover:opacity-80 disabled:opacity-50`}
        style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px solid var(--border)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="16" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        {loadingXls ? '…' : 'Excel'}
      </button>

      <button
        onClick={handlePdf}
        disabled={loadingPdf}
        title="Exportar PDF"
        className={`${px} ${txt} rounded-lg font-medium flex items-center gap-1.5 transition-opacity hover:opacity-80 disabled:opacity-50`}
        style={{ background: 'var(--surface2)', color: 'var(--danger)', border: '1px solid var(--border)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        {loadingPdf ? '…' : 'PDF'}
      </button>
    </div>
  )
}
