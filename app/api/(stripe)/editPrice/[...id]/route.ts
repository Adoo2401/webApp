import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
import { stripe } from "../../../lib/stripe";
import Product from "@/app/api/models/Product";

export async function PUT (req:NextRequest,{params}:{params:{id:string[]}}){
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
        let {unit_amount,features,active,trial,currency,interval} = body

        features = features.map((feature:any)=>feature.text);

        let isTrial = false;
        let trialPeriod :any =null;

        if(trial!==""){
            isTrial = true
            trialPeriod = trial
        }

        let product = await Product.findById(params.id[0]);
        
        if(!product) {
            return NextResponse.json({success:false,message:"Product not found"});
        }

        let price = product.prices.filter((price:any)=>(price._id.toString())===params.id[1])[0]
        if(price){

           const stripePriceUpdated = await stripe.prices.update(price.priceId,{active})

           if(stripePriceUpdated){

              let updatePrices = product.prices.map((price:any)=>{
                  if(price._id.toString()===params.id[1]){
                     return {...price,active,trial:isTrial,trialPeriod,features,interval}
                  }
                  return price
              })

              product.prices = updatePrices;
               await product.save()
              return NextResponse.json({success:true,message:"Price Updated"})
           }

        }
        
        

        return NextResponse.json({success:false,message:"Price not found"})

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}