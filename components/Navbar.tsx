"use client"
import Link from 'next/link'
import React from 'react'
import MobileSidebar from './MobileNavbar'
import { cn } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { ArrowBigRight } from 'lucide-react'
import PricingList from './PricingList'
import { useSession } from 'next-auth/react'

const Navbar = ({ isHome }: { isHome: boolean }) => {

  const {data:session,status} = useSession();
  if(status=="loading"){return}
  

  return (
    <div className='md:container md:mx-auto p-10'>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn("text-4xl text-white", !isHome ? "text-black" : "text-white")}>LOGO</h1>
        </div>
        <MobileSidebar isHome={isHome} />
        <div className={cn("md:flex items-center space-x-5 hidden text-red",isHome?"text-white":"text-black")}>
          <PricingList/>
          <Link href={"/contact"}>Contact Us</Link>
          <Link href={"/about"}>About Us</Link>
          {
           
            !isHome ? session?.user ?  (
              <Link
                href="/dashboard"
                className="bg-[#4F46E5] hover:text-[#4F46E5] cursor-pointer flex space-x-2 text-white rounded-full px-10 py-2 hover:bg-transparent transition duration-500"
              >
                <button className="">Dashboard</button>{" "}
                <ArrowBigRight className="arrow" />
              </Link>
            ): (
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
            ) : (
              <></>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default Navbar