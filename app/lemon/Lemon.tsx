"use client"

import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

const Lemon = () => {

  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  async function handleClick(plan:string,variantId:string){
       if(!session?.user?.email){
        return toast({description:"Please login to subscribe",variant:"destructive"})
       }
       setLoading(true);

       try {
        
          let API :any = await fetch("/api/lemon",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan,variantId})})

          API = await API.json();
          
          if(API.success){
            window.location.href = API.message
            return
          }

          toast({description:API.message,variant:"destructive"})

       } catch (error:any) {
        
         toast({description:error.message,variant:"destructive"})
       } finally{
        setLoading(false)
       }


  }

  return (
    <div className="bg-white p-15 sm:p-6 mt-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pricing</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Pay with lemon squeezys
                        </p>
                    </div>

            <div>
                        <div  className="mx-auto mt-5 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                            <div className="p-8 sm:p-10 lg:flex-auto">
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Basic</h3>
                                <p className="mt-6 text-base leading-7 text-gray-600">
                                    This is my basic plan
                                </p>
                                <div className="mt-10 flex items-center gap-x-4">
                                    <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                                    <div className="h-px flex-auto bg-gray-100" />
                                </div>
                               
                            </div>
                            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                    <div className="mx-auto max-w-xs px-8">
                                        <p className="text-base font-semibold text-gray-600">lorem ipsum lorem ipsum</p>
                                        
                                        <button
                                            disabled={loading}
                                            onClick={()=>handleClick("basic","125789")}
                                            className={cn("mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
                                        >
                                            {
                                                loading?<Loader className='animate-spin'/>:"Subscribe"
                                            }
                                        </button>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                 
            </div>
            </div>
            </div>
  )
}

export default Lemon