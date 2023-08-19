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
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

function CreateStripeProduct() {

    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const [data,setData] = useState({name:"",description:"",})

    
    function handleChange (e:any){
        setData({...data,[e.target.id]:e.target.value})
    }

    async function handleCreate(){

        if(!data.name || !data.description){return toast({description:"Name is required"})};
        setIsLoading(true)

        try {
            
            let API :any = await fetch("/api/addProduct",{method:"POST",body:JSON.stringify(data),headers:{"Content-Type":"application/json"}});
            API = await API.json();

            if(API.success){
                toast({title:"Success",description:"Stripe Product Created"});
                setIsLoading(false);
                return
            }

            toast({title:"Error",description:API.message})
            setIsLoading(false);

        } catch (error:any) {
            toast({title:"Error",description:error.message})
            setIsLoading(false)

        }
    }

    return (
        <div className="p-8">

            <Card>
                <CardHeader>
                    <CardTitle>Create Stripe Product</CardTitle>
                    <CardDescription>
                        Easily create your stripe product from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input onChange={handleChange} id="name" placeholder="Your Stripe Product Name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea onChange={handleChange}
                            id="description"
                            placeholder="Your Stripe product description"
                        />
                    </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                    <Button disabled={isLoading} onClick={handleCreate} className={cn(isLoading?"cursor-not-allowed":"cursor-pointer")}>
                        {
                            isLoading ? <Loader2Icon className="animate-spin"/> : "Create"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CreateStripeProduct