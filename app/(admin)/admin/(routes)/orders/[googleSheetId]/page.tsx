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
  
  type Params = {
    googleSheetId: string
  }

const Orders = ({params}:{params:Params}) => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [data, setData] = useState<any[] | never[]>([])

    async function getData() {
        setIsLoading(true);
        try {
            let API: any = await fetch(`/api/userSheets/${params.googleSheetId}`);
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