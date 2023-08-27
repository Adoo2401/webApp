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
import getRecurringIntervalInHours from '@/lib/getRecurringIntervalInHours';
import getRecurringIntervalInMinutes from '@/lib/getRecurringIntervalInMinutes';

type Params = {
    params:{
        jobId:string
    }
}

const EditCronJob = ({params}:Params) => {

    const { toast } = useToast();
    const [isProductLoading, setIsProductLoading] = useState(true);
    const [isSingleCronJobLoading, setIsSingleCronJobLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ product: "", hour: "", minute: "" });
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


    async function fetchSingleCronJob(){
        try {
            
            let singleCronJob : any = await fetch(`/api/cronJobs/${params.jobId}`);
            singleCronJob = await singleCronJob.json();

            if(singleCronJob.success){
                setData({
                    product: singleCronJob.message.planName,
                    hour:getRecurringIntervalInHours(singleCronJob.message.hours,true),
                    minute:getRecurringIntervalInMinutes(singleCronJob.message.minutes,true)
                });
                return
            }

            toast({ title: "Error", description: singleCronJob.message });
            

        } catch (error:any) {
            toast({ title: "Error", description: error.message })
        }
        finally{
            setIsSingleCronJobLoading(false);
        }
    }

    useEffect(()=>{
        fetchSingleCronJob();
    },[params])

    function generateMinutesArray(intervalInMinutes:number) {
        const minutesArray = [];
        
        for (let i = 0; i < 60; i += intervalInMinutes) {
          minutesArray.push(i);
        }
        
        return minutesArray;
    }
    function generateHoursArray(intervalInHours:number) {
        const hoursArray = [];
      
        for (let i = 0; i < 24; i += intervalInHours) {
          hoursArray.push(i);
        }
      
        return hoursArray;
      }

    async function handleEdit() {
        
        if (!data.product) { return toast({ description: "Please add all fields" }) };
        if(!data.minute && !data.hour){return toast({description:"Please add Hour or Minute"})};
        if(parseInt(data.minute)<0){return toast({description:"Minutes must be positive number"})};
        if(parseInt(data.hour)<0){return toast({description:"Hours must be positive number"})};
        if(parseInt(data.minute)>59){return toast({description:"Minutes must be less than 60"})};
        if(parseInt(data.hour)>24){return toast({description:"Hours must be less than 24"})};
        if(data.hour && data.minute){return toast({description:"Please choose either hours or minutes"})};

        let hoursArray = generateHoursArray(parseInt(data.hour));
        let minsArray = generateMinutesArray(parseInt(data.minute)); 
        
        setIsLoading(true)

        try {

            let API: any = await fetch(`/api/cronJobs/${params.jobId}`, { method: "PUT", body: JSON.stringify({ productId: data.product,hours:hoursArray,minutes:minsArray }), headers: { "Content-Type": "application/json" } });
            API = await API.json();
            if (API.success) {
                toast({ title: "Success", description: API.message });
                return
            }
            toast({ title: "Error", description: API.message });

        } catch (err: any) {
            toast({ title: "Error", description: err.message })
        } finally{
            setIsLoading(false);
        }
    }

    if(isSingleCronJobLoading){
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
                    <CardTitle>Edit Cron Jobs</CardTitle>
                    <CardDescription>
                        Easily Edit your cron jobs from here
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
                                        isProductLoading ? <Loader className="animate-spin" /> : products.map((product: any,index:number) => {
                                            return (
                                                <>
                                                    <SelectItem key={product.productId} value={product.productId}>{product.name}</SelectItem>
                                                </>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='grid gap-2'>
                        <div className='gap-4 grid grid-cols-1'>
                            <div className='flex space-x-4 items-center'>
                                <Label htmlFor='hour'>Every</Label>
                                <Input value={data.hour} onChange={handleChange} name="hour" type='number' max={24} />
                                <p>Hour</p>
                            </div>

                        </div>
                        <div className='gap-4 grid grid-cols-1'>
                            <div className='flex space-x-4 items-center'>
                                <Label htmlFor='hour'>Every</Label>
                                <Input value={data.minute} onChange={handleChange} name="minute" type='number' max={60} />
                                <p>Minute</p>
                            </div>

                        </div>

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

export default EditCronJob