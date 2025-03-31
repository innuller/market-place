'use client'

import ExtendedRegistrationForm from '@/components/extended-registration-form'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

const EditCompanyPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [organizationData, setOrganizationData] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchOrganizationData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        redirect('/sign-in')
        return
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations_main')
        .select('*')
        .eq('user', user.id)
        .single()

      if (orgError) {
        console.error('Error fetching organization data:', orgError)
        return
      }

      setOrganizationData(orgData)
      setIsLoading(false)
    }

    fetchOrganizationData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='bg-white text-card-foreground'>
      <ExtendedRegistrationForm initialData={organizationData} isEditMode={true} />
    </div>
  )
}

export default EditCompanyPage