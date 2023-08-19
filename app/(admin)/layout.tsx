import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'



const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>

     <div className="flex h-screen">
      <div className="flex-1">
        <Navbar />
        <main className="p-2 ">{children}</main>
      </div>
    </div>
    </ThemeProvider>
  )
}

export default layout