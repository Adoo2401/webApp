"use client"

import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { CircleDashed, FilePlus, LayoutDashboard, Sheet} from "lucide-react";
import {useTheme} from 'next-themes'


const monterrat = Montserrat({ weight: "600", subsets: ["latin"] });
const routes = [
    { href: "/dashboard", color: "#0ea5e9", label: "Dashboard", icon: LayoutDashboard},
    { href: "/dashboard/add_sheet_to_app", color: "#8b5cf6", label: "Add sheet to app first", icon: FilePlus },
    { href: "/dashboard/sheets", color: "#c2410c", label: "Sheets", icon: Sheet },
]


const Sidebar = () => {

    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center space-x-3 pl-3 mb-14">

                <div className="relative w-8 h-8 mr-8">
                        <Image fill alt="Logo" src="/logo.png" />
                    </div>

                    <h1 className={cn("text-2xl font-bold", monterrat.className)}>
                        Web App
                    </h1>
                </Link>
                <div className="space-y-4">
                    {
                        routes.map(route => (
                            <Link key={route.href} href={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400")}>
                                <div className="flex items-center flex-1">
                                    <route.icon color={route.color} className={"h-5 w-5 mr-3"} />
                                    {route.label}
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar
