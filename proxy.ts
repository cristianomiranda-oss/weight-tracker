import { verifyAccountPayload } from "@/app/libs/payload-generation";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  try {
    // Checks if the api request is for the accounts api call
    if (req.nextUrl.pathname === "/api/accounts") {
      // Approves the connection as no token is needed
      return NextResponse.next();
    }

    // Pulls the token from the headers
    const token = req.headers.get("Authorization");

    // Splits the string and stores the payload string
    const bearer = token?.split(" ").at(1);

    // Checks if the payload string is invalid
    if (!bearer) {
      throw new Error("Unauthorized");
    }

    // Attempts to decrypt the payload value, an error is thrown if it is invalid
    await verifyAccountPayload(bearer);

    // If the function continues, then the payload is valid
    return NextResponse.next();
  } catch (error) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  matcher: "/api/:path*",
};
