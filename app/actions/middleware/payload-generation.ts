"use server";
import { errorCausesObj } from "@/app/libs/errors";
import type { UserPayloadObj } from "@/app/libs/types";
import jwt from "jsonwebtoken";

const secretKey = "TEMPKEY";

/**
 * Encrypts the user payload object in to a string
 *
 * @param {string} userId The id of the user's account to be stored within the encrypted payload object
 * @param {string} userName The userName of the user's account to be stored within the encrypted payload object
 */
export async function getAccountPayload(userId: string, userName: string) {
  const userPayload: UserPayloadObj = { userId, userName };

  // TODO: Replace key with a key from a key file
  const payload = jwt.sign(userPayload, secretKey, {
    // algorithm: "PS256",
    expiresIn: "1h",
  });

  return payload;
}

/**
 * Verifies the payload string, returns the payload string if the string is valid or throws an access denied error if it fails to validate
 *
 * @param {string} payload Payload string that will be verified
 */
export async function verifyAccountPayload(payload: string) {
  try {
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
