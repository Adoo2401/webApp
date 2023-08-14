import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import User from "../models/User";
import Sheet from "../models/Sheet";
import mongoose from "mongoose";

export async function GET (req:NextRequest){
    try {

        const accessToken = req?.cookies?.get(process.env.NODE_ENV==="development"?"next-auth.session-token":"__Secure-next-auth.session-token")?.value 
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId} : any = requestedUser
        
        await mongoose.connect(process.env.MONGODB_URL!)

        let impKeys = await Sheet.findOne({userId}).populate("userId","codeInAfricaApiKey codeInAfricaSecretKey").select("googleSheetId sheetId");
        if(impKeys){
            return NextResponse.json({success:true,data:impKeys});
        }
        
        return NextResponse.json({success:false,message:"Can't get Important keys"});

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}