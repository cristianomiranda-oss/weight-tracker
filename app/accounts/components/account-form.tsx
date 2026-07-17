"use client";

import Button from "@/app/components/button";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface AccountFormProps {
    validateLogin: (userName: string, userPassword: string) => Promise<void>
}

export default function AccountForm({validateLogin}: AccountFormProps) {
  const router = useRouter();
  const [isAccountCreationEnabled, setIsAccountCreationEnabled] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userNameRef = useRef<HTMLInputElement | null>(null);
  const userPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPassWordRef = useRef<HTMLInputElement | null>(null);

  function toggleAccountCreation() {
    // Only swaps screens if no calls are loading
    if (!isLoading) {
      setIsAccountCreationEnabled((curr) => !curr);
    }
  }

  async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
    try {
        // Prevents the form submission event
      e.preventDefault();

      // Sets the loading boolean and clears the current error message
      setIsLoading(true);
      setErrorMessage("");


      if (isAccountCreationEnabled) {
      } else {
        if (userNameRef.current !== null && userPasswordRef.current !== null) {
            await validateLogin(userNameRef.current.value, userPasswordRef.current.value);
            router.push("/");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <form
      className="w-full h-full flex flex-col justify-around items-center"
      onSubmit={(e) => submitForm(e)}
    >
      <h2 className="text-5xl md:text-6xl">
        {isAccountCreationEnabled ? "Create Account" : "Sign In"}
      </h2>

      <h3 className="text-3xl text-red-700 text-center">{errorMessage}</h3>

      <LabeledInput
        id="userName"
        label="Username"
        inputType="text"
        disabled={isLoading}
        ref={userNameRef}
      />
      <LabeledInput
        id="passWord"
        label="Password"
        inputType="password"
        disabled={isLoading}
        ref={userPasswordRef}
      />
      {isAccountCreationEnabled && (
        <LabeledInput
          id="confirmPassWord"
          label="Confirm Password"
          inputType="password"
          disabled={isLoading}
          ref={confirmPassWordRef}
        />
      )}

      {!isAccountCreationEnabled && (
        <>
          <SubmitButton disabled={isLoading}>Login</SubmitButton>
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
          <SubmitButton disabled={isLoading}>Create Account</SubmitButton>
          <Button type="warning" onClick={toggleAccountCreation}>
            Cancel
          </Button>
        </>
      )}
    </form>
  );
}
