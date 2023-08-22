import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import mongoose from "mongoose";
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
        const {productId,hours,minutes} = body;

        let planName = await Product.findOne({productId});

        let cronJobUrl = "https://api.cron-job.org"
        const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`

        let cronjobApi = await fetch(`${cronJobUrl}/jobs`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":cronJobApiKey
            },
            body:JSON.stringify({
                job:{
                    url:`${process.env.NEXT_PUBLIC_BASE_URL}/api/scheduler?productName=${planName.name}`,
                }
            })
        })

        if(!productId || !hours || !minutes){
            return NextResponse.json({success:false,message:"Invalid Request"});
        }



        // await Product.findOneAndUpdate({productId},{
        //    cronJobTiming:seconds
        // })

        return NextResponse.json({success:true,message:"Cron Job Added"})

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}