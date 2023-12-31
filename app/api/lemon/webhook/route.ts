import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { decode } from 'next-auth/jwt';
import { absoluteUrl } from '@/app/utils/utils';
import User from '../../models/User';
import {headers} from 'next/headers'



export async function POST(request: NextRequest) {
    try {


        const body = await request.text();
        const secret = process.env.LEMON_WEBHOOK_SECRET!;
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8');
        const signature = Buffer.from(headers().get("X-Signature") || '', 'utf8');



        if (!crypto.timingSafeEqual(digest, signature)) {
            console.log("reutrn unauthoried")
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        }

        const webhook = JSON.parse(body);
        
    
        if(webhook?.meta?.event_name==="subscription_created"){

            let plan = webhook?.meta?.custom_data?.plan;
            let userId = webhook?.meta?.custom_data?.userId

            await User.findByIdAndUpdate(userId,{
                payment:"lemon",
                plan,
                lemonProductId:webhook?.data?.attributes?.product_id,
                lemonVariantId:webhook?.data?.attributes?.variant_id,
                lemonSubscriptionId:webhook?.data?.attributes?.first_subscription_item?.subscription_id,
                lemonCurrentPeriodEnd:new Date(webhook?.data?.attributes?.renews_at)
            })
        }

        return NextResponse.json({success:true,message:"Webhook received"})

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message},{status:500})
    }
}


