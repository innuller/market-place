import { ExtendedRegistrationFormComponent } from '@/components/extended-registration-form'
import { HeaderComponent } from '@/components/header'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <>
      <HeaderComponent />
      {/* <RegistrationFormComponent /> */}
      <ExtendedRegistrationFormComponent/>
    </>
  )
}

export default page