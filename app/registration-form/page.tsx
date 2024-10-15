import { HeaderComponent } from '@/components/header'
import { RegistrationFormComponent } from '@/components/registration-form'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <>
      <HeaderComponent />
      <RegistrationFormComponent />
    </>
  )
}

export default page