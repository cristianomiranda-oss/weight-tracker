"use client";
import { createUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";
import { IndexedDB } from "@/app/libs/indexedDB";
import { createUserAccountService } from "@/app/services/accounts";

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
    if (userName === "" || userPassword === "") {
      throw new Error("Username and Password cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (userName.length < 6 || userName.length > 25) {
      throw new Error("Username is invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (userPassword.length < 8 || userPassword.length > 30) {
      throw new Error("Password is invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const userId = await IndexedDB.validateUserAccount(userName, userPassword);

    if (userId === null) {
      throw new Error("Username or Password is invalid", {
        cause: errorCausesObj.accessDenied,
      });
    }

    const isCookieStored = await createUserCookie(userId);

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
