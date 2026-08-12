"use server";
import { errorCausesObj } from "@/app/utils/errors";
import { WeightTrackerDataBase } from "../libs/mongodb";
import { FilterTests } from "../utils/regex";

/**
 * Service for accessing the database to create a new user account
 * @param userName Username for the account to be created - Must be within 6 - 25 characters
 * @param userPassword Password for the account to be created - Must be within 8 - 30 characters
 * @throws Signals the process failed
 */
export async function createUserAccountService(
  userName: string,
  userPassword: string,
): Promise<void> {
  try {
    // Tests the username and throws an error if it is invalid
    FilterTests.validateUserName(userName);

    // Test the password and throws an error if it is invalid
    FilterTests.validatePassword(userPassword);

    // Calls the CRUD method to create a new account
    const isAccountCreated = await WeightTrackerDataBase.createNewUserAccount(
      userName,
      userPassword,
    );

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
    // Throws error to the parent function
    throw error;
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
    // Tests the username and throws an error if it is invalid
    FilterTests.validateUserName(userName);

    // Test the password and throws an error if it is invalid
    FilterTests.validatePassword(userPassword);

    const userAccount = await WeightTrackerDataBase.validateUserAccount(
      userName,
      userPassword,
    );

    if (userAccount === null) {
      throw new Error("Username or Password is invalid", {
        cause: errorCausesObj.accessDenied,
      });
    } else {
      return userAccount;
    }
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}

/**
 * DEBUG: Service for removing a user entry if the provided credentials match with the values stored in the database.
 * @param userName - Username for the account that will be accessed
 * @param userPassword - Password for comparing against the one associated with the account that will be accessed
 * @throws Signals the process failed
 */
export async function removeUserAccount(
  userName: string,
  userPassword: string,
) {
  try {
    // Tests the username and throws an error if it is invalid
    FilterTests.validateUserName(userName);

    // Test the password and throws an error if it is invalid
    FilterTests.validatePassword(userPassword);

    const userAccount = await WeightTrackerDataBase.deleteUserAccount(
      userName,
      userPassword,
    );

    if (userAccount === null) {
      throw new Error("Username or Password is invalid", {
        cause: errorCausesObj.accessDenied,
      });
    }

    return;
  } catch (error) {
    // Throws error to the parent function
    throw error;
  }
}
