import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";
import Product from "@/app/api/models/Product";
import mongoose from "mongoose";
import automate from "./automate";

export async function GET(request: Request) {

  try {
    
      const url = new URL(request.url);
      const productName = url.searchParams.get("productName");      

      if(!productName){return NextResponse.json({success:false,message:"Search Params empty"},{status:400})};
      

      await mongoose.connect(process.env.MONGODB_URL!);
      await automate(productName);
      
    
    return NextResponse.json({ success: true, message:productName});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"