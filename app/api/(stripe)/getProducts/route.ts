import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
import { stripe } from "../../lib/stripe";
import Product from "../../models/Product";

export async function GET (req:NextRequest){
    try {

        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value  
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId,role} : any = requestedUser
        

        if(role !== "admin"){
            return NextResponse.json({success:false,message:"Unathorized Request"},{status:401});
        }

        await mongoose.connect(process.env.MONGODB_URL!);

        let products = await Product.find();

        return NextResponse.json({success:true,message:products})
        

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}