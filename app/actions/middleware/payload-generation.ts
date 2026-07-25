"use server";
import type { UserPayloadObj } from "@/app/libs/types";
import jwt from "jsonwebtoken";

const secretKey = "TEMPKEY"

export async function getAccountPayload(userId: string, userName: string) {
  const userPayload: UserPayloadObj = {userId, userName}

  // TODO: Replace key with a key from a key file
  const payload = jwt.sign(userPayload, secretKey, {
    // algorithm: "PS256",
    expiresIn: "1h",
  });
  
  return payload;
}

export async function verifyAccountPayload(payload: string) {
  try {
    const isValid = jwt.verify(payload, secretKey, {})
    console.log(isValid);
    return isValid;
  } catch (error) {
    return null;
  }
}

export async function readAccountPayload(payload: string) {
  const userPayloadObj = jwt.decode(payload);
}
