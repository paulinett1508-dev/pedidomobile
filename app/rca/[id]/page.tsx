import { notFound } from 'next/navigation'
import { getRcaMeta, getRcaData, getAllRcaIds } from '@/lib/data'
import Dashboard from '@/components/Dashboard'

interface PageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return getAllRcaIds().map(id => ({ id }))
}

export default async function RcaPage({ params }: PageProps) {
  const meta = getRcaMeta(params.id)
  if (!meta) notFound()

  const items = await getRcaData(params.id)
  if (!items) notFound()

  return <Dashboard meta={meta} items={items} />
}
