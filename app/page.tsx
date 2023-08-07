import { Menu } from "lucide-react";
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen bg-[#37517E] p-10">
    <div className="md:container md:mx-auto">
  
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl text-white">LOGO</h1>
        </div>
        <Navbar />
        <div className="md:flex space-x-5 hidden text-white">
          <Link href={"/pricing"}>Pricing</Link>
          <Link href={"/contact"}>Contact Us</Link>
          <Link href={"/about"}>About Us</Link>
        </div>
      </div>
  
      <div className="grid  items-center md:grid-cols-2 mt-[40px] md:mt-[70px]">
        <div className="order-2 md:order-1">
          <h1 className="font-bold text-white md:text-6xl text-4xl">
            Better Solutions For Your Business
          </h1>
          <p className="mt-5 text-[#AFB9CB] text-muted-foreground">
            We are a team of talented designers making websites with Bootstrap
          </p>
          <div className="mt-[60px] flex space-x-6">
            <Link href="/login"><button className="bg-[#47B2E4] text-white rounded-full px-10 py-2 hover:bg-transparent transition duration-500">Log In</button></Link>
            <button className="border text-white border-[#47B2E4] rounded-full px-10 py-2">Register</button>
          </div>
        </div>
  
        <div className="relative md:order-2 order-1 md:h-[500px] animated-div h-[300px]">
            <Image alt="logo"  fill src="/hero-img.png" layout="fill" objectFit="contain" />
        </div>
      </div>
  
    </div>
  </div>
  
  )
}
