import Stripe from 'stripe';
import {headers} from 'next/headers'
import {stripe} from '../lib/stripe'
import { NextResponse } from 'next/server';
import User from '../models/User';
import mongoose from 'mongoose';
import Product from '../models/Product';


export async function POST(req){

    const body = await req.text();
    const signature = headers().get("Stripe-Signature")

    let event

    try {
        event = stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.log(error);
        return NextResponse.json({success:false,message:`Webhook Error ___ ${error.message}`},{status:400})
    }

    
    try {
        
        mongoose.connect(process.env.MONGODB_URL);
        
        const session = event.data.object
    

    if(event.type==="checkout.session.completed"){

        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        
        if(!session?.metadata?.userId){
            return NextResponse.json({success:false,message:"User not found"},{status:400})
        }

        let chosenTier = await Product.findOne({
            prices:{
                $elemMatch:{
                    priceId:subscription.items.data[0].plan.id
                }
            }
        })
        

        await User.findByIdAndUpdate(session.metadata.userId,{stripeCustomerId:subscription.customer,stripeSubscriptionId:subscription.id,stripePriceId:subscription.items.data[0].plan.id,stripeCurrentPeriodEnd:new Date(subscription.current_period_end * 1000),plan:chosenTier.name})
    }

    if(event.type=="customer.subscription.updated"){
       
        const subscriptionDetails = event?.data?.object
        const id = subscriptionDetails.id 
       
        const subscription = await stripe.subscriptions.retrieve(id)

        let chosenTier = await Product.findOne({
            prices:{
                $elemMatch:{
                    priceId:subscription.plan.id
                }
            }
        })
        
        await User.updateOne({stripeSubscriptionId:subscription.id},{
            stripePriceId:subscription.items.data[0].plan.id,
            stripeCurrentPeriodEnd:new Date(subscription.current_period_end * 1000),
            plan:subscription?.plan?.active?chosenTier.name:"none",

        })
    }

    if(event.type==="customer.subscription.deleted"){
        const subscriptionId = event.data.object.id;
        await User.updateOne({stripeSubscriptionId:subscriptionId},{
            stripePriceId:null,
            stripeCurrentPeriodEnd:null,
            plan:"none",
            stripeCurrentPeriodEnd:null,
            stripeSubscriptionId:null
        })
    }


    if(event.type==="invoice.payment_succeeded"){

        const subscriptionDetails = event?.data?.object 
        const id = subscriptionDetails.subscription 
        
        const subscription = await stripe.subscriptions.retrieve(id)

        let chosenTier = await Product.findOne({
            prices:{
                $elemMatch:{
                    priceId:subscription.plan.id
                }
            }
        })
        console.log("🚀 ~ file: route.js:104 ~ POST ~ chosenTier:", chosenTier)
      
        
        await User.updateOne({stripeSubscriptionId:subscription.id},{
            stripePriceId:subscription.items.data[0].plan.id,
            stripeCurrentPeriodEnd:new Date(subscription.current_period_end * 1000),
            plan:chosenTier.name,

        })

    }
    
    return NextResponse.json({success:true,message:"Webhook received"})
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({success:false,message:error.message})
    }

}