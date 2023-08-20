
import { ArrowBigRight, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import Navbar from "@/components/Navbar";

export default async function Home() {

  const session = await getServerSession();

  const scheduler = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/scheduler`);
  const schedulerData = await scheduler.json();
  console.log("🚀 ~ file: page.tsx:14 ~ Home ~ schedulerData:", schedulerData)

  return (
    <div className="min-h-screen min-w-screen bg-[#37517E] p-10">
      <div className="md:container md:mx-auto">
          <Navbar isHome={true}/>
        <div className="grid  items-center md:grid-cols-2 mt-[40px] md:mt-[70px]">
          <div className="order-2 md:order-1">
            <h1 className="font-bold text-white md:text-6xl text-4xl">
              Better Solutions For Your Business
            </h1>
            <p className="mt-5 text-[#AFB9CB] text-muted-foreground">
              We are a team of talented designers making websites with Bootstrap
            </p>
            <div className="mt-[60px] flex space-x-6">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="bg-[#47B2E4] cursor-pointer flex space-x-2 text-white rounded-full px-10 py-2 hover:bg-transparent transition duration-500"
                >
                  <button className="">Dashboard</button>{" "}
                  <ArrowBigRight className="arrow" />
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <button className="bg-[#47B2E4] text-white rounded-full px-10 py-2 hover:bg-transparent transition duration-500">
                      Log In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="border text-white border-[#47B2E4] rounded-full px-10 py-2">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative md:order-2 order-1 md:h-[500px] animated-div h-[300px]">
            
            <Image alt="logo"  fill src="/hero-img.png" layout="fill" objectFit="contain" />
        </div>
        </div>
      </div>
    </div>
  );
}
