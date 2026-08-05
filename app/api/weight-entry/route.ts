// Credit: all api calls were created using a pattern by Lee Robinson

import { verifyAccountPayload } from "@/app/libs/payload-generation";
import { getGoalWeightEntryService } from "@/app/services/goal-weight-entry";

// https://nextjs.org/blog/building-apis-with-nextjs
export async function GET(request: Request) {
  try {
    // Pulls the token from the headers
    const token = request.headers.get("Authorization");

    // Splits the string and stores the payload string
    const bearer = token?.split(" ").at(1);
    
    // Checks if the payload string is invalid
    if (!bearer) {
      throw new Error("Unauthorized");
    }

    // Decrypts the payload value
    const userAccount = await verifyAccountPayload(bearer);

    const test = await getGoalWeightEntryService(userAccount)

    return new Response(JSON.stringify(test), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weight-Entry GET: ", error);
    return new Response(JSON.stringify({ message: "POST Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    return new Response("POST endpoint accessed", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weight-Entry POST: ", error);
    return new Response(JSON.stringify({ message: "POST Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    return new Response("PUT endpoint accessed", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weight-Entry PUT: ", error);
    return new Response(JSON.stringify({ message: "POST Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    return new Response("DELETE endpoint accessed", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weight-Entry DELETE: ", error);
    return new Response(JSON.stringify({ message: "POST Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
