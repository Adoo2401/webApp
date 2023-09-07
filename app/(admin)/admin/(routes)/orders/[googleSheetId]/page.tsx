"use client"

import React, { useEffect, useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/ui/DataTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button'
import { Loader, MoreHorizontal} from 'lucide-react'
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


    async function deleteOrder(id: string) {

        setIsLoading(true)
        try {

            let API: any = await fetch(`/api/order/${id}`, { method: "DELETE" })
            API = await API.json();

            if (API.success) {
                setIsLoading(false)
                getData();
                return toast({ title: "Success", description: "Order Deleted" });
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
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
        {
            id: "actions",
            cell: ({ row }) => {
                const order: any = row.original
                console.log(order);
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
                            <DropdownMenuItem onClick={(e) => e.preventDefault()} className='text-red-500 cursor-pointer'>
                                <AlertDialog>
                                    <AlertDialogTrigger>Delete</AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this order
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteOrder(order._id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>router.push(`/admin/orders/edit_order/${order._id}`)}  className=' cursor-pointer'>
                                Edit Order
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
                    isLoading ? <Loader className='animate-spin' /> : <DataTable filter="orderId" columns={columns} data={data} />
                }
            </div>

        </>
    )
}

export default Orders