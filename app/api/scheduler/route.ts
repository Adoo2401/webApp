import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";
import Product from "@/app/api/models/Product";
import mongoose from "mongoose";
import automate from "./automate";

export async function GET(request: Request) {

  try {
    
      await mongoose.connect(process.env.MONGODB_URL!);
      let products = await Product.find();
      let check;

      for (let i = 0; i < products.length; i++) {
        if (products[i].cronJobTiming) {
           check = await automate(products[i].name);
        } else {
          continue;
        }
      }
    
    return NextResponse.json({ success: true, message: check});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"