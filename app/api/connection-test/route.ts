// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import { WeightTrackerDataBase } from "@/app/libs/mongodb";
import { handleMiddleWareErrors } from "@/app/utils/errors";

export async function GET(request: Request) {
  try {
    const connectionTest = await WeightTrackerDataBase.testDbConnection();

    return new Response(connectionTest, {
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
