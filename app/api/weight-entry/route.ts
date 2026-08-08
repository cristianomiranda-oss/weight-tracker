// Credit: all api calls were created using a pattern by Lee Robinson

import { getPayloadData } from "@/app/libs/payload-generation";
import {
  addWeightEntryService,
  changeWeighEntryService,
  getWeightEntriesService,
  getWeightEntryService,
  removeWeightEntryService,
} from "@/app/services/weight-entry";
import { handleMiddleWareErrors } from "@/app/utils/errors";

// https://nextjs.org/blog/building-apis-with-nextjs
export async function GET(request: Request) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls any data from the body of the request
    const weightEntryId = request.headers.get("weightEntryId");

    // Checks if the header is null which denotes all entries should be pulled
    if (weightEntryId === null) {
      const weightEntries = await getWeightEntriesService(userAccount);

      return new Response(JSON.stringify(weightEntries), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // If the header string is valid, gets the entry associated with the passed in id
      const weightEntry = await getWeightEntryService(
        weightEntryId,
        userAccount,
      );

      return new Response(JSON.stringify(weightEntry), {
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
    const { weightValue, weighInDate } = body;

    await addWeightEntryService(weightValue, weighInDate, userAccount);

    return new Response("Weight Entry Added", {
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
    const { weightEntryId, weightValue, weighInDate } = body;

    await changeWeighEntryService(
      weightEntryId,
      weightValue,
      weighInDate,
      userAccount,
    );

    return new Response("Weight Entry Updated", {
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

export async function DELETE(request: Request) {
  try {
    // Calls the method to get user data from the bearer token in the headers
    const userAccount = await getPayloadData(request);

    // Pulls the needed data from the body of the request
    const body = await request.json();
    const { weightEntryId } = body;

    await removeWeightEntryService(weightEntryId, userAccount);

    return new Response("Weight Entry Deleted", {
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
