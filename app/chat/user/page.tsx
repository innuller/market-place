import UserQuotes from '@/components/UserQuote'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className="min-h-screen bg-[#003853]">
        <UserQuotes/>
    </div>
  )
}

export default page