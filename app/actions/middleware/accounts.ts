"use server";
import { createUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";
import {
  createUserAccountService,
  validateLoginService,
} from "@/app/services/accounts";

/**
 * Middleware for accessing the database to create a new user account
 * @param userName Username for the account to be created - Must be within 6 - 25 characters
 * @param userPassword Password for the account to be created - Must be within 8 - 30 characters
 * @param confirmPassWord Retying of the password for the account to be created - Must match the userPassword
 * @throws Signals the process failed
 */
export async function createUserAccount(
  userName: string,
  userPassword: string,
  confirmPassWord: string,
): Promise<void> {
  try {
    await createUserAccountService(userName, userPassword, confirmPassWord);
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for validating the user's provided credentials with the values stored in the database.
 * @param userName - Username for the account that will be accessed
 * @param userPassword - Password for comparing against the one associated with the account that will be accessed
 * @throws Signals the process failed
 */
export async function validateLogin(
  userName: string,
  userPassword: string,
): Promise<void> {
  try {
    // Calls the service to validate the user's login.
    const userAccountPayload = await validateLoginService(
      userName,
      userPassword,
    );

    // Calls the method to store the returned user account payload string
    const isCookieStored = await createUserCookie(userAccountPayload);

    // Checks if the account string was successfully stored
    if (isCookieStored) {
      return;
    } else {
      throw new Error("Failed to Login", { cause: errorCausesObj.processFail });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}
