"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Loader2 } from "lucide-react"


type Params = {
    id:string
}



function EditStripePrice({params}:{params:Params}) {

    const [isLoading, setIsLoading] = useState(false);
    const [isUserLoading,setIsUserLoading] = useState(true)
    const { toast } = useToast();
    const [data, setData] = useState<any>({});


    async function fetchSingleUser(){
        try {
            
            let API : any = await fetch(`/api/users/${params.id}`);
            API = await API.json();

            if(API.success){

                setData(API.message);
                return setIsUserLoading(false);
            }

            toast({title:"Error",description:API.message})


        } catch (error:any) {
            toast({title:"Error",description:error.message})
        }
    }

    useEffect(()=>{
        fetchSingleUser();
    },[params])
    
    

    function handleChange(e:any) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    async function handleEdit() {

        if (!data.role || !data.name  || !data.email || !data.password) { return toast({ description: "Please add all fields" }) };
        setIsLoading(true)

        try {

            let API : any= await fetch(`/api/users/${params.id}`, { method: "PUT", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: "User updated" });
                setIsLoading(false);
                fetchSingleUser();
                return
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error:any) {
            toast({ title: "Error", description: error.message })
            setIsLoading(false)

        }
    }

    if(isUserLoading){
        return(
            <div className="h-screen flex justify-center items-center">
              <Loader2 className="animate-spin"/>
            </div>
        )
    }


    return (
        <div className="p-8">

            <Card>
                <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                    <CardDescription>
                        Easily edit user from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select defaultValue={data.role} name="role" onValueChange={(e:string)=>setData({...data,role:e})}>
                                <SelectTrigger
                                    id="role"
                                    className="line-clamp-1 w-[160px] truncate"
                                >
                                    <SelectValue placeholder="Edit role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                    <SelectItem value="subscriber">Subscriber</SelectItem>
                                    <SelectItem value="nonSubscriber">Non Subscriber</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
    
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input value={data.name}  name="name" onChange={handleChange} id="name" placeholder="Full Name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input value={data.email} name="email" onChange={handleChange} id="email" placeholder="Email" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input value={data.password} name="password" onChange={handleChange} id="password" placeholder="Password" />
                    </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                    <Button disabled={isLoading} onClick={handleEdit}>
                        {
                            isLoading ? <Loader2 className="animate-spin" /> : "Edit"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default EditStripePrice