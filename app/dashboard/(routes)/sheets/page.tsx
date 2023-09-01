
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import Sheets from "./components/Sheets"
import AddSheet from "./components/AddSheet"

const page : React.FC = () => {
  return (
    <div className="p-10">
            <Tabs defaultValue="sheets" >
                <TabsList>
                    <TabsTrigger value="sheets">Sheets</TabsTrigger>
                    <TabsTrigger value="add_sheet">Add Sheet</TabsTrigger>
                </TabsList>

                <TabsContent value="sheets">
                    <Sheets/>
                </TabsContent>
                <TabsContent value="add_sheet">
                    <AddSheet/>
                </TabsContent>
                
            </Tabs>
        </div>
  )
}

export default page