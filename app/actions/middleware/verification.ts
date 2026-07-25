"use server"
import bcrypt from "bcrypt";

export async function hashPassword(userPassword: string) {
    const hashPass = await bcrypt.hash(userPassword, 10);
    console.log("Password - ", hashPass);
}