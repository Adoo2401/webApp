"use client"

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from './Sidebar';
import Theme from '@/app/dashboard/components/Theme'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"


const Navbar = () => {

  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }



  const [firstName, lastName] = session?.user?.name?.split(' ') || []
  if (status !== "authenticated") { return }

  return (

    <div className="flex items-center p-4">
      <Sheet>
        <SheetTrigger>
          <Button variant={"ghost"} size={"icon"} className="">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className='p-0'>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-grow"></div>

      <div className="self-end flex space-x-6">
        <Avatar className="cursor-pointer">
          <AvatarImage src={session?.user?.image} />
          <AvatarFallback className="uppercase">{firstName?firstName.charAt(0):""}{lastName?lastName.charAt(0):""}</AvatarFallback>
        </Avatar>
        <Theme/>
      </div>
    </div>


  );
};

export default Navbar;
