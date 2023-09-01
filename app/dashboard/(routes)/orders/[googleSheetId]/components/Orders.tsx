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
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


type Props = {
    googleSheetId: string
}

interface OrderItem {
    name?: string;
    code?: string;
    quantity?: number;
    price?: number;
  }
  
  interface Order extends Document {
    userId: string;
    orderId: string;
    source: string;
    fullName: string;
    phone: string;
    title: string;
    city?: string;
    items: OrderItem[];
    total: number;
  }
  

const Orders = (props:Props) => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [data, setData] = useState<any[] | never[]>([])

    async function getData() {
        setIsLoading(true);
        try {
            let API: any = await fetch(`/api/userSheets/${props.googleSheetId}`);
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


    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: "orderId",
            header: "Order ID",
            id: "orderId"
        },
        {
            accessorKey: "source",
            header: "Source",
            id: "source"
        },
        {
            accessorKey: "fullName",
            header: "Full Name",
            id: "fullName"
        },
        {
            accessorKey: "phone",
            header: "Phone",
            id: "phone"
        },
        {
            accessorKey: "total",
            header: "Total",
            id: "total"
        },
        {
            accessorKey: "items",
            header: "Items",
            cell: ({ row }) => {
                let items: any = row.getValue("items");
                let order : any = row.original;
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Show Items</Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[60rem] overflow-auto h-[15rem]'>
                            <Table>
                                <TableCaption>A list of Items</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        items?.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.code}</TableCell>
                                                <TableCell >{item.quantity}</TableCell>
                                                <TableCell >{item.price}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => router.push("")} className=' cursor-pointer'>
                                                                Edit Item
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))

                                    }
                                </TableBody>
                            </Table>
                        </PopoverContent>
                    </Popover>
                )
            }
        },

        // {
        //     id: "actions",
        //     cell: ({ row }) => {
        //         const cronJob: any = row.original
        //         return (
        //             <DropdownMenu>
        //                 <DropdownMenuTrigger asChild>
        //                     <Button variant="ghost" className="h-8 w-8 p-0">
        //                         <span className="sr-only">Open menu</span>
        //                         <MoreHorizontal className="h-4 w-4" />
        //                     </Button>
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent align="end">
        //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //                     <DropdownMenuItem onClick={() => deleteProduct(cronJob.jobId,cronJob.product)} className='text-red-500 cursor-pointer'>
        //                         Delete
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem onClick={() => router.push(`cron_jobs/edit_cron_job/${cronJob.jobId}/${cronJob.productId}`)} className=' cursor-pointer'>
        //                         Edit cron job
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem onClick={() => disable(cronJob.jobId, cronJob.enabled)} className=' cursor-pointer'>
        //                         {cronJob.enabled ? "Disable" : "Enable"}
        //                     </DropdownMenuItem>
        //                     <DropdownMenuSeparator />
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         )
        //     },
        // }
    ]

    return (
        <>
            <div className={cn("h-full flex-1 flex-col space-y-8 p-8 md:flex", isLoading ? "items-center justify-center" : "")}>
                {
                    isLoading ? <Loader className='animate-spin' /> : <DataTable filter="orderId" columns={columns} data={data} />
                }
            </div>

        </>
    )
}

export default Orders