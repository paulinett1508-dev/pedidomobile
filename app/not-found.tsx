import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
         style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <h1 className="text-6xl font-bold" style={{ color: 'var(--accent)' }}>404</h1>
      <p className="text-lg" style={{ color: 'var(--muted)' }}>Página não encontrada</p>
      <Link href="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)', color: '#fff' }}>
        Voltar ao início
      </Link>
    </div>
  )
}
