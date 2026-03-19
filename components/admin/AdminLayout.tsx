'use client'

import { useState } from 'react'
import Logo from '../Logo'
import ThemeToggle from '../ThemeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (s: string) => void
}

const sections = [
  { id: 'overview', label: 'Visão Geral', icon: '⊞' },
  { id: 'vendors', label: 'Vendedores', icon: '👥' },
  { id: 'passwords', label: 'Senhas', icon: '🔑' },
]

export default function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 min-h-screen sticky top-0"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <Logo size="sm" />
        </div>
        <div className="p-2 flex-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5"
              style={{
                background: activeSection === s.id ? 'var(--accent)' : 'transparent',
                color: activeSection === s.id ? '#fff' : 'var(--text)',
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* Mobile header */}
        <header
          className="md:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            >
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors"
            style={{ color: activeSection === s.id ? 'var(--accent)' : 'var(--muted)' }}
          >
            <span className="text-base">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
