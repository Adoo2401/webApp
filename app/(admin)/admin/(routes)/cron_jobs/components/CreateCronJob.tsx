"use client"

import { useToast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CreateCronJob = () => {

    const { toast } = useToast();
    const [isProductLoading, setIsProductLoading] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const [data, setData] = useState({ product: "",hour:"",minute:"",second:"" });
    const [products, setProducts] = useState([]);

    const handleChange = (e:any)=>{
        setData({...data,[e.target.name]:e.target.value});
    }

    async function fetchProducts() {

        try {
            setIsProductLoading(true);

            let API: any = await fetch("/api/getProductNames");
            API = await API.json();

            if (API.success) {
                setProducts(API.message);
                setIsProductLoading(false);
            }

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
            setIsProductLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    async function handleCreate(){
       if(!data.product || !data.hour || !data.minute || !data.second) { return toast({ description: "Please add all fields" }) };
       if(parseInt(data.hour)<0 || parseInt(data.minute)<0 || parseInt(data.second)<0) { return toast({ description: "Please Enter positive values" }) };
       if(parseInt(data.hour)>24 || parseInt(data.minute)>60 || parseInt(data.second)>60) { return toast({ description: "Please Correct values hour, minute and second" }) };

       let seconds = parseInt(data.hour) * 3600 + parseInt(data.minute) * 60 + parseInt(data.second)
       
        setIsLoading(true)

        try {

            let API: any = await fetch("/api/addCronJob", { method: "POST", body: JSON.stringify({productId:data.product,seconds}), headers: { "Content-Type": "application/json" } });
            API = await API.json();
            if(API.success){
                toast({title:"Success",description:API.message});
                setIsLoading(false);
                return
            }

            toast({title:"Error",description:API.message});

        }catch(err:any){
            toast({ title: "Error", description: err.message })
        }
    }


    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create Cron Jobs</CardTitle>
                    <CardDescription>
                        Easily create your cron jobs from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">

                        <div className="grid gap-2">
                            <Label htmlFor="area">Select stripe Product</Label>
                            <Select defaultValue={data.product} onValueChange={(value) => setData({ ...data, product: value })}>
                                <SelectTrigger id="area">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        isProductLoading ? <Loader className="animate-spin" /> : products.map((product: any) => {
                                            return (
                                                <>
                                                    <SelectItem value={product.productId}>{product.name}</SelectItem>
                                                </>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='grid gap-2'>
                        <div className='gap-4 grid grid-cols-3'>
                            <Input placeholder='Hour' onChange={handleChange} name='hour' type='number' value={data.hour} max={24} min={0}/>
                            <Input placeholder='Min' onChange={handleChange} name='minute' type='number' value={data.minute} max={60} min={0}/>
                            <Input placeholder='Sec' onChange={handleChange} name='second' type='number' value={data.second} max={60} min={0}/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                    <Button disabled={isLoading} onClick={handleCreate}>
                        {
                            isLoading ? <Loader2 className="animate-spin" /> : "Create"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CreateCronJob