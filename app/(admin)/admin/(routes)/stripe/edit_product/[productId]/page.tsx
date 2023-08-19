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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Loader2, Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"

type Params = {
    params: {
        productId: string
    }
}

function EditStripeProduct({params}:Params) {
    

    const [isLoading, setIsLoading] = useState(false);
    const [isProductLoading,setIsProductLoading] = useState(true);
    const {toast} = useToast();
    const [data,setData] = useState({name:"",description:"",})

    async function fetchSingleProduct(){
        try {
            
            let API : any = await fetch(`/api/getSingleProduct/${params.productId}`);
            API = await API.json();

            if(API.success){
                setData(API.message);
                setIsProductLoading(false);
                return
            }

            toast({title:"Error",description:API.message})


        } catch (error:any) {
            toast({title:"Error",description:error.message})
        }
    }

    useEffect(()=>{
        fetchSingleProduct();
    },[params.productId])

    
    function handleChange (e:any){
        setData({...data,[e.target.id]:e.target.value})
    }

    async function handleEdit(){

        if(!data.name || !data.description){return toast({description:"Name is required"})};
        setIsLoading(true)

        try {
            
            let API :any = await fetch(`/api/editProduct/${params.productId}`,{method:"PUT",body:JSON.stringify(data),headers:{"Content-Type":"application/json"}});
            API = await API.json();

            if(API.success){
                toast({title:"Success",description:"Stripe Product Updated"});
                setIsLoading(false);
                return
            }

            toast({title:"Error",description:API.message})
            setIsLoading(false);

        } catch (error:any) {
            console.log(error);
            toast({title:"Error",description:error.message})
            setIsLoading(false)

        }
    }

    if(isProductLoading){
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader2 className="animate-spin"/>
            </div>
        )
    }

    return (
        <div className="p-8">

            <Card>
                <CardHeader>
                    <CardTitle>Edit Stripe Product</CardTitle>
                    <CardDescription>
                        Easily edit your stripe product from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input onChange={handleChange} value={data.name} id="name" placeholder="Your Stripe Product Name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea onChange={handleChange}
                            value={data.description}
                            id="description"
                            placeholder="Your Stripe product description"
                        />
                    </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                    <Button disabled={isLoading} onClick={handleEdit} className={cn(isLoading?"cursor-not-allowed":"cursor-pointer")}>
                        {
                            isLoading ? <Loader2Icon className="animate-spin"/> : "Edit"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default EditStripeProduct