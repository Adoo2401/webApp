// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt';
import mongoose from "mongoose";
import Product from "@/app/api/models/Product";

// Define the structure of the API response from the cron job creation
type CronJobApiResponse = {
    jobId?: string,
}

// Define the main function that handles the POST request
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
        const { productId, hours, minutes } = body;

        // Check if the required parameters are present in the request
        if (!productId || !minutes || !hours) {
            return NextResponse.json({ success: false, message: "Invalid Request" });
        }

        // Determine the hours and minutes based on the provided values if hour is provided then it should not run according to minutes but hours thats why mins=[0]
        // and if minute is provided then it should run every hour of the provided minute more information of how to pass json body at https://docs.cron-job.org/rest-api.html#jobschedule

        let hrs = [];
        let min = [];
        if (hours.length == 1) {
            hrs = [-1];
            min = minutes;
        }
        if (minutes.length == 1) {
            min = [0];
            hrs = hours;
        }

        // Find the product name based on the productId
        let product = await Product.findOne({ productId });
        if(product.cronJobId){
            return NextResponse.json({ success: false, message: "Product already has a cron job" });
        }

        // Define the URL and API key for the cron job service
        let cronJobUrl = "https://api.cron-job.org";
        const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`;

        // Create a cron job using the cron job service API
        let cronjobApi = await fetch(`${cronJobUrl}/jobs`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": cronJobApiKey
            },
            body: JSON.stringify({
                job: {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/scheduler?productName=${product.name}`,
                    enabled: true,
                    saveResponses: true,
                    schedule: {
                        timezone: "Africa/Casablanca",
                        expiresAt: 0,
                        minutes: min,
                        hours: hrs,
                        mdays: [-1],
                        wdays: [-1],
                        months: [-1]
                    }
                }
            })
        });

        if(!cronjobApi.ok){
            if(cronjobApi.status==429){
                return NextResponse.json({ success: false, message: "Cron-job.org API rate limit exceeded" });
            }

            return NextResponse.json({success:false,message:"Can't reach cron-job.org API at a moment please try again"});
        }
        

        // Parse the API response for the created cron job
        const cronjobApiResponse: CronJobApiResponse = await cronjobApi.json();

        // If the cron job was successfully created, update the product with the cron job ID
        if (cronjobApiResponse.jobId) {
            await Product.findOneAndUpdate({ productId }, {
                cronJobId: cronjobApiResponse.jobId
            });
            return NextResponse.json({ success: true, message: "Cron job created" });
        }

        // Return a response indicating that the cron job couldn't be created
        return NextResponse.json({ success: false, message: "Can't create cron job right now" });

    } catch (error: any) {
        // Handle errors and return an error response
        return NextResponse.json({ success: false, message: error.message });
    }
}


export async function GET(req: NextRequest) {
    try {
        // Retrieve access token from cookies
        const accessToken = req?.cookies?.get(process.env.COOKIE_NAME!)?.value;
        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized Request" },
                { status: 401 }
            );
        }

        // Decode and extract user information from the access token
        const requestedUser = await decode({
            secret: process.env.NEXTAUTH_SECRET!,
            token: accessToken,
        });
        const { role }: any = requestedUser;
        let resp = [];

        // Check if the user has admin role, otherwise deny access
        if (role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized Request" },
                { status: 401 }
            );
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL!);

        // URL and API key for the cron job service
        let cronJobUrl = "https://api.cron-job.org";
        const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`;

        // Fetch jobs data from the cron job service
        let jobs = await fetch(`${cronJobUrl}/jobs`, {
            headers: { "Authorization": cronJobApiKey },
        });

        // checking if quota limits exceeded or anyother error

        if(!jobs.ok){
            if(jobs.status==429){
                return NextResponse.json({ success: false, message: "Cron-job.org API rate limit exceeded" });
            }

            return NextResponse.json({success:false,message:"Can't reach cron-job.org API at a moment please try again"});
        }
        
        let jobsData: any = await jobs.json();

        // Process fetched jobs data and associate with product names
        if (jobsData.jobs) {
            for (let i = 0; i < jobsData.jobs.length; i++) {
                let product = await Product.findOne({
                    cronJobId: jobsData.jobs[i]?.jobId?.toString(),
                });
                resp.push({ ...jobsData.jobs[i], product: product.name });
            }
            return NextResponse.json(
                { success: true, message: resp },
                { status: 200 }
            );
        }

        // Return error response if jobs are not found
        return NextResponse.json(
            { success: false, message: "Jobs not found" },
            { status: 404 }
        );
    } catch (error: any) {
        // Return error response if an exception occurs
        return NextResponse.json({ success: false, message: error.message });
    }
}