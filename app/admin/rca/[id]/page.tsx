import { notFound } from 'next/navigation'
import { getRcaMeta, getRcaData } from '@/lib/data'
import Dashboard from '@/components/Dashboard'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

export default async function AdminRcaPage({ params }: PageProps) {
  const meta = getRcaMeta(params.id)
  if (!meta) notFound()

  const items = await getRcaData(params.id)
  if (!items) notFound()

  return (
    <div>
      <div
        className="sticky top-0 z-20 px-4 py-2 flex items-center gap-2 text-sm"
        style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}
      >
        <Link
          href="/admin"
          className="font-medium hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          ← Admin
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--muted)' }}>RCA {params.id}</span>
      </div>
      <Dashboard meta={meta} items={items} />
    </div>
  )
}
