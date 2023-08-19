import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
import { stripe } from "../../../lib/stripe";
import Product from "@/app/api/models/Product";

export async function DELETE (req:NextRequest,{params}:{params:{id:string}}){
    try {

        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value  
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};
        
        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId,role} : any = requestedUser

        if(role !== "admin"){
            return NextResponse.json({success:false,message:"Unathorized Request"},{status:401});
        }

        await mongoose.connect(process.env.MONGODB_URL!);

        let product = await Product.findById(params.id);

        if(product){

            let deleted = await stripe.products.del(product.productId);
            if(deleted.deleted){
             await Product.findByIdAndDelete(params.id);
             return NextResponse.json({success:true,message:"Deleted"});
            }
        }


        return NextResponse.json({success:false,message:"can't delete"},{status:500});

        

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}