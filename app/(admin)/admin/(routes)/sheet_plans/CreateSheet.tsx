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

const CreateSheet = () => {

    const { toast } = useToast();
    const [isProductLoading, setIsProductLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ product: "",sheets:""});
    const [products, setProducts] = useState([]);

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
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

    async function handleCreate() {
        
        if (!data.product ||!data.sheets || parseInt(data.sheets)==0) { return toast({ description: "Please add all fields" }) };
        if(parseInt(data.sheets)<0){return toast({description:"Sheets must be positive number"})};

        setIsLoading(true)

        try {

            let API: any = await fetch("/api/sheets", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
            API = await API.json();
            if (API.success) {
                toast({ title: "Success", description: API.message });
                setIsLoading(false);
                return
            }

            setIsLoading(false);
            toast({ title: "Error", description: API.message });

        } catch (err: any) {
            setIsLoading(false);
            toast({ title: "Error", description: err.message })
        }
    }


    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create Sheets Plan</CardTitle>
                    <CardDescription>
                        Easily create your Sheets Plan from here
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
                    <div className="grid gap-2">
                        <Label htmlFor="currency">No of sheets</Label>
                        <Input value={data.sheets} name="sheets" onChange={handleChange} id="sheets" placeholder="No of sheets user can use in a selected plan" />
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

export default CreateSheet