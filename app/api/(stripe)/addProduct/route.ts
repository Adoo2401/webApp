import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
import { stripe } from "../../lib/stripe";
import Product from "@/app/api/models/Product";

export async function POST (req:NextRequest){
    try {

        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value  
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId,role} : any = requestedUser
        

        if(role !== "admin"){
            return NextResponse.json({success:false,message:"Unathorized Request"},{status:401});
        }

        await mongoose.connect(process.env.MONGODB_URL!);

        const body = await req.json();
        const {name,description} = body;

        let check = await Product.findOne({
            name: { $regex: new RegExp(name, 'i') }
          })

          if(check){
            return NextResponse.json({success:false,message:"Product Already Exists"})
          }

        const product = await stripe.products.create({
            name,
            description
        })

        if(product){
            await Product.create({productId:product.id,name:product.name,description:product.description})
            return NextResponse.json({success:true,data:"Product Created"});
        }

        return NextResponse.json({success:false,message:product})

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}