import { ThemeSwitcher } from '@/components/theme-switcher'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='flex flex-col justify-center items-center p-7'>
        <ThemeSwitcher/>
    </div>
  )
}

export default page