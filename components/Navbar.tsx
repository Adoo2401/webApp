"use client"

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"

const MobileSidebar = () => {

    const [isMounted, setIsMounted] = useState(false);
    const { data: session, status } = useSession()

    

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant={"ghost"} size={"icon"} className="md:hidden text-white">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <div className="flex space-y-5 flex-col items-center mt-10 ">
                    <Link href={"/pricing"}>Pricing</Link>
                    <Link href={"/contact"}>Contact Us</Link>
                    <Link href={"/about"}>About Us</Link>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
