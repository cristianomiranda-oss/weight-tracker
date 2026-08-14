// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import { validateLoginService } from "@/app/services/accounts";
import {
  errorCausesObj,
  getServerResponseStatus,
  handleMiddleWareErrors,
} from "@/app/utils/errors";

/**
 * POST Method: Returns encrypted payload if the passed in credentials are verified.
 *
 * Headers:
 *
 * "userName" - Must be between 6 and 25 characters and only include letters, digits, "-", or "_".
 *
 *  "userPassword" - - Must be between 8 and 30 characters and only include letters, digits, and any '_-?!@#$%^&*' character.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userName, userPassword } = body;

    if (userName === undefined || userPassword === undefined) {
      throw new Error("Username or userPassword is missing from the body", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const userAccountData = await validateLoginService(userName, userPassword);

    // Initializes the body of the return message
    const responseBody = JSON.stringify({
      message: "Sign In Approved",
      userAccountData,
    });

    return new Response(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    let status = getServerResponseStatus(error);

    return new Response(
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
