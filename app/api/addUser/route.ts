import mongoose from "mongoose";
import User from "../models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    await mongoose.connect(process.env.MONGODB_URL as string);

    const user = await User.create(body);

    return NextResponse.json({success:true,message:user})

  } catch (error:any) {
    
    return NextResponse.json({ success: false, message: error.message });
  }
}
