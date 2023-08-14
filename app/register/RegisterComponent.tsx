"use client"

import Loader from '@/components/Loader';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, {useState } from 'react'

const RegisterComponent = () => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const [credentials,setCredentials] = useState({name:'',email:'',password:''});

  const handleInput = (event:React.ChangeEvent<HTMLInputElement>)=>{
      setCredentials({...credentials,[event.target.name]:event.target.value});
  }

  const handleSubmit = async ()=>{
    setIsLoading(true);
    try {
      
      let API : any = await fetch("/api/register",{method:"POST",headers:{ "Content-Type": "application/json" },body:JSON.stringify(credentials)});
      API = await API.json();

      if(API.success){
        toast({title:"Success",description:"user registerd successfully now login",className:"bg-green-500 text-white"})
        router.push("/login")
        return
      }

      setIsLoading(false);
      toast({title:"Failed",description:API.message,variant:"destructive"})


    } catch (error:any) {
      toast({title:"Failed",description:error.message,variant:"destructive"})
      setIsLoading(false)
    }
  }

  return (
    <>
      {
        isLoading?<Loader/>:<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="name"
                  type="text"
                  onChange={handleInput}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleInput}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInput}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?
            <Link href="/login" className="font-semibold ml-1 leading-6 text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
      }
    </>
  )
}

export default RegisterComponent