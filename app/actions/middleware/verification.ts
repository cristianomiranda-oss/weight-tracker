"use server"
import bcrypt from "bcrypt";

export async function hashPassword(userPassword: string) {
    const saltRounds = 10;
    const hashPassword = bcrypt.hash(userPassword, saltRounds);
    return hashPassword;
}

export async function checkPassword(userPassword: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(userPassword, hashedPassword);
    return isPasswordValid;
}