"use client"

import { Button } from "@/components/ui/button";
import { ArrowBigRight, Loader, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";




const MobileSidebar = ({isHome}:{isHome:boolean}) => {

    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { data: session, status, update } = useSession()
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true)
    }, [])

    async function getSuccessParams() {
        if (status == "authenticated") {

            let message = searchParams.get("success");
            let plan = searchParams.get("plan");

            if (message == 'true') {

                 toast({ title: "Subscription Created", description: <div className="flex space-x-2"><p>Plese Wait while we redirect you to your dasbhoard</p><Loader className="animate-spin" /></div>, className: "bg-green-500 text-white" ,duration:3000});
                 let API : any = await fetch("/api/userPlan");
                 API = await API.json();

                 if(API.success){

                 let s =await update({ ...session, user: { ...session?.user, plan:API.message } })
                 return router.push("/dashboard");

                 }

                 toast({ title: "Subscription failed", description: "Try Again later", variant: "destructive" });

            } else if (message == "false") {
                toast({ title: "Subscription failed", description: "Try Again later", variant: "destructive" });
            }
        }
    }

    useEffect(() => {
        getSuccessParams();
    }, [searchParams,status])

    if (!isMounted) {
        return null
    }


    return (
        <Sheet>
            <SheetTrigger>
                <Button variant={"ghost"} size={"icon"} className={cn("md:hidden", !isHome?"text-black":"text-white")}>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <div className="flex space-y-5 flex-col items-center mt-10 ">
                    <Link href={"/pricing"}>Pricing</Link>
                    <Link href={"/contact"}>Contact Us</Link>
                    <Link href={"/about"}>About Us</Link>
                    {
            session?.user ? (
              <Link
                href="/dashboard"
                className="bg-[#4F46E5] cursor-pointer flex space-x-2 text-white rounded-full px-10 py-2 hover:bg-transparent transition duration-500"
              >
                <button className="">Dashboard</button>{" "}
                <ArrowBigRight className="arrow" />
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="bg-[#4F46E5] text-white rounded-full px-10 py-2 hover:bg-transparent hover:text-[#4F46E5] transition duration-500">
                    Log In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="border text-[#4F46E5] hover:text-white border-[#4F46E5] hover:bg-[#4F46E5] transition duration-500 rounded-full px-10 py-2">
                    Register
                  </button>
                </Link>
              </>
            )
          }
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
