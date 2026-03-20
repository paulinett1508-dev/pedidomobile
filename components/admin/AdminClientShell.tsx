'use client'

import { useState } from 'react'
import AdminLayout from './AdminLayout'
import VendorList from './VendorList'
import PasswordForm from './PasswordForm'
import AdminOverview from './AdminOverview'
import type { SituacaoStat } from './AdminOverview'

interface Props {
  situacao: SituacaoStat[]
}

export default function AdminClientShell({ situacao }: Props) {
  const [section, setSection] = useState('overview')

  return (
    <AdminLayout activeSection={section} onSectionChange={setSection}>
      {section === 'overview' && <AdminOverview situacao={situacao} />}
      {section === 'vendors'  && <VendorList />}
      {section === 'passwords' && <PasswordForm />}
    </AdminLayout>
  )
}
