"use client";

import Button from "@/app/components/button";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface AccountFormProps {
  validateLogin: (userName: string, userPassword: string) => Promise<void>;
  createUserAccount: (
    userName: string,
    userPassword: string,
    confirmPassWord: string,
  ) => Promise<void>;
}

/**
 * Contains the components for displaying the account sign in and account creation interface and
 * handles interactions made with the interface.
 */
export default function AccountForm({
  validateLogin,
  createUserAccount,
}: AccountFormProps): React.JSX.Element {
  // Initializes a router to allow for navigation
  const router = useRouter();

  // Initializes a state flag for denoting which screen is active
  const [isAccountCreationEnabled, setIsAccountCreationEnabled] =
    useState<boolean>(false);

  // Initializes state for storing the loading flag and error messages
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initializes various references to the html input elements in the form
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const userPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPassWordRef = useRef<HTMLInputElement | null>(null);

  /**
   * Changes the current screen to reveal the necessary elements for either the account sign in or account creation screens.
   * Change does not occur if any function call is already loading.
   */
  function toggleAccountCreation(): void {
    // Only swaps screens if no calls are loading
    if (!isLoading) {
      setIsAccountCreationEnabled((curr) => !curr);
    }
  }

  /**
   * Handles the submission of the form based on the current active screen.
   *
   * @param e The data associated with the submit event
   */
  async function submitForm(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    try {
      // Prevents the form submission event
      e.preventDefault();

      // Sets the loading boolean and clears the current error message
      setIsLoading(true);
      setErrorMessage("");

      // Checks the currently active screen
      if (isAccountCreationEnabled) {
        // Account Creation Screen
        // Checks that confirmPassword ref to associated text input is established
        if (
          userNameRef.current !== null &&
          userPasswordRef.current !== null &&
          confirmPassWordRef.current !== null
        ) {
          // Calls the user account creation method
          await createUserAccount(
            userNameRef.current.value,
            userPasswordRef.current.value,
            confirmPassWordRef.current.value,
          );

          // Toggles the current screen to change to the sign in screen
          toggleAccountCreation();

          // Clears text inputs
          userNameRef.current.value = "";
          userPasswordRef.current.value = "";
          confirmPassWordRef.current.value = "";
        }
      } else {
        // Account Sign In Screen
        // Checks that the username and password input refs are established
        if (userNameRef.current !== null && userPasswordRef.current !== null) {
          // Calls the method to validate the user's login
          // If no errors are thrown the function continues
          await validateLogin(
            userNameRef.current.value,
            userPasswordRef.current.value,
          );

          // Navigates to the home page
          router.push("/");

          // Clears text inputs
          userNameRef.current.value = "";
          userPasswordRef.current.value = "";
        }
      }
    } catch (error) {
      // Checks if the error is an established error
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        // Indicates an unusual error has occurred
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      // Changes the loading boolean to indicate the function is no longer running.
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
