// Credit: all api calls were created using a pattern by Lee Robinson
// https://nextjs.org/blog/building-apis-with-nextjs

import {
  createUserAccountService,
  validateLoginService,
} from "@/app/services/accounts";
import { handleMiddleWareErrors } from "@/app/utils/errors";

export async function GET(request: Request) {
  try {
    const userName = request.headers.get("userName");
    const userPassword = request.headers.get("userPassword");

    if (userName === null || userPassword === null) {
      throw new Error("Invalid userName and userPassword headers");
    }

    const userAccountData = await validateLoginService(userName, userPassword);

    return new Response(userAccountData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(JSON.stringify({ error: errorToSend }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userName, userPassword } = body;

    // Passes in the passed in parameters
    await createUserAccountService(userName, userPassword);

    return new Response("POST endpoint accessed", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToSend = handleMiddleWareErrors(error);
    return new Response(JSON.stringify({ error: errorToSend }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
