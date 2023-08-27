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


const CronJobs = () => {

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [data, setData] = useState<any[] | never[]>([])

    async function getData() {
        setIsLoading(true);
        try {
            let API: any = await fetch("/api/cronJobs");
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


    async function deleteProduct(id: string,product:string) {

        setIsLoading(true)
        try {

            let API: any = await fetch(`/api/cronJobs/${id}?productName=${product}`, { method: "DELETE" })
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

    async function disable(id: string, isEnabled: boolean) {

        setIsLoading(true);
        try {
            let API: any = await fetch(`/api/cronJobs/${id}`, { method: "PATCH", body: JSON.stringify({ isEnabled: !isEnabled }), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: API.message });

                setData(data.map((item: any) => {
                    if (item.jobId === id) {
                        return { ...item, enabled: !isEnabled }
                    }

                    return item
                }))

                setIsLoading(false);
                return
            }

            toast({ title: "Error", description: API.message });
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
            setIsLoading(false);
        }
    }


    const columns: ColumnDef<CronJobs>[] = [
        {
            accessorKey: "jobId",
            header: "Cron Job ID",
            id: "jobId"
        },
        {
            accessorKey: "url",
            header: "URL",
            id: "url"
        },
        {
            accessorKey: "product",
            header: "Product",
            id: "product"
        },
        {
            accessorKey: "lastExecution",
            header: "Last Execution",
            id: "lastExecution",
            cell: ({ row }) => {
                const unixTimeStamp = row.original.lastExecution;
                if (unixTimeStamp === 0) {
                    return "-"
                } else {
                    const timeStampInMilliseconds = unixTimeStamp * 1000

                    return new Date(timeStampInMilliseconds).toLocaleString("en-US", {
                        timeZone: "Africa/Casablanca",
                        year: "2-digit",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });
                }
            }
        },
        {
            accessorKey: "schedule",
            header: "Schedule",
            id: "schedule",
            cell: ({ row }) => {
                return row?.original?.schedule?.hours.includes(-1) ? getRecurringIntervalInMinutes(row.original.schedule.minutes,false) : getRecurringIntervalInHours(row.original.schedule.hours,false)
            }
        },
        {
            accessorKey: "nextExecution",
            header: "Next Execution",
            id: "nextExecution",
            cell: ({ row }) => {
                const unixTimeStamp = row.original.nextExecution;
                const timeStampInMilliseconds = unixTimeStamp * 1000

                return new Date(timeStampInMilliseconds).toLocaleString("en-US", {
                    timeZone: "Africa/Casablanca",
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
            }
        },

        {
            accessorKey: "enabled",
            header: "Status",
            cell: ({ row }) => {

                return (
                    <Badge className={row.original.enabled ? "bg-green-500" : "bg-red-500"}>{row.original.enabled ? "Enabled" : "Disabled"}</Badge>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const cronJob: any = row.original
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
                            <DropdownMenuItem onClick={() => deleteProduct(cronJob.jobId,cronJob.product)} className='text-red-500 cursor-pointer'>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`cron_jobs/edit_cron_job/${cronJob.jobId}`)} className=' cursor-pointer'>
                                Edit cron job
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => disable(cronJob.jobId, cronJob.enabled)} className=' cursor-pointer'>
                                {cronJob.enabled ? "Disable" : "Enable"}
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
                    isLoading ? <Loader className='animate-spin' /> : <DataTable filter="product" columns={columns} data={data} />
                }
            </div>

        </>
    )
}

export default CronJobs