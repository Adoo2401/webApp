"use client"

import React, { useEffect, useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/ui/DataTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Loader, MoreHorizontal } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import getRecurringIntervalInMinutes from '@/lib/getRecurringIntervalInMinutes'
import getRecurringIntervalInHours from '@/lib/getRecurringIntervalInHours'

type Schedule = {
    hours: number[],
    minutes: number[],
}

type CronJobs = {
    jobId: string
    url: string
    enabled: boolean
    product: string
    lastExecution: number
    nextExecution: number
    schedule: Schedule
}


const Sheet = () => {

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [data, setData] = useState<any[] | never[]>([])

    async function getData() {
        setIsLoading(true);
        try {
            let API: any = await fetch("/api/sheets");
            API = await API.json();

            if (API.success) {
                setData(API.message);
                setIsLoading(false);
                return
            }

            toast({ title: "Error", description: API.message });

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
        }
    }

    useEffect(() => {
        getData();
    }, [])


    async function deleteSheet(productId: string) {
        setIsLoading(true)
        try {

            let API: any = await fetch(`/api/sheets/${productId}`, { method: "DELETE" })
            API = await API.json();

            if (API.success) {
                setIsLoading(false)
                getData();
                return toast({ title: "Success", description: "Cron Job Deleted" });
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
        }
    }

    
    const columns: ColumnDef<CronJobs>[] = [
        {
            accessorKey: "productId",
            header: "Product ID",
            id: "productId"
        },
        {
            accessorKey: "name",
            header: "Product Name",
            id: "name"
        },
        {
            accessorKey: "noOfSheets",
            header: "No. of sheets",
            id: "noOfSheets"
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const noOfSheet: any = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => deleteSheet(noOfSheet.productId)} className='text-red-500 cursor-pointer'>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`sheet_plans/edit_sheet_plan/${noOfSheet.productId}`)} className=' cursor-pointer'>
                                Edit Sheet Plan
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        }
    ]

    return (
        <>
            <div className={cn("h-full flex-1 flex-col space-y-8 p-8 md:flex", isLoading ? "items-center justify-center" : "")}>
                {
                    isLoading ? <Loader className='animate-spin' /> : <DataTable filter="name" columns={columns} data={data} />
                }
            </div>

        </>
    )
}

export default Sheet