import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateSheet from './CreateSheet'
import Sheet from './Sheet'


const page = () => {
  return (
    <div className="p-10">
      <Tabs defaultValue="sheets" >
        <TabsList>
          <TabsTrigger value="sheets">Sheets</TabsTrigger>
          <TabsTrigger value="add_sheet_plan">Add Sheet Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="sheets"><Sheet/></TabsContent>
        <TabsContent value="add_sheet_plan"><CreateSheet/></TabsContent>

      </Tabs>
    </div>
  )
}

export default page