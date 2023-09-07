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
import {Loader2 } from "lucide-react"


type Params = {
    id: string
}



function EditOrder({ params }: { params: Params }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isOrderLoading, setIsOrderLoading] = useState(true)
    const { toast } = useToast();
    const [data, setData] = useState<any>({});

    async function fetchSingleOrder() {
        try {

            let API: any = await fetch(`/api/order/${params.id}`);
            API = await API.json();

            if (API.success) {

                setData(API.message);
                return setIsOrderLoading(false);
            }

            toast({ title: "Error", description: API.message })


        } catch (error: any) {
            toast({ title: "Error", description: error.message })
        }
    }

    useEffect(() => {
        fetchSingleOrder();
    }, [params])

    


    function handleChange(e: any) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    async function handleEdit() {

        if (!data.orderId || !data.source || !data.fullName || !data.phone || !data.title || !data.city) { return toast({ description: "Please add all fields" }) };
        setIsLoading(true)

        try {

            let API: any = await fetch(`/api/order/${params.id}`, { method: "PUT", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: "Order updated" });
                setIsLoading(false);
                fetchSingleOrder();
                return
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
            setIsLoading(false)

        }
    }
    if (isOrderLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader2 className="animate-spin" />
            </div>
        )
    }


    return (
        <div className="p-8">

            <Card>
                <CardHeader>
                    <CardTitle>Edit Order</CardTitle>
                    <CardDescription>
                        Easily edit order from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
            
                    <div className="grid gap-2">
                        <Label htmlFor="name">Order ID</Label>
                        <Input value={data.orderId} name="orderId" onChange={handleChange} id="name" placeholder="Order ID" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Source</Label>
                        <Input value={data.source} name="source" onChange={handleChange} id="email" placeholder="Source" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Full Name</Label>
                        <Input value={data.fullName} name="fullName" onChange={handleChange} id="password" placeholder="Full Name" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Phone</Label>
                        <Input value={data.phone} name="phone" onChange={handleChange} id="password" placeholder="Phone" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">City</Label>
                        <Input value={data.city} name="city" onChange={handleChange} id="password" placeholder="City" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Title</Label>
                        <Input value={data.title} name="title" onChange={handleChange} id="password" placeholder="Title" />
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

export default EditOrder