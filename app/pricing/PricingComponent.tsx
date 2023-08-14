"use client"

import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { Check, Loader, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const includedFeatures = [
    'Private forum access',
    'Member resources',
    'Entry to annual conference',
    'Official member t-shirt',
]


const pricing = [
    {
        priceKey: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_API_KEY,
        planName: "Basic",
        features: includedFeatures,
        price: "$10"
    },
    {
        priceKey: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_API_KEY,
        planName: "Pro",
        features: includedFeatures,
        price: "$20"
    },
    {
        priceKey: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_API_KEY,
        planName: "Premium",
        features: includedFeatures,
        price: "$30"
    },
]



export default function PricingComponent() {

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const {data:session} = useSession();

    const handleSubscribe = async (apiKey: string,planName:string) => {

        if(!session?.user?.email){
            toast({ description: "Please login to subscribe", variant: "destructive" });
            return
        }

        setIsLoading(true);
        toast({ description: <div className="flex space-x-2"><p>Opening Secure Checkout Page </p><Loader2 className="animate-spin" /></div>, variant: "default" });

        try {
            let API: any = await fetch("/api/stripe", { method: "POST", body: JSON.stringify({ stripePriceId: apiKey, planName }), headers: { "Content-Type": "application/json" } });
            API = await API.json();
            if (API.success) {
                window.location.href = API.message
                return
            }

            toast({ title: "Failed", description: API.message, variant: "destructive" });
            setIsLoading(false)
        } catch (error:any) {

           toast({ title: "Failed", description: error.message, variant: "destructive" });
           setIsLoading(false);
        }
    }

    return (
        <div className="bg-white p-15 sm:p-6 mt-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas
                        in. Explicabo id ut laborum.
                    </p>
                </div>
                <div className={isLoading ? "opacity-40" : ""}>
                    {
                        pricing.map((price) => (
                            <div key={price.planName} className="mx-auto mt-5 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                                <div className="p-8 sm:p-10 lg:flex-auto">
                                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">{price.planName}</h3>
                                    <p className="mt-6 text-base leading-7 text-gray-600">
                                        Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                                        repellendus etur quidem assumenda.
                                    </p>
                                    <div className="mt-10 flex items-center gap-x-4">
                                        <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                                        <div className="h-px flex-auto bg-gray-100" />
                                    </div>
                                    <ul
                                        role="list"
                                        className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                                    >
                                        {includedFeatures.map((feature) => (
                                            <li key={feature} className="flex gap-x-3">
                                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                                    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                        <div className="mx-auto max-w-xs px-8">
                                            <p className="text-base font-semibold text-gray-600">lorem ipsum lorem ipsum</p>
                                            <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                                <span className="text-5xl font-bold tracking-tight text-gray-900">{price.price}</span>
                                                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                                            </p>
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handleSubscribe(price.priceKey!,price.planName.toLowerCase())}
                                                className={cn("mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",isLoading?"cursor-not-allowed":"cursor-pointer")}
                                            >
                                                {isLoading ? <Loader className='animate-spin' /> : "Subscribe"}
                                            </button>
                                            <p className="mt-6 text-xs leading-5 text-gray-600">
                                                Invoices and receipts available for easy company reimbursement
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
