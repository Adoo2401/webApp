
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

const page = () => {
  return (
    <div className="p-10">
            <Tabs defaultValue="sheets" >
                <TabsList>
                    <TabsTrigger value="sheets">Sheets</TabsTrigger>
                    <TabsTrigger value="add_sheet">Add Sheet</TabsTrigger>
                </TabsList>

                <TabsContent value="sheets"></TabsContent>
                <TabsContent value="add_sheet"></TabsContent>
                
            </Tabs>
        </div>
  )
}

export default page