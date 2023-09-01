
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import Orders from "./components/Orders"

type Params = {
    params:{
        googleSheetId: string
    }
}

const page = ({ params }:Params) => {
    
  return (
    <div className="p-10">
            <Tabs defaultValue="orders" >
                <TabsList>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                    <Orders googleSheetId={params.googleSheetId}/>
                </TabsContent>
                
            </Tabs>
        </div>
  )
}

export default page