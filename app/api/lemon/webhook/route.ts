import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { decode } from 'next-auth/jwt';
import { absoluteUrl } from '@/app/utils/utils';
import User from '../../models/User';



export async function POST(request: NextRequest) {
    try {

        const crypto = require('crypto');

        const secret = process.env.LEMON_WEBHOOK_SECRET;
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(request.body).digest('hex'), 'utf8');
        console.log("🚀 ~ file: route.ts:17 ~ POST ~ digest:", digest)
        const signature = Buffer.from(request.headers.get('X-Signature') || '', 'utf8');
        console.log("🚀 ~ file: route.ts:19 ~ POST ~ signature:", signature)

        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        }

        const webhook = await request.json();
        console.log(webhook);

        if(webhook.meta.event_name==="subscription_created"){

            let plan = webhook?.meta?.custom_data?.plan;
            let userId = webhook?.meta?.custom_data?.userId

            await User.findByIdAndUpdate(userId,{
                payment:"lemon",
                name:plan,
                lemonProductId:webhook?.data?.attributes?.product_id,
                lemonVariantId:webhook?.data?.attributes?.variant_id,
                lemonUpdateSubscriptionUrl:webhook?.data?.attributes?.urls?.update_payment_method,
                lemonCurrentPeriodEnd:new Date(webhook?.data?.attributes?.renews_at)
            })
        }

        return NextResponse.json({success:true,message:"Webhook received"})

    } catch (error: any) {

        return NextResponse.json({ success: false, message: error.message })
    }
}