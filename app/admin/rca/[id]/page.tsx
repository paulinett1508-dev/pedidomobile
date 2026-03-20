import { notFound } from 'next/navigation'
import { getRcaMeta, getRcaData } from '@/lib/data'
import Dashboard from '@/components/Dashboard'
import RcaSummaryHeader from '@/components/admin/RcaSummaryHeader'

interface PageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

export default async function AdminRcaPage({ params }: PageProps) {
  const meta = getRcaMeta(params.id)
  if (!meta) notFound()

  const items = await getRcaData(params.id)
  if (!items) notFound()

  return (
    <>
      <RcaSummaryHeader meta={meta} items={items} />
      <Dashboard meta={meta} items={items} isAdmin />
    </>
  )
}
