import { NextRequest, NextResponse } from "next/server";
import { decode } from 'next-auth/jwt'
import Product from "../../models/Product";
import mongoose from "mongoose";

/**
 * Parameters for the requests.
 */
interface Params {
    jobId: string;
}

/**
 * Updates the status of a cron job.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @param {Object} params - The parameters containing the `jobId` to update.
 * @param {string} params.jobId - The ID of the cron job to update.
 * @returns {NextResponse} - The Next.js response indicating the update status.
 */


export async function PATCH(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
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
        const { id: userId, role }: any = requestedUser;

        // Check if the user has admin role, otherwise deny access
        if (role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized Request" },
                { status: 401 }
            );
        }

        // Get the request body and extract isEnabled value
        const body = await req.json();
        const { isEnabled } = body;

        // Configure API endpoint and headers for cron job update
        let cronJobUrl = "https://api.cron-job.org";
        const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`;

        // Send PATCH request to update cron job status
        let API = await fetch(`${cronJobUrl}/jobs/${params.jobId}`, {
            method: "PATCH",
            headers: {
                "Authorization": cronJobApiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                job: {
                    enabled: Boolean(isEnabled),
                },
            }),
        });

        if (!API.ok) {
            if (API.status == 429) {
                return NextResponse.json({ success: false, message: "Cron-job.org API rate limit exceeded" });
            }

            return NextResponse.json({ success: false, message: "Can't reach cron-job.org API at a moment please try again" });
        }

        // Parse the API response
        API = await API.json();
        if (API) {
            return NextResponse.json({ success: true, message: "Updated" });
        }

        // Return error response if cron job update fails
        return NextResponse.json({
            success: false,
            message: "Can't update cron job right now",
        });
    } catch (error: any) {
        // Return error response if an exception occurs
        return NextResponse.json({ success: false, message: error.message });
    }
}




/**
 * Deletes a cron job and updates associated product information.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @param {Object} params - The parameters containing the `jobId` to delete.
 * @param {string} params.jobId - The ID of the cron job to delete.
 * @returns {NextResponse} - The Next.js response indicating the delete status.
 */
export async function DELETE(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
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
        const { id: userId, role }: any = requestedUser;

        // Check if the user has admin role, otherwise deny access
        if (role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized Request" },
                { status: 401 }
            );
        }

        await mongoose.connect(process.env.MONGODB_URL!);

        // Get the product name from the request URL
        const url = new URL(req.url);
        const productName = url.searchParams.get("productName");

        // Configure API endpoint and headers for cron job deletion
        let cronJobUrl = "https://api.cron-job.org";
        const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`;

        // Send DELETE request to delete cron job
        let API = await fetch(`${cronJobUrl}/jobs/${params.jobId}`, {
            method: "DELETE",
            headers: {
                "Authorization": cronJobApiKey,
            },
        });

        if (!API.ok) {
            if (API.status == 429) {
                return NextResponse.json({ success: false, message: "Cron-job.org API rate limit exceeded" });
            }

            return NextResponse.json({ success: false, message: "Can't reach cron-job.org API at a moment please try again" });
        }

        // Parse the API response
        API = await API.json();

        if (API) {
            // Update associated product information after successful deletion
            await Product.findOneAndUpdate(
                { name: productName },
                { cronJobId: null }
            );
            return NextResponse.json({ success: true, message: "Deleted" });
        }

        // Return error response if cron job deletion fails
        return NextResponse.json({
            success: false,
            message: "Can't delete cron job right now",
        });
    } catch (error: any) {
        // Return error response if an exception occurs
        return NextResponse.json({ success: false, message: error.message });
    }
}






// Define the structure of CronJob API details
type CronJobApiDetails = {
    jobDetails: {
        schedule: {
            hours: number[],
            minutes: number[],
        }
    }
}

