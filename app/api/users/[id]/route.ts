// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import User from "../../models/User";


type Params = {
    id:string
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

        // Check if the user has the required role (admin)
        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
        }

        const data = await req.json();
    
        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        await User.findByIdAndUpdate(params.id,data);
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

        // Check if the user has the required role (admin)
        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
        }

        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        let user = await User.findById(params.id).select("role name email password");
        if(!user) {return NextResponse.json({success:false,message:"User not found"},{status:500})}
        return NextResponse.json({ success: true, message:user});

    
    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
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

        // Check if the user has the required role (admin)
        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
        }


        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        await User.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true, message:"Deleted"});

    
    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}

