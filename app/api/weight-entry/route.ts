// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import { getPayloadData } from "@/app/libs/payload-generation";
import {
  addWeightEntryService,
  changeWeighEntryService,
  getWeightEntriesService,
  getWeightEntryService,
  removeWeightEntryService,
} from "@/app/services/weight-entry";
import {
  errorCausesObj,
  getServerResponseStatus,
  handleMiddleWareErrors,
} from "@/app/utils/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET Method: Returns either all weight entries, or a singular one if a valid "weightEntryId" is passed in the headers, if the passed in bearer token is authorized.
 *
 *  Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 * "weightEntryId" (Optional) - Must be a uuid that contains only letters, digits, and '-' and in the pattern of "########-####-####-####-############" (# representing any letter or digit).
 */
export async function GET(request: NextRequest) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls any data from the body of the request
    const weightEntryId = request.headers.get("weightEntryId");

    // Checks if the header is null which denotes all entries should be pulled
    if (weightEntryId === null) {
      const weightEntries = await getWeightEntriesService(userAccount);

      // Initializes the body of the return message
      const responseBody = JSON.stringify({
        message: "Entries Retrieved",
        weightEntries,
      });

      return new NextResponse(responseBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // If the header string is valid, gets the entry associated with the passed in id
      const weightEntry = await getWeightEntryService(
        weightEntryId,
        userAccount,
      );

      // Initializes the body of the return message
      const responseBody = JSON.stringify({
        message: "Entry Retrieved",
        weightEntry,
      });

      return new NextResponse(responseBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
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

/**
 * POST Method: Updates an existing weight entry type if the passed in bearer token is authorized.
 *
 *  Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 * Body:
 *
 * "weightValue" - Must be greater than zero, and can include up to the hundredths decimal place
 *
 * "weighInDate" - Must in the format of "YYYY-MM-DDT##:##"
 */
export async function POST(request: NextRequest) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { weightValue, weighInDate } = body;

    if (weightValue === undefined || weighInDate === undefined) {
      throw new Error("weightValue or weighInDate is missing from the body", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    await addWeightEntryService(weightValue, weighInDate, userAccount);

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Weight Entry Added",
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

/**
 * PUT Method: Updates an existing weight entry type if the passed in bearer token is authorized.
 *
 *  Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 * Body:
 *
 * "weightEntryId" - Must be a uuid that contains only letters, digits, and '-' and in the pattern of "########-####-####-####-############" (# representing any letter or digit).
 *
 * "weightValue" - Must be greater than zero, and can include up to the hundredths decimal place
 *
 * "weighInDate" - Must in the format of "YYYY-MM-DDT##:##"
 */
export async function PUT(request: NextRequest) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { weightEntryId, weightValue, weighInDate } = body;

    if (
      weightEntryId === undefined ||
      weightValue === undefined ||
      weighInDate === undefined
    ) {
      throw new Error(
        "weightEntryId, weightValue, or weighInDate is missing from the body",
        {
          cause: errorCausesObj.invalidParameterValue,
        },
      );
    }

    await changeWeighEntryService(
      weightEntryId,
      weightValue,
      weighInDate,
      userAccount,
    );

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Weight Entry Updated",
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

/**
 * DELETE Method: Removes an existing weight entry type if the passed in bearer token is authorized.
 *
 *  Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 * Body:
 *
 * "weightEntryId" - Must be a uuid that contains only letters, digits, and '-' and in the pattern of "########-####-####-####-############" (# representing any letter or digit).
 */
export async function DELETE(request: NextRequest) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { weightEntryId } = body;

    if (weightEntryId === undefined) {
      throw new Error("weightEntryId is missing from the body", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    await removeWeightEntryService(weightEntryId, userAccount);

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Weight Entry Deleted",
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
