"use client"

import React, { useEffect, useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/ui/DataTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Delete, DeleteIcon, Loader, MoreHorizontal } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { Label } from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'

type Payment = {
    id: string
    name: string
}


const StripeProducts = () => {

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [data, setData] = useState([])

    async function getData(): Promise<Payment[]> {
        setIsLoading(true);
        try {
            let API: any = await fetch("/api/getProducts");
            API = await API.json();

            if (API.success) {
                setData(API.message);
                setIsLoading(false);
            }

            return []
        } catch (error: any) {
            return []
        }
    }

    useEffect(() => {
        getData();
    }, [])


    async function deleteProduct(id: string) {

        setIsLoading(true)
        try {

            let API: any = await fetch(`/api/deleteProduct/${id}`, { method: "DELETE" })
            API = await API.json();

            if (API.success) {
                setIsLoading(false)
                getData();
                return toast({ title: "Success", description: "Stripe Product Deleted" });
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
        }
    }


    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: "productId",
            header: "Product ID",
            id: "id"
        },
        {
            accessorKey: "name",
            header: "Name",
            id: "name"
        },
        {
            accessorKey: "prices",
            header: "Prices",
            cell: ({ row }) => {
                let prices: any = row.getValue("prices");
                let product : any = row.original;
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Show Prices</Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[60rem] overflow-auto h-[15rem]'>
                            <Table>
                                <TableCaption>A list of prices assoicated with your product</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Price ID</TableHead>
                                        <TableHead>Unit Amount</TableHead>
                                        <TableHead>Trial</TableHead>
                                        <TableHead>Trial Period</TableHead>
                                        <TableHead>Currency</TableHead>
                                        <TableHead>Interval</TableHead>
                                        <TableHead>Features</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        prices.map((price: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{price.priceId}</TableCell>
                                                <TableCell>{price.unit_amount}</TableCell>
                                                <TableCell >{price.trial.toString()}</TableCell>
                                                <TableCell >{price.trialPeriod}</TableCell>
                                                <TableCell >{price.currency}</TableCell>
                                                <TableCell>{price.interval}</TableCell>
                                                <TableRow>
                                                    {
                                                        price.features.map((feature: any, index: number) => (
                                                            <TableCell key={index}>{feature}</TableCell>
                                                        ))
                                                    }
                                                </TableRow>
                                                <TableCell >{price.active.toString()}</TableCell>
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
                                                            <DropdownMenuItem onClick={() => router.push("stripe/edit_price/" + price._id+"/"+product._id)} className=' cursor-pointer'>
                                                                Edit Pice
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
        {
            id: "actions",
            cell: ({ row }) => {
                const product: any = row.original
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
                            <DropdownMenuItem onClick={() => deleteProduct(product._id)} className='text-red-500 cursor-pointer'>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("stripe/edit_product/" + product._id)} className=' cursor-pointer'>
                                Edit Product
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
                    isLoading ? <Loader className='animate-spin' /> : <DataTable columns={columns} data={data} />
                }
            </div>

        </>
    )
}

export default StripeProducts