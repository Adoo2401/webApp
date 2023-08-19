"use client"

import { CardHeader,CardTitle,CardContent,Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LucideIcon, UserIcon } from 'lucide-react'
import React, { useState } from 'react'




const UserCard = () => {

    const [isLoading,setIsLoading] = useState(false);

    if(isLoading) return <Skeleton className='h-[130px]'/>

    return (
        <Card className='shadow-lg'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                   Users
                </CardTitle>
                <UserIcon />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">100</div>
            </CardContent>
        </Card>
    )
}

export default UserCard