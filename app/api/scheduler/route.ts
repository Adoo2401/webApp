import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";
import Product from "@/app/api/models/Product";
import mongoose from "mongoose";
import automate from "./automate";

export async function GET(req: NextRequest) {
  let schedulerStarted = process.env.SCHEDULER_STARTED!;
  console.log(
    "🚀 ~ file: route.ts:9 ~ GET ~ schedulerStarted:",
    schedulerStarted
  );
  let flag = false;

  try {
    if (schedulerStarted && flag == false) {
      await mongoose.connect(process.env.MONGODB_URL!);
      let products = await Product.find();

      for (let i = 0; i < products.length; i++) {
        if (products[i].cronJobTiming) {
          await automate(products[i].name);
        } else {
          continue;
        }
      }
    }


    return NextResponse.json({ success: true, message: "recieved" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
