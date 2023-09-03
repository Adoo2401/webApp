// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import Sheet from "../../models/Sheet";
import User from "../../models/User";


type Params = {
    id:string
}

export async function DELETE(req: NextRequest,{params}:{params:Params}) {
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

        await Sheet.deleteMany({googleSheetId:params.id});

        await User.findByIdAndUpdate(
            userId,
            {
                $pull:{
                    googleSheetIDs:params.id
                }
            }
        )

        return NextResponse.json({ success: true, message:"Deleted"});


    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}





export async function PATCH(req: NextRequest,{params}:{params:Params}) {
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
        const {isEnabled} = body

        const url = new URL(req.url);
        const status = url.searchParams.get("status");

        await mongoose.connect(process.env.MONGODB_URL!);

        if(status){
            
        await Sheet.updateMany(
            {googleSheetId:params.id},
            {
                enabled:isEnabled
            }
        )
        return NextResponse.json({ success: true, message:"Sheet Status Updated"});
        }else{

            await Sheet.updateMany(
                {googleSheetId:params.id},
                {
                    isCronjobActive:isEnabled
                }
            )

            return NextResponse.json({ success: true, message:"Cron job status updated"});
        }

        // Connect to the MongoDB database




    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}



export async function PUT(req: NextRequest,{params}:{params:Params}) {
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
        const {googleSheetId} = body

        if(googleSheetId.includes("/")){return NextResponse.json({ success: false, message: "Enter valid google sheet id it should not contain /" }, { status: 400 })}

        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        await Sheet.updateMany(
            {googleSheetId:params.id},
            {
                googleSheetId,
            }
        )
       
        let user = await User.findById(userId);
        if(user){
            const index = user.googleSheetIDs.indexOf(params.id);
            if(index!==-1){
                user.googleSheetIDs[index] = googleSheetId
                await user.save();
            }
        }
    
        return NextResponse.json({ success: true, message:"Updated"});


    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}






export async function GET(req: NextRequest,{params}:{params:Params}) {
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

        let orders = await Sheet.find({googleSheetId:params.id,userId});

        return NextResponse.json({ success: true,message:orders});


    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}





