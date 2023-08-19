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
import { Loader, Loader2 } from "lucide-react"
import { WithContext as ReactTags } from 'react-tag-input';
import { Checkbox } from "@/components/ui/checkbox"

function EditStripePrice() {

    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [tags, setTags] = useState([]);
    const [isTrial, setIsTrial] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(true);
    const { toast } = useToast();
    const [data, setData] = useState({ features:tags,trial: "", currency: "", unit_amount: 0, interval: "month", product: "" })

    useEffect(()=>{
        setData({...data,features:tags})
    },[tags])


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

    const handleDelete = (i:any) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag:any) => {
    
        setTags([...tags as never, tag as never]);
    };

    const handleDrag = (tag:any, currPos:any, newPos:any) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag as never);

        // re-render
        setTags(newTags);
    };

    useEffect(() => {
        fetchProducts();
    }, [])


    function handleChange(e: any) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    async function handleCreate() {

        if (!data.unit_amount || !data.currency || !data.product || !data.interval) { return toast({ description: "Please add all fields" }) };
        setIsLoading(true)

        try {

            let API: any = await fetch("/api/addPrice", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: "Stripe Price Created" });
                setIsLoading(false);
                return
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error: any) {
            toast({ title: "Error", description: error.message })
            setIsLoading(false)

        }
    }


    return (
        <div className="p-8">

            <Card>
                <CardHeader>
                    <CardTitle>Create Stripe Price</CardTitle>
                    <CardDescription>
                        Easily create your stripe Price for product from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="area">Products</Label>
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
                        <div className="grid gap-2">
                            <Label htmlFor="security-level">Intervals</Label>
                            <Select defaultValue={data.product ? data.product : "month"} name="interval" onValueChange={(value) => setData({ ...data, interval: value })}>
                                <SelectTrigger
                                    id="interval"
                                    className="line-clamp-1 w-[160px] truncate"
                                >
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                    <SelectItem value="month">Month</SelectItem>
                                    <SelectItem value="year">Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap2">
                        <div className="items-top flex space-x-2">
                            <Checkbox checked={isTrial} onCheckedChange={() => { setIsTrial(!isTrial); setData({ ...data, trial: "" }) }} id="terms1" />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Free Trial
                                </label>
                            </div>
                        </div>

                        {
                            isTrial && <Input type="number" className="mt-4" value={data.trial} name="trial" onChange={handleChange} id="trial" placeholder="Enter number of days" />
                        }

                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input value={data.currency} name="currency" onChange={handleChange} id="currency" placeholder="Three-letter ISO currency code, in lowercase. Must be a supported currency." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Unit Amount</Label>
                        <Input type="number" value={data.unit_amount} name="unit_amount" onChange={handleChange} id="unit_amount" placeholder="A positive integer in cents (or 0 for a free price) representing how much to charge." />

                    </div>
                    <div className="grid gap-2">
                        <ReactTags 
                            tags={tags}
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            handleDrag={handleDrag}
                            inputFieldPosition="bottom"
                            autocomplete 
                            placeholder="Enter Multiple features press enter to add"
                            />
                            
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

export default EditStripePrice