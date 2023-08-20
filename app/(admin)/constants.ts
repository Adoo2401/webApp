import { Code, User2 , LayoutDashboard, DollarSign ,MusicIcon, Settings, CircleDollarSign, Timer } from "lucide-react";


const routes = [
    {
        label:"Dashboard",
        icon:LayoutDashboard,
        href:"/admin/dashboard",
        color:"#0ea5e9"
    },
    {
        label:"Users",
        icon:User2,
        href:"/admin/user",
        color:"#8b5cf6"
    },
    {
        label:"Customers",
        icon:DollarSign,
        href:"/admin/customers",
        color:"#be185d"
    },
    {
        label:"Stripe",
        icon:CircleDollarSign,
        href:"/admin/stripe",
        color:"#c2410c"
    },
    {
        label:"Cron Jobs",
        icon:Timer,
        href:"/admin/cron_jobs",
        color:"#10b981"
    },
    {
        label:"Code Generation",
        icon:Code,
        href:"/admin/code",
        color:"#15803d"
    },
    {
        label:"Setting",
        icon:Settings,
        href:"/admin/setting",
    },
]

export {routes}