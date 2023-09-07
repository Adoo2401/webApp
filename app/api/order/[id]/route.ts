// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import Product from "@/app/api/models/Product";
import Sheet from "../../models/Sheet";

type Params = {
    id: string
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
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

        await Sheet.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: "Order Deleted" });



    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}


export async function GET(req: NextRequest, { params }: { params: Params }) {
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

        const sheet = await Sheet.findById(params.id).select("title orderId source fullName phone city")

        return NextResponse.json({ success: true, message: sheet });



    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}



export async function PUT(req: NextRequest, { params }: { params: Params }) {
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

        const body = await req.json();
       

        const pattern = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-\d+$/;
        const match = body?.orderId?.match(pattern);

        if (!match) { return NextResponse.json({ success: false, message: "The prefix should be the format of store-country-number e.g shopify-nigeria-0" }, { status: 500 }) }


        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL!);

        await Sheet.findByIdAndUpdate(params.id, body);
        

        return NextResponse.json({ success: true, message: "Order Updated" });



    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}

