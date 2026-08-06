"use server";
import { errorCausesObj } from "@/app/utils/errors";
import type { UserPayloadObj } from "@/app/libs/types";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

/**
 * Encrypts the user payload object in to a string
 *
 * @param {string} userId The id of the user's account to be stored within the encrypted payload object
 * @param {string} userName The userName of the user's account to be stored within the encrypted payload object
 */
export async function getAccountPayload(userId: string, userName: string) {
  if (secretKey === undefined) {
    throw new Error("Server Issue", { cause: errorCausesObj.processFail });
  }

  const userPayload: UserPayloadObj = { userId, userName };

  // TODO: Replace key with a key from a key file
  const payload = jwt.sign(userPayload, secretKey, {
    expiresIn: "1h",
  });

  return payload;
}

/**
 * Verifies the payload string
*
* @param {string} payload Payload string that will be verified
 * @returns Returns the payload string if the string is valid or throws an access denied error if it fails to validate
 */
export async function verifyAccountPayload(payload: string) {
  try {
    if (secretKey === undefined) {
      throw new Error("Server Issue", { cause: errorCausesObj.processFail });
    }

    // Credit: Radu Diță For explaining the need to cast a result as a specific type to define the payload object type
    // https://stackoverflow.com/questions/50735675/typescript-jwt-verify-cannot-access-data
    const payloadObj = jwt.verify(payload, secretKey) as UserPayloadObj;
    return payloadObj;
  } catch (error) {
    throw new Error("Account authorization failed", {
      cause: errorCausesObj.accessDenied,
    });
  }
}

/**
   * Obtains the payload sting from a request's bearer token and decrypts the data
   * @param {Request} request The request containing the bearer token
   */
export async function getPayloadData(request: Request) {
try {
    // Pulls the token from the headers
    const token = request.headers.get("Authorization");

    // Splits the string and stores the payload string
    const bearer = token?.split(" ").at(1);

    // Checks if the payload string is invalid
    if (!bearer) {
      throw new Error("Failed to Acquire Token");
    }

    // Decrypts the payload value
    const userAccount = await verifyAccountPayload(bearer);

    // Returns the decrypted payload
    return userAccount;
  } catch (error) {
    // Throws error to parent
    throw error;
  }
}