"use server";
import type { UserAccount } from "@/app/libs/types";
import jwt from "jsonwebtoken";

export async function getAccountPayload(userAccount: UserAccount) {
  // TODO: Replace key with a string from an env file
  const payload = jwt.sign(userAccount, "TEMPKEY", {
    // algorithm: "RS256",
    expiresIn: "1h",
  });
  console.log("Payload - ", payload);
}
