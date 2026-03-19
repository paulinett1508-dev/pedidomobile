'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import VendorList from '@/components/admin/VendorList'
import PasswordForm from '@/components/admin/PasswordForm'
import AdminOverview from '@/components/admin/AdminOverview'

export default function AdminPage() {
  const [section, setSection] = useState('overview')

  return (
    <AdminLayout activeSection={section} onSectionChange={setSection}>
      {section === 'overview' && <AdminOverview />}
      {section === 'vendors' && <VendorList />}
      {section === 'passwords' && <PasswordForm />}
    </AdminLayout>
  )
}
