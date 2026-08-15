import type { ApiEndpointResponse } from "@/app/libs/types";

/**
 * Tests the '/api/connection-test' endpoint GET method
 * @returns Returns a boolean denoting if the test was successful.
 * True if so, false if any it fails to connect or an error occurred
 */
export async function testConnection() {
  try {
    // Calls the test endpoint and retrieves the result
    const creationResult = await fetch("/api/connection-test", {
      method: "GET",
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    if (responseData.message === "Database Connected!") {
      return true;
    } else {
      // Throws an error containing the received message
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
