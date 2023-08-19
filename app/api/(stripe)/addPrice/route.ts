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
        let {product,interval,trial,currency,unit_amount,features} = body;

        let check = await Product.findOne({
            productId:product,
            prices:{
                $elemMatch:{
                    interval,
                }
            }
        })


        if(check?.prices?.length>0){
            return NextResponse.json({success:false,message:`${interval} already created please choose another`});
        }

        features = features.map((feature:any)=>{
            return feature.text
        })

        let trialValue = false
        let trialValuePeriod = null

        if(trial!==""){
            trialValue = true
            trialValuePeriod = trial
        }

        const price = await stripe.prices.create({currency,unit_amount,product,recurring:{interval}});

        if(price){

            await Product.updateOne({productId:product},{
                $push: {
                    prices: {
                      unit_amount: unit_amount,
                      trial: trialValue,
                      trialPeriod: trialValuePeriod,
                      interval: interval,
                      priceId: price.id,
                      currency: currency,
                      features:features
                    },
                  },
            })
            return NextResponse.json({success:true,message:"Price Created"})
        }

        return NextResponse.json({success:false,message:"Failed to create price"})

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}