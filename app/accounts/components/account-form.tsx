"use client";

import {
  createUserAccount,
  validateLogin,
} from "@/app/actions/middleware/accounts";
import Button from "@/app/components/button";
import ErrorDisplay from "@/app/components/error-display";
import LabeledInput from "@/app/components/labeled-input";
import LoadingIndicator from "@/app/components/loading-indicator";
import SubmitButton from "@/app/components/submit-button";
import { clearUserCookie } from "@/app/libs/cookies";
import { EntriesSessionStorage } from "@/app/libs/session-storage";
import { errorCausesObj, getUnknownError } from "@/app/utils/errors";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Contains the components for displaying the account sign in and account creation interface and
 * handles interactions made with the interface.
 */
export default function AccountForm(): React.JSX.Element {
  // Initializes a router to allow for navigation
  const router = useRouter();

  // Initializes a state flag for denoting which screen is active
  const [isAccountCreationEnabled, setIsAccountCreationEnabled] =
    useState<boolean>(false);

  // Initializes state for storing the loading flag and error
  const [error, setError] = useState<Error | null>(null);
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
      // Checks if the account creation refs or the account sign-in refs are loaded
      if (
        isAccountCreationEnabled &&
        userNameRef.current !== null &&
        userPasswordRef.current !== null &&
        confirmPassWordRef.current !== null
      ) {
        // Clears all ref values
        userNameRef.current.value = "";
        userPasswordRef.current.value = "";
        confirmPassWordRef.current.value = "";
      } else if (
        !isAccountCreationEnabled &&
        userNameRef.current !== null &&
        userPasswordRef.current !== null
      ) {
        // Clears all ref values
        userNameRef.current.value = "";
        userPasswordRef.current.value = "";
      }

      // Resets all necessary state values
      setIsLoading(false);
      setError(null);
      setIsAccountCreationEnabled((curr) => !curr);
    }
  }

  /**
   * Handles the submission of the form based on the current active screen.
   *
   * @param e The data associated with the submit event
   */
  async function handleFormSubmission(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    try {
      // Prevents the form submission event
      e.preventDefault();

      // Sets the loading boolean and clears the current error message
      setIsLoading(true);
      setError(null);

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
        setError(error);
      } else {
        // Indicates an unusual error has occurred
        setError(getUnknownError());
      }
    } finally {
      // Changes the loading boolean to indicate the function is no longer running.
      setIsLoading(false);
    }
  }

  // Clears any user data on page launch
  useEffect(() => {
    async function clearUserData() {
      setIsLoading(true);

      try {
        // Calls the methods to clear user data upon loading the homepage
        EntriesSessionStorage.clearCachedWeightEntryArray();
        await clearUserCookie();
      } catch (error) {
        // Checks if the error is an established error
        if (error instanceof Error) {
          setError(error);
        } else {
          // Indicates an unusual error has occurred
          setError(getUnknownError());
        }
      } finally {
        setIsLoading(false);
      }
    }

    clearUserData();
  }, []);

  if (
    error?.cause !== errorCausesObj.invalidParameterValue &&
    error?.cause !== errorCausesObj.invalidComparison &&
    error?.cause !== errorCausesObj.accessDenied &&
    error !== null
  ) {
    return <ErrorDisplay error={error} router={router} />;
  }

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <form
        className="w-full h-full min-h-min flex flex-col justify-around items-center gap-1"
        onSubmit={(e) => handleFormSubmission(e)}
      >
        <h2 className="text-5xl md:text-6xl">
          {isAccountCreationEnabled ? "Create Account" : "Sign In"}
        </h2>

        {error !== null && (
          <h3 className="text-3xl text-red-700 text-center">{error.message}</h3>
        )}

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
          <div className="w-3/4 md:w-3/5 h-26 flex flex-col justify-around items-center">
            <SubmitButton className="w-full h-12" disabled={isLoading}>
              Login
            </SubmitButton>
            <p className="w-full text-md text-center">
              New User?{" "}
              <span
                className="text-blue-600 cursor-pointer select-none"
                onClick={toggleAccountCreation}
              >
                Create New Account
              </span>
            </p>
          </div>
        )}

        {isAccountCreationEnabled && (
          <div className="w-3/4 md:w-3/5 h-26 flex flex-col justify-around items-center">
            <SubmitButton className="w-full h-12" disabled={isLoading}>
              Create Account
            </SubmitButton>
            <Button
              className="w-full h-12"
              type="warning"
              onClick={toggleAccountCreation}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
