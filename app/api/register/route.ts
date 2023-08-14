import mongoose from "mongoose";
import User from "../models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const {email,name,password} = body;

    if(!email || !name || !password){return NextResponse.json({success:false,message:"Enter all the fields"},{status:400})};

    await mongoose.connect(process.env.MONGODB_URL as string);

    let isEmailCheck = await User.findOne({email});
    if(isEmailCheck) {return NextResponse.json({success:false,message:"Email already exists"},{status:400})};

    const user = await User.create(body);

    return NextResponse.json({success:true,message:"User Created"})

  } catch (error:any) {
    
    return NextResponse.json({ success: false, message: error.message });
  }
}
