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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    plan: string;
    createdAt: string;
  }


const Users = () => {

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true);
    const updateInputRef = useRef<any>(null);

    const router = useRouter();
    const [data, setData] = useState<any[] | never[]>([])
    const [showPassword,setShowPassword] = useState<boolean>(false);

    async function getData() {
        setIsLoading(true);
        try {
            let API: any = await fetch("/api/users");
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


    async function handleDelete(userId: string) {
        setIsLoading(true);
        try {

            let API: any = await fetch(`/api/users/${userId}`, { method: "DELETE" })
            API = await API.json();

            if (API.success) {
                setIsLoading(false)
                getData();
                return toast({ title: "Success", description: "User Deleted" });
            }

            toast({ title: "Error", description: API.message })
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


    const columns: ColumnDef<User>[] = [
          {
            accessorKey: "name",
            header: "Name",
            id: "name",
          },
          {
            accessorKey: "email",
            header: "Email",
            id: "email",
          },
          {
            accessorKey:"password",
            header:"Password",
            id:"password",
            cell: ({ row }) => {
                if(showPassword){
                    return row.original.password
                }

                return "-"
            }
          },
          {
            accessorKey: "role",
            header: "Role",
            id: "role",
          },
          {
            accessorKey: "plan",
            header: "Plan",
            id: "plan",
          },
          {
            accessorKey: "createdAt",
            header: "User Created At",
            id: "createdAt",
            cell: ({ row }) => {
                const createdAt = new Date(row?.original?.createdAt);
                return new Date(createdAt).toLocaleString("en-US", {
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                });
            }
          },
        {
            id: "actions",
            cell: ({ row }) => {
                const user: User = row.original

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
                                                This action cannot be undone. This will permanently delete this user
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(user._id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuItem>
                               <DropdownMenuItem className="cursor-pointer" onClick={()=>router.push(`/admin/users/edit_user/${user._id}`)}>
                                    Edit User
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
                    isLoading ? <Loader className='animate-spin' /> : <> <div><Button size={"sm"} onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide password":"Show password"}</Button></div> <DataTable filter="email" columns={columns} data={data} /></>
                }
            </div>

        </>
    )
}

export default Users