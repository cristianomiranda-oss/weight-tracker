// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import { getPayloadData } from "@/app/libs/payload-generation";
import {
  addGoalWeightEntryService,
  changeGoalWeighEntryService,
  getGoalWeightEntryService,
} from "@/app/services/goal-weight-entry";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";

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
      return new Response(JSON.stringify(goalWeightEntry), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(JSON.stringify({message: errorToSend.message, cause: errorToSend.cause}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { weightValue, goalType } = body;

    await addGoalWeightEntryService(weightValue, goalType, userAccount);

    return new Response("Goal Weight Entry Added", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(JSON.stringify({message: errorToSend.message, cause: errorToSend.cause}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

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

    return new Response("Goal Weight Entry Updated", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(JSON.stringify({message: errorToSend.message, cause: errorToSend.cause}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
