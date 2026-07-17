"use client";

import Button from "@/app/components/button";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountForm() {
  const router = useRouter();
  const [isAccountCreationEnabled, setIsAccountCreationEnabled] =
    useState<boolean>(false);
  const toggleAccountCreation = () =>
    setIsAccountCreationEnabled((curr) => !curr);

  function navigateToHome(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <form
      className="w-full h-full flex flex-col justify-around items-center"
      onSubmit={(e) => navigateToHome(e)}
    >
      <h2 className="text-5xl md:text-6xl">
        {isAccountCreationEnabled ? "Create Account" : "Sign In"}
      </h2>

      <LabeledInput id="userName" label="Username" inputType="text" />
      <LabeledInput id="passWord" label="Password" inputType="password" />
      {isAccountCreationEnabled && (
        <LabeledInput
          id="confirmPassWord"
          label="Confirm Password"
          inputType="password"
        />
      )}

      {!isAccountCreationEnabled && (
        <>
          <SubmitButton>Login</SubmitButton>
          <p>
            New User?{" "}
            <span
              className="text-blue-600 cursor-pointer select-none"
              onClick={toggleAccountCreation}
            >
              Create New Account
            </span>
          </p>
        </>
      )}

      {isAccountCreationEnabled && (
        <>
          <SubmitButton>Create Account</SubmitButton>
          <Button type="warning" onClick={toggleAccountCreation}>
            Cancel
          </Button>
        </>
      )}
    </form>
  );
}
