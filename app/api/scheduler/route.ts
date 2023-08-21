import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";
import Product from "@/app/api/models/Product";
import mongoose from "mongoose";
import automate from "./automate";

export async function GET(req: NextRequest) {
  let schedulerStarted = process.env.SCHEDULER_STARTED!;
  let flag = false;

  try {

    
      flag = true;
      await mongoose.connect(process.env.MONGODB_URL!);
      let products = await Product.find();
      console.log(products);

      for (let i = 0; i < products.length; i++) {
        if (products[i].cronJobTiming) {
          console.log("cronJob countdown started");
          schedule.scheduleJob(
            `*/${products[i].cronJobTiming} * * * * *`,
            async () => {
              await automate(products[i].name);
            }
          );
        } else {
          continue;
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
