import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import { ThemeProvider } from '@/components/ThemeProvider'

const layout = ({children}:{children:React.ReactNode}) =>{
     return(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="h-full relative">
            <div className="hidden h-full xl:flex xl:w-72 xl:flex-col xl:fixed xl:inset-y-0 z-[80] bg-gray-900">
               <Sidebar/>
            </div>
            <main className="xl:pl-72">
                <Navbar/>
               {children}
            </main>
        </div>
      </ThemeProvider>
     )
}

export default layout