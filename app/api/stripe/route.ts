import {absoluteUrl} from '@/app/utils/utils'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '../models/User';
import {stripe} from '../lib/stripe'
import { decode } from 'next-auth/jwt';



export async function POST(req:NextRequest){
    try {

        const accessToken = req?.cookies?.get(process.env.ENVIRONMENT==="development"?"next-auth.session-token": process.env.ENVIONMENT==="production"?"__Secure-next-auth.session-token":"")?.value 
        console.log(accessToken);
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        const requestedUser = await decode({secret:process.env.NEXTAUTH_SECRET!,token:accessToken});
        const {id:userId} : any = requestedUser
        
        const body = await req.json();
        const {stripePriceId,planName} = body;
        
        
        const homeSuccessUrl = absoluteUrl(`/?success=true&plan=${planName}`);
        const homeErrorUrl = absoluteUrl("/?success=false");


        await mongoose.connect(process.env.MONGODB_URL as string);

        const user = await User.findById(userId);
        if(!user){return NextResponse.json({success:false,message:"User not found"},{status:400})}

    
        if(user && user.stripeCustomerId){

            const stripeSession = await stripe.billingPortal.sessions.create({
                customer:user.stripeCustomerId,
                return_url:homeSuccessUrl
            })

            return NextResponse.json({success:true,message:stripeSession.url});
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url:homeSuccessUrl,
            cancel_url:homeErrorUrl,
            payment_method_types:['card'],
            mode:"subscription",
            billing_address_collection:"auto",
            customer_email:user.email,
            line_items:[
                {
                    price:stripePriceId,
                    quantity:1,    
                },
            ],
            metadata:{
                userId:userId
            },
            subscription_data:{
                trial_period_days:7,
            }
        })
        
        return NextResponse.json({success:true,message:stripeSession.url});

    } catch (error:any) {
        
        NextResponse.json({success:false,message:error.message})
    }
}