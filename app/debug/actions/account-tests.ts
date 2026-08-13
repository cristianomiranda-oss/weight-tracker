import type {
  ApiEndPointDebugTests,
  ApiEndpointResponse,
} from "@/app/libs/types";
import { FilterTests } from "@/app/utils/regex";

/**
 * Tests the '/api/account' endpoint GET method
 * @returns Returns the received token string if successful or null if login failed or an error occurred.
 */
async function testAccountLogin(tempUserName: string, tempPassword: string) {
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
async function testAccountCreation(tempUserName: string, tempPassword: string) {
  try {
    // Checks the passed in username and password before running test
    FilterTests.validateUserName(tempUserName);
    FilterTests.validatePassword(tempPassword);

    const userData = {
      userName: tempUserName,
      // userPassword: tempPassword,
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

/**
   * Tests all account endpoints. Attempts to register and login to a new account.
   * If registration fails the login test is skipped. 
   * @param endPointTestIndicators The object containing the test indicators that will be updated based on the results of the tests
   * @param userName The username for the temporary account 
   * @param userPassword The password for the temporary account 
   * @returns Returns a valid token if both tests succeed or returns null if either test fails 
   */
export async function testAccountsEndpoint(
  endPointTestIndicators: ApiEndPointDebugTests,
  userName: string,
  userPassword: string,
) {
  // Runs the first test for user registration
  const isRegistrationSuccessful = await testAccountCreation(
    userName,
    userPassword,
  );
  // Checks if the test was successful
  if (isRegistrationSuccessful) {
    // Updates the test indicator as a success and continues to the next test
    endPointTestIndicators.accountCreation = "Account Creation Succeeded";
  } else {
    // Updates the indicator as a fail and returns the object to prevent any further testing
    endPointTestIndicators.accountCreation = "Account Creation Failed";
    return null;
  }

  // Runs the login test
  const userToken = await testAccountLogin(userName, userPassword);

  // Checks if the test was successful
  if (userToken !== null) {
    // Updates the test indicator as a success
    endPointTestIndicators.accountLogin = "Account Login Succeeded";
    return userToken;
  } else {
    // Updates the indicator as a fail
    endPointTestIndicators.accountLogin = "Account Login Failed";
    return null;
  }
}
