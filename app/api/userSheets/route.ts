// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import Product from "@/app/api/models/Product";
import User from "../models/User";
import Sheet from "../models/Sheet";


export async function GET(req: NextRequest) {
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
        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        const url = new URL(req.url);
        const queryId = url.searchParams.get("userId");
        
        let findById = queryId || userId;
        
        let user = await User.findById(findById).select("googleSheetIDs");
        let resp = []

        if (user.googleSheetIDs) {
            for (let i = 0; i < user?.googleSheetIDs.length; i++) {
                let sheets = await Sheet.find({ googleSheetId: user?.googleSheetIDs[i]});
               resp.push({ enabled:sheets[0]?.enabled,googleSheetId: user?.googleSheetIDs[i], orders: sheets.length, cronJobActive: sheets[0]?.isCronjobActive || null, title: sheets[0]?.title || "No sheet added until now"});
                
            }
        }
        return NextResponse.json({ success: true, message: resp })


    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}




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

        const body = await req.json();
        const { googleSheetId } = body;

        if(googleSheetId.includes("/")){return NextResponse.json({ success: false, message: "Enter valid google sheet id it should not contain /" }, { status: 400 })}


        await mongoose.connect(process.env.MONGODB_URL!);

        const user = await User.findById(userId);
        if(user.googleSheetIDs.includes(googleSheetId)) {
            return NextResponse.json({ success: false, message: "Sheet already added" });
        }

        const product = await Product.findOne({ name: user?.plan });

        if (user.googleSheetIDs.length < product?.noOfSheets) {
            user.googleSheetIDs.push(googleSheetId);
            await user.save();
            return NextResponse.json({ success: true, message: 'Sheet added' });
        }

        return NextResponse.json({ success: false, message: `Can't add more sheets on ${product.name} plan if you want to add more sheets you need to upgrade your plan` });

    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}

