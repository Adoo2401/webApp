"use client";

import {
  FileSpreadsheet,
  Key,
  ListOrdered,
  Loader2,
  Lock,
  Sheet,
  ShoppingCart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from "@/components/ui/select";
import Link from "next/link";


export default function Dashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [codeInAfricaAPIKey, setCodeInAfricaAPIKey] = useState("");
  const [productName, setProductName] = useState("");
  const [isKeysLoading,setIsKeysLoading] = useState(true);
  const [codeInAfricaSecretKey, setCodeInAfricaSecretKey] = useState("");
  const [googleSheetId, setGoogleSheetId] = useState("");
  const [disable,setDisable] = useState(false);
  const [orderIdPrefix, setOrderIdPrefix] = useState("");
  const [googleSheetIDs, setGoogleSheetIDs] = useState([]);
  const [sheetId, setSheetId] = useState("");

  async function fetchKeys() {
    try {
      const response: any = await fetch("/api/getKeys");
      const API = await response.json();

      if (API.success) {
        if(API.codeInAfricaKey){
          setDisable(true)
        }
        setCodeInAfricaAPIKey(API.codeInAfricaKey);
        setCodeInAfricaSecretKey(API.codeInAfricaSecretKey);
        setGoogleSheetIDs(API.googleSheetIDs);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred during API call",
        variant: "destructive",
      });
    } finally {
      setIsKeysLoading(false);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    toast({
      description: (
        <div className="flex space-x-2">
          <p>Creating your order please wait </p>
          <Loader2 className="animate-spin" />
        </div>
      ),
      variant: "default",
    });

    const formData = {
      googleSheetId,
      prefix: orderIdPrefix,
      apiKey: codeInAfricaAPIKey,
      apiSecret: codeInAfricaSecretKey,
      product: productName,
      sheetId,
    };

    try {
      const response = await fetch("/api/getSheet", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const API = await response.json();

      if (API.success) {
        toast({
          title: "Created",
          description: API.message,
          className: "bg-green-500 text-white",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Failed",
        description: API.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An error occurred during API call",
        variant: "destructive",
      });
    }
  };


  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of Web
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Use our app to easily transfer your Google Sheets to Code in Africa. Already uploaded sheets to Code in Africa?
        </p>
      </div>
      {
        isKeysLoading ? <div className="flex justify-center items-center"><Loader2 className="animate-spin" /> </div>: <form
        onSubmit={handleSubmit}
        className={cn(
          "py-20 md:px-20 lg:px-32  grid lg:grid-cols-2 gap-y-10 lg:gap-x-4",
          isLoading ? "opacity-40" : ""
        )}
      >
        <Card className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-x-4">
            <div
              style={{ background: "rgba(139, 92, 246,0.1)" }}
              className={"p-2 w-fit rounded-md"}
            >
              <Key color={"#8b5cf6"} className={"w-8 h-8"} />
            </div>
            <div className="font-semibold">Code In Africa API Key</div>
          </div>
          <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">
            Code in Africa API key can be found in your Code Africa dashboard
            settings
          </p>
          <div className="mt-4">
            <Input
              value={codeInAfricaAPIKey}
              disabled={disable}
              onChange={(e) => setCodeInAfricaAPIKey(e.target.value)}
              required
              placeholder={"Code In Africa API Key"}
            />
          </div>
        </Card>
        <Card className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-x-4">
            <div
              style={{ background: "rgba(139, 92, 246,0.1)" }}
              className={"p-2 w-fit rounded-md"}
            >
              <Lock color={"#10b981"} className={"w-8 h-8"} />
            </div>
            <div className="font-semibold">Code Africa Secret Key</div>
          </div>
          <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">
            Code in Africa API key can be found in your Code Africa dashboard
            settings
          </p>
          <div className="mt-4">
            <Input
              value={codeInAfricaSecretKey}
              disabled={disable}
              onChange={(e) => setCodeInAfricaSecretKey(e.target.value)}
              required
              placeholder={"Code Africa Secret Key"}
            />
          </div>
        </Card>
        <Card className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-x-4">
            <div
              style={{ background: "rgba(139, 92, 246,0.1)" }}
              className={"p-2 w-fit rounded-md"}
            >
              <Sheet color={"#be185d"} className={"w-8 h-8"} />
            </div>
            <div className="font-semibold">Google Sheet ID</div>
          </div>
          <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">
            Found at your Google Sheet URL
            docs.google.com/spreadsheets/d/YOUR_GOOGLE_SHEET_ID
          </p>
          <div className="mt-4 flex-1 self-stretch">
            {
              googleSheetIDs.length > 0 ? <Select required onValueChange={(e) => setGoogleSheetId(e)}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {
                    googleSheetIDs.map((item: any, index: number) => (
                      <SelectItem value={item} key={item}>{item}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
                : <Input
                  value={googleSheetId}
                  onChange={(e) => setGoogleSheetId(e.target.value)}
                  required
                  placeholder={"Google Sheet ID"}
                />
            }
          </div>
        </Card>
        <Card className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-x-4">
            <div
              style={{ background: "rgba(139, 92, 246,0.1)" }}
              className={"p-2 w-fit rounded-md"}
            >
              <FileSpreadsheet color={"#c2410c"} className={"w-8 h-8"} />
            </div>
            <div className="font-semibold">Sheet ID</div>
          </div>
          <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">
          Found at your Google Sheet URL spreadsheets/d/GOOGLE_SHEET_ID/edit#gid=YOUR_SHEET_ID
          </p>
          <div className="mt-4">
            <Input
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              required
              placeholder={"Sheet ID"}
            />
          </div>
        </Card>
        <Card className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-x-4">
            <div
              style={{ background: "rgba(139, 92, 246,0.1)" }}
              className={"p-2 w-fit rounded-md"}
            >
              <ShoppingCart color={"#c2410c"} className={"w-8 h-8"} />
            </div>
            <div className="font-semibold">Product Name</div>
          </div>
          <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">
          Add your Product Name that is registered in Code in Africa dashboard
          </p>
          <div className="mt-4">
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              placeholder={"Product Name"}
            />
          </div>
        </Card>
        <Card className="p-4 border-black/5 max-w-full  flex flex-col items-center justify-between hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-x-4">
            <div
              style={{ background: "rgba(139, 92, 246,0.1)" }}
              className={"p-2 w-fit rounded-md"}
            >
              <ListOrdered color={"#c2410c"} className={"w-8 h-8"} />
            </div>
            <div className="font-semibold">Order ID Prefix</div>
          </div>
          <p className="md:text-sm w-full text-xs mt-5 break-words text-muted-foreground text-center leading-5">
          Add your Order ID prefix in the format of order-7
          </p>
          <div className="mt-4">
            <Input
              value={orderIdPrefix}
              onChange={(e) => setOrderIdPrefix(e.target.value)}
              required
              placeholder={"Order ID Prefix"}
            />
          </div>
        </Card>

        <div className="flex lg:col-span-2 justify-center">
          <Button disabled={isLoading} className="lg:flex-[0.5]">
            {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </div>
      </form> 
      }
    </div>
  );
}
