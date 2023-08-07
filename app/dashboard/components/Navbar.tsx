"use client"

import MobileSidebar from "./MobileSidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Theme from './Theme'
import {useSession } from "next-auth/react"

const Navbar = () => {

   const {data:session,status} = useSession();
   const [firstName, lastName] = session?.user?.name?.split(' ') || []

   if(status!=="authenticated") {return}

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end space-x-5">
        <Avatar className="cursor-pointer">
          <AvatarImage src={session?.user?.image as undefined} />
          <AvatarFallback className="uppercase">{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <Theme/>
      </div>
    </div>
  )
}

export default Navbar