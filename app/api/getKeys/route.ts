import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import User from "../models/User";
import Sheet from "../models/Sheet";
import mongoose from "mongoose";

export async function GET (req:NextRequest){
    try {

        // const accessToken = req?.cookies?.get("next-auth.session-token")?.value 
        // if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:"eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..XTkB9o9E-3Oc6b_X.OVVdOsljyf-6VaeyQpp7MYQTCUX8yuWJM8GR3_6_yqd_5yzGtLJiUsIqxul8-ZOsUkMl5j6n2B4QYE1z_S2KBw3QV0q2n4ZkJXzNU68udvIEoiDvTQZ1yjX8r20KvW4seKqbLv8agOFCqDCOM4glfGfJcYaOlGsqsQI7qvC-XLLHA0BNRxaKEgEd_-H_X1HezTo2y6A8L3TOK0hF3ggT1zYMHD9aQkL3D10Wn6BVBXNv3aomgCunZxCsSKXSo6H5A_gj1Be35jLN8JBzHJK0yMVpVZpLYiYz-tPr9uY25s_uqbAr0bQZCijjd2lTqX2RkA.cz4YEQ8vdvcr7gELLYuQhA"});
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