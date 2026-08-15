import { getPayloadData } from "@/app/libs/payload-generation";
import { getWeightEntryService } from "@/app/services/weight-entry";
import {
  errorCausesObj,
  getServerResponseStatus,
  handleMiddleWareErrors,
} from "@/app/utils/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET Method: Returns the weight entry matching the passed in url segment if the passed in bearer token is authorized.
 * If no entry is found, a failure response is sent.
 *
 *  Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ weightEntryId: string }> },
) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    const { weightEntryId } = await params;

    // If the header string is valid, gets the entry associated with the passed in id
    const weightEntry = await getWeightEntryService(weightEntryId, userAccount);

    if (weightEntry === null) {
      throw new Error("Entry not found", { cause: errorCausesObj.noUserEntry });
    }

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Entry Retrieved",
      weightEntry,
    });

    return new NextResponse(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    let status = getServerResponseStatus(error);

    return new NextResponse(
      JSON.stringify({
        message: errorToSend.message,
        cause: errorToSend.cause,
      }),
      {
        status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
