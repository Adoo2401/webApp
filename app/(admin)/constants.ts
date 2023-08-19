import { Code, User2 , LayoutDashboard, DollarSign ,MusicIcon, Settings, CircleDollarSign } from "lucide-react";

export const payments = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    // ...
  ]
  

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
        label:"Music Generation",
        icon:MusicIcon,
        href:"/admin/music",
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