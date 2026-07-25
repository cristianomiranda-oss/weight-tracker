"use server";
import type { UserPayloadObj } from "@/app/libs/types";
import jwt from "jsonwebtoken";

const secretKey = "TEMPKEY"

/**
   * Encrypts the user payload object in to a string 
   *
   * @param {string} userId The id of the user's account to be stored within the encrypted payload object
   * @param {string} userName The userName of the user's account to be stored within the encrypted payload object
   */
export async function getAccountPayload(userId: string, userName: string) {
  const userPayload: UserPayloadObj = {userId, userName}

  // TODO: Replace key with a key from a key file
  const payload = jwt.sign(userPayload, secretKey, {
    // algorithm: "PS256",
    expiresIn: "1h",
  });
  
  return payload;
}

/**
   * Verifies the payload string, returns the payload string if the string is valid and null if it fails the check
   *
   * @param {}
   */
export async function verifyAccountPayload(payload: string) {
  try {
    const isValid = jwt.verify(payload, secretKey, {})
    console.log(isValid);
    return isValid;
  } catch (error) {
    return null;
  }
}

