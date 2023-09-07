// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import Product from "@/app/api/models/Product";


export async function POST(req: NextRequest) {
    try {
        // Retrieve the access token from the request cookies
        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value;

        // If no access token is found, return an unauthorized response
        if (!accessToken) {
            return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
        }

        // Decode the access token to get user information
        const requestedUser = await decode({ secret: process.env.NEXTAUTH_SECRET!, token: accessToken });
        const { id: userId, role }: any = requestedUser;

        // Check if the user has the required role (admin)
        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
        }

        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        // Parse the JSON body of the request
        const body = await req.json();
        const { product,sheets } = body;
        if(!product || !sheets) {return NextResponse.json({success:false,message:"Enter all fields"},{status:500})}

        let sheetAlreadyAdded = await Product.findOne({productId:product})
        if(sheetAlreadyAdded?.noOfSheets) {return NextResponse.json({success:false,message:"Product already have Sheet plan"},{status:500})}

        await Product.findOneAndUpdate({
            productId:product
        },{
            noOfSheets:parseInt(sheets)
        })

        return NextResponse.json({ success: true, message: "Sheet Plan created" });

    
    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}
