// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import User from "../models/User";


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

        // Check if the user has the required role (admin)
        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
        }

        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        let users = await User.find();
        return NextResponse.json({ success: true, message:users});

    
    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}

