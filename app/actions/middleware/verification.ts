"use server"
import bcrypt from "bcrypt";

/**
   * Hashes the passed in password
   *
   * @param {string} userPassword The password string to be encrypted
   */
export async function hashPassword(userPassword: string) {
    const saltRounds = 10;
    const hashPassword = bcrypt.hash(userPassword, saltRounds);
    return hashPassword;
}

/**
   * Compares the encrypted password to the hashed password
   *
   * @param {string} userPassword The password string to be tested
   * @param {hashedPassword} hashedPassword The hashed password to be tested against
   */
export async function checkPassword(userPassword: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(userPassword, hashedPassword);
    return isPasswordValid;
}