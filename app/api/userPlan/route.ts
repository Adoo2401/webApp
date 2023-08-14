import mongoose from "mongoose";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import User from "../models/User";

export async function GET (req:NextRequest){
    try {
        
        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value;  
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};
        
        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId} : any = requestedUser

        await mongoose.connect(process.env.MONGODB_URL as string);

        let user = await User.findById(userId);
        return NextResponse.json({success:true,message:user?.plan});

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}