import { NextRequest, NextResponse } from "next/server";
import Product from "../models/Product";
import mongoose from "mongoose";

export async function GET (req:NextRequest){
    try {

        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value  
        if(!accessToken){return NextResponse.json({success:false,message:"Unathorized Request"},{status:401})};

        await mongoose.connect(process.env.MONGODB_URL!);

        let productsNames = await Product.find()
        let response = [];

        for(let i = 0;i<productsNames.length;i++){

            let prices : any = await Product.findOne({
                name:productsNames[i].name,
                prices: {
                  $elemMatch: {
                    active: true
                  }
                }
             })

             if(prices){
               let activePrices = prices.prices.filter((price:any)=>price.active===true);
               response.push({name:productsNames[i].name,prices:activePrices,description:productsNames[i].description})
             }

        }
        
        return NextResponse.json({success:true,message:response});

    } catch (error:any) {
        return NextResponse.json({success:false,message:error.message});
    }
}