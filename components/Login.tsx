"use client"
import React from 'react'
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { signIn } from 'next-auth/react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            toast({ description: "Invalid email or password",variant:"destructive"})
            setLoader(false);
            return
        }

        toast({description: "Successfully logged in", className:"bg-green-500 text-white"});
        router.push("/dashboard");
    };

  return (
    <>
    <div className="flex h-screen items-center justify-center">
            {loader ? <Loader /> :<div className="bg-white p-8 shadow-lg rounded-lg w-96">
                 <><h2 className="text-2xl font-bold mb-4">Log in to Your Account</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
                            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500" />
                        </div>
                        <button type="submit" className="w-full bg-[#4F46E5] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Log In</button>
                    </form></>
            </div>}
        </div>
    </>
  )
}

export default Login