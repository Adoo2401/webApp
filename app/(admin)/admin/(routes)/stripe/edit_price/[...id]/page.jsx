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
import { Loader, Loader2, Loader2Icon } from "lucide-react"
import { WithContext as ReactTags } from 'react-tag-input';
import { Checkbox } from "@/components/ui/checkbox"

function EditStripePrice({params}) {

    const [isLoading, setIsLoading] = useState(false);
    const [isPriceLoading,setIsPriceLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [tags, setTags] = useState([]);
    const [isTrial, setIsTrial] = useState(false);
    const { toast } = useToast();
    const [data, setData] = useState({active:false, features:tags,trial: "", currency: "", unit_amount: 0, interval: "month" })

    useEffect(()=>{
        setData({...data,features:tags})
    },[tags])


    async function fetchSinglePrice(){
        try {
            
            let API = await fetch(`/api/getSinglePrice/${params.id[0]}/${params.id[1]}`);
            API = await API.json();

            if(API.success){
                setData({...API.message,trial:API.message.trialPeriod});
                setTags(API.message.features.map(feature=>{
                    return{
                        id:feature,
                        text:feature
                    }
                }))
                setIsTrial(API.message.trial)
                
                return setIsPriceLoading(false);
            }

            toast({title:"Error",description:API.message})


        } catch (error) {
            toast({title:"Error",description:error.message})
        }
    }

    useEffect(()=>{
        fetchSinglePrice();
    },[params])
    
    

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
    
        setTags([...tags  , tag  ]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag  );

        // re-render
        setTags(newTags);
    };

    

    function handleChange(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    async function handleEdit() {

        if (!data.unit_amount || !data.currency  || !data.interval) { return toast({ description: "Please add all fields" }) };
        setIsLoading(true)

        try {

            let API = await fetch(`/api/editPrice/${params.id[1]}/${params.id[0]}`, { method: "PUT", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
            API = await API.json();

            if (API.success) {
                toast({ title: "Success", description: "Stripe Price Updated" });
                setIsLoading(false);
                return
            }

            toast({ title: "Error", description: API.message })
            setIsLoading(false);

        } catch (error) {
            toast({ title: "Error", description: error.message })
            setIsLoading(false)

        }
    }

    if(isPriceLoading){
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
                    <CardTitle>Edit Stripe Price</CardTitle>
                    <CardDescription>
                        Easily edit your stripe Price for product from here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="security-level">Intervals</Label>
                            <Select defaultValue={data.interval} name="interval" onValueChange={(value) => setData({ ...data, interval: value })}>
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
                        <div className="items-top flex space-x-2">
                            <Checkbox checked={data.active} onCheckedChange={() =>setData({ ...data, active:!data.active })} id="terms1" />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Active
                                </label>
                            </div>
                        </div>
                        
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input value={data.currency} readOnly name="currency" onChange={handleChange} id="currency" placeholder="Three-letter ISO currency code, in lowercase. Must be a supported currency." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Unit Amount</Label>
                        <Input type="number" readOnly value={data.unit_amount} name="unit_amount" onChange={handleChange} id="unit_amount" placeholder="A positive integer in cents (or 0 for a free price) representing how much to charge." />

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