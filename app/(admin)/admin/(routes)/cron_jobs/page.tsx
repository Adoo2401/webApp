import React from 'react'
import Cronjob from './components/Cronjob'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateCronJob from './components/CreateCronJob'

const page = () => {
  return (
    <div className="p-10">
      <Tabs defaultValue="cronjobs" >
        <TabsList>
          <TabsTrigger value="cronjobs">Cron Jobs</TabsTrigger>
          <TabsTrigger value="create_cronjobs">Create Cron Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="cronjobs"><Cronjob /></TabsContent>
        <TabsContent value="create_cronjobs"><CreateCronJob /></TabsContent>

      </Tabs>
    </div>
  )
}

export default page