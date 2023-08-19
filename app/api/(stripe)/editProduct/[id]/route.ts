import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
import { stripe } from "../../../lib/stripe";
import Product from "@/app/api/models/Product";

export async function PUT (req:NextRequest,{params}:{params:{id:string}}){
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
        const {name,description} = body

        let product = await Product.findById(params.id);
        if(!product) {
            return NextResponse.json({success:false,message:"Product not found"});
        }

        const stripeUpdateProdcut = await stripe.products.update(product.productId,{
            name,
            description
        })

        if(stripeUpdateProdcut){

            await Product.findByIdAndUpdate(params.id,{
                productId:stripeUpdateProdcut.id,
                name:stripeUpdateProdcut.name,
                description:stripeUpdateProdcut.description
            })
            return NextResponse.json({success:true,message:"Product Updated"});
        }

        return NextResponse.json({success:false,message:"Product not found"})

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}