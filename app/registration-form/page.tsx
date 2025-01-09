import ExtendedRegistrationForm from '@/components/extended-registration-form'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='bg-white text-card-foreground'>
        <ExtendedRegistrationForm/>
    </div>
  )
}

export default page