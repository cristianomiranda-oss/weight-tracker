"use client"
import type { ApiEndpointResponse } from "@/app/libs/types";
import { FilterTests } from "@/app/utils/regex";

/**
 * Tests the '/api/account' endpoint GET method
 * @returns Returns the received token string if successful or null if login failed or an error occurred.
 */
export async function testAccountLogin(tempUserName: string, tempPassword: string) {
  try {
    // Checks the passed in username and password before running test
    FilterTests.validateUserName(tempUserName);
    FilterTests.validatePassword(tempPassword);

    // Initializes the request's headers
    const userDataHeaders = {
      userName: tempUserName,
      userPassword: tempPassword,
    };
    const headers = {
      "Content-Type": "application/json",
      ...userDataHeaders,
    };

    const creationResult = await fetch("/api/accounts", {
      method: "GET",
      headers: headers,
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    // Checks if the appropriate message and token was received
    if (
      responseData.message === "Sign In Approved" &&
      responseData.userAccountData !== undefined
    ) {
      return responseData.userAccountData;
    } else {
      // Throws an error containing the received message
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Tests the '/api/account' endpoint POST method
 * @returns Returns a boolean denoting if the test was successful.
 * True if successful, false if creation failed or an error occurred
 */
export async function testAccountCreation(tempUserName: string, tempPassword: string) {
  try {
    // Checks the passed in username and password before running test
    FilterTests.validateUserName(tempUserName);
    FilterTests.validatePassword(tempPassword);

    const userData = {
      userName: tempUserName,
      userPassword: tempPassword,
    };

    const creationResult = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = (await creationResult.json()) as ApiEndpointResponse;

    if (responseData.message === "Account Created") {
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
