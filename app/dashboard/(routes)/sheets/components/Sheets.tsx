"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/ui/DataTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Loader, MoreHorizontal } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


type UserSheets = {
    googleSheetId: string
    orders: number,
    cronJobActive: boolean,
    title: string
}


const Sheets = () => {

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const updateInputRef = useRef<any>(null);
    const router = useRouter();
    const [data, setData] = useState<any[] | never[]>([])

    async function getData() {
        setIsLoading(true);
        try {
            let API: any = await fetch("/api/userSheets");
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


    async function handleDelete(googleSheetId: string) {
        setIsLoading(true);
        try {

            let API: any = await fetch(`/api/userSheets/${googleSheetId}`, { method: "DELETE" })
            API = await API.json();

            if (API.success) {
                setIsLoading(false)
                getData();
                return toast({ title: "Success", description: "Google Sheet Deleted" });
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
            setIsLoading(false);
        }
    }

    async function disable(id: string, isEnabled: boolean) {
        setIsLoading(true);
        try {
            let API: any = await fetch(`/api/userSheets/${id}`, { method: "PATCH", body: JSON.stringify({ isEnabled: isEnabled }), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: API.message });

                setData(data.map((item: any) => {
                    if (item.googleSheetId === id) {
                        return { ...item, cronJobActive: isEnabled }
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

    async function update(id:string){
         
        if(!updateInputRef?.current?.value) return toast({ title: "Error", description: "Please enter google sheet id" })
        setIsLoading(true);
        try {
            let API: any = await fetch(`/api/userSheets/${id}`, { method: "PUT", body: JSON.stringify({ googleSheetId:updateInputRef.current.value}), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: API.message });
                getData();
                setIsLoading(false);
                return
            }

            toast({ title: "Error", description: API.message });
        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }
    }


    const columns: ColumnDef<UserSheets>[] = [
        {
            accessorKey: "googleSheetId",
            header: "Google Sheet ID",
            id: "googleSheetId"
        },
        {
            accessorKey: "title",
            header: "Title",
            id: "title"
        },
        {
            accessorKey: "orders",
            header: "Number of Orders",
            id: "orders",
            cell: ({ row }) => row?.original?.orders + " orders"
        },

        {
            accessorKey: "cronJobActive",
            header: "Cron Job Status",
            cell: ({ row }) => {
                if (row.original.title === "No sheet added until now") { return }
                return (
                    <Badge className={row.original.cronJobActive ? "bg-green-500" : "bg-red-500"}>{row.original.cronJobActive ? "Enabled" : "Disabled"}</Badge>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const googleSheetId: any = row.original

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
                                                This action cannot be undone. This will permanently delete all the orders associated with this Google Sheet ID
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(googleSheetId.googleSheetId)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${googleSheetId.googleSheetId}`)} className='cursor-pointer'>
                                See Orders
                            </DropdownMenuItem>
                            {
                                googleSheetId.title === "No sheet added until now" ? <></> : <DropdownMenuItem onClick={() => disable(googleSheetId.googleSheetId, !googleSheetId.cronJobActive)} className=' cursor-pointer'>
                                    {googleSheetId.cronJobActive ? "Disable Cron job" : "Enable Cron job"}
                                </DropdownMenuItem>
                            }
                                <Dialog>
                            <DropdownMenuItem onClick={(e) => e.preventDefault()} className=' cursor-pointer'>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Edit Google Sheeet ID</Button>
                                    </DialogTrigger>
                            </DropdownMenuItem>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your google sheet id here. Click save when you are done
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                        
                                                <Input ref={updateInputRef} id="name" placeholder='Enter Google Sheet ID'  className="col-span-3" />
                                            </div>
                        
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={()=>update(googleSheetId.googleSheetId)} type="submit">Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            
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
                    isLoading ? <Loader className='animate-spin' /> : <DataTable filter="title" columns={columns} data={data} />
                }
            </div>

        </>
    )
}

export default Sheets