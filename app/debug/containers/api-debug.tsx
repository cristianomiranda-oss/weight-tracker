"use client";
import { useEffect, useRef, useState } from "react";
import LabeledInput from "@/app/components/labeled-input";
import Button from "@/app/components/button";
import { ApiEndPointDebugTests } from "@/app/libs/types";
import { apiEndpointTestHandler } from "../actions/test-handler";
import TestIndicatorDisplay from "../components/test-indicator-display";
import { getUnknownError } from "@/app/utils/errors";
import LoadingIndicator from "@/app/components/loading-indicator";
import { useRouter } from "next/navigation";
import { checkForUserSignIn } from "@/app/libs/cookies";

interface ApiDebugProps {}
/**
 * Launches various fetch calls to the api endpoints and reports their results
 */
export default function ApiDebug({}: ApiDebugProps) {
  const router = useRouter();

  // Loads state vars for api endpoint tests
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [testData, setTestData] = useState<ApiEndPointDebugTests | null>(null);

  // Initializes the input refs
  const userNameInputRef = useRef<HTMLInputElement | null>(null);
  const passWordInputRef = useRef<HTMLInputElement | null>(null);

  async function startTests() {
    // Sets the loading indicator and removes any existing error
    setIsLoading(true);
    setError(null);

    try {
      // Confirms that the inputs are valid for the temporary username and password inputs
      if (
        userNameInputRef.current !== null &&
        passWordInputRef.current !== null
      ) {
        const userName = userNameInputRef.current.value;
        const userPassword = passWordInputRef.current.value;

        const testIndicators = await apiEndpointTestHandler(
          userName,
          userPassword,
        );

        setTestData(testIndicators);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(getUnknownError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Checks if the user has successfully completed the login process before loading the page
   */
  async function checkUserLogin() {
    setIsLoading(true);

    try {
      //Calls the method to check if the user completed the sign in process
      const isUserLoggedIn = await checkForUserSignIn();

      // Checks the user is not logged in
      if (!isUserLoggedIn) {
        // Redirects the user to the accounts page
        router.push("/accounts");
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
      // Clears the loading indicator before calling the function to load weight entries
      setIsLoading(false);
    }
  }

  // Calls the method to check if the user is logged in
  useEffect(() => {
    checkUserLogin();
  }, []);

  // Displays the loading component if any async event is running
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="w-full h-full min-h-fit flex flex-col justify-around overflow-y-auto">
      <div className="h-1/2 overflow-auto border-2 border-black">
        {testData === null ? (
          <p className="text-2xl md:text-4xl">
            Enter a username and password to begin tests
          </p>
        ) : (
          <TestIndicatorDisplay testIndicators={testData} />
        )}
      </div>

      <div className="h-1/2 flex flex-col justify-between items-center gap-0.5">
        <h3>{error?.message}</h3>
        <LabeledInput
          id="Username"
          label="Username"
          inputType="text"
          disabled={isLoading}
          ref={userNameInputRef}
        />
        <LabeledInput
          id="Password"
          label="Password"
          inputType="password"
          disabled={isLoading}
          ref={passWordInputRef}
        />
        <Button onClick={startTests} className="p-3">
          Test
        </Button>
      </div>
    </div>
  );
}
