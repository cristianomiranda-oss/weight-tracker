"use server";
import bcrypt from "bcrypt";

/**
 * Hashes the passed in password
 *
 * @param userPassword The password string to be encrypted
 */
export async function hashPassword(userPassword: string) {
  const salt = await bcrypt.genSalt(12);
  const hashPassword = bcrypt.hash(userPassword, salt);

  return hashPassword;
}

/**
 * Compares the encrypted password to the hashed password
 *
 * @param userPassword The password string to be tested
 * @param hashedPassword The hashed password to be tested against
 */
export async function checkPassword(
  userPassword: string,
  hashedPassword: string,
) {
  const isPasswordValid = await bcrypt.compare(userPassword, hashedPassword);
  return isPasswordValid;
}
