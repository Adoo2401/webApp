import { NextRequest, NextResponse } from "next/server";
import {decode} from 'next-auth/jwt'
import Product from "../../models/Product";

/**
 * Parameters for the PATCH request.
 */
interface PatchParams {
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


export async function PATCH(req: NextRequest, { params }: { params: PatchParams }) : Promise<NextResponse> {
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
 * Parameters for the DELETE request.
 */
interface DeleteParams {
    jobId: string;
}

/**
 * Deletes a cron job and updates associated product information.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @param {Object} params - The parameters containing the `jobId` to delete.
 * @param {string} params.jobId - The ID of the cron job to delete.
 * @returns {NextResponse} - The Next.js response indicating the delete status.
 */
export async function DELETE(req: NextRequest, { params }: { params: DeleteParams }) : Promise<NextResponse> {
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