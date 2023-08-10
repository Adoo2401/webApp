"use client"

import { FileSpreadsheet, Key, ListOrdered, Loader2, Lock, Sheet, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [codeInAfricaAPIKey, setCodeInAfricaAPIKey] = useState("");
  const [productName, setProductName] = useState("");
  const [codeInAfricaSecretKey, setCodeInAfricaSecretKey] = useState("");
  const [googleSheetId, setGoogleSheetId] = useState("");
  const [orderIdPrefix, setOrderIdPrefix] = useState("");
  const [sheetId, setSheetId] = useState("");

  const inputs = [
    {
      placeHolder: "Code In Africa API Key",
      icon: Key,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#8b5cf6",
      label: "Code in Africa API Key",
      description: "Code in Africa API key can be found in your Code Africa dashboard settings",
      value: codeInAfricaAPIKey,
      setter: setCodeInAfricaAPIKey,
    },
    {
      placeHolder: "Code Africa Secret Key",
      icon: Lock,
      bgColor: "rgba(16, 185, 129,0.1)",
      color: "#10b981",
      label: "Code in Africa Secret Key",
      description: "Code in Africa secret key can be found in your Code Africa dashboard settings",
      value: codeInAfricaSecretKey,
      setter: setCodeInAfricaSecretKey,
    },
    {
      placeHolder: "Google Sheet ID",
      icon: Sheet,
      bgColor: "rgba(190, 24, 93,0.1)",
      color: "#be185d",
      label: "Google Sheet ID",
      description: "Found at your Google Sheet URL docs.google.com/spreadsheets/d/YOUR_GOOGLE_SHEET_ID",
      value: googleSheetId,
      setter: setGoogleSheetId,
    },
    {
      placeHolder: "Sheet ID",
      icon: FileSpreadsheet,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#c2410c",
      label: "Sheet ID",
      description: "Found at your Google Sheet URL spreadsheets/d/GOOGLE_SHEET_ID/edit#gid=YOUR_SHEET_ID",
      value: sheetId,
      setter: setSheetId,
    },
    {
      placeHolder: "Product Name",
      icon: ShoppingCart,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#c2410c",
      label: "Product Name",
      description: "Add your Product Name that is registered in Code in Africa dashboard",
      value: productName,
      setter: setProductName,
    },
    {
      placeHolder: "Order ID Prefix",
      icon: ListOrdered,
      bgColor: "rgba(139, 92, 246,0.1)",
      color: "#c2410c",
      label: "Order ID Prefix",
      description: "Add your Order ID prefix in the format of order-7",
      value: orderIdPrefix,
      setter: setOrderIdPrefix,
    },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    toast({ description:<div className="flex space-x-2"><p>Creating your order please wait </p><Loader2 className="animate-spin"/></div>, variant: "default"});

    const formData = {
      googleSheetId,
      prefix: orderIdPrefix,
      apiKey: codeInAfricaAPIKey,
      apiSecret: codeInAfricaSecretKey,
      product: productName,
      sheetId,
    };

    try {
      const response = await fetch('/api/getSheet', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const API = await response.json();

      if(API.success){
        toast({title:"Created",description:API.message,className:"bg-green-500 text-white"});
        setIsLoading(false);
        return
     }

     toast({title:"Failed",description:API.message,variant:"destructive"});
     setIsLoading(false);

    } catch (error) {
      toast({ title: "Error", description: "An error occurred during API call", variant: "destructive" });
    } 
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of Web
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Use our app to easily transfer your Google Sheets to Code in Africa
        </p>
      </div>
      <form onSubmit={handleSubmit} className={cn("py-20 md:px-20 lg:px-32  grid lg:grid-cols-2 gap-y-10 lg:gap-x-4", isLoading?"opacity-40":"")}>
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
                <Input value={input.value} onChange={(e) => input.setter(e.target.value)} required placeholder={input.placeHolder} />
              </div>
            </Card>
          ))}
          <div className="flex lg:col-span-2 justify-center">
            <Button disabled={isLoading} className="lg:flex-[0.5]">
              {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      
    </div>
  )
}
