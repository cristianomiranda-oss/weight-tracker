"use server";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";
import { WeightTrackerDataBase } from "../libs/mongodb";

/**
 * Service for accessing the database to create a new user account
 * @param userName Username for the account to be created - Must be within 6 - 25 characters
 * @param userPassword Password for the account to be created - Must be within 8 - 30 characters
 * @param confirmPassWord Retying of the password for the account to be created - Must match the userPassword
 * @throws Signals the process failed
 */
export async function createUserAccountService(
  userName: string,
  userPassword: string,
): Promise<void> {
  try {
    if (userName === "" || userPassword === "") {
      throw new Error("Username and Password cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (userName.length < 6) {
      throw new Error("Username cannot be less than 6 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    } else if (userName.length > 25) {
      throw new Error("Username cannot exceed 25 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (userPassword.length < 8) {
      throw new Error("Password cannot be less than 8 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    } else if (userPassword.length > 30) {
      throw new Error("Password cannot exceed 30 characters", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Calls the CRUD method to create a new account
    const isAccountCreated = await WeightTrackerDataBase.createNewUserAccount(userName, userPassword);

    // Checks if a valid value was returned by the database method
    if (isAccountCreated) {
      // Exits the function as the account was created
      return;
    } else {
      throw new Error("Account Creation failed", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Service for validating the user's provided credentials with the values stored in the database.
 * @param userName - Username for the account that will be accessed
 * @param userPassword - Password for comparing against the one associated with the account that will be accessed
 * @throws Signals the process failed
 * @returns The payload string to be stored
 */
export async function validateLoginService(
  userName: string,
  userPassword: string,
): Promise<string> {
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

    const userAccount = await WeightTrackerDataBase.validateUserAccount(userName, userPassword);

    if (userAccount === null) {
      throw new Error("Username or Password is invalid", {
        cause: errorCausesObj.accessDenied,
      });
    }

    return userAccount;
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}
