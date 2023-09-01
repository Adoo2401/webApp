"use client"

import { useToast } from '@/components/ui/use-toast';
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

const AddSheet = () => {

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ googleSheetId: "" });


    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }



    async function handleCreate() {

        if (!data.googleSheetId) return toast({ title: "Error", description: "Please enter google sheet id" })
        setIsLoading(true)

        try {

            let API: any = await fetch("/api/userSheets", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
            API = await API.json();
            if (API.success) {
                toast({ title: "Success", description: API.message });
                setIsLoading(false);
                return
            }

            setIsLoading(false);
            toast({ title: "Error", description: API.message,variant:"destructive" });

        } catch (err: any) {
            setIsLoading(false);
            toast({ title: "Error", description: err.message })
        }
    }


    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add Google Sheet</CardTitle>
                    <CardDescription>
                        Add your google sheet id from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="id">Google Sheet ID</Label>
                            <Input type='text' value={data.googleSheetId} id='id' name="googleSheetId" onChange={handleChange} placeholder='Enter Google Sheet Id' />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                    <Button disabled={isLoading} onClick={handleCreate}>
                        {
                            isLoading ? <Loader2 className="animate-spin" /> : "Add Sheet"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AddSheet