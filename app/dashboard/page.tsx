"use client"

import { FileSpreadsheet, Key, ListOrdered, Lock, Sheet, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function Dashboard() {

  const codeInAfricaAPIKey = useRef(null);
  const productName = useRef(null);
  const codeInAfricaSecretKey = useRef(null);
  const googleSheetId = useRef(null);
  const orderIdPrefix = useRef(null);
  const sheetId = useRef(null);

  const inputs = [
    {
      placeHolder: "Code In Africa API Key",
      icon: Key,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#8b5cf6",
      label: "Code in africa API Key",
      description: "code in africa api key can be found in your code africa dashboard setting",
      ref: codeInAfricaAPIKey
    },
    {
      placeHolder: "Code Africa Secret Key",
      icon: Lock,
      bgColor: "rgba(16, 185, 129,0.1)",
      color: "#10b981",
      label: "Code in africa Secret Key",
      description: "code in africa secret key can be found in your code africa dashboard setting",
      ref: codeInAfricaSecretKey
    },
    {
      placeHolder: "Google Sheet ID",
      icon: Sheet,
      bgColor: "rgba(190, 24, 93,0.1)",
      color: "#be185d",
      label: "Google Sheet ID",
      description: "found at your google sheet URL docs.google.com/spreadsheets/d/YOUR_GOOGLE_SHEET_ID",
      ref: googleSheetId
    },
    {
      placeHolder: "Sheet ID",
      icon: FileSpreadsheet,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#c2410c",
      label: "Sheet ID",
      description: "found at your google sheet URL spreadsheets/d/GOOGLE_SHEET_ID/edit#gid=YOUR_SHEET_ID",
      ref: sheetId
    },
    {
      placeHolder: "Product Name",
      icon: ShoppingCart,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#c2410c",
      label: "Product Names",
      description: "Add your Product Name that is registerd in code in africa dashboard",
      ref:productName
    },
    {
      placeHolder: "Order ID Prefix",
      icon: ListOrdered,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#c2410c",
      label: "Order ID Prefix",
      description: "Add your Order ID prefix in formate of order-7",
      ref: orderIdPrefix,
      
    },

  ]

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of Web
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Use our app to easily transfer you google sheets to codeinafrica
        </p>
      </div>
      <form onSubmit={handleSubmit} className="py-20 md:px-20 lg:px-32  grid lg:grid-cols-2 gap-y-10 lg:gap-x-4">
        {inputs.map((input) => (
          <Card key={input.placeHolder} className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-x-4">
              <div style={{ background: input.bgColor }} className={"p-2 w-fit rounded-md"}>
                <input.icon color={input.color} className={"w-8 h-8"} />
              </div>
              <div className="font-semibold">
                {input.label}
              </div>
            </div>
            <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">{input.description}</p>
            <div className="mt-4">
               <Input ref={input.ref} required placeholder={input.placeHolder} />
            </div>
          </Card>
        ))}
        <div className="flex lg:col-span-2 justify-center">
          <Button className="lg:flex-[0.5]">Submit</Button>
        </div>
      </form>
    </div>
  )
}
