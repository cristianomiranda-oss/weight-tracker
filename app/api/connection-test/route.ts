// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import { WeightTrackerDataBase } from "@/app/libs/mongodb";
import { handleMiddleWareErrors } from "@/app/utils/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET Method: Attempts to ping the MongoDB server and returns successful if it responds.
 */
export async function GET(request: NextRequest) {
  try {
    const connectionTest = await WeightTrackerDataBase.testDbConnection();

    // Initializes the body of the return message
    const responseBody = JSON.stringify({ message: connectionTest });

    return new NextResponse(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new NextResponse(
      JSON.stringify({
        message: errorToSend.message,
        cause: errorToSend.cause,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
