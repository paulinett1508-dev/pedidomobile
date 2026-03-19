import { notFound } from 'next/navigation'
import { getRcaMeta, getRcaData } from '@/lib/data'
import Dashboard from '@/components/Dashboard'

interface PageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return [
    '031','132','200','216','217','224','225','227',
    '231','237','240','245','248','251','252','254',
    '256','257','258','259','260',
  ].map(id => ({ id }))
}

export default async function RcaPage({ params }: PageProps) {
  const meta = getRcaMeta(params.id)
  if (!meta) notFound()

  const items = await getRcaData(params.id)
  if (!items) notFound()

  return <Dashboard meta={meta} items={items} />
}
