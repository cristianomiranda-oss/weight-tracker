// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import { getPayloadData } from "@/app/libs/payload-generation";
import {
  addGoalWeightEntryService,
  changeGoalWeighEntryService,
  getGoalWeightEntryService,
} from "@/app/services/goal-weight-entry";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";

/**
 * GET Method: Returns goalWeightEntry if the provided Bearer token is valid.
 *
 * Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 */
export async function GET(request: Request) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    const goalWeightEntry = await getGoalWeightEntryService(userAccount);

    if (goalWeightEntry === null) {
      throw new Error("No Goal Weight Entry Associated with User Id", {
        cause: errorCausesObj.noUserEntry,
      });
    } else {
      // Initializes the body of the return message
      const responseBody = JSON.stringify({
        message: "Goal Weight Entry Retrieved",
        goalWeightEntry,
      });

      return new Response(responseBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(
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

/**
 * POST Method: Creates a new goal weight entry if the passed in bearer token is authorized.
 *
 *  Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 * Body:
 *
 * "weightValue" - Must be greater than zero, and can include up to the hundredths decimal place
 *
 * "goalType" - Must be "Loss", "Gain", or "Maintenance"
 */
export async function POST(request: Request) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { weightValue, goalType } = body;

    await addGoalWeightEntryService(weightValue, goalType, userAccount);

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Goal Weight Entry Added",
    });

    return new Response(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(
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

/**
 * PUT Method: Updates an existing goal weight entry type if the passed in bearer token is authorized.
 *
 * Headers:
 *
 * "Authorization" - Must be in the form of "Bearer <token>"
 *
 * Body:
 *
 * "goalWeightEntryId" - Must be a uuid that contains only letters, digits, and '-' and in the pattern of "########-####-####-####-############" (# representing any letter or digit).
 *
 * "weightValue" - Must be greater than zero, and can include up to the hundredths decimal place
 *
 * "goalType" - Must be "Loss", "Gain", or "Maintenance"
 */
export async function PUT(request: Request) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { goalWeightEntryId, weightValue, goalType } = body;

    await changeGoalWeighEntryService(
      goalWeightEntryId,
      weightValue,
      goalType,
      userAccount,
    );

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Goal Weight Entry Updated",
    });

    return new Response(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(
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