/**
 * Handles the GET request for retrieving CronJob details.
 * @param req The Next.js request object.
 * @param params The parameters extracted from the request.
 * @returns A Next.js response containing CronJob details or error messages.
 */
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
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
    const { id: userId, role }: any = requestedUser;

    // Check if the user has admin role, otherwise deny access
    if (role !== "admin") {
        return NextResponse.json(
            { success: false, message: "Unauthorized Request" },
            { status: 401 }
        );
    }

    await mongoose.connect(process.env.MONGODB_URL!);

    const cronJobUrl = "https://api.cron-job.org";
    const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`;

    // Fetch CronJob details from the API
    const cronJobApi = await fetch(`${cronJobUrl}/jobs/${params.jobId}`, {
        headers: {
            "Authorization": cronJobApiKey
        }
    });

    // Handle errors when fetching from CronJob API
    if (!cronJobApi.ok) {
        if (cronJobApi.status == 429) {
            return NextResponse.json({ success: false, message: "Cron-job.org API rate limit exceeded" }, { status: 429 });
        }
        return NextResponse.json({ success: false, message: "Can't reach cron-job.org API at the moment. Please try again" }, { status: 500 });
    }

    // Parse the fetched CronJob details
    let cronJobDetails: CronJobApiDetails = await cronJobApi.json();

    // Retrieve and return CronJob plan details if available
    if (cronJobDetails.jobDetails) {
        let cronJobPlan = await Product.findOne({ cronJobId: params.jobId }).select("+name");
        return NextResponse.json({ success: true, message: { planName: cronJobPlan?.productId, hours: cronJobDetails?.jobDetails?.schedule?.hours, minutes: cronJobDetails?.jobDetails?.schedule?.minutes } });
    }

    return NextResponse.json({ success: false, message: "CronJob not found" }, { status: 404 });
}




/**
 * Handles the PUT request for updating CronJob details.
 * @param req The Next.js request object.
 * @param params The parameters extracted from the request.
 * @returns A Next.js response indicating the success or failure of the update.
 */
export async function PUT(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
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
    const { id: userId, role }: any = requestedUser;

    // Check if the user has admin role, otherwise deny access
    if (role !== "admin") {
        return NextResponse.json(
            { success: false, message: "Unauthorized Request" },
            { status: 401 }
        );
    }

    // Parse the JSON body of the request
    const body = await req.json();
    const { productId, hours, minutes } = body;

    const url = new URL(req.url);
    const previousChosenProduct = url.searchParams.get("productId");  

    // Check if the required parameters are present in the request
    if (!productId || !minutes || !hours ||!previousChosenProduct) {
        return NextResponse.json({ success: false, message: "Invalid Request" });
    }

    // Determine the hours and minutes based on the provided values
    let hrs = [];
    let min = [];
    if (hours.length === 1) {
        hrs = [-1];
        min = minutes;
    }
    if (minutes.length === 1) {
        min = [0];
        hrs = hours;
    }

    await mongoose.connect(process.env.MONGODB_URL!);

    const cronJobUrl = "https://api.cron-job.org";
    const cronJobApiKey = `Bearer ${process.env.CRON_JOB_API_KEY}`;

    // Find the product based on productId
    let product = await Product.findOne({ productId });
    
    if (product.cronJobId) {
        return NextResponse.json({ success: false, message: "Product already has a cron job" });
    }

    // Update the cron job using the cron job service API
    let cronjobApi = await fetch(`${cronJobUrl}/jobs/${params.jobId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cronJobApiKey
        },
        body: JSON.stringify({
            job: {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/scheduler?productName=${product.name}`,
                schedule: {
                    minutes: min,
                    hours: hrs,
                    mdays: [-1],
                    wdays: [-1],
                    months: [-1]
                }
            }
        })
    });

    if (!cronjobApi.ok) {
        if (cronjobApi.status === 429) {
            return NextResponse.json({ success: false, message: "Cron-job.org API rate limit exceeded" });
        }

        return NextResponse.json({ success: false, message: "Can't reach cron-job.org API at a moment. Please try again" });
    }

    cronjobApi = await cronjobApi.json();
    if (cronjobApi) {
        await Product.findOneAndUpdate({productId:previousChosenProduct},{cronJobId:null});
        await Product.findOneAndUpdate({productId},{cronJobId:params.jobId});
        return NextResponse.json({ success: true, message: "CronJob updated successfully" });
    }

    return NextResponse.json({ success: false, message: "CronJob not found" });
}