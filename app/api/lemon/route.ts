import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '../models/User';
import lemon from '../lib/lemon'
import { decode } from 'next-auth/jwt';
import { absoluteUrl } from '@/app/utils/utils';



export async function POST(req: NextRequest) {
    try {

        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value

        if (!accessToken) { return NextResponse.json({ success: false, message: "Unathorized Request" }, { status: 401 }) };

        const requestedUser = await decode({ secret: process.env.NEXTAUTH_SECRET!, token: accessToken });
        const { id: userId }: any = requestedUser

        await mongoose.connect(process.env.MONGODB_URL as string)
        const user = await User.findById(userId);
       
        
        if(!user){
            return NextResponse.json({success:true,message:"user not found"});
        }

        const body = await req.json();
        const {plan,variantId} = body;

        if(!plan || !variantId){return NextResponse.json({success:false,message:"Invalid Data"})}

        const lemonUrl = "https://api.lemonsqueezy.com/v1/checkouts";
    
        const Api = await fetch(lemonUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Accept": "application/vnd.api+json",
                "Authorization": `Bearer ${process.env.LEMON_API_KEY}`
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        product_options: {
                            redirect_url: absoluteUrl(`/?success=true`),
                            receipt_thank_you_note: "Thank you for your Subscription",

                        },
                        checkout_data: {
                            custom: {
                                userId,
                                plan,
                            },
                            email:user.email,
                            name: user.name
                        }
                    },
                    relationships: {

                        store: {
                            data: {
                                type: "stores",
                                id: process.env.LEMON_STORE_ID
                            }
                        },

                        variant: {
                            data: {
                                type: "variants",
                                id: variantId,
                            }
                        }
                    }
                }
            })
        })


        let {data} = await Api.json();

        if (data?.attributes?.url) {
            return NextResponse.json({ success: true, message: data.attributes.url });
        }

        return NextResponse.json({ success: false, message: "Something went wrong" });


    } catch (error: any) {

        return NextResponse.json({ success: false, message: error.message })
    }
}