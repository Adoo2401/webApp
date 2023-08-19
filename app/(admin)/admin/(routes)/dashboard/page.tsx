"use client"


import UserCard from '@/app/(admin)/components/UserCard'
import React from 'react'

const page = () => {
  return (
    
    <div className='p-10'>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UserCard/>
      </div>
    </div>
  )
}

export default page