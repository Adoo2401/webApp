import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
import { stripe } from "../../../lib/stripe";
import Product from "../../../models/Product";
import {ObjectId} from 'mongodb'



export async function GET (req:NextRequest,{params}:{params:{id:string}}){
    try {

        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value  
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId,role} : any = requestedUser
        

        if(role !== "admin"){
            return NextResponse.json({success:false,message:"Unathorized Request"},{status:401});
        }

        await mongoose.connect(process.env.MONGODB_URL!);
        
         let product = await Product.findById(params.id[1]);

         if(product){
            let prices = product.prices.filter((price:any)=>(price._id.toString())===params.id[0])
            if(prices.length===1){
                return NextResponse.json({success:true,message:prices[0]});
            }

            return NextResponse.json({success:false,message:"Price not found"});
         }

        

        return NextResponse.json({success:false,message:"Price not found"},{status:404})
        

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}