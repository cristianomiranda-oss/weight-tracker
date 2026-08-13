"use server";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const userAccountKey = "user_account";

/**
 * Stores a new "user_account" cookie and assigned the passed in userId to it.
 * @param userId Value to be stored in the cookie
 * @returns Returns true is successful and false if the process fails
 */
export async function createUserCookie(userAccount: string): Promise<boolean> {
  try {
    // Calls method to access the cookie store
    const cookieStore = await cookies();

    // Converts the number value to a string and stores the new cookie
    cookieStore.set(userAccountKey, userAccount);

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Accesses the "user_account" cookie that is stored in the browser
 * @returns Returns the cookie if the process is successful, otherwise returns null
 */
export async function getUserCookie(): Promise<RequestCookie | null> {
  try {
    // Calls method to access the cookie store
    const cookieStore = await cookies();

    // Converts the number value to a string
    const userCookie = cookieStore.get(userAccountKey);

    if (userCookie === undefined) {
      return null;
    }

    return userCookie;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if the user has a stored user cookie to denote if they have completed the login process.
 * @returns Returns true if the user's account cookie is present and false if no cookie is present or an error occurs while retrieving the cookie
   */
export async function checkForUserSignIn(): Promise<boolean> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Clears the stored user cookie
 */
export async function clearUserCookie() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(userAccountKey);
  } catch (error) {
    console.error("Removing User Cookie - ", error);
  }
}
